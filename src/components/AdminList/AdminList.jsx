import React, { useState, useEffect, useMemo } from 'react';
import { Container, Pagination, Row} from 'react-bootstrap';
import PropTypes from 'prop-types';
import AdminItem from '../AdminItem/AdminItem';
import { getUsers } from '../../api/fetchRequest/FetchRequest';
import Spinner from '../Spinner/Spinner';

function AdminList(props) {
  const { 
    users,
    getData,
    amountPosts,
    currentUser,
    setShowCfrmModal,
    stateSort,
    searchForPagination
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(Math.ceil(users.total / amountPosts));
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPageLimit(Math.ceil(users.total / amountPosts));
    setCurrentPage(1);
  }, [amountPosts, users.total]);

  const pagePagination = async (e) => {
    const { name, textContent } = e.currentTarget;
    let stateForPagination;
    let page = currentPage;

    if (searchForPagination === 'email') {
      stateForPagination = stateSort.email;
    } else if (searchForPagination === 'userName') {
      stateForPagination = stateSort.userName;
    };

    switch (name) {
      case 'firstPage':
        page = 1;
        break;

      case 'lastPage':
        page = users.pageCount;
        break;

      case 'previousPage':
        page = currentPage - 1;
        break;

      case 'nextPage':
        page = currentPage + 1;
        break;

      case 'currentPage':
        page = Number(textContent);
        break;

      default: break; 
    };
    setCurrentPage(page);

    if (Number(textContent) !== currentPage) {
      setIsFetching(true);
      setError(false);
      try {
        const resp = await getUsers(`?limit=${amountPosts}&page=${page}${searchForPagination ? `&sort=${searchForPagination},${stateForPagination ? 'ASC' : 'DESC'}` : ''}`, getData);
        getData({...resp.data});
      } catch (e) {
        setError(e.message);
      };
      setIsFetching(false)
    };
  };

  const getPaginationGroup = useMemo(() => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    const newArr = new Array(pageLimit).fill().map((_, index) => start + index + 1);
    return newArr;
  }, [currentPage, pageLimit]);
  
  return (
    <Container>
      {
        isFetching ?
          <Spinner />
          :
          error ?
            error && <p className='text-danger text-center'>{error}</p>
            :
            <>
              <Row>
              {
                users.data.length > 0 ?
                  users.data.map((item) => (
                    <AdminItem
                      currentUser={currentUser}
                      key={item.id}
                      itemAllInfoUser={item}
                      setShowCfrmModal={setShowCfrmModal}
                    />
                  ))
                  :
                  <p className='text-info text-center text-capitalize fs-5'>not found</p>
              }
              </Row>
              <Row>
              {
                (users.pageCount > 1) && <Pagination className='justify-content-center pagination-list'>
                    <Pagination.First 
                      onClick={pagePagination}
                      className={`${currentPage === 1 ? 'disabled' : ''}`}
                      name='firstPage'
                    />
                    <Pagination.Prev 
                      onClick={pagePagination}
                      className={`${currentPage === 1 ? 'disabled' : ''}`}
                      name='previousPage'
                    />
                    {
                      getPaginationGroup.map((item, index) => (
                        <Pagination.Item
                          className={`${currentPage === item ? 'active' : ''} pagination-list__item`}
                          key={index}
                          onClick={pagePagination}
                          name='currentPage'
                        >
                          {item}
                        </Pagination.Item>
                      ))
                    }
                    <Pagination.Next 
                      onClick={pagePagination}
                      className={`${(currentPage === users.pageCount) ? 'disabled' : ''}`}
                      name='nextPage'
                    />
                    <Pagination.Last 
                      onClick={pagePagination}
                      className={`${(currentPage === users.pageCount) ? 'disabled' : ''}`}
                      name='lastPage'
                    />
                  </Pagination>
                }
              </Row>
            </>
      }
    </Container>
  )
};

AdminList.propTypes = {
  users: PropTypes.object,
  amountPosts: PropTypes.number,
  currentUser: PropTypes.func,
  getData: PropTypes.func,
  setShowCfrmModal: PropTypes.func,
  stateSort: PropTypes.object,
  searchForPagination: PropTypes.string
};

export default AdminList;