import React from "react";
import styled from "styled-components";

const Alert = ({ variant, children }) => {
  return <AlertWrapper className={`${variant}`}>{children}</AlertWrapper>;
};

export default Alert;

const AlertWrapper = styled.div`
  font-size: 2rem;
  position: fixed;
  top: 3rem;
  right: 3rem;

  min-height: 3rem;
  padding: 1.5rem 1.5rem;
  margin: 0px auto;
  border-radius: 5px;
  border-left: 10px solid;
  opacity: 1;
  transition: opacity 0.6s;
  max-width: 50%;
  overflow: hidden;

  &.warning {
    background: rgba(244, 215, 201);
    color: #d93025;
    border-color: #d93025;
  }
  &.info {
    background: rgba(186, 208, 228);
    color: #00539f;
    border-color: #00539f;
  }
  &.success {
    background: #edf7ee;
    color: #4caf50;
    border-color: #4caf50;
  }
  &.tip {
    background: #fff5e6;
    color: #ff9800;
    border-color: #ff9800;
  }
`;
