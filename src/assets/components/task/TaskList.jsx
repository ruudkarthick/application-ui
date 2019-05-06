import React, { Component } from 'react';
import './Task.css';
import { ListGroup, ListGroupItem, Button, Row, Col, ButtonGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import _sortBy from 'lodash/sortBy';

class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            taskList: props.taskList || [],
            projectsList: props.projectsList || [],
            sortBy: '',
            searchText: '',
            projectModal: false,
            projectName: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            taskList: nextProps.taskList || [],
            projectsList: nextProps.projectsList,
            sortBy: ''
        });
    }

    render() {
        let taskList = this.state.taskList;
        const sortBy = this.state.sortBy;
        const projectName = this.state.projectName;
        if (sortBy) {
            taskList = _sortBy(taskList, sortBy)
        }
        if (projectName) {
            taskList = taskList.filter(task => {
                if (task.projectName && task.projectName.indexOf(projectName) > -1) {
                    return task;
                }
            });
        }


        return (
            <div className="list-section">
                <div className="list-filter">
                    <Row>
                        <Col xs="1"><Label> Project: </Label> </Col>
                        <Col sm={3}>
                            <Input type="text" value={this.state.projectName} disabled />
                        </Col>
                        <Col sm={1}>
                            <Button onClick={e => this.toggleProjectModal(e)}>Search</Button>
                            <Modal id='projectModal' isOpen={this.state.projectModal} toggle={() => this.toggleProjectModal()} className={this.props.className}>
                                <ModalHeader toggle={() => this.toggleProjectModal()}>Select Project</ModalHeader>
                                <ModalBody>
                                    <ListGroup>
                                        {this.state.projectsList && this.state.projectsList.length > 0 ?
                                            this.state.projectsList.map(
                                                project => {
                                                    return (
                                                        <ListGroupItem tag="button" action onClick={() => this.assignProject(project.projectName)}>{project.projectName}</ListGroupItem>
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
                        <Col xs="2">   <Label> Sort task by: </Label> </Col>
                        <Col xs="5">   <ButtonGroup>
                            <Button onClick={e => this.sortList("startDate")}>Start Date</Button>
                            <Button onClick={e => this.sortList("endDate")}>End Date</Button>
                            <Button onClick={e => this.sortList("priority")}>Priority</Button>
                            <Button onClick={e => this.sortList("status")}>Completed</Button>
                        </ButtonGroup></Col>
                    </Row>
                </div>
                <div className="list-view">
                    {taskList.map((task) => {
                        return this.taskEntry(task)
                    })}
                </div>
            </div>
        );
    }

    wildCardSearch(searchText) {
        this.setState({
            searchText: searchText
        });
    }

    handleChange(name, e) {
        this.setState({
            [name]: e.target.value
        });
    }

    sortList(sortyBy) {
        this.setState({
            sortBy: sortyBy
        })
    }

    taskEntry(task) {
        const section = (
            <div className="list-item">
            <Row>
            <Col xs="2">
                        <span>Task</span>
                    </Col>
                    <Col xs="2">
                        <span>Parent</span>
                    </Col>
                    <Col xs="1">
                        <span>Priority</span>
                    </Col>
                    <Col xs="2">
                        <span>Start</span>
                    </Col>
                    <Col xs="2">
                        <span>End</span>
                    </Col>
            </Row>
                <Row>

                    <Col xs="2"><ListGroup>
                        <ListGroupItem disabled tag="a" href="#">{task.task}</ListGroupItem>
                    </ListGroup>
                    </Col>
                    <Col xs="2"><ListGroup>
                    <ListGroupItem tag="a" href="#">{task.parentTask}</ListGroupItem>
                    </ListGroup>
                    </Col>
                    <Col xs="1">
                        <span>{task.priority}</span>
                    </Col>
                    <Col xs="2">
                        <span>{task.startDate}</span>
                    </Col>
                    <Col xs="2">
                        <span>{task.endDate}</span>
                    </Col>
                    <Col xs="1"> <Button onClick={e => this.editTask("editTask", task)}>Edit</Button></Col>
                    <Col xs="2"> <Button className="secondary" onClick={e => this.editTask("endTask", task)}>End Task</Button></Col>
                </Row>
            </div>
        );
        return section;
    }

    editTask(userAction, task) {
        this.props.editTask(userAction, task);
    }

    toggleProjectModal() {
        this.setState(prevState => ({
            projectModal: !prevState.projectModal
        }));
    }

    assignProject(projectName) {
        this.setState(prevState => ({
            projectName: projectName,
            projectModal: !prevState.projectModal
        }));
    }
}

export default TaskList;