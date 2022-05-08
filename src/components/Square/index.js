import React from 'react';
import styled from 'styled-components';

import { checkIsAttacking } from '../../constants';

const Square = ({
  boardSize,
  isOdd,
  isPlaced,
  positions,
  position,
  updatePosition,
  chessPieceType,
  showAlertMessage,
}) => {
  const handleClick = () => {
    if (!(isPlaced || positions.length < boardSize)) {
      showAlertMessage({
        message: `Cannot place more than ${boardSize} ${chessPieceType.value} `,
        variant: 'warning',
      });
    } else {
      updatePosition(isPlaced, position);
    }
  };

  let isAttacking = checkIsAttacking(chessPieceType.value, position, positions);
  let className = `${isOdd ? 'white' : 'black'} ${
    isAttacking ? 'occupied' : ''
  }`;

  return (
    <SquareEl
      className={className}
      onClick={handleClick}
      $chessPieceType={chessPieceType.icon}
    >
      <div className="position">{position}</div>
      {isPlaced ? <span>{chessPieceType.icon}</span> : ''}
    </SquareEl>
  );
};

export default Square;

const SquareEl = styled.div`
  position: relative;
  width: 8rem;
  height: 8rem;
  text-align: center;
  font-size: 5rem;
  user-select: none;

  cursor: pointer;
  & {
    .position {
      position: absolute;
      font-size: 30%;
      height: 30%;
      width: 30%;
      top: 0;
      right: 0;
    }
  }

  &.black {
    background-color: var(--clr-dark);
    color: var(--clr-white);
  }
  &.white {
    background-color: var(--clr-white);
    color: var(--clr-dark);
  }
  span {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }
  &:hover {
    &::before {
      content: '${({ $chessPieceType }) => $chessPieceType}';
      position: absolute;
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;
    }
  }

  &.occupied {
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent,
      var(--clr-primary) 2px,
      var(--clr-primary) 4px
    );
  }
`;
