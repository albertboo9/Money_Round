//importation de feuille de style
import "../../styles/SideBar/SideBar.css";

//importation des composants
import { useRef, useState } from "react";
import NavSideBar from "./NavSideBar";
import logo from "../../images/logo/logo sans nom.svg";


function SideBar() {
    const [visible,setVisble]=useState(false)
    const [size,setSize]=useState("small-sidebar")
    const sideBarRef=useRef(null)
    const open=()=>{
        if (size==="small-sidebar") {
            setSize("large-sidebar")     
            sideBarRef.current.style.animationName="open-sidebar"  
            setVisble(true)     
        }
        else{
            setSize("small-sidebar")
            sideBarRef.current.style.animationName="close-sidebar"  
            setVisble(false)
        }
    }
    return( <aside id="sideBar" className={size} ref={sideBarRef}>
        <img src={logo} alt="" width="40px" height="40px" />
        <div className="menu-icon-large" onClick={open}>
            <span className="material-icons">menu_open</span>
        </div>
        <div className="menu-icon" onClick={open}>
            <span className="material-icons">menu</span>
        </div>
        <NavSideBar viewChild={visible} materialIcon="home" message="Home">Home</NavSideBar>
        <NavSideBar viewChild={visible} materialIcon="settings" message="Setting">Home</NavSideBar>
        <NavSideBar viewChild={visible} materialIcon="download" message="Retirer">Home</NavSideBar>
        <NavSideBar viewChild={visible} materialIcon="group" message="Mes tontine">Home</NavSideBar>
        <div className="end">
            <NavSideBar viewChild={visible} materialIcon="logout" message="deconnexion">Se deconnecter</NavSideBar>
        </div>

    </aside>);
}
export default SideBar