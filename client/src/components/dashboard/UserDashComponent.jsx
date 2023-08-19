import React, { useEffect, useState } from "react";
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
  const role = localStorage.getItem("role");
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("auth_token") === null) {
      navigate("/");
    }
  }, [navigate]);
  async function fetchData() {
    try {
      const data = {
        id: hid,
        profileType: role,
      };
      await fetch("http://localhost:6969/api/document/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.documents);
          setDocuments(data.documents);
        });
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <th>Document id</th>
              <th>Name</th>
              <th>Date</th>
              <th>Description</th>
              <th>Document</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.publicKey}>
                <td>{document.publicKey}</td>
                <td>{document.account.data}</td>
                <td>{document.account.timestamp}</td>
                <td>{document.account.description}</td>
                <td>{<document className="account uri"></document> }</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};
