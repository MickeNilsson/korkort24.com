// Components
import InputField from './InputField';

export default function TextField(props) {

    function validate(value) {

        props.setText(value);
        
        return !!value;
    }

    return (
        <InputField 
            autoComplete={props.autoComplete}
            disabled={props.disabled}
            isValid={props.isValid}
            placeholder={props.placeholder}
            setIsValid={props.setIsValid}
            showValidation={props.showValidation} 
            type='text' 
            validate={validate} />
    );
}