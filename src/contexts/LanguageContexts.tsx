import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import translate from 'translate';

// --- Translation Engine Setup ---
const setupTranslateEngine = async () => {
  try {
    translate.engine = "google";
    translate.key = "any-key-will-work-for-free-tier";
    console.log("Translation engine initialized.");
  } catch (error) {
    console.error("Failed to initialize translation engine:", error);
  }
};
setupTranslateEngine();
// ------------------------------

type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml' | 'mr' | 'bn' | 'ur' | 'fr' | 'de';

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
    if (language === 'en' || !text) {
      setTranslatedText(text);
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
          setTranslatedText(text);
        }
      }
    };

    doTranslation();

    return () => {
      isMounted = false;
    };
  }, [text, language]);

  return translatedText;
};

// The reusable translation component
export const T: React.FC<{ children: string }> = ({ children }) => {
  const translatedText = useTranslate(children);
  return <>{translatedText}</>;
};