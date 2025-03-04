import React from 'react'
import ReactDOM from 'react-dom/client'
import {ConfigProvider, ThemeConfig} from 'antd'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {store, persistor} from 'store'
import App from './App'
import GlobalStyle from 'styles/GlobalStyles'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import 'antd/dist/reset.css'
import 'styles/index.css'
import themeVariables from 'styles/themeVariables'

const theme: ThemeConfig = {
  token: {
    colorPrimary: themeVariables.colors.primary,
    colorSuccess: themeVariables.colors.success,
    colorWarning: themeVariables.colors.warning,
    colorError: themeVariables.colors.error,
    borderRadius: 4,
    fontFamily: themeVariables.fonts.primary,
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
