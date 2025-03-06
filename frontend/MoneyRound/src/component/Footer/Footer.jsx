//importation de feuille de styles
import "../../styles/Footer/Footer.css";

function Footer(){
    return(
    <footer>


        <div className="head-footer">
            <div>
                <span>Becaume an actif member</span>
                <p>
                    we only work with the best compagny around the globe
                </p>
            </div>
            <button className="classic-btn">
                <span>Start here</span>
                <span className="material-icons">arrow_forward</span>
            </button>
        </div>


        <div className="body-footer">
            <div className="Contact">
                <span>Contact Us</span>
                <p>Decrivez nous la moindre préaucupation</p>
                <p>support@money-round.com</p>
                <p>+237 699 99 99 99</p>
                <div className="icon">
                    {/* <span className="material-icons">x</span>
                    <span className="material-icons">facebook</span>
                    <span className="material-icons">linkldin</span>
                    <span className="material-icons">instagram</span> */}
                </div>
            </div>    
            <div className="popular">
                <span>Features</span>
                <p>Offices for Rent</p>
                <p>Latest News</p>
                <p>Offices for Buy</p>
                <p>Support</p>
            </div>
            <div className="quicks">
                <span>About Us </span>
                <p>Join our team</p>
                <p>Contact Us</p>
                <p>Press release</p>
                <p>Careers</p>
            </div>
            <div className="subscribe">
            <span>SUBSCRIBE TO OUR NEWSLETTER </span> 
            <p>Enter your email and receive the
            latest news from cr.</p>
            <form action="">
                <input type="mail" placeholder="Entrez votre e-mail"/>
                <button type="submit" className="classic-btn">
                    <span className="material-icons">
                        send
                    </span>
                </button>
            </form>
            
            </div>
        </div>
        <p className="end-footer">
            © 2020 Estates. All Rights reserved | Designed by 
            <span>  MoneyRound</span>
        </p>
    </footer>
    );
}
    

export default Footer