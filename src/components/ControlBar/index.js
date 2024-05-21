import React, { useContext } from "react";
import styled from "styled-components";
import Button from "../../common/button";

import { ReactComponent as StopSvg } from "./../../assets/stop.svg";
import { ReactComponent as PlaySvg } from "./../../assets/play.svg";

import ControlSelect from "../ControlSelect";
import {
  simulationSpeedControlBarConfig,
  boardSizeControlBarConfig,
  modeControlBarConfig,
  chessPieceTypeControlBarConfig,
  MODE_TYPE,
} from "./../../constants";

import { ControlContext } from "../../contexts";

const ControlBar = () => {
  const {
    simulationSpeed,
    handleSimulationSpeedChange,
    boardSize,
    handleChessPieceTypeChange,
    handleBoardSizeChange,
    mode,
    chessPieceType,
    handleModeChange,
    isSimulating,
    toggleSimulation,
  } = useContext(ControlContext);

  return (
    <Container>
      <ControlSelect
        {...chessPieceTypeControlBarConfig}
        options={Object.entries(chessPieceTypeControlBarConfig.options).reduce((acc, [key, optionValue]) => {
          return { ...acc, [optionValue.value]: optionValue.value };
        }, {})}
        value={chessPieceType.value}
        handleChange={handleChessPieceTypeChange}
        isDisabled={isSimulating ? true : false}
      />
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
          title={isSimulating ? "click to stop" : "click to start"}
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
  gap: 4rem;

  padding: 1rem 0;

  border-top: 2px solid var(--clr-secondary);
  border-bottom: 2px solid var(--clr-secondary);

  @media (max-width: 1200px) {
    gap: 1rem;
    padding-left: 2rem;
    padding-right: 2rem;

    flex-wrap: wrap;

    justify-content: center;
  }
`;

const PlayPauseButton = styled(Button)`
  /* border-radius: 50%; */
  padding: 1rem;
  border: 2px solid var(--clr-white);
  font-size: 3.5rem;
  color: var(--clr-white);

  display: flex;
  justify-content: center;
  align-items: center;
`;
