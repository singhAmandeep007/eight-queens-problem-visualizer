import React from 'react';
import styled from 'styled-components';

const ControlSelect = ({
  id,
  options,
  label,
  value,
  handleChange,
  isDisabled,
}) => {
  return (
    <ControlContainer>
      <ControlLabel $disabled={isDisabled} htmlFor={id}>
        {label}
      </ControlLabel>
      <SelectContainer $disabled={isDisabled}>
        <Select
          id={id}
          name={id}
          placeholder={label}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          disabled={isDisabled}
        >
          {Object.entries(options).map(([key, value], i) => (
            <option key={key + value + i} value={value}>
              {key}
            </option>
          ))}
        </Select>
      </SelectContainer>
    </ControlContainer>
  );
};

export default ControlSelect;

const ControlContainer = styled.div`
  margin-top: 0.5rem;
`;
const ControlLabel = styled.label`
  color: var(--clr-white);
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 300;

  opacity: ${(props) => (props.$disabled ? '0.5' : '1')};
`;
const SelectContainer = styled.div`
  position: relative;

  background: var(--clr-secondary);
  overflow: hidden;
  border-radius: 5px;
  margin-bottom: 2rem;
  margin-top: 1rem;

  width: min(20rem, 200px);
  padding: 8px;

  opacity: ${(props) => (props.$disabled ? '0.5' : '1')};

  &:after {
    content: '🔽';

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;

    background: var(--clr-secondary);
    pointer-events: none;
    font-size: 30px;
  }
`;

const Select = styled.select`
  position: relative;
  display: inline-block;

  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
  outline: 0;
  box-shadow: none;
  border: 0 !important;
  background: var(--clr-secondary);
  background-image: none;

  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 0 0 5px;
  color: var(--clr-white);
  cursor: pointer;

  font-size: 20px;
`;
