import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import type { ChessPieceTypeValue } from "../../constants";
import { v4 as uuidv4 } from "uuid";
import { ControlContext, AlertContext } from "../../contexts";
import Square from "../Square";
import Alert from "../Alert";
import { checkIsSolved, checkIsAttacking, MODE_TYPE } from "../../constants";
import { delay } from "../../utils";
import Button from "../../common/button";

import celebration1 from "../../assets/celebration1.gif";

const memoizedCheckIsSolved = (() => {
  const cache: Record<string, boolean> = {};

  return (chessPieceType: ChessPieceTypeValue, positions: number[]) => {
    if (positions.length === 0) {
      return false;
    }
    const cacheKey =
      chessPieceType +
      positions
        .slice()
        .sort((a, b) => a - b)
        .join("");
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
      return cache[cacheKey];
    }
    const computed = checkIsSolved(chessPieceType, positions);
    cache[cacheKey] = computed;
    return computed;
  };
})();

const Chessboard: React.FC = () => {
  const { boardSize, mode, chessPieceType, isSimulating, toggleSimulation, simulationSpeed } =
    useContext(ControlContext);
  const { alert, showAlertMessage } = useContext(AlertContext);

  const normalizedBoardSize = Number(boardSize);

  const cancelSimulation = useRef(false);
  const isInitialRender = useRef(true);
  const isAutomaticallyStopped = useRef(false);

  const [queenPositions, setQueenPositions] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [solutions, setSolutions] = useState<number[][]>([]);

  const [isReset, setIsReset] = useState(false);

  // Collapsible right drawer (collapsed by default)
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);

  // Simulation stats for the timeline/counter display
  const [simulationStats, setSimulationStats] = useState({
    currentRow: 0,
    currentCol: 0,
    placedCount: 0,
    backtracks: 0,
    nodesExplored: 0,
  });

  const startSimulation = function () {
    // Reset simulation stats at start
    setSimulationStats({
      currentRow: 0,
      currentCol: 0,
      placedCount: 0,
      backtracks: 0,
      nodesExplored: 0,
    });

    function getAllSolutions(rows: number, columns: number): Promise<number[][]> {
      return new Promise(function (resolve, reject) {
        if (rows <= 0) {
          resolve([[]]);
        } else {
          getSolution(rows - 1, columns)
            .then(function (solutions) {
              resolve(solutions);
            })
            .catch(function (error) {
              reject(error);
            });
        }
      });
    }

    function getSolution(rows: number, columns: number): Promise<number[][]> {
      return new Promise(function (resolve, reject) {
        const newSolutions: number[][] = [];
        getAllSolutions(rows, columns)
          .then(async function (prevSolutions) {
            for (const solution of prevSolutions) {
              if (cancelSimulation.current) {
                break;
              }

              for (let column = 0; column < columns; column++) {
                if (cancelSimulation.current) {
                  break;
                }
                const position = (rows + 1) * 10 + (column + 1);
                const newQueenPositions = [...queenPositions, ...solution, position];
                setQueenPositions(newQueenPositions);

                // Update simulation stats
                setSimulationStats((prev) => ({
                  ...prev,
                  currentRow: rows + 1,
                  currentCol: column + 1,
                  nodesExplored: prev.nodesExplored + 1,
                  placedCount: newQueenPositions.length,
                }));

                if (!checkIsAttacking(chessPieceType.value as ChessPieceTypeValue, position, solution)) {
                  const result = solution.concat([position]);
                  newSolutions.push(result);

                  if (result.length === columns) {
                    setSolutions((prevState) => {
                      return Array.from(new Map([...prevState, result].map((s) => [s.join(), s])).values());
                    });
                  }
                } else {
                  // Track backtrack when we hit a conflict
                  setSimulationStats((prev) => ({
                    ...prev,
                    backtracks: prev.backtracks + 1,
                  }));
                }
                await delay(simulationSpeed);
              }
            }
            if (cancelSimulation.current) {
              throw new Error("Simulation Stopped");
            } else {
              resolve([...newSolutions]);
            }
          })
          .catch(function (error) {
            reject(error);
          });
      });
    }

    getAllSolutions(normalizedBoardSize, normalizedBoardSize)
      .then(function (result) {
        // to prevent running useEffect cb on simulation end
        isAutomaticallyStopped.current = true;
        // set queen positions to last result
        const last = result[result.length - 1];
        if (last) {
          setQueenPositions([...last]);
        }
        // toggle reset state
        setIsReset(false);
        // toggle isSimulating
        toggleSimulation();
      })
      .catch(function (error) {
        //console.log(error, typeof error, error.message);
        showAlertMessage({
          message: `${error.message}`,
          variant: "warning",
        });
        cancelSimulation.current = false;
        resetAllState();
      });
  };

  useEffect(
    function () {
      if (!isInitialRender.current) {
        resetAllState();
      }
    },
    [normalizedBoardSize, mode, chessPieceType.value]
  );

  useEffect(() => {
    if (isSimulating) {
      function onVisibilityChange() {
        if (isSimulating) {
          console.log(document.visibilityState);
          if (document.visibilityState !== "visible") {
            toggleSimulation();
          }
        }
      }

      document.addEventListener("visibilitychange", onVisibilityChange);

      return function () {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }
  }, [toggleSimulation, isSimulating]);

  useEffect(
    function () {
      if (!isInitialRender.current) {
        if (isSimulating) {
          cancelSimulation.current = false;
          resetAllState();
        }

        if (!isSimulating && !cancelSimulation.current && !isAutomaticallyStopped.current) {
          cancelSimulation.current = true;
        }

        if (isAutomaticallyStopped.current) {
          isAutomaticallyStopped.current = false;
        }
      }
    },
    [isSimulating]
  );

  useEffect(
    function () {
      if (!isInitialRender.current) {
        if (isSimulating && isReset) {
          startSimulation();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isReset, isSimulating]
  );

  useEffect(function () {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, []);

  const sizeArr = useMemo(() => {
    const arr: [number, number, string][] = [];
    for (let i = 1; i <= normalizedBoardSize; i++) {
      for (let j = 1; j <= normalizedBoardSize; j++) {
        arr.push([j, i, uuidv4()]);
      }
    }
    return arr;
  }, [normalizedBoardSize]);

  const handleUpdateQueenPosition = function (isQueenPlaced: boolean, position: number) {
    let positions: number[];
    if (isQueenPlaced) {
      positions = queenPositions.filter((x) => x !== position);
    } else {
      positions = [...new Set([...queenPositions, position])];
    }
    const checkIsProblemSolved = memoizedCheckIsSolved(chessPieceType.value as ChessPieceTypeValue, positions);

    if (checkIsProblemSolved && positions.length === normalizedBoardSize) {
      setQueenPositions(positions);
      setIsSolved(true);
      setSolutions(Array.from(new Map([...solutions, [...positions]].map((s) => [s.join(), s])).values()));
    } else {
      setQueenPositions(positions);
      setIsSolved(false);
    }
  };

  const handleResetChessBoard = function () {
    setQueenPositions([]);
    setIsSolved(false);
    setIsPreview(false);
  };
  const resetAllState = function () {
    setQueenPositions([]);
    setIsSolved(false);
    setIsPreview(false);
    setSolutions([]);
    setIsReset(true);
  };

  const handleListClick = function (e: React.MouseEvent<HTMLLIElement>) {
    const solutionKey = e.currentTarget.dataset.solutionKey ?? null;
    if (solutionKey !== null) {
      const idx = Number(solutionKey);
      const sol = solutions[idx];
      if (!sol) return;
      setQueenPositions([...sol]);
      setIsSolved(false);
      setIsPreview(true);
    }
  };

  return (
    <Container $boardSize={normalizedBoardSize}>
      <BoardStage>
        <ChessBoardContainer>
          <ChessBoard
            $isDisabled={isSolved || isPreview || isSimulating || mode === MODE_TYPE.simulation}
            $boardSize={normalizedBoardSize}
          >
            {sizeArr.map(([x, y, key]) => {
              return (
                <Square
                  key={key}
                  isOdd={x % 2 === y % 2} // true -> white | black
                  updatePosition={handleUpdateQueenPosition}
                  position={y * 10 + x}
                  positions={queenPositions}
                  isPlaced={queenPositions.includes(Number(y + "" + x))}
                  chessPieceType={chessPieceType}
                  boardSize={normalizedBoardSize}
                  showAlertMessage={showAlertMessage}
                />
              );
            })}
          </ChessBoard>

          <CelebarationEl $boardSize={normalizedBoardSize}>
            {(isSolved || isPreview) && mode !== MODE_TYPE.simulation && (
              <StyledButton onClick={handleResetChessBoard}>Play Again</StyledButton>
            )}
            {isSolved && (
              <img
                src={celebration1}
                alt="celebration"
              />
            )}
          </CelebarationEl>
        </ChessBoardContainer>

        {/* Simulation Status Strip - shown during simulation */}
        <AnimatePresence>
          {(isSimulating || mode === MODE_TYPE.simulation) && (
            <SimulationStatusStrip
              as={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <StatusItem>
                <StatusLabel>Row</StatusLabel>
                <StatusValue>{simulationStats.currentRow || "-"}</StatusValue>
              </StatusItem>
              <StatusDivider />
              <StatusItem>
                <StatusLabel>Col</StatusLabel>
                <StatusValue>{simulationStats.currentCol || "-"}</StatusValue>
              </StatusItem>
              <StatusDivider />
              <StatusItem>
                <StatusLabel>Placed</StatusLabel>
                <StatusValue $accent>{simulationStats.placedCount}</StatusValue>
              </StatusItem>
              <StatusDivider />
              <StatusItem>
                <StatusLabel>Backtracks</StatusLabel>
                <StatusValue $warning>{simulationStats.backtracks}</StatusValue>
              </StatusItem>
              <StatusDivider />
              <StatusItem>
                <StatusLabel>Explored</StatusLabel>
                <StatusValue>{simulationStats.nodesExplored}</StatusValue>
              </StatusItem>
              <StatusDivider />
              <StatusItem>
                <StatusLabel>Solutions</StatusLabel>
                <StatusValue $success>{solutions.length}</StatusValue>
              </StatusItem>
            </SimulationStatusStrip>
          )}
        </AnimatePresence>
      </BoardStage>

      <DrawerToggle
        type="button"
        aria-label={isSolutionsOpen ? "Close solutions drawer" : "Open solutions drawer"}
        aria-expanded={isSolutionsOpen}
        onClick={() => setIsSolutionsOpen((v) => !v)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line
            x1="3"
            y1="12"
            x2="21"
            y2="12"
          ></line>
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
          ></line>
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
          ></line>
        </svg>
        {solutions.length > 0 && <Badge>{solutions.length}</Badge>}
      </DrawerToggle>

      <AnimatePresence initial={false}>
        {isSolutionsOpen && (
          <SolutionsDrawer
            aria-label="Solutions drawer"
            as={motion.aside}
            initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 20, filter: "blur(6px)" }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <SolutionsHeader>
              <h2>Solutions</h2>
              <HeaderRight>
                <CountPill title="Unique solutions found">{solutions.length}</CountPill>
                <CloseButton
                  type="button"
                  aria-label="Close"
                  onClick={() => setIsSolutionsOpen(false)}
                >
                  ×
                </CloseButton>
              </HeaderRight>
            </SolutionsHeader>

            <SolutionsList>
              {solutions.length === 0 ? (
                <EmptyState>
                  <strong>No solutions yet.</strong>
                  <span>Run simulation or solve manually to add solutions.</span>
                </EmptyState>
              ) : (
                <ul>
                  {solutions.map((s, i) => {
                    return (
                      <li
                        data-solution-key={i}
                        key={s.join(",")}
                        onClick={handleListClick}
                      >
                        <SolutionIndex>#{i + 1}</SolutionIndex>
                        <SolutionText>{s.join(",")}</SolutionText>
                      </li>
                    );
                  })}
                </ul>
              )}
            </SolutionsList>
          </SolutionsDrawer>
        )}
      </AnimatePresence>

      {alert.message && <Alert variant={alert.variant}>{alert.message}</Alert>}
    </Container>
  );
};

export default Chessboard;

const Container = styled.div<{ $boardSize: number }>`
  position: relative;

  display: grid;
  grid-template-columns: 1fr;
  gap: 1.6rem;

  margin: 1rem;
  margin-top: 3.5rem;
  height: max-content;
`;

const BoardStage = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  gap: 1rem;
`;

// Simulation Status Strip components
const SimulationStatusStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  flex-wrap: wrap;

  padding: 0.75rem 1.2rem;
  border-radius: 14px;

  background: rgba(10, 12, 16, 0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);

  @media (max-width: 600px) {
    gap: 0.4rem;
    padding: 0.6rem 0.8rem;
  }
`;

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  min-width: 48px;
`;

const StatusLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.04em;

  @media (max-width: 600px) {
    font-size: 0.7rem;
  }
`;

const StatusValue = styled.span<{ $accent?: boolean; $warning?: boolean; $success?: boolean }>`
  font-size: 1.35rem;
  font-weight: 800;
  color: ${({ $accent, $warning, $success }) =>
    $accent
      ? "rgba(1, 173, 228, 1)"
      : $warning
        ? "rgba(255, 170, 50, 1)"
        : $success
          ? "rgba(34, 197, 94, 1)"
          : "rgba(255, 255, 255, 0.92)"};

  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const StatusDivider = styled.div`
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.12);
  margin: 0 0.3rem;

  @media (max-width: 600px) {
    height: 20px;
  }
`;

const ChessBoardContainer = styled.div`
  position: relative;
  border-radius: 18px;
  overflow: hidden;

  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 22px 65px rgba(0, 0, 0, 0.45);
`;

const DrawerToggle = styled.button`
  /* Ensure this is always treated as a native button (not an anchor) */
  appearance: none;
  -webkit-appearance: none;

  /* Reset potential global button styles */
  border: 0;
  margin: 0;
  outline: none;
  font: inherit;
  letter-spacing: inherit;
  text-shadow: none;
  white-space: nowrap;

  position: absolute;
  top: 0;
  right: 0;
  z-index: 35;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  padding: 0.85rem;
  border-radius: 12px;

  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(10, 12, 16, 0.65);
  backdrop-filter: blur(12px);

  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);

  transition:
    transform 140ms ease,
    background 140ms ease,
    border-color 140ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(10, 12, 16, 0.78);
    border-color: rgba(255, 255, 255, 0.22);
  }

  &:active {
    transform: translateY(0px);
  }

  &:focus-visible {
    box-shadow:
      0 18px 60px rgba(0, 0, 0, 0.45),
      0 0 0 3px rgba(1, 173, 228, 0.35);
  }

  @media (max-width: 1000px) {
    position: absolute;
    top: 0;
    right: 0;
    width: auto;
    border-radius: 12px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 18px;
  height: 18px;
  padding: 0 4px;

  background: #01ade4;
  color: white;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(10, 12, 16, 0.5);
`;

const SolutionsDrawer = styled.aside`
  position: fixed;
  top: 72px;
  right: 16px;
  bottom: 16px;

  width: min(420px, calc(100vw - 32px));

  display: flex;
  flex-direction: column;

  border-radius: 18px;
  overflow: hidden;

  background: rgba(10, 12, 16, 0.72);
  backdrop-filter: blur(14px);

  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.52);

  pointer-events: auto;

  z-index: 40;

  @media (max-width: 1000px) {
    position: static;
    width: 100%;
    top: auto;
    right: auto;
    bottom: auto;
  }
`;

const SolutionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  padding: 1.1rem 1.2rem;

  background: rgba(10, 12, 16, 0.55);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  h2 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 650;
    color: rgba(255, 255, 255, 0.92);
    letter-spacing: -0.1px;
  }
`;

const HeaderRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
`;

const CloseButton = styled.button`
  appearance: none;
  border: none;
  cursor: pointer;

  height: 32px;
  width: 32px;
  border-radius: 10px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);

  color: rgba(255, 255, 255, 0.85);
  font-size: 2rem;
  line-height: 1;

  transition:
    transform 140ms ease,
    background 140ms ease,
    border-color 140ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.18);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const CountPill = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.86);

  padding: 0.35rem 0.65rem;
  border-radius: 999px;

  background: rgba(1, 173, 228, 0.14);
  border: 1px solid rgba(1, 173, 228, 0.18);
