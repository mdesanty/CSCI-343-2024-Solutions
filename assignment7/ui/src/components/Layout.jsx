import { Container, Nav } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div id="background" className="min-vh-100">
      <Container fluid id="app-container" className="min-vh-100 d-flex flex-column p-0" style={{ minWidth: "250px" }}>
        <div id="header">
          <div className="py-5 px-3 text-white">
            <h1>Mike's Recipe App</h1>
          </div>
          <Nav>
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/recipes">Recipes</Nav.Link>
            <Nav.Link as={NavLink} to="/categories">Categories</Nav.Link>
          </Nav>
        </div>

        <div id="body" className="px-2 py-3 flex-grow-1 text-white">
          <Outlet />
        </div>
      </Container>
    </div>
  );
}

export default Layout;