//importation de feuilles de styles
import "../styles/UserHome/UserHome.css";

//importation des composants
import SideBar from "../component/SideBar/SideBar";
import Header from "../component/Header/Header";
import Evaluation from "../component/UserHome/Evaluation";

function UserHome(){
    return(<>
    <Header></Header>
    <SideBar/>
    <main id="userHome">
        <Evaluation note={87} ranking={1}/>
    </main>
    </>);
}

export default UserHome