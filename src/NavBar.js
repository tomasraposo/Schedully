import React, {useState} from 'react';
import {makeStyles, AppBar, Toolbar, Typography,
	   IconButton, CssBaseline} from '@material-ui/core';
import {AccountCircleRounded, ExitToAppRounded, SearchRounded} from '@material-ui/icons';
import Icon from '@material-ui/core/Icon';
import Link from '@material-ui/core/Link';
import {BrowserRouter as Router, Route, Switch as SwitchRouter, Link as RouterLink} from "react-router-dom";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		zIndex: 1,
		overflow: 'hidden',
		position: 'relative',
		display: 'flex',
	},
	appBar: {
	  zIndex: theme.zIndex.drawer + 1,
	},
	content: {
	  flexGrow: 1,
	  padding: theme.spacing(3),
	},
	icons: {
		display: "flex",
		marginLeft: "auto",
	},
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		minWidth: 0
	  },
	text: {
		paddingLeft: "15px",
		color: "#ffffff"
	},
	  toolbar: theme.mixins.toolbar
  }));

const NavBar = ({userType, clearSession}) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const logo = process.env.PUBLIC_URL+"/logo-symbol.svg";
  	return (
	  <div className={classes.root}>
		<CssBaseline />
		<AppBar style={{backgroundColor: "#0864fc"}} position="fixed" className={classes.appBar}>
		  <Toolbar>
			<Icon >
				<img width="100%" style={{color: "white"}} src={logo} alt="Schedully Logo"/>
			</Icon>
			{userType === "CourseScheduler" &&
				<> 
					{["Calendar", "Courses", "Team"].map((item,i) => {
						const path = i === 0 ? "/" : `/${item}`; 
                        console.log(path);
						return (					
							<Link component={RouterLink} to={path} style={{textDecoration: "none"}}>
								<Typography className={classes.text} variant="h6" noWrap>
									{item}
								</Typography>
							</Link>
						)
					})}
				</>
			}
			<div className={classes.icons}>
			<IconButton onClick={handleMenu} color="inherit">
				<AccountCircleRounded/>
			</IconButton>
			<Menu id="menu-appbar" anchorEl={anchorEl} 
			 anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			 keepMounted
			 transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
			 }}
			 open={open}
			 onClose={handleClose}>
				<MenuItem onClick={handleClose}>Profile</MenuItem>
				<MenuItem onClick={handleClose}>My account</MenuItem>
				</Menu>
                <IconButton onClick={() => clearSession()} style={{color: "white"}}>
                    <ExitToAppRounded/>
                </IconButton>
			</div>
		  </Toolbar>
		</AppBar>
		<main className={classes.content}>
		<div className={classes.toolbar} />
      </main>
    </div>
  );
}

export default NavBar;