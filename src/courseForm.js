import React, {useEffect, useState, useRef} from "react";
import {TextField, Typography, Grid, IconButton} from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Alert from '@material-ui/lab/Alert';
import {PostAddRounded, SaveRounded, DeleteRounded, BuildRounded} from '@material-ui/icons';
import { Autocomplete } from "@material-ui/lab";
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import ReactDOM from "react-dom";

const useStyles = makeStyles((theme) => ({
	modal:{
		"&:focus":{
		outline: "none"
	   }
	 },
	div: {
	  position: 'absolute',
	  width: "50%",
	  backgroundColor: theme.palette.background.paper,
	  border: '2px solid #f6f6f6',
	  boxShadow: theme.shadows[5],
	  top: "10%",
	  left: "25%",
	  padding: theme.spacing(2, 3, 2),
	},
	root: {
		'& > *': {
		  margin: theme.spacing(1),
		},
	  },
	gridContainer: {
		flexGrow: 1
	},
	icons: {
		color: "#f6f6f6"
	},
	formHeader: {
		// width: "98%",
		display: "flex",
		paddingLeft: "16px",
		backgroundColor:"#f6f6f6",
		 color: "#0864fc"
	}
}));
  
const CourseForm = ({hasOpened, setHasClosed}) => {
    const [courses, setCourses] = useState([]);
	const [skills, setSkills] = useState([]);
	const [deliveryMethod, setDeliveryMethod] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [eventMessage, setEventMessage] = useState({});
	const [err, setErr] = useState("");
	const formRef = useRef();
	const classes = useStyles();

	const handleSubmit = async (e) => {
		e.preventDefault();
		let skillReq = selectedSkills.map(skill => typeof skill !== "object" ? {skillName: skill} : skill);
		console.log({skillRequirements: skillReq, deliveryMethod: deliveryMethod, courseName: selectedCourse});
		(async () => {
			let response = await fetch("http://localhost:8000/db/courses/add", {
			method: 'POST',
			headers: {
				'Content-type' : 'application/json'
			},
		  	body: JSON.stringify({skillRequirements: skillReq, deliveryMethod: deliveryMethod, courseName: selectedCourse})
		})
			if (!response) throw Error(response.statusText);
			return await response
		})()
		.then(res => res.json())
		.then(res => {
			console.log("===> ", res);
			setHasSubmitted(!hasSubmitted);
			setEventMessage(res);
			setHasClosed();
		})
		.catch(err => console.log(err));
	}

	const getCourses = () => {
		(async () => {
			const response = await fetch("http://localhost:8000/api/courses");
			if (!response) throw Error(response.statusText);
			return await response.json();
		})()
		.then(res => setCourses(res))
		.catch(err => setErr(err));
    }

	const getSkills = () => {
		(async () => {
			const response = await fetch("http://localhost:8000/api/skills");
			if (!response) throw Error(response.statusText);
			return await response.json();
		})()
		.then(res => {
			setSkills(res)
		})
		.catch(err => setErr(err));
	}

    // Fetch all courses and skills currently in the system
    useEffect(() => {
        getCourses();
		getSkills();
    }, []);

	useEffect(() => {
		console.log("Courses and skills have been set");
		console.log("Courses: ", courses, "  Skills ", skills)
		// console.log("HJE");
	}, [courses, skills])

	useEffect(() => {
		console.log("Skill Requirements updated: " , selectedSkills);
	}, [selectedSkills])
	
	if (hasSubmitted) { 
		setTimeout(()=> {
			setHasSubmitted(false)
		},6000)
	}
	return ( 
		<>
		{hasSubmitted && <Alert severity={eventMessage.message ? "success" : "error"}> {eventMessage.message ? eventMessage.message : eventMessage.error} </Alert>}
		<Modal className={classes.modal} open={hasOpened} onClose={setHasClosed}>
		<div className={classes.div}>
			<Typography style={{color: "#bfbfbf", textAlign: "center"}}> New Course </Typography>
			<form id="timeSlotForm" ref={formRef} className={classes.root} noValidate autoComplete="off">
				<Grid container className={classes.gridContainer} spacing={2}>
					<Grid item xs={12}>
						<TextField required id="standard-basic" 
							label="Add a course" 
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<PostAddRounded/>
									</InputAdornment>
								)
							}}
							onChange={(e) => {setSelectedCourse(e.target.value)}}
						/>
					</Grid>
					<Grid item xs={12}>
                        <Autocomplete
							freeSolo
							multiple
							id="tags-standard"
                            defaultValue={[skills[0]]}
							onChange={(event, newValue) => {
								if (typeof newValue === "string") {
									setSelectedSkills(newValue);
								} else if (newValue && newValue.inputValue) {
									setSelectedSkills(newValue);
								} else {
                                	setSelectedSkills(newValue);
								}
                            }}
                            options={skills}
							getOptionLabel={(option) => {
								if (typeof option === 'string') {
									return option;
								}
								// on new user input
								if (option.inputValue) {
									return option.inputValue;
								}
								return option.skillName;
							}}
                            disableClearable={false}
                            renderInput={(params) => 
                                <TextField {...params}  required id="standard-basic" 
                                    label="Add skills"
                                />
                            }
                        />
					</Grid>
					<Grid item xs={12}>
						<TextField style={{width: 320}} required 
						 size="small" required id="standard-size-small" 
						 label="Add teaching delivery method"
						 onChange={e => setDeliveryMethod(e.target.value)}/>
					</Grid>
        		</Grid>
				<Button variant="contained"
				 onClick={handleSubmit}
				 style={{backgroundColor:"#0864fc", color: "#f6f6f6",borderRadius: "2px"}}
				 color="primary"
				 className={classes.button}
				 startIcon={<SaveRounded/>}
				 type="sumbit"
				 >
					Save
				</Button>
				<Button variant="contained"
				 onClick={setHasClosed}
	  			 style={{backgroundColor:"#0864fc", color: "#f6f6f6", borderRadius: "2px"}}
				 color="primary"
				 className={classes.button}
				 startIcon={<DeleteRounded/>}>
					Discard
				</Button>
			</form>
		</div>
		</Modal>
		</>
	);
}
export default CourseForm;