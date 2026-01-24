import { createGlobalStyle } from "styled-components";
import { breakpoints } from "./constants";

//https://piccalil.li/blog/a-modern-css-reset/
export default createGlobalStyle`
/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
	font-family: 'Montserrat', sans-serif;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role='list'],
ol[role='list'] {
  list-style: none;
}

/* Set core root defaults */
html:focus-within {
  scroll-behavior: smooth;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;

  background: var(--bg);
  color: var(--text);
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
		scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
/* ///////////////////////////////////////////////////////////////////////// */

/**
 * Dark premium tokens
 * - Keep the existing --clr-* variables for legacy components
 * - Introduce a coherent new system for the reface (bg/surface/text/accent)
 */
:root{
  /* New tokens (reface) */
  --bg: #07090c;
  --bg-2: #0b0f14;

  --surface: rgba(255, 255, 255, 0.06);
  --surface-2: rgba(255, 255, 255, 0.04);
  --glass: rgba(10, 12, 16, 0.72);

  --border: rgba(255, 255, 255, 0.10);
  --border-2: rgba(255, 255, 255, 0.06);

  --text: rgba(255, 255, 255, 0.92);
  --text-2: rgba(255, 255, 255, 0.74);
  --text-3: rgba(255, 255, 255, 0.62);

  --accent: #01ADE4;
  --accent-2: #8c48ff;

  --shadow-lg: 0 28px 90px rgba(0, 0, 0, 0.55);
  --shadow-md: 0 20px 70px rgba(0, 0, 0, 0.40);

  /* Legacy tokens (kept for now; we'll migrate components off these) */
	--clr-primary: #01ADE4;

	--clr-primary-light:#01ADE4;
	--clr-primary-background:#01ade43d;
	--clr-primary-background-1:#00000008;

	--clr-secondary:#446cb2;

	--clr-font: #000000;

	--clr-white:#fff;
	--clr-dark:#000;

}

html {
	@media only screen and (min-width: ${breakpoints.bpXXLarge}) {
			font-size: 75% !important; // 12px
	}
	@media only screen and (max-width: ${breakpoints.bpXXLarge}) {
		font-size:  62.5%  !important; // 10px
	}
	@media only screen and (max-width: ${breakpoints.bpMedium}) {
		font-size:  50%  !important; // 8px
	}
	@media only screen and (max-width: ${breakpoints.bpSmall}) {
		font-size:  37.5%  !important; // 6px
	}
}

/* Premium dark background */
body {
  background:
    radial-gradient(1200px 600px at 12% -10%, rgba(1, 173, 228, 0.16), rgba(0, 0, 0, 0)),
    radial-gradient(900px 520px at 88% 10%, rgba(140, 72, 255, 0.14), rgba(0, 0, 0, 0)),
    linear-gradient(180deg, var(--bg-2), var(--bg));
  color: var(--text);
}

/* Links */
a {
  color: rgba(255, 255, 255, 0.86);
}
a:hover {
  color: rgba(255, 255, 255, 0.94);
}

/* Scrollbar (dark) */
::-webkit-scrollbar-track
{
  background-color: rgba(255, 255, 255, 0.06);
}

::-webkit-scrollbar
{
  width: 6px;
  background-color: rgba(255, 255, 255, 0.06);
}

::-webkit-scrollbar-thumb
{
  background-color: rgba(255, 255, 255, 0.18);
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}
`;
