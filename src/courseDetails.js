import React, {useState, useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
	typography: {
		marginLeft: "25px"
	},
	listItemText: {
		borderRadius: "20px",
		padding: "10px",
	}
});
const CourseDetails = ({courseName, deliveryMethod, skillRequirements}) => {	
	const classes = useStyles();
	return (  
		<>
		<List>
			<Typography variant="h5" component="h6" className={classes.typography}> Skills </Typography>
			<div style={{display: "flex"}}>
				{skillRequirements.map(skill => (
					<div>
					<ListItem alignItems="flex-start">
					<ListItemText
					 className={classes.listItemText}
					 primary={skill}
					/>
					</ListItem>
				</div>
				))}
			</div>
			<Typography variant="h5" component="h6" className={classes.typography}> Teaching delivery method </Typography>
			<Typography className={classes.typography}> {deliveryMethod} </Typography>
		</List>
		</>
	);
}	

export default CourseDetails;