import React, { useContext } from "react";
import styled from "styled-components";
import Button from "../../common/button";

import StopSvg from "../../assets/stop.svg?react";
import PlaySvg from "../../assets/play.svg?react";

import ControlSelect from "../ControlSelect";
import {
  boardSizeControlBarConfig,
  MODE_TYPE,
  modeControlBarConfig,
  simulationSpeedControlBarConfig,
  chessPieceTypeControlBarConfig,
} from "../../constants";
import type { ChessPiece, ControlMode } from "../../types";

import { ControlContext } from "../../contexts";

const ControlBar: React.FC = () => {
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
      <ControlSelect<ChessPiece>
        {...chessPieceTypeControlBarConfig}
        options={Object.values(chessPieceTypeControlBarConfig.options).reduce<Record<string, ChessPiece>>(
          (acc, optionValue) => {
            return { ...acc, [optionValue.value]: optionValue.value };
          },
          {}
        )}
        value={chessPieceType.value}
        handleChange={handleChessPieceTypeChange}
        isDisabled={isSimulating}
      />

      <ControlSelect<ControlMode>
        {...modeControlBarConfig}
        options={modeControlBarConfig.options as Record<string, ControlMode>}
        value={mode}
        handleChange={handleModeChange}
        isDisabled={isSimulating}
      />

      {mode === MODE_TYPE.simulation && (
        <ControlSelect<number>
          {...simulationSpeedControlBarConfig}
          options={simulationSpeedControlBarConfig.options as Record<string, number>}
          value={simulationSpeed}
          handleChange={handleSimulationSpeedChange}
          isDisabled={isSimulating}
        />
      )}

      <ControlSelect<number>
        {...boardSizeControlBarConfig}
        options={boardSizeControlBarConfig.options as Record<string, number>}
        value={boardSize}
        handleChange={handleBoardSizeChange}
        isDisabled={isSimulating}
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
