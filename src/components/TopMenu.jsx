// Node modules
import {Container, Nav, Navbar} from 'react-bootstrap';

// Components
import LoginPageButton from './buttons/LoginPageButton';
import LogoutButton from './buttons/LogoutButton';
import SignUpPageButton from './buttons/SignUpPageButton';
import StartPage from './pages/StartPage';

export default function TopMenu({page, setPage, student, setStudent}) {

    let upperRightCornerButton;

    switch(page) {

        case 'Login': upperRightCornerButton = <SignUpPageButton setPage={setPage} size='sm' />; break;

        case 'Sign up': upperRightCornerButton = <LoginPageButton setPage={setPage} />; break;

        case 'Start': upperRightCornerButton = <LoginPageButton setPage={setPage} />; break;

        case 'Student account': upperRightCornerButton = <LogoutButton setPage={setPage} />; break;

        case 'Admin account': upperRightCornerButton = <LogoutButton setPage={setPage} />; break;
    }

    return (
        <Navbar bg='light' collapseOnSelect expand='sm' fixed='top' variant='light'>

            <Container>

                <Navbar.Brand><StartPageLink setPage={setPage} /></Navbar.Brand>

                <Navbar.Toggle />

                <Navbar.Collapse className='justify-content-end'>

                    <Nav className='justify-content-end'>
                        {student ? <LogoutButton setPage={setPage} setStudent={setStudent} /> : <LoginPageButton student={student} setStudent={setStudent} setPage={setPage} />}
                    </Nav>

                </Navbar.Collapse>

            {/* <Navbar.Collapse>
                        <Nav className='me-auto'>
                            <NavDropdown title='Teori'>
                                {props.theory.map(theory => <NavDropdown.Item onClick={() => {props.setCurrentTheory(theory); props.setChoice('theory');}} key={theory.id}>{theory.name}</NavDropdown.Item>)}
                            </NavDropdown>
                            <NavDropdown title='Frågor'>
                                {props.quiz.map(quiz => <NavDropdown.Item onClick={() => {props.setCurrentQuiz(quiz); props.setChoice('quiz');}} key={quiz.code}>{quiz.name}</NavDropdown.Item>)}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse> */}
            </Container>

        </Navbar>
    );
}

function StartPageLink({setPage}) {

    return (

        <span 
            className='startpage-link' 
            onClick={() => setPage(<StartPage setPage={setPage} />)}>Körkort 24</span>
    );
}