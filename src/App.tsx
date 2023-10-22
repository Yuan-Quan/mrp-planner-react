import React from 'react';
import { BrowserRouter as BRouter, Route, Routes } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import { Main } from './pages/Main';
import { NotFound } from './pages/NotFound';
import { CssBaseline } from '@mui/material';
import { ConfigPage } from './pages/Config';
import { ConfigTarget } from './pages/ConfigTarget';
import { ConfigDependencis } from './pages/ConfigDependencis';
import { ConfigInitState } from './pages/ConfigInitState';
import { IProduct } from './MrpData';

interface IAppContext {
  targetProducts: IProduct[]
  setTargetProducts: React.Dispatch<React.SetStateAction<IProduct[]>>
  normalProducts: IProduct[]
  setNormalProducts: React.Dispatch<React.SetStateAction<IProduct[]>>
}

export const AppContext = React.createContext<IAppContext>(null!);

function App() {
  const [targetProducts, setTargetProducts] = React.useState<IProduct[]>(
    // recall from localStorage
    JSON.parse(localStorage.getItem("targetProducts") || "[]")
  )
  const [normalProducts, setNormalProducts] = React.useState<IProduct[]>(
    // recall from localStorage
    JSON.parse(localStorage.getItem("normalProducts") || "[]")
  )

  return (
    <div className="App">
      <CssBaseline />
      <AppContext.Provider value={{
        targetProducts, setTargetProducts, normalProducts, setNormalProducts
      }}>
        <BRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/config" element={<ConfigPage />} >
              <Route path="target" element={<ConfigTarget />} />
              <Route path="dependencies" element={<ConfigDependencis />} />
              <Route path="init-state" element={<ConfigInitState />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
