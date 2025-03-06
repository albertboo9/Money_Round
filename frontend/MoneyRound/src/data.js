
// Ce fichier sera supprimé car il ne permet que la simplification du code des pages et ne sera plus utiles lors de la connexion avec la BD
// Importation d'image
import slide1 from "./images/slider/slide1.webp";
import slide2 from "./images/slider/slide2.webp";
import slide3 from "./images/slider/slide3.webp";
import slide4 from "./images/slider/slider4.webp";

const advantages=[
    "Set realistic budgets based on your income",
    "Track daily expenses to ensure you stay within your set budget",
    "Alerts when approaching the budget limit"
]
const allBefore=[
    "Manual, disorganized",
    "Estimated, often inaccurate",
    "Manual notes, often forgotten",
    "Manual, time-consuming",
    "Time-consuming, complicated",
    "Difficult, unstructured",
    "Complicated, manual",
    "Requires high discipline",
    "Risk of losing data",
    "Time-consuming, complicated"
]
const allAfter=[
    "Automated, organized",
    "Easy, customizable",
    "Auto recorded, real-time tracking",
    "Graphs, easy to understand",
    "Intuitive, easy to use",
    "Structured, easy to track",
    "Supports multiple currencies",
    "Notifications, easy to monitor",
    "Cloud-based, secure",
    "Fast, efficient"
]
const sliderImages = [
    {
        url:slide1,
        title: "A ton Tour de Bouffer avec Money Round",
        caption:"Nous faire confiance c’est prendre soin de votre avenir"
    },
    {
        url: slide2,
        title: "Que Tu sois eleve ou travailleur",
        caption:"Nous avons la formule pour tous, viens trouve ton bonheur et construis ton avenir."
    },
    {
        url: slide3,
        title: "Profites de tes epargnes",
        caption:"Grace a notre systeme nous assurons une gestion miticuleuse de votre argent."
    },
    {
        url: slide4,
        title: "Avec Money Round, Bouffer deviens une evidence.",
        caption:"On ne se prends plus la tete avec un systeme alcaique quand Money Round est la."
    }
    ]

export {advantages,allBefore,allAfter,sliderImages}