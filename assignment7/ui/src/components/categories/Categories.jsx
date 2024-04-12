import { useState, useEffect } from "react";
import { Alert, Spinner, Container, Button, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

import Category from "./Category";

const Categories = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();

    if (location.state?.alert) {
      setAlerts((prevState) => [location.state.alert]);
      window.history.replaceState({}, "");
    }
  }, []);

  const fetchCategories = () => {
    axios.get("/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        setAlerts((prevState) => [...prevState, { message: "Error fetching categories", variant: "danger" }]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const removeCategory = (e, category) => {
    e.preventDefault();

    if (window.confirm(`Are you sure you want to delete the category ${category.name}?`)) {
      axios.delete(`/api/categories/${category.id}`)
        .then(response => {
          setCategories(prev => prev.filter(current => current.id !== category.id));
          setAlerts([...alerts, { message: "Category successfully deleted.", variant: "success" }]);
          window.scrollTo(0, 0)
        })
        .catch(error => {
          setAlerts([...alerts, { message: "Failed to delete category.", variant: "danger" }]);
        });
    }
  }

  return (
    <div>
      <Container>
        {alerts.map((alert, index) => (
          <Alert key={index} variant={alert.variant} dismissible>
            {alert.message}
          </Alert>
        ))}

        <h3 className="pb-3">Categories</h3>

        <div>
          <Button as={Link} to="/categories/new" variant="#" className="mb-3 btn-action">Add Category</Button>
        </div>

        {isLoading ?
          <center>
            <Spinner />
          </center>
          :
          <>
            {categories.length === 0 ?
              <p>No categories available.</p>
              :
              <Table striped hover className="rounded-1 overflow-hidden">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th style={{ width: "110px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <Category key={category.id} category={category} onDeleteClick={(e) => removeCategory(e, category)} />
                  ))}
                </tbody>
              </Table>
            }
          </>
        }
      </Container>
    </div>
  );
}

export default Categories;