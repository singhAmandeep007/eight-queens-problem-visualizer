import styled from 'styled-components';

const Button = styled.button`
  background-color: var(--clr-secondary);
  border: 1px solid var(--clr-secondary);
  white-space: nowrap;
  color: var(--clr-white);
  cursor: pointer;
  outline: none;
  font-size: 2rem;
  text-shadow: 0.1rem 0.1rem 0.5rem hsla(0, 0%, 0%, 0.5);
  letter-spacing: 0.1rem;
  border-radius: 0.5rem;
  user-select: none;
  padding: 0.5rem 2rem;
  margin: 1rem;
  transition: all 0.1s ease-in;

  ::-moz-focus-inner {
    border: 0;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  /* &:hover {
    transform: translateY(-3px);
  } */
`;

export default Button;
