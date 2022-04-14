import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import "styles.css";
import {firebaseApp, authService} from "firebaseInstance";

console.log(firebaseApp);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);