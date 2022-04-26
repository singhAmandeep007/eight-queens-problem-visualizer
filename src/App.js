import React from 'react';
import GlobalStyles from './globalStyles';
import styled from 'styled-components';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <>
      <GlobalStyles />
      <main>
        <Container>
          <Title> The 8 Queens Problem</Title>
          <Dashboard />
        </Container>
      </main>
    </>
  );
}

export default App;

const Container = styled.div`
  display: grid;
  grid-template-rows: max-content 1fr;
  text-align: center;

  height: 100vh;
`;
const Title = styled.h1`
  font-weight: 300;
  padding: 1rem 0;
  text-align: center;
  font-size: 2.5rem;
`;
