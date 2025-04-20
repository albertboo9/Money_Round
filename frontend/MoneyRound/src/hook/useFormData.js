import { useState } from "react"

/** 
 * pour enregistrer les valeurs saisi dans un formulaire
 * @param {Array } initial Mettre le templete de votre tableau et ne pas oublier que les clé du tableau sont les noms des input du formulaire
 * 
 */
function useFormData(initial) {
    const [formData,setFormData]=useState(initial)
    // permet a ce que chaque entrée du formulaire soit enregistre
    const handleChange = (e)=>{
        setFormData({...formData, 
            [e.target.name]: e.target.value
        })
    }
    return [formData,handleChange]
}

export {useFormData }