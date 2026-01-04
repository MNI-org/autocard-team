import React, {useEffect, useState} from "react";
import {useAuth} from "../contexts/authContext";
import {useNavigate, useParams} from "react-router-dom";
import {db} from "../firebase/firebase";
import {doc, getDoc} from "firebase/firestore";
import Flashcard from "../components/Flashcard";
import Navbar from "../components/Navbar";

function CollectionMainPage() {
    const {currentUser, userLogged} = useAuth();
    const navigate = useNavigate();

    const {id} = useParams();
    const [collection, setCollection] = useState(null);
    const [index, setIndex] = useState(0);
    const [max, setMax] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [percentage, setPercentage] = useState(0);

    async function loadCollections() {
        try {
            const docSnap = await getDoc((doc(db, "collections", id)));
            // console.log(docSnap);
            setCollection(docSnap.data());
            setMax(docSnap.data().cards.length);
        } catch (error) {
            console.error("Napaka pri pridobivanju zbirk:", error);
        }
    }

    function next() {
        const newIndex = index + 1;
        const newPercentage = Math.round(((index + 1) / max) * 100);

        setPercentage(newPercentage);
        setIndex(newIndex);

        if (newIndex >= max) {
            setIsFinished(true);
        }
    }

    function prev() {
        if (isFinished) return;

        setIndex((index - 1) < 0 ? max - 1 : (index - 1));
    }

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [index, collection]);

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

    return (
        <>
            <Navbar/>
            <div className="container my-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {collection && (
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <small className="text-muted">
                                        Karta {index + 1} od {collection.cards?.length || 0}
                                    </small>
                                    <small className="text-muted">
                                        {percentage}% končano
                                    </small>
                                </div>
                                <div className="progress" style={{height: '8px'}}>
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{width: `${percentage}%`}}
                                        aria-valuenow={index + 1}
                                        aria-valuemin="0"
                                        aria-valuemax={collection.cards?.length || 0}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {collection ? (
                            isFinished ? (
                                    <div className="text-center my-5 p-4 bg-light rounded shadow">
                                        <h3 className="fw-bold mb-4 text-primary">
                                            Čestitke! Končali ste igro.
                                        </h3>
                                        <p className="mb-4 text-secondary fs-5">
                                            Upam da ste se kaj naučili, zdaj po novemu znanju na pot!
                                        </p>
                                        <div className="d-flex justify-content-center gap-3">
                                            <button
                                                className="btn btn-primary btn-lg"
                                                onClick={() => navigate("/collections")}
                                            >
                                                <i className="bi bi-house-door-fill me-2"></i>
                                                Nazaj v knjižnico
                                            </button>

                                            <button
                                                className="btn btn-secondary btn-lg"
                                                onClick={() => window.location.reload()}
                                            >
                                                <i className="bi bi-arrow-clockwise me-2"></i>
                                                Igraj ponovno
                                            </button>
                                        </div>
                                    </div>
                                )
                                : collection?.cards?.[index] ? (
                                    <Flashcard
                                        card={collection.cards[index]}
                                        next={next}
                                    />
                                ) : (
                                    <p>No cards available</p>
                                )
                        ) : (
                            <div className="text-center my-5">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CollectionMainPage;