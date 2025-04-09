/**
 * Donner renvoyer par le serveur
 * @typedef {Object} Reponse
 * @property {boolean} sucess savoir si la requete a abouti
 * @property {any} data
 */
/**
 * @param {Array} data Données à envoyées au serveur pour la requette
 * @param {string} link lien vers le serveur
 * @param {string} methodSend Type d'envoie de données
 * @returns {Promise<Reponse>}
 */
async function sender(data, link, methodSend = "POST") {
    try {
        // Envoi des données au serveur JSON Server
        const response = await fetch(link, {
            method: methodSend,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
  
        // Gestion de la réponse du serveur
        if (response.ok) {
            // La soumission a réussi
            const responseData = await response.json() // Attendre la résolution de la promesse
            console.log('Données envoyées avec succès!')
            console.log(responseData) // Afficher les données de réponse
            return {
              sucess: true,
              data:responseData
            }
        } else {
            // Gestion de l’erreur
            console.error('Échec de l\'envoi, pas trop grave')
            console.log(response)
            return {
              sucess: false,
              data:[]
            }
        }
    } catch (error) {
        console.error('Échec de l\'envoi:', error)
        return {
          sucess: false,
          data:[]
        }
    }
  }

export {sender}