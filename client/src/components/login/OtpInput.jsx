import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    // console.log(otp);
    // console.log(state.number, state.role);
    const res = await fetch("http://localhost:6969/api/login/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp,
        phone: state.number,
        role: state.role,
      }),
    });
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      localStorage.setItem("auth_token", data.auth_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("health_id", data.mobileLinkedHid.healthIdNumber);
      localStorage.setItem("name", data.mobileLinkedHid.name);
      if (state.role === "patient") navigate("/dashboard");
      else navigate("/dashboardOther");
    }
    else {
      alert("Error wrong otp");
    }
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
