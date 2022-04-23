import React from 'react';
import styled from 'styled-components';
import Chessboard from '../Chessboard';
import ControlBar from '../ControlBar';

import { ControlContextProvider } from '../../contexts';

const Dashboard = () => {
  return (
    <Container>
      <ControlContextProvider>
        <ControlBar />
        <Chessboard />
      </ControlContextProvider>
    </Container>
  );
};

export default Dashboard;

const Container = styled.div`
  display: grid;
  grid-auto-rows: max-content 1fr;
  justify-items: center;

  position: relative;
`;
