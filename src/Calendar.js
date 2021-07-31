import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CalendarHeader from "./calendarHeader";
import TimeSlot from "./TimeSlot";

import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import MoreHorizRounded from "@material-ui/icons/MoreHorizRounded";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import ScheduleRounded from '@material-ui/icons/WatchLaterRounded';


const h = window.innerHeight / 6;
const w = window.innerWidth / 7;

const useStyles = makeStyles({
  table: {
  },
});

const formatDate = (date) => {
  let dd = String(date.getDate())
  let mm = String(date.getMonth()+1);
  const yyyy = String(date.getFullYear());
  if (dd.length === 1) 
    dd = "0" + dd;
  if (mm.length === 1) 
    mm = "0" + mm;
  return yyyy+"-"+mm+"-"+dd;
 }
 
 const formatTime = (date) => {
   let hh = String(date.getHours());
   let mm = String(date.getMinutes());
   if (mm.length === 1)
    mm = "0" + mm;
   if (hh.length === 1)
    hh = "0" + hh;
   return hh+":"+mm;
 }

const ExpandableCalendarSlot = ({hasOpened, setHasOpened, colours, days, refreshCal}) => {
  let today = new Date();
  let now = today.getTime();

  let time, weekDay; 
  if (days.length > 0) {
    time = formatTime(new Date())
    weekDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][new Date(days[0].startTime).getDay()-1];    
  }
  
  const isHappening = (timeslot) => {
    const {startTime, endTime} = timeslot;
    const elapsedTime = new Date(endTime).getTime() - new Date(startTime).getTime();
    if (new Date().getTime()>=new Date(startTime).getTime() &&
        new Date().getTime()<=new Date(startTime)+elapsedTime &&
        formatDate(new Date(startTime)) === formatDate(new Date())) {
        return (
        [true,<Alert style={{paddingLeft: "0px", width: "100px"}} icon={<ScheduleRounded style={{color: "#0864fc"}} fontSize="inherit" />} severity="none">
          Now
        </Alert>]
        )
    }
  }

  let a, b;
  return ( 
    <Drawer style={{opacity: "95%", color:"#c4c4c4" }} anchor="right" open={hasOpened} onClose={() => setHasOpened(false)}>
      <Typography variant="h4" style={{marginLeft: "15px", color: "#c4c4c4"}}> Events </Typography>
      <Typography variant="h5" style={{marginLeft: "15px", color: "#c4c4c4"}}> {weekDay} {time} </Typography>
        <List>
          {days && days.map((item, index) => {
            return (
                <ListItem>
                  <div style={{padding: isHappening(item) ? "5px" : "", borderTop: isHappening(item) ? "1px #0864fc dashed" : "", opacity: "90%"}}>
                    {a, b = isHappening(item)}
                    <TimeSlot refreshCal={refreshCal} colour={colours[index] ? colours[index] : "#ffffff"} {...item}/>
                  </div>
                </ListItem>
            )
          })}
        </List>
    </Drawer>
  )
}

const CalendarSlot = ({colours, days, date, blurred, highlight, refreshCal}) => {
  const [hasOpened, setHasOpened] = useState(false);
 
  return (
    <>
      <TableCell align="left" style={
          {
              ...(blurred && { background: "lightgrey"}),
              ...(blurred && { color: "grey"}),
              width: w, 
              height: h, 
              border: highlight ? "2px rgb(8, 100, 252) solid" : "1px #c4c4c4 solid", 
              position: "relative", 
          }
      }>
          <div class="timeSlotDate" style={{"position": "absolute", "top": "16px", "right": "16px"}}>
            {date.getDate()}
          </div>
          <div class="timeSlots">
            {days && (days.map((item, index)=> (
                index < 2 ? <TimeSlot refreshCal={refreshCal} colour={colours[index] ? colours[index] : "#ffffff"} {...item}/> : ""
            )))}
          </div>
          {days && days.length > 2 && 
          <IconButton style={{padding: "0px", position: "absolute"}} onClick={() => setHasOpened(!hasOpened)} edge="end" color="#c4c4c4">
            <MoreHorizRounded/>
          </IconButton>}
          <ExpandableCalendarSlot hasOpened={hasOpened} setHasOpened={setHasOpened} colours={colours} days={days} refreshCal={refreshCal}/>
      </TableCell>

    </>
  )
}


