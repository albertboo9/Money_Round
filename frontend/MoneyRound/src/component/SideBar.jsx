import 'boxicons'
import '../boxicons-master/css/boxicons.css'
import '../styles/slidebar.css'
import "../styles/general.css"
import { useState } from "react";
import logo from './logo2.png';
import { Outlet} from 'react-router-dom'

import PropTypes from 'prop-types';

function Onglet({classIcon,text,view,children,icoView}){
    const [survol,setSurvol]=useState("none")
    const isSurvol=(a)=>{
      if (view=== false) {
        setSurvol(a)
      } else {
        setSurvol("none")
      }
      
    }
    return (
    <div className="nav-list"> 
      <span style={{display:icoView}}>
        <div className= "slide-icon" onMouseEnter={()=>isSurvol("block")} onMouseOut={()=>isSurvol("none")} >
          <div className={classIcon} 
                onMouseEnter={()=>isSurvol("block")}
                onMouseOut={()=>isSurvol("none")}
                style={{
                  position:"relative",
                  top:"50%",
                  transform:"translateY(-50%)"
                }}  
          > 
          </div>
        </div>
      </span >
      <span ><div className="text-onglet">{view===true ? children : ""}</div></span >
      <div className="slide-boxHidden" style={{display: survol}}> <div className="text-onglet">{text}</div></div> 
    </div>
    );
}

Onglet.propTypes = {
  classIcon: PropTypes.string,
  text: PropTypes.string,
  view: PropTypes.bool,
  children: PropTypes.node,
  icoView: PropTypes.string,
};
  function SlideBar() {
/*     onAuthStateChanged(auth, (user)=>{
        if(!user){
          navigate("/login");
        }
      }) */
      const mail = sessionStorage.getItem("mail")

    const [size,setSize]=useState("slidebar-small")
    const [viewLogo,setViewLogo]=useState("none")
    const [visible,setVisble]=useState(false)
    const [classIco,setClassIco]=useState("menu")
    const changeSize =()=>{
      if (size === "slidebar-small") {
        setSize("slidebar-large")
        setVisble(true)
        setViewLogo("block")
        setClassIco("none")
      } else {
        setSize("slidebar-small")
        setVisble(false)
        setViewLogo("none")
        setClassIco("menu")
      }
    }
  
    return (
        <>
        <div className={size} id="side-bar">
           <p> <div onClick={changeSize} id="chevron"><box-icon  size="ms" color="white" name={classIco}></box-icon></div></p> 
            <div style={{display:viewLogo}}>
                <div className='side-top'> 
               <img src={logo} alt="logo" className="logo"/>
                { /* <td><Onglet classIcon="" text="" view={visible} icoView="none"></Onglet></td>*/}
               <div onClick={changeSize} id="chevron"><box-icon color="white" name='menu-alt-right'></box-icon></div>
               </div> 
               <div className='name-login'>
                  <p className='user-mail'>User: {mail}</p>
                </div>
            </div>
            <div className='hid'>
              <Onglet classIcon="bx bx-home" text="accueil" view={visible} >accueil</Onglet>

              <Onglet classIcon="bx bx-bell" text="notifications" view={visible}>notifications</Onglet>
              <Onglet classIcon="bx bx-grid-alt" text="tontines" view={visible}>Mes tontines</Onglet>
              <Onglet classIcon="bx bx-wallet" text="solde" view={visible}>Mon solde</Onglet> 
              <Onglet classIcon="bx bx-transfer-alt" text="transactions" view={visible}>Transactions</Onglet> 
              <Onglet classIcon="bx bx-cog" text="paramètres" view={visible}>parametre</Onglet>
              <Onglet classIcon="bx bx-plus" text="creer" view={visible}> creer une tontine</Onglet>
              <Onglet classIcon="bx bx-globe" text="rejoindre" view={visible}> rejoindre une tontine</Onglet>
              <div className="end">
                <Onglet  classIcon="bx bx-door-open" text="deconnexion" view={visible}>Deconnexion</Onglet>
              </div>
            </div>
        </div>
        <div className='center-side'>
          <div className='center-center'>
            <Outlet/>
          </div>
        
        </div>
        </>
    );
  }

export default SlideBar