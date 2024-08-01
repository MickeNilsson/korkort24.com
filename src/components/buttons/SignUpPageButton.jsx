// Node modules
import {Button} from 'react-bootstrap';
import SignUpPage from '../pages/SignUpPage';

export default function SignUpPageButton({setPage, setStudent}) {

    return (
        
        <Button 
            onClick={() => setPage(<SignUpPage setPage={setPage} setStudent={setStudent} />)}
            size='sm'
            variant='success'>Skapa konto</Button>
    );
}