//Importation de feuilles styles
import "../../styles/SideBar/NavSideBar.css";

// Importation de hook et autres
import { useRef, useState } from "react";


// eslint-disable-next-line react/prop-types
function NavSideBar({viewChild,materialIcon,message,children}){
    const [survol,setSurvol]=useState("none")
    const msgRef=useRef(null)
    const [annim,setAnnim]=useState("")
    // const viewMsg=(a)=>{
    //   if (viewChild=== false && survol=="none"){
        
    //     msgRef.current.style.animationName="msg-annimation-sidebar"

    //   }
    // }
    // pour modifier la variable survol 
    const isSurvol=(a)=>{
        if (viewChild=== false) {
          setSurvol(a)
            setAnnim("navSurvolAnnim")
        } else {
          setSurvol("none")
            setAnnim("")
        }
        
      }
    return(
    <div className="nav-side-bar"
         onMouseOver={()=>isSurvol("flex")}
         onMouseLeave={()=>isSurvol("none")}>
        <span className="material-icons">
                {materialIcon}
        </span>
        <div className="main-content">{viewChild?children:""}</div>
        <div className="message" style={{display: survol,animationName:annim}} ref={msgRef}>
            <div>
                {message}
            </div>

        </div>
    </div>);
}
export default NavSideBar