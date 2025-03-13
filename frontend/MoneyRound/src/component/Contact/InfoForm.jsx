//importation de feuille de style
import "../../styles/Contact/InfoForm.css";


function InfoForm(){
    return(            
    <section className="info-form">
        <div className="information">
            <div>
                <div className="first-text">
                    <span class="material-icons">location_on</span>
                    Visit Us</div>
                <div className="second-text">EStates Housing Compagny, 343 marketing, #2214
                cravel street, NY- 62617</div>
            </div>
            <div>
                <div className="first-text">
                    <span class="material-icons">phone</span>
                    Call Us
                </div>
                <div className="second-text">
                    +237 657313489 <br />
                    +237 657313489
                </div>
            </div>
            <div>
                <div className="first-text">
                    <span class="material-icons">mail</span>
                    Email Us
                </div>
                <div className="second-text">service.moneyround@gmail.com</div>
            </div>
        </div>

            <form action="">
                <input type="text" placeholder="Your name"/>
                <input type="mail" placeholder="Your Email"/>
                <input type="text" placeholder="subject"/>
                <input type="text" placeholder="Your message" style={{height:"100px"}}/>
                <button className="classic-btn" type="submit">Send message</button>
            </form>

    </section>);
}
export default InfoForm