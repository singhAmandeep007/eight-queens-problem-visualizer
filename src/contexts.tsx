import React, { createContext, useEffect, useMemo, useRef, useState } from "react";
import {
  boardSizeControlBarConfig,
  chessPieceTypeControlBarConfig,
  modeControlBarConfig,
  simulationSpeedControlBarConfig,
} from "./constants";
import type {
  AlertContextValue,
  AlertState,
  ChessPiece,
  ChessPieceTypeOption,
  ControlContextValue,
  ControlMode,
  SimulationSpeed,
  ShowAlertArgs,
} from "./types";

/**
 * Helpers to safely read defaults from existing JS configs.
 * These configs look like:
 *   { options: { key: value, ... } }
 * where control values vary by config.
 */
function firstValue<T>(obj: Record<string, T>): T {
  const values = Object.values(obj);
  if (values.length === 0) {
    throw new Error("Expected at least one option value in config");
  }
  return values[0] as T;
}

function valueAt<T>(obj: Record<string, T>, index: number): T {
  const values = Object.values(obj);
  if (values.length === 0) {
    throw new Error("Expected at least one option value in config");
  }
  return (values[index] ?? values[Math.max(0, values.length - 1)]) as T;
}

/**
 * CONTROL CONTEXT
 */

const defaultChessPieceType: ChessPieceTypeOption = {
  value: "queen",
  icon: "",
};

const defaultControlContextValue: ControlContextValue = {
  simulationSpeed: 50,
  boardSize: 8,
  isSimulating: false,
  mode: "manual",
  chessPieceType: defaultChessPieceType,

  handleChessPieceTypeChange: () => undefined,
  handleModeChange: () => undefined,
  handleSimulationSpeedChange: () => undefined,
  handleBoardSizeChange: () => undefined,
  toggleSimulation: () => undefined,
};

export const ControlContext = createContext<ControlContextValue>(defaultControlContextValue);

export function ControlContextProvider(props: { children: React.ReactNode; initialMode?: ControlMode }) {
  const simulationSpeedDefault = useMemo(() => {
    // historical default used index 2 in the original JS
    const raw = valueAt(simulationSpeedControlBarConfig.options as Record<string, unknown>, 2) as SimulationSpeed;
    return typeof raw === "number" ? raw : 50;
  }, []);

  const boardSizeDefault = useMemo(() => {
    // historical default used index 4 in the original JS
    const raw = valueAt(boardSizeControlBarConfig.options as Record<string, unknown>, 4) as number;
    return typeof raw === "number" ? raw : 8;
  }, []);

  const modeDefault = useMemo(() => {
    if (props.initialMode) return props.initialMode;
    const raw = firstValue(modeControlBarConfig.options as Record<string, unknown>) as ControlMode;
    return raw ?? ("manual" as ControlMode);
  }, [props.initialMode]);

  const chessPieceTypeDefault = useMemo(() => {
    const raw = firstValue(chessPieceTypeControlBarConfig.options as Record<string, unknown>) as ChessPieceTypeOption;
    if (raw && typeof raw === "object" && "value" in raw && "icon" in raw) {
      return raw;
    }
    return defaultChessPieceType;
  }, []);

  const [simulationSpeed, setSimulationSpeed] = useState<SimulationSpeed>(simulationSpeedDefault);
  const [boardSize, setBoardSize] = useState<number>(boardSizeDefault);
  const [mode, setMode] = useState<ControlMode>(modeDefault);
  const [chessPieceType, setChessPieceType] = useState<ChessPieceTypeOption>(chessPieceTypeDefault);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleSimulationSpeedChange = (val: SimulationSpeed) => {
    setSimulationSpeed(val);
  };

  const handleBoardSizeChange = (val: number) => {
    setBoardSize(val);
  };

  const handleModeChange = (val: ControlMode) => {
    setMode(val);
  };

  const handleChessPieceTypeChange = (val: ChessPiece) => {
    const options = chessPieceTypeControlBarConfig.options as Record<string, ChessPieceTypeOption>;
    const next = options[val] ?? options[String(val)];
    if (next) setChessPieceType(next);
  };

  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  const value: ControlContextValue = {
    simulationSpeed,
    boardSize,
    isSimulating,
    mode,
    chessPieceType,
    handleSimulationSpeedChange,
    handleChessPieceTypeChange,
    handleBoardSizeChange,
    handleModeChange,
    toggleSimulation,
  };

  return <ControlContext.Provider value={value}>{props.children}</ControlContext.Provider>;
}

/**
 * ALERT CONTEXT
 */

const defaultAlertState: AlertState = {
  message: "",
  delay: 2,
  variant: "info",
};

const defaultAlertContextValue: AlertContextValue = {
  alert: defaultAlertState,
  showAlertMessage: () => undefined,
};

export const AlertContext = createContext<AlertContextValue>(defaultAlertContextValue);

export function AlertContextProvider(props: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({ ...defaultAlertState });
  const timerIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!alert.message) return;

    // schedule reset
    timerIdRef.current = window.setTimeout(() => {
      timerIdRef.current = null;
      setAlert({ ...defaultAlertState });
    }, alert.delay * 1000);

    // cleanup if alert changes/unmounts
    return () => {
      if (timerIdRef.current !== null) {
        window.clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [alert]);

  const showAlertMessage = (args?: ShowAlertArgs) => {
    if (timerIdRef.current !== null) {
      window.clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }

    setAlert({
      variant: args?.variant ?? "info",
      delay: args?.delay ?? 2,
      message: args?.message ?? "Something went wrong!",
    });
  };

  const value: AlertContextValue = {
    alert,
    showAlertMessage,
  };

  return <AlertContext.Provider value={value}>{props.children}</AlertContext.Provider>;
}
