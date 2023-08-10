import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./styles.css";
export const LoginOtherComponent = () => {
  const navigate = useNavigate();
    const [number, setNumber] = useState("");
    const [role, setRole] = useState("");
  const handleSubmit = async (e) => {
      e.preventDefault();
    console.log(number, role);
    localStorage.setItem("role",role);
    navigate("/otp");
  };
  return (
    <Container className="login-container">
      <h1>Login</h1>
      <Form>
        <Form.Group className="mb-3 ctrl">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            className="inputs"
            type="tel"
            placeholder="Enter phone number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <Form.Text className="text-muted">
            Enter the mobile number registered with the AbhaId
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3 ctrl">
          <Form.Label>Role</Form.Label>
          <Form.Select aria-label="Default select example" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Doctor</option>
            <option>Hospital</option>
            <option>Pharmacy</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </Container>
  );
};
