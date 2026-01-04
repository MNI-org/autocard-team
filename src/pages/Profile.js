import React, { useEffect, useState } from 'react';
import { useAuth } from "../contexts/authContext";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Collection from '../components/Collection';
import ProfileInfo from '../components/ProfileInfo';
import PasswordReset from '../components/PasswordReset';
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Profile() {
    const { currentUser, loading, refreshUser } = useAuth();
    const [userCollections, setUserCollections] = useState([]);
    const [loadingCollections, setLoadingCollections] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            loadUserCollections();
        }
    }, [currentUser]);

    const loadUserCollections = async () => {
        setLoadingCollections(true);
        try {
            const q = query(
                collection(db, "collections"),
                where("user.uid", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const collections = [];
            querySnapshot.forEach((doc) => {
                collections.push({ id: doc.id, ...doc.data() });
            });
            setUserCollections(collections);
        } catch (error) {
            console.error("Napaka pri pridobivanju zbirk", error);
        }
        setLoadingCollections(false);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <h4 className="mb-4">Prijavite se za ogled profila.</h4>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                        Prijava
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar curr={"profile"}/>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <ProfileInfo currentUser={currentUser} refreshUser={refreshUser} />
                        <div className="mt-5">
                            <h2 className="mb-4 fw-bold">Tvoje zbirke</h2>
                            {loadingCollections ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="text-muted mt-2">Nalaganje zbirk</p>
                                </div>
                            ) : userCollections.length > 0 ? (
                                <div className="row g-3">
                                    {userCollections.map((collection) => (
                                        <div key={collection.id} className="col-12">
                                            <Collection data={collection} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-info text-center py-5">
                                    <h5>No collections yet</h5>
                                    <p className="mb-0">Nimate ustvarjenih zbirk</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
