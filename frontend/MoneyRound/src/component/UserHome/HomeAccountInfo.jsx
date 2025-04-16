import { useState } from "react";

function HomeAccountInfo({solde,inTontine,total}){
    const [isBlur,setIsBlur]=useState(true)
    let viewIco=""
    let blurStyle={filter:"blur(0.4)"}
    return (
    <section className="home-account-info">
        <div className="box-user-information">
            <div className="title-evaluation">
                <div>Solde</div>
                <div className="material-icons"></div>
            </div>
            <div className="body-evaluation" style={blurStyle}> 
                {solde}
            </div>
            <div className="end-evaluation">
                En tontine: <span>{inTontine} </span>
                Tolal: <span>{total} </span>
            </div>
        </div>
    </section>);
}

export default HomeAccountInfo