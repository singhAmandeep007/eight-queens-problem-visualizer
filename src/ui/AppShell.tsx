import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

export interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <Root>
      <TopNav aria-label="Primary navigation">
        <NavInner>
          <Brand
            to="/"
            aria-label="Eight Queens Home"
          >
            Eight Queens
          </Brand>

          <NavLinks>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `app-shell__navlink ${isActive ? "is-active" : ""}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/chess"
              className={({ isActive }) => `app-shell__navlink ${isActive ? "is-active" : ""}`}
            >
              Chess
            </NavLink>
          </NavLinks>
        </NavInner>
      </TopNav>

      <Main>{children}</Main>

      <Footer>
        <FooterInner>
          <p>
            Developed by{" "}
            <a
              href="https://singhamandeep007.github.io/"
              target="_blank"
              rel="noreferrer"
            >
              Amandeep Singh
            </a>
          </p>
        </FooterInner>
      </Footer>
    </Root>
  );
}

const Root = styled.div`
  min-height: 100vh;
  color: rgba(255, 255, 255, 0.92);

  /* Dark premium background */
  background: radial-gradient(1200px 700px at 10% 0%, rgba(1, 173, 228, 0.16), rgba(0, 0, 0, 0)),
    radial-gradient(900px 560px at 90% 20%, rgba(140, 72, 255, 0.12), rgba(0, 0, 0, 0)),
    linear-gradient(180deg, rgba(10, 12, 16, 1), rgba(6, 8, 11, 1));
`;

const TopNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 30;

  /* Premium glass */
  backdrop-filter: blur(14px);
  background: rgba(8, 10, 14, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const NavInner = styled.div`
  width: min(1100px, 100%);
  margin: 0 auto;
  padding: 1.1rem 1.6rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
`;

const Brand = styled(Link)`
  text-decoration: none;
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.6rem;
  letter-spacing: 0.2px;
  font-weight: 750;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0.9rem;

  .app-shell__navlink {
    text-decoration: none;
    font-size: 1.3rem;

    padding: 0.6rem 0.9rem;
    border-radius: 999px;

    color: rgba(255, 255, 255, 0.78);
    background: transparent;

    border: 1px solid transparent;

    transition:
      background 160ms ease,
      color 160ms ease,
      transform 160ms ease,
      border-color 160ms ease;
  }

  .app-shell__navlink:hover {
    color: rgba(255, 255, 255, 0.92);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }

  .app-shell__navlink.is-active {
    color: rgba(255, 255, 255, 0.96);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 56px);
  padding: 3.2rem 1.6rem 2rem;

  width: min(1100px, 100%);
  margin: 0 auto;
`;

const Footer = styled.footer`
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 10, 14, 0.65);
  backdrop-filter: blur(12px);
`;

const FooterInner = styled.div`
  width: min(1100px, 100%);
  margin: 0 auto;
  padding: 1.6rem;

  p {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.7);
  }

  a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
    text-decoration-color: rgba(255, 255, 255, 0.25);
  }
`;
