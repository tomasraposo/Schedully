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

function TabPanel(props) {
    const { children, value, index, ...other } = props;  return (
      <div {...other}>
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
}

function formatDate(d) {
    return d.getFullYear() +  "-" + (d.getMonth()+1).toString().padStart(2, "0") + "-" + d.getDate().toString().padStart(2, "0");
}

function formatTime(t) {
    return t.getHours().toString().padStart(2, "0") + ":" + t.getMinutes().toString().padStart(2, "0");
}

const handleSubmit = (e, startDate, startTime, endDate, endTime, trainer, course, bannerCallBack) => {
    e.preventDefault();
    let sTime = startDate+"T"+startTime+":00.000Z";
    let eTime = endDate+"T"+endTime+":00.000Z";
    let status;
    fetch("http://localhost:8000/db/timeslots/add", {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json'
        },
          body: JSON.stringify({trainer, course, startTime: sTime, endTime: eTime})
    })
    .then(res => {
        status = res.ok;
        return res.json();
    })
    .then(({message}) => {
        if (bannerCallBack) {
            bannerCallBack(status, message);
        }
    })
    .catch(err => {
        console.log(status);
    });
}

const handleUpdate = (e, timeSlotId, startDate, startTime, endDate, endTime, trainer, course, bannerCallBack) => {
    e.preventDefault();
    let sTime = startDate+"T"+startTime+":00.000Z";
    let eTime = endDate+"T"+endTime+":00.000Z";
    let status;
    fetch("http://localhost:8000/api/timeslots/update/"+timeSlotId, {
        method: 'put',
        headers: {
            'Content-type' : 'application/json'
        },
          body: JSON.stringify({trainer: trainer, course: course, startTime: sTime, endTime: eTime})
    })
    .then(res => {
        status = res.ok;
        return res.json();
    })
    .then(({message}) => {
        if (bannerCallBack) {
            bannerCallBack(status, message);
        }
    })
    .catch(err => {
        console.log(status);
    });
}

const getCourseList = (callBack) => {
    fetch("http://localhost:8000/api/courses/populate", {
        method: 'GET',
        headers: {
            'Content-type' : 'application/json'
        },
    })
    .then(res => res.json())
    .then(result => callBack(result))
    .catch(err => console.log(err));
}

const getTrainerList = (course, callBack) => {
    if (!course) {
        return;
    }
    fetch("http://localhost:8000/api/trainers", {
        method: 'post',
        headers: {
            'Content-type' : 'application/json'
        },
        body: course.skillRequirements[0]._id ? JSON.stringify({skillRequirements: course.skillRequirements.map((item) => item._id)}) : JSON.stringify({skillRequirements: course.skillRequirements})
    })
    .then(res => res.json())
    .then(result => callBack(result))
    .catch(err => console.log(err));
}

const getAvaliableTrainers = (course, startDate, startTime, endDate, endTime, callBack) => {
    if (!startDate || !startTime || !endDate || !endTime || !course) {
        return;
    }
    let sTime = startDate+"T"+startTime+":00.000Z";
    let eTime = endDate+"T"+endTime+":00.000Z";
    return fetch("http://localhost:8000/api/trainers/avaliable", {
        method: 'post',
        headers: {
            'Content-type' : 'application/json'
        },
        body: course ? JSON.stringify({skillRequirements: course.skillRequirements, startTime: sTime, endTime: eTime}) : undefined
    })
    .then(res => res.json())
    .catch(err => console.log(err));
}

const getCourseInfo = (courseId, callBack) => {
    fetch("http://localhost:8000/api/courses/byId", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({id: courseId})
    }).then(res => res.json())
    .then(result => {
        if (callBack) {
            callBack({course: result});
        }
    })
    .catch(err => console.log(err));
}

const getTrainerInfo = (trainerId, callBack) => {
    return fetch("http://localhost:8000/api/trainers/byId", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({id: trainerId})
    }).then(res => res.json())
    .catch(err => console.log(err));
}

