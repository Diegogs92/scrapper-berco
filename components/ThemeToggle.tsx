'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggle}
      className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 group overflow-hidden"
      aria-label="Cambiar tema"
    >
      <div className="relative z-10 flex items-center gap-2">
        <div className="relative w-4 h-4">
          <Moon
            className={`h-4 w-4 absolute transition-all duration-300 ${
              isLight ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
            }`}
          />
          <Sun
            className={`h-4 w-4 absolute transition-all duration-300 ${
              isLight ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
            }`}
          />
        </div>
        <span className="text-sm font-medium">
          {isLight ? 'Oscuro' : 'Claro'}
        </span>
      </div>
    </button>
  );
}
