// Node modules
import axios from 'axios';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Nav } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'react-bootstrap/Image';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function StudentAccountPage({ student }) {

    const [quiz, setQuiz] = useState([]);



    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const [value, onChange] = useState(new Date());

    const [show, setShow] = useState(false);

    const [chosenDate, setChosenDate] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setShow(true);
        console.log('handleShow: ' + id);
        setChosenAvailableTime(availableTimes.find(availableTime => availableTime.id === id));
        //setChosenAvailableTime({id: 1});
    }
    // const events = [
    //     new Date(2025, 1, 20), // Add your event dates here
    //     new Date(2025, 1, 22),
    //     new Date(2025, 1, 25),
    // ];

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

    const [events, setEvents] = useState([]);

    // const availableTimes = [
    //     {
    //         id: 1,
    //         from: '2025-01-20T10:00:00',
    //         to: '2025-01-20T10:30:00'
    //     },
    //     {
    //         id: 2,
    //         from: '2025-01-20T12:00:00',
    //         to: '2025-01-20T12:30:00'
    //     },
    //     {
    //         id: 3,
    //         from: '2025-01-22T09:00:00',
    //         to: '2025-01-22T10:00:00'
    //     }
    // ];

    const isEventDate = (date) => {
        return events.some(
            (eventDate) =>
                eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate()
        );
    };

    function handleClickDay(date) {

        let chosenDate_o = new Date(date);

        chosenDate_o.setDate(chosenDate_o.getDate() + 1);//.toISOString().substring(0, 10);

        const chosenDate_s = chosenDate_o.toISOString().substring(0, 10);

        setChosenDate(chosenDate_s);

        console.dir(chosenDate_s);

        console.log(availableTimes);


        const timeslots = availableTimes.filter(availableTime => {
            console.log(availableTime.from.substring(0, 10) + ' = ' + chosenDate_s);
            return availableTime.from.substring(0, 10) === chosenDate_s;
        });

        console.log(timeslots);

        setChosenAvailableTimes(timeslots);
        //console.log(value);
    }

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const [info, setInfo] = useState({});

    const [quizzes, setQuizzes] = useState([]);

    const [quizTitles, setQuizTitles] = useState([]);

    const [quizType, setQuizType] = useState('');

    const [activeQuiz, setActiveQuiz] = useState(null);

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    const [paginationItems, setPaginationItems] = useState({});

    const [chosenAnswers, setChosenAnswers] = useState({});

    const [revealAnswer, setRevealAnswer] = useState(false);

    const [score, setScore] = useState(0);

    const [timer, setTimer] = useState('50:00');

    const [timerRef, setTimerRef] = useState(null);

    const timer_i = useRef(3000);

    const hasFetchedQuiz = useRef(false);

    const quizState_o = useRef({});

    const [availableTimes, setAvailableTimes] = useState([]);

    const [chosenAvailableTimes, setChosenAvailableTimes] = useState([]);

    const [chosenAvailableTime, setChosenAvailableTime] = useState();

    // Fetch quiz when user has logged in to student account
    useEffect(() => {

        if (!hasFetchedQuiz.current) {

            hasFetchedQuiz.current = true;

            fetchQuiz();

            fetchAvailableTimes();
        }

    }, []);

    async function fetchAvailableTimes() {

        // const availTimes = [
        //     {
        //         id: 1,
        //         from: '2025-01-23T10:00:00',
        //         to: '2025-01-23T10:30:00'
        //     },
        //     {
        //         id: 2,
        //         from: '2025-01-20T12:00:00',
        //         to: '2025-01-20T12:30:00'
        //     },
        //     {
        //         id: 3,
        //         from: '2025-01-21T09:00:00',
        //         to: '2025-01-21T10:00:00'
        //     },
        //     {
        //         id: 4,
        //         from: '2025-01-20T09:00:00',
        //         to: '2025-01-20T10:30:00'
        //     }
        // ];

        const response = await fetch('https://korkort24.com/api/times/');

        let availTimes = await response.json();

        availTimes = availTimes.filter(availTime => !availTime.studentid);

        availTimes.sort((a, b) => {
            if(a.from < b.from) return -1;
            if(a.from > b.from) return 1;
            return 0;
        });

        let  availDates = availTimes.map(availTime => availTime.from.substring(0, 10));

        availDates = [...(new Set(availDates))];

        setAvailableTimes(availTimes);

        const eve = availDates.map(availDate => {

            const year = +availDate.substring(0, 4);

            let month = (+availDate.substring(5, 7));

            month--;

            const day = +availDate.substring(8, 10);

            return new Date(year, month, day);
        });


        setEvents(eve);

        return availTimes;
    }

    function startTimer() {

        timer_i.current = 3000;

        const timerRef_s = setInterval(() => {

            timer_i.current--;

            const minutes_i = parseInt(timer_i.current / 60);

            const minutes_s = minutes_i < 10 ? '0' + minutes_i : minutes_i;

            const seconds_i = timer_i.current - minutes_i * 60;

            const seconds_s = seconds_i < 10 ? '0' + seconds_i : seconds_i;

            setTimer(minutes_s + ':' + seconds_s);

        }, 1000);

        setTimerRef(timerRef_s);
    }

    async function fetchQuiz() {

        fetch('https://korkort24.com/api/quiz/')

            .then(async (response_o) => {

                const json_o = await response_o.json();

                setQuiz(json_o.data);

            });
    }

    function showQuiz(quizSelect_o) {
        
        setQuizType('');

        clearInterval(timerRef);

        const selectedOption_o = quizSelect_o[quizSelect_o.options.selectedIndex];

        const quizId_s = selectedOption_o.dataset.quizId;
        
        switch (quizId_s) {

            case '0': // The user didn't chose any quiz

                setActiveQuiz(null);

                break;

            default:

                const chosenQuiz_o = quiz.find(quiz_o => quiz_o.id === quizId_s)

                setActiveQuiz(chosenQuiz_o);
        }
    }

    function deepCopy(obj) {

        return JSON.parse(JSON.stringify(obj));
    }

    function correctTest() {

        let score_i = 0;

        for (const question_o of activeQuiz.questions) {

            const anAnswerWasChosenForThisQuestion_b = chosenAnswers[question_o.id];

            if(anAnswerWasChosenForThisQuestion_b) {

                if(chosenAnswers[question_o.id].isCorrect) {

                    paginationItems[question_o.id] = '#60bd60';

                    score_i++;

                } else {

                    paginationItems[question_o.id] = 'red';
                }
            } else {

                paginationItems[question_o.id] = 'white';
            }
        }

        setPaginationItems(paginationItems);

        setScore(score_i);

        setRevealAnswer(true);

        clearInterval(timerRef);

        forceUpdate();
    }

    function userPickedAnswer() {

        const questionId_s = activeQuiz.questions[activeQuestionIndex].id;

        //paginationItems[questionId_s] = 'rgb(101, 181, 218)';
        paginationItems[questionId_s] = 'rgba(0,0,0,0)';

        setPaginationItems(paginationItems);

        forceUpdate();
    }

    function updateQuiz(answer) {

        for (const quiz_o of quizzes) {

            if (activeQuiz.id === quiz_o.id) {

                quiz_o.questions[activeQuestionIndex].chosenAnswer = answer;

                break;
            }
        }

        setQuizzes(quizzes);
    }

    function updateQuizState(question_o, answer_o) {

        const questionId_s = question_o.id;

        quizState_o.current[questionId_s] = answer_o;
    }


    function handleChange(questionId_s, answer_s) {

        chosenAnswers[questionId_s] = answer_s;

        console.log(chosenAnswers);

        setChosenAnswers(chosenAnswers);

        forceUpdate();
    }

    function activateTimedQuiz() {

        setQuizType('timed');

        const quiz_o = deepCopy(quiz.find(quizItem_o => quizItem_o.id === activeQuiz.id));

        quiz_o.questions = getRandomElements(quiz_o.questions, quiz_o.questions.length);

        setActiveQuiz(quiz_o);

        startTimer();
    }

    function activateStandardQuiz() {

        setQuizType('standard');

        const quiz_o = deepCopy(quiz.find(quizItem_o => quizItem_o.id === activeQuiz.id));

        quiz_o.questions = getRandomElements(quiz_o.questions, quiz_o.questions.length);

        setActiveQuiz(quiz_o);
    }

    function getRandomElements(array, numberOfElements) {
        // Shuffle the array using the Fisher-Yates (aka Knuth) Shuffle
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        // Return the first numberOfElements elements from the shuffled array
        return array.slice(0, numberOfElements);
    }

    function showInfo() {

        axios.get('https://korkort24.com/api/info/')

            .then(response_o => {

                if (response_o && response_o.data) {

                    setInfo(response_o.data[0]);
                }
            });
    }

    async function bookAppointment() {
        
        console.log(chosenAvailableTime);

        console.log(student);

        const body_o = {
            studentid : student.id,
            timeid: chosenAvailableTime.id
        };

        const response_o = await fetch('https://korkort24.com/api/times/', {
            method: 'PUT',
            body: JSON.stringify(body_o),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json_o = await response_o.json();

        console.log(json_o);

        handleClose();

        const updatedAvailableTimes = await fetchAvailableTimes();

        const timeslots = updatedAvailableTimes.filter(availableTime => {
            console.log(availableTime.from.substring(0, 10) + ' = ' + chosenDate);
            return availableTime.from.substring(0, 10) === chosenDate;
        });

        console.log(timeslots);

        setChosenAvailableTimes(timeslots);

        setShowConfirmationModal(true);
    }

    return (

        <>
            <h1 style={{ color: 'white' }}>{student.firstname} {student.lastname}'s konto</h1>

            <Tabs
                defaultActiveKey='home'
                className="mb-3"
            >
                <Tab eventKey="home" title="Hem" className='text-white'>

                    <div style={{ borderRadius: '5px', backgroundColor: 'rgba(0, 0, 0, 1)' }} className='p-2 mt-3 text-white'>
                        Hej {student.firstname}!
                        <p>Dina resultat:</p>
                        <p>B-körkortsprov: 62 av 65 rätt</p>
                    </div>

                </Tab>

                <Tab eventKey="questions" title="Frågor" className='p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 1' }}>

                    <Form.Select
                        className='mb-2'
                        onChange={e => showQuiz(e.target)}
                        size='sm'>
                        <option data-quiz-id="0">Välj ett frågeformulär</option>
                        {quiz.map(quiz_o => <option key={quiz_o.id} data-quiz-id={quiz_o.id}>{quiz_o.name}</option>)}
                    </Form.Select>

                    {activeQuiz && <div className='mb-3 mt-3'>

                        <div className='text-center'>
                            {!quizType &&
                                <span>
                                    <Button className='me-3' size='sm' variant='primary' onClick={activateStandardQuiz}>Alla frågor</Button>
                                    <Button size='sm' variant='primary' onClick={activateTimedQuiz}>Frågor på tid</Button>
                                </span>}

                            {quizType === 'timed' && <span className='ms-3' style={{ color: 'white' }}>{timer}</span>}

                             {/* <i role='button' className='bi bi-x-circle text-white fs-3 float-end'></i> */}
                        </div>

                    </div>}

                    {quizType && activeQuiz &&

                        <div>

                            <div className='rounded'>

                                <Button size='sm' variant='primary' onClick={() => { document.getElementById('someid').scrollLeft = document.getElementById('someid').scrollLeft - 32; setActiveQuestionIndex(activeQuestionIndex > 0 ? activeQuestionIndex - 1 : activeQuestionIndex) }}>{'<'}</Button>

                                <Button style={{ marginLeft: '10px' }} size='sm' variant='primary' onClick={() => { document.getElementById('someid').scrollLeft = document.getElementById('someid').scrollLeft + 32; setActiveQuestionIndex(activeQuestionIndex < (activeQuiz.questions.length - 1) ? activeQuestionIndex + 1 : activeQuestionIndex) }}>{'>'}</Button>

                                <Pagination id="someid" size='sm' style={{ float: 'right', overflow: 'auto', borderRadius: '3px', width: 'calc(100% - 80px)' }}>

                                    {activeQuiz.questions.map((question_o, pageIndex_i) => {
                                       
                                        const backgroundColor_s = paginationItems[question_o.id] || 'white';

                                        return <Pagination.Item linkStyle={{ color: '#0d6efd', backgroundColor: backgroundColor_s, width: '33px', paddingLeft: 0, paddingRight: 0, textAlign: 'center' }} onClick={() => setActiveQuestionIndex(pageIndex_i)} style={{ display: 'inline-block' }} key={pageIndex_i} active={pageIndex_i === activeQuestionIndex}>{pageIndex_i + 1}</Pagination.Item>;
                                    })}

                                </Pagination>

                                {activeQuiz.questions[activeQuestionIndex].image && <div style={{marginTop: '10px'}}></div>}
                                
                                <h4 className='text-white' style={{ display: 'inline-block' }}>{activeQuiz.questions[activeQuestionIndex].name}</h4>

                                {activeQuiz.questions[activeQuestionIndex].image && <Image style={{maxWidth: '100%', marginBottom: '10px', marginTop: '10px'}} src={'https://korkort24.com/api/quizimages/' + activeQuiz.questions[activeQuestionIndex].image} rounded />}

                                {activeQuiz.questions[activeQuestionIndex].answers.map((answer_o, index) => {
                                    
                                    const questionId_s = activeQuiz.questions[activeQuestionIndex].id;

                                    //const answer_s = answer.answer

                                    //const isCorrect_b = answer.isCorrect;

                                    return (

                                        <Form.Check
                                            disabled={revealAnswer}
                                            key={questionId_s + index}
                                            id={questionId_s + index}
                                            name='answer'
                                            onClick={() => console.log('asdf')}
                                            onChange={() => { userPickedAnswer(); handleChange(questionId_s, answer_o) }}
                                            defaultChecked={chosenAnswers[questionId_s] === answer_o}
                                            type='radio'
                                            style={{ opacity: '1.0', borderRadius: '5px', backgroundColor: (chosenAnswers[questionId_s] === answer_o && paginationItems[questionId_s]) || '' }}
                                            className='text-white answer'
                                            label={answer_o.name} />
                                    );

                                })}

                                {revealAnswer && <div className='text-white fs-3 mt-3'>{score} rätt{score > 1 ? 'a' : ''} svar av {quizType === 'standard' ? '187' : '65'} {quizType === 'timed' ? (score > 51 ? <span className='text-success'>Godkänt</span> : <span className='text-danger'>Underkänt</span>) : ''} <Button onClick={() => { setRevealAnswer(false); setQuizType(''); setChosenAnswers([]); setPaginationItems([]); setActiveQuestionIndex(0); }} className='float-end' size='sm' variant='primary'>Stäng</Button></div>}

                                {!revealAnswer && <Button className='mt-3' variant='primary' onClick={correctTest}>Avsluta testet och visa resultatet</Button>}

                            </div>

                        </div>
                    }

                </Tab>

                <Tab eventKey="info" title="Info">

                    <Form.Select onChange={e => showInfo(e.target)} size='sm'>

                        <option>Välj en text</option>
                        <option>B-Körkort</option>

                    </Form.Select>

                    {info.text && <div style={{ borderRadius: '5px', backgroundColor: 'rgba(0, 0, 0, 1)' }} className='p-2 mt-3 text-white' dangerouslySetInnerHTML={{ __html: info.text }}></div>}

                </Tab>

                <Tab eventKey="driving" title="Coaching">

                    <div style={{ borderRadius: '5px', backgroundColor: 'rgba(0, 0, 0, 1)', height: '1000px' }} className='p-2 mt-3 text-white'>
                        <h2>Boka coaching</h2>
                        <Calendar style={{ float: 'left' }} onChange={onChange} onClickDay={handleClickDay} value={value} tileClassName={({ date, view }) =>
                            view === "month" && isEventDate(date) ? "highlight" : null
                        } />
                        <div style={{ float: 'left', width: '150px' }}>{chosenAvailableTimes.map(availableTime => <span onClick={() => handleShow(availableTime.id)} className="available-time" key={availableTime.id}>{availableTime.from.substring(11, 16)} - {availableTime.to.substring(11, 16)}</span>)}</div>
                    </div>


                </Tab>

            </Tabs>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Boka coaching</Modal.Title>
                </Modal.Header>
                <Modal.Body>Boka coaching {
                        chosenAvailableTime && (new Date(chosenAvailableTime.from)).toLocaleDateString('sv', options)
                    } {' '} kl. {chosenAvailableTime && (chosenAvailableTime.from.substring(11, 16) + ' - ' + chosenAvailableTime.to.substring(11, 16))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Stäng
                    </Button>
                    <Button variant="primary" onClick={bookAppointment}>
                        Boka
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Bokningen genomförd</Modal.Title>
                </Modal.Header>
                <Modal.Body>Du har bokat coaching {
                        chosenAvailableTime && (new Date(chosenAvailableTime.from)).toLocaleDateString('sv', options)
                    } {' '} kl. {chosenAvailableTime && (chosenAvailableTime.from.substring(11, 16) + ' - ' + chosenAvailableTime.to.substring(11, 16))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowConfirmationModal(false)}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

