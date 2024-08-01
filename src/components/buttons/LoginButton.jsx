// Node modules
import {Button} from 'react-bootstrap';

export default function LoginButton(props) {

    return (
        <div className='d-grid gap-2'>

            <Button
                disabled={props.disabled}
                size='sm'
                variant='success'
                type='submit'>Logga in</Button>
                
        </div>
    );
}