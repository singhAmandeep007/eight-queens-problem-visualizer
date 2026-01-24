import type React from "react";
import { createPortal } from "react-dom";
import { usePortal } from "../hooks";

export interface PortalProps {
  id: string;
  children: React.ReactNode;
}

/**
 * Renders `children` into a DOM node managed by `usePortal(id)`.
 */
export default function Portal({ id, children }: PortalProps) {
  const target = usePortal(id);
  return createPortal(children, target);
}
