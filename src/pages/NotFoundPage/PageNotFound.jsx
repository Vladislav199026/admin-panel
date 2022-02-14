import React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';

function PageNotFound() {
  return (
    <Row className='text-info flex-column justify-content-center align-items-center my-5'>
      <h1 className='text-center mb-4 fw-bold codeError'>404</h1>
      <h3 className='text-center text-capitalize mb-3'>Whoops..!</h3>
      <p className='text-center text-capitalize mb-5'>Sorry, we are not able to find what you were looking for...</p>
      <Link to='/' className='text-info text-center text-capitalize text-decoration-none'>back to home</Link>
    </Row>
  )
};

export default PageNotFound;