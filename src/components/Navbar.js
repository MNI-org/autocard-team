import React, {useState} from "react";
import {useAuth} from "../contexts/authContext";
import {useNavigate} from "react-router-dom";
import {doSignOut} from "../firebase/auth";


function Navbar(props) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const navigate = useNavigate();
    const {currentUser, userLogged} = useAuth();

    const handleLogout = async () => {
        try {
            await doSignOut();
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm py-3">
            <div className="container-fluid px-4">
                <a className="navbar-brand fw-bold">
                    <button className="nav-link active"
                            onClick={() => navigate("/")}>
                        AutoCard
                    </button>
                </a>


                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`}>
                    <ul className="navbar-nav ms-auto">

                        {userLogged ?
                            <>
                                <li className="nav-item">
                                    <button className={`nav-link ${props.curr === "home" ? "active" : ""}`}
                                            onClick={() => navigate("/")}>
                                        Domov
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link ${props.curr === "collections" ? "active" : ""}`}
                                            onClick={() => navigate("/collections")}>
                                        Zbirke
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link ${props.curr === "editor" ? "active" : ""}`}
                                            onClick={() => navigate("/editor")}>
                                        Ustvari
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link ${props.curr === "editor" ? "active" : ""}`}
                                            onClick={() => navigate("/profile")}>
                                        Profil
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link ${props.curr === "editor" ? "active" : ""}`}
                                            onClick={() => navigate("/leaderboard")}>
                                        Lestvica
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link`}
                                            onClick={() => handleLogout()}>
                                        Odjava
                                    </button>
                                </li>

                            </>
                            :
                            <li className="nav-item">
                                <button className={`nav-link ${props.curr === "login" ? "active" : ""}`}
                                        onClick={() => navigate("/login")}>
                                    Prijava
                                </button>
                            </li>

                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
