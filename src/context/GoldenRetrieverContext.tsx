import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '../components/Toast';

interface GoldenRetrieverContextType {
  isGoldenMode: boolean;
  toggleGoldenMode: () => void;
  goldenTransform: (standardText: string, goldenText: string) => string;
}

const GoldenRetrieverContext = createContext<GoldenRetrieverContextType | undefined>(undefined);

export const GoldenRetrieverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGoldenMode, setIsGoldenMode] = useState<boolean>(() => {
    return localStorage.getItem('qcrypt_golden_mode') === 'true';
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('qcrypt_golden_mode', isGoldenMode ? 'true' : 'false');
  }, [isGoldenMode]);

  const toggleGoldenMode = () => {
    setIsGoldenMode((prev) => {
      const next = !prev;
      if (next) {
        showToast('Golden Mode Active', undefined, 'success');
      } else {
        showToast('Executive Mode', undefined, 'info');
      }
      return next;
    });
  };

  const goldenTransform = (standardText: string, goldenText: string) => {
    return isGoldenMode ? goldenText : standardText;
  };

  return (
    <GoldenRetrieverContext.Provider value={{ isGoldenMode, toggleGoldenMode, goldenTransform }}>
      {children}
    </GoldenRetrieverContext.Provider>
  );
};

export const useGoldenRetriever = (): GoldenRetrieverContextType => {
  const context = useContext(GoldenRetrieverContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      isGoldenMode: false,
      toggleGoldenMode: () => {},
      goldenTransform: (std, _gold) => std,
    };
  }
  return context;
};
