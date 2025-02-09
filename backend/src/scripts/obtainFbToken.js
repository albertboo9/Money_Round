firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    console.log(idToken);
  }).catch(function(error) {
    console.error("Erreur lors de l'obtention du token Firebase", error);
  });