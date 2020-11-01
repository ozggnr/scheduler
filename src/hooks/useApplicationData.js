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
      spotsRemaining(id, "save")
     
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
      spotsRemaining(id, "delete")
      setState({
        ...state,
        appointments })}
       
      )
    }
    function spotsRemaining (id, type) {
      return state.days.map((day) => {
        if(day.appointments.includes(id) ){
          // console.log("yes!", day.spots)
          if(type === "save"){
            day.spots--;
          } else if (type === "delete"){
            day.spots++;
          }
        }
      }) 
      
      // console.log("appointment id", id)
      // console.log("spots", state.days)
      // return setState({...state,days});
    }
    return { state, setDay, bookInterview, cancelInterview};
  }
  export default useApplicationData;