import React, { Component } from 'react';
import './Task.css';
import {
    Button, Form, FormGroup, Label, Input, Col,
    Modal, ModalHeader, ModalBody, ModalFooter,
    ListGroup, ListGroupItem
} from 'reactstrap';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import request from 'request';

class AddTask extends Component {

    constructor(props) {
        super(props);
        const labels = {
            'addTask': 'Add Task',
            'editTask': 'Edit Task'
        };
        this.state = {
            taskList: props.taskList || [],
            projectsList: props.projectsList || [],
            userAction: props.userAction || 'addTask',
            userList: props.userList || [],
            parentTaskList: props.parentTaskList || [],
            projectName: '',
            priority: 0,
            currentTask: {},
            projectModal: false,
            userModal: false,
            taskModal: false,
            parentTask: {},
            labels: labels,
            user: {}
        }
    }

    componentWillReceiveProps(props) {
        console.log("Next set of props")
        console.log(props)
        let currentTask = props.currentTask;
        let additionalProps = {}
        if (currentTask) {
            additionalProps = {
                id: currentTask.id || '',
                projectName: currentTask.projectName || '',
                taskName: currentTask.task || '',
                priority: currentTask.priority,
                isParentTask: currentTask.isParentTask,
                parentTask: currentTask.parentTask,
                startDate: currentTask.startDate || '',
                endDate: currentTask.endDate || '',
                user: {'firstName':currentTask.userName}
            }
        }
        this.setState({
            userList: props.userList,
            taskList: props.taskList,
            projectsList: props.projectsList,
            parentTaskList: props.parentTaskList,
            userAction: props.userAction || 'addTask',
            ...additionalProps
        });

    }

