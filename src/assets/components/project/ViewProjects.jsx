import React, { Component } from 'react';
import './Project.css';
import {
    Button, Row, ButtonGroup, Label, Input, Col,Badge,
    ListGroup, ListGroupItem
} from 'reactstrap';
import 'react-rangeslider/lib/index.css';

class ViewProjects extends Component {

    constructor(props) {
        super(props);
        const labels = {
            'addProject': 'Add',
            'updateProject': 'Update'
        };
        this.state = {
            projectsList: props.projectsList || [],
            searchText: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        const projectDetails = nextProps.projectsList;
        if (projectDetails) {
            this.setState({
                projectsList: projectDetails
            });
        }
    }

    render() {
        let projectsList = this.state.projectsList;
        const searchText = this.state.searchText;
        const sortBy = this.state.sortBy;
        if (searchText) {
            projectsList = projectsList.filter(project => {
                if (project.projectName.indexOf(searchText) > -1 || project.managerName.indexOf(searchText) > -1) {
                    return project;
                }
            });
        }
        if (sortBy) {
            if (sortBy === 'priority') {
                projectsList = projectsList.sort((projectA, projectB) => projectA[sortBy] - projectB[sortBy] )
            } else {
                projectsList = projectsList.sort((projectA, projectB) => projectA[sortBy].localeCompare(projectB[sortBy]));
            }

        }
        return (
            <div className="projects-list-section">
                <div className="sort-filter-section">
                    <Row>
                       <Col xs="3"> <Input type="text" placeholder="Search..." value={this.state.searchText} onChange={e => this.handleChange("searchText", e)} />
                        </Col>
                        <Col xs="1">   <Label> Sort: </Label> </Col>
                        <Col xs="2">
                            <Button onClick={e => this.sortList("startDate")}>Start Date</Button>{' '}</Col>
                        <Col xs="2">
                            <Button onClick={e => this.sortList("endDate")}>End Date</Button>{' '}</Col>
                        <Col xs="2">
                            <Button onClick={e => this.sortList("priority")}>Priority</Button>{' '}</Col>
                        <Col xs="2">
                            <Button onClick={e => this.sortList("status")}>Completed</Button>{' '}
                        </Col>
                    </Row>
                </div>
                <div className="viewprojects-section">
                    <ListGroup>
                        {projectsList && projectsList.length > 0 ?
                            projectsList.map(
                                project => {
                                    return this.createProjectSection(project);
                                })
                            : <ListGroupItem disabled>Please add projects</ListGroupItem>}
                    </ListGroup>
                </div>
            </div>
        );
    }

    createProjectSection(project) {
        const section = (
            <div className="list-item">
                <Row>
                    <Col xs="3"><ListGroup>
                        <ListGroupItem><strong>Project:</strong> {project.projectName}</ListGroupItem>
                        <ListGroupItem><strong>No of Tasks: </strong>{project.tasksCount || 0}</ListGroupItem>
                        <ListGroupItem><strong>Completed: </strong>{project.status || 'Not Completed'}</ListGroupItem>
                    </ListGroup>
                    </Col>
                    <Col xs="3"><ListGroup>
                        <ListGroupItem><strong>Start Date:</strong> {project.startDate}</ListGroupItem>
                        <ListGroupItem><strong>Completed:</strong> {project.endDate}</ListGroupItem>
                    </ListGroup>
                    </Col>
                    <Col xs="3"> <ListGroup><ListGroupItem> <Badge color="primary">Priority: {project.priority}</Badge></ListGroupItem>
                    </ListGroup></Col>
                    <Col xs="3"> <ListGroup><ListGroupItem> <Button onClick={e => this.updateProject(project)}>Update</Button></ListGroupItem>
                        <ListGroupItem> <Button className="secondary" onClick={e => this.suspendProject(project)}>Suspend</Button></ListGroupItem>
                    </ListGroup></Col>
                </Row>
            </div>
        );
        return section;
    }

    sortList(sortyBy) {
        this.setState({
            sortBy: sortyBy
        })
    }

    handleChange(name, e) {
        this.setState({
            [name]: e.target.value
        });
    }

    updateProject(project) {
        console.log(project);
        this.props.updateProject(project);
    }

    suspendProject(project) {
        console.log(project);
    }

}

export default ViewProjects;
