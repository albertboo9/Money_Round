import "../styles/UserHome/UserHome.css";
import Sidebar from "../component/SideBar";
import Header from "../composants/Header";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function UserHome() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="app-layout">
      <Header 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded} 
      />
      
      <div className="content-container">
        <Sidebar 
          className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
          isExpanded={isExpanded} 
          setIsExpanded={setIsExpanded} 
        />
        
        <main className="main-content" >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserHome;