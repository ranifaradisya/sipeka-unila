"use client";

import { useEffect } from "react";

export default function DevRoleSwitcher() {
  useEffect(() => {
    localStorage.setItem("dev_mock_role", "pimpinan");
    window.location.reload();
  }, []);

  return null;
}
