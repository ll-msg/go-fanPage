import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { HashRouter } from "react-router-dom";
import { WorksProvider } from './store/worksStore.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <HashRouter>
        <WorksProvider>
          <App />
        </WorksProvider>
      </HashRouter>
    </ConfigProvider>
  </StrictMode>,
)
