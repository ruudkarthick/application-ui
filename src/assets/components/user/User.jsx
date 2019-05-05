import React, { Component } from 'react';
import AddUser from './AddUser';
import UserList from './UserList';
import './User.css';
import request from 'request';
import {
  Row,
  Modal, ModalBody, Spinner
} from 'reactstrap';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userList: props.userList,
      addUserResponse: {},
      currentUser: {},
      userAction: '',
      showLoadingModal: false
    }
  }

  componentWillReceiveProps(props) {
    if (props.userList) {
      this.setState({
        userList: props.userList
      })
    }
  }

  render() {
    return (
      <div className="user-section">
        <AddUser addOrEditUser={(action, user) => this.addOrEditUser(action, user)} addUserResponse={this.state.addUserResponse}
          currentUser={this.state.currentUser} userAction={this.state.userAction} />

        <div className="divider"></div>

        <UserList userList={this.state.userList} editUser={(user) => this.editUser(user)} deleteUser={(user) => this.deleteUser(user)} />

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

  addOrEditUser(action, user) {
    console.log("From parent, action = " + action);
    console.log(user);
    // let userListUpdated = this.state.userList;
    // if (action === 'addUser') {
    //   userListUpdated.push(user)
    // } else if (action === 'editUser') {
    //   userListUpdated.map(userToUpdate => {
    //     if (user.id === userToUpdate.id) {
    //       userToUpdate.employeeID = user.employeeID;
    //       userToUpdate.firstName = user.firstName;
    //       userToUpdate.lastName = user.lastName;
    //     }
    //   });
    // }
    this.setState({
      showLoadingModal: true
    });
    var dis = this;
    request.post(
      {
        url: 'http://localhost:3000/spi/users/addUpdate',
        json: user
      },
      function (err, httpResponse, body) {
        console.log(body);
        dis.setState({
          userList: body,
          showLoadingModal: false,
          addUserResponse: {
            status: 'success'
          },
          currentUser: {},
          userAction: 'addUser'
        });
        dis.props.addOrEditUser(body);
      }
    );

  }

  editUser(user) {
    this.setState({
      currentUser: user,
      userAction: 'editUser'
    });
  }

  deleteUser(userToDelete) {
    var dis = this;
    request.post(
      {
        url: 'http://localhost:3000/spi/users/deleteUser',
        json: userToDelete
      },
      function (err, httpResponse, body) {
        console.log(body);
        dis.setState({
          userList: body,
          showLoadingModal: false,
          addUserResponse: {
            status: 'success'
          },
          currentUser: {},
          userAction: 'deleteUser'
        });
        dis.props.addOrEditUser(body);
      }
    );
  }

}

export default User;
