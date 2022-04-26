import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import ControlContext from '../../contexts';
import Square from '../Square';
import { checkIsSolved, checkIsAttacking, MODE_TYPE } from '../../constants';
import { controllableDelay } from '../../utils';
import Button from '../../common/button';

import celebration1 from '../../assets/celebration1.gif';

const memoizedCheckIsSolved = (() => {
  const cache = {};

  return (positions) => {
    if (positions.length === 0) {
      return false;
    }
    let key = positions.sort((a, b) => a - b).join('');
    if (cache.hasOwnProperty(key)) {
      return cache[key];
    } else {
      cache[key] = checkIsSolved(positions);
      return cache[key];
    }
  };
})();

const Chessboard = () => {
  let { boardSize, mode, isSimulating, toggleSimulation, simulationSpeed } =
    useContext(ControlContext);
  boardSize = Number(boardSize);

  const cancelSimulationFn = useRef(null);

  const [queenPositions, setQueenPositions] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [solutions, setSolutions] = useState([]);

  const memoizedStartSimulation = useCallback(() => {
    function getAllSolutions(rows, columns) {
      return new Promise(async (resolve, _) => {
        if (rows <= 0) {
          resolve([[]]);
        } else {
          let solutions = await getSolution(rows - 1, columns);
          resolve(solutions);
        }
      });
    }

    function getSolution(rows, columns) {
      return new Promise(async (resolve, _) => {
        let newSolutions = [];
        let prevSolutions = await getAllSolutions(rows, columns);

        await [
          ...Array.from({ length: prevSolutions.length }, (_, i) => i + 1),
        ].reduce((p, _, i) => {
          return p.then(async () => {
            let solution = prevSolutions[i];
            await [...Array.from({ length: columns }, (_, i) => i + 1)].reduce(
              (p, _, column) => {
                let position = (rows + 1) * 10 + (column + 1);
                return p
                  .then(async () => {
                    let newQueenPositions = [
                      ...queenPositions,
                      ...solution,
                      position,
                    ];
                    setQueenPositions(newQueenPositions);

                    if (!checkIsAttacking(position, solution)) {
                      let result = solution.concat([position]);
                      newSolutions.push(result);
                      if (result.length === columns) {
                        setSolutions((prevState) => {
                          return Array.from(
                            new Map(
                              [...[...prevState], [...result]].map((s) => [
                                s.join(),
                                s,
                              ])
                            ).values()
                          );
                        });
                      }
                    }
                  })
                  .then(() => {
                    let [timerId, p] = controllableDelay(simulationSpeed);
                    cancelSimulationFn.current = timerId;
                    return p;
                  });
              },
              Promise.resolve()
            );
          });
        }, Promise.resolve());
        resolve([...newSolutions]);
      });
    }

    getAllSolutions(boardSize, boardSize).then((result) => {
      setQueenPositions([...result[result.length - 1]]);
      toggleSimulation();
      cancelSimulationFn.current = null;
    });
  }, [boardSize, queenPositions, simulationSpeed, toggleSimulation]);

  useEffect(() => {
    resetAllState();
  }, [boardSize, mode]);

  useEffect(() => {
    if (isSimulating) {
      resetAllState();
    }

    if (!isSimulating && cancelSimulationFn.current) {
      window.clearTimeout(cancelSimulationFn.current);
      cancelSimulationFn.current = null;
      resetAllState();
    }
  }, [isSimulating]);

  useEffect(() => {
    if (isSimulating && queenPositions.length === 0) {
      memoizedStartSimulation();
    }
  }, [isSimulating, queenPositions.length]);

  const sizeArr = useMemo(() => {
    let arr = [];
    for (let i = 1; i <= boardSize; i++) {
      for (let j = 1; j <= boardSize; j++) {
        arr.push([j, i, uuidv4()]);
      }
    }
    return arr;
  }, [boardSize]);

  const handleUpdateQueenPosition = function (isQueenPlaced, position) {
    let positions;
    if (isQueenPlaced) {
      positions = queenPositions.filter((x) => x !== position);
    } else {
      positions = [...new Set([...queenPositions, position])];
    }
    let checkIsProblemSolved = memoizedCheckIsSolved(positions);

    if (checkIsProblemSolved && positions.length === boardSize) {
      setQueenPositions(positions);
      setIsSolved(true);
      setSolutions(
        Array.from(
          new Map(
            [...solutions, [...positions]].map((s) => [s.join(), s])
          ).values()
        )
      );
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
  };

  const handleListClick = function (e) {
    let { solutionKey = null } = e.target.dataset;
    if (solutionKey !== null) {
      setQueenPositions([...solutions[solutionKey]]);
      setIsSolved(false);
      setIsPreview(true);
    }
  };

  return (
    <Container $boardSize={boardSize}>
      <ChessBoardContainer>
        <ChessBoard
          $isDisabled={
            isSolved ||
            isPreview ||
            isSimulating ||
            mode === MODE_TYPE.simulation
          }
          $boardSize={boardSize}
        >
          {sizeArr.map(([x, y, key]) => {
            return (
              <Square
                key={key}
                isOdd={x % 2 === y % 2} // true -> white | black
                updateQueenPosition={handleUpdateQueenPosition}
                position={y * 10 + x}
                queenPositions={queenPositions}
                isQueenPlaced={queenPositions.includes(Number(y + '' + x))}
              />
            );
          })}
        </ChessBoard>

        <CelebarationEl $boardSize={boardSize}>
          {(isSolved || isPreview) && mode !== MODE_TYPE.simulation && (
            <StyledButton onClick={handleResetChessBoard}>
              Play Again
            </StyledButton>
          )}
          {isSolved && <img src={celebration1} alt="celebration" />}
        </CelebarationEl>
      </ChessBoardContainer>
      <SolutionsList>
        <h2>Solutions</h2>
        <ul>
          {solutions.map((s, i) => {
            return (
              <li
                data-solution-key={i}
                key={s.join(',')}
                onClick={handleListClick}
              >
                {s.join(',')}
              </li>
            );
          })}
        </ul>
      </SolutionsList>
    </Container>
  );
};

export default Chessboard;

const Container = styled.div`
  border-radius: 5px;
  border: 2px solid var(--color-primary);

  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: ${({ $boardSize }) => `calc( ${$boardSize} * 8rem);`};

  gap: 5rem;
  margin: 1rem;
  height: max-content;
  margin-top: 3.5rem;

  @media (max-width: 1000px) {
    grid-template-columns: max-content;
    grid-template-rows: ${({ $boardSize }) =>
      `calc( ${$boardSize} * 8rem) 1fr`};
  }
`;

const ChessBoardContainer = styled.div`
  position: relative;
`;
const SolutionsList = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    text-align: center;
    font-size: 2rem;
    font-weight: normal;

    background-color: var(--clr-primary);
    color: var(--clr-white);
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
    width: min(20rem, 40rem);

    margin-left: auto;
    margin-right: auto;
  }

  li {
    font-size: 2rem;
    border-bottom: 1px solid var(--clr-secondary);
    text-decoration: none;
    color: var(--clr-secondary);
    display: block;
    /* width: min(20rem, 40rem); */
    line-height: 4rem;
  }

  li:hover {
    cursor: pointer;
    text-decoration: none;
    color: var(--clr-secondary);
    background: var(--clr-primary-background);
  }
`;

const ChessBoard = styled.div`
  display: grid;
  grid-template-columns: ${({ $boardSize }) =>
    `repeat( ${$boardSize} , 1fr );`};

  border: 2px solid var(--clr-dark);

  pointer-events: ${({ $isDisabled }) => ($isDisabled ? 'none' : 'all')};
`;

const CelebarationEl = styled.div`
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
