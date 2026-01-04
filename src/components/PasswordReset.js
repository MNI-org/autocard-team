import React, { useState } from 'react';
import { doPasswordReset } from "../firebase/auth";

export default function PasswordReset({ email }) {
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [resetError, setResetError] = useState(null);
    const [resettingPassword, setResettingPassword] = useState(false);

    const handlePasswordReset = async () => {
        setResettingPassword(true);
        setResetError(null);
        try {
            await doPasswordReset(email);
            setResetEmailSent(true);
            setTimeout(() => setResetEmailSent(false), 5000);
        } catch (e) {
            setResetError(e.message);
        }
        setResettingPassword(false);
    };

    return (
        <div className="row">
            <div className="col-12">
                {resetEmailSent && (
                    <div className="alert alert-success">
                        Epošta za ponastavitev gesla je bila poslana.
                    </div>
                )}
                {resetError && (
                    <div className="alert alert-danger">{resetError}</div>
                )}
                <button
                    className="btn btn-warning m-0"
                    onClick={handlePasswordReset}
                    disabled={resettingPassword}
                >
                    {resettingPassword ? 'Pošiljanje' : 'Ponastavi geslo'}
                </button>
            </div>
        </div>
    );
}
