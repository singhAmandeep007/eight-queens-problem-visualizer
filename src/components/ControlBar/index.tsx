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
    <Wrapper>
      <BarContainer>
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
      </BarContainer>

      {mode === MODE_TYPE.simulation && (
        <PlayPauseButton
          title={isSimulating ? "click to stop" : "click to start"}
          onClick={toggleSimulation}
        >
          {isSimulating ? <StopSvg /> : <PlaySvg />}
        </PlayPauseButton>
      )}
    </Wrapper>
  );
};

export default ControlBar;

const Wrapper = styled.div`
  position: sticky;
  top: 1rem;
  z-index: 20;

  width: max-content;
  max-width: calc(100% - 2rem);
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  @media (max-width: 900px) {
    flex-direction: column;
    width: calc(100% - 2rem);
  }
`;

const BarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;

  padding: 0.75rem 1.5rem;

  background: rgba(10, 12, 16, 0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 99px; /* Pill shape */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  flex-wrap: wrap;
  max-width: 100%;

  /* Fix cumbersome look by standardizing items and adding hard min-width */
  & > div {
    /* Label Styling */
    label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.3rem;
      color: rgba(255, 255, 255, 0.6);
    }

    /* Select Input Container */
    & > div {
      width: 150px;
      min-width: 140px; /* Hard limit on min width */
      height: 2.8rem;

      select {
        font-size: 0.9rem;
        padding: 0.2rem 2rem 0.2rem 0.8rem;
      }
    }
  }

  @media (max-width: 900px) {
    gap: 0.8rem;
    padding: 1rem;
    border-radius: 24px;
    width: 100%;

    & > div {
      flex: 1; /* Auto-grow on mobile */
      min-width: unset;

      & > div {
        width: 100%;
        min-width: 110px;
      }
    }
  }
`;
const PlayPauseButton = styled(Button)`
  padding: 0.9rem 1.05rem;
  border-radius: 999px;

  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);

  font-size: 3.2rem;
  color: rgba(255, 255, 255, 0.92);

  display: flex;
  justify-content: center;
  align-items: center;

  transition:
    transform 140ms ease,
    background 140ms ease,
    border-color 140ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.24);
  }

  &:active {
    transform: translateY(0px);
  }
`;
