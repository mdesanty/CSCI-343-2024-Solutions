import { Row, Col, Button } from 'react-bootstrap';

const TodoItem = ({ index, todo, removeTask }) => {
  return (
    <Row className="p-3 mt-2 bg-secondary-subtle rounded d-flex align-items-center">
      <Col lg={10} md={9} sm={8} xs={12}>
        <h5 className="mb-0 pb-2 pb-sm-0 text-break">{todo.name}</h5>
      </Col>
      <Col lg={2} md={3} sm={4} xs={12} className="text-start text-sm-end">
        <Button variant="success" onClick={(e) => removeTask(index)}>Complete</Button>
      </Col>
    </Row>
  );
}

export default TodoItem;