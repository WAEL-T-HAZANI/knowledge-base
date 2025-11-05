/**
 * ✅ React 19-safe shim for react-joyride
 * ReactDOM is frozen, so we can’t mutate it directly.
 * Instead, we create a Proxy that provides the missing APIs.
 */
import * as ReactDOMOriginal from "react-dom";

const ReactDOM: any = new Proxy(ReactDOMOriginal, {
  get(target, prop) {
    if (prop === "unmountComponentAtNode") {
      return (container: Element | DocumentFragment | null) => {
        if (container && (container as Element).firstChild) {
          (container as Element).innerHTML = "";
        }
        return true;
      };
    }

    if (prop === "unstable_renderSubtreeIntoContainer") {
      return (
        _parentComponent: any,
        element: any,
        container: Element | DocumentFragment,
        callback?: () => void
      ) => {
        try {
          const root = (target as any).createRoot
            ? (target as any).createRoot(container)
            : (target as any);
          root.render
            ? root.render(element)
            : (target as any).render(element, container);
          if (callback) callback();
        } catch (e) {
          console.error("Joyride shim render failed:", e);
        }
        return element;
      };
    }

    // Default: return the original property
    return Reflect.get(target, prop);
  },
});

// Expose globally so react-joyride uses this version
(globalThis as any).ReactDOM = ReactDOM;

export {}; // module side-effect only
