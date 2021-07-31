import React, {useEffect, useState} from "react";
import {TextField, Typography, Grid, MenuItem, IconButton, Button, ListItem,/* ListItemText, isWidthUp*/} from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Alert from '@material-ui/lab/Alert';
import {PostAddRounded, PersonRounded, SaveRounded, DeleteRounded /*FiberManualRecordRounded*/, EditRounded, EventBusyRounded} from '@material-ui/icons';
import { Autocomplete } from "@material-ui/lab";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
	modal:{
		"&:focus":{
		outline: "none"
	   }
	 },
	div: {
	  position: 'absolute',
	  width: "50%",
      height: "50%",
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

const TrainerTimeSlotForm = ({id, hasOpen, setHasClosed, courseName, trainerId, sDate, eDate, sTime, eTime, refreshCal}) => {
    const classes = useStyles();
    const [timeSlot, setTimeSlot] = useState(null);
    const [status, setStatus] = useState(null);
    const [isAttending, setIsAttending] = useState(null);
    const [isCompleted,setIsCompleted] = useState(null);
    const [feedback,setFeedback] = useState(null);


    const fetchTimeSlotInfo = async () =>{
        const url = "http://localhost:8000/api/timeslot/"+id;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if(data){
            setTimeSlot(data[0]);
            setIsAttending(data[0].attending);
            setIsCompleted(data[0].isCompleted);
            setFeedback(data[0].feedback);
        }
    }

    useEffect(() => {
        if(!(id=="")){
            fetchTimeSlotInfo();
        }
    }, [id])

    //methods to handle changes
    const handleFeedbackChange = (event) =>{
        setFeedback(event.target.value);
    }
    //handle update
    const handleUpdate = async () =>{
        const url = "http://localhost:8000/api/timeslots/update/" + id;
        const response = await fetch (url,{
            method:'PUT',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({isCompleted:isCompleted,feedback:feedback,attending:isAttending})
        })
        if(response.ok){
            setStatus("sucess")
        }else{
            setStatus("failure")
        }
    }

    return (
        <>
            <Modal className={classes.modal} open={hasOpen} onClose={() => {
                setHasClosed()
                if (status=="sucess") {
                    refreshCal()
                }
            }}>
                 <div className={classes.div}>
                    <Grid container direction="row" justify="center" alignItems="center" style ={{height:"100%",width:"100%"}}>
                        {
                            (timeSlot)?(
                            <>
                                <Grid x={6} justify="center" alignItems="center" style ={{height:"80%",width:"50%",marginTop:"3rem"}} >
                                <form >
                                    <FormControlLabel
                                    checked={isAttending}
                                    value="isAttending"
                                    control={<Checkbox color="primary" />}
                                    label="Attending session?"
                                    labelPlacement="start"
                                    onChange={()=>setIsAttending(!isAttending)}
                                    />
                                    <FormControlLabel
                                    checked={isCompleted}
                                    value="isCompleted"
                                    control={<Checkbox color="primary" />}
                                    label="Session completed?"
                                    labelPlacement="start"
                                    onChange={()=>setIsCompleted(!isCompleted)}
                                    />
                                    <br></br>
                                    <TextField
                                    style ={{height:"50%",width:"100%"}}
                                    id="outlined-multiline"
                                    label="Feedback"
                                    multiline
                                    rows={5}
                                    rowsMax={5}
                                    value={feedback}
                                    variant="outlined"
                                    onChange ={handleFeedbackChange}
                                    />        
                                </form>
                                <StatusMessage status={status} setStatus={setStatus}/>
                                </Grid>
                                <Grid xs={6} style ={{height:"80%",width:"50%"}}>
                                     <List>
                                        <ListItem>
                                            <ListItemText
                                                primary="Course"
                                                secondary={courseName}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Start Date"
                                                secondary={sDate}
                                            />
                                            <ListItemText
                                                primary="Start Time"
                                                secondary={sTime}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="End Date"
                                                secondary={eDate}
                                            />
                                            <ListItemText
                                                primary="End Time"
                                                secondary={eTime}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                            </>
                            ):(
                            <Grid xs={12} style={{textAlign: "center",height:"80%"}}>
                                <CircularProgress />
                            </Grid>
                            )
                        }    
                        <Grid xs={12}>
                            <Button variant="contained" color="primary" style={{width: "20%", "border-radius": 0, marginRight:"10px"}} onClick={handleUpdate}>
                                Update
                            </Button>
                            <Button variant="contained" color="secondary" style={{width: "20%", "border-radius": 0}} onClick={() => {
                                setHasClosed()
                                if (status=="sucess") {
                                    refreshCal()
                                }
                                }}>
                                Close
                            </Button>
                        </Grid> 
                    </Grid>
                </div>
            </Modal> 
		</>
    )
}

const StatusMessage = (props) =>{
    console.log("yoyoyo",props.status);
    if (props.status=="sucess"){
        return(
        <Alert onClose={()=>props.setStatus(null)} severity="success" style={{marginTop:"20px"}}>
            Time Slot Updated!
        </Alert>
        )
    }
    else if (props.status=="failure"){
        return null
    }
    else{
        return null
    }
}

export default TrainerTimeSlotForm;