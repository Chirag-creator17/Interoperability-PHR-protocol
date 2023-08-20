import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
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
  const token=localStorage.getItem("auth_token");
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
          "x-access-token": token,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
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
        <Col>
          <div className="user-name">{name}</div>
          <div className="abha">{hid}</div>
        </Col>
        <Col style={{ textAlign: "end" }}>
          <DropdownButton
            id="dropdown-basic-button"
            title="Options"
            className="route-button"
          >
            <Dropdown.Item onClick={() => navigate("/grantRequest")}>
              Grant requests
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/grantedRequest")}>
              Granted requests
            </Dropdown.Item>
          </DropdownButton>
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
                <td>{`${document.publicKey.substring(
                  0,
                  3
                )}....${document.publicKey.substring(
                  document.publicKey.length - 2
                )}`}</td>
                <td>{document.account.data}</td>
                <td>{new Date(document.account.timestamp).toLocaleString()}</td>
                <td>{document.account.description}</td>
                <td>
                  <a href={document.account.uri} target="_blank" rel="noreferrer">
                    Open PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <Row>
        <Button onClick={() => navigate("/createPHR")}>
          Create PHR
        </Button>
      </Row>
    </Container>
  );
};
