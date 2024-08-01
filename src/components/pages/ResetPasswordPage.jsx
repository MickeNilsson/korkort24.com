// Node modules
import axios from 'axios';
import { Button, Card, Form } from 'react-bootstrap';
import { useState } from 'react';

// Components

import PasswordField from '../inputfields/PasswordField';
import ResetPasswordButton from '../buttons/ResetPasswordButton';

export default function ResetPasswordPage(props) {

    const [studentAccountCreationPending, setStudentAccountCreationPending] = useState(false);

    const [email, setEmail] = useState('');

    const [emailFieldIsValid, setEmailFieldIsValid] = useState(false);

    const [firstname, setFirstname] = useState('');

    const [firstnameFieldIsValid, setFirstnameFieldIsValid] = useState(false);

    const [showCard, setShowCard] = useState(true);

    const [lastname, setLastname] = useState('');

    const [lastnameFieldIsValid, setLastnameFieldIsValid] = useState(false);

    const [password, setPassword] = useState('');

    const [passwordFieldIsValid, setPasswordFieldIsValid] = useState(false);

    const [responseErrorMessage, setResponseErrorMessage] = useState('');

    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const [showValidation, setShowValidation] = useState(false);

    const [passwordIsUpdated, setPasswordIsUpdated] = useState(false);

    function handleSubmit(event_o) {

        event_o.preventDefault();

        event_o.stopPropagation();

        if (passwordFieldIsValid) {

            setStudentAccountCreationPending(true);
            
            axios.put('https://korkort24.com/api/members/', {
                password: password,
                uuid: props.uuid
            })
                .then(function (response_o) {
                    
                    if (response_o.status === 200) {

                        setPasswordIsUpdated(true);
                    }
                })
                .catch(function (error_o) {
                    debugger;
                    setStudentAccountCreationPending(false);

                    switch (error_o.response.status) {

                        case 409:

                            setResponseErrorMessage('Det finns redan ett konto med den e-postadressen.');

                            setEmailFieldIsValid(false);

                            break;
                    }
                });
        }

        setShowValidation(true);
    }

    return (

        <>
            {showCard &&

                <Card className='login-card'>

                    <Card.Body>

                        {passwordIsUpdated &&

                            <>
                                <Card.Text><small>Ditt lösenord är nu uppdaterat.</small></Card.Text>

                                <Button
                                    className='float-end'
                                    onClick={() => setShowCard(false)}
                                    size='sm'
                                    variant='primary'>OK</Button>
                            </>
                        }

                        {!passwordIsUpdated &&

                            <>
                                <Card.Text><small>Vänlige ange ett nytt lösenord</small></Card.Text>

                                <Form
                                    noValidate
                                    onSubmit={handleSubmit}>

                                    <PasswordField
                                        disabled={isUpdatingPassword}
                                        isValid={passwordFieldIsValid}
                                        setIsValid={setPasswordFieldIsValid}
                                        setPassword={setPassword}
                                        showForgotPasswordField={false}
                                        showValidation={showValidation} />

                                    <ResetPasswordButton disabled={!passwordFieldIsValid || isUpdatingPassword} />

                                    <small className='text-danger'>{responseErrorMessage}</small>

                                </Form>
                            </>
                        }

                    </Card.Body>

                </Card>
            }
        </>
    );
}