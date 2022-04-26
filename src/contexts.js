import React, { createContext, useState } from 'react';
import {
  simulationSpeedControlBarConfig,
  boardSizeControlBarConfig,
  modeControlBarConfig,
} from './constants';

const control = {
  simulationSpeed: '',
  boardSize: '',
  isSimulating: false,
  mode: '',
  handleModeChange: () => {},
  handleSimulationSpeedChange: () => {},
  handleBoardSizeChange: () => {},
  toggleSimulation: () => {},
};

const ControlContext = createContext(control);

export const ControlContextProvider = (props) => {
  const [simulationSpeed, setSimulationSpeed] = useState(
    Object.values(simulationSpeedControlBarConfig.options)[2]
  );
  const [boardSize, setBoardSize] = useState(
    Object.values(boardSizeControlBarConfig.options)[4]
  );
  const [mode, setMode] = useState(
    Object.values(modeControlBarConfig.options)[1]
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
        handleSimulationSpeedChange,
        handleBoardSizeChange,
        handleModeChange,
        toggleSimulation,
      }}
    >
      {props.children}
    </ControlContext.Provider>
  );
};

export default ControlContext;
