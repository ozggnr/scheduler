import  { useState, useEffect } from "react";
import axios from 'axios';

const useApplicationData = function () {
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

    //This function is used for both saving new interview and editting existing interview then it update the database
    function bookInterview(id, interview, type) {
      return axios.put(`/api/appointments/${id}`,{interview}).then(
      () => {const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      }; 
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      if (type === "add") {
        spotsRemaining(id, "save")
      }
      setState({
        ...state,
        appointments })
       })  ;
    };
    
    //This function is defined for deleting the existing interview from database
    function cancelInterview(id, interview) {
      return axios.delete(`/api/appointments/${id}`).then(() =>
      { 
        const appointment = {
        ...state.appointments[id],
        interview: null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      spotsRemaining(id, "delete")
      setState({
        ...state,
        appointments })}
      )
    }
    //This function identify the remaning spots, if a new interview is added, the remaning spots is decreased by 1. If an interview is canceled, the remaning spots is increased by 1.
    function spotsRemaining (id, type) {
      return state.days.map( (day) => {
        if(day.appointments.includes(id) ){
          if(type === "save"){
            day.spots--;
          } else if (type === "delete"){
            day.spots++;
          }
        }
      }) 
    }
    return { state, setDay, bookInterview, cancelInterview};
  }
  export default useApplicationData;