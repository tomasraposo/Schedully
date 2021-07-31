import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CourseForm from "./courseForm";


const CoursesHeader = ({courses, onUpdate, onInputChange, formatDate, currMonday, nextMonday, currWeek, prevWeek, nextWeek}) => {
  const [hasOpened, setHasOpened] = useState(false);

  const handleCourseForm = () => setHasOpened(!hasOpened);
  return (
	<Box>
	<AppBar style={{backgroundColor:"#f6f6f6", color: "#0864fc"}} position="static">
	  <Toolbar variant="dense">
		  <div style={{display: "flex", width: "50%"}}>
	  	<Button onClick={handleCourseForm} style={{marginRight: "10px"}} color="inherit" disableElevation>
			New Course
		</Button>
		<Autocomplete
			onChange={onUpdate}
			style={{marginLeft: "30px", textAlign: "left", width: 300}}
			options={courses}
			renderInput={(params) => (
				<>
				{onInputChange(params)}
				<TextField {...params} label="Search Course" size="small" margin="normal" variant="outlined"/>
				</>
			)}
			/>
			</div>
			<div style={{width: "50%"}}>
				{[{legend: "Prev Week", handler: prevWeek},
				{legend: formatDate(currMonday)+"\n"+formatDate(nextMonday(currMonday)), handler: currWeek},
				{legend: "Next Week", handler: nextWeek}].map((obj,i) => (
					<Button onClick={obj.handler} style={{ margin: "5px"}} variant={i === 1 ? "outlined" : "contained"} color="inherit" disableElevation>
						<Typography style={{whiteSpace: 'pre-line'}}>
							{obj.legend}
						</Typography>
					</Button>
				))}
			</div>
		<CourseForm hasOpened={hasOpened} setHasClosed={() => setHasOpened(false)}/>
		</Toolbar>
	</AppBar>
  </Box>
  );
}

export default CoursesHeader;