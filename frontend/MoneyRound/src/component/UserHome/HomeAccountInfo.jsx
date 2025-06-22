import { useState } from "react";

function HomeAccountInfo({solde,inTontine}){
    const [isBlur,setIsBlur]=useState(true)
    let viewIco=""
    let blurStyle={filter:"blur(0.4)"}
    const total= parseFloat(solde)+parseFloat(inTontine)
    return (
    <section className="home-account-info">

    </section>);
}

export default HomeAccountInfo