import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
const HeaderComponent = () => {
  return (
    <Navbar className="navbar">
      <Container>
          <div style={{fontSize:"20"}}>Interoperability PHR protocol</div>
        <Navbar.Toggle />
      </Container>
    </Navbar>
  );
};
export default HeaderComponent;
