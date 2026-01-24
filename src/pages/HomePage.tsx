import React, { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Transition,
  type Variants,
} from "framer-motion";
import styled from "styled-components";

const EASE_OUT: Transition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

/**
 * Scroll-parallax Home page
 * - Layered background (glows + grid + particles) driven by scroll progress
 * - Section reveal animations
 * - Reduced-motion friendly
 *
 * Notes:
 * - Works best inside a page container with a dark backdrop.
 * - Uses only styled-components + framer-motion (no external assets).
 */
export default function HomePage() {
  const reduceMotion = !!useReducedMotion();
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Track scroll progress relative to the hero section so parallax is strong early
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Smooth scroll progress for buttery parallax
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Parallax transforms (reduceMotion => flatten)
  const glowY = useTransform(p, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "22%"]);
  const gridY = useTransform(p, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "-12%"]);
  const particlesY = useTransform(p, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "18%"]);
  const heroContentY = useTransform(p, [0, 1], reduceMotion ? [0, 0] : [0, -18]);

  const heroScale = useTransform(p, [0, 1], reduceMotion ? [1, 1] : [1, 0.98]);
  const heroOpacity = useTransform(p, [0, 0.9, 1], reduceMotion ? [1, 1, 1] : [1, 0.9, 0.86]);

  const featureCards = useMemo(
    () => [
      {
        title: "Threat-map overlays",
        body: "Hover and place pieces to see safety, conflicts, and attack lines instantly.",
        tag: "Educational wow",
      },
      {
        title: "Cinematic backtracking",
        body: "Play, pause, step forward—watch the solver explore, commit, and backtrack.",
        tag: "Simulation",
      },
      {
        title: "Solutions gallery",
        body: "Browse solutions as thumbnails and animate smooth transitions between them.",
        tag: "Explore",
      },
    ],
    []
  );

  return (
    <Root>
      <Hero ref={heroRef}>
        <HeroBackground aria-hidden="true">
          <GlowLayer style={{ y: glowY, opacity: heroOpacity }} />
          <GridLayer style={{ y: gridY, opacity: heroOpacity }} />
          <ParticleLayer style={{ y: particlesY, opacity: heroOpacity }} />
          <EdgeVignette />
        </HeroBackground>

        <HeroInner
          style={{
            y: heroContentY,
            scale: heroScale,
          }}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...EASE_OUT, duration: 0.65 }}
        >
          <Kicker>Eight Queens Visualizer</Kicker>

          <HeroTitle>
            Visualize <span>Backtracking</span> like a premium product.
          </HeroTitle>

          <HeroSubtitle>
            Learn constraints through motion, layering, and micro-interactions.
            <br />
            Manual play or simulation—both designed to feel alive.
          </HeroSubtitle>

          <HeroActions>
            <PrimaryCTA to="/chess?mode=manual">Manual Mode</PrimaryCTA>
            <PrimaryCTA
              to="/chess?mode=simulation"
              style={{
                background: "linear-gradient(180deg, rgba(88, 28, 135, 1), rgba(76, 29, 149, 1))",
                boxShadow: "0 10px 34px rgba(124, 58, 237, 0.24)",
              }}
            >
              Simulation Mode
            </PrimaryCTA>
            <SecondaryCTA href="#features">See what’s new</SecondaryCTA>
          </HeroActions>

          <HeroStats>
            <StatCard
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...EASE_OUT, delay: 0.05 }}
            >
              <StatLabel>Modes</StatLabel>
              <StatValue>Manual • Simulation</StatValue>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...EASE_OUT, delay: 0.1 }}
            >
              <StatLabel>Pieces</StatLabel>
              <StatValue>Queen • Bishop • Rook • Knight</StatValue>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...EASE_OUT, delay: 0.15 }}
            >
              <StatLabel>Learning</StatLabel>
              <StatValue>Threats • Conflicts • Backtracking</StatValue>
            </StatCard>
          </HeroStats>
        </HeroInner>
      </Hero>

      <Content>
        <Section
          id="features"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={sectionVariants(reduceMotion)}
        >
          <SectionHeader>
            <h2>Designed for “wow”</h2>
            <p>Motion-led UX that explains the algorithm, guides the user, and makes every state feel alive.</p>
          </SectionHeader>

          <FeatureGrid>
            {featureCards.map((f, idx) => (
              <FeatureCard
                key={f.title}
                variants={cardVariants(reduceMotion)}
                transition={{ ...EASE_OUT, duration: 0.5, delay: reduceMotion ? 0 : idx * 0.06 }}
              >
                <FeatureTag>{f.tag}</FeatureTag>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </Section>

        <Section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          variants={sectionVariants(reduceMotion)}
        >
          <Split>
            <SplitText>
              <h2>Scroll-driven storytelling</h2>
              <p>
                The app shouldn’t just compute solutions—it should <strong>teach</strong>. The new UI uses motion to
                visualize constraints, solver steps, and backtracking decisions. The end result feels cinematic and
                educational.
              </p>

              <BulletList>
                <li>Threat-map overlays and “why invalid” explanations</li>
                <li>Step-by-step controls with timeline + counters</li>
                <li>Solution thumbnails with animated transitions</li>
              </BulletList>

              <InlineActions>
                <PrimaryCTA to="/chess">Go to Chess</PrimaryCTA>
                <GhostCTA to="/chess">I want step mode</GhostCTA>
              </InlineActions>
            </SplitText>

            <SplitVisual
              variants={visualVariants(reduceMotion)}
              transition={{ ...EASE_OUT, duration: 0.6 }}
              aria-hidden="true"
            >
              <MockCard>
                <MockHeader>
                  <MockDot />
                  <MockDot />
                  <MockDot />
                </MockHeader>
                <MockBody>
                  <MockLine style={{ width: "68%" }} />
                  <MockLine style={{ width: "54%" }} />
                  <MockLine style={{ width: "76%" }} />
                  <MockSpacer />
                  <MockPills>
                    <MockPill />
                    <MockPill />
                    <MockPill />
                  </MockPills>
                  <MockSpacer />
                  <MockGrid>
                    {Array.from({ length: 64 }).map((_, i) => (
                      <MockCell
                        key={i}
                        $alt={i % 2 === 0}
                      />
                    ))}
                  </MockGrid>
                </MockBody>
              </MockCard>
            </SplitVisual>
          </Split>
        </Section>

        <FinalCTASection
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants(reduceMotion)}
        >
          <FinalCard>
            <h2>Ready to explore?</h2>
            <p>
              Start in simulation mode for the cinematic algorithm view, or manual mode to feel the constraint logic in
              your hands.
            </p>
            <HeroActions>
              <PrimaryCTA to="/chess">Launch Visualizer</PrimaryCTA>
              <SecondaryCTA href="#features">Features</SecondaryCTA>
            </HeroActions>
          </FinalCard>
        </FinalCTASection>
      </Content>
    </Root>
  );
}

