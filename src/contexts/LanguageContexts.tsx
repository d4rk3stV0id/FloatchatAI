// src/contexts/LanguageContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import translate from 'translate';

// --- Translation Engine Setup ---
// We're setting the translation engine's options here one time.
// This is an async operation, but we only need to do it once.
const setupTranslateEngine = async () => {
  try {
    // Note: The 'from' language is automatically detected.
    // The key can be a placeholder as the free tier is used.
    translate.engine = "google";
    translate.key = "any-key-will-work-for-free-tier";
    console.log("Translation engine initialized.");
  } catch (error) {
    console.error("Failed to initialize translation engine:", error);
  }
};
setupTranslateEngine();
// ------------------------------

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// --- The Custom Translation Hook ---
export const useTranslate = (text: string) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    if (language === 'en') {
      setTranslatedText(text); // If English, just use the original text
      return;
    }
    
    let isMounted = true;
    const doTranslation = async () => {
      try {
        const result = await translate(text, { to: language });
        if (isMounted) {
          setTranslatedText(result);
        }
      } catch (error) {
        console.error("Translation failed:", error);
        if (isMounted) {
          setTranslatedText(text); // Fallback to original text on error
        }
      }
    };

    doTranslation();

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted components
    };
  }, [text, language]); // Re-run translation if text or language changes

  return translatedText;
  
};

export const T: React.FC<{ children: string }> = ({ children }) => {
    const translatedText = useTranslate(children);
    return <>{translatedText}</>;
  };