// Node modules
import {Container} from 'react-bootstrap';

export default function MainContent({page}) {

    return (

        <div className='main-content'>

            <Container>{page}</Container>

        </div>
    );
}