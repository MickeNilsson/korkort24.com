// Node modules
import {Button} from 'react-bootstrap';
import StartPage from '../pages/StartPage';

export default function LogoutButton({setStudent, setPage}) {

    function logOut() {

        setStudent(null);
        
        setPage(<StartPage setPage={setPage} />);
    }

    return (
        <Button 
            onClick={logOut}
            size='sm' 
            variant='outline-success'>Logga ut</Button>
    );
}