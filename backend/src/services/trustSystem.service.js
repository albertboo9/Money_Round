const {TrustSystemModel} = require('../models/trustSystem.model');
const {UserModel} = require('../models/user.model');


class TrustSystemService {

    // Calcul et mise à jour du score et de la réputation de l'utilisateur
    async calculateUserScore (userId)  {
        try {
            const evaluationsSnapshot = await db.collection('evaluations')
                .where('memberId', '==', userId)
                .get();
            console.log(`La moyenne des notations de l'utilisateur est ${evaluationsAverage}`);

            const tontines = await UserModel.getTontinesByUserId(userId);

            let totalContributions = 0;
            let punctualContributions = 0;
            let contributionsAverage;
            let successfulTontines = 0;
            let successfulTontinesAverage;

            if (tontines) {
                tontines.map((tontine) => {
                    console.log("Tontine: ", tontine);
                    if (tontine.status === "terminée") successfulTontines += 1;

                    tontine.tours.map((tour) => {
                        tour.periodeCotisation.map((periodeCotisation) => {
                            console.log("Periode de cotisation: ", periodeCotisation);
                            const date_fin = periodeCotisation.date_fin;
                            console.log("Date de fin: ", date_fin);
                            if (periodeCotisation.contributions) {
                                const userContribution = periodeCotisation.contributions.find((contribtution) => contribtution.memberId === userId);

                                if (userContribution) {
                                    console.log("Contribution de l'utilisateur: ", userContribution)
                                    totalContributions += 1;
                                    if (userContribution.date <= date_fin) punctualContributions += 1;
                                }
                            }
                        })
                    })
                });
            }

            if (totalContributions > 4) {
                contributionsAverage = (punctualContributions / totalContributions) * 5;
            }else contributionsAverage = 3;
            console.log("Total des contibutions de l'utilisateur:", totalContributions);
            console.log("Total des contibutions ponctuelles de l'utilisateur: ", punctualContributions);
            console.log(`La moyenne des contributions de l'utilisateur est ${contributionsAverage}`);

            if (successfulTontines <= 3) {
                successfulTontinesAverage = 3
            }else if (successfulTontines > 3 && successfulTontines <= 5)  {
                successfulTontinesAverage = 4;
            }else if (successfulTontines > 5) successfulTontinesAverage = 5;
            console.log(`La moyenne des tontines reussies de l'utilisateur est ${successfulTontinesAverage}`);

            const newScore = parseFloat(((0.5 * contributionsAverage) + (0.2 * successfulTontinesAverage) + (0.3 * evaluationsAverage)).toFixed(2));
            console.log(`Le nouveau score de l'utilisateur est ${newScore}`);

            let newReputation;
            if (newScore < 3) {
                newReputation = "Membre Risqué";
            }else if (newScore >= 3 && newScore < 4) {
                newReputation = "Membre Neutre";
            }else if (newScore >= 4 && newScore < 5) {
                newReputation = "Membre Fiable";
            }else if (newScore === 5) newReputation = "Membre Premium";
            console.log(`Le nouvelle réputation de l'utilisateur est ${newReputation}`);

            // Mise à jour du score et de la réputation dans Firestore
            await TrustSystemModel.updateUserScore(userId, newScore, newReputation);

        }catch (error) {
            console.error("Impossible de calculer ou de mettre à jour le score et la réputation de l'utilisateur: ", error.message);
            throw new Error(error.message);
        }
    }
}


module.exports = new TrustSystemService();