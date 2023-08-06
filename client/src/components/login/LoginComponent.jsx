import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./styles.css";
export const LoginComponent = () => {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
      <div className="register">
        * If you don't have Abha Id you can create it at{" "}
        <a
          href="https://healthid.ndhm.gov.in/register"
          target="_blank"
          rel="noreferrer"
        >
          https://healthid.ndhm.gov.in/register
        </a>{" "}
        .
      </div>
    </Container>
  );
};
