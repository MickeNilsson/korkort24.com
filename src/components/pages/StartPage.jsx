// Components
import SignUpPageButton from '../buttons/SignUpPageButton';
import Card from 'react-bootstrap/Card';

export default function StartPage({setPage, setStudent}) {
    
    return (
        <div style={{textAlign: 'center'}}>
            <Card style={{marginBottom: '20px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white'}}>
                <Card.Body>På den här webbplatsen får du lära dig allt om hur man hanterar en bil. Du får värdefull teori och praktik i en smart kombination som kommer att ta dig från
                zero to hero på nolltid. En meriterad yrkesförare och utbildad trafikpedagog följer din utveckling och ger dig värdefulla råd och tips.</Card.Body>
            </Card>
            <SignUpPageButton setPage={setPage} setStudent={setStudent} size='lg' />
        </div>
    );
}