function sectionVariants(reduceMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { ...EASE_OUT, duration: 0.55 } },
  };
}

function cardVariants(reduceMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: { opacity: 1, y: 0 },
  };
}

function visualVariants(reduceMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  };
}

/* ----------------------------- styles ----------------------------- */

const Root = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  position: relative;
  overflow: hidden;

  padding: 7.2rem 1.6rem 3.8rem;
  min-height: 88vh;

  display: grid;
  align-items: center;

  @media (max-width: 900px) {
    min-height: unset;
    padding: 6.2rem 1.6rem 3.2rem;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
`;

const GlowLayer = styled(motion.div)`
  position: absolute;
  inset: -20% -10% -10% -10%;

  background: radial-gradient(900px 400px at 18% 18%, rgba(1, 173, 228, 0.22), rgba(0, 0, 0, 0)),
    radial-gradient(700px 380px at 86% 32%, rgba(68, 108, 178, 0.2), rgba(0, 0, 0, 0)),
    radial-gradient(520px 320px at 56% 78%, rgba(140, 72, 255, 0.12), rgba(0, 0, 0, 0));
  filter: saturate(1.12);
`;

const GridLayer = styled(motion.div)`
  position: absolute;
  inset: 0;
  opacity: 0.9;

  background-image: linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size:
    42px 42px,
    42px 42px;
  background-position: center;

  mask-image: radial-gradient(closest-side at 50% 35%, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
`;

const ParticleLayer = styled(motion.div)`
  position: absolute;
  inset: -10% -10% -10% -10%;

  background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px),
    radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px);
  background-size:
    120px 120px,
    180px 180px;
  background-position:
    10px 10px,
    40px 60px;

  opacity: 0.45;
  mask-image: radial-gradient(closest-side at 50% 30%, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
`;

const EdgeVignette = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(900px 520px at 50% 30%, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
`;

const HeroInner = styled(motion.div)`
  position: relative;
  width: min(1100px, 100%);
  margin: 0 auto;

  border-radius: 24px;
  padding: 2.2rem 2.2rem 1.6rem;

  background: linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.42);

  @media (max-width: 900px) {
    padding: 1.8rem 1.6rem 1.4rem;
    border-radius: 18px;
  }
`;

const Kicker = styled.div`
  font-size: 1.2rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.74);
  margin-bottom: 0.8rem;
`;

const HeroTitle = styled.h1`
  margin: 0 0 1rem;
  font-size: 4.2rem;
  line-height: 1.05;
  letter-spacing: -0.6px;

  span {
    background: linear-gradient(90deg, rgba(1, 173, 228, 1), rgba(140, 72, 255, 1));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  @media (max-width: 900px) {
    font-size: 3.3rem;
  }
`;

const HeroSubtitle = styled.p`
  margin: 0 0 1.6rem;
  font-size: 1.55rem;
  color: rgba(255, 255, 255, 0.76);
  max-width: 70ch;

  strong {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 1.1rem;
  align-items: center;
  flex-wrap: wrap;

  margin-bottom: 1.8rem;
`;

const PrimaryCTA = styled(Link)`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.95rem 1.25rem;
  border-radius: 999px;

  background: linear-gradient(180deg, rgba(1, 173, 228, 1), rgba(1, 122, 196, 1));
  color: white;
  font-weight: 650;
  font-size: 1.35rem;

  box-shadow: 0 10px 34px rgba(1, 173, 228, 0.24);
  transition:
    transform 140ms ease,
    box-shadow 140ms ease,
    filter 140ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 52px rgba(1, 173, 228, 0.3);
    filter: saturate(1.05);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const SecondaryCTA = styled.a`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.9rem 1.05rem;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);

  color: rgba(255, 255, 255, 0.84);
  font-weight: 600;
  font-size: 1.35rem;

  transition:
    transform 140ms ease,
    background 140ms ease,
    border-color 140ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.085);
    border-color: rgba(255, 255, 255, 0.16);
  }
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  border-radius: 16px;
  padding: 1.15rem 1.2rem;

  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow: 0 12px 45px rgba(0, 0, 0, 0.25);
