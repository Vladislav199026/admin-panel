import React, { useState } from 'react';
import { Row, Col, FloatingLabel, Form, Button, Spinner } from 'react-bootstrap';
import { postSignIn } from '../../api/fetchRequest/FetchRequest';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PropTypes from 'prop-types';

function LoginPage(props) {
  const {setAccessToken} = props;
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().required().matches(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/, 'email must be a valid email'),
    password: yup.string().required().min(5).max(10).matches(/^(?=.*\d)(?=.*[A-Z]).{6,10}$/, 'at least 1 number and 1 capital letter are required'),
  });

  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsFetching(true);
    setError(false);
    try {
      const resp = await postSignIn(data);
      sessionStorage.setItem('userInfo', resp.data.user.userName);
      sessionStorage.setItem('userId', resp.data.user.id);
      sessionStorage.setItem('accessToken', resp.data.accessToken);
      setAccessToken(true);
    } catch (e) {
      setError(e.message);
    };
    setIsFetching(false);
  };

  return (
    <Row className='justify-content-center'>
      <Col md={10} lg={8} xl={6}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FloatingLabel 
            label='Email address' 
            className='mb-3' 
          >
            <Form.Control 
              type='email' 
              placeholder='Email address' 
              title='Your email'
              autoComplete='off'
              {...register('email')}
            />
          </FloatingLabel>
          {errors.email && <p className='text-danger'>{errors.email?.message}</p>}
          <FloatingLabel 
            label='Password' 
            className='mb-3'
          >
            <Form.Control 
              type='password' 
              placeholder='Password' 
              title='Your password'
              autoComplete='off'
              {...register('password')}
            />
          </FloatingLabel>
          {errors.password && <p className='text-danger'>{errors.password?.message}</p>}
          <Button 
            variant='outline-info' 
            className={`${!isFetching ? '' : 'disabled'} py-3 w-100 text-capitalize mb-3`} 
            type='submit'
          >
            { isFetching ? <Spinner animation='border' variant='info' size='sm' /> : 'login' }
          </Button>
        </Form>
        {error && <p className='text-danger text-center'>{error}</p>}
      </Col>
    </Row>
  )
};

LoginPage.propTypes = {
  setAccessToken: PropTypes.func
};

export default LoginPage;