`;

const SolutionsList = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  ul {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 0.4rem 0.4rem 0.6rem;

    overflow-y: auto;
  }

  li {
    display: grid;
    grid-template-columns: 56px 1fr;
    align-items: center;
    gap: 0.9rem;

    padding: 0.85rem 0.9rem;
    margin: 0.35rem 0;

    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.06);

    background: rgba(255, 255, 255, 0.02);
    color: rgba(255, 255, 255, 0.86);

    cursor: pointer;

    transition:
      transform 120ms ease,
      background 120ms ease,
      border-color 120ms ease;
  }

  li:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  padding: 1.3rem 1.2rem 1.5rem;

  display: grid;
  gap: 0.35rem;

  color: rgba(255, 255, 255, 0.74);

  strong {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.35rem;
  }

  span {
    font-size: 1.25rem;
  }
`;

const SolutionIndex = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.7);

  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 32px;
  width: 52px;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const SolutionText = styled.div`
  font-size: 1.35rem;
  color: rgba(255, 255, 255, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChessBoard = styled.div<{ $boardSize: number; $isDisabled: boolean }>`
  display: grid;
  grid-template-columns: ${({ $boardSize }) => `repeat( ${$boardSize} , 1fr );`};

  overflow: hidden;
  outline: 1px solid rgba(255, 255, 255, 0.14);

  pointer-events: ${({ $isDisabled }) => ($isDisabled ? "none" : "all")};
`;

const CelebarationEl = styled.div<{ $boardSize: number }>`
  img {
    position: absolute;
    bottom: 0;

    object-fit: fill;
    height: 100%;
    width: 100%;
  }
  font-size: ${({ $boardSize }) => `calc( ${$boardSize} * 8rem);`};
`;

const StyledButton = styled(Button)`
  transition: all 140ms ease !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;

  font-size: 5%;

  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  background: rgba(10, 12, 16, 0.65) !important;
  color: rgba(255, 255, 255, 0.92) !important;

  &:hover {
    transform: translate(-50%, -52%);
    background: rgba(10, 12, 16, 0.8) !important;
    border-color: rgba(255, 255, 255, 0.26) !important;
    box-shadow: 0 18px 55px rgba(0, 0, 0, 0.45);
  }

  &:active {
    transform: translate(-50%, -50%);
  }
`;
