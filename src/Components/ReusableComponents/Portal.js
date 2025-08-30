import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }) {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    let element = document.getElementById("modal-root");
    if (!element) {
      element = document.createElement("div");
      element.id = "modal-root";
      document.body.appendChild(element);
    }
    setPortalElement(element);
    return () => {
      if (element && element.childNodes.length === 0) {
        document.body.removeChild(element);
      }
    };
  }, []);

  if (!portalElement) return null;

  return createPortal(children, portalElement);
}
