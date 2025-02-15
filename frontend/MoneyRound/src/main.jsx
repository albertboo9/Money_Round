import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.jsx'
import Login from './page/Login.jsx'
/* import Createaccount from './page/Createaccount.jsx' */

createRoot(document.getElementById('root')).render(
  <StrictMode>
   {/*  <Createaccount/> */}
    <Login/>
  </StrictMode>
)
