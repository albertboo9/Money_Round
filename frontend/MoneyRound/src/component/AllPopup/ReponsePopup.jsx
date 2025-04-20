//Importation de feuille de style
import "../../styles/AllPopup/ReponsePopup.css"

//importation d'icone
import sucessIco from "../../images/iconic/sucess_ico.svg"
import errorIco from "../../images/iconic/error_ico.svg"

function ReponsePopup({sucess=false}) {
    let info={
        head:"",
        icon:"",
        firstMsg:"",
        secondMsg:""
    }
    let bgColor="var(--error-color)"
    if (sucess){
        info={
            head:"Sucess",
            icon:sucessIco,
            firstMsg:"Thank you for your request. We are working hard to find the best service and deals for you. ",
            secondMsg:"Shortly you will find a confirmation in your email.",
            buttonMsg:"Continue"
        }
        bgColor="var(--success-color)"
    } else {
        info={
            head:"Error",
            icon:errorIco,
            firstMsg:"We are unable to continue the process ",
            secondMsg:"Please try again to complete the request",
            buttonMsg:"Retry"
        }
        bgColor="var(--error-color)"
    }
    return (<>
    <section className="background-dark"></section>
    <section className="reponse-popup">
        <div><img src={info.icon} alt="" width="75px" height="75px"/></div>
        <div className="header-msg-popup" style={{color:bgColor}}>{info.head}</div>
        <div className="first-msg-popup">{info.firstMsg}</div>
        <div className="second-msg-popup">{info.secondMsg}</div>
        <button style={{backgroundColor:bgColor}}>{info.buttonMsg} </button>
    </section>
    </>
);
}

export default ReponsePopup