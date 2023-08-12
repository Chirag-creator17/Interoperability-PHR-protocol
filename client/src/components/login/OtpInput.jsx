import React from "react";
import { useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./styles.css";
export const OtpInputComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [otp, setOtp] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(otp);
    console.log(state.number, state.role);
    if(state.role === "user")
      navigate("/dashboard");
    else
      navigate("/dashboardOther");
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
