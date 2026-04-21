import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App'
import { store } from './store'
import { STORAGE_KEYS } from './constants/storageKeys'

const savedTheme = localStorage.getItem(STORAGE_KEYS.theme)
const initialTheme =
  savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

document.documentElement.classList.toggle('dark', initialTheme === 'dark')
document.documentElement.style.colorScheme = initialTheme

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
