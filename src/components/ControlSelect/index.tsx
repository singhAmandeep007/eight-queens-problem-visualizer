import React from "react";
import styled from "styled-components";

type OptionValue = string | number | boolean;

export interface ControlSelectProps<TValue extends OptionValue = string> {
  id: string;
  label: string;
  value: TValue;
  /**
   * Keys are what you show in the UI; values are what you store/pass to the handler.
   *
   * Example:
   *  { "8 x 8": 8, "10 x 10": 10 }
   */
  options: Record<string, TValue>;
  handleChange: (value: TValue) => void;
  isDisabled?: boolean;
  className?: string;
}

export default function ControlSelect<TValue extends OptionValue = string>({
  id,
  options,
  label,
  value,
  handleChange,
  isDisabled = false,
  className,
}: ControlSelectProps<TValue>) {
  return (
    <ControlContainer className={className}>
      <ControlLabel
        $disabled={isDisabled}
        htmlFor={id}
      >
        {label}
      </ControlLabel>

      <SelectContainer $disabled={isDisabled}>
        <Select
          id={id}
          name={id}
          aria-label={label}
          value={String(value)}
          onChange={(e) => {
            const raw = e.target.value;

            // HTMLSelectElement always provides a string, so:
            // - If the current value is a number, coerce to number.
            // - Otherwise pass the string through.
            const nextValue = typeof value === "number" ? (Number(raw) as TValue) : (raw as TValue);

            handleChange(nextValue);
          }}
          disabled={isDisabled}
        >
          {Object.entries(options).map(([optionLabel, optionValue], i) => (
            <option
              key={`${optionLabel}-${String(optionValue)}-${i}`}
              value={String(optionValue)}
            >
              {optionLabel}
            </option>
          ))}
        </Select>
      </SelectContainer>
    </ControlContainer>
  );
}

const ControlContainer = styled.div`
  margin-top: 0.5rem;
`;

const ControlLabel = styled.label<{ $disabled: boolean }>`
  color: var(--clr-white);
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 300;

  opacity: ${(props) => (props.$disabled ? "0.5" : "1")};

  @media (max-width: 1000px) {
    font-size: 1.5rem;
  }
`;

const SelectContainer = styled.div<{ $disabled: boolean }>`
  position: relative;
  border: 2px solid var(--clr-white);

  background: var(--clr-secondary);
  overflow: hidden;
  border-radius: 5px;
  margin-bottom: 2rem;
  margin-top: 1rem;

  width: min(20rem, 200px);

  padding: 0.8rem 0;

  opacity: ${(props) => (props.$disabled ? "0.5" : "1")};

  &:after {
    content: "🔽";
    position: absolute;
    right: 0px;
    bottom: 0;
    top: 50%;
    transform: translate(-50%, -50%);

    background: var(--clr-secondary);
    pointer-events: none;
    font-size: 1.6rem;
    margin-bottom: -3px;
  }
`;

const Select = styled.select`
  font-size: 1.5rem;

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
  padding-left: 1.5rem;
  color: var(--clr-white);
  cursor: pointer;

  option {
    text-transform: capitalize;
  }
`;
