import { createGlobalStyle } from 'styled-components';
import { breakpoints } from './constants';

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

:root{
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


::-webkit-scrollbar-track
{
  background-color: #F5F5F5;
}

::-webkit-scrollbar
{
  width: 5px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
  background-color: #000000;
  border: 2px solid #555555;
}



`;
