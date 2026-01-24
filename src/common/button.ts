import styled from "styled-components";

/**
 * Shared Button primitive (Dark Premium)
 *
 * Goals:
 * - Neutral-by-default styling that works on dark surfaces
 * - Clean hover/active micro-interactions
 * - Visible focus ring (keyboard accessibility)
 *
 * If a specific button needs a different look (primary/ghost/danger),
 * extend this component via styled(Button)`...`.
 */
const Button = styled.button`
  appearance: none;
  -webkit-appearance: none;

  /* Reset legacy styles */
  margin: 0;
  text-shadow: none;
  letter-spacing: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  white-space: nowrap;
  user-select: none;
  cursor: pointer;

  border-radius: 999px;
  padding: 0.85rem 1.1rem;

  font-size: 1.35rem;
  font-weight: 650;
  line-height: 1;

  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);

  transition:
    transform 140ms ease,
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow:
      0 16px 45px rgba(0, 0, 0, 0.36),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  &:active {
    transform: translateY(0px);
    background: rgba(255, 255, 255, 0.085);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow:
      0 16px 45px rgba(0, 0, 0, 0.36),
      0 0 0 3px rgba(1, 173, 228, 0.35);
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

export default Button;