    render() {
        return (
            <div className="form-section">
                <Form>
                    <FormGroup row>
                        <Label for="projectName" sm={3}>Project:</Label>
                        <Col sm={6}>
                            <Input type="text" value={this.state.projectName} disabled />
                        </Col>
                        <Col sm={3}>
                            <Button onClick={e => this.toggleProjectModal(e)}>Search</Button>
                            <Modal id='projectModal' isOpen={this.state.projectModal} toggle={() => this.toggleProjectModal()} className={this.props.className}>
                                <ModalHeader toggle={() => this.toggleProjectModal()}>Select Project</ModalHeader>
                                <ModalBody>
                                    <ListGroup>
                                        {this.state.projectsList && this.state.projectsList.length > 0 ?
                                            this.state.projectsList.map(
                                                project => {
                                                    return (
                                                        <ListGroupItem tag="button" action onClick={() => this.assignProject(project)}>{project.projectName}</ListGroupItem>
                                                    );
                                                })
                                            : <ListGroupItem disabled>Please add users to add/update projects</ListGroupItem>}
                                    </ListGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={() => this.toggleProjectModal()}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="startEnd" sm={3}>Task: </Label>
                        <Col sm={9}>
                            <Input type="text" value={this.state.taskName} onChange={e => this.handleChange("taskName", e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>

                        <Label for="startEnd" sm={3}>Is Parent Task: </Label>
                        <Col sm={9}>
                            <Label check>
                                <Input type="checkbox" checked={this.state.isParentTask} onChange={e => this.parentTaskSelector(e)} />{' '}
                                Parent Task
                            </Label>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="priority" sm={2}>Priority:</Label>
                        <Col sm={10}>
                        <Slider
                                value={this.state.priority}
                                onChange={(...args) => this.onPriorityChange(args)}
                                min={0}
                                max={30}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="parentTask" sm={3}>Parent Task:</Label>
                        <Col sm={6}>
                            <Input type="text" value={this.state.parentTaskName} disabled />
                        </Col>
                        <Col sm={3}>
                            <Button onClick={e => this.toggleTaskModal(e)}>Search</Button>
                            <Modal id='taskModal' isOpen={this.state.taskModal} toggle={() => this.toggleTaskModal()} className={this.props.className}>
                                <ModalHeader toggle={() => this.toggleTaskModal()}>Select Parent Task</ModalHeader>
                                <ModalBody>
                                    <ListGroup>
                                        {this.state.parentTaskList && this.state.parentTaskList.length > 0 ?
                                            this.state.parentTaskList.map(
                                                task => {
                                                        return (
                                                            <ListGroupItem tag="button" action onClick={() => this.assignTask(task)}>{task.parentTask}</ListGroupItem>
                                                        );
                                                    
                                                })
                                            : <ListGroupItem disabled>Please add Tasks</ListGroupItem>}
                                    </ListGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={() => this.toggleTaskModal()}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="startDate" sm={2}>Start Date:</Label>
                        <Col sm={4}>
                            <Input
                                type="date"
                                name="startDate"
                                id="startDate"
                                placeholder="Start Date"
                                disabled={!this.state.isParentTask}
                                value={this.state.startDate}
                                onChange={e => this.handleChange("startDate", e)}
                            />
                        </Col>
                        <Label for="endDate" sm={2}>End Date:</Label>
                        <Col sm={4}>
                            <Input
                                type="date"
                                name="endData"
                                id="endData"
                                placeholder="End Date"
                                disabled={!this.state.isParentTask}
                                value={this.state.endDate}
                                onChange={e => this.handleChange("endDate", e)}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="user" sm={3}>User:</Label>
                        <Col sm={6}>
                            <Input type="text" value={this.state.user.firstName} disabled />
                        </Col>
                        <Col sm={3}>
                            <Button onClick={e => this.toggleUserModal(e)}>Search</Button>
                            <Modal id='userModal' isOpen={this.state.userModal} toggle={() => this.toggleUserModal()} className={this.props.className}>
                                <ModalHeader toggle={() => this.toggleUserModal()}>Select User</ModalHeader>
                                <ModalBody>
                                    <ListGroup>
                                        {this.state.userList && this.state.userList.length > 0 ?
                                            this.state.userList.map(
                                                user => {
                                                    return (
                                                        <ListGroupItem tag="button" action onClick={() => this.assignUser(user)}>{user.firstName + ' ' + user.lastName}</ListGroupItem>
                                                    );
                                                })
                                            : <ListGroupItem disabled>Please add Tasks</ListGroupItem>}
                                    </ListGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={() => this.toggleUserModal()}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </FormGroup>
                    <FormGroup check row>
                        <Col sm={{ size: 12, offset: 9 }}>
                            <Button onClick={e => this.addOrEditTask(e, this.state.userAction)}>{this.state.labels[this.state.userAction]}</Button>{' '}
                            <Button className="secondary" onClick={e => this.reset(e)}>Reset</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }

    parentTaskSelector() {
        const prevState = this.state.isParentTask;
        this.setState(({
            isParentTask: !prevState
        }));
    }

    assignUser(user) {
        this.setState(prevState => ({
            user: user,
            userModal: !prevState.userModal
        }));
    }

    assignProject(project) {
        this.setState(prevState => ({
            projectId: project.id,
            projectName: project.projectName,
            projectModal: !prevState.projectModal
        }));
    }

    assignTask(task) {
        this.setState(prevState => ({
            parentTask: task,
            parentTaskId: task.id,
            parentTaskName: task.parentTask,
            taskModal: !prevState.taskModal
        }));
    }

    selectDate() {
        const prevState = this.state.selectDate
        this.setState(({
            selectDate: !prevState,
            datePickerDisabled: prevState
        }));

    }

    toggleTaskModal() {
        this.setState(prevState => ({
            taskModal: !prevState.taskModal
        }));
    }

    toggleProjectModal() {
        this.setState(prevState => ({
            projectModal: !prevState.projectModal
        }));
    }

    toggleUserModal() {
        this.setState(prevState => ({
            userModal: !prevState.userModal
        }));
    }

    onPriorityChange(args) {
        this.setState({
            priority: args[0]
        });
    }

    reset(e) {
        this.setState({
            projectName: '',
            taskName: '',
            priority: 0,
            isParentTask: false,
            parentTask: {},
            startDate: '',
            endDate: '',
            user: {}
        })
    }

    addOrEditTask(e, userAction) {
        console.log(e);
        console.log(userAction)
        const task = {
            projectId: this.state.projectId,
            task: this.state.taskName,
            priority: this.state.priority,
            isParentTask: this.state.isParentTask,
            parentId: this.state.parentTaskId,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            userId: this.state.user.id
        };
        if (userAction === 'addTask') {
            task.id = 'taskid-' + Math.random().toString(36).substr(2, 16);
            task.status = "New";
        }
        if (task.isParentTask){
            task.parentId = 'parenttaskid-' + Math.random().toString(36).substr(2, 16);
        }

        var dis = this;
        request.post(
          {
            url: 'http://localhost:3000/spi/task/addUpdate',
            json: task
          },
          function (err, httpResponse, body) {
            console.log(body);
            dis.setState({
              taskList: body,
              addUserResponse: {
                status: 'success'
              },
              currentUser: {},
              userAction: 'addTask'
            });
          }
        );

        // TODO - validation
        console.log(task);
        this.props.addOrEditTask(userAction, task);
        this.reset();
    }

    handleChange(name, e) {
        this.setState({
            [name]: e.target.value
        });
    }

}

export default AddTask;
