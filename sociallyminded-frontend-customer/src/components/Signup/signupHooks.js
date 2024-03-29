import axios from "axios";
import { useState } from "react";
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import { getAllCustomersUrl, handleLoginViaGmail } from "../../routes/routes";
import { 
    PASSWORD_INSUFFICIENT_LEN_ERROR, 
    newCustomerRecord,
    GENERIC_EMAIL_ERROR,
    EMAIL_ALREADY_EXISTS
} from "./signupConstants";
import { LOGIN_SIGNUP_REDIRECT_LINK } from "../../routes/routes";
import { getAuth, updateProfile } from "firebase/auth";

const useSignupHooks = () => {

    const { createUser, signInWithGmailPopup } = UserAuth() 
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    
    const [passwordError, setPasswordError] = useState("")
    const [serverError, setServerError] = useState("")

    const[showErrorWarning, setShowErrorWarning] = useState(false)
    const [showPageLoadSpinner, setShowPageLoadSpinner] = useState(false)

    const handleShowErrorWarning = (event) => {
        setShowErrorWarning(!showErrorWarning)
    }
  
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)

        if (event.target.value.length < 6) {
            setPasswordError(PASSWORD_INSUFFICIENT_LEN_ERROR)
        } else {
            setPasswordError("")
        }
    }

    const signInViaGoogle = async () => {
        try {
            await signInWithGmailPopup()
            .then((result) => {
                console.log(result)
                const user = result.user
                const newRecord = newCustomerRecord(user.displayName, user.email, user.uid)
                return axios.put(handleLoginViaGmail, newRecord)
            })
            .then((result) => {
                console.log(result)
                navigate(LOGIN_SIGNUP_REDIRECT_LINK)             
            })
        }
        catch (error) {
            setServerError(error.response.data.message)
            setShowErrorWarning(true)
        } 
        finally {
            console.log("Done")
        }
    }

    
    const handleFormSignup = async (event) => {

        const auth = getAuth();

        setShowErrorWarning(false)
        event.preventDefault()
        try {
            setShowPageLoadSpinner(true)
            await createUser(email, password)

            .then((result) => {
                const newRecord = newCustomerRecord(username, email, result.user.uid)
                return axios.post(getAllCustomersUrl, newRecord)
            })

            .then((result) => {
                updateProfile(auth.currentUser, {
                    displayName: username
                })
            
                .then((result) => {
                    console.log(result)
                    navigate(LOGIN_SIGNUP_REDIRECT_LINK)
                })
            })
        } catch (error) {
            setShowErrorWarning(true)
            if (error.code == "auth/email-already-in-use") {
                setServerError(EMAIL_ALREADY_EXISTS)
            } else {
                console.log(error)
                setServerError(GENERIC_EMAIL_ERROR)
            }
        } finally {
            setShowPageLoadSpinner(false)
            console.log("Done")
        }   
    }

    const state = { 
        username, 
        email,
        password, 
        passwordError, 
        serverError,
        showErrorWarning,
        showPageLoadSpinner
    }

    const action = { 
        handleUsernameChange, 
        handleEmailChange,
        handlePasswordChange,  
        handleFormSignup,
        signInViaGoogle,
        handleShowErrorWarning
    }

    return { state, action }

}

export default useSignupHooks