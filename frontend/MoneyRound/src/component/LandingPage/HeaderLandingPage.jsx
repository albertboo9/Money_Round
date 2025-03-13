import { useState } from "react";
import logo from "../../images/logo/logo avec nom.svg";

//importation de feuille de style
import "../../styles/LandingPage/HeaderLandingPage.css";
import "../../styles/general.css";
import "../../styles/theme.css"

function HeaderLandingPage() {
  // fonction pour reconnaitre le thème
  const defineTheme=()=>{
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkThemeMq.matches) {
      // Theme sombre reconnu.
      return "light_mode"
    } else {
      // Theme clair reconnu
      return "dark_mode"
    }
  }
  const [iconTheme,setIconTheme]=useState(defineTheme())
 
  return (
    <header id="headerLandingPage">
        <img src={logo} alt="Logo" />
        <section className="header-nav">
            <nav>Home</nav>
            <nav>About</nav>
            <nav>Service</nav>
            <nav>Contact</nav>
        </section>
        <section className="head-right">
            <button>Login</button>
            <div></div> 
            <span className="material-icons">{iconTheme} </span>
        </section>
    </header>
  );
}

export default HeaderLandingPage