import React, { useState } from 'react';
import { Row, Col, FloatingLabel, Form, Button } from 'react-bootstrap';
import { postCreateUser } from '../../api/fetchRequest/FetchRequest';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

function RegistrationPage() {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    userName: yup.string().required().min(5).max(10),
    email: yup.string().required().matches(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/, 'email must be a valid email'),
    password: yup.string().required().min(5).max(10).matches(/^(?=.*\d)(?=.*[A-Z]).{6,10}$/, 'at least 1 number and 1 capital letter are required'),
    passwordConfirmation: yup.string().required().equals([yup.ref('password'), null], 'passwords must match')
  });

  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsFetching(true);
    setError(false);
    delete data.passwordConfirmation;
    try {
      await postCreateUser(data);
      sessionStorage.setItem('informModal', 'created');
      navigate('/admin');
    } catch (e) {
      setError(`${String(e.message).includes('@') ? 'email already exists' : e.message}`);
    };
    setIsFetching(false);
  };

  return (
    <Row className='justify-content-center'>
      <Col md={10} lg={8} xl={6}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FloatingLabel 
            label='UserName' 
            className='mb-3' 
          >
            <Form.Control 
              placeholder='UserName' 
              title='Minimum 6 but maximum 10 characters required' 
              type='text' 
              autoComplete='off' 
              {...register('userName')}
            />
          </FloatingLabel>
          {errors.userName && <p className='text-danger'>{errors.userName?.message}</p>}
          <FloatingLabel 
            label='Email' 
            className='mb-3'
          >
            <Form.Control 
              placeholder='Email address' 
              title='Your email'
              type='email' 
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
              placeholder='Password' 
              title='Minimum 6 but maximum 10 characters required, at least 1 number and 1 capital letter'
              type='password' 
              autoComplete='off' 
              {...register('password')}
            />
          </FloatingLabel>
          {errors.password && <p className='text-danger'>{errors.password?.message}</p>}
          <FloatingLabel 
            label='Enter your password again' 
            className='mb-3'
          >
            <Form.Control 
              placeholder='Enter your password again' 
              title='Repeat your password'
              type='password' 
              autoComplete='off'
              {...register('passwordConfirmation')}
            />
          </FloatingLabel>
          {errors.passwordConfirmation && <p className='text-danger'>{errors.passwordConfirmation.message}</p>}
          <Button 
            variant='outline-info' 
            className={`${!isFetching ? '' : 'disabled'} py-3 w-100 text-capitalize mb-3`} 
            type='submit'
          >
            create
          </Button>
        </Form>
        {error && <p className='text-danger text-center'>{error}</p>}
      </Col>
    </Row>
  )
};

export default RegistrationPage;