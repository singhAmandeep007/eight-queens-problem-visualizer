export type SimulationSpeedMs = number;

export type ModeType = "manual" | "simulation";

export type ChessPieceTypeValue = "queen" | "bishop" | "rook" | "knight";

export interface ChessPieceTypeOption {
  value: ChessPieceTypeValue;
  icon: string;
}

export const SIMULATION_SPEED_TYPE: Readonly<Record<"slow" | "moderate" | "fast", SimulationSpeedMs>> = {
  slow: 100,
  moderate: 50,
  fast: 0,
};

export const MODE_TYPE: Readonly<Record<ModeType, ModeType>> = {
  manual: "manual",
  simulation: "simulation",
};

export const CHESS_PIECE_TYPE: Readonly<Record<ChessPieceTypeValue, ChessPieceTypeOption>> = {
  queen: {
    value: "queen",
    icon: "♕",
  },
  bishop: {
    value: "bishop",
    icon: "♗",
  },
  rook: {
    value: "rook",
    icon: "♖",
  },
  knight: {
    value: "knight",
    icon: "♘",
  },
};

export const chessPieceTypeControlBarConfig: Readonly<{
  id: "chessPieceType";
  options: Readonly<Record<ChessPieceTypeValue, ChessPieceTypeOption>>;
  label: "Chess Piece Type";
}> = {
  id: "chessPieceType",
  options: {
    ...CHESS_PIECE_TYPE,
  },
  label: "Chess Piece Type",
};

export const simulationSpeedControlBarConfig: Readonly<{
  id: "simulationSpeed";
  options: Readonly<Record<"Slow" | "Moderate" | "Fast", SimulationSpeedMs>>;
  label: "Simulation Speed";
}> = {
  id: "simulationSpeed",
  options: {
    Slow: SIMULATION_SPEED_TYPE.slow,
    Moderate: SIMULATION_SPEED_TYPE.moderate,
    Fast: SIMULATION_SPEED_TYPE.fast,
  },
  label: "Simulation Speed",
};
export const boardSizeControlBarConfig: Readonly<{
  id: "boardSize";
  options: Readonly<Record<"8 x 8" | "7 x 7" | "6 x 6" | "5 x 5" | "4 x 4", number>>;
  label: "Board Size";
}> = {
  id: "boardSize",
  options: {
    "8 x 8": 8,
    "7 x 7": 7,
    "6 x 6": 6,
    "5 x 5": 5,
    "4 x 4": 4,
  },
  label: "Board Size",
};

export const modeControlBarConfig: Readonly<{
  id: "mode";
  options: Readonly<Record<"Manual" | "Simulation", ModeType>>;
  label: "Mode";
}> = {
  id: "mode",
  options: {
    Manual: MODE_TYPE.manual,
    Simulation: MODE_TYPE.simulation,
  },
  label: "Mode",
};

export const breakpoints: Readonly<Record<string, string>> = {
  // RESPONSIVE BREAKPOINTS
  bpXXLarge: "87.5em", // 1400px
  bpXLarge: "75em", // 1200px
  bpLarge: "62em", // 992px
  bpMedium: "48em", // 768px
  bpSmall: "36em", // 576px
  bpXSmall: "23.4375em", // 375px
};

export interface RowCol {
  r: number;
  c: number;
}

export interface ConflictArgs {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
}

export const checkConflictMethods: Readonly<{
  getRowAndColumn: (position: number) => RowCol;
  sameRowOrColumn: (args: ConflictArgs) => boolean;
  sameDiagonal: (args: ConflictArgs) => boolean;
  queen: (args: ConflictArgs) => boolean;
  bishop: (args: ConflictArgs) => boolean;
  rook: (args: ConflictArgs) => boolean;
  knight: (args: ConflictArgs) => boolean;
}> = {
  getRowAndColumn: function (position: number): RowCol {
    const r = Math.trunc(position / 10);
    const c = position % 10;
    return { r, c };
  },
  sameRowOrColumn: function ({ r1, c1, r2, c2 }: ConflictArgs): boolean {
    return r1 === r2 || c1 === c2;
  },
  sameDiagonal: function ({ r1, c1, r2, c2 }: ConflictArgs): boolean {
    return Math.abs(c1 - c2) === Math.abs(r1 - r2);
  },
  queen: function ({ r1, c1, r2, c2 }: ConflictArgs): boolean {
    return this.sameRowOrColumn({ r1, c1, r2, c2 }) || this.sameDiagonal({ r1, c1, r2, c2 });
  },
  bishop: function ({ r1, c1, r2, c2 }: ConflictArgs): boolean {
    return this.sameDiagonal({ r1, c1, r2, c2 });
  },
  rook: function ({ r1, c1, r2, c2 }: ConflictArgs): boolean {
    return this.sameRowOrColumn({ r1, c1, r2, c2 });
  },
  knight: function ({ r1, c1, r2, c2 }: ConflictArgs): boolean {
    return (Math.abs(c1 - c2) === 1 && Math.abs(r1 - r2) === 2) || (Math.abs(c1 - c2) === 2 && Math.abs(r1 - r2) === 1);
  },
};

export const checkIsSolved = (chessPieceType: ChessPieceTypeValue, positions: number[]): boolean => {
  let isNotAttacking = true;
  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];
      if (p1 === undefined || p2 === undefined) continue;

      const { r: r1, c: c1 } = checkConflictMethods.getRowAndColumn(p1);
      const { r: r2, c: c2 } = checkConflictMethods.getRowAndColumn(p2);

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
      if (chessPieceType === CHESS_PIECE_TYPE.rook.value) {
        if (checkConflictMethods.rook({ r1, r2, c1, c2 })) {
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
  chessPieceType: ChessPieceTypeValue,
  position: number,
  existingPositions: number[]
): boolean => {
  let isAttacking = false;
  for (const existingPosition of existingPositions) {
    const { r: r1, c: c1 } = checkConflictMethods.getRowAndColumn(position);
    const { r: r2, c: c2 } = checkConflictMethods.getRowAndColumn(existingPosition);

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
    if (chessPieceType === CHESS_PIECE_TYPE.rook.value) {
      if (checkConflictMethods.rook({ r1, r2, c1, c2 })) {
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