const handleDelete = (timeSlotId, callBack) => {
    let status;
    fetch("http://localhost:8000/api/timeslots/delete/"+timeSlotId, {
        method: "delete",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({id: timeSlotId})
    })
    .then(res => {
        status = res.ok;
        return res.json();
    })
    .then(({message}) => {
        if (callBack) {
            callBack(status, message);
        }
    })
    .catch(err => {
        console.log(status);
    });
}

function contains(skillList, skill) {
    for (let i = 0; i < skillList.length; i++) {
        if (skillList[i]._id == skill._id) {
            return true;
        }
    }
    return false;
}

function containsList(skillList, skill) {
    for (let i = 0; i < skillList.length; i++) {
        if (skillList[i] == skill._id) {
            return true;
        }
    }
    return false;
}

function compare(a, b) {
    if (a.skillMatchLevel > b.skillMatchLevel) {
        return -1;
    }
    if (a.skillMatchLevel < b.skillMatchLevel) {
        return 1;
    }
    return 0;
}

const sortTrainers = (trainers, course) => {
    let skillRequirements = course.skillRequirements;
    // console.log(trainers, skillRequirements);
    trainers.forEach(trainer => {
        let skillMatches = 0;
        let skillMatchLevel = 0;
        trainer.skills.forEach(skill => {
            if (contains(skillRequirements, skill.skill)) {
                skillMatchLevel += skill.level;
                skillMatches++;
            }
        });
        trainer.skillMatchLevel = Math.round((skillMatchLevel * (skillMatches/skillRequirements.length))*100)/100;
    });
    trainers.sort(compare);
    // console.log(trainers);
    return trainers;
}

const sortTrainersList = (trainers, course) => {
    let skillRequirements = course.skillRequirements;
    // console.log(skillRequirements, trainers);
    trainers.forEach(trainer => {
        let skillMatches = 0;
        let skillMatchLevel = 0;
        trainer.skills.forEach(skill => {
            if (containsList(skillRequirements, skill.skill)) {
                skillMatchLevel += skill.level;
                skillMatches++;
            }
        });
        trainer.skillMatchLevel = Math.round((skillMatchLevel * (skillMatches/skillRequirements.length))*100)/100;
    });
    trainers.sort(compare);
    // console.log(trainers);
    return trainers;
}

//for a stupid trainer, who's id's are called skills and skills are id's (?????????????)
const getSkillMatch = (trainer, course) => {
    let skillRequirements = course.skillRequirements;
    let skillMatches = 0;
    let skillMatchLevel = 0;
    trainer.skills.forEach(skill => {
        for (let i = 0; i < skillRequirements.length; i++) {
            if (skillRequirements[i]._id == skill.skill) {
                skillMatches++;
                skillMatchLevel += skill.level;
            }
        }
    });
    trainer.skillMatchLevel = Math.round((skillMatchLevel * (skillMatches/skillRequirements.length))*100)/100;
    return trainer;
}

class Form1 extends React.Component {
    state = {
        courseList: [],
        trainerList: [],
        course: null,
        trainer: null,
        startDate: this.props.sDate ? this.props.sDate : formatDate(new Date()),
        endDate: this.props.eDate ? this.props.eDate : formatDate(new Date()),
        startTime: this.props.sTime ? this.props.sTime : formatTime(new Date()),
        endTime: this.props.eTime ? this.props.eTime : formatTime(new Date()),
        update: this.props.courseId ? true: false,
        showBanner: false,
        bannerState: null,
        bannerMessage: "",
        timeSlotId: this.props.timeSlotId ? this.props.timeSlotId : null,
        deleted: false,
        updatingCourse: null,
        repeat: "Never"
    }

    updateBannerInfo = (status, message) => {
        this.setState({showBanner: true, bannerMessage: message, bannerStatus: status});
        this.props.refreshCal(status);
    }

    setTrainerList = (trainerList) => {
        this.setState({trainerList: trainerList});
        if (trainerList) {
            if (this.state.updatingCourse === this.state.course._id) {
                let index = 0;
                for (let i = 0; i < trainerList.length; i++) {
                    if (trainerList[i]._id === this.props.trainerId) {
                        index = i;
                    }
                }
                this.setState({trainerList: trainerList, trainer: trainerList[index]});
            } else {
                this.setState({trainerList: trainerList});
            }
        }
    }

