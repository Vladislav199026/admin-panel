import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUsers, patchUser } from '../../api/fetchRequest/FetchRequest';
import Spinner from '../../components/Spinner/Spinner';
import { useForm } from 'react-hook-form';

function EditPage(props) {
  const {setUserName} = props;
  const [user, setUser] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(false);
  const {id} = useParams();
  const navigate = useNavigate();
  const password = useRef({});
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  password.current = watch('password', '');

  const getData = useCallback((data) => {
    setUser(data);
  }, []);

  useEffect(() => {
    (async function fetchData() {
      setError(false);
      try {
        const resp = await getUsers(id);
        getData({...resp.data});
      } catch (e) {
        setError(e.message);
      };
      setIsFetching(false);
    })();
  }, [getData, id]);

  const onSubmit = async (data) => {
    setError(false);
    if (!data.password) {
      delete data.password;
    };
    delete data.passwordConfirmation;
    if (+user.id === +sessionStorage.getItem('userId')) {
      sessionStorage.setItem('userInfo', data.userName);
      setUserName(data.userName)
    };
    try {
      await patchUser(data, id);
      sessionStorage.setItem('informModal', 'changed');
      navigate('/');
    } catch (e) {
      setError(`${String(e.message).includes('@') ? 'email already exists' : e.message}`);
    };
    setIsFetching(false);
  };

  return (
    <>
      {
        !isFetching ?
          <Row className='justify-content-center'>
            <Col md={10} lg={8} xl={6}>
              <h5 className='text-white-50 mb-3'>Edit: <strong className='text-info'>{user.userName}</strong></h5>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className='mb-3'>
                  <Form.Label className='text-capitalize mb-2 text-white-50'>userName:</Form.Label>
                  <Form.Control 
                    type='text' 
                    placeholder={user.userName} 
                    defaultValue={user.userName}
                    title='Minimum 6 but maximum 10 characters required'
                    autoComplete='off'
                    className='mb-3'
                    {...register('userName', {
                      required: 'userName is a required field', 
                      minLength: {value: 5, message: 'userName must be at least 5 characters'}, 
                      maxLength: {value: 10, message: 'userName must be at most 10 characters'}
                    })}
                  />
                  {errors.userName && <p className='text-danger'>{errors.userName?.message}</p>}
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label className='text-capitalize mb-2 text-white-50'>email:</Form.Label>
                  <Form.Control 
                    type='email'
                    defaultValue={user.email} 
                    placeholder={user.email} 
                    title='Your new email'
                    autoComplete='off'
                    className='mb-3'
                    {...register('email', {
                      required: 'email is a required field',
                      pattern: {value: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/, message: 'email must be a valid email'}
                    })}
                  />
                  {errors.email && <p className='text-danger'>{errors.email?.message}</p>}
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label className='text-capitalize mb-2 text-white-50'>password:</Form.Label>
                  <Form.Control 
                    type='password'
                    defaultValue={null}
                    placeholder='new password'
                    title='Minimum 6 but maximum 10 characters required, at least 1 number and 1 capital letter'
                    autoComplete='off'
                    className='mb-3'
                    {...register('password', {
                      minLength: {value: 5, message: 'userName must be at least 5 characters'}, 
                      maxLength: {value: 10, message: 'userName must be at most 10 characters'}, 
                      pattern: {value: /^(?=.*\d)(?=.*[A-Z]).{6,10}$/, message: 'at least 1 number and 1 capital letter are required'}
                    })}
                  />
                  {errors.password && <p className='text-danger'>{errors.password?.message}</p>}
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label className='text-capitalize mb-2 text-white-50'>Enter your password again:</Form.Label>
                  <Form.Control 
                    type='password'
                    defaultValue={null}
                    placeholder='enter your password again'
                    title='repeat your password'
                    autoComplete='off'
                    className='mb-3'
                    {...register('passwordConfirmation', {
                      validate: value => (password.current === undefined) || (password.current === value) || 'The passwords do not match',
                      disabled: (password.current !== undefined) ? false : true
                    })}
                  />
                  {errors.passwordConfirmation && <p className='text-danger'>{errors.passwordConfirmation?.message}</p>}
                </Form.Group>
                <div className='text-end'>
                  <Button 
                    variant='outline-info' 
                    className={`${!isFetching ? '' : 'disabled'} text-capitalize mb-3`} 
                    type='submit'
                  >
                    save changes
                  </Button>{' '}
                  <Button 
                    variant='outline-info' 
                    className='ms-2 mb-3 text-capitalize '
                    type='button'
                    onClick={() => navigate('/admin')}
                  >
                    cancel
                  </Button>
                </div>
              </Form>
            </Col>
            {error && <p className='text-danger text-center'>{error}</p>}
          </Row>  
          :
          <Spinner />
      }
    </>
  )
};

EditPage.propTypes = {
  setUserName: PropTypes.func
};

export default EditPage;