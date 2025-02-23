import signUP from '../assets/signup.png'
import google from '../assets/chercher.png'
import facebook from '../assets/facebook.png'
import sablier from '../assets/sablier.png'
import {useState} from 'react'

import axios from 'axios'
import "../styles/createaccount.css"
import CustomAlert from '../composants/Customalert'
import {auth, provider, signInWithPopup } from '../firebaseConfig'
import { getAdditionalUserInfo } from 'firebase/auth'
const Createaccount = () => {

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [emails, setEmails] = useState("")
    const [utilisateurs, setUtilisateurs] = useState([])
    const [passwords, setPasswords] = useState("")
    //affiche les erreur de connexion
    const [errors, setErrors] = useState({})
    //afficher l'alerte
    const [alert, setAlert] = useState("")


    // fonction pour verifier la validite d'une adrres email
    const validateEmail = (email) =>{
       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/
       return emailRegex.test(email)
    }

    //Sign up avec google
    const handleSignUpgoogle = async () =>{
      try{
        const result = await signInWithPopup(auth, provider)
        const userInfo = getAdditionalUserInfo(result)
        if(userInfo.isNewUser){
          console.log("nouvel utilisateur inscrit:", result.user)
        } else{
          setAlert("l'utilisateur existe déjà")
        }
      }catch(error){
        setAlert("erreur lors de l'inscription:"+error.message)
      }
    }

    //  fonction lancer lors de la soummission des informations
    const handleSend = (e) => {
      e.preventDefault();
      // tableau qui recupere les erreurs
      let newsErrors = []
       // Créer un nouvel utilisateurs
      const utilisateur = {
        email: emails,
        password: passwords,
      };
    
      // Envoi du message au backend
      axios
        .post("http://localhost:3001/utilisateurs", utilisateur)
        .then(() => {
          setUtilisateurs([...utilisateurs, utilisateur]); // Mettre à jour l'état local
        })
        .catch((error) =>
          console.error("Erreur lors de l'envoi du message :", error)
        );
      //   conditions de validites des differentes informations soumis
      if(!firstname.trim()){
        newsErrors.firstname = "Ce champ est obligatoire"
      }
      if(!lastname.trim()){
        newsErrors.lastname = "Ce champ est obligatoire"
      }
      if(!emails.trim()){
        newsErrors.emails = "L' adresse email est obligatoire"
      } else if(!validateEmail(emails)){
        newsErrors.emails = "l'adresse email est invalide"
      }
      
      if(!passwords.trim()){
        newsErrors.passwords = "Le mot de passe est obligatoire"
      } 
      else if(passwords.length <6){
        newsErrors.passwords = "le mot de passe doit au moins contenir 6 caractères"
      }else if(passwords.length >= 6){
        newsErrors.passwords = " "
      } 
      setErrors(newsErrors)
      //   affichage dans la console de l'emails et du mot de passe lorsqu'il n'y a aucune erreurs 
      if(Object.keys(newsErrors).length === 0){
        console.log("Formulaire soumis avec : ", {emails, passwords})
      }

      
    };



  return (
    <div className="createAccount">
      <div className="left">
        <div className='imag'><img src={sablier} alt='se connecter' /></div>
            <h1>Au Bon Endroit Pour Yamo</h1>
            <div className='image'><img src={signUP} alt='se connecter' /></div>
      </div>
      <div className="right">
        <div className='greetings'> Create Account</div>
         {/* connexion via  email */}
        <div className='creerCompte'>
            <div className='formulaire'>
              {/* formulaire de connexion */}
              <form onSubmit={handleSend}>
                    <div className='names'>
                      <div className='presentation'>
                        <fieldset>
                          <legend>first name</legend>
                          <input type='text'  value={firstname} onChange={(e) => setFirstname(e.target.value)}/>
                        </fieldset>
                        {/* affichage des erreurs */}
                        {firstname.length === 0? (<div className='errors' style={{color: "red"}}>{errors.firstname}</div>):  (<div className='errors' style={{color: "red"}}></div>) }
                      </div>
                      <div className='presentation'>
                        <fieldset>
                          <legend>last name</legend>
                            <input type='text' value={lastname} onChange={(e) => setLastname(e.target.value)}/>
                        </fieldset>
                        {/* affichage des erreurs */}
                        {lastname.length === 0? (<div className='errors' style={{color: "red"}}>{errors.lastname}</div>):  (<div className='errors' style={{color: "red"}}></div>) }
                      </div>  
                
                    </div>
                    <div>
                      <fieldset>
                          <legend>email</legend>
                          <input type='text' value={emails} onChange={(e) => setEmails(e.target.value)} />
                      </fieldset>
                      {/* affichage des erreurs */}
                      {!validateEmail(emails) && emails.trim()? (<div className='errors' style={{color: "red"}}>l&apos;adresse email est invalide</div>) : validateEmail(emails) && emails.length>0? (<div className='errors' style={{color: "red"}}></div>) : (<div className='errors' style={{color: "red"}}>{errors.emails}</div>)}
                    </div>
                    
                    <div>
                      <fieldset>
                          <legend>password</legend>
                          <input type='text' value={passwords} onChange={(e) => setPasswords(e.target.value)}  />
                      </fieldset>
                      {/* affichage des erreurs */}
                      {passwords.length > 0  && passwords.length < 6 ? (<div className='errors' style={{color: "red"}}>le mot de passe doit au moins contenir 6 caractères</div>) : passwords.length >= 6 ? (<div className='errors' style={{color: "red"}}></div>) : (<div className='errors' style={{color: "red"}}>{errors.passwords}</div>)}
                    </div>
                    
                      
                    <div className='submit'>
                      <button type='submit'>Create Account</button>
                    </div>
              </form>  
            </div>

            <div className='register'>
                <div>Already have an account?</div>
                <a href="./Login">Login</a>
            </div>
        </div>
        <div className='espace'>
            <div className='hr'></div>
            <span>OR</span>
            <div className='hr'></div>
        </div>
        {/* connexion via facebook et google */}
        <div className='convliens'>
            <button onClick={handleSignUpgoogle} className='google'>
                <img src={google} alt='image de connexion' /> Sign Up With Google
            </button>
            {/* affiche une erreur lors de la connexion */}
            <CustomAlert message={alert} onClose={()=> setAlert("")} />
            <button className='facebook'>
                <img src={facebook} alt='image de connexion' /> Sign Up With Facebook
            </button>
        </div>
      </div>
    </div>
  )
}

export default Createaccount