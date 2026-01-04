import React from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Logo from "../assets/AutoCard_logo.png";

function Home() {
    const { currentUser, userLogged } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <Navbar curr="home" />
            <div className="container-fluid">
                <div className="row">
                    <div
                        className="col-md-5 d-flex flex-column align-items-center justify-content-center"
                        style={{
                            height: "calc(100vh - 72.67px)",
                            background: "linear-gradient(90deg, #20c997, #ffffff)",
                        }}
                    >
                        <img
                            src={Logo}
                            alt="AutoCard Logo"
                            className="img-fluid mb-3"
                            style={{ width: "50vh" }}
                        />
                        <h2 className="mb-3 text-center text-secondary" style={{ fontWeight: 400 }}>
                            Tvoje datoteke, tvoje kartice, tvoje znanje.
                        </h2>
                    </div>
                    <div className="col-md-7 d-flex align-items-center justify-content-center">
                        <div className="row justify-content-center w-100">
                            <div className="col-md-8 col-lg-6">
                                <div className="card shadow-lg p-4 rounded-4">
                                    <div className="card-body text-center">
                                        {userLogged ? (
                                            <>
                                                <h2 className="mb-4">Pozdravljen{currentUser?.displayName ? `, ${currentUser.displayName}` : ""}!</h2>
                                                <button
                                                    className="btn btn-primary w-100 mb-2"
                                                    onClick={() => navigate("/collections")}
                                                >
                                                    Igraj
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <h2 className="mb-4">Nisi prijavljen.</h2>
                                                <button
                                                    className="btn btn-primary btn-lg w-100"
                                                    onClick={() => navigate("/login")}
                                                >
                                                    Prijava
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
