import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "./styles.css";

export const OtherDashComponent = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const hid = localStorage.getItem("health_id");
  const [documents, setDocuments] = useState([]);
  const [doc, setDoc] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("auth_token") === null) {
      navigate("/");
    }
  }, [navigate]);
  async function fetchData() {
    try {
      const data = {
        id: hid,
      };
      await fetch("http://localhost:6969/api/authority/fetch/onAuthority", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          setDoc(data.authority);
        });
    } catch (err) {
      console.log(err);
    }
  }
  async function fetchUser() {
    try {
      for (let i = 0; i < doc.length; i++) {
        const profile = doc[i].account.profile;
        console.log(profile);
        const data = {
          profileAccount: profile,
        };
        await fetch("http://localhost:6969/api/profile/fetch/info/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((data) => {
            let g = data.documents;
            g.info = JSON.parse(g.info);
            setDocuments((documents) => [...documents, g]);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setDocuments([]);
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, setDocuments]);
  return (
    <Container>
      <Row>
        <Col>
          <div className="user-name">{name}</div>
          <div className="abha">{hid}</div>
        </Col>
        <Col style={{ textAlign: "end" }}>
          <Button
            className="route-button"
            onClick={() => navigate("/createPHR")}
          >
            Create PHR
          </Button>
        </Col>
      </Row>
      <Row>
        <Table>
          <thead>
            <tr>
              <th>User id</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Documents</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <td>{document.id}</td>
                <td>{document.info.name}</td>
                <td>{document.info.phone}</td>
                <td>
                  <Link
                    to={`./userRecords/${document.id}`}
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};
