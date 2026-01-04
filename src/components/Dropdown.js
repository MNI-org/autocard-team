import React, {useEffect, useState} from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate,useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {doc, collection, addDoc, getDoc, setDoc} from "firebase/firestore";

function Dropdown(props) {

    return (
        <div className="col-md-4">
            <label className="form-label">{props.name}</label>
            <select
                className="form-select"
                value={props.get}
                onChange={(e) => props.set(e.target.value)}
                required
                disabled={props.disabled}
            >
                <option value="">Izberi {props.name}...</option>
                {props.items.map(g => (
                    <option key={g} value={g}>{g}</option>
                ))}
            </select>
        </div>
    );
}

export default Dropdown;