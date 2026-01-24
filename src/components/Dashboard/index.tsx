import React from "react";
import styled from "styled-components";
import Chessboard from "../Chessboard";
import ControlBar from "../ControlBar";

import { ControlContextProvider, AlertContextProvider } from "../../contexts";

const Dashboard = () => {
  return (
    <Container>
      <ControlContextProvider>
        <ControlBar />
        <AlertContextProvider>
          <Chessboard />
        </AlertContextProvider>
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
