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
import { IPeriod, IProduct } from './MrpData';
import { ConfigConfrim } from './pages/ConfigInitConfirm';
import { Result } from './pages/Result';
import { NavBar } from './components/NavBar';
import { ClearConfig } from './pages/ConfigClear';

interface IAppContext {
  targetProducts: IProduct[]
  setTargetProducts: React.Dispatch<React.SetStateAction<IProduct[]>>
  normalProducts: IProduct[]
  setNormalProducts: React.Dispatch<React.SetStateAction<IProduct[]>>
  selectedProductIdx: number
  setSelectedProductIdx: React.Dispatch<React.SetStateAction<number>>
  mrpResult: IPeriod[]
  setMrpResult: React.Dispatch<React.SetStateAction<IPeriod[]>>
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
  const [mrpResult, setMrpResult] = React.useState<IPeriod[]>([])
  const [selectedProductIdx, setSelectedProductIdx] = React.useState<number>(-1)

  return (
    <div className="App">
      <CssBaseline />
      <AppContext.Provider value={{
        targetProducts, setTargetProducts, normalProducts, setNormalProducts, selectedProductIdx, setSelectedProductIdx, mrpResult, setMrpResult
      }}>
        <BRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/config" element={<ConfigPage />} >
              <Route path="target" element={<ConfigTarget />} />
              <Route path="dependencies" element={<ConfigDependencis />} />
              <Route path="init-state" element={<ConfigInitState />} />
              <Route path="confirm" element={<ConfigConfrim />} />
            </Route>
            <Route path="/clear" element={<ClearConfig />} />
            <Route path="/result" element={<Result />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