    updateCourseList = (courseList) => {
        this.setState({courseList: courseList});
    }

    updateTrainer = (trainer) => {
    }

    updateCourse = (course) => {
        this.setState({course: course.course}, this.setTrainerList);
    }

    formBanner() {
        if (this.state.showBanner) {
            if (this.state.bannerStatus) {
                return (
                    <Alert variant="filled" severity="success">{this.state.bannerMessage}</Alert>
                )
            } else {
                return (
                    <Alert variant="filled" severity="error">{this.state.bannerMessage}</Alert>
                )
            }
        }
    }

    componentDidMount() {
        getCourseList(this.updateCourseList);
        if (this.props.timeSlotId) {
            this.setState({updatingCourse: this.props.courseId, timeSlotId: this.props.timeSlotId}, getCourseInfo(this.props.courseId, this.updateCourse));
            getTrainerList(this.state.course, this.setTrainerList);
            this.updateTrainer();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.course !== prevState.course && this.state.course) {
            getTrainerList(this.state.course, this.setTrainerList);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props) || JSON.stringify(nextState) !== JSON.stringify(this.state);
    }

    resetDefaults() {
        this.setState({
            course: null,
            trainer: null,
            startDate: formatDate(new Date()),
            endDate: formatDate(new Date()),
            startTime: formatTime(new Date()),
            endTime: formatTime(new Date())
        })
    }

    deleteTimeSlotOption() {
        if (this.state.update) {
            return (
                <Grid item xs={6} sm={3}>
                    <Button variant="contained" color="secondary" onClick={() => this.deleteTimeSlot()}>
                        Delete
                    </Button>
                </Grid>
            )
        }
    }

    deleteTimeSlot() {
        handleDelete(this.state.timeSlotId, this.updateBannerInfo);
        this.setState({deleted: true});
        console.log(this.props);
    }

    updateTimeSlot(e) {
        handleUpdate(e, this.state.timeSlotId, this.state.startDate, this.state.startTime, this.state.endDate, this.state.endTime, this.state.trainer, this.state.course, this.updateBannerInfo)
    }

    createTimeSlot(e) {
        handleSubmit(e, this.state.startDate, this.state.startTime, this.state.endDate, this.state.endTime, this.state.trainer, this.state.course, this.updateBannerInfo)
    }

