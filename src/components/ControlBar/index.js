import React, { useContext } from 'react';
import styled from 'styled-components';
import Button from '../../common/button';

import ControlSelect from '../ControlSelect';
import {
  simulationSpeedControlBarConfig,
  boardSizeControlBarConfig,
  modeControlBarConfig,
  MODE_TYPE,
} from './../../constants';

import ControlContext from '../../contexts';

const ControlBar = () => {
  console.log('control bar');

  const {
    simulationSpeed,
    handleSimulationSpeedChange,
    boardSize,
    handleBoardSizeChange,
    mode,
    handleModeChange,
    isSimulating,
    toggleSimulation,
  } = useContext(ControlContext);

  return (
    <Container>
      <ControlSelect
        {...modeControlBarConfig}
        value={mode}
        handleChange={handleModeChange}
        isDisabled={isSimulating ? true : false}
      />
      {mode === MODE_TYPE.simulation && (
        <ControlSelect
          {...simulationSpeedControlBarConfig}
          value={simulationSpeed}
          handleChange={handleSimulationSpeedChange}
          isDisabled={isSimulating ? true : false}
        />
      )}
      <ControlSelect
        {...boardSizeControlBarConfig}
        value={boardSize}
        handleChange={handleBoardSizeChange}
        isDisabled={isSimulating ? true : false}
      />
      {mode === MODE_TYPE.simulation && (
        <PlayPauseButton
          title={isSimulating ? 'click to stop' : 'click to start'}
          onClick={toggleSimulation}
        >
          {isSimulating ? '⏹️' : '▶️'}
        </PlayPauseButton>
      )}
    </Container>
  );
};

export default ControlBar;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  background-color: var(--clr-primary);
  width: 100%;
  gap: 5rem;

  padding: 1rem 0;
`;

const PlayPauseButton = styled(Button)`
  /* margin-left: 10rem; */
  border-radius: 50%;
  padding: 1rem;
  border: 2px solid var(--clr-white);
  font-size: 3rem;
`;
