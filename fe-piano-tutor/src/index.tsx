import React from 'react'
import ReactDOM from 'react-dom/client'
import {ConfigProvider, ThemeConfig} from 'antd'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {store, persistor} from 'store'
import App from './App'
import GlobalStyle from './GlobalStyles'
import 'bootstrap/dist/css/bootstrap-utilities.min.css';
import 'antd/dist/reset.css'
import './index.css'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#512da8',
    colorSuccess: '#388e3c',
    colorWarning: '#f57c00',
    colorError: '#d32f2f',
    borderRadius: 2,
    fontFamily: "'Spectral'",
    fontSize: 16,
    borderRadiusLG: 8
  },
  components: {}
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <GlobalStyle/>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App/>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
)
