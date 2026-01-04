import React, {useEffect, useState} from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate,useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {doc, collection, addDoc, getDoc, setDoc} from "firebase/firestore";
import Dropdown from "./Dropdown";

function Search(props) {
    const subjects = [
        "SLO", "MAT", "ANG", "LUM", "GUM",
        "GEO", "ZGO", "ETK", "FIZ", "KEM",
        "BIO", "NAR", "TEH", "GOS", "SPO"
    ];

    return (
        <div className="mb-2">
            <label className="form-label">Išči</label>
            <input
                type="text"
                className="form-control"
                value={props.keyword[0]}
                onChange={(e) => props.keyword[1](e.target.value)}
                required
            />
                <div className="d-flex">
                <Dropdown items={[6,7,8,9]} name={"Razred"} set={props.grade[1]} get={props.grade[0]} ></Dropdown>
                <Dropdown items={subjects} name={"Predmeti"} set={props.subject[1]} get={props.subject[0]}  ></Dropdown>
                <Dropdown items={[1, 2, 3]} name={"Težavnost"} set={props.difficulty[1]} get={props.difficulty[0]}  ></Dropdown>
                </div>
        </div>
    );
}

export default Search;