    render() {
        if (this.state.deleted) {
            return (
                <>
                    {this.formBanner()}
                </>
            )
        }
        return (
            <>
            {this.formBanner()}
            <form id="timeSlotForm" className={this.props.classes.root} noValidate autoComplete="off" onSubmit={(e) => this.state.update ? this.updateTimeSlot(e) : this.createTimeSlot(e)}>
                <Grid container className={this.props.classes.gridContainer} spacing={2}>
                    <Grid item xs={12}>
                        <Autocomplete
                            value={this.state.course}
                            onChange={(event, newValue) => {
                                this.setState({course: newValue});
                            }}
                            getOptionSelected={(option, value) => option.courseName === value}
                            options={this.state.courseList}
                            getOptionLabel={(option) => option.courseName}
                            disableClearable={false}
                            renderInput={(params) => 
                                <TextField {...params} required id="standard-basic" 
                                    label="Add a course" 
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PostAddRounded/>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            value={this.state.trainer}
                            onChange={(event, newValue) => {
                                this.setState({trainer: newValue});
                            }}
                            getOptionSelected={(option, value) => option === value}
                            disabled={!this.state.course}
                            options={this.state.trainerList}
                            getOptionLabel={(option) => option ? option.firstName.charAt(0).toUpperCase() + option.firstName.slice(1) + " " + option.lastName.charAt(0).toUpperCase() + option.lastName.slice(1) : ""}
                            disableClearable={false}
                            renderInput={(params) => 
                                <TextField {...params}  required id="standard-basic" 
                                    label="Add a trainer"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonRounded/>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            }
                        />
                    </Grid>
                    <Grid container style={{padding: "8px"}}>
                        <Grid item xs={6} sm={3}>
                            <TextField  required id="date"
                            type="date"
                            defaultValue={this.state.startDate}
                            className={this.props.classes.textField}
                            InputLabelProps={{shrink: true}}
                            label="Start date"
                            onChange={e => this.setState({startDate: e.target.value})}/>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField required id="time"
                            type="time"
                            defaultValue={this.state.startTime}
                            className={this.props.classes.textField}
                            InputLabelProps={{shrink: true}}
                            label="Start time"
                            onChange={e => this.setState({startTime: e.target.value})}/>
                        </Grid>
                    </Grid>
                    <Grid container style={{padding: "8px"}}>
                        <Grid item xs={6} sm={3}>
                            <TextField required id="date"
                            type="date"
                            defaultValue={this.state.endDate}
                            className={this.props.classes.textField}
                            InputLabelProps={{shrink: true}}
                            label="End date"
                            onChange={e => this.setState({endDate: e.target.value})}/>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField required id="time"
                            type="time"
                            defaultValue={this.state.endTime}
                            className={this.props.classes.textField}
                            InputLabelProps={{shrink: true}}
                            label="End time"
                            onChange={e => this.setState({endTime: e.target.value})}/>
                        </Grid>
                    </Grid>
                    <Grid item style={{}}xs={7}>
                        <InputLabel style={{fontSize: "15px"}}> Repeat </InputLabel>
                        <Select value={this.state.repeat} onChange={(e) => this.setState({repeat: e.target.value})}>
                            <MenuItem value={"Never"}> Never </MenuItem>
                            <MenuItem value={"Daily"}> Daily </MenuItem>
                            <MenuItem value={"Weekly"}> Weekly </MenuItem>
                            <MenuItem value={"Monthly"}> Monthly </MenuItem>
                            <MenuItem value={"Yearly"}> Yearly </MenuItem>
                        </Select>
                    </Grid>
                    <Grid container style={{padding: "8px"}}>
                        <Grid item xs={6} sm={3}>
                            <Button variant="contained" color="primary" type="submit">
                                {this.state.update ? "Update" : "Submit"}
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Button variant="contained" color="secondary" onClick={() => this.state.update ? this.deleteTimeSlot() : this.resetDefaults()}>
                                {this.state.update ? "Delete" : "Discard"}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
            </>
        )
    }
}
class Form2 extends React.Component {
    state = {
        courseList: [],
        trainerList: [],
        course: null,
        startDate: this.props.sDate ? this.props.sDate : formatDate(new Date()),
        endDate: this.props.eDate ? this.props.eDate : formatDate(new Date()),
        startTime: this.props.sTime ? this.props.sTime : formatTime(new Date()),
        endTime: this.props.eTime ? this.props.eTime : formatTime(new Date()),
        update: this.props.courseId ? true: false,
        showBanner: false,
        bannerState: null,
        bannerMessage: "",
        selected: null,
        updatingCourse: null,
        timeSlotId: this.props.timeSlotId ? this.props.timeSlotId : null,
        deleted: false
    }

    setTrainerList = (trainerList) => {
        this.setState({trainerList: trainerList});
    }

    updateTrainerList = () => {
        if (this.state.update) {
            getTrainerInfo(this.props.trainerId)
            .then((trainer) => {
                getAvaliableTrainers(this.state.course, this.state.startDate, this.state.startTime, this.state.endDate, this.state.endTime)
                .then((trainerList) => {
                    if (this.state.course._id == this.state.updatingCourse) {
                        trainerList = sortTrainers(trainerList, this.state.course);
                        trainerList.unshift(getSkillMatch(trainer, this.state.course));
                        this.setState({trainerList: trainerList, selected: this.state.selected ? this.state.selected : 0});
                    } else {
                        trainerList = sortTrainers(trainerList, this.state.course);
                        this.setState({trainerList: trainerList});
                    }
                });
            });
        } else {
            getAvaliableTrainers(this.state.course, this.state.startDate, this.state.startTime, this.state.endDate, this.state.endTime)
            .then((trainerList) => {
                trainerList = sortTrainers(trainerList, this.state.course);
                this.setState({trainerList: trainerList});
            })
        }
    }

