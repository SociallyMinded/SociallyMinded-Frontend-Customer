import React from "react";
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router";
import { useState } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { GENERIC_EMAIL_ERROR, USER_NOT_FOUND, WRONG_PASSWORD, GENERIC_LOGIN_ERROR } from "./loginConstants";

const useLoginHooks = () => {
    const { signIn, setCurrentUserDetail, signInWithGmailPopup } = UserAuth() 
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const[serverError, setServerError] = useState("")

    const[showErrorWarning, setShowErrorWarning] = useState(false)
    const [showPageLoadSpinner, setShowPageLoadSpinner] = useState(false)

    const handleShowErrorWarning = (event) => {
        setShowErrorWarning(!showErrorWarning)
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const loginToAccount = async (event) => {
        setShowErrorWarning(false)
        event.preventDefault();
        try {
            setShowPageLoadSpinner(true)
            await signIn(email, password)
        } 
        
        catch (error) {
            setShowErrorWarning(true)
            if (error.code == "auth/wrong-password") {
                setServerError(WRONG_PASSWORD)
            } else if (error.code == "auth/invalid-email") {
                setServerError(GENERIC_EMAIL_ERROR)
            } else if (error.code == "auth/user-not-found") {
                setServerError(USER_NOT_FOUND)
            } else {
                setServerError(GENERIC_LOGIN_ERROR)
            }
        } 

        finally {
            setShowPageLoadSpinner(false)
            navigate("/home")
        }
    }

    const signInViaGoogle = async () => {
        await signInWithGmailPopup()
        .then((result) => {
            console.log("Signed in via Google")
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user
        
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            setServerError(error)
            setShowErrorWarning(true)
        })

        navigate("/home")
    }

    const state = { 
        email,
        password, 
        serverError,
        showErrorWarning,
        showPageLoadSpinner
    }

    const setState = { 
        handleEmailChange,
        handlePasswordChange, 
        handleShowErrorWarning, 
        loginToAccount,
        signInViaGoogle
    }

    return { state, setState }

}

export default useLoginHooks