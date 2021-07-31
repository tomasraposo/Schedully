import React, {useState, useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CoursesHeader from "./coursesHeader";
import CourseDetails from "./courseDetails";

//
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const trainerView = (firstName, lastName) => {
	return ( 
		<div style={{
			backgroundColor:"#f6f6f6",
			color: "#0864fc",
			borderRadius: "20px",
			padding: "10px",
			margin: "5px",
			textAlign: "center"}}>
			{firstName+" "+lastName}
		</div>
	);
}

const CourseTimeSlotView = ({timeSlots, currDate}) => {
	const timeslots = JSON.parse(timeSlots);
	
	const getTimeSlots = (currDate) => {
		let slots = timeslots.map(slot => {
			const currMonday = currDate;
			const nextMonday = getNextMonday(currMonday);
			const slotStartDay = new Date(slot.startTime).getDate()
			const slotMonth = new Date(slot.startTime).getMonth();

			if (nextMonday.getMonth() === slotMonth+1 &&
			    slotStartDay >= currMonday.getDate() &&
				slotMonth === currMonday.getMonth()) {
					return slot;
			}
			if (currMonday.getMonth() === slotMonth-1 &&
				slotStartDay <= nextMonday.getDate() &&
				slotMonth === nextMonday.getMonth()) {
					return slot;
				}
			if (slotStartDay >= currMonday.getDate() && 
			    slotStartDay < nextMonday.getDate() &&
				slotMonth === nextMonday.getMonth()) {
					return slot;					
				}
			})
		return slots;
	}

	const renderHeader = () => {
		const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		return (
		  <TableRow>
			{weekDays.map(day => <TableCell style={{"text-align": "center"}}> {day} </TableCell>)}
		  </TableRow>
		);
	}
	const renderBody = () => {
		let slots = getTimeSlots(currDate);
		slots = slots.filter(slot => slot != undefined || slot != null);
		const days = slots.map(slot => new Date(slot.startTime).getDay());
		let cells = [];
		for (var i=1; i<=7; i++) {
			const matches = slots.filter(slot => new Date(slot.startTime).getDay() === i % 7);
			if (matches.length > 0) {
				cells.push(<TableCell style={{"text-align": "center"}}> 
					{matches.map(match => {
						const {startTime, trainer: {firstName, lastName}} = match;
						return trainerView(firstName, lastName)
					})} 
					</TableCell>);				
			} else cells.push(<TableCell/>);
		}
		return (
			<TableRow>
				{cells}
			</TableRow>
		)
	}
	return (
		<TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            {renderHeader()}          
          </TableHead>
          <TableBody>
          {renderBody()}
          </TableBody>
        </Table>
      </TableContainer>
	)
}

const formatDate = (date) => {
	console.log(date);
    let dd = String(date.getDate())
    let mm = String(date.getMonth()+1);
    const yyyy = String(date.getFullYear());
    if (dd.length === 1) 
		dd = "0" + dd;
    if (mm.length === 1) 
		mm = "0" + mm;
    return yyyy+"-"+mm+"-"+dd;
   }

const getNextMonday = (currDate) => {
	let next = new Date(currDate);
	const day = (next.getDate() + (next.getDay() + 6) % 7)+7
	next.setDate(day);
	next.setHours(0,0,0);
	return next;
}
   
const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	divider: {
		color: "#c4c4c4",
		margin: "auto",
	},
	courses: {
		display: "flex", 
		flexDirection: "row",
	}
}));


