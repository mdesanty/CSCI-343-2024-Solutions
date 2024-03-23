import { Container, Nav } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div id="background" className="min-vh-100">
      <Container id="container" className="min-vh-100 d-flex flex-column">
        <div id="header">
          <div className="py-5 px-3 bg-light">
            <h1>Mike's Awesome TODO App</h1>
          </div>
          <Nav className="bg-secondary">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/todos">TODO list</Nav.Link>
            <Nav.Link as={NavLink} to="/disclaimer">Disclaimer</Nav.Link>
          </Nav>
        </div>

        <div id="body" className="px-2 py-3 mt-0 bg-light flex-grow-1">
          <Outlet />
        </div>
      </Container>
    </div>
  );
}

export default Layout;