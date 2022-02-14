function basicURL(endpoint) {
  return `https://api.dev.nodejs.practice.abcloudz.com/${endpoint}`
};

const signIn = () => basicURL('api/v1/admin/sign-in');
const signOut = () => basicURL('api/v1/admin/sign-out');
const refreshToken = () => basicURL('api/v1/admin/refresh-token');
const createUser = () => basicURL('api/v1/admin');
const delUser = (id) => basicURL(`api/v1/admin/${id}`);
const changeUser = (id) => basicURL(`api/v1/admin/${id}`);
const getUser = (endpoint) => basicURL(`api/v1/admin/${endpoint}`);

const getOption = {method: 'GET'};
const postOption = {method: 'POST'};
const deleteOption = {method: 'DELETE'};
const patchOption = {method: 'PATCH'};

export const postSignIn = async (data) => {
  return fetch(signIn(), {
    ...postOption,
    body: JSON.stringify(data)
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message || 'somthing went wrong')
      }; 
      return data;
    })
};

export const postSignOut = async () => {
  return fetch(signOut(), postOption)
};

export const postCreateUser = async (data) => {
  return fetch(createUser(), {
    ...postOption,
    body: JSON.stringify(data)
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message || 'somthing went wrong')
      };
      return data; 
    })
};

export const postRefreshToken = async () => {
  return fetch(refreshToken(), postOption)
    .then(async (response) => {
      const data = await response.json();
      return data; 
    })
};

export const deleteUser = async (id) => {
  return fetch(delUser(id), deleteOption)
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message || 'somthing went wrong')
      };
      return data;
    })
};

export const patchUser = async (data, id) => {
  return fetch(changeUser(id), {
    ...patchOption,
    body: JSON.stringify(data)
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message || 'somthing went wrong')
      };
      return data;
    })
};

export const getUsers = async (endpoint) => {
  return fetch(getUser(endpoint), getOption)
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message || 'somthing went wrong')
      };
      return data; 
    })
};