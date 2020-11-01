
function getAppointmentsForDay (state, day) {
 
  if (state.days.length === 0) {
    return [];
  } else {
      const filteredDays = state.days.filter(item =>  item.name === day)
      if( filteredDays.length === 0) {
        return [];
      }
      
      const list = filteredDays[0].appointments
    
      const filteredAppointment = list.map( (el) => {
        return (state.appointments[el] ? state.appointments[el] : []) 
    
    })
    return filteredAppointment;
  } 
} ;

function getInterview (state, interview) {
  return (
    interview && {
      ...interview,
      interviewer: state.interviewers[interview.interviewer]
    }
  );
    
  //   if (interview) {
  //     console.log("interviewerID", interview.interviewer)
  //     console.log("interviewers", state.interviewers)
  //     interview["interviewer"] = state.interviewers[interview.interviewer]
  //   } else {
  //     return null;
  //   }
  // return interview;
}



function getInterviewersForDay (state, day) {
  const found = state.days.find(d => day === d.name);
  if (state.days.length === 0 || found === undefined) return [];
  return found.interviewers.map(id => state.interviewers[id]);
 
  // if (state.days.length === 0) {
  //   return [];
  // } else {
  //     const filteredDays = state.days.filter(item =>  item.name === day)
  //     if( filteredDays.length === 0) {
  //       return [];
  //     }
      
  //     const list = filteredDays[0].interviewers
  //     const filteredInterviewer = list.map( (el) => {
  //       return (state.interviewers[el] ? state.interviewers[el] : []) 
    
  //   })
  //   return filteredInterviewer;
  // } 
} ;
// console.log(getInterviewersForDay(state,"Monday"))
export { getInterview, getAppointmentsForDay, getInterviewersForDay }