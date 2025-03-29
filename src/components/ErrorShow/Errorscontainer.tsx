import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ErrorsContainerProps {
  errorshow: string;
}

const ErrorsContainer = ({ errorshow }: ErrorsContainerProps) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      let element = document.getElementById("errors-portal-container");

      if (!element) {
        element = document.createElement("div");
        element.id = "errors-portal-container";
        document.body.appendChild(element);
      }

      setPortalElement(element);
    }
  }, []);

  if (!portalElement) return null;

  return createPortal(
    <div className="errorsshower fixed w-full top-4 flex flex-col items-center gap-[10px] z-50">
      {errorshow && (
        <div
          style={{
            zIndex: 9999,
          }}
          className="text-lg border-4 border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4 px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
        >
          <span className="relative z-10">{errorshow}</span>
        </div>
      )}
    </div>,
    portalElement
  );
};

export default ErrorsContainer;
