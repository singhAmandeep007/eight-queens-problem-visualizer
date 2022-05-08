import React from 'react';
import GlobalStyles from './globalStyles';
import styled from 'styled-components';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import Modal from './components/Modal';

import { useToggle } from './hooks';

import { ReactComponent as InfoSvg } from './assets/info.svg';

function App() {
  const [isModalOpen, onModalOpen, onModalClose] = useToggle();

  return (
    <ErrorBoundary>
      <GlobalStyles />
      <main>
        <Container>
          <Title>
            {' '}
            <h1>The 8 Queens Problem Visualizer </h1>
            <InfoSvg onClick={onModalOpen} />
          </Title>

          {isModalOpen && (
            <Modal onClose={onModalClose}>
              <h2>Understanding The 8 Queens Problem </h2>
              <p>
                👑 Given a <strong>n X n</strong> chessboard. The task is to{' '}
                <strong>place n queens</strong> on the board, such that{' '}
                <strong>no two queens attack each other</strong>. We need to
                find <strong>distinct</strong> possible solutions for this
                problem.
              </p>

              <p>
                👑 By using <strong>"backtracking"</strong> - an algorithmus or
                set of clear defined instructions we can find all solutions
                systematically.
              </p>
              <p>
                👑 It’s a great little puzzle because it’s not too hard to solve
                manually, and it’s a fun programming exercise to write code to
                enumerate all the solutions.
              </p>
              <h4>Try yourself !</h4>
              <p>
                👑 You can select the <strong>type of chess piece </strong>you
                want to play with :- ( ♕ Queen, ♗ Bishop, ♖ Rock, ♘ Knight ).
              </p>
              <p>
                👑 You can select{' '}
                <strong>manual mode or simulation mode.</strong>{' '}
              </p>
              <p>
                👑 You can select{' '}
                <strong>simulation speed and board size</strong> also.{' '}
              </p>
              <p>
                👑 By clicking the any solution in the solutions list the board
                will reset to represent the solution visually.{' '}
              </p>
              <p>
                👑 Select the manual mode to and{' '}
                <strong>
                  try to find as many possible solutions that are distinct.
                </strong>
              </p>
            </Modal>
          )}
          <Dashboard />
        </Container>
      </main>
      <Footer>
        <p>
          Developed by{' '}
          <a href="https://amandeep-singh.web.app/" target="_blank">
            Amandeep Singh
          </a>
          ©2022
        </p>
      </Footer>
    </ErrorBoundary>
  );
}

export default App;

const Footer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: var(--clr-primary-background);
  color: white;
  text-align: center;
  font-size: 2.5rem;
  padding: 1rem;

  p {
    font-size: 70%;
    color: var(--clr-dark);
    a {
      color: var(--clr-secondary);
    }
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: max-content 1fr;
  text-align: center;

  height: 100vh;
`;
const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  h1 {
    font-weight: 300;
    padding: 1rem 0;
    text-align: center;
    font-size: 2.5rem;
  }
  svg {
    font-size: 3rem;
  }
`;
