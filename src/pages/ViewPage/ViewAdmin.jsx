import React, { useEffect, useState, useCallback } from 'react';
import { Button, Row, Col, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import { getUsers } from '../../api/fetchRequest/FetchRequest';

function ViewAdmin() {
  const {id} = useParams();
  const [user, setUser] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const getData = useCallback((data) => {
    setUser(data);
  }, []);

  useEffect(() => {
    (async function fetchData() {
      try {
        const resp = await getUsers(id);
        getData({...resp.data});
      } catch (e) {
        setError(e.message);
      };
      setIsFetching(false);
    })()
  }, [getData, id]);

  return (
    <>
    {
      error ?
        error && <p className='text-danger text-center'>{error}</p>
        :
        !isFetching ?
          <Container className='d-flex flex-column align-items-center text-white-50 text-capitalize fs-5'>
            <Row>
              <Col>
                <h5>Information about: <strong className='text-info text-break'>{user.userName}</strong></h5>
                <p>users ID: <strong className='text-info'>{user.id}</strong></p>
                <p>email: <strong className='text-info text-break'>{user.email}</strong></p>
                <p>created: <strong className='text-info text-break'>{user.createdAt}</strong></p>
                <p>last updated: <strong className='text-info text-break'>{user.updatedAt}</strong></p>
              </Col>
              <div className='text-end'>
                <Button 
                  variant='outline-info' 
                  className='ms-2 mb-3 w-auto text-capitalize '
                  type='button'
                  onClick={() => navigate('/admin')}
                >
                  back
                </Button>
              </div>
            </Row>
          </Container>
          :
          <Spinner />
    }
    </>
  )
};

export default ViewAdmin;