    updateCourse = (course) => {
        for (let i = 0; i < this.state.courseList.length; i++) {
            if (course.course._id == this.state.courseList[i]._id) {
                this.setState({course: this.state.courseList[i]}, this.updateTrainerList);
            }
        }
    }

    updateCourseList = (courseList) => {
        if (this.props.timeSlotId) {
            this.setState({courseList: courseList}, getCourseInfo(this.props.courseId, this.updateCourse));
        }
        this.setState({courseList: courseList});
    }

    updateBannerInfo = (status, message) => {
        this.setState({showBanner: true, bannerMessage: message, bannerStatus: status});
        this.props.refreshCal(status);
    }

    componentDidMount(nextProps, nextState) {
        getCourseList(this.updateCourseList);
        if (this.props.timeSlotId) {
            this.setState({updatingCourse: this.props.courseId, timeSlotId: this.props.timeSlotId});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.course) {
            this.updateTrainerList();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props) || JSON.stringify(nextState) !== JSON.stringify(this.state);
    }

    formBanner() {
        if (this.state.showBanner) {
            if (this.state.bannerStatus) {
                return (
                    <Alert variant="filled" severity="success">{this.state.bannerMessage}</Alert>
                )
            } else {
                return (
                    <Alert variant="filled" severity="error">{this.state.bannerMessage}</Alert>
                )
            }
        }
    }

    deleteTimeSlotOption() {
        if (this.state.update) {
            return (
                <Grid item xs={6} sm={3}>
                    <Button variant="contained" color="secondary" onClick={() => this.deleteTimeSlot()}>
                        Delete
                    </Button>
                </Grid>
            )
        }
    }

    deleteTimeSlot() {
        handleDelete(this.state.timeSlotId, this.updateBannerInfo);
        this.setState({deleted: true});
    }

    handleClick(event, index) {
        if (index == this.state.selected) {
            this.setState({selected: null});
        } else {
            this.setState({selected: index});
        }
    }

    resetDefaults() {
        this.setState({
            startDate: formatDate(new Date()),
            endDate: formatTime(new Date()),
            startTime: formatDate(new Date()), 
            endTime: formatTime(new Date()),
            course: null,
            selected: null,
            trainerList: [],
            showBanner: false
        })
    }

    render() {
        return (<></>)
    }

    updateTimeSlot(e) {
        handleUpdate(e, this.state.timeSlotId, this.state.startDate, this.state.startTime, this.state.endDate, this.state.endTime, this.state.trainerList[this.state.selected], this.state.course, this.updateBannerInfo);
    }

    createTimeSlot(e) {
        handleSubmit(e, this.state.startDate, this.state.startTime, this.state.endDate, this.state.endTime, this.state.trainerList[this.state.selected], this.state.course, this.updateBannerInfo);
    }

