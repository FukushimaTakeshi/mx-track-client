import {
  createTheme,
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material/styles'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthProvider'
import ScrollToTop from './lib/ScrollTop'
import Router from './Router'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const theme = createTheme()

const App: React.FC = () => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StyledEngineProvider>
)

export default App
