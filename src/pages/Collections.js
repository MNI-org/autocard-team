import React, {useEffect, useState} from "react";
import {useAuth} from "../contexts/authContext";
import {useNavigate, useParams} from "react-router-dom";
import {db} from "../firebase/firebase";
import {doc, collection, addDoc, getDocs, setDoc} from "firebase/firestore";
import Collection from "../components/Collection";
import Search from "../components/Search";
import Navbar from "../components/Navbar";

function Collections() {
    const {currentUser, userLogged} = useAuth();
    const navigate = useNavigate();

    const [collections, setCollections] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [grade, setGrade] = useState("");
    const [subject, setSubject] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const subjects = [
        "SLO", "MAT", "ANG", "LUM", "GUM",
        "GEO", "ZGO", "ETK", "FIZ", "KEM",
        "BIO", "NAR", "TEH", "GOS", "SPO"
    ];

    const loadCollections = async () => {
        try {
            const querySnapshot = await getDocs((collection(db, "collections")));
            const collections = [];

            querySnapshot.forEach((doc) => {
                collections.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // console.log(collections);
            setCollections(collections);
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
                    <p>Za dostop se morate prijaviti.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/login")}>
                        Prijava
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar curr={"collections"}/>

            <div className="container my-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">

                        <Search keyword={[keyword, setKeyword]} grade={[grade, setGrade]}
                                subject={[subject, setSubject]} difficulty={[difficulty, setDifficulty]}/>

                        {collections.map((collection) => (
                            //checka ce je keyword anywhere in collection
                            JSON.stringify(collection).toLowerCase().includes(keyword.toLowerCase()) &&
                            //check za grade
                            (grade === "" || collection.grade.toString() === grade) &&
                            (subject === "" || collection.subject === subject) &&
                            (difficulty === "" || collection.difficulty.toString() === difficulty) &&
                            <Collection key={collection.id} data={collection}/>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Collections;