import fetchIntercept from 'fetch-intercept';
import { postRefreshToken } from '../fetchRequest/FetchRequest';

const origRequest = {};

fetchIntercept.register({
  request: function (url, config) {
    config.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
    };
    config.credentials = 'include';
    origRequest.url = url;
    origRequest.config = config;
    return [url, config];
  },

  requestError: function (error) {
    return Promise.reject(error);
  },

  response: async function (response) { 
    if (response.status === 401) {
      const {url, config} = origRequest;
      const responseRefreshToken = await postRefreshToken();
      if (!responseRefreshToken.success) {
        return Promise.reject(responseRefreshToken);
      } else {
        const accessToken = await responseRefreshToken.data.accessToken;
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
        sessionStorage.setItem('accessToken', accessToken);
        return fetch(url, config);
      }
    } else {
      return response;
    }
  },

  responseError: function (error) {
    return Promise.reject(error);
  }
});