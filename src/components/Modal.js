import React from 'react';
import Portal from './Portal';
import styled from 'styled-components';
import Button from './../common/button';
import { ReactComponent as CrossSvg } from './../assets/cross.svg';

export default function Modal({ onClose, children }) {
  return (
    <Portal id="portal">
      <ModalOverlay onClick={onClose}>
        <ModalContentWrapper
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <StyledButton onClick={onClose}>
            <CrossSvg />
          </StyledButton>
          <ModalContent>{children}</ModalContent>
        </ModalContentWrapper>
      </ModalOverlay>
    </Portal>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 8rem;
`;

const ModalContentWrapper = styled.div`
  border-radius: 5px;
  background-color: white;
  padding: 1rem;
  position: relative;
`;

const StyledButton = styled(Button)`
  padding: 0.5rem;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
`;

const ModalContent = styled.div`
  font-size: 1.5rem;
  h2 {
    margin-right: 4rem;
    text-decoration: underline;
  }
  h4 {
    margin: 0.8rem 0;
    text-decoration: underline;
  }
  p {
    margin-top: 0.5rem;
  }
`;
