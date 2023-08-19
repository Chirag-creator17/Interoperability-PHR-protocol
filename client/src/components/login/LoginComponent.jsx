import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./styles.css";
export const LoginComponent = () => {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    let check = false;
    for (let i = 0; i < number.length; i++) {
      if (number[i] < "0" || number[i] > "9") {
        check = true;
        break;
      }
    }
    if (check) {
      alert("Enter valid phone number");
      return;
    }
    if (number.length !== 10) {
      alert("Enter valid phone number");
      return;
    }
    const res = await axios.post("http://localhost:6969/api/login/phone", {
      phone: number,
    });
    if (res.status === 200) {
      navigate("/otp", { state: { number: number, role: "patient" } });
    } else {
      alert("Error not registered with abha id");
    }
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
      <br />
      <hr />
      <br />
      <div className="register">
        <Link to="/loginOther">Click here</Link> login for doctor or hospital
      </div>
    </Container>
  );
};
