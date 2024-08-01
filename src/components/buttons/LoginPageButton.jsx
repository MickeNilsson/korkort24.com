import {Button} from 'react-bootstrap';
import LoginPage from '../pages/LoginPage';

export default function LoginPageButton({setPage, setStudent, student}) {

    return (

        <Button 
            onClick={() => setPage(<LoginPage setPage={setPage} student={student} setStudent={setStudent} />)} 
            size='sm' 
            variant='outline-success'>Logga in</Button>
    );
}