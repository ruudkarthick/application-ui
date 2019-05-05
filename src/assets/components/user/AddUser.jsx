import React, { Component } from 'react';
import './User.css';
import { Button, Form, FormGroup, Label, Input, Col, Alert } from 'reactstrap';
import classnames from 'classnames';

class AddUser extends Component {

    constructor(props) {
        super(props);
        let currentUser = props.currentUser || {}
        const labels = {
            'addUser': 'Add User',
            'editUser': 'Update User'
        };
        this.state = {
            id: currentUser.id || null,
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            employeeID: currentUser.employeeID || '',
            addUserResponse: props.addUserResponse || {},
            userAction: props.userAction || 'addUser',
            labels: labels
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("Next set of props")
        console.log(nextProps)
        if (nextProps.addUserResponse && nextProps.addUserResponse.status == "success") {
            // Show success message?
            this.reset();
        }

        if (nextProps.addUserResponse && nextProps.addUserResponse.status == "failure") {
            // Show failure message
        }
        let currentUser = nextProps.currentUser || {}
        this.setState({
            id: currentUser.id || null,
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            employeeID: currentUser.employeeID || '',
            userAction: nextProps.userAction || 'addUser',
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
                    <FormGroup row>
                        <Label for="firstName" sm={2}>First Name:</Label>
                        <Col sm={10}>
                            <Input type="text" value={this.state.firstName} invalid={this.state.firstNameInvalid} onChange={e => this.handleChange("firstName", e)} onFocus={e => this.focus("firstName", e)}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="lastName" sm={2}>Last Name:</Label>
                        <Col sm={10}>
                            <Input type="text" value={this.state.lastName} invalid={this.state.lastNameInvalid} onChange={e => this.handleChange("lastName", e)} onFocus={e => this.focus("lastName", e)}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="employeeID" sm={2}>Employee ID:</Label>
                        <Col sm={6}>
                            <Input type="text" value={this.state.employeeID} invalid={this.state.employeeIDInvalid}  onChange={e => this.handleChange("employeeID", e)} onFocus={e => this.focus("employeeID", e)} />
                        </Col>
                    </FormGroup>

                    <FormGroup check row>
                        <Col sm={{ size: 10, offset: 6 }}>
                            <Button onClick={e => this.addOrEditUser(e, this.state.userAction)}>{this.state.labels[this.state.userAction]}</Button>
                            <Button className="secondary" onClick={e => this.reset(e)}>Reset</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }

    focus(name, e){
        console.log(name);
        const prop = name+"Invalid"
        this.setState({
            [prop]: false
        })
    }

    addOrEditUser(e, action) {
        // validate user
        if (this.validateForm()) {
            return;
        }
        const user = {
            id: this.state.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            employeeID: this.state.employeeID
        };
        console.log(user);
        this.props.addOrEditUser(action, user);
    }

    validateForm() {
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;
        const employeeID = this.state.employeeID;
        let formError = false;
        if (!firstName || !lastName || !employeeID) {
            formError = true;
        }
        this.setState({
            formError: formError,
            firstNameInvalid: firstName ? false : true,
            lastNameInvalid: lastName ? false : true,
            employeeIDInvalid: employeeID ? false : true
        })
        return formError;
    }

    reset(e) {
        this.setState({
            formError: false,
            id: null,
            firstName: '',
            lastName: '',
            employeeID: '',
            firstNameInvalid: false,
            lastNameInvalid: false,
            employeeIDInvalid: false
        })
    }

    handleChange(name, e) {
        const value = e.target.value
        this.setState({
            [name]: value
        });
    }

}

export default AddUser;
