//importation de feuille de style
import "../../styles/LandingPage/WorkLandingPage.css"
function WorkLandingPage(){
    return (<section className="how-work">
        <div className="first-text">How It Works</div>
        <div className="second-text">
            Crypters supports a variety of the most popular digital currencies
        </div>
        <div className="help-start">
            <div className="first-text">
                We Will Help  <span>You to Start</span>  keep your Money
            </div>
            <button className="classic-btn">Get started</button>
        </div>
        <div className="step">
            <div className="first-step">
                <div className="head">
                    <div className="icon">
                        <span className="material-icons">person</span>
                    </div>
                    <div className="line"></div>
                    <div className="number"><span>1</span></div>
                </div>
                <div className="label">Create an Account </div>
                <div className="content">
                    Une étape simple mais primordiale vers une meilleur gestion de votre tontine
                </div>
                <button className="classic-btn">Create an Account </button>
            </div>
            <div className="second-step">
            <   div className="head">
                    <div className="icon">
                        <span className="material-icons">account_balance</span>
                    </div>
                    <div className="line"></div>
                    <div className="number"><span>2</span></div>
                </div>
                <div className="label">Join a Tontine</div>
                <div className="content">
                    ça y est vous avez votre compte maintenant créer une tontine à votre image 
                </div>
            </div>
            <div className="third-step">
                <div className="head">
                    <div className="icon">
                        <span className="material-icons">trending_up</span>
                    </div>
                    <div className="line"></div>
                    <div className="number"><span>3</span></div>
                </div>
                <div className="label">Keep Money & Be Sure</div>
                <div className="content">
                    Deposer vos fonds dans votre compte et votre argent migrera automatiquement dans votre tontine
                </div>
            </div>
        </div>
    </section>);
}
export default WorkLandingPage