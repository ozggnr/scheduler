import React from "react";
import classNames from 'classnames';
import "components/DayListItem.scss";

export default function DayListItem(props) {
  
  const dayClass = classNames({
    'day-list__item': true,
    'day-list__item--selected': props.selected,
    'day-list__item--full': !props.spots
  });
  
  function spotCorrector(props){
    if (props.spots === 1){
      return '1 spot remaining'
    }
    else if (props.spots === 0){
      return 'no spots remaining'
    }
    else {
      return `${props.spots} spots remaining`
    }
  }

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <div>{props.name}</div>
      <div>{spotCorrector(props)}</div>
    </li>
  );
}