import React from "react";
import QRCodeGenerator from "./components/QRCodeGenerator";
import { LocaleProvider } from "./context/LocaleContext";
import LanguageSelector from "./components/LanguageSelector";

const App: React.FC = () => {
  return (
    <LocaleProvider>
      <QRCodeGenerator />
    </LocaleProvider>
  );
};

export default App;
