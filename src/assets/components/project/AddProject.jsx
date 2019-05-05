import React, { Component } from 'react';
import './Project.css';
import {
    Button, Form, FormGroup, Label, Input, Col,
    Modal, ModalHeader, ModalBody, ModalFooter,
    ListGroup, ListGroupItem, Alert
} from 'reactstrap';
import { format, addDays, differenceInCalendarDays } from 'date-fns';

class AddProject extends Component {

    constructor(props) {
        super(props);
        const labels = {
            'addProject': 'Add',
            'updateProject': 'Update'
        };
        const currentDate = format(new Date(), 'YYYY-MM-DD');
        const nextDate = format(addDays(new Date(), 1), 'YYYY-MM-DD');
        const projectDetails = props.currentProject || {};
        this.state = {
            id: projectDetails.id || '',
            projectName: projectDetails.projectName || '',
            priority: projectDetails.priority || 0,
            managerName: projectDetails.managerName || '',
            managerId: projectDetails.managerId || '',
            userAction: props.userAction || 'addProject',
            labels: labels,
            modal: false,
            userList: props.userList,
            selectDate: false,
            datePickerDisabled: true,
            startDate: '',
            currentDate: currentDate,
            nextDate: nextDate,
            endDate: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("Next set of props")
        console.log(nextProps)
        const projectDetails = nextProps.currentProject;
        if (projectDetails) {
            const startDate = projectDetails.startDate;
            const endDate = projectDetails.endDate;
            let selectDate = false
            if (startDate && startDate) {
                selectDate = true;
            }
            this.setState({
                userList: nextProps.userList,
                id: projectDetails.id || '',
                projectName: projectDetails.projectName || '',
                priority: projectDetails.priority || 0,
                managerName: projectDetails.managerName || '',
                startDate: startDate || '',
                endDate: endDate || '',
                selectDate: selectDate,
                datePickerDisabled: !selectDate,
                managerId: projectDetails.managerId || '',
                userAction: nextProps.userAction || 'addProject',
            });
        }
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
                            <Col sm={12}><Alert color="danger">End date cannot be earlier than start date</Alert></Col>
                        </FormGroup>
                    }

                    <FormGroup row>
                        <Label for="firstName" sm={2}>Project:</Label>
                        <Col sm={10}>
                            <Input type="text" value={this.state.projectName} invalid={this.state.projectNameInvalid}
                                onChange={e => this.handleChange("projectName", e)}
                                onFocus={e => this.focus("projectName", e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="startEnd" sm={2}></Label>
                        <Col sm={2}>
                            <Label check>
                                <Input type="checkbox" id="checkbox" checked={this.state.selectDate} onChange={e => this.selectDate(e)} />{' '}
                                Set Start and End Date
                            </Label>
                        </Col>
                        <Col sm={4}>
                            <Input
                                type="date"
                                name="startDate"
                                id="startDate"
                                placeholder="Start Date"
                                invalid={this.state.startDateInvalid}
                                disabled={this.state.datePickerDisabled}
                                value={this.state.startDate}
                                min={this.state.currentDate}
                                onFocus={e => this.focus("startDate", e)}
                                onChange={e => this.handleChange("startDate", e)}
                            />
                        </Col>
                        <Col sm={4}>
                            <Input
                                type="date"
                                name="endDate"
                                id="endDate"
                                placeholder="End Date"
                                invalid={this.state.endDateInvalid}
                                disabled={this.state.datePickerDisabled}
                                value={this.state.endDate}
                                onFocus={e => this.focus("endDate", e)}
                                onChange={e => this.handleChange("endDate", e)}
                            />
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
                        <Label for="manager" sm={2}>Manager:</Label>
                        <Col sm={6}>
                            <Input type="text" invalid={this.state.managerNameInvalid}
                                onFocus={e => this.focus("managerName", e)}
                                disabled value={this.state.managerName} />
                        </Col>
                        <Col sm={4}>
                            <Button onClick={e => this.searchUser(e)}>Search</Button>
                            <Modal isOpen={this.state.modal} toggle={() => this.toggle()} className={this.props.className}>
                                <ModalHeader toggle={() => this.toggle()}>Select User</ModalHeader>
                                <ModalBody>
                                    <ListGroup>
                                        {this.state.userList && this.state.userList.length > 0 ?
                                            this.state.userList.map(
                                                user => {
                                                    return (
                                                        <ListGroupItem tag="button" action onClick={() => this.assignUser(user)}>{user.firstName + ' ' + user.lastName}</ListGroupItem>
                                                    );
                                                })
                                            : <ListGroupItem disabled>Please add users to add/update projects</ListGroupItem>}
                                    </ListGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={() => this.toggle()}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </FormGroup>

                    <FormGroup check row>
                        <Col sm={{ size: 12, offset: 9 }}>
                            <Button onClick={e => this.addOrEditProject(e, this.state.userAction)}>{this.state.labels[this.state.userAction]}</Button>{' '}
                            <Button className="secondary" onClick={e => this.reset(e)}>Reset</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }

    focus(name, e) {
        console.log(name);
        const prop = name + "Invalid"
        this.setState({
            [prop]: false
        })
        if(name == 'endDate'){
            this.setState({
                endDateValidationError: false
            });
        }
    }

    selectDate() {
        const prevState = this.state.selectDate;
        const currentDate = this.state.currentDate;
        const nextDate = this.state.nextDate;
        this.setState(({
            selectDate: !prevState,
            datePickerDisabled: prevState,
            startDateInvalid: false,
            endDateInvalid: false
        }));

        if (prevState) {
            this.setState({
                startDate: '',
                endDate: ''
            });
        } else {
            this.setState(({
                startDate: currentDate,
                endDate: nextDate
            }));
        }
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    assignUser(user) {
        console.log(user)
        this.setState(prevState => ({
            managerName: user.firstName + ' ' + user.lastName,
            managerId: user.id,
            modal: !prevState.modal,
            managerNameInvalid: false
        }));
    }

    onPriorityChange(e) {
        this.setState({
            priority: e.target.value
        });
    }

    searchUser(e) {
        this.toggle();
        console.log(e);
    }

    reset(e) {
        this.setState({
            projectName: '',
            priority: 0,
            managerName: '',
            managerId: '',
            selectDate: false,
            datePickerDisabled: true,
            startDate: '',
            endDate: '',
            id: '',
            userAction: 'addProject',
            formError: false,
            projectNameError: false,
            priorityError: false,
            managerNameError: false,
            startDateError: false,
            endDateError: false,
            endDateValidationError: false
        })
    }

    validateForm() {
        const projectName = this.state.projectName;
        const priority = this.state.priority;
        const managerName = this.state.managerName;
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;
        const selectDate = this.state.selectDate;

        const employeeID = this.state.employeeID;
        let formError = false;
        if (!projectName || !priority || !managerName) {
            formError = true;
            this.setState({
                formError: formError,
                priorityInvalid: priority ? false : true,
                projectNameInvalid: projectName ? false : true,
                managerNameInvalid: managerName ? false : true
            })
        }
        if (selectDate) {
            if (!startDate || !endDate) {
                formError = true;
                this.setState({
                    formError: formError,
                    startDateInvalid: startDate ? false : true,
                    endDateInvalid: endDate ? false : true
                })
            }else if (startDate && endDate) {
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

    addOrEditProject(e, userAction) {
        console.log(e);
        console.log(userAction)
        if (this.validateForm()) {
            return;
        }
        const projectDetails = {
            projectName: this.state.projectName,
            priority: this.state.priority,
            managerName: this.state.managerName,
            managerId: this.state.managerId,
            startDate: this.state.startDate,
            endDate: this.state.endDate
        }
        if (userAction === 'addProject') {
            projectDetails.id = null;
            projectDetails.status = "New";
        }
        if (userAction === 'updateProject') {
            projectDetails.id = this.state.id;
        }

        // TODO - validation
        console.log(projectDetails);
        this.props.addProject(userAction, projectDetails);
        this.reset();
    }

    handleChange(name, e) {
        this.setState({
            [name]: e.target.value
        });
    }

}

export default AddProject;
