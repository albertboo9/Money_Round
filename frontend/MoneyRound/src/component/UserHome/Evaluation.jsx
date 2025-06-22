//Importation de feuilles de styles 
import "../../styles/UserHome/Evaluation.css";

//importion d'image
import certificate from "../../images/iconic/iconamoon_certificate-badge-fill.svg";
import fire from "../../images/iconic/noto_fire.svg";
import star from "../../images/iconic/Star 13.svg";
import starFull from "../../images/iconic/Star 8.svg";
import trophy from "../../images/iconic/noto_trophy.svg";

//importation de hook et autre 
import { useState } from "react";
function Evaluation({note,ranking,solde,inTontine}){
    const noteInt=parseInt(note)
    const numStar=parseInt(noteInt/20)
    const starArray=[]
    let x=0
    const [isBlur,setIsBlur]=useState(true)
    let viewIco=""
    let blurStyle={filter:"blur(0.4)"}
    const total= parseFloat(solde)+parseFloat(inTontine)
    for (let i = 0; i < numStar; i++) {
        starArray.push(starFull)
        x++
    }
    while (x<5){
        starArray.push(star)
        x++
    }
    return (
    <section className="evaluation">
        <div className="box-user-information">
            <div className="title-evaluation">
                <div>Solde</div>
                <div className="material-icons"></div>
            </div>
            <div className="body-evaluation" > 
                {solde}
            </div>
            <div className="end-evaluation">
                En tontine: <span>{inTontine} </span>
                Tolal: <span>{total} </span>
            </div>
        </div>
        <div className="box-user-information">
            <div className="title-evaluation">
                <img src={fire} alt="" />
                Score de reputation
            </div>
            <div className="body-evaluation"> 
                <img src={star} alt=""  />
                {note+"/100"}
            </div>
            <div className="end-evaluation">
                {starArray.map((elt)=>{
                    <img src={elt} alt="" />
                })}
            </div>
        </div>
        <div className="box-user-information" >
            <div className="title-evaluation">
                <img src={certificate} alt="" />
                Badges gagnés
            </div>
            <div className="body-evaluation"> 
                Constant et régulier
            </div>
            <div className="end-evaluation">
                <img src={trophy} alt="" />
            </div>
        </div>
        <div className="box-user-information">
        <div className="title-evaluation">
                Classement
            </div>
            <div className="body-evaluation"> 
                {ranking+" /100"}
            </div>
            <div className="end-evaluation">
                Membre
            </div>
        </div>
    </section>
    );
}
export default Evaluation;