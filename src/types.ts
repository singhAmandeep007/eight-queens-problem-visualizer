export type ChessPiece = "queen" | "bishop" | "rook" | "knight";

export type ControlMode = "manual" | "simulation";

export type SimulationSpeed = number;

export interface ChessPieceTypeOption {
  value: ChessPiece;
  icon: string;
}

export interface ControlState {
  simulationSpeed: SimulationSpeed;
  boardSize: number;
  isSimulating: boolean;
  mode: ControlMode;
  chessPieceType: ChessPieceTypeOption;
}

export interface ControlActions {
  handleChessPieceTypeChange: (value: ChessPiece) => void;
  handleModeChange: (value: ControlMode) => void;
  handleSimulationSpeedChange: (value: SimulationSpeed) => void;
  handleBoardSizeChange: (value: number) => void;
  toggleSimulation: () => void;
}

export type ControlContextValue = ControlState & ControlActions;

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertState {
  message: string;
  delay: number;
  variant: AlertVariant;
}

export interface ShowAlertArgs {
  message?: string;
  delay?: number;
  variant?: AlertVariant;
}

export interface AlertContextValue {
  alert: AlertState;
  showAlertMessage: (args?: ShowAlertArgs) => void;
}

export type RowIndex = number;
export type ColIndex = number;

export interface Position {
  row: RowIndex;
  col: ColIndex;
}

/**
 * Board representation:
 * - `null` means empty square
 * - otherwise contains the chess piece placed there
 */
export type BoardCell = ChessPiece | null;

export type Board = BoardCell[][];

export interface Solution {
  /**
   * For an N×N board, `placements.length === N`
   * and each row has at most one placed piece.
   */
  placements: Position[];
}

export type MoveResult = { ok: true; board: Board } | { ok: false; reason: string };

export type Milliseconds = number;
