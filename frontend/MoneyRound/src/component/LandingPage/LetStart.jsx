//importation de feuille de style
import "../../styles/LandingPage/LetStart.css"

//importation des images
import logoNomSlogan from"../../images/logo/logo en vert avec nom et slogan.svg"

function LetStart(){
    return(<section className="lets-start">
        <div>
            <div className="first-text">
                Let’s Start To Keep Your Money Save
                <div className="all-btn">
                    <button className="classic-btn">Start Here</button>
                    <button className="classic-btn" style={{backgroundColor:"transparent"}}>Explore Now</button>
                </div>
            </div>
            
        </div>
        <img src={logoNomSlogan} alt="" />
    </section>);
}
export default LetStart