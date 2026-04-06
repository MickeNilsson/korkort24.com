// Node modules
import axios from 'axios';
import {Card, Form} from 'react-bootstrap';
import {useState} from 'react';

// Components
import EmailField from '../inputfields/EmailField';
import TextField  from '../inputfields/TextField';
import SignUpButton from '../buttons/SignUpButton';
import StudentAccountPage from './StudentAccountPage';
import PasswordField from '../inputfields/PasswordField';

export default function SignUpPage({setPage, setStudent}) {
    
    const [studentAccountCreationPending, setStudentAccountCreationPending] = useState(false);

    const [email, setEmail] = useState('');
    
    const [emailFieldIsValid, setEmailFieldIsValid] = useState(false);

    const [firstname, setFirstname] = useState('');

    const [firstnameFieldIsValid, setFirstnameFieldIsValid] = useState(false);

    const [lastname, setLastname] = useState('');

    const [lastnameFieldIsValid, setLastnameFieldIsValid] = useState(false);

    const [password, setPassword] = useState('');

    const [passwordFieldIsValid, setPasswordFieldIsValid] = useState(false);

    const [responseErrorMessage, setResponseErrorMessage] = useState('');

    const [showValidation, setShowValidation] = useState(false);

    const [newAccountCreated, setNewAccountCreated] = useState(false);

    function handleSubmit(event_o) {

        event_o.preventDefault();

        event_o.stopPropagation();

        if(emailFieldIsValid && passwordFieldIsValid) {

            setStudentAccountCreationPending(true);

            axios.post('https://korkort24.com/api/members/', {
                email: email,
                firstname: firstname,
                lastname: lastname,
                password: password,
              })
              .then(function (response_o) {
          
                if(response_o.status === 201) {

                    setStudentAccountCreationPending(false);

                    setNewAccountCreated(true);

                    //setStudent({firstname, lastname, email});

                    //setPage(<StudentAccountPage student={{firstname, lastname, email}} />);
                }
              })
              .catch(function (error_o) {
                
                setStudentAccountCreationPending(false);

                switch(error_o.response.status) {

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
            {newAccountCreated ? <Card style={{marginBottom: '20px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', textAlign: 'center'}}>
                <Card.Body>Du ska nu ha fått ett konfirmationsmail. Vänligen klicka dess aktiveringslänk för att aktivera ditt konto.</Card.Body>
            </Card> :
            <Card className='login-card'>

            <Card.Body>

                <Card.Text><small>Skapa konto</small></Card.Text>

                <Form
                    noValidate
                    onSubmit={handleSubmit}>

                    <EmailField 
                        disabled={studentAccountCreationPending}
                        isValid={emailFieldIsValid} 
                        setIsValid={setEmailFieldIsValid}
                        setEmail={setEmail}
                        showValidation={showValidation} />

                    <PasswordField 
                        disabled={studentAccountCreationPending}
                        isValid={passwordFieldIsValid} 
                        setIsValid={setPasswordFieldIsValid}
                        setPassword={setPassword}
                        showForgotPasswordField={false}
                        showValidation={showValidation} />

                    <TextField
                        autoComplete='given-name'
                        disabled={studentAccountCreationPending}
                        isValid={firstnameFieldIsValid}
                        placeholder='Förnamn'
                        setIsValid={setFirstnameFieldIsValid}
                        setText={setFirstname}
                        showValidation={showValidation} />

                    <TextField
                        autoComplete='family-name'
                        disabled={studentAccountCreationPending}
                        isValid={lastnameFieldIsValid}
                        placeholder='Efternamn'
                        setIsValid={setLastnameFieldIsValid}
                        setText={setLastname}
                        showValidation={showValidation} />

                    <SignUpButton disabled={!emailFieldIsValid || !passwordFieldIsValid || !firstnameFieldIsValid || !lastnameFieldIsValid || studentAccountCreationPending} />

                    <small className='text-danger'>{responseErrorMessage}</small>

                </Form>
                
            </Card.Body>

        </Card>
            
            }
        </>
        
    );
}