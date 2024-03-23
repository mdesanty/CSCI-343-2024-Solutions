import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

import Recipe from './Recipe';

const Recipes = () => {
  const location = useLocation();
  const [alert, setAlert] = useState({ message: '', variant: '' });
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/recipes')
      .then(response => {
        setRecipes(response.data);
        setAlert({ message: '', variant: '' });

        if(location.state?.alert) {
          console.log(location.state.alert);
          setAlert(location.state.alert);
          window.history.replaceState({}, '')
        }
      })
      .catch(error => {
        setAlert({ message: 'Failed to load recipes', variant: 'danger' });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onDeleteClick = (e, recipe) => {
    e.preventDefault();

    if (window.confirm(`Are you sure you want to delete the book, ${recipe.name}?`)) {
      axios.delete(`/api/recipes/${recipe.id}`)
        .then(response => {
          setRecipes(recipes.filter(r => r.id !== recipe.id));
        })
        .catch(error => {
          console.log(`Error deleting recipe: [${error.message}].`);
        });
    }
  }

  return (
    <>
      {!!alert.message && <Alert variant={alert.variant} dismissible>{alert.message}</Alert>}

      <div className='d-flex mb-3'>
        <h3 className='pe-3'>Recipes</h3>
        <Button as={Link} to="/recipes/new" variant="#" className="mb-3 btn-action">Add Recipe</Button>
      </div>

      <Container>
        {isLoading
          ?
          <center>
            <Spinner />
          </center>
          :
          <>
            {recipes.length === 0 ?
              <p>No recipes found.</p>
              :
              <Row>
                {recipes.map(recipe => (
                  <Recipe key={recipe.id} recipe={recipe} onDeleteClick={onDeleteClick} />
                ))}
              </Row>
            }
          </>
        }
      </Container>
    </>
  );
}

export default Recipes;