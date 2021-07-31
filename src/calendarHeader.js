import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {TodayRounded} from '@material-ui/icons';
import {ArrowUpwardRounded, ArrowDownwardRounded} from '@material-ui/icons';
import TimeSlotForm from "./timeSlotForm";
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';

const CalendarHeader = ({userType, currMonth, currYear, nextMonth, prevMonth, currDate, currTime, goToToday, refreshCal}) => {
  const [hasOpened, setHasOpened] = useState(false);
  const handleTimeSlotForm = () => setHasOpened(!hasOpened);
  
  return (
	<Box sx={{flexGrow: 1}}>
	<AppBar style={{backgroundColor:"#f6f6f6", color: "#0864fc"}} position="static">
	  <Toolbar variant="dense">
		{userType === "CourseScheduler" &&
		<Button onClick={handleTimeSlotForm} variant="contained" color="inherit" disableElevation>
			New timeslot
		</Button>}
		<TimeSlotForm refreshCal={refreshCal} hasOpen={hasOpened} setHasClosed={() => setHasOpened(false)}
	     sDate={currDate} eDate={currDate} sTime={currTime} eTime={currTime}/>
        <IconButton onClick={() => goToToday()} style={{marginLeft: userType === "CourseScheduler" ? "20px" : ""}} edge="start" color="inherit" aria-label="today" sx={{ mr: 2 }}>
            <TodayRounded />
        </IconButton>
        <Typography onClick={() => goToToday()} variant="h6" color="inherit" component="div" style={{cursor: "pointer"}}>
            Today
        </Typography>
		<div style={{marginLeft: "20px"}}>
		{[<ArrowUpwardRounded onClick={nextMonth}/>, <ArrowDownwardRounded onClick={prevMonth}/>].map(icon => ( 
			<IconButton edge="end" color="inherit">
				{icon}
			</IconButton>
		))}
		</div>
		<div style={{marginLeft: "20px"}}>
		<Typography variant="h6" color="black" component="div">
		  {currMonth} {currYear}
		</Typography>
		</div>
	  </Toolbar>
	</AppBar>
  </Box>
  );
}

export default CalendarHeader;