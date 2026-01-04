import React, {useEffect, useState} from "react";
import {useAuth} from "../contexts/authContext";
import {useNavigate} from "react-router-dom";
import {db} from "../firebase/firebase";
import {doc, collection, getDocs} from "firebase/firestore";
import Navbar from "../components/Navbar";

function LeaderBoardPage() {
    const {currentUser, userLogged} = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const loadCollections = async () => {
        try {
            const querySnapshot = await getDocs((collection(db, "users")));
            const users = [];

            querySnapshot.forEach((doc) => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            users.sort((a, b) => (Number(b.level) || 0) - (Number(a.level) || 0));
            console.log(users);
            setUsers(users);
        } catch (error) {
            console.error("Napaka pri pridobivanju uporabnikov", error);
        }
    }

    useEffect(() => {
        loadCollections();
    }, [])

    if (!userLogged) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    <p> Za uporabo se morate prijaviti.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/login")}>
                        Prijava
                    </button>
                </div>
            </div>
        );
    }

    const getRowClass = (idx) => {
        if (idx === 0) return "table-success fw-bold";
        if (idx === 1) return "table-success";
        if (idx === 2) return "table-primary";
        return "";
    }

    const getMedalEmoji = (idx) => {
        if (idx === 0) return "🥇";
        if (idx === 1) return "🥈";
        if (idx === 2) return "🥉";
        return idx + 1;
    }

    return (
        <>
            <Navbar />
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-primary text-white py-3">
                                <h3 className="mb-0 text-center fw-bold">🏆 Lestvica</h3>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col" className="text-center" style={{width: '80px'}}>#</th>
                                                <th scope="col">Uporabniško ime</th>
                                                <th scope="col" className="text-center" style={{width: '100px'}}>Level</th>
                                                <th scope="col" className="text-end" style={{width: '140px'}}>Zbrane točke</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, idx) => (
                                                <tr className={getRowClass(idx)} key={user.id}>
                                                    <th scope="row" className="text-center fs-5">
                                                        {getMedalEmoji(idx)}
                                                    </th>
                                                    <td className="text-truncate" style={{maxWidth: '200px'}}>
                                                        {user.displayname ?? user.email ?? "—"}
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-primary rounded-pill px-3 py-2">
                                                            {user.level ?? 0}
                                                        </span>
                                                    </td>
                                                    <td className="text-end fw-semibold">
                                                        {(user.xp ?? 0).toLocaleString('sl-SI')} XP
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {users.length === 0 && (
                            <div className="text-center text-muted mt-4">
                                <p>Trenutno ni uporabnikov na lestvici.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default LeaderBoardPage;