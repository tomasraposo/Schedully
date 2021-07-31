import React, {useEffect, useState, useRef} from "react";
import TimeSlotForm from "./timeSlotForm";
import {useUserTypeContext} from './UserContext';
import TrainerTimeSlotForm from './TrainerTimeSlotForm';
const TimeSlot = (props) => {
	const [id, setID] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [trainer, setTrainer] = useState("");
	const [course, setCourse] = useState("");
    const [trainerId, setTrainerId] = useState("");
    const [courseId, setCourseId] = useState("");
	const [hasOpened, setHasOpened] = useState(false);
	const node = useRef();
	const userType = useUserTypeContext();
	const setHasClosed = () => setHasOpened(false);

	const toggleEventView = (e) => {
		if (node.current.contains(e.target)) 
			setHasOpened(!hasOpened);
	}

	const formatTrainer = (firstName, lastName) => {
		firstName = firstName.charAt(0).toUpperCase()+firstName.slice(1, firstName.length);
		lastName = lastName.charAt(0).toUpperCase()+lastName.slice(1, lastName.length)
		setTrainer(firstName+" "+lastName);
	}
	const formatTime = (time, setTime) => {
		const t = time.split('T')[1].split(":").slice(0, 2).join(":");
		setTime(t);
	}
	
	const formatDate = (time, setDate) => {
		const d = time.split("T")[0];
		setDate(d);
	}

	useEffect(() => {
		const {_id, startTime, endTime, trainer, course} = props;
		formatTime(startTime, setStartTime);
		formatTime(endTime, setEndTime);
		formatDate(startTime, setStartDate);
		formatDate(endTime, setEndDate);
		formatTrainer(trainer.firstName, trainer.lastName);
		setCourse(course.courseName);
		setID(_id);
        setTrainerId(trainer._id);
        setCourseId(course._id);
	},[])

	// prevent double click from closing modal box
	// only backdrop click does it
	useEffect(() => {
		document.addEventListener("mousedown", toggleEventView);
		return () => {
		  document.removeEventListener("mousedown", toggleEventView);
		};
	},[])
	//console.log(id, course, trainer, startDate, endDate, startTime, endTime);
	return (
		  <div ref={node} style={{borderRadius: "10px", padding: "5px", marginBottom: "3px",  backgroundColor: props.colour}}>
			{startTime+" "+trainer+" "+course}
			{
				(userType==="CourseScheduler") ? (
					<TimeSlotForm refreshCal={props.refreshCal} id={id} hasOpen={hasOpened} setHasClosed={setHasClosed}
					courseName={course} trainerName={trainer} sDate={startDate} 
					eDate={endDate} sTime={startTime} eTime={endTime} trainerId={trainerId} courseId={courseId}/>
				):(
				(userType==="Trainer") ? (
					<TrainerTimeSlotForm refreshCal={props.refreshCal} id={id} hasOpen={hasOpened} setHasClosed={setHasClosed}
					courseName={course} trainerName={trainer} sDate={startDate} 
					eDate={endDate} sTime={startTime} eTime={endTime} trainerId={trainerId} courseId={courseId}/>
				):(null))
			}
		  </div>
	)
}

export default TimeSlot;