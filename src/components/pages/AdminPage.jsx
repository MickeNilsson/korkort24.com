import { Button, Col, Form, InputGroup, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';

export default function AdminPage(props) {

    const [answers, setAnswers] = useState([]);

    const [quiz, setQuiz] = useState([]);

    const [convertedQuiz, setConvertedQuiz] = useState([]);

    const [question, setQuestion] = useState('');

    const [showDeleteSectionModal, setShowDeleteSectionModal] = useState(false);

    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

    const [showQuestionsModal, setShowQuestionsModal] = useState(false);

    const [sectionNameToDelete, setSectionNameToDelete] = useState('');

    const [section, setSection] = useState('');

    useEffect(() => {

        init();

        async function init() {

            await loadQuiz();
        }

    }, []);

    async function loadQuiz() {

        const response_o = await fetch('https://korkort24.com/api/quiz/');
  
        if (response_o.status === 200) {

            const responseBody_o = await response_o.json();

            const quiz_o = responseBody_o.data;

            setQuiz(quiz_o);
        }
    }

    async function saveQuiz(quiz_o) {

        const response_o = await fetch('https://korkort24.com/api/quiz/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quiz_o)
        });

        const responseBody_o = await response_o.json();
    }

    function convertToArrayOfObjects(quiz_o) {

        const arrayOfObjects = [];

        for (const sectionName_s in quiz_o) {

            let section_o = quiz_o[sectionName_s];

            section_o.name = sectionName_s;

            arrayOfObjects.push(section_o);
        }

        return arrayOfObjects;
    }

    function convertToObject(quiz_a) {

        let object_o = {};

        for (const section_o of quiz_a) {

            object_o[section_o.name] = section_o;

        }

        object_o = JSON.parse(JSON.stringify(object_o));

        for (const section_s in object_o) {

            delete object_o[section_s].name;
        }

        return object_o;
    }

    async function deleteSection(sectionName_s) {

        const updatedQuiz_a = quiz.filter(section => section.name !== sectionName_s);

        await saveQuiz(updatedQuiz_a);

        setQuiz(updatedQuiz_a);

        setShowDeleteSectionModal(false);
    }

    async function addSection() {

        if (!section) return;

        const newSection_o = {
            id: generateUUID(),
            name: section,
            quesions: []
        };

        const updatedQuiz_a = [...quiz, newSection_o];

        await saveQuiz(updatedQuiz_a);

        setQuiz(updatedQuiz_a);
    }

    function addQuestion(section_o) {

        console.log(section_o);

        console.log('question: ' + question);
    }

    async function saveNewQuestion(e) {
        
        e.preventDefault();

        const answerRadios = document.getElementsByName('answer');

        const section_o = quiz.find(quiz_o => quiz_o.name === showAddQuestionModal);

        const newQuestion_o = {
            id: generateUUID(),
            name: question,
            answers: [],
            explanation: '',
            image: ''
        };

        for (const [index, answer] of answers.entries()) {

            const answer_o = {
                id: generateUUID(),
                isCorrect: answerRadios[index].checked,
                name: answer
            };

            newQuestion_o.answers.push(answer_o);
        }

        section_o.questions.push(newQuestion_o);

        await saveQuiz(quiz);

        setShowAddQuestionModal(false);
    }

    function generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    function showQuestions(section_s) {
        console.log(section_s);
    }

    return (

        <div className='pb-5'>

            <h1 className='page-header'>Admin Page</h1>

            <Tabs
                defaultActiveKey="questions"
                id="admin-tabs"
                className="mb-3"
            >

                <Tab eventKey="questions" title="Frågor">

                    {/* <Form.Group className='mb-3'>

                        <Form.Control
                            className='mb-2'
                            onChange={(e) => setSection(e.target.value)}
                            placeholder='Ny kategori'
                            size='sm'
                            spellCheck='false'
                            type='text' />

                        <Button
                            size='sm'
                            type='button'
                            variant='primary'
                            className='mb-2'
                            onClick={addSection}
                        >Lägg till ny kategori</Button>

                    </Form.Group> */}

                    <Row className="align-items-center">

                        <Col xs="auto">

                            <Form.Control
                                className='mb-2'
                                onChange={(e) => setSection(e.target.value)}
                                placeholder='Ny kategori'
                                size='sm'
                                spellCheck='false'
                                type='text' />

                        </Col>

                        <Col xs="auto">

                            <Button
                                size='sm'
                                type='button'
                                variant='success'
                                className='mb-2'
                                onClick={addSection}
                            >+</Button>



                        </Col>

                    </Row>

                    <div className='bg-body p-2'>
                        {quiz.map(section => (
                            <div key={section.name}>
                                <span className='section-name' role='button' onClick={() => { setShowQuestionsModal(section.name) }}>{section.name}</span> <i onClick={() => { setSectionNameToDelete(section.name); setShowDeleteSectionModal(true); }} role='button' className='mx-2 bi bi-trash'></i>
                                <i onClick={() => { setShowAddQuestionModal(section.name); setAnswers(['']); setQuestion(''); }} role='button' className='bi bi-plus-square-fill text-success'></i>
                            </div>
                        ))}
                    </div>

                </Tab>

                <Tab eventKey="info" title="Info"></Tab>

                <Tab eventKey="bookings" title="Bokningar"></Tab>

            </Tabs>

            <Modal show={showDeleteSectionModal} onHide={() => setShowDeleteSectionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Vill du ta bort den här sektionen?</Modal.Title>
                </Modal.Header>
                {/* <Modal.Body>Ta bort sektionen {sectionNameToDelete}</Modal.Body> */}
                <Modal.Footer>
                    <Button
                        onClick={() => deleteSection(sectionNameToDelete)}
                        size='sm'
                        variant='primary'
                    >
                        Ta bort sektionen "{sectionNameToDelete}"
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddQuestionModal} onHide={() => { setShowAddQuestionModal(false); setQuestion(''); }}>
                <Modal.Header closeButton>
                    <Modal.Title>Ny fråga - {showAddQuestionModal}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form onSubmit={saveNewQuestion}>

                        <Form.Control
                            required
                            className='mb-2'
                            onChange={e => setQuestion(e.target.value)}
                            placeholder='Fråga'
                            size='sm'
                            spellCheck='false'
                            type='text'
                            value={question} />

                        {answers.map((answer, i) => (

                            <InputGroup key={i} className="mb-3" size='sm'>
                                <InputGroup.Radio name='answer' required />
                                <Form.Control
                                    onChange={e => { answers[i] = e.target.value; setAnswers([...answers]); }}
                                    placeholder='Svar'
                                    required
                                    spellCheck='false'
                                    type='text'
                                    value={answers[i]}
                                />
                                {answers.length === (i + 1) &&
                                    <Button

                                        type='button'
                                        variant='success'

                                        onClick={() => setAnswers([...answers, ''])}
                                    >+</Button>}
                            </InputGroup>


                        ))}

                        <Button
                            size='sm'
                            type='submit'
                            variant='primary'
                            onClick={() => console.log('lägg till ny fråga')}
                        >Lägg till</Button>

                    </form>

                </Modal.Body>

            </Modal>

            <Modal show={showQuestionsModal} onHide={() => setShowQuestionsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{showQuestionsModal}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(convertedQuiz.filter(section => section.name === showQuestionsModal)).map(section_o => {
                        return (
                            <div>
                                {section_o.name}
                                {Object.entries(section_o).map(q => <p>{JSON.stringify(q)}</p>)}
                            </div>
                        )
                    })}
                </Modal.Body>
            </Modal>

        </div>
    );

}