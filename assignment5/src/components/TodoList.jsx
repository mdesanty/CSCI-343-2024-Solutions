import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { addTodo } from "../slices/todoSlice";
import { Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';

import TodoItem from './TodoItem';

const TodoList = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [formErrors, setFormErrors] = useState({});

  const { todoList } = useSelector(state => state.todos);
  const dispatch = useDispatch();

  const addTask = (e) => {
    e.preventDefault();

    let valid = true;
    setFormErrors({});

    if (!formData.name || formData.name.length === 0) {
      setFormErrors((prevState) => {
        return { ...prevState, name: "Task name is required" }
      });
      valid = false;
    }

    if (formData.name.length > 100) {
      setFormErrors((prevState) => {
        return { ...prevState, name: "Task cannot exceed 100 characters" }
      });
      valid = false;
    }

    if (valid) {
      dispatch(addTodo(formData));
      setShowModal(false);
      setFormData({ name: "" });
    }
  }

  const hideModal = () => {
    setFormData({ name: "" });
    setFormErrors({});
    setShowModal(false);
  }

  return (
    <Container>
      <Row>
        <center>
          <Col md={8}>
            <Row>
              <h5 className="mt-3 pb-2">TODO List</h5>
            </Row>
            <Row>
              <Col md={12} className="text-start p-0">
                <Button variant="primary" className="mb-1" style={{ width: "100px" }} onClick={() => setShowModal(true)}>Add task</Button>
              </Col>
            </Row>
            <div id="todo-list" className="text-start">
              <Col md={12}>
                {todoList.length > 0 ?
                  <>
                    {todoList.map((task, index) => (
                      <TodoItem key={index} index={index} todo={task} />
                    ))}
                  </>
                  :
                  <Row className="p-3 mt-2 bg-secondary-subtle rounded d-flex align-items-center">
                    <Col md={10}>
                      <span>You're all caught up! You currently have no TODO's... must be nice</span>
                    </Col>
                  </Row>
                }
              </Col>
            </div>
          </Col>
        </center>
      </Row>

      <Modal show={showModal} onHide={hideModal}>
        <Form onSubmit={addTask}>
          <Modal.Header closeButton>
            <Modal.Title>Add Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="taskName">
              <Form.Label>Task Name</Form.Label>
              <Form.Control type="text" autoFocus isInvalid={!!formErrors.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <Form.Control.Feedback type="invalid" className="text-start">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={hideModal}>Cancel</Button>
            <Button variant="primary" type="submit">Add</Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </Container>
  );
}

export default TodoList;