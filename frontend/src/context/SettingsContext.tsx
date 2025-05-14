import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface SettingsContextProps {
  nightStart: number;
  nightEnd: number;
  setNightStart: (value: number) => void;
  setNightEnd: (value: number) => void;
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

  const setNightStart = (value: number) => {
    setNightStartState(value);
    localStorage.setItem('nightStart', value.toString());
  };

  const setNightEnd = (value: number) => {
    setNightEndState(value);
    localStorage.setItem('nightEnd', value.toString());
  };

  return (
    <SettingsContext.Provider value={{ nightStart, nightEnd, setNightStart, setNightEnd }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
