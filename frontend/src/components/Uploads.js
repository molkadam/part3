import { Container, Table, Button, Alert, Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { UploadsModal } from "./UploadsModal";
import { getFiles } from "../Services/FileService";

const Uploads = () => {
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deletedFile, setDeletedFile] = useState(false);
  const [message, setMessage] = useState(""); // State to store the success message
  const [files, setFiles] = useState() || [];
  const handleClose = () => {
    setShow(false);
    setSelectedFile(null);
  };

  const handleShowNew = () => {
    setSelectedFile(null);
    setShow(true);
  };

  const handleEdit = (file) => {
    setSelectedFile(file);
    setShow(true);
  };

  const handleDelete = (file) => {
    setShow(true);
    setDeletedFile(true);
    setSelectedFile(file);
  };

  const loadFiles = async () => {
      const response = await getFiles();
      console.log(response.status);
      if(response.status === 401){
        setMessage("You are not authorized to view this page");
      }else{
        setFiles(response.data);
      }
      
  } 
  useEffect( () => {
    loadFiles();
  }, []);
  const handleSuccess = (operation) => {
    // Set a success message based on the operation
    setMessage(`File ${operation} successfully!`);
    // Hide the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h1 className="display-4">Files</h1>
          </Col>
        </Row>

        {message && <Alert variant="success">{message}</Alert>}

        <Button variant="primary" onClick={handleShowNew}>
          Add Your File
        </Button>

        <Table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Label</th>
              <th>File Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(files) && files.map((file, index) => (
              <tr key={file.id}>
                <td>{index + 1}</td>
                <td>{file.label}</td>
                <td>{file.filename}</td>
                <td>
                  <Button
                    className="me-2 rounded-0"
                    variant="success"
                    onClick={() => handleEdit(file)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="me-2 rounded-0"
                    variant="danger"
                    onClick={() => handleDelete(file)}
                  >
                    Delete
                  </Button>
                  <Button className="me-2 rounded-0" variant="info">
                    Share
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <UploadsModal
          show={show}
          handleClose={handleClose}
          title={selectedFile ? "Edit File" : "Upload Your File"}
          initialData={selectedFile}
          onSuccess={handleSuccess} // Pass the success handler to the modal
          isDelete={deletedFile}
        />
      </Container>
    </>
  );
};

export default Uploads;
