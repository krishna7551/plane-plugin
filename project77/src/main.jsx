// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {FrontContextProvider} from './providers/frontContext';

ReactDOM.render(
  <React.StrictMode>
    <FrontContextProvider>
      <App />
    </FrontContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