const Courses = () => {	
	const classes = useStyles();
	const [courses, setCourses] = useState([]);
	const [filteredCourses, setFilteredCourses] = useState([])
	const [err, setErr] = useState("");
	const [searchInput, setSearchInput] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [hasClicked, setHasClicked] = useState(false);
	const [courseOnClick, setCourseOnClick] = useState("");
	
	const [currWeek, setCurrWeek] = useState(() => {
		const currDate = new Date();
		const weekStart = currDate.getDate() - currDate.getDay() + (currDate.getDay() === 0 ? -6 : 1);  
		return new Date(currDate.setDate(weekStart));	
	});

	const prevWeek = () => {
		let prevMonday = new Date(currWeek);
		const day = (prevMonday.getDate() - (prevMonday.getDay() + 6) % 7)-7
		prevMonday.setDate(day);
		prevMonday.setHours(0,0,0);
		setCurrWeek(prevMonday);
	}
	const getCurrWeek = () => {
		const currDate = new Date();
		const weekStart = currDate.getDate() - currDate.getDay() + (currDate.getDay() === 0 ? -6 : 1);
	    setCurrWeek(new Date(currDate.setDate(weekStart)));
	}

	const nextWeek = () => {
		let nextMonday = new Date(currWeek);
		const day = (nextMonday.getDate() + (nextMonday.getDay() + 6) % 7)+7
		nextMonday.setDate(day);
		nextMonday.setHours(0,0,0);
		setCurrWeek(nextMonday);
	}

	useEffect(() => {
		(async () => {
			const response = await fetch("http://localhost:8000/api/courses/populate");
			if (!response) throw Error(response.statusText);
			return await response.json();
		})()
		.then(res => {
			console.log("===> ", res);
			setCourses(res);
		})
		.catch(err => {
			setErr(err)
		  })
	}, [])
	
	const getCourseNames = () => {
		return courses.map(course => course.courseName);
	}

	useEffect(() => {
		showFilteredCourses();
	  },[searchInput,searchTerm,courses])
	
	const showFilteredCourses = () => {
		if(searchInput || searchTerm){
			let regex = new RegExp(searchTerm, 'g');
			let res = courses.filter(({courseName}) => courseName.match(regex))
			setFilteredCourses(res);
		} else 
			setFilteredCourses(courses)
	}
	const colourPicker = (i) => {
		return ["#fab498","#ffe1e1", "#9fffaa", "#ff9a56", "#fcba56", "#dcedc1", "#95d6fc", "#a0dcc0", "#e3df74", "#bcdca0", "#fc877e", "#7aff9e", "#defa64", "#67f58d", "#a7f26d", "#aaebf2", "#f79b94", "#fadab4", "#fabbb4"][i]
	}

	const calcCourseWrapperWidth = (courseName) => {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		context.font = window.getComputedStyle(document.body).font;
		return Math.round(context.measureText(courseName).width)+100;
	}

	const toggleCourseView = (e) => {
		if (e) {
			const clickedOn = e.target.childNodes[0].textContent;
			setCourseOnClick(clickedOn);
			setHasClicked(!hasClicked);
		}
	}

	let course;
	return (  
		<div className={classes.root}>
		<CoursesHeader courses={getCourseNames()} 
		 onUpdate={(event, newValue) => {
			setSearchInput(newValue)
	  	 }} 
		 onInputChange={(params) => {
			if (params) {
				setSearchTerm(params.inputProps.value);
			}
		 }} 
		 formatDate={formatDate}
		 currMonday={currWeek} 
		 nextMonday={getNextMonday}
		 prevWeek={prevWeek}
		 nextWeek={nextWeek}
		 currWeek={getCurrWeek}/>
			<List>
			{filteredCourses.map((course, i)=> (
				<div className={classes.course}>
					<Divider variant="middle" className={classes.divider}/>
					<ListItem onClick={(e) => toggleCourseView(e)} alignItems="flex-start">
					<div style={{width: "30%"}}>
						<div style={{width: calcCourseWrapperWidth(course.courseName)}}>
							<ListItemText
								style={{
									borderRadius: "20px",
									padding: "10px",
									backgroundColor: colourPicker(i)
								}} 
								primary={course.courseName}
							/>
						</div>
					</div>
					<div style={{width: "70%"}}>
						<CourseTimeSlotView currDate={currWeek} timeSlots={JSON.stringify(course.timeSlots)}/>
					</div>
					</ListItem>
					<div>
						{course = courses.filter(c => c.courseName === course.courseName),
						hasClicked && courseOnClick === course[0].courseName && 
						<CourseDetails 
						 deliveryMethod={course[0].deliveryMethod}
						 skillRequirements={course[0].skillRequirements.map(skill => skill.skillName)}/>
						}
					</div>
				</div>
			))}
			<Divider variant="middle" className={classes.divider}/>   
		</List>   
	</div>
	);
}

export default Courses;