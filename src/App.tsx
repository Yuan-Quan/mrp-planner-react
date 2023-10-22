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

function App() {
  return (
    <div className="App">
      <CssBaseline />
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
    </div>
  );
}

export default App;
