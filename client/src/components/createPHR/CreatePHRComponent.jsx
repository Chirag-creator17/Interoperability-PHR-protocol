import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./styles.css";
export const CreateDocumentComp = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [hid, setHid] = useState("");
  const data = localStorage.getItem("name");
  const [desc, setDesc] = useState("");
  const [uri, setUri] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:6969/api/document/create", {
      id: hid,
      profileType: "patient",
      uri: "",
      data: data,
      description: desc,
    });
    if (res.status === 202) {
      if (role === "patient") navigate("/dashboard");
      else navigate("/dashboardOther");
    } else {
      alert("Error creating document");
    }
  };
  return (
    <Container className="login-container">
      <h1>Add PHR</h1>
      <Form>
        <Form.Group className="mb-3 ctrl">
          <Form.Label>Health id</Form.Label>
          <Form.Control
            className="inputs"
            type="text"
            placeholder="Enter HealthId"
            value={hid}
            onChange={(e) => setHid(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3 ctrl">
          <Form.Label>Description</Form.Label>
          <Form.Control
            className="inputs"
            type="text"
            placeholder="Enter description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3 ctrl">
          <Form.Label>URI</Form.Label>
          <Form.Control
            className="inputs"
            type="text"
            placeholder="Enter uri of report"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </Container>
  );
};
