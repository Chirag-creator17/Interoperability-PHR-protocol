import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "./styles.css";
const HeaderComponent = () => {
  return (
    <Navbar className="navbar">
      <Container>
          <div className="header">Interoperability PHR protocol</div>
      </Container>
    </Navbar>
  );
};
export default HeaderComponent;
