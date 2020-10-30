import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview  } from "../helpers/selectors";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
   
  });

  const setDay = day => setState({ ...state, day });
  
  useEffect( () => {
    const first = axios.get('/api/days');
    const second = axios.get('/api/appointments')
    const third = axios.get('/api/interviewers')
    
    Promise.all([
      first,
      second,
      third
    ]).then(all => {
      // console.log(all)
       return setState(prev => ({...prev, days : all[0].data, appointments: all[1].data, interviewers : all[2].data}))
    })},[])
   
  const appointments = getAppointmentsForDay(state,state.day);

  const schedule = appointments.map((appointment) => {  
    
    const interview = getInterview(state, appointment.interview)
  
    return (<Appointment 
      key={appointment.id} 
      id={appointment.id} 
      time={appointment.time} 
      interview={appointment.interview} />)
  })
// })

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
    <hr className="sidebar__separator sidebar--centered" />
    <nav className="sidebar__menu">
      <DayList
        days={state.days}
        day={state.day}
        setDay = {setDay} 
      />
    </nav>
    <img
    className="sidebar__lhl sidebar--centered"
      src="images/lhl.png"
      alt="Lighthouse Labs"
    />
      </section>
      <section className="schedule">{schedule} 
      <Appointment key="last" time="5pm" /> 
      </section>
    </main>
  );
}
