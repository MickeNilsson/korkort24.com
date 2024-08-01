// Node modules
import {Button} from 'react-bootstrap';

export default function ResetPasswordButton(props) {

    return (
        <div className='d-grid gap-2'>

            <Button
                disabled={props.disabled}
                size='sm'
                variant='success'
                type='submit'>Uppdatera lösenordet</Button>
                
        </div>
    );
}