import React from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import CryptoComponent from './component/crypto/Crypto';
import KeyComponent from './component/key/Key';

const router = createHashRouter([
    {
        path: '/',
        element: <App/>,
        children : [ {
            path: '/crypto',
            element: <CryptoComponent/>,
        }, {
            path: '/key',
            element: <KeyComponent/>,            
        }]
    }
]);

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
