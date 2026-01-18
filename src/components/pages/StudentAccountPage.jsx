import { useEffect, useReducer, useRef, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import PropTypes from "prop-types";

// Här definierar du vad "student" ska innehålla
StudentAccountPage.propTypes = {
  student: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    id: PropTypes.number
  }).isRequired,
};

export default function StudentAccountPage({ student }) {
    async function init() {
        hasFetchedQuiz.current = true;
        await fetchQuiz();
        await fetchAvailableTimes();
        const today_o = new Date();
        const currentDate_s = today_o.toISOString().split("T")[0];
        await loadSchedule(currentDate_s);
        setBookedAppointments(await loadAppointments({ member_id: student.id }));
        await loadEducationCard();
    }

    async function loadEducationCard() {
        const response_o = await fetch(
            "https://korkort24.com/api/educationcards/?member_id=" + student.id,
        );

        const responseBody_o = await response_o.json();

        const educationCard_a = responseBody_o.data;

        educationCard_a.sort((a, b) => a.moment - b.moment);

        setEducationcard(educationCard_a);
    }

    const [datesOfWeek, setDatesOfWeek] = useState([]);

    const [quiz, setQuiz] = useState([]);

    const [timeSlots, setTimeSlots] = useState([]);

    const [showCancelModal, setShowCancelModal] = useState(false);

    const [cancelAppointmentId, setCancelAppointmentId] = useState(null);

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const [value, onChange] = useState(new Date());

    const [show, setShow] = useState(false);

    const [educationcard, setEducationcard] = useState([]);

    const moments = [
        [],
        ["a) Stol och bälte", "b) Reglage och instrument"],
        ["a) Start och stanna", "b) Krypkörning och styrning"],
        ["a) Uppväxlning", "b) Nedväxling"],
        ["a) Motlut", "b) Medlut"],
        ["a) Backning", "b) Vändning", "c) Parkering"],
        ["a) Bilen", "b) Last och passagerare", "c) Släp", "d) Säkerhetskontroll"],
        [
            "a) Avsökning och riskbedömning",
            "b) Samordning och motorik",
            "c) Acceleration",
            "d) Hård bromsning",
        ],
        [
            "a) Avsökning och riskbedömning",
            "b) Hastighetsanpassning",
            "c) Placering",
            "d) Väjningsregler",
        ],
        [
            "a) Avsökning och riskbedömning",
            "b) Hastighetsanpassning",
            "c) Placering",
            "d) Väjningsregler",
            "e) Järnvägskorsning",
        ],
        [
            "a) Avsökning och riskbedömning",
            "b) Hastighetsanpassning",
            "c) Placering",
            "d) Väjningsregler",
            "e) Trafiksignal",
            "f) Enkelriktad trafik",
            "g) Cirkulationsplats",
            "h) Vändning och parkering",
        ],
        [
            "a) Avsökning och riskbedömning",
            "b) Hastighetsanpassning",
            "c) Placering",
            "d) Påfart och avfart",
            "e) Omkörning",
            "f) Vändning och parkering",
        ],
        [
            "a) Avsökning och riskbedömning",
            "b) Hastighetsanpassning",
            "c) Motorväg",
            "d) Motortrafikled",
            "d) Mitträckeväg(2-1)",
        ],
        [
            "a) Avsökning och riskbedömning",
            "b) Hastighetsanpassning",
            "c) Mörkerdemonstration",
            "d) Möte",
            "e) Omkörning",
            "f) Parkering",
            "g) Nedsatt sikt",
        ],
        ["a) Olika typer av halka", "b) Utrustning och system"],
        [
            "a) Tillämpad stadskörning",
            "b) Tillämpad landsvägskörning",
            "c) Utbildningskontroll",
        ],
    ];

    const momentHeaders = [
        "",
        "Körställning",
        "Inledande manövrering",
        "Växling",
        "Lutning",
        "Manövrering",
        "Funktion och kontroll",
        "Samordning och bromsning",
        "Mindre samhälle",
        "Mindre landsväg",
        "Stad",
        "Landsväg",
        "Högfartsväg",
        "Mörker",
        "Halt väglag",
        "Utbildningskontroll",
    ];

    const WEEKDAYS = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"];

    const handleClose = () => setShow(false);

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    const [events, setEvents] = useState([]);

    const isEventDate = (date) => {
        return events.some(
            (eventDate) =>
                eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate(),
        );
    };

    async function handleClickDay(date) {
        let chosenDate_s = date;

        if (typeof date === "object") {
            let chosenDate_o = new Date(date);

            chosenDate_o.setDate(chosenDate_o.getDate() + 1);

            chosenDate_s = chosenDate_o.toISOString().substring(0, 10);
        }

        const schedule_a = await loadSchedule(chosenDate_s);

        const availableTimeSlots_o = {};

        for (const schedule_o of schedule_a) {
            const appointments_a = await loadAppointments({
                schedule_id: schedule_o.id,
            });

            const availableTimeSlots_a = getAvailableSlots(
                schedule_o,
                appointments_a,
                60,
            );

            availableTimeSlots_o[schedule_o["date"]] = availableTimeSlots_a;

            availableTimeSlots_o[schedule_o["date"] + "_id"] = schedule_o.id;
        }

        setTimeSlots(availableTimeSlots_o);
    }

    function getAvailableSlots(schedule, bookings, length) {
        const [startStr, endStr] = schedule.timespan.split("-");
        const date = schedule.date;

        const startTime = new Date(`${date}T${startStr}`);
        const endTime = new Date(`${date}T${endStr}`);

        const slotDurationMs = length * 60 * 1000;

        const availableSlots = [];

        for (
            let slotStart = new Date(startTime);
            slotStart.getTime() + slotDurationMs <= endTime.getTime();
            slotStart = new Date(slotStart.getTime() + slotDurationMs)
        ) {
            const slotEnd = new Date(slotStart.getTime() + slotDurationMs);

            const hasOverlap = bookings.some((booking) => {
                const bookingStart = new Date(booking.start);
                const bookingEnd = new Date(booking.end);
                return slotStart < bookingEnd && slotEnd > bookingStart;
            });

            if (!hasOverlap) {
                availableSlots.push(slotStart.toTimeString().slice(0, 5)); // Format "HH:MM"
            }
        }

        return availableSlots;
    }

    const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

    const [info, setInfo] = useState({});

    const [quizzes, setQuizzes] = useState([]);

    const [quizType, setQuizType] = useState("");

    const [activeQuiz, setActiveQuiz] = useState(null);

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    const [paginationItems, setPaginationItems] = useState({});

    const [chosenAnswers, setChosenAnswers] = useState({});

    const [revealAnswer, setRevealAnswer] = useState(false);

    const [score, setScore] = useState(0);

    const [timer, setTimer] = useState("50:00");

    const [timerRef, setTimerRef] = useState(null);

    const timer_i = useRef(3000);

    const hasFetchedQuiz = useRef(false);

    const quizState_o = useRef({});

    const [chosenAvailableTime, setChosenAvailableTime] = useState();

    const [bookedAppointments, setBookedAppointments] = useState([]);

    // Fetch quiz when user has logged in to student account
    useEffect(() => {
        if (!hasFetchedQuiz.current) {
            init();
        }
    }, []);

    async function loadAppointments(params_o) {
        const queryParams_s = new URLSearchParams(params_o).toString();

        const response_o = await fetch(
            "https://korkort24.com/api/bookings/?" + queryParams_s,
        );

        if (response_o.status === 200) {
            const responseBody_o = await response_o.json();

            const appointments_a = responseBody_o.data;

            return appointments_a;
        }

        return [];
    }

    async function loadSchedule(date_s) {
        const dates_a = getDatesOfWeek(date_s);

        setDatesOfWeek(getDatesOfWeek(date_s));

        const response_o = await fetch(
            "https://korkort24.com/api/schedules/?fromDate=" +
            dates_a[0] +
            "&toDate=" +
            dates_a[6],
        );

        if (response_o.status === 200) {
            const responseBody_o = await response_o.json();
            const schedule_a = responseBody_o.data;
            return schedule_a;
        }

        return [];
    }

    function getDatesOfWeek(dateString) {
        const date = new Date(dateString);

        // Hitta veckodag (0 = Söndag, 1 = Måndag... 6 = Lördag)
        const dayOfWeek = date.getDay();

        // Beräkna differens för att nå måndagen (om söndag (0), gå tillbaka 6 dagar)
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const monday = new Date(date);
        monday.setDate(date.getDate() + diffToMonday);

        const weekDates = [];

        for (let i = 0; i < 7; i++) {
            const current = new Date(monday);
            current.setDate(monday.getDate() + i);

            // Formatera tillbaka till YYYY-MM-DD (ISO-standard)
            const formattedDate = current.toISOString().split("T")[0];
            weekDates.push(formattedDate);
        }

        return weekDates;
    }

    async function fetchAvailableTimes() {

        const response = await fetch("https://korkort24.com/api/times/");

        let availTimes = await response.json();

        availTimes = availTimes.filter((availTime) => !availTime.studentid);

        availTimes.sort((a, b) => {
            if (a.from < b.from) return -1;
            if (a.from > b.from) return 1;
            return 0;
        });

        let availDates = availTimes.map((availTime) =>
            availTime.from.substring(0, 10),
        );

        availDates = [...new Set(availDates)];

        const eve = availDates.map((availDate) => {
            const year = +availDate.substring(0, 4);

            let month = +availDate.substring(5, 7);

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

            const minutes_s = minutes_i < 10 ? "0" + minutes_i : minutes_i;

            const seconds_i = timer_i.current - minutes_i * 60;

            const seconds_s = seconds_i < 10 ? "0" + seconds_i : seconds_i;

            setTimer(minutes_s + ":" + seconds_s);
        }, 1000);

        setTimerRef(timerRef_s);
    }

    async function fetchQuiz() {
        fetch("https://korkort24.com/api/quiz/").then(async (response_o) => {
            const json_o = await response_o.json();

            setQuiz(json_o.data);
        });
    }

    function showQuiz(quizSelect_o) {
        setRevealAnswer(false);
        setActiveQuestionIndex(0);
        setPaginationItems({});
        setChosenAnswers({});

        setQuizType("");

        clearInterval(timerRef);

        const selectedOption_o = quizSelect_o[quizSelect_o.options.selectedIndex];

        const quizId_s = selectedOption_o.dataset.quizId;

        switch (quizId_s) {
            case "0": // The user didn't chose any quiz
                setActiveQuiz(null);
                break;

            default: {
                const chosenQuiz_o = quiz.find((quiz_o) => quiz_o.id === quizId_s);
                setActiveQuiz(chosenQuiz_o);
            }
                
        }
    }

    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function correctTest() {
        let score_i = 0;

        for (const question_o of activeQuiz.questions) {
            const anAnswerWasChosenForThisQuestion_b = chosenAnswers[question_o.id];

            if (anAnswerWasChosenForThisQuestion_b) {
                if (chosenAnswers[question_o.id].isCorrect) {
                    paginationItems[question_o.id] = "#60bd60";

                    score_i++;
                } else {
                    paginationItems[question_o.id] = "red";
                }
            } else {
                paginationItems[question_o.id] = "white";
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

        paginationItems[questionId_s] = "rgba(0,0,0,0)";

        setPaginationItems(paginationItems);

        forceUpdate();
    }

    function handleChange(questionId_s, answer_s) {

        chosenAnswers[questionId_s] = answer_s;

        setChosenAnswers(chosenAnswers);

        forceUpdate();
    }

    function activateTimedQuiz() {
        setQuizType("timed");

        const quiz_o = deepCopy(
            quiz.find((quizItem_o) => quizItem_o.id === activeQuiz.id),
        );

        quiz_o.questions = getRandomElements(
            quiz_o.questions,
            quiz_o.questions.length,
        );

        setActiveQuiz(quiz_o);

        startTimer();
    }

    function activateStandardQuiz() {
        setQuizType("standard");

        const quiz_o = deepCopy(
            quiz.find((quizItem_o) => quizItem_o.id === activeQuiz.id),
        );

        quiz_o.questions = getRandomElements(
            quiz_o.questions,
            quiz_o.questions.length,
        );

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

    async function showInfo() {

        const response_o = await fetch("https://korkort24.com/api/info/");

        const responseBody_o = await response_o.json();

        setInfo(responseBody_o[0]);        
    }

    async function bookAppointment(timeSlot, scheduleId, date_s) {
        handleClickDay(date_s);

        const startDateTime_s = date_s + "T" + timeSlot + ":00";

        const endDateTime_s = addMinutesToLocalTime(startDateTime_s, 60);

        const body_o = {
            schedule_id: scheduleId,
            member_id: student.id,
            start: startDateTime_s,
            end: endDateTime_s,
        };

        await fetch("https://korkort24.com/api/bookings/", {
            method: "POST",
            body: JSON.stringify(body_o),
            headers: {
                "Content-Type": "application/json",
            },
        });

        setBookedAppointments(await loadAppointments({ member_id: student.id }));
    }

    function addMinutesToLocalTime(timestamp, minutesToAdd) {
        const date = new Date(timestamp);
        date.setMinutes(date.getMinutes() + minutesToAdd);

        // Hjälpfunktion för att lägga till nolla framför ental (t.ex. 7 → 07)
        const pad = (num) => String(num).padStart(2, "0");

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // Månader är 0-indexerade
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    function setKey(key) {
        switch (key) {
            case "home":
                loadAppointments({ member_id: student.id });
                break;
        }
    }

    function formatDateToSwedish(dateString) {
        const date = new Date(dateString);

        const weekdays = [
            "Söndagen",
            "Måndagen",
            "Tisdagen",
            "Onsdagen",
            "Torsdagen",
            "Fredagen",
            "Lördagen",
        ];
        const months = [
            "januari",
            "februari",
            "mars",
            "april",
            "maj",
            "juni",
            "juli",
            "augusti",
            "september",
            "oktober",
            "november",
            "december",
        ];

        const weekday = weekdays[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];

        // Funktion för korrekt svensk ändelse
        function getSwedishDateSuffix(day) {
            if ([1, 2, 21, 22, 31].includes(day)) {
                return `${day}:a`;
            } else if (day === 3 || day === 23) {
                return `${day}:e`;
            } else {
                return `${day}:e`;
            }
        }

        const formattedDay = getSwedishDateSuffix(day);

        return `${weekday} den ${formattedDay} ${month}`;
    }

    function cancelAppointment() {
        fetch("https://korkort24.com/api/bookings/" + cancelAppointmentId, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.status === 200) {
                    setBookedAppointments(
                        bookedAppointments.filter(
                            (appointment) => appointment.id !== cancelAppointmentId,
                        ),
                    );
                } else {
                    console.error("Failed to cancel appointment");
                }
                setShowCancelModal(false);
                setCancelAppointmentId(null);
            })
            .catch((error) => console.error("Error:", error));
    }

    return (
        <>
            <h1 style={{ color: "white" }}>
                {student.firstname} {student.lastname}'s konto
            </h1>

            <Tabs
                defaultActiveKey="home"
                className="mb-3 clearfix"
                onSelect={(k) => setKey(k)}
            >
                <Tab eventKey="home" title="Hem">
                    <div className="p-2 mt-3 text-white">
                        <h2>Hej {student.firstname}!</h2>
                        <h3>Dina bokningar</h3>
                        {bookedAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="mt-3 d-flex align-items-center"
                            >
                                <span
                                    className="me-3"
                                    style={{
                                        backgroundColor: "white",
                                        color: "black",
                                        borderRadius: "3px",
                                        padding: "3px",
                                    }}
                                >
                                    {appointment.start.substring(0, 10)}{" "}
                                    {appointment.start.substring(11, 16)}
                                </span>
                                <Button
                                    onClick={() => {
                                        setCancelAppointmentId(appointment.id);
                                        setShowCancelModal(true);
                                    }}
                                    size="sm"
                                    style={{ paddingTop: "3px", paddingBottom: "3px" }}
                                    variant="danger"
                                >
                                    Avboka
                                </Button>
                            </div>
                        ))}
                        {bookedAppointments.length === 0 && (
                            <div>Du har inga bokningar.</div>
                        )}
                    </div>
                </Tab>

                <Tab eventKey="questions" title="Frågor" className="p-3">
                    <Form.Select
                        id="select-quiz"
                        className="mb-2"
                        onChange={(e) => showQuiz(e.target)}
                        size="sm"
                    >
                        <option data-quiz-id="0">Välj ett frågeformulär</option>
                        {quiz.map((quiz_o) => (
                            <option key={quiz_o.id} data-quiz-id={quiz_o.id}>
                                {quiz_o.name}
                            </option>
                        ))}
                    </Form.Select>

                    {activeQuiz && (
                        <div className="mb-3 mt-3">
                            <div className="text-center">
                                {!quizType && (
                                    <span>
                                        <Button
                                            className="me-3"
                                            size="sm"
                                            variant="primary"
                                            onClick={activateStandardQuiz}
                                        >
                                            Alla frågor
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={activateTimedQuiz}
                                        >
                                            Frågor på tid
                                        </Button>
                                    </span>
                                )}

                                {quizType === "timed" && (
                                    <span className="ms-3" style={{ color: "white" }}>
                                        {timer}
                                    </span>
                                )}

                            </div>
                        </div>
                    )}

                    {quizType && activeQuiz && (
                        <div>
                            <div className="rounded">
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => {
                                        document.getElementById("someid").scrollLeft =
                                            document.getElementById("someid").scrollLeft - 32;
                                        setActiveQuestionIndex(
                                            activeQuestionIndex > 0
                                                ? activeQuestionIndex - 1
                                                : activeQuestionIndex,
                                        );
                                    }}
                                >
                                    {"<"}
                                </Button>

                                <Button
                                    style={{ marginLeft: "10px" }}
                                    size="sm"
                                    variant="primary"
                                    onClick={() => {
                                        document.getElementById("someid").scrollLeft =
                                            document.getElementById("someid").scrollLeft + 32;
                                        setActiveQuestionIndex(
                                            activeQuestionIndex < activeQuiz.questions.length - 1
                                                ? activeQuestionIndex + 1
                                                : activeQuestionIndex,
                                        );
                                    }}
                                >
                                    {">"}
                                </Button>

                                <Pagination
                                    id="someid"
                                    size="sm"
                                    style={{
                                        float: "right",
                                        overflow: "auto",
                                        borderRadius: "3px",
                                        width: "calc(100% - 80px)",
                                    }}
                                >
                                    {activeQuiz.questions.map((question_o, pageIndex_i) => {
                                        const backgroundColor_s =
                                            paginationItems[question_o.id] || "white";

                                        return (
                                            <Pagination.Item
                                                linkStyle={{
                                                    color: "#0d6efd",
                                                    backgroundColor: backgroundColor_s,
                                                    width: "33px",
                                                    paddingLeft: 0,
                                                    paddingRight: 0,
                                                    textAlign: "center",
                                                }}
                                                onClick={() => setActiveQuestionIndex(pageIndex_i)}
                                                style={{ display: "inline-block" }}
                                                key={pageIndex_i}
                                                active={pageIndex_i === activeQuestionIndex}
                                            >
                                                {pageIndex_i + 1}
                                            </Pagination.Item>
                                        );
                                    })}
                                </Pagination>

                                {activeQuiz.questions[activeQuestionIndex].image && (
                                    <div style={{ marginTop: "10px" }}></div>
                                )}

                                <h4 className="text-white" style={{ display: "inline-block" }}>
                                    {activeQuiz.questions[activeQuestionIndex].name}
                                </h4>

                                {activeQuiz.questions[activeQuestionIndex].image && (
                                    <Image
                                        style={{
                                            maxWidth: "100%",
                                            marginBottom: "10px",
                                            marginTop: "10px",
                                            display: "block",
                                        }}
                                        src={
                                            "https://korkort24.com/api/quizimages/" +
                                            activeQuiz.questions[activeQuestionIndex].image
                                        }
                                        rounded
                                    />
                                )}

                                {activeQuiz.questions[activeQuestionIndex].answers.map(
                                    (answer_o, index) => {
                                        const questionId_s =
                                            activeQuiz.questions[activeQuestionIndex].id;

                                        return (
                                            <Form.Check
                                                disabled={revealAnswer}
                                                key={questionId_s + index}
                                                id={questionId_s + index}
                                                name="answer"
                                                onClick={() => console.log("asdf")}
                                                onChange={() => {
                                                    userPickedAnswer();
                                                    handleChange(questionId_s, answer_o);
                                                }}
                                                defaultChecked={
                                                    chosenAnswers[questionId_s] === answer_o
                                                }
                                                type="radio"
                                                style={{
                                                    opacity: "1.0",
                                                    borderRadius: "5px",
                                                    backgroundColor:
                                                        (chosenAnswers[questionId_s] === answer_o &&
                                                            paginationItems[questionId_s]) ||
                                                        "",
                                                }}
                                                className="text-white answer"
                                                label={answer_o.name}
                                            />
                                        );
                                    },
                                )}

                                {revealAnswer && (
                                    <div className="text-white fs-3 mt-3">
                                        {score} rätt{score > 1 ? "a" : ""} svar av{" "}
                                        {activeQuiz.questions.length}{" "}
                                        {quizType === "timed" ? (
                                            score > 51 ? (
                                                <span className="text-success"></span>
                                            ) : (
                                                <span className="text-danger"></span>
                                            )
                                        ) : (
                                            ""
                                        )}{" "}
                                        <Button
                                            onClick={() => {
                                                setRevealAnswer(false);
                                                setQuizType("");
                                                setChosenAnswers([]);
                                                setPaginationItems([]);
                                                setActiveQuestionIndex(0);
                                            }}
                                            className="float-end"
                                            size="sm"
                                            variant="primary"
                                        >
                                            Stäng
                                        </Button>
                                    </div>
                                )}

                                {!revealAnswer && (
                                    <Button
                                        className="mt-3"
                                        variant="primary"
                                        onClick={correctTest}
                                    >
                                        Avsluta testet och visa resultatet
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </Tab>

                <Tab eventKey="info" title="Info">
                    <Form.Select
                        id="select-info"
                        onChange={(e) => showInfo(e.target)}
                        size="sm"
                    >
                        <option>Välj en text</option>
                        <option>B-Körkort</option>
                    </Form.Select>

                    {info.text && (
                        <div
                            className="p-2 mt-3 text-white"
                            dangerouslySetInnerHTML={{ __html: info.text }}
                        ></div>
                    )}
                </Tab>

                <Tab eventKey="driving" title="Coaching">
                    <div className="p-2 mt-3 text-white">
                        <h2>Boka coaching</h2>

                        <Calendar
                            onChange={onChange}
                            onClickDay={handleClickDay}
                            value={value}
                            tileClassName={({ date, view }) =>
                                view === "month" && isEventDate(date) ? "highlight" : null
                            }
                        />

                        <table style={{ border: "1px solid" }}>
                            <thead>
                                <tr>
                                    {/* Ändrat till .length > 0 för att undvika att siffran renderas */}
                                    {datesOfWeek &&
                                        datesOfWeek.length > 0 &&
                                        datesOfWeek.map((date_s, index_i) => {
                                            return (
                                                <th
                                                    key={date_s}
                                                    style={{
                                                        textAlign: "center",
                                                        width: "50px",
                                                        borderLeft: "1px solid",
                                                        borderRight: "1px solid",
                                                    }}
                                                >
                                                    {WEEKDAYS[index_i]}
                                                </th>
                                            );
                                        })}
                                </tr>

                                <tr>
                                    {datesOfWeek &&
                                        datesOfWeek.length > 0 &&
                                        datesOfWeek.map((date_s) => {
                                            return (
                                                <th
                                                    key={date_s}
                                                    style={{
                                                        textAlign: "center",
                                                        borderLeft: "1px solid",
                                                        borderRight: "1px solid",
                                                    }}
                                                >
                                                    {date_s.substring(8)}
                                                </th>
                                            );
                                        })}
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    {datesOfWeek &&
                                        datesOfWeek.length > 0 &&
                                        datesOfWeek.map((date_s) => {
                                            return (
                                                <td key={date_s} style={{ verticalAlign: "top" }}>
                                                    {
                                                        timeSlots[date_s]
                                                            ? timeSlots[date_s].map((timeSlot_s, index) => (
                                                                <span
                                                                    key={index}
                                                                    onClick={() =>
                                                                        bookAppointment(
                                                                            timeSlot_s,
                                                                            timeSlots[date_s + "_id"],
                                                                            date_s,
                                                                        )
                                                                    }
                                                                    className="schedule-date"
                                                                    style={{
                                                                        float: "left",
                                                                        cursor: "pointer",
                                                                        marginBottom: "5px",
                                                                        color: "black",
                                                                        backgroundColor: "white",
                                                                        padding: "3px",
                                                                        border: "2px solid black",
                                                                        borderRadius: "5px",
                                                                    }}
                                                                >
                                                                    {timeSlot_s}
                                                                    <br />
                                                                </span>
                                                            ))
                                                            : null /* Ändrat från '' till null */
                                                    }
                                                </td>
                                            );
                                        })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Tab>

                <Tab eventKey="downloads" title="Nedladdningar">
                    <div className="p-2 mt-3 text-white">
                        <h2>Nedladdningar</h2>

                        <a href="https://korkort24.com/docs/test.pdf" download>
                            test.pdf
                        </a>
                    </div>
                </Tab>

                <Tab eventKey="educationcard" title="Utbildningskort">
                    <div className="p-2 mt-3 text-white">
                        <h2>Utbildningskort</h2>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                            (moment) => {
                                const entry_o = educationcard.find((e) => e.moment === moment);
                                return (
                                    <div key={moment + "moment"}>
                                        <div
                                            className="d-inline-flex align-items-center justify-content-center 
             rounded-circle bg-primary text-white me-2"
                                            style={{ width: "40px", height: "40px" }}
                                        >
                                            {moment}
                                        </div>
                                        <strong style={{ fontSize: "20px" }}>
                                            {momentHeaders[moment]}
                                        </strong>
                                        <div style={{ paddingLeft: "50px", marginBottom: "10px" }}>
                                            {moments[moment] &&
                                                moments[moment].map((moment_a, index) => {
                                                    let checked = entry_o?.submoment?.includes(
                                                        moment_a.charAt(0),
                                                    );
                                                    return (
                                                        <p
                                                            key={moment + "submoment" + index}
                                                            style={{ marginBottom: "0" }}
                                                        >
                                                            {moment_a}{" "}
                                                            <input
                                                                id={moment + "submoment" + index}
                                                                disabled={!checked}
                                                                type="checkbox"
                                                                checked={checked}
                                                            />
                                                        </p>
                                                    );
                                                })}
                                        </div>
                                        {["D", "I", "S", "G", "👍", "👎"].map((state) => {
                                            const isFilled = entry_o?.state?.includes(state); // ✅ check if letter exists
                                            return (
                                                <span
                                                    key={state}
                                                    className={`moment-styles me-1 d-inline-flex align-items-center justify-content-center rounded 
                     ${isFilled ? "bg-primary text-white" : ""}`}
                                                >
                                                    {state}
                                                </span>
                                            );
                                        })}
                                        <div
                                            style={{
                                                backgroundColor: "white",
                                                color: entry_o?.comment ? "black" : "white",
                                                padding: "10px",
                                                marginTop: "5px",
                                                marginBottom: "15px",
                                                borderRadius: "3px",
                                            }}
                                        >
                                            {entry_o?.comment || " x"}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                </Tab>
            </Tabs>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Boka coaching</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Boka coaching{" "}
                    {chosenAvailableTime &&
                        new Date(chosenAvailableTime.from).toLocaleDateString(
                            "sv",
                            options,
                        )}{" "}
                    kl.{" "}
                    {chosenAvailableTime &&
                        chosenAvailableTime.from.substring(11, 16) +
                        " - " +
                        chosenAvailableTime.to.substring(11, 16)}
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

            <Modal
                show={showConfirmationModal}
                onHide={() => setShowConfirmationModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Bokningen genomförd</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Du har bokat coaching{" "}
                    {chosenAvailableTime &&
                        new Date(chosenAvailableTime.from).toLocaleDateString(
                            "sv",
                            options,
                        )}{" "}
                    kl.{" "}
                    {chosenAvailableTime &&
                        chosenAvailableTime.from.substring(11, 16) +
                        " - " +
                        chosenAvailableTime.to.substring(11, 16)}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => setShowConfirmationModal(false)}
                    >
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Avboka din bokning</Modal.Title>
                </Modal.Header>
                <Modal.Body>Vill du verkligen avboka din bokning?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        Avbryt
                    </Button>
                    <Button variant="danger" onClick={() => cancelAppointment()}>
                        Avboka
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
