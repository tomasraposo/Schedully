import React,{useState,useEffect} from "react";
import './teamStyle.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { Container } from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

//majority of imports are for material UI components

//importing timeslot for table
import TimeSlot from './TimeSlot';
//helper functions
// can add days to the date
const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
//returns a string as title case (first letter capital)
const toTitleCase = (txt) => {
  return (txt) ? (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()):(null);
}
//returns the trainers first name, second name and last name in the format 'FirstName SecondName #Username'
const getFullName = (trainer) => {
  return (toTitleCase(trainer.firstName)+" "+toTitleCase(trainer.lastName) +" #" +trainer.username);
}
//some styles used in the page
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  table: {
    minWidth: 650,
  },
}));
//time functions
//get the current week (starting monday)
  
//Main Team page component
const Team = () => {
	//the master list of trainers that will be fetched from the api
  const [trainerList, setTrainerList] = useState([]);
  //the current users search input
	const [searchInput, setSearchInput] = useState(null);
  //the list of trainers that is displayed on the users screen after searchinput is changed
  const [filteredSearch, setFilteredSearch] = useState([])
  //the date of the start of the week, what schedule is shown is dependent on this
  const [weekViewStart, setweekViewStart] = useState(null);
  //async function to toggle trainers verification status
  const toggleTrainerVerified = async (id,currentlyVerfied) => {
    const newVerified = !currentlyVerfied;
    const url= "http://localhost:8000/api/trainer/setIsVerified";
    const response = await fetch (url,{
      method:'PUT',
      headers: {
          'Content-type' : 'application/json'
      },
      body: JSON.stringify({
          id:id,isVerified:newVerified
        })
      })
    console.log(response)  
    if(response.ok){
      console.log("getting trainers again");
      getTrainers();
    }
  }
  //async function that fetches trainers from the api
  const getTrainers = async () => {
    const response = await fetch('http://localhost:8000/api/trainers/populate');
    const data = await response.json();
    //setting the master list of trainers with the fetched data
    setTrainerList(data);
  }
  //use effect that runs once on component load, fetches the trainers and sets the starting week to the current week
  useEffect(() => {
    getTrainers();
    setweekViewStart(getWeekStart);
  },[])
  //use effect thtat runs every time the search input changes or the trainer list changes, applies the search filter which alters the filtered search state
  useEffect(() => {
    searchFilter(trainerList);
  },[searchInput,trainerList])

  //event handler for when a user searches and selects a trainer from the dropdown menu
  const updateSearch = (events, values) => {
    setSearchInput(values);
  }
  //when triggered by a change, uses the users username to match trainers and only display them
  const searchFilter = (trainers) => {
    if(searchInput){
      setFilteredSearch(trainers.filter(trainer => trainer.username===searchInput.username))
    }else{
      setFilteredSearch(trainers)
    }
    console.log(filteredSearch);
  }
  //function that gets the current dates week start (week starting sunday)
  const getWeekStart = () => {
    var curr = new Date;
    var newDate = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  }
  //incremements the date by a week
  const incrementWeek = () =>{
    setweekViewStart(addDays(weekViewStart,7));
  }
  //deincrements the date by a week
  const deincrementWeek = () => {
    setweekViewStart(addDays(weekViewStart,-7));
  }
  //resets the week to the current week
  const setCurrentWeek = () => {
    setweekViewStart(getWeekStart);
  }
  //main component return 
	return(
    <div>
      { //before loading anything we need to check we have a master trainer list and the starting week
        trainerList&&weekViewStart ?(
          <div>
            <Grid container className="teamHeader"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',}}
            >
              <Grid xs={3}>
                {/* Autocomplete field that uses the master trainer list to autocomplete and uses the trainer object as a value*/}
                <Autocomplete
                  className="teamSearch"
                  id="team-search"
                  freeSolo
                  autoHighlight
                  onChange={updateSearch}
                  options={trainerList}
                  getOptionLabel={(trainer) => getFullName(trainer)}
                  renderInput={(params) => (
                  <TextField {...params} label="Search Trainer" margin="normal" variant="outlined"/>
                  )}
                />
              </Grid>
              {/* Buttons to change the current week being viewed*/}
              <Grid xs={3} >
                <Typography>Start Week</Typography>
                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                  <Button onClick={deincrementWeek} >Previous Week</Button>
                  <Button onClick={setCurrentWeek}>{ weekViewStart.toLocaleString()}</Button>
                  <Button onClick={incrementWeek} >Next Week</Button>
                </ButtonGroup>
              </Grid>
            </Grid>
            {/*The list of trainers that is rendered from the filtered list using the trainer list item component */}
            <List className={useStyles.root}>
              { 
                (filteredSearch).map((trainer)=>( 
                  <div className="trainerItem">
                    <TrainerListItem trainer={trainer} startWeek={weekViewStart} toggleTrainerVerified={toggleTrainerVerified}></TrainerListItem>
                  </div>
                  ))
                }
            </List>   
          </div>
        ):(null)
      }
    </div>
	)
}
//Trainer List Item component
const TrainerListItem = (props) =>{
  const trainer = props.trainer;
  return(
    <Accordion>
      {/*This is the "summary" or what is displayed befeore the trainer list item is expaneded*/} 
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item xs={4} >
          <ListItem alignItems="flex-start" >
            {/* The avatar, when poiting to no image uses the trainers first names first letter*/}
            <ListItemAvatar>
              <Avatar alt={getFullName(trainer)} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            {/*Displaying the users name and user name, and their verification tag component */}
            <ListItemText
              primary={getFullName(trainer)}
              secondary={
                <React.Fragment>
                  <Verification verified={trainer.isVerified}/>
                </React.Fragment>
              }
              />
          </ListItem>
        </Grid>
        {/* This timetable shows a week view of all that specific users timeslots, loads in the weektimeslot component */}
        <Grid item xs={8} >
              <WeekTimeSlot timeSlots={trainer.timeSlots} startWeek={props.startWeek}/>
        </Grid>
      </Grid>
    </AccordionSummary>
    {/*What is displayed when the trainer list item is expanded */}
    <AccordionDetails>
        <Grid container className="trainerDetails">
          <Grid item xs={4}>
          {/* The list of the trainers skills, the skill name and the skill level */}
          <Typography variant="h6">
            Skills
          </Typography>
          <List dense={true} >      
                  {
                    trainer.skills.map((skill)=>(
                      (skill.skill)? (
                        <ListItem>
                        <ListItemText
                          primary= {skill.skill.skillName}
                          secondary={'Level: '+ skill.level}
                          />
                      </ListItem>
                      ):(null)
                    ))
                  }
            </List>
          </Grid>
          <Grid item xs={3}>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <FormControlLabel
                control={
                  <Switch
                    checked={trainer.isVerified}
                    onChange={()=>(props.toggleTrainerVerified(trainer._id,trainer.isVerified))}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Verified"
              />
              
            </Grid>
            <Grid>
              <hr></hr>
              {/* Display the trainers number of completed sessions */}
              <Typography>Completed Sessions: {trainer.logRate} </Typography>
            </Grid>
          </Grid>
        </Grid>
    </AccordionDetails>
  </Accordion>
  );
}
//verifcation tag for if a trainer is verified or not
const Verification = (props) =>{
  const isVerified = props.verified;  
  return(
        (isVerified) ?(
          <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
            <CheckCircleIcon/>
            <Typography
              
              component="span"
              variant="body2"
              className={useStyles.inline}
              color="textPrimary"
              >
              Verified
            </Typography>
          </div>
        ):(
          <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
            <CancelIcon/>
            <Typography
              
              component="span"
              variant="body2"
              className={useStyles.inline}
              color="textPrimary"
              >
              Not Verified
            </Typography>
          </div>
        )
    )
}
//the timetable component , takes the starting week as a date, and a list of timeslots
const WeekTimeSlot = (props) =>{
  const startWeek = props.startWeek;
  //assigning the dates for the week
  const days = [
    {
      date: startWeek
    },
    {
      date: addDays(startWeek,1)
    },
    {
      date: addDays(startWeek,2)
    },
    {
      date: addDays(startWeek,3)
    },
    {
      date: addDays(startWeek,4)
    },
    {
      date: addDays(startWeek,5)
    },
    {
      date: addDays(startWeek,6)
    }
  ]
  //return component
  return (
    <TableContainer component={Paper}>
    <Table className={useStyles.table} aria-label="simple table" dense table>
      {/*Table header*/}
      <TableHead>
        <TableRow>
            <TableCell align="column.align" style={{"text-align": "center"}}>Sunday</TableCell>
            <TableCell align="column.align" style={{"text-align": "center"}}>Monday</TableCell>
            <TableCell align="column.align" style={{"text-align": "center"}}>Tuesday</TableCell>
            <TableCell align="column.align" style={{"text-align": "center"}}>Wednesday</TableCell>
            <TableCell align="column.align" style={{"text-align": "center"}}>Thursday</TableCell>
            <TableCell align="column.align" style={{"text-align": "center"}}>Friday</TableCell>
            <TableCell align="column.align" style={{"text-align": "center"}}>Saturday</TableCell>
  
          </TableRow>
      </TableHead>
      <TableBody>
      {/*table row maps the tablecell component which may return a timeslot if theres a hit, it takes the date of the week from the days array and the timeslots */}
      <TableRow >
        {
          days.map((day)=>(
            <TableCell align="column.align" style={{"text-align": "center"}}><DayCell timeSlots={props.timeSlots} date={day.date}/></TableCell>
          ))
        }
      </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
  )
}
//day cell component which is what is used to fill the day of a timetable if it finds matching timeslots (same date)
const DayCell = (props) => {
  //this is the list of found matches
  const [dayTimeSlots, setDayTimeSlots] = useState([]);
  //when the component loads, we go through the list of timeslots, find matches and set the list of matches as the dayTimeSlots
  useEffect(() => {
    const dayStart = (props.date).getTime();
    const dayEnd = (addDays(props.date,1)).getTime();
    const timeSlots = props.timeSlots;
    const tempDaysArray = [];
    timeSlots.map((timeSlot)=>{
      const time = (new Date(timeSlot.startTime)).getTime();
      if(time>=dayStart && time<dayEnd){
        tempDaysArray.push(timeSlot);
      }
    })
    if(tempDaysArray){
      setDayTimeSlots(tempDaysArray)
    }
  }, [props.date])

  return(
    <div>
      {
        dayTimeSlots.map((timeslot)=>(
            <Chip label={timeslot.course.courseName} /> 
        ))
      }
    </div>
  )
}
export default Team;