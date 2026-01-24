import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Returns the previous value for a given input.
 * The initial return value is `undefined` until the first effect runs.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function createRootElement(id: string): HTMLDivElement {
  const rootContainer = document.createElement("div");
  rootContainer.setAttribute("id", id);
  return rootContainer;
}

function addRootElement(rootElem: HTMLElement): void {
  // Insert as the last child of body (append semantics) but via insertBefore which is supported everywhere.
  const last = document.body.lastElementChild;
  if (last) {
    document.body.insertBefore(rootElem, last.nextElementSibling);
  } else {
    document.body.appendChild(rootElem);
  }
}

/**
 * Creates a detached DOM node and appends it to a DOM element with `id`.
 * If no such element exists, it creates that element and appends it to <body>.
 *
 * Intended usage:
 *   const target = usePortal("modal-root");
 *   return createPortal(children, target);
 */
export function usePortal(id: string): HTMLDivElement {
  const rootElemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure we have a detached element to attach.
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement("div");
    }

    // Look for existing target dom element to append to.
    const existingParent = document.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    // Parent is either a new root or the existing dom element.
    const parentElem = existingParent ?? createRootElement(id);

    // If there is no existing DOM element, add a new one.
    if (!existingParent) {
      addRootElement(parentElem);
    }

    // Add the detached element to the parent.
    parentElem.appendChild(rootElemRef.current);

    return () => {
      // Remove the attached element.
      rootElemRef.current?.remove();

      // If we created the parent (i.e. it didn't exist beforehand) and it's empty, remove it.
      if (!existingParent && parentElem.childNodes.length === 0) {
        parentElem.remove();
      }
    };
  }, [id]);

  // Return the detached node (or create it synchronously if accessed before effect runs).
  if (!rootElemRef.current) {
    rootElemRef.current = document.createElement("div");
  }

  return rootElemRef.current;
}

export type UseToggleReturn = [
  isToggled: boolean,
  onToggleOn: () => void,
  onToggleOff: () => void,
  onToggle: () => void,
];

/**
 * Simple boolean toggle hook.
 *
 * @returns tuple: [isToggled, onToggleOn, onToggleOff, onToggle]
 */
export function useToggle(initialState = false): UseToggleReturn {
  const [isToggled, setToggled] = useState<boolean>(initialState);

  const onToggleOn = useCallback(() => setToggled(true), []);
  const onToggleOff = useCallback(() => setToggled(false), []);
  const onToggle = useCallback(() => setToggled((prev) => !prev), []);

  return [isToggled, onToggleOn, onToggleOff, onToggle];
}
