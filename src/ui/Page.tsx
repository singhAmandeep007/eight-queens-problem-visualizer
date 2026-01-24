import React from "react";
import { motion, type Transition, type Variants } from "framer-motion";
import styled from "styled-components";

export interface PageProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  /**
   * Optional page-level actions shown on the right side of the header (e.g. buttons, links).
   */
  headerRight?: React.ReactNode;
  /**
   * Optional footer content. If omitted, no footer is rendered.
   */
  footer?: React.ReactNode;
  /**
   * When true, removes the default max-width container and lets children span full width.
   */
  fullBleed?: boolean;
  /**
   * Optional test id.
   */
  "data-testid"?: string;
}

const pageVariants: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  enter: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(6px)" },
};

const pageTransition: Transition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1],
};

/**
 * Shared animated page wrapper for route transitions.
 *
 * - Designed to be used as the root element inside a routed page.
 * - Works well with <AnimatePresence mode="wait" /> for route transitions.
 */
export default function Page({
  title,
  subtitle,
  headerRight,
  children,
  footer,
  fullBleed,
  "data-testid": dataTestId,
}: PageProps) {
  return (
    <Root
      data-testid={dataTestId}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Container $fullBleed={!!fullBleed}>
        {(title || subtitle || headerRight) && (
          <Header>
            <HeaderLeft>
              {title && <h1>{title}</h1>}
              {subtitle && <p>{subtitle}</p>}
            </HeaderLeft>
            {headerRight && <HeaderRight>{headerRight}</HeaderRight>}
          </Header>
        )}

        {children}

        {footer && <Footer>{footer}</Footer>}
      </Container>
    </Root>
  );
}

const Root = styled(motion.main)`
  min-height: calc(100vh - 56px);
  padding: 3.2rem 1.6rem 1.8rem;
`;

const Container = styled.div<{ $fullBleed: boolean }>`
  width: ${({ $fullBleed }) => ($fullBleed ? "100%" : "min(1100px, 100%)")};
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 2.4rem;
`;

const HeaderLeft = styled.div`
  min-width: 0;

  h1 {
    font-size: 3.2rem;
    font-weight: 600;
    line-height: 1.1;
    margin: 0 0 0.8rem 0;
    letter-spacing: -0.2px;
    color: rgba(255, 255, 255, 0.92);
  }

  p {
    margin: 0;
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.72);
    max-width: 70ch;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const Footer = styled.footer`
  width: 100%;
  margin: 2.2rem 0 0;
  padding-top: 1.2rem;

  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;
