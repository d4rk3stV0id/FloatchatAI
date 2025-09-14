import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  useEffect(() => {
    // Set initial theme to dark
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Button
      variant="float"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 animate-float-gentle"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;