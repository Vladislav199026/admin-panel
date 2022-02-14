import React from 'react';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ModalResultAction(props) {
  const {setShow} = props;

  return (
    <Alert 
      variant='success' 
      onClose={() => {
        setShow(false); 
        sessionStorage.removeItem('informModal');
      }} 
      dismissible
    >
      <Alert.Heading className='m-0'>Well done! Admin was {sessionStorage.informModal}</Alert.Heading>
    </Alert>
  )
};

ModalResultAction.propTypes = {
  setShow: PropTypes.func
};

export default ModalResultAction;