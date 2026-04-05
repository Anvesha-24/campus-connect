import { useEffect, useRef } from "react";

export default function ChromaBG({ projectId }) {
  const elementRef = useRef(null);

  useEffect(() => {
    // 1. Script Loader
    const initializeScript = (callback) => {
      const scriptId = "unicorn-studio-script";
      let script = document.getElementById(scriptId);

      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://cdn.unicorn.studio/v1.2.3/unicornStudio.umd.js";
        script.async = true;
        script.onload = callback;
        document.head.appendChild(script);
      } else {
        // Script already exists, just run the callback
        callback();
      }
    };

    // 2. Initializer
    const initializeUnicornStudio = () => {
      if (!projectId || !elementRef.current) return;
      
      // Set the project ID to the div
      elementRef.current.setAttribute("data-us-project", projectId);

      if (window.UnicornStudio) {
        // Re-init for SPA navigation
        window.UnicornStudio.init().then((scenes) => {
          console.log("UnicornStudio ready:", scenes);
        });
      }
    };

    initializeScript(initializeUnicornStudio);

    // 3. CLEANUP (Crucial for React)
    return () => {
      if (window.UnicornStudio && typeof window.UnicornStudio.destroy === 'function') {
        window.UnicornStudio.destroy();
      }
    };
  }, [projectId]);

  return (
    <div
      ref={elementRef}
      data-us-dpi="1.5"
      data-us-scale="1"
      data-us-fps="60"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -50, // Pushed way back
        pointerEvents: "none", // Ensures you can still click buttons on top
        background: "transparent"
      }}
    />
  );
}