import "../../styles/Header/Header.css";
function Header() {

    return (<header id="headerHome">
        <section className="head-salutation">Hello Emmanuel ,</section>
        <section className="search-bar">
            <form action="" >
                <div>
                    <input type="search" name="" id="" placeholder="Recherche ..." />
                    <button type="submit"><span className="material-icons">search</span></button>
                </div>
            </form>
        </section>
        <section className="user-place-header">
            <span className="material-icons notif">notifications</span>
            <span className="material-icons">account_circle</span>
            <span className="material-icons">keyboard_arrow_down</span>
        </section>
    </header>);
}
export default Header;