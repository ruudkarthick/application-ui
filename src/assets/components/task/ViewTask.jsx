import React, { Component } from 'react';
import TaskList from './TaskList';
import './Task.css';
import request from 'request';

class ViewTask extends Component {

  constructor(props) { 
    super(props);
    this.state = {
      taskList: props.taskList || []
    }
  }

  render() {
    return (
      <div className="user-section">
        <div className="divider"></div>
        <TaskList taskList={this.state.taskList} editTask={(task) => this.editTask(task)}/>
      </div>
    );
  }

  editTask(task) {
    this.setState({
      currentTask: task,
      userAction: 'editTask'
    });
  }


}

export default ViewTask;
