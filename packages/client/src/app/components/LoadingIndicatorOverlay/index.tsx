import React, { useEffect } from "react";
import { classes } from "./styles";
import ReactDOM from "react-dom";
import { LoadingIndicator } from "../LoadingIndicator";

export const LoadingIndicatorOverlay: React.FC = () => {
  useEffect(() => {
    const layer = document.createElement("div");
    layer.className = classes.root;

    document.body.appendChild(layer);

    ReactDOM.createPortal(<LoadingIndicator />, layer);
    return () => {
      document.body.removeChild(layer);
    };
  }, []);

  return null;
};
