//Importation de feuilles styles
import "../../styles/SideBar/NavSideBar.css";

// Importation de hook et autres
import { useRef, useState } from "react";


function NavSideBar({viewChild,materialIcon,message,children}){
    const [survol,setSurvol]=useState("none")
    const msgRef=useRef(null)
    // const viewMsg=(a)=>{
    //   if (viewChild=== false && survol=="none"){
        
    //     msgRef.current.style.animationName="msg-annimation-sidebar"

    //   }
    // }
    // pour modifier la variable survol 
    const isSurvol=(a)=>{
        if (viewChild=== false) {
          setSurvol(a)
        } else {
          setSurvol("none")
        }
        
      }
    return(
    <div className="nav-side-bar">
        <span className="material-icons"
            onMouseEnter={()=>isSurvol("block")}
            onMouseOut={()=>isSurvol("none")}>
                {materialIcon} 
                
        </span>
        <div className="main-content">{viewChild?children:""}</div>
        <div className="message" style={{display: survol}} ref={msgRef}>{message}</div>
    </div>);
}
export default NavSideBar