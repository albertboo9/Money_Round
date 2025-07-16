import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "./styles/theme.css";
import "./styles/general.css";
import LandingPage from "./page/LandingPage.jsx";
import Login from "./page/Login.jsx";
import Createaccount from "./page/Createaccount.jsx";
import Contact from "./page/Contact.jsx";
import UserHome from "./page/UserHome";
import Home from "./page/User/Home.jsx"; 
import Settings from "./page/User/Settings.jsx";
import NotificationsPage from "./page/User/NotificationsPage.jsx";
import CreateTontine from "./page/Tontines/CreateTontine.jsx";
import JoinTontine from "./page/Tontines/JoinTontine.jsx";
import TontineDashboard from "./page/Tontines/TontineDashboard.jsx";
import TontineList from "./page/Tontines/TontineList.jsx";
import Deposit from "./page/Transactions/Deposit.jsx";
import Withdraw from "./page/Transactions/Withdraw.jsx";
import TransactionList from "./page/Transactions/TransactionList.jsx";
import NotFound from "./page/NotFound.jsx"; 


function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="create-account" element={<Createaccount />} />
        <Route path="contact" element={<Contact />} />
        
        {/* Zone utilisateur authentifié */}
        <Route path="app" element={<UserHome />}>
          {/* Route par défaut */}
          <Route index element={<Home />} />
          
          {/* Routes utilisateur */}
          <Route path="home" element={<Home />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<NotificationsPage />} />
          {/* Routes tontines */}
          <Route path="tontines">
            <Route path="create" element={<CreateTontine />} />
            <Route path="join" element={<JoinTontine />} />
            <Route path="list" element={<TontineList />} />
            <Route path=":id" element={<TontineDashboard />} />
          </Route>
          
          {/* Routes transactions */}
          <Route path="transactions">
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="list" element={<TransactionList/>} />
          </Route>
        </Route>
        
        {/* Gestion des erreurs 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;