import React, { useState } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { postSignOut } from '../../api/fetchRequest/FetchRequest';

function Navigation(props) {
  const {setAccessToken} = props;
  const [isFetching, setIsFetching] = useState(false);

  const sendLogoutRequest = async () => {
    setIsFetching(true);
    await postSignOut();
    setIsFetching(false);
    sessionStorage.clear();
    setAccessToken(false);
  };

  return (
    <Navbar bg='dark' variant='dark' expand='md' className='mb-5 navigation'>
      <Container className='p-0'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' className='mb-2'/>
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav>
            <Nav.Item className='my-2 mx-md-2'>
              <NavLink to='/admin' className='nav-link border border-info rounded text-info text-capitalize w-100 text-center custom'>
                admins
              </NavLink>
            </Nav.Item>
            <Nav.Item className='my-2 mx-md-2'>
              <NavLink to='/registration' className='nav-link border border-info rounded text-info text-capitalize w-100 text-center custom'>
                create new admin
              </NavLink>
            </Nav.Item>
            <Nav.Item className='my-2 mx-md-2'>
              <Button 
                variant='outline-info'
                type='button'
                className={`${isFetching ? 'disabled' : ''} text-capitalize w-100 py-2`}
                onClick={sendLogoutRequest}
              >
                logout
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

Navigation.propTypes = {
  setAccessToken: PropTypes.func
};

export default Navigation;