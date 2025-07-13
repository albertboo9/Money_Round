//importation de feuilles de styles
import "../styles/UserHome/UserHome.css";

//importation des composants
import SideBar from "../component/SideBar/SideBar";
import Header from "../component/Header/Header";
import Evaluation from "../component/UserHome/Evaluation";
import UserEvolutionChart from "../component/UserHome/UserEvolutionChart";
import ListTontine  from "../component/UserHome/TableViewData/ListTontine";
function UserHome(){
    return(<>
    <Header></Header>
    <SideBar/>
    <main id="userHome">
        <Evaluation note={87} ranking={1} solde={1000} inTontine={300}/>
        <ListTontine/>
    </main>
    </>);
}

export default UserHome