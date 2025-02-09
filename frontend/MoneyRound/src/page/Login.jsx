import {useState} from 'react'

import axios from 'axios'
import login from '../assets/login.png'
import google from '../assets/chercher.png'
import facebook from '../assets/facebook.png'
import password from '../assets/cles.png'
import email from '../assets/email.png'
import montrer from '../assets/montrer.png'
import pasmontrer from '../assets/oeil.png'
import '../styles/login.css'


const Login = () => {

   
    const [emails, setEmails] = useState("")
    const [utilisateurs, setUtilisateurs] = useState([])
    const [passwords, setPasswords] = useState("")
    const [showpassword, setShowpassword] = useState(true)
    const [errors, setErrors] = useState({})

    // fonction pour verifier la validite d'une adrres email
    const validateEmail = (email) =>{
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
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
          if(!emails.trim()){
            newsErrors.emails = "L' adresse email est obligatoire"
          } else if(!validateEmail(emails)){
            newsErrors.emails = "l'adresse email est invalide"
          }
          if(!passwords.trim()){
            newsErrors.passwords = "Le mot de passe est obligatoire"
          } else if(passwords.length <6){
            newsErrors.emails = "le mot de passe doit au moins contenir 6 caractères"
          }
          setErrors(newsErrors)
        //   affichage dans la console de l'emails et du mot de passe lorsqu'il n'y a aucune erreurs 
          if(Object.keys(newsErrors).length === 0){
            console.log("Formulaire soumis avec : ", {emails, passwords})
          }
      };


  return (
    <div className='login'>
      <div className='leftpart'> <img src={login} alt='image de connexion' /> </div>

      <div className='rightpart'>
        <div className='greetings'>
            <div className='bienvenue'> Welcome to</div>
            <div className='nomapp'> Money Round</div>
        </div>

        <div className='connexion'>

            {/* connexion via facebook et google */}
            <div className='convliens'>
                <button className='google'>
                    <img src={google} alt='image de connexion' /> Login with Google
                </button>
                <button className='facebook'>
                    <img src={facebook} alt='image de connexion' /> Login with Google
                </button>
            </div>

            <div className='espace'>
                <div className='hr'>
                </div>
                <span>OR</span>
                <div className='hr'>
                </div>
            </div>

            {/* connexion via  email */}
            <div className='convmails'>
                <form onSubmit={handleSend}>

                    {/* inpust de l'adresse email et du mot de passe */}
                    <div>
                        <div className='email'>
                            <div className='icone'>
                                <img src={email} alt='image de connexion'  /> 
                            </div>
                            <div className='enterEmail'>
                                <label>Email</label>
                                <input type='email' placeholder='example@gmail.com' value={emails} onChange={(e) => setEmails(e.target.value)} />
                            </div>
                        </div>
                        {/* affichage des erreurs */}
                        {errors.emails && <div className='errors' style={{color: "red"}}>{errors.emails}</div>}
                    </div>
                    <div>
                        <div className='password'>
                            <div className='icone'>
                                <img src={password} alt='image de connexion' /> 
                            </div>
                            <div className='enterPassword'>
                                <label>password</label>
                                <input type='text' placeholder='*******' value={ showpassword ? passwords : "*".repeat(passwords.length)} onChange={(e) => setPasswords(e.target.value)} />
                            </div>
                            {/* bouton pour gerer la visibilite du mot de passe */}
                            <div  className='bouton'  onClick={() => setShowpassword(!showpassword)}>
                            {
                                showpassword ? <img src={montrer} alt='image de connexion' /> : <img src={pasmontrer} alt='image de connexion' />
                            } </div>
                        </div>

                        {/* affichage des erreurs */}
                        {errors.passwords && <div className='errors' style={{color: "red"}}>{errors.passwords}</div>}
                    </div>
                      
                    <div className='forgotPass'>
                        <label>
                            <input type='checkbox' /> Remember me
                        </label>
                        <a href='#'>Forgot password?</a>
                    </div>
                    <div className='submit'>
                        <button type='submit'>Login</button>
                    </div>
                </form>
            </div>
            <div className='register'>
                <div>Don&apos;t have an account?</div>
                <a href="./Createaccount">Register</a>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Login