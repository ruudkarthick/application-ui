import React, { Component } from 'react';
import TaskList from './TaskList';
import './Task.css';

class ViewTask extends Component {

  constructor(props) { 
    super(props);
    this.state = {
      taskList: props.taskList || [],
      projectsList: props.projectsList || []
    }
  }

  componentWillReceiveProps(props) {
    console.log("Next set of props")
    console.log(props)

    this.setState({
        taskList: props.taskList,
        projectsList: props.projectsList
    });
}

  render() {
    return (
      <div className="user-section">
        <div className="divider"></div>
        <TaskList taskList={this.state.taskList} projectsList={this.state.projectsList} editTask={(userAction, task) => this.editTask(userAction, task)}/>
      </div>
    );
  }

  editTask(userAction, task) {
    this.props.editTask(userAction, task);
  }


}

export default ViewTask;
