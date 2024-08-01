// Node modules
import { Form } from 'react-bootstrap';
import { useEffect, useState, useRef } from 'react';

export default function InputField(props) {

    const [showValidation, setShowValidation] = useState(false);

    const hasInitialized = useRef(false);

    useEffect(() => {

        if (!hasInitialized.current) {

            hasInitialized.current = true;
        }

    }, []);

    function handleBlur(event_o) {

        validate(event_o);

        setShowValidation(true);
    }

    function handleChange(event_o) {

        validate(event_o);
    }

    function handleFocus(event_o) {

        event_o.target.select();
    }

    function validate(event_o) {

        const value = event_o.target.value;

        const isValid_b = props.validate(value);

        props.setIsValid(isValid_b);
    }

    return (
        <Form.Group className='mb-3'>

            {props.label && <Form.Label>{props.label}</Form.Label>}

            <Form.Control
                autoComplete={props.autoComplete}
                autoFocus={props.autoFocus}
                disabled={props.disabled}
                isInvalid={!props.isValid && (props.showValidation || showValidation)}
                isValid={props.isValid && (props.showValidation || showValidation)}
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder={props.placeholder}
                required={props.required}
                size='sm'
                spellCheck='false'
                type={props.type} />

            {props.feedback && <Form.Control.Feedback type='invalid'>{props.feedback}</Form.Control.Feedback>}

            {props.setShowPassword && (
 
                <Form.Check
                    label='Visa lösenordet'
                    type='checkbox'
                    onClick={() => props.setShowPassword(!props.showPassword)} />
            )}

            {props.showForgotPasswordField && <span className='forgot-pw' onClick={() => props.setResetPassword(true)}>Har du glömt lösenordet?</span>}

        </Form.Group>
    );
}

InputField.defaultProps = {
    feedback: '',
    label: '',
    placeholder: '',
    required: true
};