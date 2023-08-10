import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "./styles.css";
export const OtherDashComponent = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Row>
        <Col>
          <h1>Dashboard</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <div className="user-name">Chirag Goel</div>
          <div className="abha">91-3174-8241-0451</div>
        </Col>
        <Col md={6} style={{ textAlign: "end" }}>
          <Button
            className="route-button"
            onClick={() => navigate("/activeRequest")}
          >
            Create Request
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
