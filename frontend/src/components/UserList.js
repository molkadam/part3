import React, { Component } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Container,
  Alert,
  Col,
  Row,
} from "react-bootstrap";

import { getUsers, updateUser, deleteUser } from "../Services/UserServices";


class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      showDeleteModal: false,
      showEditModal: false,
      currentUser: null,
      editedName: "",
      editedEmail: "",
      editedId: "",
      errors: {},
      loggedin: JSON.parse(localStorage.getItem("loggdin")) || [],
      userId : sessionStorage.getItem("userId"),
      successMessage: "",
      errorMessage: "",
    };
  }

  
  

  loadUsers = async () => {
    try {
      const response = await getUsers();
      console.log(response); // Log the response object
      this.setState({ users: response });
    } catch (error) {
      console.error('Error fetching users:', error); // Log the error
      if (error.response) {
        console.log('Error response:', error.response); // Log the error response
      }
      this.handleError('Error fetching users. Please try again later.');
    }
  };
  componentDidMount() {
    this.loadUsers();
  }
  // Handle showing and hiding the Delete Modal
  handleShowDeleteModal = (user) => {
    this.setState({ showDeleteModal: true, currentUser: user });
  };

  handleCloseDeleteModal = () => {
    this.setState({ showDeleteModal: false, currentUser: null });
  };

  // Handle the actual deletion of a user
  handleDeleteUser = async () => {
    const { currentUser, users } = this.state;
    try {
      const response = await deleteUser(currentUser.id);
      if (response && response.data) {
        console.log(response.data);
      } else {
        console.error('Error deleting user:', response);
      }
      
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    const updatedUsers = await getUsers();
    this.setState({
      users: updatedUsers,
      showDeleteModal: false,
      currentUser: null,
    });
    // localStorage.setItem("users", JSON.stringify(updatedUsers));
    this.handleSuccess("deleted");
  };

  // Handle showing and hiding the Edit Modal
  handleShowEditModal = (user) => {
    this.setState({
      showEditModal: true,
      currentUser: user,
      editedName: user.name,
      editedEmail: user.email,
      editedId: user.id,
      errors: {},
    });
  };

  handleCloseEditModal = () => {
    this.setState({ showEditModal: false, currentUser: null, errors: {} });
  };

  // Validate the edited user
  validateEditUser = () => {
    const { editedName, editedEmail } = this.state;
    const errors = {};

    if (!editedName) {
      errors.editedName = "Name is required";
    }

    if (!editedEmail) {
      errors.editedEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editedEmail)) {
      errors.editedEmail = "Email is invalid";
    }

    return errors;
  };

  // Handle editing the user
  handleEditUser = async () => {
    const errors = this.validateEditUser();
    if (Object.keys(errors).length > 0) {
      console.log({ errors });
      this.setState({ errors });
      return;
    }

    const { currentUser, users, editedName, editedEmail } = this.state;

    const updatedData = {
      name: editedName,
      email: editedEmail,
    };
    try {
      const response = await updateUser(currentUser.id, updatedData);
      // console.log(response.data);
      const updatedUsers = await getUsers();
      this.setState({
        users: updatedUsers,
        showEditModal: false,
        currentUser: null,
      });
      this.handleSuccess("updated");
    } catch (error) {
      if (error.response && error.response.data) {
        errors.editedEmail = error.response.data.error;
      } else {
        console.error("Error:", error);
      }
      this.setState({ errors });
      return;
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSuccess = (operation) => {
    // Set a success message based on the operation
    this.setState({ successMessage: `User ${operation} successfully!` });
    // Hide the message after 3 seconds
    setTimeout(() => this.setState({ successMessage: "" }), 3000);
  };

  handleError = (operation) => {
    // Set a errror message based on the operation
    this.setState({ errorMessage: ` ${operation} ` });
    // Hide the message after 3 seconds
    setTimeout(() => this.setState({ errorMessage: "" }), 3000);
  };
  render() {
    const {
      users,
      showDeleteModal,
      showEditModal,
      editedName,
      editedEmail,
      editedId,
      errors,
      loggedin,
      userId,
    } = this.state;

    return (
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h1 className="display-4">User List</h1>
          </Col>
          {this.state.successMessage && (
            <Alert variant="success">{this.state.successMessage}</Alert>
          )}
          {this.state.errorMessage && (
            <Alert variant="danger">{this.state.errorMessage}</Alert>
          )}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => this.handleShowEditModal(user)}
                      className="me-2 rounded-0"
                    >
                      Edit
                    </Button>
                    <Button
                      disabled={userId === user.id}
                      variant="danger"
                      onClick={() => this.handleShowDeleteModal(user)}
                      className="rounded-0"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
        {/* Delete Confirmation Modal  */}
        <Modal show={showDeleteModal} onHide={this.handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={this.handleDeleteUser}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit User Modal */}
        <Modal show={showEditModal} onHide={this.handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="editedName"
                  value={editedName}
                  onChange={this.handleChange}
                  isInvalid={!!errors.editedName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.editedName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="editedEmail"
                  value={editedEmail}
                  onChange={this.handleChange}
                  isInvalid={!!errors.editedEmail}
                  disabled={userId === editedId}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.editedEmail}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseEditModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleEditUser}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default UserList;
