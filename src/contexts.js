import React, { createContext, useState, useEffect, useRef } from 'react';
import {
  simulationSpeedControlBarConfig,
  boardSizeControlBarConfig,
  modeControlBarConfig,
  chessPieceTypeControlBarConfig,
} from './constants';

const control = {
  simulationSpeed: '',
  boardSize: '',
  isSimulating: false,
  mode: '',
  chessPieceType: {
    value: '',
    icon: '',
  },
  handleChessPieceTypeChange: () => {},
  handleModeChange: () => {},
  handleSimulationSpeedChange: () => {},
  handleBoardSizeChange: () => {},
  toggleSimulation: () => {},
};

export const ControlContext = createContext(control);

export const ControlContextProvider = (props) => {
  const [simulationSpeed, setSimulationSpeed] = useState(
    Object.values(simulationSpeedControlBarConfig.options)[2]
  );
  const [boardSize, setBoardSize] = useState(
    Object.values(boardSizeControlBarConfig.options)[4]
  );
  const [mode, setMode] = useState(
    Object.values(modeControlBarConfig.options)[0]
  );

  const [chessPieceType, setChessPieceType] = useState(
    Object.values(chessPieceTypeControlBarConfig.options)[0]
  );

  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulationSpeedChange = (val) => {
    setSimulationSpeed(val);
  };
  const handleBoardSizeChange = (val) => {
    setBoardSize(val);
  };
  const handleModeChange = (val) => {
    setMode(val);
  };
  const handleChessPieceTypeChange = (val) => {
    setChessPieceType(chessPieceTypeControlBarConfig.options[val]);
  };
  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  return (
    <ControlContext.Provider
      value={{
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
      }}
    >
      {props.children}
    </ControlContext.Provider>
  );
};

const alertConfig = {
  alert: {
    message: '',
    delay: 3,
    variant: 'info',
  },
  showAlert: () => {},
};

export const AlertContext = createContext(alertConfig);

export const AlertContextProvider = (props) => {
  const defaultAlertState = { message: '', delay: 2, variant: 'info' };

  const [alert, setAlert] = useState({
    ...defaultAlertState,
  });
  const timerId = useRef(null);

  useEffect(() => {
    if (alert.message) {
      timerId.current = setTimeout(() => {
        timerId.current = null;
        // After delay set the value to ''
        setAlert({ ...defaultAlertState });
      }, alert.delay * 1000);
      return () => {
        clearTimeout(timerId.current);
      };
    }
  }, [alert]);

  const showAlertMessage = function (props) {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    let message = 'Something went wrong!',
      delay = 2,
      variant = 'info';

    setAlert({
      variant: props?.variant || variant,
      delay: props?.delay || delay,
      message: props?.message || message,
    });
  };

  return (
    <AlertContext.Provider value={{ alert, showAlertMessage }}>
      {props.children}
    </AlertContext.Provider>
  );
};
