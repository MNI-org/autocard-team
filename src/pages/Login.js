import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Logo from '../assets/AutoCard_logo.png';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const { userLogged } = useAuth();

    React.useEffect(() => {
        if (userLogged) {
            navigate("/");
        }
    }, [userLogged, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setStatus("Obdelujem...");
        try {
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: user.email,
                level: 1,
                xp: 0
            });
            setStatus("Račun uspešno ustvarjen!");
            navigate("/");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setStatus("Napaka: Email je že v uporabi.");
            } else {
                setStatus("Napaka: " + error.message);
            }
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setStatus("Obdelujem...");
        try {
            await doSignInWithEmailAndPassword(email, password);
            setStatus("Prijava uspešna!");
            navigate("/");
        } catch (error) {
            if (error.code === "auth/invalid-credential") {
                setStatus("Napaka: Napačen email ali geslo.");
            } else {
                setStatus("Napaka: " + error.message);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        setStatus("Obdelujem...");
        try {
            const result = await doSignInWithGoogle();
            const user = result.user;
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: user.displayName,
                level: user.level ?? 1,
                xp: user.xp ?? 0
            }, { merge: true });
            setStatus("Prijava z Googlom uspešna!");
            navigate("/");
        } catch (error) {
            setStatus("Napaka: " + error.message);
        }
    };

    return (
        <>
            <Navbar curr={"login"} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-5 d-flex flex-column align-items-center justify-content-center"
                        style={{
                            height: "calc(100vh - 72.67px)",
                            background: "linear-gradient(90deg, #20c997, #ffffff)",
                        }}>
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
                                    <div className="card-body">
                                        <h2 className="card-title text-center mb-4">
                                            {isSignUp ? "Registracija" : "Prijava"}
                                        </h2>
                                        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                                            <div className="mb-3">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="E-pošta"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Geslo"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100 mb-2">
                                                {isSignUp ? "Ustvari račun" : "Prijava"}
                                            </button>
                                        </form>
                                        <div className="text-center my-2">
                                            <span className="text-muted">ali</span>
                                        </div>
                                        <button
                                            onClick={handleGoogleSignIn}
                                            className="btn btn-outline-danger w-100 mb-2"
                                        >
                                            <i className="bi bi-google me-2"></i>
                                            Nadaljuj z Google
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsSignUp(!isSignUp);
                                                setStatus("");
                                            }}
                                            className="btn btn-link w-100"
                                        >
                                            {isSignUp ? "Že imate račun? Prijava" : "Nimate računa? Registracija"}
                                        </button>
                                        {status && (
                                            <div
                                                className={`alert ${status.includes("Napaka") ? "alert-danger" : "alert-success"} mt-3`}
                                                role="alert">
                                                {status}
                                            </div>
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

export default Login;
