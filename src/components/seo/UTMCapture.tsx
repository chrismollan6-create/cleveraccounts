"use client";

import { useEffect } from "react";
import { captureUTMParams } from "./GoogleTagManager";

export default function UTMCapture() {
  useEffect(() => {
    captureUTMParams();
  }, []);

  return null;
}
