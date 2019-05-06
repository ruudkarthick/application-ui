import React, { Component } from 'react';
import './User.css';
import { ListGroup, ListGroupItem, Button, Row, Col, ButtonGroup, Input, Form, Label } from 'reactstrap';

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: props.userList || [],
            sortBy: '',
            searchText: '',
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            userList: nextProps.userList || [],
            sortBy: ''
        });
    }

    render() {
        let userList = this.state.userList;
        const sortBy = this.state.sortBy;
        const searchText = this.state.searchText;
        if (sortBy) {
            userList = userList.sort((userA, userB) => userA[sortBy].localeCompare(userB[sortBy]))
        }
        if (searchText) {
            userList = userList.filter(user => {
                if (user.employeeID.indexOf(searchText) > -1 || user.firstName.indexOf(searchText) > -1 || user.lastName.indexOf(searchText) > -1) {
                    return user;
                }
            });
        }

        return (
            <div className="list-section">
                <div className="list-filter">
                    <Row>
                        <Col xs="3"><Input type="text" placeholder="Search..." value={this.state.searchText} onChange={e => this.handleChange("searchText", e)} /></Col>
                        <Col xs="2">   <Label> Sort: </Label> </Col>
                        <Col xs="7">   <ButtonGroup>
                            <Button onClick={e => this.sortList("firstName")}>First Name</Button>
                            <Button onClick={e => this.sortList("lastName")}>Last Name</Button>
                            <Button onClick={e => this.sortList("employeeID")}>ID</Button>
                        </ButtonGroup></Col>
                    </Row>
                </div>
                <div className="list-view">
                    {userList.map((user) => {
                        return this.userEntry(user)
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

    userEntry(user) {
        const section = (
            <div className="list-item">
                <Row>
                    <Col xs="6"><ListGroup>
                        <ListGroupItem>{user.firstName}</ListGroupItem>
                        <ListGroupItem>{user.lastName}</ListGroupItem>
                        <ListGroupItem>{user.employeeID}</ListGroupItem>
                    </ListGroup>
                    </Col>
                    <Col xs="6"> <ListGroup><ListGroupItem> <Button onClick={e => this.editUser(user)}>Edit</Button></ListGroupItem>
                        <ListGroupItem> <Button className="secondary" onClick={e => this.deleteUser(user)}>Delete</Button></ListGroupItem>
                    </ListGroup></Col>
                </Row>
            </div>
        );
        return section;
    }

    editUser(user) {
        this.props.editUser(user);
    }

    deleteUser(user) {
        // Show confirmation overlay??
        this.props.deleteUser(user);
    }
}

export default UserList;
