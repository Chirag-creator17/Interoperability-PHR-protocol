import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "./styles.css";
export const GrantedRequestComponent = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const hid = localStorage.getItem("health_id");
  const role = localStorage.getItem("role");
  const token=localStorage.getItem("auth_token");
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
        profileType: role,
      };
      await fetch("http://localhost:6969/api/authority/fetch/onProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.authority);
          setDoc(data.authority);
        });
    } catch (err) {
      console.log(err);
    }
  }
  async function fetchUser() {
    for (let i = 0; i < doc.length; i++) {
      const profileAccount = doc[i].account.profile;
      const autherized = doc[i].account.authorised;
      try {
        await fetch("http://localhost:6969/api/profile/fetch/info/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            profileAccount: profileAccount,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            let g = data.documents;
            g.autherized = autherized;
            // console.log(g);
            setDocuments((documents) => [...documents, g]);
          });
      } catch (err) {
        console.log(err);
      }
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
  //revoke acces function
  const revokeAcess = async (id, profileType, authorisedAccount) => {
    console.log(id, profileType, authorisedAccount);
    try {
      const data = {
        id: hid,
        profileType: role,
        authorisedAccount: authorisedAccount,
      };
      await fetch("http://localhost:6969/api/authority/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 400) {
            alert("not Access revoked");
          } else {
            navigate("/dashboard");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

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
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </Col>
      </Row>
      <Row>
        <Table>
          <thead>
            <tr>
              <th>Document id</th>
              <th>Name</th>
              <th>Description</th>
              <th>Document</th>
              <th>Revoke </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <td>{document.id}</td>
                <td>{document.data}</td>
                <td>{document.profileType}</td>
                <td>{document.profileUri}</td>
                <td>
                  <Button
                    onClick={() =>
                      revokeAcess(
                        document.id,
                        document.profileType,
                        document.autherized
                      )
                    }
                  >
                    Revoke access
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};