`;

const StatLabel = styled.div`
  font-size: 1.2rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.35rem;
`;

const StatValue = styled.div`
  font-size: 1.45rem;
  color: rgba(255, 255, 255, 0.88);
  font-weight: 600;
`;

const Content = styled.div`
  width: min(1100px, 100%);
  margin: 0 auto;
  padding: 2.4rem 1.6rem 3.6rem;
`;

const Section = styled(motion.section)`
  padding: 2.6rem 0;
`;

const SectionHeader = styled.header`
  margin-bottom: 1.4rem;

  h2 {
    font-size: 2.6rem;
    margin-bottom: 0.6rem;
    letter-spacing: -0.2px;
  }

  p {
    margin: 0;
    font-size: 1.45rem;
    color: rgba(255, 255, 255, 0.72);
    max-width: 75ch;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.article)`
  border-radius: 18px;
  padding: 1.35rem 1.35rem 1.45rem;

  background: linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.035));
  border: 1px solid rgba(255, 255, 255, 0.09);

  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.35);

  h3 {
    margin: 0 0 0.6rem;
    font-size: 1.65rem;
    letter-spacing: -0.1px;
  }

  p {
    margin: 0;
    font-size: 1.35rem;
    color: rgba(255, 255, 255, 0.74);
  }
`;

const FeatureTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  font-size: 1.1rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  color: rgba(255, 255, 255, 0.68);

  padding: 0.45rem 0.7rem;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);

  margin-bottom: 0.9rem;
`;

const Split = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.8rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SplitText = styled.div`
  h2 {
    font-size: 2.5rem;
    margin: 0 0 0.8rem;
  }

  p {
    margin: 0 0 1.2rem;
    font-size: 1.45rem;
    color: rgba(255, 255, 255, 0.75);
    max-width: 75ch;
  }

  strong {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const BulletList = styled.ul`
  margin: 0 0 1.4rem;
  padding-left: 1.4rem;

  li {
    font-size: 1.35rem;
    color: rgba(255, 255, 255, 0.76);
    margin-bottom: 0.55rem;
  }
`;

const InlineActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const GhostCTA = styled(Link)`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.9rem 1.05rem;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);

  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  font-size: 1.35rem;

  transition:
    transform 140ms ease,
    background 140ms ease,
    border-color 140ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.14);
  }
`;

const SplitVisual = styled(motion.div)`
  display: grid;
  place-items: center;
`;

const MockCard = styled.div`
  width: 100%;
  max-width: 420px;

  border-radius: 18px;
  overflow: hidden;

  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
`;

const MockHeader = styled.div`
  display: flex;
  gap: 0.55rem;
  padding: 1rem 1.1rem;

  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const MockDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
`;

const MockBody = styled.div`
  padding: 1.1rem 1.1rem 1.25rem;
`;

const MockLine = styled.div`
  height: 10px;
  border-radius: 999px;
  margin-bottom: 0.75rem;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.06));
`;

const MockSpacer = styled.div`
  height: 0.8rem;
`;

const MockPills = styled.div`
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

const MockPill = styled.div`
  height: 28px;
  width: 92px;
  border-radius: 999px;
  background: rgba(1, 173, 228, 0.14);
  border: 1px solid rgba(1, 173, 228, 0.16);
`;

const MockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 6px;
`;

const MockCell = styled.div<{ $alt: boolean }>`
  aspect-ratio: 1 / 1;
  border-radius: 8px;

  background: ${({ $alt }) => ($alt ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)")};
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const FinalCTASection = styled(motion.section)`
  padding: 2.2rem 0 0;
`;

const FinalCard = styled.div`
  border-radius: 22px;
  padding: 2rem 1.8rem;

  background: linear-gradient(180deg, rgba(140, 72, 255, 0.12), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.1);

  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.42);

  h2 {
    margin: 0 0 0.7rem;
    font-size: 2.5rem;
    letter-spacing: -0.2px;
  }

  p {
    margin: 0 0 1.4rem;
    font-size: 1.45rem;
    color: rgba(255, 255, 255, 0.75);
    max-width: 75ch;
  }
`;
