import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "./styles.css";
export const UserDashComponent = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const hid = localStorage.getItem("health_id");
  useEffect(() => {
    if (localStorage.getItem("auth_token") === null) {
      navigate("/");
    }
  }, []);
  return (
    <Container>
      <Row>
        <Col md={6}>
          <div className="user-name">{name}</div>
          <div className="abha">{hid}</div>
        </Col>
        <Col md={6} style={{ textAlign: "end" }}>
          <Button
            className="route-button"
            onClick={() => navigate("/activeRequest")}
          >
            Active requests
          </Button>
        </Col>
      </Row>
      <Row>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Record</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chirag</td>
              <td>12/12/12</td>
              <td>Record</td>
            </tr>
            <tr>
              <td>Chirag</td>
              <td>12/12/12</td>
              <td>Record</td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};
