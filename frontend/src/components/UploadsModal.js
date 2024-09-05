import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { fileUpload } from "../Services/FileService";
export const UploadsModal = ({
  show,
  handleClose,
  title,
  initialData,
  onSuccess,
  isDelete,
}) => {
  const [formData, setFormData] = useState({
    label: "",
    fileName: null,
  });
  const [errors, setErrors] = useState({});
  const userId = sessionStorage.getItem("userId");
  useEffect(() => {
    if (initialData) {
      setFormData({
        label: initialData.label,
        fileName: null, // Keep it null to allow new file selection
      });
    } else {
      setFormData({
        label: "",
        fileName: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "fileName" ? files[0] : value, // Handle file input
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      const uniqueId = initialData?.id || Date.now();
      let files = JSON.parse(localStorage.getItem("files")) || [];
      const loggedIn = JSON.parse(localStorage.getItem("loggedin"));

      const filesDetail = {
        id: uniqueId,
        userId: userId || null,
        label: formData.label,
        fileName: formData.fileName?.name || initialData.fileName, // Retain existing file name if unchanged
      };

      if (initialData) {
        files = files.map((file) =>
          file.id === uniqueId ? filesDetail : file
        );
      } else {

        try {
          const response = await fileUpload(filesDetail);
          if (response.status === 200) {
            onSuccess(initialData ? "updated" : "uploaded"); // Call onSuccess with the operation type
            handleClose();
          }
        } catch (error) {
          console.error(error);
        }
      }

      // localStorage.setItem("files", JSON.stringify(files));
      // onSuccess(initialData ? "updated" : "uploaded"); // Call onSuccess with the operation type
      // handleClose(); // Close the modal after submission
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.label) {
      errors.label = "Label is required";
    }
    if (!formData.fileName && !initialData?.fileName) {
      errors.fileName = "File is required";
    }
    return errors;
  };
  const handleDeleteFile = () => {
    let files = JSON.parse(localStorage.getItem("files")) || [];
    files = files.filter((file) => file.id !== initialData.id);
    localStorage.setItem("files", JSON.stringify(files));
    onSuccess("deleted"); // Call onSuccess with the operation type
    handleClose(); // Close the modal after deletion
  };
  return (
    <>
      {isDelete ? (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete{" "}
            <b>{initialData && initialData.fileName}</b> file ?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteFile}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formLabel" className="mb-3">
                <Form.Label>Label</Form.Label>
                <Form.Control
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  isInvalid={!!errors.label}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.label}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Select File</Form.Label>
                <Form.Control
                  type="file"
                  name="fileName"
                  onChange={handleChange}
                  isInvalid={!!errors.fileName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fileName}
                </Form.Control.Feedback>
                {initialData && (
                  <small>Current file: {initialData.filename}</small>
                )}
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  {initialData ? "Update" : "Submit"}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
