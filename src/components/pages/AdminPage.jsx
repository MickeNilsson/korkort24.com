import { Button, Col, Form, InputGroup, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function AdminPage(props) {

    const [chosenDate, setChosenDate] = useState('');

    const [value, onChange] = useState(new Date());

    const [answers, setAnswers] = useState([]);

    const [availableTimes, setAvailableTimes] = useState([]);

    const [quiz, setQuiz] = useState([]);

    const [convertedQuiz, setConvertedQuiz] = useState([]);

    const [question, setQuestion] = useState('');

    const [showDeleteSectionModal, setShowDeleteSectionModal] = useState(false);

    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

    const [showQuestionsModal, setShowQuestionsModal] = useState(false);

    const [sectionNameToDelete, setSectionNameToDelete] = useState('');

    const [section, setSection] = useState('');

    const [image, setImage] = useState({});

    const [timeSlotLength, setTimeSlotLength] = useState('');

    const [timeSlots, setTimeSlots] = useState([]);

    const [startTime, setStartTime] = useState('');

    const [endTime, setEndTime] = useState('');

    const [events, setEvents] = useState([]);

    const [schedule, setSchedule] = useState({});

    useEffect(() => {

        init();

        async function init() {

            await loadQuiz();

            await fetchAvailableTimes();

            await loadSchedule();
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

        //availTimes = availTimes.filter(availTime => !availTime.studentid);

        availTimes.sort((a, b) => {
            if (a.from < b.from) return -1;
            if (a.from > b.from) return 1;
            return 0;
        });

        let availDates = availTimes.map(availTime => availTime.from.substring(0, 10));


        availDates = [...(new Set(availDates))];

        console.log('=== availTimes ===');
        console.log(availTimes);

        console.log('=== availDates ===');
        console.log(availDates);

        setAvailableTimes(availTimes);

        const eve = availDates.map(availDate => {

            const year = +availDate.substring(0, 4);

            let month = (+availDate.substring(5, 7));

            month--;

            const day = +availDate.substring(8, 10);

            return new Date(year, month, day);
        });

        console.log('=== eve ===');
        console.log(eve);
        //setEvents(eve);

        return availTimes;
    }

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

        console.log(chosenDate_s);

        setChosenDate(chosenDate_s);

        console.log(schedule[chosenDate_s])

        // console.dir(chosenDate_s);

        // console.log(availableTimes);


        // const timeslots = availableTimes.filter(availableTime => {
        //     console.log(availableTime.from.substring(0, 10) + ' = ' + chosenDate_s);
        //     return availableTime.from.substring(0, 10) === chosenDate_s;
        // });

        // console.log(timeslots);

        // setChosenAvailableTimes(timeslots);
        //console.log(value);
    }

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
            questions: []
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

        const questionId_s = generateUUID();

        let fileName_s = '';

        if (image.size) {
            fileName_s = await uploadFile(questionId_s);
        }

        const newQuestion_o = {
            id: questionId_s,
            name: question,
            answers: [],
            explanation: '',
            image: fileName_s
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

    async function deleteQuestion(questionId_s) {

        for (const category_o of quiz) {

            category_o.questions = category_o.questions.filter(question_o => question_o.id !== questionId_s);
        }

        setQuiz([...quiz]);

        await saveQuiz(quiz);
    }

    async function uploadFile(questionId_s) {

        const formData_o = new FormData();

        formData_o.append('image', image);

        const imageType_s = image.name.split('.')[1];

        const fileName_s = questionId_s + '.' + imageType_s;

        formData_o.append('fileName', fileName_s);

        const response_o = await fetch('https://korkort24.com/api/uploads/', {
            method: 'POST',
            body: formData_o
        });

        return fileName_s;
    }

    /**
     * Validates and saves the current time slot. Only numbers are allowed.
     * 
     * @param {string} timeSlot_s 
     */
    function validateTimeSlot(timeSlot_s) {

        timeSlot_s = timeSlot_s.replace(/[^0-9]/g, '');

        setTimeSlotLength(timeSlot_s);
    }

    /**
     * Validates and saves the current start time. Only numbers are allowed. A colon is added automatically.
     * @param {string} startTime_s 
     */
    function validateStartTime(startTime_s) {

        startTime_s = startTime_s.replace(/[^0-9]/g, '');

        if (startTime_s.length > 2) {
            startTime_s = startTime_s.substring(0, 2) + ':' + startTime_s.substring(2, 4);
        }

        setStartTime(startTime_s);
    }

    /**
     * Validates and saves the current end time. Only numbers are allowed. A colon is added automatically.
     * 
     * @param {*} endTime_s 
     */
    function validateEndTime(inputField_o) {

        let endTime_s = inputField_o.value;

        endTime_s = endTime_s.replace(/[^0-9]/g, '');

        if (endTime_s.length > 2) {
            endTime_s = endTime_s.substring(0, 2) + ':' + endTime_s.substring(2, 4);
        }

        setEndTime(endTime_s);
    }

    function createTimeSlot() {

        if (+timeSlotLength && startTime.length === 5 && endTime.length === 5 && startTime < endTime && startTime > '00:00' && endTime < '23:59') {
            const newTimeSlot_o = {
                length: +timeSlotLength,
                start: startTime,
                end: endTime
            };

            setTimeSlots([...timeSlots, newTimeSlot_o]);

            setTimeSlotLength('');

            setStartTime('');

            setEndTime('');
        }
    }

    async function addTimeSlotToDay(timeSlot_o) {

        schedule[chosenDate] = schedule[chosenDate] || [];

        for(const chosenDateTimeSlot_o of schedule[chosenDate]) {
            if(chosenDateTimeSlot_o.start === timeSlot_o.start) {
                return;
            }
        }
        schedule[chosenDate].push(timeSlot_o);

        schedule[chosenDate].sort((a, b) => {
            if(a.start < b.start) return -1;
            if(a.start > b.start) return 1;
            return 0
        });

        setSchedule({ ...schedule });

        await saveSchedule({ ...schedule });
    }

    function deleteScheduleDate(chosenTimeSlot_o, date_s) {

        const date_a = schedule[date_s].filter(timeSlot_o => JSON.stringify(chosenTimeSlot_o) !== JSON.stringify(timeSlot_o));
        
        schedule[date_s] = date_a;

        setSchedule({ ...schedule });

        saveSchedule({ ...schedule });
    }

    async function loadSchedule() {

        const response_o = await fetch('https://korkort24.com/api/schedule/');

        if (response_o.status === 200) {

            const responseBody_o = await response_o.json();

            const schedule_a = responseBody_o.data;

            setSchedule(schedule_a);
        }
    }

    async function saveSchedule(schedule_o) {

        const response_o = await fetch('https://korkort24.com/api/schedule/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(schedule_o)
        });

        const responseBody_o = await response_o.json();
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
                            <div style={{ fontSize: '20px' }} key={section.name}>
                                <span className='section-name' role='button' onClick={() => { setShowQuestionsModal(section.name) }}>{section.name}</span> <i onClick={() => { setSectionNameToDelete(section.name); setShowDeleteSectionModal(true); }} role='button' className='mx-2 bi bi-trash'></i>
                                <i onClick={() => { setShowAddQuestionModal(section.name); setAnswers(['']); setQuestion(''); }} role='button' className='bi bi-plus-square-fill text-success'></i>
                            </div>
                        ))}
                    </div>

                </Tab>

                <Tab eventKey="info" title="Info"></Tab>

                <Tab eventKey="bookings" title="Bokningar">

                    <Row>
                        <Col>
                            <Form.Control
                                onChange={(e) => validateTimeSlot(e.target.value)}
                                placeholder='Längd (min)'
                                size='sm'
                                spellCheck='false'
                                type='text'
                                value={timeSlotLength} />
                        </Col>
                        <Col>
                            <Form.Control
                                onChange={(e) => validateStartTime(e.target.value)}
                                placeholder='Start (hh:mm)'
                                size='sm'
                                spellCheck='false'
                                type='text'
                                value={startTime} />
                        </Col>
                        <Col>
                            <Form.Control
                                onChange={(e) => validateEndTime(e.target)}
                                placeholder='Slut (hh:mm)'
                                size='sm'
                                spellCheck='false'
                                type='text'
                                value={endTime} />
                        </Col>
                        <Col>
                            <Button
                                onClick={() => createTimeSlot()}
                                size='sm'
                                variant='primary'
                            >
                                Skapa
                            </Button>
                        </Col>

                    </Row>

                    <div className='my-2'>

                    {timeSlots.map(timeSlot_o => (
                        <Button
                            className='me-2'
                            onClick={() => addTimeSlotToDay({ start: timeSlot_o.start, end: timeSlot_o.end, length: timeSlot_o.length })}
                            size='sm'
                            variant='primary'
                        >
                            {timeSlot_o.start + ' - ' + timeSlot_o.end + ' ' + timeSlot_o.length + ' min'}
                        </Button>
                    ))
                    }
                    </div>
                    


                    <div style={{float: 'right'}}>
                    {schedule[chosenDate] && schedule[chosenDate].map(chosenDate_o => (
                            <div onClick={() => deleteScheduleDate(chosenDate_o, chosenDate)} className='schedule-date' style={{cursor: 'pointer', marginBottom: '5px', backgroundColor: 'white', padding: '3px', border: '2px solid black', borderRadius: '5px'}}>{chosenDate_o.start} - {chosenDate_o.end} {chosenDate_o.length + ' min'}</div>
                        ))}
                    </div>
                    

                    <Calendar style={{ float: 'left' }} onChange={onChange} onClickDay={handleClickDay} value={value} tileClassName={({ date, view }) =>
                        view === "month" && isEventDate(date) ? "highlight" : null
                    } />
                </Tab>

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

                        <Form.Control
                            onChange={(e) => setImage(e.target.files[0])}
                            type='file'
                            size='sm'
                            className='mb-2'
                        />

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
                            variant='success'
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
                    {
                        (quiz.find(category_o => category_o.name === showQuestionsModal))?.questions.map(question_o => (
                            <div key={question_o.id} className='mb-1'>
                                <h6 className='question'>{question_o.name}<i onClick={() => deleteQuestion(question_o.id)} role='button' className='mx-2 bi bi-trash'></i></h6>
                            </div>
                        ))
                    }
                </Modal.Body>
            </Modal>

        </div>
    );

}