import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';

ReactDOM.render(
  <Auth0Provider domain={process.env.REACT_APP_AUTH0_DOMAIN} clientId={process.env.REACT_APP_CLIENT_ID} audience={process.env.REACT_APP_AUDIENCE} redirectUri={window.location.origin}>
    <Provider store={store}>
      <ToastContainer theme="colored" />
      <App />
    </Provider>
  </Auth0Provider>,
  document.getElementById('root')
);
