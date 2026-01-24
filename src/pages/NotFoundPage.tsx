import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <Root
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card>
        <Code>404</Code>
        <Title>Page not found</Title>
        <Subtitle>The page you’re trying to reach doesn’t exist (or was moved).</Subtitle>

        <Actions>
          <PrimaryButton
            as={Link}
            to="/"
          >
            Back to Home
          </PrimaryButton>

          <SecondaryLink
            as={Link}
            to="/chess"
          >
            Go to Chess →
          </SecondaryLink>
        </Actions>
      </Card>
    </Root>
  );
}

const Root = styled(motion.main)`
  min-height: calc(100vh - 56px);
  padding: 4rem 1.6rem;
  display: grid;
  place-items: center;
`;

const Card = styled.section`
  width: min(720px, 100%);
  border-radius: 18px;
  padding: 2rem 2rem 2.2rem;

  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
`;

const Code = styled.p`
  font-size: 1.4rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.8rem;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  line-height: 1.1;
  letter-spacing: -0.2px;
  margin: 0 0 0.8rem;
  color: rgba(255, 255, 255, 0.92);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  max-width: 65ch;
  color: rgba(255, 255, 255, 0.72);
  margin: 0 0 1.8rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  appearance: none;
  border: none;
  cursor: pointer;

  padding: 0.95rem 1.25rem;
  border-radius: 999px;

  background: linear-gradient(180deg, rgba(1, 173, 228, 1), rgba(1, 122, 196, 1));
  color: white;
  font-weight: 600;
  font-size: 1.35rem;

  box-shadow: 0 10px 30px rgba(1, 173, 228, 0.25);
  transition:
    transform 140ms ease,
    box-shadow 140ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 45px rgba(1, 173, 228, 0.32);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const SecondaryLink = styled.a`
  text-decoration: none;
  font-size: 1.35rem;
  color: rgba(255, 255, 255, 0.78);

  &:hover {
    color: rgba(255, 255, 255, 0.92);
    text-decoration: underline;
    text-decoration-color: rgba(255, 255, 255, 0.22);
  }
`;
