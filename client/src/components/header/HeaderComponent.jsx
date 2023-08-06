import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
const HeaderComponent = () => {
  return (
    <Navbar className="navbar">
      <Container>
          <div>Interoperability PHR protocol</div>
        <Navbar.Toggle />
      </Container>
    </Navbar>
  );
};
export default HeaderComponent;
