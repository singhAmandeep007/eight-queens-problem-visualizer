import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
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

  const startSimulation = function () {
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
                //console.log('position-------->', position);
                const newQueenPositions = [...queenPositions, ...solution, position];
                setQueenPositions(newQueenPositions);

                if (!checkIsAttacking(chessPieceType.value as ChessPieceTypeValue, position, solution)) {
                  const result = solution.concat([position]);
                  newSolutions.push(result);

                  if (result.length === columns) {
                    setSolutions((prevState) => {
                      return Array.from(new Map([...prevState, result].map((s) => [s.join(), s])).values());
                    });
                  }
                }
                await delay(simulationSpeed);
                //console.log('after delay,', new Date());
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
      <SolutionsList>
        <h2>Solutions</h2>
        <ul>
          {solutions.map((s, i) => {
            return (
              <li
                data-solution-key={i}
                key={s.join(",")}
                onClick={handleListClick}
              >
                {s.join(",")}
              </li>
            );
          })}
        </ul>
      </SolutionsList>

      {alert.message && <Alert variant={alert.variant}>{alert.message}</Alert>}
    </Container>
  );
};

export default Chessboard;

const Container = styled.div<{ $boardSize: number }>`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: ${({ $boardSize }) => `calc( ${$boardSize} * 8rem);`};

  gap: 5rem;
  margin: 1rem;
  height: max-content;
  margin-top: 3.5rem;

  @media (max-width: 1000px) {
    grid-template-columns: max-content;
    grid-template-rows: ${({ $boardSize }) => `repeat(2,calc( ${$boardSize} * 8rem))`};
  }
`;

const ChessBoardContainer = styled.div`
  position: relative;
  box-shadow: 0px 5px 10px 2px rgba(0, 0, 0, 0.8);
`;
const SolutionsList = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    text-align: center;
    font-size: 2rem;
    font-weight: normal;

    border: 2px solid var(--clr-dark);
    color: var(--clr-dark);
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 0.5rem 0;
  }

  ul {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    width: min(25rem, 40rem);

    margin-left: auto;
    margin-right: auto;
  }

  li {
    font-size: 2rem;
    border-bottom: 1px solid var(--clr-dark);
    text-decoration: none;
    color: var(--clr-dark);
    display: block;
    /* width: min(20rem, 40rem); */
    line-height: 4rem;
  }

  li:hover {
    cursor: pointer;
    text-decoration: none;
    background: var(--clr-primary-background-1);
  }
`;

const ChessBoard = styled.div<{ $boardSize: number; $isDisabled: boolean }>`
  display: grid;
  grid-template-columns: ${({ $boardSize }) => `repeat( ${$boardSize} , 1fr );`};

  overflow: hidden;
  outline: 2px solid var(--clr-dark);

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
  transition: all 100ms linear !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  font-size: 5%;

  &:hover {
    transform: translate(-50%, -60%);
    box-shadow: 0px 5px 15px var(--clr-secondary);
  }
`;
