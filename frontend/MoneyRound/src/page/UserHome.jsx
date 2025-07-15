import "../styles/UserHome/UserHome.css";
import Sidebar from "../component/SideBar";
import Header from "../composants/Header";

import { Outlet } from "react-router-dom";

function UserHome() {
  return (
    <div className="app-layout">
      <Header />
      <div className="content-container">
          <Sidebar />
        <main className="main-content">
          {/* Votre contenu principal ira ici */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserHome;
