import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, Row, Col, Container, Button } from 'react-bootstrap';
import { ReactComponent as ArrowUpIcon } from '../../assets/svg/arrow_up_icon.svg';
import { ReactComponent as ArrowDownIcon } from '../../assets/svg/arrow_down_icon.svg';
import { getUsers } from '../../api/fetchRequest/FetchRequest';
import ModalResultAction from '../Modal/ModalResultAction';

function SortingControlAdminList(props) {
  const {
    amountPosts,
    isFetching,
    searchValue,
    toggleRadioValue,
    radioValue,
    setAmountPosts,
    setSearchForPagination,
    setIsFetching,
    setSearchValue,
    setStateSort,
    getData,
    setError
  } = props;
  const [stateSvg, setStateSvg] = useState({mailSvg: null, userSvg: null});
  const [stateSortName, setStateSortName] = useState(true);
  const [stateSortEmail, setStateSortEmail] = useState(true);
	const [show, setShow] = useState(false);
  const searchInput = useRef(searchValue);
	const informMsg = sessionStorage.getItem('informModal');

  useEffect(() => {
		if (informMsg) {
			setShow(true);
		};
	}, [informMsg]);

  const amountValuePosts = (e) => {
    setAmountPosts(e.target.value);
    setStateSvg({mailSvg: null, userSvg: null});
    setStateSortName(true);
    setStateSortEmail(true);
  };
  
  const findSearchValue = async () => {
    setIsFetching(true);
    setError(false);
    try {
      const resp = await getUsers(`?limit=${amountPosts}&page=1&filter=${radioValue}||$cont||${searchValue}`);
      getData({...resp.data});
    } catch (e) {
      setError(e.message);
    };
    setIsFetching(false);
    setStateSvg({mailSvg: null, userSvg: null});
    setStateSortName(true);
    setStateSortEmail(true);
  };

  const clearFindSearchValue = async () => {
    setIsFetching(true);
    setSearchValue('');
    setError(false);
    try {
      const resp = await getUsers(`?limit=${amountPosts}&page=1`);
      getData({...resp.data});
    } catch (e) {
      setError(e.message);
    };
    searchInput.current.value = '';
    setIsFetching(false);
  };

  const filter = async (e) => {
    setIsFetching(true);
    switch (e.target.name) {
      case 'userName':
        if (stateSvg.userSvg) {
          setStateSvg({mailSvg: null, userSvg: false});
        } else {
          setStateSvg({mailSvg: null, userSvg: true});
        };
        setStateSort({email: true, userName: stateSortName});
        setStateSortName(!stateSortName);
        setSearchForPagination(e.target.name);
        setError(false);
        try {
          const resp = await getUsers(`?limit=${amountPosts}&page=1&sort=${e.target.name},${stateSortName ? 'ASC' : 'DESC'}`);
          getData({...resp.data});
        } catch (e) {
          setError(e.message);
        };
        setIsFetching(false);
        break;

      case 'email':
        if (stateSvg.mailSvg) {
          setStateSvg({mailSvg: false, userSvg: null});
        } else {
          setStateSvg({mailSvg: true, userSvg: null});
        };
        setStateSort({email: stateSortEmail, userName: true});
        setStateSortEmail(!stateSortEmail);
        setSearchForPagination(e.target.name);
        setError(false);
        try {
          const resp = await getUsers(`?limit=${amountPosts}&page=1&sort=${e.target.name},${stateSortEmail ? 'ASC' : 'DESC'}`);
          getData({...resp.data});
        } catch (e) {
          setError(e.message);
        };
        setIsFetching(false);
        break;

      default: break;
    }
  };

  return (
    <Container className='p-0 pb-3 mb-5 border-bottom border-secondary'>
      {show && <ModalResultAction setShow={setShow} />}
      <Row className='justify-content-between align-items-start mb-3'>  
        <Col md={6} lg={5} className='mb-3 d-flex align-items-center'>
          <p className='text-white-50 me-2 mb-0'>Amount of posts per page: </p>
          <Form.Select 
            aria-label='Default select' 
            className='w-auto' 
            onChange={amountValuePosts}
          >
            <option>5</option>
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </Form.Select>
        </Col>
        <Col md={6} lg={4}>
          <Row>
            <Col className='d-flex mb-3'>
              <FormControl
                type='search'
                placeholder='Search...'
                className='w-100'
                onChange={(e) => setSearchValue(e.target.value)}
                ref={searchInput}
              />
              <Button 
                variant='outline-info'
                type='button'
                className={`${searchValue && !isFetching ? '' : 'disabled'} text-capitalize w-auto ms-2`}
                onClick={findSearchValue}
              >
                find
              </Button>
              <Button 
                variant='outline-info'
                type='button'
                className={`${searchValue ? '' : 'disabled'} text-capitalize w-auto ms-2`}
                onClick={clearFindSearchValue}
              >
                clear
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className='d-flex flex-wrap'>
              <Form.Check
                inline
                label='by email'
                type='radio'
                onChange={toggleRadioValue}                        
                checked={radioValue === 'email'}
                name='sorting'
                value='email'
                className='form-check-label text-white-50 me-3'
                id='email' 
              />
              <Form.Check
                inline
                label='by userName'
                type='radio'
                onChange={toggleRadioValue}
                checked={radioValue === 'userName'}
                name='sorting'
                value='userName'
                className='form-check-label text-white-50'
                id='userName' 
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className='p-3'>
        <Col sm={6} md={4} className='offset-lg-2 p-0'>
          <Button 
            variant='outline-dark'
            type='button'
            className={`${isFetching ? 'disabled' : ''} text-white-50 text-capitalize fs-5 p-0 mb-2`}
            onClick={(e) => filter(e)}
            name='email'
          >
            email {(stateSvg.mailSvg === null) ? '' : (stateSvg.mailSvg === false) ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </Button>
        </Col>
        <Col sm={6} md={4} className='p-0'>
          <Button 
            variant='outline-dark'
            type='button'
            className={`${isFetching ? 'disabled' : ''} text-white-50 text-capitalize fs-5 p-0 mb-2`}
            onClick={(e) => filter(e)}
            name='userName'
          >
            userName {(stateSvg.userSvg === null) ? '' : (stateSvg.userSvg === false) ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </Button>
        </Col>
      </Row>
    </Container>
  )
};

SortingControlAdminList.propTypes = {
  setSearchValue: PropTypes.func,
  toggleRadioValue: PropTypes.func,
  radioValue: PropTypes.string,
  setAmountPosts: PropTypes.func,
  amountPosts: PropTypes.string,
  searchValue: PropTypes.string,
  isFetching: PropTypes.bool,
  setSearchForPagination: PropTypes.func,
  setIsFetching: PropTypes.func,
  setStateSort: PropTypes.func,
  getData: PropTypes.func,
  setError: PropTypes.func
};

export default SortingControlAdminList;