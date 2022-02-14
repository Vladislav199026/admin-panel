import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import PropTypes from 'prop-types';

function Layout(props) {
  const {setAccessToken, userName} = props;

	return (
		<>
			<Navigation setAccessToken={setAccessToken}/>
			<p className='text-info text-center fs-2 mb-5'>Welcome back, <strong>{userName}</strong></p>
			<Outlet />
		</>
	)
};

Layout.propTypes = {
  setAccessToken: PropTypes.func,
  userName: PropTypes.string
};

export default Layout;