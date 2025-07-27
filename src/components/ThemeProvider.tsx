// src/components/theme-provider.tsx
import { ReactNode, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
};
