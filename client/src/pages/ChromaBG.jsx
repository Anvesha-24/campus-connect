import { useEffect, useRef } from "react";

export default function ChromaBG({ projectId }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const initializeScript = (callback) => {
      const existingScript = document.querySelector(
        'script[src^="https://cdn.unicorn.studio"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.unicorn.studio/v1.2.3/unicornStudio.umd.js";
        script.onload = callback;
        document.head.appendChild(script);
      } else {
        callback();
      }
    };

    const initializeUnicornStudio = () => {
      if (!projectId) return;
      elementRef.current.setAttribute("data-us-project", projectId);

      if (window.UnicornStudio) {
        window.UnicornStudio.destroy();
        window.UnicornStudio.init().then((scenes) => {
          console.log("UnicornStudio scenes loaded:", scenes);
        });
      }
    };

    initializeScript(initializeUnicornStudio);
  }, [projectId]);

  return (
  <div
    ref={elementRef}
    data-us-dpi="1.5"
    data-us-scale="1"
    data-us-fps="60"
    style={{
      position: "fixed",  // stays fixed behind everything
      inset: 0,           // top:0, right:0, bottom:0, left:0
      width: "100%",
      height: "100%",
      zIndex: -1,         // push it behind your page content
    }}
  />
);
}
