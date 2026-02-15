import {
  Accordion,
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import FileUploader from "../inputfields/FileUploader";
import { momentHeaders, moments } from "../../constants/moment";
import { WEEKDAYS } from "../../constants/misc";

export default function AdminPage() {
  
  const [answers, setAnswers] = useState([]);
  const [chosenDate, setChosenDate] = useState("");
  const [educationcards, setEducationcards] = useState([]);
  const [endTime, setEndTime] = useState("");
  const [events, setEvents] = useState([]);
  const [image, setImage] = useState({});
  const [members, setMembers] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [booking, setBooking] = useState({});
  const [question, setQuestion] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [quizString, setQuizString] = useState("");
  const [section, setSection] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [sectionNameToDelete, setSectionNameToDelete] = useState("");
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showDeleteSectionModal, setShowDeleteSectionModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [datesOfWeek, setDatesOfWeek] = useState([]);

  const [schemaTimeSlots, setSchemaTimeSlots] = useState([]);

  const timeoutRef = useRef(null);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if(!hasInitialized.value) {
        (async () => {
            hasInitialized.value = true;
            const today_o = new Date();
            const currentDate_s = today_o.toISOString().split("T")[0];
            setChosenDate(currentDate_s);

            await loadAvailableTimes();
            await loadEducationCards();
            await loadJsonQuiz();
            await loadMembers();
            await loadQuiz();
            await loadSchedule(currentDate_s);
        })();
    }
    
  });

  async function addSchedule() {
    const body_o = {
      date: chosenDate,
      timespan: startTime + "-" + endTime,
    };

    if (!isValidTimeInterval(body_o.timespan)) {
      alert("Starttiden måste komma före sluttiden så det lades inte till");
      return;
    }

    if (isOverlap(schedule, body_o.timespan)) {
      alert("Tidsintervallet överlappar med schemat så det lades inte till");
      return;
    }

    const response_o = await fetch("https://korkort24.com/api/schedules/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body_o),
    });

    await response_o.json();

    await loadSchedule(chosenDate);
  }

  async function addSection() {
    if (!section) return;

    const newSection_o = {
      id: generateUUID(),
      name: section,
      questions: [],
    };

    const updatedQuiz_a = [...quiz, newSection_o];

    await saveQuiz(updatedQuiz_a);

    setQuiz(updatedQuiz_a);
  }

  async function changeState(
    entry_o,
    memberId,
    momentId,
    state,
    obj,
    comment,
    submoment,
    isChecked
  ) {
    if (entry_o) {
      const member = educationcards.find(
        (educationcard) => educationcard.member_id == memberId
      );

      const moment_o = member.educationcard.find((moment) => {
        return moment.moment === momentId;
      });

      if (submoment) {
        if (isChecked) {
          moment_o.submoment = moment_o.submoment.replace(submoment, "");
        } else {
          moment_o.submoment = moment_o.submoment + submoment;
        }
      } else {
        if (obj && obj.target.className.includes("bg-primary")) {
          moment_o.state = moment_o.state.replace(state, "");
        } else {
          moment_o.state = moment_o.state + (state || "");
          if (state === "👍") {
            moment_o.state = moment_o.state.replace("👎", "");
          }
          if (state === "👎") {
            moment_o.state = moment_o.state.replace("👍", "");
          }
        }
      }

      if (comment) {
        moment_o.comment = comment;
      }

      setEducationcards([...educationcards]);

      await fetch("https://korkort24.com/api/educationcards/" + entry_o.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: entry_o.state,
          comment: entry_o.comment,
          submoment: entry_o.submoment,
        }),
      });
    } else {
      const response_o = await fetch(
        "https://korkort24.com/api/educationcards/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            member_id: memberId,
            moment: momentId,
            state: state || "",
            comment: comment || "",
          }),
        }
      );

      const responseBody_o = await response_o.json();

      let memberCard_o = educationcards.find(
        (card) => card.member_id === memberId
      );

      if (!memberCard_o) {
        memberCard_o = {
          member_id: memberId,
          educationcard: [],
        };
        educationcards.push(memberCard_o);
      }

      memberCard_o.educationcard.push({
        id: parseInt(responseBody_o.data.id),
        moment: momentId,
        state: state,
      });

      setEducationcards([...educationcards]);
    }
  }

  async function deleteQuestion(questionId_s) {
    for (const category_o of quiz) {
      category_o.questions = category_o.questions.filter(
        (question_o) => question_o.id !== questionId_s
      );
    }

    setQuiz([...quiz]);

    await saveQuiz(quiz);
  }

  async function deleteSection(sectionName_s) {
    const updatedQuiz_a = quiz.filter(
      (section) => section.name !== sectionName_s
    );

    await saveQuiz(updatedQuiz_a);

    setQuiz(updatedQuiz_a);

    setShowDeleteSectionModal(false);
  }

  function generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  async function handleClickDay(date) {
    let chosenDate_s = date;

    if (typeof date === "object") {
      let chosenDate_o = new Date(date);

      chosenDate_o.setDate(chosenDate_o.getDate() + 1); //.toISOString().substring(0, 10);

      chosenDate_s = chosenDate_o.toISOString().substring(0, 10);
    }

    setChosenDate(chosenDate_s);

    const schedule_a = await loadSchedule(chosenDate_s);

    const availableTimeSlots_o = {};

    const ids = schedule_a.map((schedule_o) => schedule_o.id);

    for (let i = 0; i < schedule_a.length; ++i) {
      const schedule_o = schedule_a.find((s) => s.id === ids[i]);

      const appointments_a = await loadAppointments({
        schedule_id: schedule_o.id,
      });

      const availableTimeSlots_a = getAvailableSlots(
        schedule_o,
        appointments_a,
        60
      );

      availableTimeSlots_o[schedule_o["date"]] = availableTimeSlots_a;

      availableTimeSlots_o[schedule_o["date"] + "_id"] = schedule_o.id;
    }

    setSchemaTimeSlots(availableTimeSlots_o);
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

      let booking_o;

      const hasOverlap = bookings.some((booking) => {
        const bookingStart = new Date(booking.start);

        const bookingEnd = new Date(booking.end);

        if (slotStart < bookingEnd && slotEnd > bookingStart) {
          booking_o = booking;
        }

        return slotStart < bookingEnd && slotEnd > bookingStart;
        //return slotStart < bookingEnd && slotEnd > bookingStart;
      });

      const timeSlot_o = {
        time: slotStart.toTimeString().slice(0, 5),
      };

      if (hasOverlap) {
        timeSlot_o.booking = booking_o;
      }

      //availableSlots.push(slotStart.toTimeString().slice(0, 5)); // Format "HH:MM"
      availableSlots.push(timeSlot_o); // Format "HH:MM"
    }

    return availableSlots;
  }

  async function loadAppointments(params_o) {
    const queryParams_s = new URLSearchParams(params_o).toString();

    const response_o = await fetch(
      "https://korkort24.com/api/bookings/?" + queryParams_s
    );

    if (response_o.status === 200) {
      const responseBody_o = await response_o.json();

      const appointments_a = responseBody_o.data;

      return appointments_a;
    }

    return [];
  }

  function isOverlap(currentIntervals, newInterval) {
    // let existingIntervals = currentIntervals.map(
    //     (interval) => interval.timespan
    // );

    // Helper function to convert 'hh:mm' to minutes since midnight
    const toMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    // Parse new interval
    const [newStartStr, newEndStr] = newInterval.split("-");
    const newStart = toMinutes(newStartStr);
    const newEnd = toMinutes(newEndStr);

    // Check for overlap with existing intervals
    for (const interval of currentIntervals) {
      if (interval.date === chosenDate) {
        const [startStr, endStr] = interval.timespan.split("-");
        const start = toMinutes(startStr);
        const end = toMinutes(endStr);

        // Overlap if newStart < end and newEnd > start
        if (newStart < end && newEnd > start) {
          return true; // Overlapping
        }
      }
    }

    return false; // No overlap
  }

  function isValidTimeInterval(interval) {
    const [start, end] = interval.split("-");
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    // Convert times to minutes since midnight
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return startTotalMinutes < endTotalMinutes;
  }

  async function loadAvailableTimes() {
    const response_o = await fetch("https://korkort24.com/api/times/");

    let availTimes = await response_o.json();

    availTimes.sort((a, b) => {
      if (a.from < b.from) return -1;
      if (a.from > b.from) return 1;
      return 0;
    });

    return availTimes;
  }

  async function loadEducationCards() {
    const response_o = await fetch("https://korkort24.com/api/educationcards/");
    const responseBody_o = await response_o.json();

    const result = Object.values(
      responseBody_o.data.reduce(
        (acc, { id, member_id, moment, state, comment, submoment }) => {
          if (!acc[member_id]) {
            acc[member_id] = { member_id, educationcard: [] };
          }
          acc[member_id].educationcard.push({
            id,
            moment,
            state,
            comment,
            submoment,
          });
          return acc;
        },
        {}
      )
    ).map((group) => {
      group.educationcard.sort((a, b) => a.moment - b.moment);
      return group;
    });

    setEducationcards(result);
  }

  async function loadMembers() {
    const response_o = await fetch(
      "https://korkort24.com/api/members/?fields=firstname,lastname"
    );
    const responseBody_o = await response_o.json();
    setMembers(responseBody_o.data);
  }

  async function loadJsonQuiz() {
    const response_o = await fetch(
      "https:///korkort24.com/api/quiz/downloadquiz.php"
    );
    const quiz_o = await response_o.json();
    const quiz_s = JSON.stringify(quiz_o, null, 2);
    setQuizString(quiz_s);
  }

  async function loadQuiz() {
    const response_o = await fetch("https://korkort24.com/api/quiz/");

    if (response_o.status === 200) {
      const responseBody_o = await response_o.json();
      const quiz_o = responseBody_o.data;
      setQuiz(quiz_o);
    }
  }

  async function loadSchedule(date_s) {
    const dates_a = getDatesOfWeek(date_s);

    setDatesOfWeek(getDatesOfWeek(date_s));

    const response_o = await fetch(
      "https://korkort24.com/api/schedules/?fromDate=" +
        dates_a[0] +
        "&toDate=" +
        dates_a[6]
    );

    if (response_o.status === 200) {
      const responseBody_o = await response_o.json();

      const schedule_a = responseBody_o.data;

      setSchedule(schedule_a);

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

  async function saveNewQuestion(e) {
    e.preventDefault();

    const answerRadios = document.getElementsByName("answer");

    const section_o = quiz.find(
      (quiz_o) => quiz_o.name === showAddQuestionModal
    );

    const questionId_s = generateUUID();

    let fileName_s = "";

    if (image.size) {
      fileName_s = await uploadFile(questionId_s);
    }

    const newQuestion_o = {
      id: questionId_s,
      name: question,
      answers: [],
      explanation: "",
      image: fileName_s,
    };

    for (const [index, answer] of answers.entries()) {
      const answer_o = {
        id: generateUUID(),
        isCorrect: answerRadios[index].checked,
        name: answer,
      };

      newQuestion_o.answers.push(answer_o);
    }

    section_o.questions.push(newQuestion_o);

    await saveQuiz(quiz);

    setShowAddQuestionModal(false);
  }

  async function saveQuiz(quiz_o) {
    await fetch("https://korkort24.com/api/quiz/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quiz_o),
    });
  }

  async function saveQuizString() {
    const quizStringElement = document.getElementById("quiz-string");
    const quizStringObject = JSON.parse(quizStringElement.value);

    await fetch("https://korkort24.com/api/quiz/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizStringObject),
    });
  }

  function updateComment(comment_o) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      changeState(
        comment_o.entry,
        comment_o.memberId,
        comment_o.momentId,
        null,
        null,
        comment_o.comment
      );
    }, 2000);
  }

  async function uploadFile(questionId_s) {
    const formData_o = new FormData();

    formData_o.append("image", image);

    const imageType_s = image.name.split(".")[1];

    const fileName_s = questionId_s + "." + imageType_s;

    formData_o.append("fileName", fileName_s);

    await fetch("https://korkort24.com/api/uploads/", {
      method: "POST",
      body: formData_o,
    });

    return fileName_s;
  }

  /**
   * Validates and saves the current end time. Only numbers are allowed. A colon is added automatically.
   *
   * @param {*} endTime_s
   */
  function validateEndTime(inputField_o) {
    let endTime_s = inputField_o.value;

    endTime_s = endTime_s.replace(/[^0-9]/g, "");

    if (endTime_s.length > 2) {
      endTime_s = endTime_s.substring(0, 2) + ":" + endTime_s.substring(2, 4);
    }

    setEndTime(endTime_s);
  }

  /**
   * Validates and saves the current start time. Only numbers are allowed. A colon is added automatically.
   * @param {string} startTime_s
   */
  function validateStartTime(startTime_s) {
    startTime_s = startTime_s.replace(/[^0-9]/g, "");

    if (startTime_s.length > 2) {
      startTime_s =
        startTime_s.substring(0, 2) + ":" + startTime_s.substring(2, 4);
    }

    setStartTime(startTime_s);
  }

  return (
    <div className="pb-5">
      <h1 className="page-header">Admin Page</h1>

      <Tabs defaultActiveKey="questions" id="admin-tabs" className="mb-3">
        <Tab eventKey="questions" title="Frågor">
          <div className="p-2 mt-3" style={{overflowX: 'hidden', overflowY: 'scroll', maxHeight: '80vh'}}>
          <Row className="align-items-center">
            <Col xs="auto">
              <Form.Control
                id="new-category"
                className="mb-2"
                onChange={(e) => setSection(e.target.value)}
                placeholder="Ny kategori"
                size="sm"
                spellCheck="false"
                type="text"
              />
            </Col>

            <Col xs="auto">
              <Button
                size="sm"
                type="button"
                variant="success"
                className="mb-2"
                onClick={addSection}
              >
                +
              </Button>
            </Col>
          </Row>

          <div className="bg-body p-2">
            {quiz.map((section) => (
              <div style={{ fontSize: "20px" }} key={section.name}>
                <span
                  className="section-name"
                  role="button"
                  onClick={() => {
                    setShowQuestionsModal(section.name);
                  }}
                >
                  {section.name}
                </span>{" "}
                <i
                  onClick={() => {
                    setSectionNameToDelete(section.name);
                    setShowDeleteSectionModal(true);
                  }}
                  role="button"
                  className="mx-2 bi bi-trash"
                ></i>
                <i
                  onClick={() => {
                    setShowAddQuestionModal(section.name);
                    setAnswers([""]);
                    setQuestion("");
                  }}
                  role="button"
                  className="bi bi-plus-square-fill text-success"
                ></i>
              </div>
            ))}
          </div>

          <Form.Group
            className="mb-3 mt-3"
            id="exampleForm.ControlTextarea1"
          >
            <Form.Control
              onChange={(e) => setQuizString(e.target.value)}
              id="quiz-string"
              as="textarea"
              rows={10}
              value={quizString}
              style={{ fontFamily: "monospace", whiteSpace: "pre" }}
            />
          </Form.Group>

          <Button
            size="sm"
            type="button"
            variant="success"
            className="mb-2"
            onClick={saveQuizString}
          >
            Spara
          </Button>

          <h4 className="text-white">Ladda upp bild</h4>
          <FileUploader />
          </div>
        </Tab>

        <Tab eventKey="info" title="Info"></Tab>

        <Tab eventKey="bookings" title="Bokningar">
          <div className="p-2 mt-3 text-white" style={{overflowX: 'hidden', overflowY: 'scroll', maxHeight: '80vh'}}>
          <Row>
            <Col>
              <Form.Control
                id="start-time"
                onChange={(e) => validateStartTime(e.target.value)}
                placeholder="Start (hh:mm)"
                size="sm"
                spellCheck="false"
                type="text"
                value={startTime}
              />
            </Col>
            <Col>
              <Form.Control
                id="end-time"
                onChange={(e) => validateEndTime(e.target)}
                placeholder="Slut (hh:mm)"
                size="sm"
                spellCheck="false"
                type="text"
                value={endTime}
              />
            </Col>
            <Col>
              <Button onClick={addSchedule} size="sm" variant="primary">
                Skapa
              </Button>
            </Col>
          </Row>

          <Calendar
            style={{ float: "left" }}
            onClickDay={handleClickDay}
            // tileClassName={({ date, view }) =>
            //     view === 'month' && isEventDate(date) ? 'highlight' : null
            // }
          />

          <table style={{ border: "1px solid", color: "white", marginBottom: "40px" }}>
            <thead>
              <tr>
                {/* Genom att lägga till > 0 säkerställer vi att resultatet blir true/false, inte en siffra */}
                {datesOfWeek &&
                  datesOfWeek.length > 0 &&
                  datesOfWeek.map((date_s, index_i) => (
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
                  ))}
              </tr>
              <tr>
                {datesOfWeek &&
                  datesOfWeek.length > 0 &&
                  datesOfWeek.map((date_s) => (
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
                  ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                {datesOfWeek &&
                  datesOfWeek.length > 0 &&
                  datesOfWeek.map((date_s) => (
                    <td key={date_s} style={{ verticalAlign: "top" }}>
                      {
                        schemaTimeSlots[date_s]
                          ? schemaTimeSlots[date_s].map((timeSlot_o, index) => (
                              <span
                                key={index}
                                onClick={() => {
                                  if (timeSlot_o.booking) {
                                    setBooking(timeSlot_o.booking);
                                    setShowBookingModal(true);
                                  }
                                }}
                                className="schedule-date"
                                style={{
                                  float: "left",
                                  cursor: "pointer",
                                  marginBottom: "5px",
                                  color: "black",
                                  backgroundColor: timeSlot_o.booking
                                    ? "yellow"
                                    : "white",
                                  padding: "3px",
                                  border: "2px solid black",
                                  borderRadius: "5px",
                                }}
                              >
                                {timeSlot_o.time}
                                <br />
                              </span>
                            ))
                          : null /* Använd null istället för tom sträng '' i tabeller */
                      }
                    </td>
                  ))}
              </tr>
            </tbody>
          </table>
          </div>
        </Tab>

        <Tab eventKey="education-cards" title="Utbildningskort">
          <div className="p-2 mt-3 text-white" style={{overflowY: 'scroll', maxHeight: '80vh'}}>
          <Accordion defaultActiveKey="0">
            {members.map((member_o) => {
              let card_o = educationcards.find(
                (card_o) => card_o.member_id === member_o.id
              );
              card_o = card_o
                ? card_o
                : { educationcard: [], member_id: member_o.id };
              return (
                <Accordion.Item key={member_o.id} eventKey={member_o.id}>
                  <Accordion.Header>
                    Medlem: {member_o.id} {member_o.firstname}{" "}
                    {member_o.lastname}
                  </Accordion.Header>
                  <Accordion.Body>
                    <div key={member_o.id} className="mb-3 p-2 bg-body">
                      <h5>
                        Medlem: {member_o.id} {member_o.firstname}{" "}
                        {member_o.lastname}
                      </h5>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                        (moment, index) => {
                          const entry_o = card_o.educationcard.find(
                            (e) => e.moment === moment
                          );

                          return (
                            <div
                              key={
                                moment + "moment" + member_o.id + "-" + index
                              }
                            >
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
                              <div
                                style={{
                                  paddingLeft: "50px",
                                  marginBottom: "10px",
                                }}
                              >
                                {moments[moment] &&
                                  moments[moment].map((moment_a, index) => {
                                    let checked = entry_o?.submoment?.includes(
                                      moment_a.charAt(0)
                                    );

                                    return (
                                      <p
                                        key={
                                          moment +
                                          "submoment" +
                                          member_o.id +
                                          "-" +
                                          index
                                        }
                                        style={{ marginBottom: "0" }}
                                      >
                                        {moment_a}{" "}
                                        <input
                                          onChange={(e) =>
                                            changeState(
                                              entry_o,
                                              card_o.member_id,
                                              moment,
                                              null,
                                              e,
                                              null,
                                              moment_a.charAt(0),
                                              checked
                                            )
                                          }
                                          id={
                                          moment +
                                          "submoment" +
                                          member_o.id +
                                          "-" +
                                          index
                                        }
                                          type="checkbox"
                                          checked={checked}
                                        />
                                      </p>
                                    );
                                  })}
                              </div>
                              {["D", "I", "S", "G", "👍", "👎"].map((state) => {
                                const isFilled =
                                  entry_o?.state?.includes(state); // ✅ check if letter exists
                                return (
                                  <span
                                    key={state}
                                    className={`moment-styles me-1 d-inline-flex align-items-center justify-content-center rounded 
                     ${isFilled ? "bg-primary text-white" : ""}`}
                                    onClick={(e) =>
                                      changeState(
                                        entry_o,
                                        card_o.member_id,
                                        moment,
                                        state,
                                        e
                                      )
                                    }
                                  >
                                    {state}
                                  </span>
                                );
                              })}
                              <textarea
                              id={moment + "moment" + member_o.id + "-" + index}
                                placeholder="Kommentar"
                                onChange={(e) =>
                                  updateComment({
                                    comment: e.target.value,
                                    entry: entry_o,
                                    momentId: moment,
                                    memberId: member_o.id,
                                  })
                                }
                                style={{
                                  marginTop: "5px",
                                  marginBottom: "15px",
                                  borderRadius: "5px",
                                  display: "block",
                                  width: "100%",
                                }}
                                value={entry_o?.comment || ""}
                              ></textarea>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
          </div>
        </Tab>
      </Tabs>

      <Modal
        show={showDeleteSectionModal}
        onHide={() => setShowDeleteSectionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Vill du ta bort den här sektionen?</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>Ta bort sektionen {sectionNameToDelete}</Modal.Body> */}
        <Modal.Footer>
          <Button
            onClick={() => deleteSection(sectionNameToDelete)}
            size="sm"
            variant="primary"
          >
            Ta bort sektionen `&apos;`{sectionNameToDelete}`&apos;`
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddQuestionModal}
        onHide={() => {
          setShowAddQuestionModal(false);
          setQuestion("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ny fråga - {showAddQuestionModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={saveNewQuestion}>
            <Form.Control
              id="question"
              required
              className="mb-2"
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Fråga"
              size="sm"
              spellCheck="false"
              type="text"
              value={question}
            />

            <Form.Control
              id="image-file"
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              size="sm"
              className="mb-2"
            />

            {answers.map((answer, i) => (
              <InputGroup key={i} className="mb-3" size="sm">
                <InputGroup.Radio name="answer" required />
                <Form.Control
                  name="answer"
                  onChange={(e) => {
                    answers[i] = e.target.value;
                    setAnswers([...answers]);
                  }}
                  placeholder="Svar"
                  required
                  spellCheck="false"
                  type="text"
                  value={answers[i]}
                />
                {answers.length === i + 1 && (
                  <Button
                    type="button"
                    variant="success"
                    onClick={() => setAnswers([...answers, ""])}
                  >
                    +
                  </Button>
                )}
              </InputGroup>
            ))}

            <Button
              size="sm"
              type="submit"
              variant="success"
              onClick={() => console.log("lägg till ny fråga")}
            >
              Lägg till
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showQuestionsModal}
        onHide={() => setShowQuestionsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{showQuestionsModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {quiz
            .find((category_o) => category_o.name === showQuestionsModal)
            ?.questions.map((question_o) => (
              <div key={question_o.id} className="mb-1">
                <h6 className="question">
                  {question_o.name}
                  <i
                    onClick={() => deleteQuestion(question_o.id)}
                    role="button"
                    className="mx-2 bi bi-trash"
                  ></i>
                </h6>
              </div>
            ))}
        </Modal.Body>
      </Modal>

      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Bokning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Medlems ID: {booking.member_id}</p>
          {/* <p>Medlem: {(members.find(member => member.id === booking.member_id)).firstname} {(members.find(member => member.id === booking.member_id)).lastname}</p> */}
          <p>Start: {booking.start}</p>
          <p>Slut: {booking.end}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
