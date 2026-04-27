import { Link } from 'react-router-dom';


const Header = () => {
    return (
        <header id="header">
            <div className="inner">
                <h2><Link to="/">
                    <span className="desktop-label">Teacher's Day</span>
                    <span className="mobile-label">T-Day</span>
                   </Link></h2>
                <h1>
                    <Link to="/">
                    <img src="/images/flowers.gif" alt="" />
                   </Link>
                </h1>
                <h2><Link to="/">
                    <span className="desktop-label">Baekseok Culture University</span>
                    <span className="mobile-label">BCU</span>
                   </Link></h2>
                
            </div>
        </header>
    );
};

export default Header;
