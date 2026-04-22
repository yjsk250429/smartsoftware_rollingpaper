import { Link } from 'react-router-dom';


const Header = () => {
    return (
        <header id="header">
            <div className="inner">
                <h2><Link to="/">
                    Teacher's Day
                   </Link></h2>
                <h1>
                    <Link to="/">
                    <img src="/images/flowers.gif" alt="" />
                   </Link>
                </h1>
                <h2><Link to="/">
                    Baekseok Culture University
                   </Link></h2>
                
            </div>
        </header>
    );
};

export default Header;
