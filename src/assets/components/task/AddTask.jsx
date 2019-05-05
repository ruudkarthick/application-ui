import React, { Component } from 'react';
import './Task.css';
import {
    Button, Form, FormGroup, Label, Input, Col,
    Modal, ModalHeader, ModalBody, Row, ModalFooter,Spinner, Alert,
    ListGroup, ListGroupItem
} from 'reactstrap';
import request from 'request';
import { format, addDays, differenceInCalendarDays } from 'date-fns';

class AddTask extends Component {

    constructor(props) {
        super(props);
        const currentDate = format(new Date(), 'YYYY-MM-DD');
        const nextDate = format(addDays(new Date(), 1), 'YYYY-MM-DD');
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
            formError: false,
            parentTask: {},
            labels: labels,
            currentDate: currentDate,
            nextDate: nextDate,
            showLoadingModal: false,
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
                projectId: currentTask.projectId,
                taskName: currentTask.task,
                priority: currentTask.priority,
                isParentTask: currentTask.isParentTask,
                parentTask: currentTask.parentTask,
                startDate: currentTask.startDate || '',
                endDate: currentTask.endDate || '',
                user: { 'firstName': currentTask.userName }
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
                    {this.state.formError &&
                        <FormGroup row>
                            <Col sm={12}><Alert color="danger">All Fields are required!</Alert></Col>
                        </FormGroup>
                    }
                    {this.state.endDateValidationError &&
                        <FormGroup row>
                            <Col sm={12}><Alert color="danger">End date cannot be earlier or same as start date</Alert></Col>
                        </FormGroup>
                    }
                    <FormGroup row>
                        <Label for="projectName" sm={3}>Project:</Label>
                        <Col sm={6}>
                            <Input type="text" value={this.state.projectName} disabled invalid={this.state.projectNameInvalid} />
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
                            <Input type="text" value={this.state.taskName} onFocus={e => this.focus("taskName", e)}
                                invalid={this.state.taskNameInvalid} onChange={e => this.handleChange("taskName", e)} />
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

                            <Input type="range" min="1" max="30" invalid={this.state.priorityInvalid}
                                value={this.state.priority} class="slider"
                                onFocus={e => this.focus("priority", e)}
                                onChange={(e) => this.onPriorityChange(e)} />
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
                                disabled={this.state.isParentTask}
                                invalid={this.state.startDateInvalid}
                                min={this.state.currentDate}
                                value={this.state.startDate}
                                onFocus={e => this.focus("startDate", e)}
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
                                disabled={this.state.isParentTask}
                                invalid={this.state.endDateInvalid}
                                min={this.state.nextDate}
                                value={this.state.endDate}
                                onFocus={e => this.focus("endDate", e)}
                                onChange={e => this.handleChange("endDate", e)}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="user" sm={3}>User:</Label>
                        <Col sm={6}>
                            <Input type="text" value={this.state.user.firstName} invalid={this.state.userIdInvalid} disabled />
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
                <Modal isOpen={this.state.showLoadingModal}>
                    <ModalBody>
                        <Row>
                            <Spinner color="dark" />
                        </Row>
                        <Row>
                            <p>Saving user action. Please wait...</p>
                        </Row>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

    focus(name) {
        const prop = name + "Invalid"
        this.setState({
            [prop]: false
        });
        if (name == 'endDate') {
            this.setState({
                endDateValidationError: false
            });
        }
    }

    parentTaskSelector() {
        const prevState = this.state.isParentTask;
        this.setState(({
            isParentTask: !prevState
        }));
        const currentDate = this.state.currentDate;
        const nextDate = this.state.nextDate;
        if (prevState) {
            this.setState(({
                startDate: currentDate,
                endDate: nextDate
            }));
        }
    }

    assignUser(user) {
        this.setState(prevState => ({
            user: user,
            userModal: !prevState.userModal,
            userIdInvalid: false
        }));
    }

    assignProject(project) {
        this.setState(prevState => ({
            projectId: project.id,
            projectName: project.projectName,
            projectModal: !prevState.projectModal,
            projectNameInvalid: false
        }));
    }

    assignTask(task) {
        this.setState(prevState => ({
            parentTask: task,
            parentTaskId: task.id,
            parentTaskName: task.parentTask,
            taskModal: !prevState.taskModal,
            taskNameInvalid: false
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

    onPriorityChange(e) {
        this.setState({
            priority: e.target.value
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
            formError: false,
            user: {
                firstName: ''
            },
            parentTaskName: '',
            projectIdInvalid: false,
            taskNameInvalid: false,
            priorityInvalid: false,
            formError: false,
            endDateValidationError: false,
            startDateInvalid: false,
            endDateInvalid: false,
            userIdInvalid: false
        })
    }

    addOrEditTask(e, userAction) {
        console.log(e);
        console.log(userAction)

        if (this.validateForm()) {
            return;
        }

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
            task.id = null; // Will get added in server side
            task.status = "New";
        }
        if (task.isParentTask) {
            task.parentId = null; // Will get added in server side
        }

        var dis = this;
        this.setState({
            showLoadingModal: true
        });
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
                    userAction: 'addTask',
                    showLoadingModal: false
                });
                dis.props.addOrEditTask(userAction, body);
            }
        );

        // TODO - validation
        console.log(task);
        this.reset();
    }

    validateForm() {
        let formError = false;
        const projectId = this.state.projectId;
        const taskName = this.state.taskName;
        const priority = this.state.priority;
        const isParentTask = this.state.isParentTask;
        const parentTaskId = this.state.parentTaskId;
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;
        const userId = this.state.user.id
        if (!projectId || !taskName || !priority) {
            formError = true;
            this.setState({
                formError: formError,
                projectIdInvalid: projectId ? false : true,
                taskNameInvalid: taskName ? false : true,
                priorityInvalid: priority ? false : true
            });
        }
        if (!isParentTask) {
            if (!startDate || !endDate || !userId) {
                formError = true;
                this.setState({
                    formError: formError,
                    startDateInvalid: startDate ? false : true,
                    endDateInvalid: endDate ? false : true,
                    userIdInvalid: userId ? false : true
                });
            } else if (startDate && endDate) {
                if (differenceInCalendarDays(endDate, startDate) < 1) {
                    formError = true;
                    this.setState({
                        endDateValidationError: true
                    });
                }
            }
        }
        return formError;
    }

    handleChange(name, e) {
        this.setState({
            [name]: e.target.value
        });
    }

}

export default AddTask;
