// Node modules
import {useState} from 'react';
import {Container} from 'react-bootstrap';

// Components
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import StartPage from './pages/StartPage';
import StudentAccountPage from './pages/StudentAccountPage';

export default function MainContent({page}) {

    const [quiz, setQuiz] = useState(null);

    return (

        <div className='main-content'>

            <Container>{page}</Container>

        </div>
    );
}

// function getCurrentPage({page, setPage, setStudent, student}) {

//     switch(page) {

//         case 'Admin account': return <AdminPage />;

//         case 'Login': return <LoginPage setPage={setPage} setStudent={setStudent} />;

//         case 'Quiz': return <QuizPage setPage={setPage} quiz=

//         case 'Sign up': return <SignUpPage setPage={setPage} setStudent={setStudent} />;

//         case 'Start': return <StartPage setPage={setPage} />;

//         case 'Student account': return <StudentAccountPage setQuiz={setQuiz} setPage={setPage} student={student} />;
//     }
// }