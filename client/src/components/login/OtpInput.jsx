import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./styles.css";
export const OtpInputComponent = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(otp);
    console.log(localStorage.getItem("role"));
    navigate("/dashboard");
  };
  return (
    <Container className="login-container">
      <h1>Login</h1>
      <Form>
        <Form.Group className="mb-3 ctrl">
          <Form.Label>Enter OTP</Form.Label>
          <Form.Control
            className="inputs"
            type="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Form.Text className="text-muted">
            Enter the otp sent on phone number registered with the AbhaId
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </Container>
  );
};
