import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay  } from "../helpers/selectors";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {
      "1": {
        id: 1,
        time: "12pm",
        interview: null
      }
    },
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day })
  
  
  useEffect( () => {
    const first = axios.get('/api/days');
    const second = axios.get('/api/appointments')
    const third = axios.get('/api/interviewers')
    
    Promise.all([
      first,
      second,
      third
    ]).then(all => {
       return setState(prev => ({...prev, days : all[0].data, appointments: all[1].data, interviewers : all[2].data}))
    })
    
  },[])

  const appointments = getAppointmentsForDay(state,state.day);
  const interviewers = getInterviewersForDay(state,state.day);
  
  //-----------bookInterview---------
  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`,{interview}).then(
    () => {const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }; 
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments })
     })
  }
  
  //-----------cancelInterview--------------
  function cancelInterview(id, interview) {
    return axios.delete(`/api/appointments/${id}`).then(() =>
   
    {const appointment = {
      ...state.appointments[id],
      interview: null
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    setState({
      ...state,
      appointments })}
     
    )
  }

  const schedule = appointments.map((appointment) => {  
    
    const interview = getInterview(state, appointment.interview)
 
    return (<Appointment 
      key={appointment.id} 
      id={appointment.id} 
      time={appointment.time} 
      interview={interview}
      interviewers = {interviewers}
      bookInterview = {bookInterview}
      cancelInterview = {cancelInterview}
      />)
  })

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