    render() {
        if (this.state.deleted) {
            return (
                <>
                    {this.formBanner()}
                </>
            )
        }
        return (
            <>
            {this.formBanner()}
            <form id="timeSlotForm" className={this.props.classes.root} noValidate autoComplete="off" onSubmit={(e) => this.state.update ? this.updateTimeSlot(e) : this.createTimeSlot(e)}>
                <Grid container className={this.props.classes.gridContainer}>
                    <Grid item xs={6}>
                        <Grid container className={this.props.classes.gridContainer} style={{padding: "8px"}}>
                            <Grid item xs={12} style={{padding: "8px"}}>
                                <Autocomplete
                                    value={this.state.course}
                                    onChange={(event, newValue) => {
                                        this.setState({course: newValue});
                                    }}
                                    getOptionSelected={(option, value) => option.courseName === value}
                                    options={this.state.courseList}
                                    getOptionLabel={(option) => option.courseName}
                                    disableClearable={false}
                                    style={{ width: 320 }}
                                    renderInput={(params) => 
                                        <TextField {...params} required id="standard-basic" 
                                            label="Add a course" 
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PostAddRounded/>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid container style={{padding: "8px"}}>
                                <Grid item xs={6}>
                                    <TextField  required id="date"
                                    type="date"
                                    defaultValue={this.state.startDate}
                                    className={this.props.classes.textField}
                                    InputLabelProps={{shrink: true}}
                                    label="Start date"
                                    onChange={e => this.setState({startDate: e.target.value})}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField required id="time"
                                    type="time"
                                    defaultValue={this.state.startTime}
                                    className={this.props.classes.textField}
                                    InputLabelProps={{shrink: true}}
                                    label="Start time"
                                    onChange={e => this.setState({startTime: e.target.value})}/>
                                </Grid>
                            </Grid>
                            <Grid container style={{padding: "8px"}}>
                                <Grid item xs={6}>
                                    <TextField required id="date"
                                    type="date"
                                    defaultValue={this.state.endDate}
                                    className={this.props.classes.textField}
                                    InputLabelProps={{shrink: true}}
                                    label="End date"
                                    onChange={e => this.setState({endDate: e.target.value})}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField required id="time"
                                    type="time"
                                    defaultValue={this.state.endTime}
                                    className={this.props.classes.textField}
                                    InputLabelProps={{shrink: true}}
                                    label="End time"
                                    onChange={e => this.setState({endTime: e.target.value})}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} style={{padding: "8px"}}>
                        Trainers
                        <List component="nav">
                            {
                                this.state.trainerList.map((_trainer, index) => {
                                    return (
                                        <ListItem 
                                            button 
                                            onClick={(event) => this.handleClick(event, index)}
                                            selected={this.state.selected === index}
                                            >
                                            <ListItemText primary={_trainer.firstName.charAt(0).toUpperCase() + _trainer.firstName.slice(1) + " " + _trainer.lastName.charAt(0).toUpperCase() + _trainer.lastName.slice(1)} secondary={"Skill Match: "+ _trainer.skillMatchLevel}></ListItemText>
                                        </ListItem>
                                    );
                                })
                            }
                        </List>
                    </Grid>  
                    <Grid container style={{padding: "8px"}}>
                        <Grid item xs={6} sm={3}>
                            <Button variant="contained" color="primary" type="submit">
                                {this.state.update ? "Update" : "Submit"}
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Button variant="contained" color="secondary" onClick={() => this.state.update ? this.deleteTimeSlot() : this.resetDefaults()}>
                                {this.state.update ? "Delete" : "Discard"}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
            </>
        )
    }
}

const TimeSlotForm = ({id, hasOpen, setHasClosed, courseId, trainerId, sDate, eDate, sTime, eTime, refreshCal}) => {
    const [value, setValue] = useState(1);
    const classes = useStyles();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [refresh, setRefresh] = useState(false);

    return (
        <>
            <Modal className={classes.modal} open={hasOpen} onClose={() => {
                setHasClosed()
                if (refresh) {
                    refreshCal();
                }
                }}>
                <div className={classes.div}>
                    <AppBar position="static">
                        <Tabs value={value} onChange={handleChange} variant="fullWidth">
                            <Tab label="Create Session for Trainer" />
                            <Tab label="Create Session for Course" />
                            <Button variant="contained" color="secondary" style={{width: "20%", "border-radius": 0}} onClick={() => {
                                setHasClosed()
                                if (refresh) {
                                    refreshCal();
                                }
                                }}>
                                Close
                            </Button>
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Form1 
                            handleSubmit={handleSubmit}
                            timeSlotId={id}
                            courseId={courseId}
                            trainerId={trainerId}
                            sDate={sDate}
                            eDate={eDate}
                            sTime={sTime}
                            eTime={eTime}
                            classes={classes}
                            refreshCal={setRefresh}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Form2 
                            handleSubmit={handleSubmit}
                            timeSlotId={id}
                            courseId={courseId}
                            trainerId={trainerId}
                            sDate={sDate}
                            eDate={eDate}
                            sTime={sTime}
                            eTime={eTime}
                            classes={classes}
                            refreshCal={setRefresh}
                        />
                    </TabPanel>
                </div>
            </Modal> 
		</>
    )
}

export default TimeSlotForm;