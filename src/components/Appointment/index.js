import React from 'react';
import "components/Appointment/styles.scss";
import Header from 'components/Appointment/Header'
import Show from 'components/Appointment/Show'
import Empty from 'components/Appointment/Empty'
import Form from 'components/Appointment/Form'
import Confirm from 'components/Appointment/Confirm'
import useVisualMode from 'hooks/useVisualMode';
import Status from './Status';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointment (props) {
  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //------save------
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview).then(()=> transition(SHOW))
     
  }
  //---------delete--------
  function deleteInterview (id) {
    console.log(id)
    transition(DELETING);
    props.cancelInterview(props.id).then(() => transition(EMPTY))
    
  }
  function edit (name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview).then(() => transition(SHOW))
  }
  return (
    <div>
      <Header time={props.time}/>
      {mode === SHOW && props.interview && (<Show
                                            student={props.interview.student}
                                            interviewer={props.interview.interviewer.name}
                                            onDelete={() => transition(CONFIRM)}
                                            onEdit={() => transition(EDIT)}
      />
      )}
      {mode === EMPTY && <Empty onAdd={() => { transition(CREATE)}} />}
      {mode === CREATE && <Form  
                            student={props.student}
                            interviewers = {props.interviewers}
                            onCancel={back}
                            onSave={save}
                            />}
      {mode === SAVING &&  (
      <Status message ={SAVING} /> )}
      {mode === DELETING &&
      <Status message ={DELETING} /> }
      
      {mode === CONFIRM && (
        <Confirm message="Are you sure"
                onCancel={back}
                onConfirm={deleteInterview}
              />
      )}
      {mode === EDIT && (
        <Form student={props.student}
              interviewer={props.interview.interviewer.id}
              interviewers={props.interviewers}
              onSave={edit}
              onCancel={back} />
      )}
    </div>
  )
}
