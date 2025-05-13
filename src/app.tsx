import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';

import Canvas from './components/canvas';
import ToolBar from './components/toolBar';
import History from './components/history';

import './style/app.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ToolBar />
        <Canvas />
        <History />
      </Provider>
    </React.StrictMode>
  );
}