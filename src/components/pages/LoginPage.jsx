// Node modules
import axios from 'axios';
import { Button, Card, Form } from 'react-bootstrap';
import { useState } from 'react';

// Components
import EmailField from '../inputfields/EmailField';
import LoginButton from '../buttons/LoginButton';
import PasswordField from '../inputfields/PasswordField';
import StudentAccountPage from './StudentAccountPage';
import AdminPage from './AdminPage';

export default function LoginPage({ setPage, student, setStudent }) {

    const [AwaitingLogInResponse, setAwaitingLogInResponse] = useState(false);

    const [email, setEmail] = useState('');

    const [emailFieldIsValid, setEmailFieldIsValid] = useState(false);

    const [password, setPassword] = useState('');

    const [passwordFieldIsValid, setPasswordFieldIsValid] = useState(false);

    const [resetPassword, setResetPassword] = useState(false);

    const [resetPasswordRequestIsSent, setResetPasswordRequestIsSent] = useState(false);

    const [responseErrorMessage, setResponseErrorMessage] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const [showValidation, setShowValidation] = useState(false);

    function handleSubmit(event_o) {

        event_o.preventDefault();

        event_o.stopPropagation();

        /* if (emailFieldIsValid && email === 'admin@korkort24.com' && passwordFieldIsValid && password === 'Pass123') {

            setPage(<AdminPage />);

            return;

        } else  */
         
        if (emailFieldIsValid) {

            setAwaitingLogInResponse(true);

            axios.get('https://korkort24.com/api/members/', {
                params: {
                    email: email,
                    password: password,
                    fields: 'firstname,lastname'
                }
            })
            .then(function (response_o) {

                if (response_o.status === 200 && response_o.data.data && response_o.data.data.length === 1) {

                    if(response_o.data.data[0].firstname === 'Admin') {

                        setPage(<AdminPage />);

                    } else {

                        setStudent(response_o.data.data[0]);

                        setPage(<StudentAccountPage student={response_o.data.data[0]} />);
                    }
                    
                } else {

                    setAwaitingLogInResponse(false);

                    setResponseErrorMessage('E-postadressen eller lösenordet är fel.');
                }
            })
            .catch(function (error_o) {

                setAwaitingLogInResponse(false);

                switch (error_o.response.status) {

                    case 500: setResponseErrorMessage('E-postadressen eller lösenordet är fel.'); break;
                }
            });
        }

        setShowValidation(true);
    }

    function sendResetPasswordRequest() {

        axios.get('https://korkort24.com/api/mail/reset-password.php?email=' + email)

            .then(function (response_o) {

                setResetPasswordRequestIsSent(true);
            });
    }

    return (

        <Card className='login-card'>

            <Card.Body>

                {resetPassword && (

                    <>
                        {!emailFieldIsValid && !resetPasswordRequestIsSent &&
                        
                            <>
                                <Card.Text><small>Vänligen fyll i en giltig e-postadress.</small></Card.Text>

                                <Button 
                                    className='float-end'
                                    onClick={() => setResetPassword(false)}
                                    size='sm'
                                    variant='primary'>OK</Button>
                            </>
                        }

                        {emailFieldIsValid && !resetPasswordRequestIsSent && 
                        
                            <>
                                <Card.Text><small>Vill du återställa ditt lösenord?</small></Card.Text>

                                <Button 
                                    className='float-end'
                                    disabled={!emailFieldIsValid}
                                    onClick={() => sendResetPasswordRequest()}
                                    size='sm'
                                    variant='primary'>Ja, fortsätt</Button>

                                <Button
                                    className='me-2 float-end'
                                    onClick={() => setResetPassword(false)}
                                    size='sm'
                                    variant='secondary'>Nej, avbryt</Button>
                            </>
                        }

                        {resetPasswordRequestIsSent && 
                        
                            <>
                                <Card.Text><small>Ett återställningsmail har skickats till din e-postadress.</small></Card.Text>

                                <Button 
                                    className='float-end'
                                    onClick={() => setResetPassword(false)}
                                    size='sm'
                                    variant='primary'>OK</Button>
                            </>
                        
                        }
                    </>
                )}

                {!resetPassword && (

                    <>
                        <Card.Text><small>Logga in med e-postadress & lösenord</small></Card.Text>

                        <Form
                            noValidate
                            onSubmit={handleSubmit}>

                            <EmailField
                                disabled={AwaitingLogInResponse}
                                isValid={emailFieldIsValid}
                                setEmail={setEmail}
                                setIsValid={setEmailFieldIsValid}
                                showValidation={showValidation} />

                            <PasswordField
                                disabled={AwaitingLogInResponse}
                                isValid={passwordFieldIsValid}
                                setIsValid={setPasswordFieldIsValid}
                                setPassword={setPassword}
                                setResetPassword={setResetPassword}
                                showForgotPasswordField={true}
                                showValidation={showValidation} />

                            <LoginButton disabled={!emailFieldIsValid || !passwordFieldIsValid || AwaitingLogInResponse} />

                            <small className='text-danger'>{responseErrorMessage}</small>

                        </Form>
                    </>
                )}

            </Card.Body>

        </Card>
    );
}