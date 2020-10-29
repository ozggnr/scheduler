import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";
import getAppointmentsForDay from "../helpers/selectors";
const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Jones",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 4,
    time: "3pm",
  },
  {
    id: 5,
    time: "4pm",
    interview: {
      student: "Jones",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
 
];


export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });
  const setDays = days => setState(prev => ({ ...prev, days }));
  
  useEffect( () => {
    axios.get('/api/days').then((response) => {
      setDays(response.data)}
    )
  },[])

  const appointmentList = appointments.map((appointment) => (  
    <Appointment 
      key={appointment.id} 
      id={appointment.id} 
      time={appointment.time} 
      interview={appointment.interview} />
    ))

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
      <section className="schedule">{appointmentList} 
      <Appointment key="last" time="5pm" /> 
      </section>
    </main>
  );
}

  {/* {
        
        } */}
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}