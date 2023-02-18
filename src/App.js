import './App.css';
import { Outlet } from 'react-router-dom';
import Footer from './component/footer/Footer';
import Headers from './component/header/Header';
import Login from './component/login/Login';
import React, { useEffect, useRef } from 'react';

import { Toast } from 'primereact/toast';
import { Context } from './context';

function App() {

  const toast = useRef(null);

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
            <Headers></Headers>
          </div>
          <div className="col-12 h-full">
            <Outlet/>
          </div>
          <div className="col-12">
            <Footer></Footer>
          </div>
        </div>
        <Login></Login>
      </Context.Provider>
    </React.Fragment>
  )
}

export default App;