const Calendar = ({userType, userID}) => {
  const today = new Date();
  const [currMonth, setCurrMonth] = useState(new Date().getMonth());
  const [currYear, setCurrYear] = useState(new Date().getFullYear());
  const [currDay, setCurrDay] = useState(new Date().getDate());
  const [timeSlots, setTimeSlots] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [courses, setCourses] = useState([]);
  const [err, setErr] = useState("");

  const classes = useStyles();

  const refresh = () => {
    console.log("REFRESH!!!!");
    setTimeSlots([]);
    getTimeSlots();
  }

  const goToToday = () => {
      setCurrYear(today.getFullYear());
      setCurrMonth(today.getMonth());
  }

  const nextMonth = (e) => {
    if (currMonth + 1 >= 11) {
        setCurrMonth(0);
        setCurrYear(currYear+1);
    } else {
        setCurrMonth(currMonth+1);
    }
  };

  const prevMonth = (e) => {
    if (currMonth - 1 <= -1) {
        setCurrMonth(10);
        setCurrYear(currYear-1);
    } else {
        setCurrMonth(currMonth-1);
    }
  };

  const getTimeSlots = () => {
      console.log("run");
      let url = "http://localhost:8000/api/timeslots";
      if (userType === "Trainer")
        url+=`/byId/${userID}`; 
      fetch(url, {
          method: "post",
          headers: {
            'Content-type' : 'application/json'
          },
          body: JSON.stringify({month: currMonth, year: currYear})
      })
      .then(res => res.json())
      .then(result =>{
          setTimeSlots(result);
          setHasFetched(true);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000/api/courses");
      if (!response) throw Error(response.statusText);
      return await response.json();
    })()
    .then(res => {
      const courses = res.map(({courseName}) => courseName);
      setCourses(courses);
    })
    .catch(err => {
      setErr(err)
      })
  }, [])

  useEffect(() => {
    setTimeSlots([]);
    getTimeSlots();
  }, [currMonth]);

  useEffect(() => {
      getTimeSlots();
  }, []);
  

  useEffect(() => {
  }, [timeSlots, courses]);

  const getCourseColourPairs = () => {
    const colours = ["#fab498","#ffe1e1", "#9fffaa", "#ff9a56", "#fcba56", "#dcedc1", "#95d6fc", "#a0dcc0", "#e3df74", "#bcdca0", "#fc877e", "#7aff9e", "#defa64", "#67f58d", "#a7f26d", "#aaebf2", "#f79b94", "#fadab4", "#fabbb4"];
    courses.sort();
    let dict = courses.reduce((dict, e, i) => (dict[colours[i]] = e, dict), {});
    return dict;
  }

  const renderHeader = () => {
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return (
      <TableRow>
        {weekDays.map(day => <TableCell> {day} </TableCell>)}
      </TableRow>
    );
  }

  const getMonth = () => {
    return ["January", "February", "March", "April", "May", "June", "July", "September", "October", "November", "December"][currMonth];
}

  const getDays = () => {
    let firstDay = new Date(currYear, currMonth);       //Get first day of month
    let lastDay = new Date(currYear, currMonth+1);      //Get first day of next month
    let days = [];
    const courseColours = getCourseColourPairs(); // get all course/colour pairs
    // Fill the array with undefined just to set the array size of days to be the size of the calendar thats displayed
    for (let i = -firstDay.getDay(); i<((lastDay - firstDay)/(1000*60*60*24)); i++) { 
        days.push(
            {date: new Date(firstDay.getTime() + 1000*60*60*24*(i+1)),
            timeSlots: [],
            blurred: i < -1,
            highlight: false
        })
    }
    days.pop(); //remove last because its the first day of next month
    console.log(lastDay.getDay() - 1);
    //fill days with remaining days of the week
    if (lastDay.getDay() - 1 != 0) {
        for (let i = 0; i <= 7 - lastDay.getDay() % 7; i++) {
            days.push({
                date: new Date(lastDay.getTime() +1000*60*60*24*i),
                timeSlots: [],
                blurred: true,
                highlight: false,
            });
        }
    }
    //Add timeslot information to the correct position in the array
    timeSlots.forEach(t => {
        let pointer = new Date(t.startTime).getDate() + firstDay.getDay() - 2;
        days[pointer].timeSlots.push(t);
    });
    //if today date in range.. add highlight
    if (firstDay.getMonth() == today.getMonth() && today.getFullYear() == firstDay.getFullYear()) {
        days[today.getDate() + firstDay.getDay() - 2].highlight = true;
    } 
    //Create CalendarSlot components for each day displayed in Calendar
    for (let i = 0; i < days.length; i++) {
        // console.log(days[i]);
      if (days[i].timeSlots.length !== 0) {
        const courseNames = days[i].timeSlots.map(({course: {courseName}}) => courseName);
        const colours = courseNames.map(name => {
          return Object.keys(courseColours).find(key => courseColours[key] === name);
        });
        days[i] = <CalendarSlot refreshCal={refresh} colours={colours} days={days[i].timeSlots} date={days[i].date} blurred={days[i].blurred} highlight={days[i].highlight}/>
      } else {
        days[i] = <CalendarSlot refreshCal={refresh} colours={undefined} days={days[i].timeSlots} date={days[i].date} blurred={days[i].blurred} highlight={days[i].highlight}/>
      }
    }
    return days;
  }
  
  const renderBody = () => {
    const days = getDays();
    let rows = [], cells = [];
    for (var i=0; i<days.length; i++) {
      if (i % 7 === 0) {
        rows.push(cells)
        cells = [];
      }
      cells.push(days[i])
    }
    rows.push(cells);
    return rows.map((row, i) => <TableRow key={i}> {row} </TableRow>)
  }

   return (
    <>
      <CalendarHeader 
      refreshCal={refresh}
      goToToday={goToToday}
      userType={userType}
      currMonth={getMonth()} 
      currYear={currYear}
      nextMonth={nextMonth}
      prevMonth={prevMonth}
      currDate={formatDate(new Date())}
      currTime={formatTime(new Date())}/>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            {renderHeader()}          
          </TableHead>
          <TableBody>
          {renderBody()}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Calendar;