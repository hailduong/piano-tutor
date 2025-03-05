import React from 'react'
import ReactDOM from 'react-dom/client'
import {ConfigProvider, ThemeConfig} from 'antd'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {store, persistor} from 'store'
import App from './App'
import GlobalStyle from 'styles/globalStyles'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import 'antd/dist/reset.css'
import 'styles/bootstrapVars.css'
import themeVars from 'styles/themeVars'

const theme: ThemeConfig = {
  token: {
    colorPrimary: themeVars.colors.primary,
    colorSuccess: themeVars.colors.success,
    colorWarning: themeVars.colors.warning,
    colorError: themeVars.colors.error,
    borderRadius: 4,
    fontFamily: themeVars.fonts.primary,
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
