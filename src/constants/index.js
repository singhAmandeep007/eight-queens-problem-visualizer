export const SIMULATION_SPEED_TYPE = {
  slow: 100,
  moderate: 50,
  fast: 0,
};
export const MODE_TYPE = {
  manual: 'manual',
  simulation: 'simulation',
};

export const simulationSpeedControlBarConfig = {
  id: 'simulationSpeed',
  options: {
    Slow: SIMULATION_SPEED_TYPE.slow,
    Moderate: SIMULATION_SPEED_TYPE.moderate,
    Fast: SIMULATION_SPEED_TYPE.fast,
  },
  label: 'Simulation Speed',
};
export const boardSizeControlBarConfig = {
  id: 'boardSize',
  options: {
    '8 x 8': 8,
    '7 x 7': 7,
    '6 x 6': 6,
    '5 x 5': 5,
    '4 x 4': 4,
  },
  label: 'Board Size',
};

export const modeControlBarConfig = {
  id: 'mode',
  options: {
    Manual: MODE_TYPE.manual,
    Simulation: MODE_TYPE.simulation,
  },
  label: 'Mode',
};

export const breakpoints = {
  // RESPONSIVE BREAKPOINTS
  bpXXLarge: '87.5em', // 1400px
  bpXLarge: '75em', // 1200px
  bpLarge: '62em', // 992px
  bpMedium: '48em', // 768px
  bpSmall: '36em', // 576px
  bpXSmall: '23.4375em', // 375px
};

export const checkIsSolved = (positions) => {
  console.log('is called');
  let isNotAttacking = true;
  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      let ax = positions[i] % 10;
      let ay = Math.trunc(positions[i] / 10);
      let bx = positions[j] % 10;
      let by = Math.trunc(positions[j] / 10);
      if (ax === bx || ay === by || Math.abs(ax - bx) === Math.abs(ay - by)) {
        isNotAttacking = false;
        break;
      }
    }
    if (!isNotAttacking) break;
  }
  return isNotAttacking;
};

export const checkIsAttacking = (position, existingPositions) => {
  let isAttacking = false;
  for (let i = 0; i < existingPositions.length; i++) {
    let ax = position % 10;
    let ay = Math.trunc(position / 10);
    let bx = existingPositions[i] % 10;
    let by = Math.trunc(existingPositions[i] / 10);
    if (ax === bx || ay === by || Math.abs(ax - bx) === Math.abs(ay - by)) {
      isAttacking = true;
      break;
    }
  }
  return isAttacking;
};
