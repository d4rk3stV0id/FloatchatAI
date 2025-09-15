// src/components/GoogleTranslateWidget.tsx

import React, { useEffect } from 'react';

// Define the Google object on the window for TypeScript
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslateWidget: React.FC = () => {

  const googleTranslateElementInit = () => {
    // Check if the constructor is available
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    }
  };

  useEffect(() => {
    // Define the callback function on the window object
    window.googleTranslateElementInit = googleTranslateElementInit;

    // Manually trigger the init if the script is already loaded
    if (window.google && window.google.translate) {
        googleTranslateElementInit();
    }
    
  }, []);

  return (
    // This is the target div for the widget.
    <div id="google_translate_element"></div>
  );
};

export default GoogleTranslateWidget;