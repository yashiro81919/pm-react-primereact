import './App.css';
import { Outlet } from 'react-router-dom';
import FooterComponent from './component/footer/Footer';
import HeaderComponent from './component/header/Header';
import LoginComponent from './component/login/Login';
import React, { useEffect, useRef } from 'react';

import { Toast } from 'primereact/toast';
import { Context } from './context';

const App = () => {

  const toast = useRef<any>(null);

  useEffect(() => {
    console.log('clear localStorage');
    localStorage.clear();
  }, []);

  return (
    <React.Fragment>
      <Toast ref={toast} position="top-center"></Toast>
      <Context.Provider value={toast}>
        <div className="grid">
          <div className="col-12">
            <HeaderComponent></HeaderComponent>
          </div>
          <div className="col-12 h-full p-component shadow-2">
            <Outlet/>
          </div>
          <div className="col-12">
            <FooterComponent></FooterComponent>
          </div>
        </div>
        <LoginComponent></LoginComponent>
      </Context.Provider>
    </React.Fragment>
  )
}

export default App;
