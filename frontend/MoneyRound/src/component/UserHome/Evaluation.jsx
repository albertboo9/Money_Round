//importion d'image
import certificate from "../../images/iconic/iconamoon_certificate-badge-fill.svg";
import fire from "../../images/iconic/noto_fire.svg";
import trophy from "../../images/iconic/noto_fire.svg";
import star from "../../images/iconic/Star 13.svg.svg";
import starFull from "../../images/iconic/Star 8.svg.svg";
function Evaluation({note,ranking}){
    const noteInt=parseInt(note)
    const numStar=parseInt(noteInt/20)
    const starArray=[]
    let x=0
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
                <img src={fire} alt="" />
                Score de reputation
            </div>
            <div className="body-evaluation"> 
                <img src={star} alt="" />
                {note+"/100"}
            </div>
            <div className="end-evaluation">
                {starArray.map((elt)=>{
                    <img src={elt} alt="" />
                })}
            </div>
        </div>
        <div className="box-user-information">
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
        <div className="box-user-information"></div>
    </section>
    );
}
export default Evaluation;