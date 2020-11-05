import React from 'react';
import "components/Appointment/styles.scss";
import Header from 'components/Appointment/Header'
import Show from 'components/Appointment/Show'
import Empty from 'components/Appointment/Empty'
import Form from 'components/Appointment/Form'
import Confirm from 'components/Appointment/Confirm'
import Error from 'components/Appointment/Error'
import useVisualMode from 'hooks/useVisualMode';
import Status from './Status';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment (props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //This function is used for saving an interview with a student name and interviewer
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview, "add")
    .then(()=> transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));
  };
  //This function is used for deleting an interview 
  function deleteInterview (id) {
    transition(DELETING, true);
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true))
  };
  ////This function is used for editing the existing interview and save with a new student or interviewer
  function edit (name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview).then(() => transition(SHOW))
  };
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => { transition(CREATE)}} />}
      {mode === SHOW && props.interview && (<Show
                                            student={props.interview.student}
                                            interviewer={props.interview.interviewer.name}
                                            onDelete={() => transition(CONFIRM)}
                                            onEdit={() => transition(EDIT)}
      />
      )}
      
      {mode === CREATE && <Form  
                            name={props.student}
                            interviewers = {props.interviewers}
                            onCancel={back}
                            onSave={save}
                            />}
      {mode === SAVING &&  (
      <Status message ={"SAVING"} /> )}
      {mode === DELETING &&
      (<Status message ={"DELETING"} />) }
      
      {mode === CONFIRM && (
        <Confirm message="Are you sure you would like to delete?"
                onCancel={back}
                onConfirm={deleteInterview}
              />
      )}
      {mode === EDIT && (
        <Form name={props.interview.student}
              interviewer={props.interview.interviewer.id}
              interviewers={props.interviewers}
              onSave={edit}
              onCancel={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error message = "There is an error!"
                onClose={back} />
      )}
      {mode === ERROR_SAVE && (
        <Error message = "There is an error!"
                onClose={back} />
      )}
    </article>
  )
};
