import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import CategoryForm from './CategoryForm';
import axios from 'axios';

const EditCategory = () => {
  const params = useParams();
  const [alert, setAlert] = useState({message: '', variant: ''});
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState({
    name: ''
  });

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = () => {
    axios.get(`/api/categories/${params.id}`)
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => {
        setAlert({message: 'Error loading category', variant: 'danger'});
      })
      .finally(() => {
        setIsLoading(false);
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

      <h3 className='pb-3'>Edit Category</h3>
      {isLoading
        ? <center><Spinner /></center>
        : !!!alert.message && <CategoryForm category={category}/>
      }
    </>
  );
}

export default EditCategory;