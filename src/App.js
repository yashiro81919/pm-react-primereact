import './App.css';
import { HashRouter, Route } from 'react-router-dom';
import Footer from './footer/Footer';
import Headers from './header/Header';
import Crypto from './crypto/Crypto';
import Key from './key/Key';
import Login from './login/Login';
import React, { useEffect } from 'react';
import Pack from '../package.json';

function App() {

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <React.Fragment>
      <div className="grid">
        <div className="col-12">
          <Headers></Headers>
        </div>
        <div className="col-12 h-full">
          <HashRouter basename={Pack.homepage}>
            <Route path='/crypto' component={Crypto} />
            <Route path='/key' component={Key} />
          </HashRouter>
        </div>
        <div className="col-12">
          <Footer></Footer>
        </div>
      </div>

      <Login></Login>
    </React.Fragment>
  )
}

export default App;
