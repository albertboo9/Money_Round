//importation de feuille de style
import "../../styles/Contact/InfoForm.css";

//importation de composant
import ReponsePopup from "../AllPopup/ReponsePopup";

//Importation de hook et autre
import { useState } from "react";
import { useFormData } from "../../hook/useFormData";
import { sender } from "../../database/sender";

function InfoForm(){
    const [formData,handleFormData]=useFormData({
        name: '',
        mail: '',
        subject: '',
        message:'',
        })
    const [submited, setSubmited] = useState(null)
    const sendRequest=async (e)=>{
        e.preventDefault()
        const reponse=sender(formData,"http://localhost:8000/comment")
        setSubmited((await reponse).sucess)
    }
    return(  
        // J'ai prefere gere l'affichage de la popup ici car c'est le formulaire le principale responsable de la popup est ce composant 
    <> 
    {submited==null?"":<ReponsePopup sucess={submited}/>}       
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
            <form onSubmit={sendRequest}>
                <input type="text" placeholder="Your name" name="name" value={formData.name} onChange={handleFormData}/>
                <input type="mail" placeholder="Your Email" name="mail" value={formData.mail} onChange={handleFormData}/>
                <input type="text" placeholder="subject" name="subject" value={formData.subject} onChange={handleFormData}/>
                <input type="text" placeholder="Your message" name="message" value={formData.message} onChange={handleFormData} style={{height:"100px"}}/>
                <button className="classic-btn" type="submit">Send message</button>
            </form>
        
    </section>
    </>);
}
export default InfoForm