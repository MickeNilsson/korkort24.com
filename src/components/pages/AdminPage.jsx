import Form from 'react-bootstrap/Form';
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AdminPage(props) {

    const [quizInJsxFormat, setQuizInJsxFormat] = useState(<h1>Loading...</h1>);

    const [quiz, setQuiz] = useState({});

    const [showModal, setShowModal] = useState(false);

    const [category, setCategory] = useState('');

    const [newInfo, setNewInfo] = useState('');

    const [newQuestions, setNewQuestions] = useState('');

    const [modalMessage, setModalMessage] = useState('');

    const [rerenderState, setRerenderState] = useState('A');

    const handleClose = () => setShowModal(false);

    const quiz_o = useRef(null);

    useEffect(() => {

        getQuiz();

        async function getQuiz() {

            const response_o = await fetch('https://korkort24.com/api/quiz/');

            if (response_o.status === 200) {

                const body_o = await response_o.json();

                setQuiz(body_o.data);

                const quiz_jsx = convertQuizToJsxFormat(body_o.data);

                setQuizInJsxFormat(quiz_jsx);
            }
        }

    }, []);

    function updateNewQuestions(e) {

        setNewQuestions(e.target.value);
    }

    function deleteQ(section_s, question_s) {
        debugger;
        if (question_s) {

            delete quiz_o.current[section_s][question_s];

        } else {

            delete quiz_o.current[section_s];
        }

        quiz_o.current.delete = true;

        axios.post('https://korkort24.com/api/quiz/', quiz_o.current)

            .then(function (postQuizResponse_o) {

                if (postQuizResponse_o.status === 200) {

                    axios.get('https://korkort24.com/api/quiz/')

                        .then(function (getQuizResponse_o) {

                            if (getQuizResponse_o.status === 200) {

                                quiz_o.current = getQuizResponse_o.data

                                const quiz_jsx = convertQuizToJsxFormat(quiz_o.current);

                                setQuizInJsxFormat(quiz_jsx);
                            }
                        })

                        .catch(function (error_o) {

                            debugger;
                        });
                }
            })

            .catch(function (error_o) {

                debugger;
            });
    }

    function uploadFile(questionId_s, e) {

        const imageElement_o = e.target.parentElement.previousSibling;

        const file_o = e.target.files[0];

        const formData_o = new FormData();

        formData_o.append('image', file_o);

        const imageType_s = file_o.name.split('.')[1];

        const fileName_s = questionId_s + '.' + imageType_s;

        formData_o.append('fileName', fileName_s);

        e.target.value = null;

        window.questionid = questionId_s;

        axios.post('https://korkort24.com/api/uploads/', formData_o)

            .then(function (fileUploadResponse_o) {

                setModalMessage('Bilden är sparad');

                setShowModal(true);

                imageElement_o.src = 'https://korkort24.com/images/' + fileName_s + '?' + new Date().getTime();
            })

            .catch(function (error) {

                debugger;
            });
    }

    function convertQuizToJsxFormat(quiz_o) {

        let sections_a = [];

        for (const section_s in quiz_o) {

            let questions_a = [];

            const section_o = quiz_o[section_s];

            for (const question_s in section_o) {

                let answers_a = [];

                const question_o = section_o[question_s];

                for (const answer_s in question_o) {

                    if (answer_s !== 'id') {

                        const answer_o = question_o[answer_s];

                        const answer_jsx = (

                            <h6>{answer_s} {answer_o === true ? <span className='correct-answer'>Rätt svar</span> : ''}</h6>
                        );

                        answers_a.push(answer_jsx);
                    }
                }

                const question_jsx = (

                    <div>

                        <h4 style={{ display: 'inline-block' }}>{question_s}</h4>

                        <Button className='delete-section-button'
                            onClick={() => deleteQ(section_s, question_s)}
                            size='sm'
                            type='button'
                            variant='outline-danger'>
                            Ta bort
                        </Button>

                        {answers_a}

                        <img style={{ width: '300px', display: 'block' }} src={'https://korkort24.com/images/find_image.php?name=' + question_o.id} alt='Question illustration' />

                        <Form.Group className='mb-3'
                            controlId='formFileSm'>

                            {/* <Form.Label>Small file input example</Form.Label> */}

                            <Form.Control
                                onChange={(e) => { uploadFile(question_o.id, e) }}
                                size='sm'
                                type='file' />

                        </Form.Group>

                    </div>
                );

                questions_a.push(question_jsx);
            }

            const section_jsx = (

                <div className='section' style={{ marginBottom: '12px' }}>

                    {/* <h1 className='section-header'>{section_s}</h1> */}
                    <details>
                        <summary style={{marginBottom: '10px'}}>{section_s}<Button className='delete-section-button'
                            onClick={() => deleteCategory(section_s)}
                            size='sm'
                            type='button'
                            variant='outline-danger'>
                            Ta bort
                        </Button></summary>
                        {questions_a}
                    </details>

                    {/* <Button className='delete-section-button'
                        onClick={() => deleteCategory(section_s)}
                        size='sm'
                        type='button'
                        variant='outline-danger'>
                        Ta bort
                    </Button> */}



                </div>
            );

            sections_a.push(section_jsx);
        }

        const quiz_jsx = <div>{sections_a}</div>

        return quiz_jsx;
    }

    function addQuestions(e) {

        e.preventDefault();

        e.stopPropagation();

        try {

            var newQuestions_o = JSON.parse(newQuestions.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"'));

        } catch (e) {

            alert('JSON-strukturen är felaktig.');

            return;
        }

        axios.post('https://korkort24.com/api/quiz/', newQuestions_o)

            .then(function (response_o) {

                if (response_o.status === 200) {

                    axios.get('https://korkort24.com/api/quiz/')

                        .then(function (getQuizResponse_o) {

                            if (getQuizResponse_o.status === 200) {

                                quiz_o.current = getQuizResponse_o.data

                                const quiz_jsx = convertQuizToJsxFormat(quiz_o.current);

                                setQuizInJsxFormat(quiz_jsx);

                                setNewQuestions('');

                                setShowModal(true);

                                setModalMessage('Frågorna är tillagda')
                            }
                        })

                        .catch(function (error_o) {

                            debugger;
                        });
                }
            })
            .catch(function (error_o) {

                debugger;
            });
    }

    function addInfo(e) {

        e.preventDefault();

        e.stopPropagation();

    }

    function updateNewInfo(e) {

        setNewInfo(e.target.value);
    }

    async function deleteCategory(category_s) {

        const temp = quiz;

        delete temp[category_s];

        setQuiz(temp);

        const response_o = await fetch('https://korkort24.com/api/quiz/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(temp)
        });

        const quiz_jsx = convertQuizToJsxFormat(quiz);

        setQuizInJsxFormat(quiz_jsx);
    }


    async function addCategory() {
        debugger;
        if (category) {

            quiz[category] = {};

            setCategory('');

            const response_o = await fetch('https://korkort24.com/api/quiz/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quiz)
            });

            const quiz_jsx = convertQuizToJsxFormat(quiz);

            setQuizInJsxFormat(quiz_jsx);
        }
    }

    return (
        <>
            <div className='pb-5'>

                <h1 className='page-header'>Admin Page</h1>

                <Tabs
                    defaultActiveKey="questions"
                    id="admin-tabs"
                    className="mb-3"
                >
                    <Tab eventKey="questions" title="Frågor">

                        <Form.Label htmlFor="category" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', 'color': 'white', borderRadius: '5px', 'padding': '5px' }}>Ny kategori</Form.Label>
                        <Form.Control
                            type="text"
                            id="category"
                            className='mb-3'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <Button
                            size='sm'
                            type='button'
                            variant='primary'
                            className='mb-3'
                            onClick={addCategory}
                        >Lägg till ny kategori</Button>


                        {/* <Button
                            size='sm'
                            type='button'
                            variant='primary'
                            className='mb-3'
                            onClick={() => console.log(quiz)}
                        >Visa objekt</Button> */}

                        {/* <Form className='mb-3'
                            onSubmit={addQuestions}
                            spellCheck={false}
                        >
                            <Form.Group className='mb-3'>

                                <Form.Control className='new-questions-textarea'
                                    as='textarea'
                                    onChange={updateNewQuestions}
                                    rows={20}
                                    value={newQuestions} />

                            </Form.Group>

                            <Button
                                size='sm'
                                type='submit'
                                variant='primary'
                            >
                                Lägg till frågor
                            </Button>

                        </Form> */}

                        <div className='quiz p-3'>{quizInJsxFormat}</div>

                    </Tab>
                    <Tab eventKey="info" title="Info">
                        <Form className='mb-3'
                            onSubmit={addInfo}
                            spellCheck={false}
                        >
                            <Form.Group className='mb-3'>

                                <Form.Control className='new-info-textarea'
                                    as='textarea'
                                    onChange={updateNewInfo}
                                    rows={20}
                                    value={newInfo} />

                            </Form.Group>

                            <Button
                                size='sm'
                                type='submit'
                                variant='primary'
                            >
                                Lägg till info
                            </Button>

                        </Form>
                    </Tab>

                </Tabs>




            </div>

            <Modal show={showModal} onHide={handleClose}>
                {/* <Modal.Header closeButton>
                    <Modal.Title>Frågorna är sparade</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setShowModal(false)}
                        size='sm'
                        variant='primary'
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}