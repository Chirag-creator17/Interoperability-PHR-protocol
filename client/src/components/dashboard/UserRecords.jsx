import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
export const UserRecordsComponent = () => {
  //get id from url
  const location = useLocation();
  const token = localStorage.getItem("auth_token");
  const hid = location.pathname.split("/")[3];
  const [documents, setDocuments] = useState([]);
  async function fetchData() {
    try {
      const data = {
        id: hid,
        profileType: "patient",
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
                  <a
                    href={document.account.uri}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};
