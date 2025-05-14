import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface SettingsContextProps {
  nightStart: number;
  nightEnd: number;
  cropBounds: string | null;
  setNightStart: (value: number) => void;
  setNightEnd: (value: number) => void;
  setCropBounds: (value: string | null) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [nightStart, setNightStartState] = useState<number>(() => {
    const saved = localStorage.getItem('nightStart');
    return saved !== null ? Number(saved) : 20;
  });

  const [nightEnd, setNightEndState] = useState<number>(() => {
    const saved = localStorage.getItem('nightEnd');
    return saved !== null ? Number(saved) : 7;
  });

  const [cropBounds, setCropBoundsState] = useState<string | null>(() => {
    return localStorage.getItem('cropBounds');
  });

  useEffect(() => {
    if (cropBounds) localStorage.setItem('cropBounds', cropBounds);
    else localStorage.removeItem('cropBounds');
  }, [cropBounds]);

  const setNightStart = (value: number) => {
    setNightStartState(value);
    localStorage.setItem('nightStart', value.toString());
  };

  const setNightEnd = (value: number) => {
    setNightEndState(value);
    localStorage.setItem('nightEnd', value.toString());
  };

  const setCropBounds = (value: string | null) => {
    setCropBoundsState(value);
  };

  return (
    <SettingsContext.Provider
      value={{ nightStart, nightEnd, setNightStart, setNightEnd, cropBounds, setCropBounds }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

