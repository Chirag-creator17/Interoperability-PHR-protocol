import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import "./styles.css";
const HeaderComponent = () => {
  return (
    <Navbar className="navbar">
      <Container>
        <Link to="/" className="navbar-brand">
          <div className="header">Interoperability PHR protocol</div>
          </Link>
      </Container>
    </Navbar>
  );
};
export default HeaderComponent;
