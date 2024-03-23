import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import RecipeForm from './RecipeForm';

function EditRecipe() {
  const params = useParams();
  const [alert, setAlert] = useState({ message: '', variant: '' });
  const [recipe, setRecipe] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = () => {
    axios.get(`/api/recipes/${params.id}`)
      .then(results => {
        setRecipe({
          name: results.data.name || '',
          author: results.data.author || '',
          description: results.data.description || '',
          category: results.data.category || '',
          ingredient1: results.data.ingredient1 || '',
          ingredient2: results.data.ingredient2 || '',
          ingredient3: results.data.ingredient3 || '',
          ingredient4: results.data.ingredient4 || '',
          ingredient5: results.data.ingredient5 || ''
        });
      })
      .catch(error => {
        setAlert({ message: 'Failed to load recipe.', variant: 'danger' });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <h3>Edit Recipe</h3>

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

      {isLoading
        ? <center><Spinner /></center>
        : !!!alert.message && <RecipeForm recipe={{...recipe, id: params.id}} />
      }
    </>
  );
}

export default EditRecipe;
