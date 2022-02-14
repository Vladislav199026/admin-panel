import React, { useState } from 'react';
import './assets/scss/main.scss';
import { Routes, Route, Navigate} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import PageNotFound from './pages/NotFoundPage/PageNotFound';
import AdminPage from './pages/AdminPage/AdminPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import LoginPage from './pages/LogInPage/LoginPage';
import EditPage from './pages/EditPage/EditPage';
import Layout from './pages/Layout/Layout';
import AdminLayout from './pages/AdminLayout/AdminLayout';
import ViewAdmin from './pages/ViewPage/ViewAdmin';

function App() {
  const [accessToken, setAccessToken] = useState(!!sessionStorage.accessToken);
	const [userName, setUserName] = useState(sessionStorage.userInfo)

  return (
    <>
      <Container className='py-4 min-vh-100'>
        <Routes>
          {
            accessToken ?
              <>
                <Route path='/' element={<Layout setAccessToken={setAccessToken} userName={userName} />}>
                  <Route index element={<Navigate to='admin' replace />} />
                  <Route path='admin' element={<AdminLayout />}>
                    <Route index element={<AdminPage setAccessToken={setAccessToken} />} />
                    <Route path='edit/:id' element={<EditPage setUserName={setUserName} />} />
                    <Route path='view/:id' element={<ViewAdmin />} />
                  </Route>
                  <Route path='registration' element={<RegistrationPage />} />
                </Route>
                <Route path='*' element={<PageNotFound />} />
              </>
              :
              <>
                <Route path='/' element={<LoginPage setAccessToken={setAccessToken}/>} />
                <Route path='/*' element={<Navigate to='/' replace />} />
              </>
          }
        </Routes>
      </Container>
    </>
  )
};

export default App;