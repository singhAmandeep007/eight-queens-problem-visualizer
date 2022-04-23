import React, { useContext, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import ControlContext from '../../contexts';
import Square from '../Square';
import { checkIsSolved } from '../../constants';
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
  let { boardSize, mode, isSimulating } = useContext(ControlContext);
  boardSize = Number(boardSize);

  console.log('called');

  const [queenPositions, setQueenPositions] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    setQueenPositions([]);
    setIsSolved(false);
    setIsPreview(false);
    setSolutions([]);
  }, [boardSize, mode, isSimulating]);

  const sizeArr = useMemo(() => {
    console.log('aw');
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
      console.log('wd');
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
          $isDisabled={isSolved || isPreview || isSimulating}
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
          {(isSolved || isPreview) && (
            <StyledButton onClick={handleResetChessBoard}>
              Play Again
            </StyledButton>
          )}
          {isSolved && <img src={celebration1} />}
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
