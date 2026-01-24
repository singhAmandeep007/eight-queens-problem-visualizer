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

      <SelectContainer
        $disabled={isDisabled}
        aria-disabled={isDisabled}
      >
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

        <Caret
          aria-hidden="true"
          viewBox="0 0 20 20"
          focusable="false"
        >
          <path d="M5.4 7.4a1 1 0 0 1 1.4 0L10 10.6l3.2-3.2a1 1 0 1 1 1.4 1.4l-3.9 3.9a1 1 0 0 1-1.4 0L5.4 8.8a1 1 0 0 1 0-1.4Z" />
        </Caret>
      </SelectContainer>
    </ControlContainer>
  );
}

const ControlContainer = styled.div`
  display: grid;
  gap: 0.55rem;
`;

const ControlLabel = styled.label<{ $disabled: boolean }>`
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.1px;

  opacity: ${(props) => (props.$disabled ? "0.5" : "1")};
`;

const SelectContainer = styled.div<{ $disabled: boolean }>`
  position: relative;

  width: min(220px, 22rem);
  height: 44px;

  border-radius: 14px;
  overflow: hidden;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);

  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.32);

  opacity: ${(props) => (props.$disabled ? "0.55" : "1")};

  transition:
    transform 140ms ease,
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.075);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:focus-within {
    border-color: rgba(1, 173, 228, 0.55);
    box-shadow:
      0 16px 44px rgba(0, 0, 0, 0.38),
      0 0 0 3px rgba(1, 173, 228, 0.22);
  }
`;

const Select = styled.select`
  height: 100%;
  width: 100%;

  margin: 0;
  padding: 0 44px 0 14px;

  font-size: 1.3rem;
  font-weight: 650;
  letter-spacing: -0.1px;

  color: rgba(255, 255, 255, 0.9);
  background: transparent;

  border: 0;
  outline: 0;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  cursor: pointer;

  option {
    color: #0b0d12;
    background: #ffffff;
    text-transform: capitalize;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const Caret = styled.svg`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  width: 18px;
  height: 18px;

  color: rgba(255, 255, 255, 0.75);

  pointer-events: none;

  path {
    fill: currentColor;
  }
`;
