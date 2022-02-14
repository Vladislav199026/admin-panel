import React, { useEffect, useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ModalConfirmDelete from '../../components/Modal/ModalConfirmDelete';
import AdminList from '../../components/AdminList/AdminList';
import SortingControlAdminList from '../../components/SortingControlAdminList/SortingControlAdminList';
import Spinner from '../../components/Spinner/Spinner';
import { getUsers } from '../../api/fetchRequest/FetchRequest';

function AdminPage(props) {
  const {setAccessToken} = props;
  const [searchValue, setSearchValue] = useState('');
  const [searchForPagination, setSearchForPagination] = useState('');
  const [stateSort, setStateSort] = useState({email: true, userName: true})
  const [radioValue, setRadioValue] = useState('email');
  const [amountPosts, setAmountPosts] = useState(5);
  const [showCfrmModal, setShowCfrmModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [users, setUsers] = useState({});
  const [fullUserInfo, setFullUserInfo] = useState({});
  const [error, setError] = useState(false);

  const getData = useCallback((data) => {
    setUsers(data);
  }, []);

  const getRqst = useCallback(async () => {
    setIsFetching(true);
    setError(false);
    try {
      const resp = await getUsers(`?limit=${amountPosts}&page=1`);
      getData({...resp.data});
    } catch (e) {
      setError(e.message);
    };
    setIsFetching(false);
  }, [amountPosts, getData]);

  useEffect(() => { 
    getRqst();
  }, [getRqst]); 
  
  const currentUser = (e, itemAllInfoUser) => {
    e.preventDefault();
    setFullUserInfo(itemAllInfoUser);
  };

  const toggleRadioValue = (e) => {
    setRadioValue(e.target.value);
  };

  return (
    <Container className='my-4 p-0'>
      <SortingControlAdminList 
        amountPosts={String(amountPosts)}
        isFetching={isFetching}
        searchValue={searchValue}
        toggleRadioValue={toggleRadioValue}
        radioValue={radioValue}
        setAmountPosts={setAmountPosts}
        setSearchForPagination={setSearchForPagination}
        setIsFetching={setIsFetching}
        setSearchValue={setSearchValue}
        setStateSort={setStateSort}
        getData={getData}
        setError={setError}
      />
      {
        showCfrmModal ?
          <ModalConfirmDelete 
            showCfrmModal={showCfrmModal}
            setShowCfrmModal={setShowCfrmModal}
            fullUserInfo={fullUserInfo}
            setError={setError}
            setAccessToken={setAccessToken}
          />
          :
          null
      }
      {
        isFetching ?
          <Spinner />
          :
          error ?
            error && <p className='text-danger text-center'>{error}</p>
            :
            users.data && <AdminList 
              users={users}
              getData={getData}
              amountPosts={Number(amountPosts)}
              currentUser={currentUser}
              setShowCfrmModal={setShowCfrmModal}
              stateSort={stateSort}
              searchForPagination={searchForPagination}
            />
      }
    </Container>
  )
};

AdminPage.propTypes = {
  setAccessToken: PropTypes.func
};

export default AdminPage;