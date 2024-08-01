// Components
import InputField from './InputField';
import {useState} from 'react';

export default function PasswordField(props) {

    const [showPassword, setShowPassword] = useState(false);

    function validate(value) {

        props.setPassword(value);
        
        return !!value;
    }

    return (
        <InputField 
            autoComplete='current-password'
            disabled={props.disabled}
            isValid={props.isValid}
            placeholder='Lösenord'
            setIsValid={props.setIsValid}
            setShowPassword={setShowPassword}
            setResetPassword={props.setResetPassword}
            showPassword={showPassword}
            showForgotPasswordField={props.showForgotPasswordField}
            showValidation={props.showValidation} 
            type={showPassword ? 'text' : 'password'} 
            validate={validate} />
    );
}