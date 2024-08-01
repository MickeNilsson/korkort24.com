// Node modules
import {Button} from 'react-bootstrap';

export default function SignUpButton(props) {

    return (
        <div className='d-grid gap-2'>

            <Button
                disabled={props.disabled}
                size='sm'
                variant='success'
                type='submit'>Skapa konto</Button>
                
        </div>
    );
}