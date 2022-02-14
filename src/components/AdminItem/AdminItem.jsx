import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AdminItem(props) {
  const {
    currentUser,
    itemAllInfoUser,
    setShowCfrmModal
  } = props;
  const userName = sessionStorage.getItem('userInfo');

  return (
    <Row 
      className={`${itemAllInfoUser.userName === userName ? 'fw-bold' : ''} text-info admin-list mb-5`}
      key={itemAllInfoUser.id}
    >
      <Col sm={6} md={4} className='mb-2 offset-lg-2'>
        <p className='m-0 text-break'>{itemAllInfoUser.email}</p>
      </Col>
      <Col sm={6} md={4} lg={3} className='mb-3'>
        <p className='m-0 text-break'>{itemAllInfoUser.userName}</p>
      </Col>
      <Col  sm={3} md={4} lg={3} >
        <Dropdown 
          onClick={(e) => currentUser(e, itemAllInfoUser)}
        >
          <Dropdown.Toggle 
            variant='outline-info' 
            id='dropdown-basic' 
            className='text-capitalize'
          >
            actions
          </Dropdown.Toggle>
          <Dropdown.Menu className='p-0 border border-info'>
            <Link 
              to={`view/${itemAllInfoUser.id}`} 
              className='nav-link fw-normal border border-info text-info text-capitalize w-100 text-center custom'
            >
              view
            </Link>
            <Link 
              to={`edit/${itemAllInfoUser.id}`} 
              className='nav-link fw-normal border border-info text-info text-capitalize w-100 text-center custom'
            >
              edit
            </Link>
            <Dropdown.Item className='p-0'>
              <Button 
                variant='outline-info' 
                className='p-2 text-capitalize w-100 rounded-0'
                type='button'
                onClick={() => setShowCfrmModal(true)}
              >
                delete
              </Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  )
};

AdminItem.propTypes = {
  currentUser: PropTypes.func,
  itemAllInfoUser: PropTypes.object,
  setShowCfrmModal: PropTypes.func
};

export default AdminItem;