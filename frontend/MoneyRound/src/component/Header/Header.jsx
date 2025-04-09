import "../../styles/Header/Header.css";
function Header() {
    
    return (<header id="headerHome">
        <section className="search-bar">
            <form action="" >
                <input type="search" name="" id="" placeholder="Recherche ..." />
                <button type="submit"><span className="material-icons">search</span></button>
            </form>
        </section>
        <section className="user-place-header">
            <div>Hello Emmanuel</div>
            <span className="material-icons">notifications</span>
            <span className="material-icons">account_circle</span>
            <span className="material-icons">keyboard_arrow_down</span>
        </section>
    </header>);
}
export default Header;