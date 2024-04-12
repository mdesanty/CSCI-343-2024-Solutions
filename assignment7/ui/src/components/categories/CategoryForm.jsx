import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const CategoryForm = ({category}) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({message: "", variant: ""});
  const [errors, setErrors] = useState({name: ""});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: category ? category.name : ""
  });

  const handleChange = (e, key) => {
    setErrors({...errors, [key]: ""});
    setFormData({...formData, [key]: e.target.value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    const apiCall = !!category?.id ? axios.put(`/api/categories/${category.id}`, formData) : axios.post("/api/categories", formData);

    apiCall
      .then(response => {
        navigate("/categories", { state: { alert: { message: "Category saved successfully", variant: "success" } } });
      })
      .catch((error) => {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
        }
        else {
          setAlert({message: "Error saving category", variant: "danger"});
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      {!!alert.message &&
        <Alert
          className="text-center"
          variant={alert.variant}
          onClose={() => setAlert({ message: "", type: "" })}
          dismissible
        >
          {alert.message}
        </Alert>
      }

      <Row>
        <Container as={Col} xs={7} className='bg-light text-black rounded p-2'>
          <Form onSubmit={isSubmitting ? null : handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="pt-3 pb-2">
              <Button variant="#" type="submit" className="me-2 btn-action">Save</Button>
              <Button variant="secondary" type="button" as={Link} to="/categories">Cancel</Button>
            </Form.Group>
          </Form>
        </Container>
      </Row>
    </>
  );
}

export default CategoryForm;