//helper function to get appointment for a specific(chosen) day
function getAppointmentsForDay (state, day) {
  if (state.days.length === 0) {
    return [];
  } else {
    const filteredDays = state.days.filter(item =>  item.name === day)
    if (filteredDays.length === 0) {
      return [];
    }
    const list = filteredDays[0].appointments
    const filteredAppointment = list.map( (el) => {
      return (state.appointments[el] ? state.appointments[el] : []) 
    });
    return filteredAppointment;
  } 
};
//helper function to get the interview
function getInterview (state, interview) {
  return (
    interview && {
      ...interview,
      interviewer: state.interviewers[interview.interviewer]
    });
};
//helper function to get the interviewers for a specific(chosen) day
function getInterviewersForDay (state, day) {
  const found = state.days.find(d => day === d.name);
  if (state.days.length === 0 || found === undefined) return [];
  return found.interviewers.map(id => state.interviewers[id]);
};

export { getInterview, getAppointmentsForDay, getInterviewersForDay }