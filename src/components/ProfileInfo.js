import React, { useState, useEffect } from 'react';
import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import PasswordReset from "./PasswordReset";

export default function ProfileInfo({ currentUser, refreshUser }) {
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
        }
    }, [currentUser]);

    const handleUpdateProfile = async () => {
        setUpdating(true);
        setUpdateError(null);
        setUpdateSuccess(false);
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, { displayName });
            await refreshUser();
            setUpdateSuccess(true);
            setIsEditing(false);
            setTimeout(() => setUpdateSuccess(false), 5000);
        } catch (e) {
            setUpdateError(e.message);
        }
        setUpdating(false);
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h1 className="card-title mb-4">Profil</h1>
                <div className="row mb-3">
                    <div className="col-sm-4"><strong>Epošta:</strong></div>
                    <div className="col-sm-8">{currentUser.email}</div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-4"><strong>Uporabniško ime:</strong></div>
                    <div className="col-sm-8">
                        {isEditing ? (
                            <input
                                type="text"
                                className="form-control"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        ) : (
                            displayName || '0'
                        )}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-4"><strong>Level:</strong></div>
                    <div className="col-sm-8">{currentUser.level || '0'}</div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-4"><strong>XP:</strong></div>
                    <div className="col-sm-8">{currentUser.xp || '0'}</div>
                </div>

                {updateSuccess && (
                    <div className="alert alert-success">Uspešno ste posodobili profil!</div>
                )}
                {updateError && (
                    <div className="alert alert-danger">{updateError}</div>
                )}

                <div className="row mt-5 mb-4 g-3">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            {isEditing ? (
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-success"
                                        onClick={handleUpdateProfile}
                                        disabled={updating}
                                    >
                                        {updating ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            'Shrani spremembe'
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setDisplayName(currentUser.displayName || '');
                                        }}
                                    >
                                        Prekliči
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Uredi Profil
                                </button>
                            )}
                            <PasswordReset email={currentUser.email} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
