export const SIMULATION_SPEED_TYPE = {
  slow: 100,
  moderate: 50,
  fast: 0,
};
export const MODE_TYPE = {
  manual: 'manual',
  simulation: 'simulation',
};

export const CHESS_PIECE_TYPE = {
  queen: {
    value: 'queen',
    icon: '♕',
  },
  bishop: {
    value: 'bishop',
    icon: '♗',
  },
  rock: {
    value: 'rock',
    icon: '♖',
  },
  knight: {
    value: 'knight',
    icon: '♘',
  },
};
export const chessPieceTypeControlBarConfig = {
  id: 'chessPieceType',
  options: {
    ...CHESS_PIECE_TYPE,
  },
  label: 'Chess Piece Type',
};

export const simulationSpeedControlBarConfig = {
  id: 'simulationSpeed',
  options: {
    Slow: SIMULATION_SPEED_TYPE.slow,
    Moderate: SIMULATION_SPEED_TYPE.moderate,
    Fast: SIMULATION_SPEED_TYPE.fast,
  },
  label: 'Simulation Speed',
};
export const boardSizeControlBarConfig = {
  id: 'boardSize',
  options: {
    '8 x 8': 8,
    '7 x 7': 7,
    '6 x 6': 6,
    '5 x 5': 5,
    '4 x 4': 4,
  },
  label: 'Board Size',
};

export const modeControlBarConfig = {
  id: 'mode',
  options: {
    Manual: MODE_TYPE.manual,
    Simulation: MODE_TYPE.simulation,
  },
  label: 'Mode',
};

export const breakpoints = {
  // RESPONSIVE BREAKPOINTS
  bpXXLarge: '87.5em', // 1400px
  bpXLarge: '75em', // 1200px
  bpLarge: '62em', // 992px
  bpMedium: '48em', // 768px
  bpSmall: '36em', // 576px
  bpXSmall: '23.4375em', // 375px
};

export const checkConflictMethods = {
  getRowAndColumn: function (position) {
    let r = Math.trunc(position / 10);
    let c = position % 10;
    return { r, c };
  },
  sameRowOrColumn: function ({ r1, c1, r2, c2 }) {
    return r1 === r2 || c1 === c2;
  },
  sameDiagonal: function ({ r1, c1, r2, c2 }) {
    return Math.abs(c1 - c2) === Math.abs(r1 - r2);
  },
  queen: function ({ r1, c1, r2, c2 }) {
    return (
      this.sameRowOrColumn({ r1, c1, r2, c2 }) ||
      this.sameDiagonal({ r1, c1, r2, c2 })
    );
  },
  bishop: function ({ r1, c1, r2, c2 }) {
    return this.sameDiagonal({ r1, c1, r2, c2 });
  },
  rock: function ({ r1, c1, r2, c2 }) {
    return this.sameRowOrColumn({ r1, c1, r2, c2 });
  },
  knight: function ({ r1, c1, r2, c2 }) {
    return (
      (Math.abs(c1 - c2) === 1 && Math.abs(r1 - r2) === 2) ||
      (Math.abs(c1 - c2) === 2 && Math.abs(r1 - r2) === 1)
    );
  },
};

export const checkIsSolved = (chessPieceType, positions) => {
  let isNotAttacking = true;
  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      let { r: r1, c: c1 } = checkConflictMethods.getRowAndColumn(positions[i]);
      let { r: r2, c: c2 } = checkConflictMethods.getRowAndColumn(positions[j]);
      if (chessPieceType === CHESS_PIECE_TYPE.queen.value) {
        if (checkConflictMethods.queen({ r1, r2, c1, c2 })) {
          isNotAttacking = false;
          break;
        }
      }
      if (chessPieceType === CHESS_PIECE_TYPE.bishop.value) {
        if (checkConflictMethods.bishop({ r1, r2, c1, c2 })) {
          isNotAttacking = false;
          break;
        }
      }
      if (chessPieceType === CHESS_PIECE_TYPE.rock.value) {
        if (checkConflictMethods.rock({ r1, r2, c1, c2 })) {
          isNotAttacking = false;
          break;
        }
      }
      if (chessPieceType === CHESS_PIECE_TYPE.knight.value) {
        if (checkConflictMethods.knight({ r1, r2, c1, c2 })) {
          isNotAttacking = false;
          break;
        }
      }
    }
    if (!isNotAttacking) break;
  }
  return isNotAttacking;
};

export const checkIsAttacking = (
  chessPieceType,
  position,
  existingPositions
) => {
  let isAttacking = false;
  for (let i = 0; i < existingPositions.length; i++) {
    let { r: r1, c: c1 } = checkConflictMethods.getRowAndColumn(position);
    let { r: r2, c: c2 } = checkConflictMethods.getRowAndColumn(
      existingPositions[i]
    );

    if (chessPieceType === CHESS_PIECE_TYPE.queen.value) {
      if (checkConflictMethods.queen({ r1, r2, c1, c2 })) {
        isAttacking = true;
        break;
      }
    }
    if (chessPieceType === CHESS_PIECE_TYPE.bishop.value) {
      if (checkConflictMethods.bishop({ r1, r2, c1, c2 })) {
        isAttacking = true;
        break;
      }
    }
    if (chessPieceType === CHESS_PIECE_TYPE.rock.value) {
      if (checkConflictMethods.rock({ r1, r2, c1, c2 })) {
        isAttacking = true;
        break;
      }
    }
    if (chessPieceType === CHESS_PIECE_TYPE.knight.value) {
      if (checkConflictMethods.knight({ r1, r2, c1, c2 })) {
        isAttacking = true;
        break;
      }
    }
  }
  return isAttacking;
};
