import React, {useState} from "react";
import Alert from '@material-ui/lab/Alert';

const Login = ({setSessionToken, setType, setID}) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [hasFailed, setHasFailed] = useState(false);
	const [err, setErr] = useState("");
	
	const handleSubmit = (e) => {
		e.preventDefault();
		fetch("http://localhost:8000/auth/login", {
			method: 'POST',
			headers: {
				'Content-type' : 'application/json'
			},
		  	body: JSON.stringify({username, password})
		})
		.then(res => res.json())
		.then(res => {
			if (res.token && res.type && res.id) {
				setHasFailed(false);
				setSessionToken(res);
				setType(res.type);
				setID(res.id);
			} else {
				setHasFailed(true)
				setErr(res.message);
			}
		})
		.catch(err => console.log(err));
	}

	const logoPath = "logo.svg";
	return (
		<div style={styles.parent} className="parent">
			<div style={styles.container} className="container">
				<div style={styles.logo} className="logo">
					<img style={styles.img} src={process.env.PUBLIC_URL+logoPath} alt="Schedully Logo" width={300} height={200}/>
				</div>
			<form style={styles.form} onSubmit={handleSubmit}>
				<input style={styles.input} id="username" placeholder="Username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
				<input style={styles.input} id="password" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
				<input style={styles.submit} type="submit" value="Log in" />
			</form>
			{hasFailed && <Alert severity="error"> {err} </Alert>}
			</div>
		</div>
	);
}

let styles = {
	parent: {
		paddingTop: "10%",
	},
	container: {
		width: "25%",
		padding: "50px",
		margin: "0 auto",
		border: "1px solid #f1f1f1",
		backgroundColor: "#f2f2f2",
		borderRadius: "10px",
		textAlign: "center",
	},
	form: {
		border: "1px solid #ffffff",
		borderRadius: "5px",
		backgroundColor: "#ffffff",
		padding: "12px 20px",
		display: "inline-block",
		boxShadow: "0 8px 6px -6px #ccc"
	}
	,input: {
		width: "100%",
		padding: "12px 20px",
		margin: "8px 0",
		border: "1px solid #f2f2f2",
		borderRadius: "4px",
		boxSizing: "border-box"
	},
	submit: {
		width: "100%",
		backgroundColor: "#0067ff",
		color: "white",
		padding: "14px 20px",
		margin: "8px 0",
		border: "1px solid #5ac3ed",
		borderRadius: "4px",
		cursor: "pointer",

	}
}
export default Login;