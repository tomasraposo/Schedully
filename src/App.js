import React, {useState} from "react"
import Login from "./Login";
import {BrowserRouter as Router, Route, Switch as SwitchRouter} from "react-router-dom";
import NavBar from "./NavBar";
import Courses from "./Courses";
import Calendar from "./Calendar";
import Team from "./Team";

//importing contexts
import {useTokenContext,useSetTokenContext,useUserIDContext,useSetUserIDContext,useUserTypeContext,useSetUserTypeContext} from './UserContext';

const App = () => {

  const token = useTokenContext();
  const setToken = useSetTokenContext();
  const userType = useUserTypeContext();
  const setUserType = useSetUserTypeContext();
  const userID = useUserIDContext();
  const setUserID = useSetUserIDContext();

  const setSessionToken = accessToken => {
    sessionStorage.setItem('token', JSON.stringify(accessToken));
    setToken(accessToken.token);   
  }

  const setType = type => setUserType(type);
  const setID = id => setUserID(id);

  const clearSessionToken = () => {
      window.location.reload() //hack
      setToken(null);
  }

  if (!token && !userType && !userID)
    return <Login setSessionToken={setSessionToken} setType={setType} setID={setID}/>
  
  const userInfo = [userType, userID];
  // check if both type and id are set
  if (userInfo.every((e) => !!e)) 
    return ( 
      <Router>
          <SwitchRouter>
            <Route exact path="/">
              <NavBar userType={userType} clearSession={clearSessionToken}/>
              <Calendar userType={userType} userID={userID}/>
            </Route>
          {userType === "CourseScheduler" &&
            <> 
              <Route exact path="/Courses">
                  <NavBar userType={userType} clearSession={clearSessionToken}/>
                  <Courses/>
              </Route>
              <Route exact path="/Team">
                  <NavBar userType={userType} clearSession={clearSessionToken}/>
                  <Team/>
                </Route>
            </>
          }
          </SwitchRouter>
      </Router>
  )
  return <h1> Please wait whilst the app loads </h1>
}

export default App;