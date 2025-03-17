// importation de feuille de style 
import "./styles/theme.css"
import "./styles/general.css";

//importation de page
import LandingPage from "./page/LandingPage";
import Contact from "./page/Contact";
function App() {
  return (<>
     <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
   <LandingPage/>
    
  </>);
}

export default App;
