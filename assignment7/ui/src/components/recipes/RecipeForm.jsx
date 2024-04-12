import { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeForm = ({ recipe }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: '', variant: '' });
  const [errors, setErrors] = useState({});
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    author_id: '',
    category_id: '',
    description: '',
    ingredient_ids: []
  });

  useEffect(() => {
    if (!!recipe?.id) {
      console.log(recipe);
      setFormData({
        name: recipe.name || '',
        author_id: recipe.author.id || '',
        category_id: recipe.category.id || '',
        description: recipe.description || '',
        ingredient_ids: recipe.ingredients.map(i => i.id) || []
      });
    }
  }, [recipe]);

  useEffect(() => {
    fetchAuthors();
    fetchCategories();
    fetchIngredients();
    setIsLoading(false);
  }, []);

  const fetchAuthors = () => {
    axios.get('/api/authors')
      .then(response => {
        setAuthors(response.data);
      })
      .catch(error => {
        setAlert({ message: 'Failed to load authors', variant: 'danger' });
      });
  }

  const fetchCategories = () => {
    axios.get('/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        setAlert({ message: 'Failed to load categories', variant: 'danger' });
      });
  }

  const fetchIngredients = () => {
    axios.get('/api/ingredients')
      .then(response => {
        setIngredients(response.data);
      })
      .catch(error => {
        setAlert({ message: 'Failed to load ingredients', variant: 'danger' });
      });
  }

  const handleInputChange = (e, key) => {
    setErrors({ ...errors, [key]: '' });
    setFormData({ ...formData, [key]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});

    const apiCall = !!recipe?.id ? axios.put(`/api/recipes/${recipe.id}`, formData) : axios.post('/api/recipes', formData);

    apiCall
      .then(response => {
        navigate('/recipes', { state: { alert: { message: `Recipe successfully ${!!recipe?.id ? 'updated' : 'created'}.`, variant: 'success' } } });
      })
      .catch(error => {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        }
        else {
          setAlert({ message: `Failed to ${!!recipe?.id ? 'update' : 'create'} recipe.`, variant: 'danger' });
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
          className='text-center'
          variant={alert.variant}
          onClose={() => setAlert({ message: '', type: '' })}
          dismissible
        >
          {alert.message}
        </Alert>
      }

      {isLoading && <center><Spinner /></center>}

      <Row>
        <Container as={Col} xs={7} className='bg-light text-black rounded p-2'>
          <Form className='p-2'>
            <Row>
              <Form.Group as={Col} lg={6} className='pb-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  value={formData.name}
                  isInvalid={!!errors.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                />
                <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} lg={6} className='pb-2'>
                <Form.Label>Author</Form.Label>
                <Form.Select
                  type='text'
                  value={formData.author_id}
                  isInvalid={!!errors.author_id}
                  onChange={(e) => handleInputChange(e, 'author_id')}
                >
                  <option value="">Select author</option>
                  {authors.map(author => <option value={author.id} key={author.id}>{author.name}</option>)}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>{errors.author_id}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className='pb-2'>
              <Form.Label>Category</Form.Label>
              <Form.Select
                type='text'
                value={formData.category_id}
                isInvalid={!!errors.category_id}
                onChange={(e) => handleInputChange(e, 'category_id')}
              >
                <option value=''>Select category</option>
                {categories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
              </Form.Select>
              <Form.Control.Feedback type='invalid'>{errors.category_id}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='pb-2'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                value={formData.description}
                isInvalid={!!errors.description}
                onChange={(e) => handleInputChange(e, 'description')}
              />
              <Form.Control.Feedback type='invalid'>{errors.description}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='pb-2'>
              <Form.Label>Ingredients</Form.Label>
              <Form.Control
                as='select'
                multiple
                value={formData.ingredient_ids}
                isInvalid={!!errors.ingredient_ids}
                onChange={(e) => {
                  setErrors({ ...errors, ingredient_ids: '' });
                  setFormData({ ...formData, ingredient_ids: [].slice.call(e.target.selectedOptions).map(o => o.value)})
                }}
                style={{ height: '300px' }}
              >
                <option value="">Select ingredients</option>
                {ingredients.map(ingredient => <option value={ingredient.id} key={ingredient.id}>{ingredient.name}</option>)}
              </Form.Control>
              <Form.Control.Feedback type='invalid'>{errors.ingredient_ids}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mt-4'>
              <Button
                variant='#'
                type='submit'
                className='me-2 btn-action'
                onClick={handleSubmit}
                style={{ minWidth: '80px' }}
              >
                {isSubmitting ? <Spinner size='sm'/> : 'Save'}
              </Button>

              <Button
                variant='secondary'
                type='button'
                style={{ minWidth: '80px' }}
                onClick={() => navigate('/recipes')}
              >
                Cancel
              </Button>
            </Form.Group>
          </Form>
        </Container>
      </Row>
    </>
  );
}

export default RecipeForm;