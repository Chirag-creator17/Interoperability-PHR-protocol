import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
export const GrantRequestComponent = () => {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [documents, setDocuments] = useState([]);
  const role = localStorage.getItem("role");
  const hid = localStorage.getItem("health_id");
  async function fetchData() {
    try {
      await fetch("http://localhost:6969/api/dashboard/others", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data.profiles);
          setDocuments(data.profiles);
        });
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(number);
    try {
      const res = await fetch("http://localhost:6969/api/authority/authorise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: hid,
          profileType: role,
          authorisedAccount: number,
        }),
      }).then((res) => res.json());
      if (res.status === 400) {
        alert("Errror in Access granted");
      } else {
        navigate("/dashboard");
        // console.log(res);
      }
    }
    catch (err){
      console.log(err);
    }
  };
  return (
    <Container>
      <h1>Grant Request</h1>
      <Form>
        <Form.Group className="mb-3 ctrl">
          <Form.Select
            mode="multiple"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            aria-label="Default select example"
          >
            <option>Select Option</option>
            {documents.map((document) => (
              <option key={document.public_key} value={document.public_key}>
                {document.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Grant
        </Button>
      </Form>
    </Container>
  );
};
