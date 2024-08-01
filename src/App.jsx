// Node modules
import { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';

// Components
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import TopMenu from './components/TopMenu';

// Pages
import StartPage from './components/pages/StartPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';

export default function App() {

    const [page, setPage] = useState(null);

    const [student, setStudent] = useState(null);

    const hasInitialised = useRef(false);

    useEffect(() => {

        if (!hasInitialised.current) {

            hasInitialised.current = true;

            const uuid_s = getQueryVariable('uuid');
            
            if(uuid_s) {

                setPage(<ResetPasswordPage uuid={uuid_s} />);

            } else {

                setPage(<StartPage setPage={setPage} setStudent={setStudent} />);
            }
            
        }

    }, []);

    function getQueryVariable(variable) {
        
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
    }

    return (

        <>
            <TopMenu student={student} setStudent={setStudent} page={page} setPage={setPage} />

            <MainContent page={page} setPage={setPage} />

            <Footer />
        </>
    );
}