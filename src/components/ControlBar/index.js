import React, { useContext } from 'react';
import styled from 'styled-components';
import Button from '../../common/button';

import { ReactComponent as StopSvg } from './../../assets/stop.svg';
import { ReactComponent as PlaySvg } from './../../assets/play.svg';

import ControlSelect from '../ControlSelect';
import {
  simulationSpeedControlBarConfig,
  boardSizeControlBarConfig,
  modeControlBarConfig,
  MODE_TYPE,
} from './../../constants';

import ControlContext from '../../contexts';

const ControlBar = () => {
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
          {isSimulating ? <StopSvg /> : <PlaySvg />}
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

  @media (max-width: 1000px) {
    gap: 1rem;
    padding-left: 2rem;
    padding-right: 2rem;

    flex-wrap: wrap;

    justify-content: center;
  }
`;

const PlayPauseButton = styled(Button)`
  /* margin-left: 10rem; */
  border-radius: 50%;
  padding: 1rem;
  border: 2px solid var(--clr-white);
  font-size: 2.5rem;
  color: var(--clr-white);

  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1000px) {
    margin-right: 14rem;
  }
`;
