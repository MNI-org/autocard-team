import React, {useEffect, useState} from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate,useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {doc, collection, addDoc, getDoc, setDoc} from "firebase/firestore";

function Collection(props) {
    const { currentUser, userLogged } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        // console.log(props.data)
        // console.log(currentUser.uid);
        // console.log(props.data.user.uid)
    },[])


    return (
        <div className="card mb-3 shadow-sm hover-card"
             onClick={() => navigate(`/learn/${props.data.id}`)}
             style={{ cursor: 'pointer' }}
        >
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{props.data.name}</h5>
                    <span className="badge bg-primary">za {props.data.grade}. razred</span>
                </div>

                <div className="mb-3 d-flex justify-content-between">
                   <span>
                       <span className="badge bg-secondary me-2">{props.data.subject}</span>
                       <span className="text-warning">
                            {'★'.repeat(props.data.difficulty)}{'☆'.repeat(3 - props.data.difficulty)}
                       </span>
                   </span>
                    {props.data.user.uid===currentUser.uid && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-dark"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/editor/${props.data.id}`)
                            }}
                        >
                            Uredi
                        </button>
                    )}

                </div>

                <div className="d-flex justify-content-between align-items-center text-muted small">
            <span>
                <i className="bi bi-person-fill me-1"></i>
                {props.data.user.displayName}
            </span>
                    <span>
                <i className="bi bi-card-list me-1"></i>
                      št. vprašanj:  {props.data.cards.length}
            </span>
                </div>
            </div>
        </div>
    );
}

export default Collection;