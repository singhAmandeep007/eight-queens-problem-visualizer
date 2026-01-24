import React, { useState, useCallback, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import { checkConflictMethods, CHESS_PIECE_TYPE } from "../../constants";
import type { ChessPieceTypeValue } from "../../constants";
import type { ChessPieceTypeOption, ShowAlertArgs } from "../../types";

interface SquareProps {
  boardSize: number;
  isOdd: boolean;
  isPlaced: boolean;
  positions: number[];
  position: number;
  updatePosition: (isQueenPlaced: boolean, position: number) => void;
  chessPieceType: ChessPieceTypeOption;
  showAlertMessage: (args?: ShowAlertArgs) => void;
}

/**
 * Get all positions that are attacking a given square
 */
function getAttackingPositions(
  chessPieceType: ChessPieceTypeValue,
  position: number,
  existingPositions: number[]
): number[] {
  const attackers: number[] = [];
  const { r: r1, c: c1 } = checkConflictMethods.getRowAndColumn(position);

  for (const existingPosition of existingPositions) {
    const { r: r2, c: c2 } = checkConflictMethods.getRowAndColumn(existingPosition);

    let isAttacking = false;
    if (chessPieceType === CHESS_PIECE_TYPE.queen.value) {
      isAttacking = checkConflictMethods.queen({ r1, r2, c1, c2 });
    } else if (chessPieceType === CHESS_PIECE_TYPE.bishop.value) {
      isAttacking = checkConflictMethods.bishop({ r1, r2, c1, c2 });
    } else if (chessPieceType === CHESS_PIECE_TYPE.rook.value) {
      isAttacking = checkConflictMethods.rook({ r1, r2, c1, c2 });
    } else if (chessPieceType === CHESS_PIECE_TYPE.knight.value) {
      isAttacking = checkConflictMethods.knight({ r1, r2, c1, c2 });
    }

    if (isAttacking) {
      attackers.push(existingPosition);
    }
  }

  return attackers;
}

const Square = ({
  boardSize,
  isOdd,
  isPlaced,
  positions,
  position,
  updatePosition,
  chessPieceType,
  showAlertMessage,
}: SquareProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [showConflictFlash, setShowConflictFlash] = useState(false);

  // Get attacking pieces for this square
  const attackingPositions = useMemo(
    () => getAttackingPositions(chessPieceType.value as ChessPieceTypeValue, position, positions),
    [chessPieceType.value, position, positions]
  );

  const isAttacking = attackingPositions.length > 0;
  const attackerCount = attackingPositions.length;

  const handleClick = useCallback(() => {
    if (!(isPlaced || positions.length < boardSize)) {
      // Trigger shake animation for invalid placement
      setShowShake(true);
      setTimeout(() => setShowShake(false), 400);
      showAlertMessage({
        message: `Cannot place more than ${boardSize} ${chessPieceType.value}s`,
        variant: "warning",
      });
    } else if (!isPlaced && isAttacking) {
      // Trigger conflict flash when trying to place on attacked square
      setShowConflictFlash(true);
      setTimeout(() => setShowConflictFlash(false), 300);
      updatePosition(isPlaced, position);
    } else {
      updatePosition(isPlaced, position);
    }
  }, [
    isPlaced,
    positions.length,
    boardSize,
    isAttacking,
    updatePosition,
    position,
    showAlertMessage,
    chessPieceType.value,
  ]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const className = `${isOdd ? "white" : "black"} ${isAttacking ? "occupied" : ""} ${showShake ? "shake" : ""} ${showConflictFlash ? "conflict-flash" : ""}`;

  return (
    <SquareEl
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      $chessPieceType={chessPieceType.icon}
      $isHovered={isHovered}
      $isPlaced={isPlaced}
    >
      {/* Position coordinate */}
      <PositionLabel className="position">{position}</PositionLabel>

      {/* Placed piece with animation */}
      <AnimatePresence mode="wait">
        {isPlaced && (
          <PieceWrapper
            key={`piece-${position}`}
            initial={{ scale: 0.5, opacity: 0, x: "-50%", y: "-50%" }}
            animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
            exit={{ scale: 0.5, opacity: 0, x: "-50%", y: "-50%" }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {chessPieceType.icon}
          </PieceWrapper>
        )}
      </AnimatePresence>

      {/* Ghost preview on hover (only when not placed) */}
      <AnimatePresence>
        {isHovered && !isPlaced && (
          <GhostPiece
            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
            animate={{ opacity: isAttacking ? 0.15 : 0.35, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
            transition={{ duration: 0.12 }}
          >
            {chessPieceType.icon}
          </GhostPiece>
        )}
      </AnimatePresence>

      {/* Threat indicator badge */}
      <AnimatePresence>
        {isHovered && !isPlaced && positions.length > 0 && (
          <ThreatBadge
            $isSafe={!isAttacking}
            initial={{ opacity: 0, y: 4, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 4, scale: 0.9, x: "-50%" }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {isAttacking ? `Attacked by ${attackerCount}` : "Safe"}
          </ThreatBadge>
        )}
      </AnimatePresence>
    </SquareEl>
  );
};

export default Square;

// Shake animation keyframes
const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
  20%, 40%, 60%, 80% { transform: translateX(3px); }
`;

// Conflict flash animation
const conflictFlashAnimation = keyframes`
  0% { box-shadow: inset 0 0 0 999px rgba(255, 59, 92, 0.35); }
  100% { box-shadow: inset 0 0 0 999px rgba(255, 59, 92, 0.14); }
`;

const SquareEl = styled.div<{ $chessPieceType: string; $isHovered: boolean; $isPlaced: boolean }>`
  position: relative;
  width: 8rem;
  height: 8rem;
  text-align: center;
  font-size: 5rem;
  user-select: none;
  cursor: pointer;
  transition: box-shadow 0.15s ease;

  /* Classic high-contrast board */
  &.black {
    background-color: #2a2f3a;
    color: rgba(255, 255, 255, 0.92);
  }
  &.white {
    background-color: #f2f4f8;
    color: rgba(20, 22, 26, 0.92);
  }

  /* Clean grid separation */
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);

  /* Hover state with accent glow */
  &:hover {
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.16),
      inset 0 0 0 999px rgba(1, 173, 228, 0.12);
  }

  /* Attacked square highlight */
  &.occupied {
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.16),
      inset 0 0 0 999px rgba(255, 59, 92, 0.14);
  }

  /* Attacked + hover = stronger warning */
  &.occupied:hover {
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.16),
      inset 0 0 0 999px rgba(255, 59, 92, 0.22);
  }

  /* Shake animation for invalid placement */
  &.shake {
    animation: ${shakeAnimation} 0.4s ease;
  }

  /* Conflict flash animation */
  &.conflict-flash {
    animation: ${conflictFlashAnimation} 0.3s ease;
  }
`;

const PositionLabel = styled.div`
  position: absolute;
  font-size: 30%;
  height: 30%;
  width: 30%;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.35);
  pointer-events: none;

  .black & {
    color: rgba(255, 255, 255, 0.45);
  }
  .white & {
    color: rgba(0, 0, 0, 0.35);
  }
`;

const PieceWrapper = styled(motion.span)`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.35));
  pointer-events: none;
  z-index: 2;
`;

const GhostPiece = styled(motion.span)`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  pointer-events: none;
  z-index: 1;
  filter: grayscale(0.3);
`;

const ThreatBadge = styled(motion.div)<{ $isSafe: boolean }>`
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);

  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;

  padding: 0.25rem 0.5rem;
  border-radius: 6px;

  pointer-events: none;
  z-index: 10;

  ${({ $isSafe }) =>
    $isSafe
      ? css`
          background: rgba(34, 197, 94, 0.18);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: rgba(34, 197, 94, 1);
        `
      : css`
          background: rgba(255, 59, 92, 0.18);
          border: 1px solid rgba(255, 59, 92, 0.3);
          color: rgba(255, 59, 92, 1);
        `}
`;
