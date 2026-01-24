import React from "react";
import { useSearchParams } from "react-router-dom";
import { motion, type Transition, type Variants } from "framer-motion";
import styled from "styled-components";

import Dashboard from "../components/Dashboard";
import type { ControlMode } from "../types";

/**
 * ChessPage
 * - Wraps the existing `Dashboard` in a premium shell (glass panel + sticky header).
 * - Keeps logic untouched; this is purely layout + motion scaffolding for the reface.
 *
 * Next upgrades (to be implemented inside Dashboard subcomponents):
 * - threat-map overlay
 * - solver timeline + step controls
 * - solution gallery thumbnails + transitions
 */
export default function ChessPage() {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");
  const initialMode = (modeParam === "simulation" ? "simulation" : "manual") as ControlMode;

  return (
    <PageRoot
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Container>
        <Header>
          <TitleRow>
            <h1>Chess Visualizer</h1>
          </TitleRow>
          <p>Manual play or simulation mode. We’ll add threat-map overlays, timeline, and a solution gallery next.</p>
        </Header>

        <Shell>
          <Dashboard initialMode={initialMode} />
        </Shell>

        <HintBar
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <HintLabel>Tip</HintLabel>
          <HintText>
            Try switching between Manual and Simulation modes. Next, we’ll add “why invalid” hints and micro-animations
            for conflicts.
          </HintText>
        </HintBar>
      </Container>
    </PageRoot>
  );
}

// ------------ Motion ------------
const pageVariants: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  enter: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(6px)" },
};

const pageTransition: Transition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

// ------------ Styled Components ------------
const PageRoot = styled(motion.main)`
  min-height: calc(100vh - 56px);
  padding: 3.2rem 1.6rem 1.8rem;
`;

const Container = styled.div`
  width: min(1180px, 100%);
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 1.6rem;

  h1 {
    font-size: 3rem;
    font-weight: 650;
    line-height: 1.1;
    letter-spacing: -0.2px;
    margin: 0;
  }

  p {
    margin-top: 0.9rem;
    font-size: 1.45rem;
    color: rgba(255, 255, 255, 0.72);
    max-width: 80ch;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Shell = styled.section`
  border-radius: 18px;
  padding: 1.2rem;

  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
`;

const HintBar = styled(motion.aside)`
  margin-top: 1.2rem;

  display: flex;
  gap: 0.9rem;
  align-items: flex-start;

  border-radius: 14px;
  padding: 1rem 1.1rem;

  background: rgba(1, 173, 228, 0.1);
  border: 1px solid rgba(1, 173, 228, 0.16);
`;

const HintLabel = styled.div`
  flex: 0 0 auto;
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);

  padding: 0.35rem 0.55rem;
  border-radius: 10px;

  background: rgba(1, 173, 228, 0.18);
  border: 1px solid rgba(1, 173, 228, 0.25);
`;

const HintText = styled.p`
  margin: 0;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.45;
`;
