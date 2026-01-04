import React, {useEffect, useState} from "react";
import {useAuth} from "../contexts/authContext";
import {db} from "../firebase/firebase";
import {doc, setDoc} from "firebase/firestore";

function Flashcard(props) {
    const {currentUser, userLogged} = useAuth();
    const [isFlipped, setIsFlipped] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    async function processXpGain(xp) {
        const base = 10;
        const mult = 1.25;

        currentUser.xp -= -xp;
        if (currentUser.xp > currentUser.level * mult * base) {
            currentUser.level -= -1;
            currentUser.xp = 0;
        }

        await setDoc(doc(db, "users", currentUser.uid), {
            email: currentUser.email,
            displayName: currentUser.displayName,
            level: currentUser.level ?? 1,
            xp: currentUser.xp ?? 0
        }, {merge: true});
    }

    const handleFlip = () => {
        if (!showFeedback) {
            setIsFlipped(!isFlipped);
            if (!isFlipped) {
                setTimeout(() => setShowFeedback(true), 600);
            }
        }
    };

    const handleAnswer = async (correct) => {
        setIsProcessing(true);

        try {
            if (correct) {
                await processXpGain(10);
            }

            setTimeout(() => {
              setIsFlipped(false);
              setShowFeedback(false);
              setIsProcessing(false);

              if (props.onComplete) props.onComplete(correct);
              props.next();
            }, 500);
        } catch (error) {
            console.error("Error processing answer:", error);
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        console.log(currentUser);
    }, []);

    // Reset card when props.card changes
    useEffect(() => {
        setIsFlipped(false);
        setShowFeedback(false);
        setIsProcessing(false);
    }, [props.card]);

    if (!props.card) return null;

    return (
        <div className="container my-5">
            <style>{`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div
                        className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}
                        style={{
                            perspective: '1000px',
                            minHeight: '400px',
                            position: 'relative'
                        }}
                    >
                        <div
                            className="flashcard"
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '400px',
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.6s',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                            }}
                        >
                            <div
                                className="card shadow-lg border-0"
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    cursor: 'pointer'
                                }}
                                onClick={handleFlip}
                            >
                                <div className="card-header bg-primary text-white py-3">
                                    <h5 className="mb-0 text-center fw-bold">Vprašanje</h5>
                                </div>
                                <div
                                    className="card-body d-flex flex-column justify-content-center align-items-center p-5">
                                    <p className="fs-4 text-center mb-4">{props.card.q}</p>
                                    <div className="mt-auto">
                                        <small className="text-muted">
                                            <i className="bi bi-hand-index"></i> Klikni za odgovor
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="card shadow-lg border-0"
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                }}
                            >
                                <div className="card-header bg-success text-white py-3">
                                    <h5 className="mb-0 text-center fw-bold">Odgovor</h5>
                                </div>
                                <div
                                    className="card-body d-flex flex-column justify-content-center align-items-center p-5">
                                    {!showFeedback ? (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Nalaganje...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="fs-4 text-center mb-0">{props.card.a}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showFeedback && (
                <div className="row justify-content-center mt-4">
                    <div className="col-md-10 col-lg-8">
                        <div
                            className="card shadow-lg border-primary bg-white"
                            style={{
                                width: '100%',
                                animation: 'fadeInScale 0.3s ease-out',
                            }}
                        >
                            <div className="card-body text-center p-4">
                                <h5 className="fw-bold mb-3">Si pravilno odgovoril/a?</h5>
                                <div className="d-flex gap-3 justify-content-center">
                                    <button
                                        className="btn btn-success px-4"
                                        onClick={() => handleAnswer(true)}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <span className="spinner-border spinner-border-sm me-2"/>
                                        ) : (
                                            '✓ '
                                        )}
                                        Da
                                    </button>
                                    <button
                                        className="btn btn-danger px-4"
                                        onClick={() => handleAnswer(false)}
                                        disabled={isProcessing}
                                    >
                                        ✗ Ne
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Flashcard;