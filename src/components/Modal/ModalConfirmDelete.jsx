import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../api/fetchRequest/FetchRequest';

function ModalConfirmDelete(props) {
  const {
    fullUserInfo,
    showCfrmModal,
    setShowCfrmModal,
    setError,
    setAccessToken
  } = props;
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  const removeUser = async () => {
    try {
      if (+fullUserInfo.id === +userId) {
        await deleteUser(fullUserInfo.id);
        setShowCfrmModal(false);
        sessionStorage.clear();
        setAccessToken(false);
      } else {
        await deleteUser(fullUserInfo.id);
        sessionStorage.setItem('informModal', 'deleted');
        setShowCfrmModal(false);
        navigate('/');
      };
    } catch (e) {
      setError(e.message);
    };
  };

  return (
    <Modal
      show={showCfrmModal}
      onHide={() => setShowCfrmModal(false)}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Body>
        <h3>Are you sure?</h3>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant='outline-info' 
          onClick={removeUser}
        >
          yes, delete
        </Button>
        <Button 
          variant='outline-info'
          onClick={() => setShowCfrmModal(false)}
        >
          cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

ModalConfirmDelete.propTypes = {
  fullUserInfo: PropTypes.object,
  setShowCfrmModal: PropTypes.func,
  showCfrmModal: PropTypes.bool,
  setError: PropTypes.func,
  setAccessToken: PropTypes.func
};

export default ModalConfirmDelete;