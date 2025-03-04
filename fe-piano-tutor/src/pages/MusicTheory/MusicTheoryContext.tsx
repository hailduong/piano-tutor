import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MusicTheoryContextType {
  showTheoryAnnotations: boolean;
  toggleTheoryAnnotations: () => void;
  currentTheoryConcept: string;
  setCurrentTheoryConcept: (concept: string) => void;
}

const MusicTheoryContext = createContext<MusicTheoryContextType | undefined>(undefined);

export const MusicTheoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showTheoryAnnotations, setShowTheoryAnnotations] = useState(false);
  const [currentTheoryConcept, setCurrentTheoryConcept] = useState('');

  const toggleTheoryAnnotations = () => {
    setShowTheoryAnnotations(prev => !prev);
  };

  return (
    <MusicTheoryContext.Provider value={{
      showTheoryAnnotations,
      toggleTheoryAnnotations,
      currentTheoryConcept,
      setCurrentTheoryConcept
    }}>
      {children}
    </MusicTheoryContext.Provider>
  );
};

export const useMusicTheory = (): MusicTheoryContextType => {
  const context = useContext(MusicTheoryContext);
  if (!context) {
    throw new Error('useMusicTheory must be used within a MusicTheoryProvider');
  }
  return context;
};
