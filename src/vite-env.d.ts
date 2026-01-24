/// <reference types="vite/client" />

// SVGs imported with `?react` are transformed into React components via `vite-plugin-svgr`.
declare module "*.svg?react" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

  export default ReactComponent;
}

// Common static asset imports used by the app.
declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}
