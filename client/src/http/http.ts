import axios from 'axios';
import eventBus from '../events';
// import auth from '../auth0';

// variable is injected by DefinePlugin
declare let API_HOST: string;

const http = axios.create({
  baseURL: `${API_HOST}/api`,
  headers: {'Content-Type': 'application/json'},
  timeout: 10000,
});

// // Inject auth token interceptor
// http.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${auth.accessToken}`; // eslint-disable-line no-param-reassign
//   return config;
// });

// CAtch error interceptor
http.interceptors.response.use(
  response => response,
  error => {
    // getting error message
    let message = 'HTTP request failed';
    if (!error.response) {
      // response object is not provided, most likely Network Error
      if (error instanceof Error) {
        message = error.message; // eslint-disable-line prefer-destructuring
      }
    } else if (error.response.status === 404) {
      // do not notify on 404 errors
      return Promise.reject(error);
    } else if (error.response.data && error.response.data.error) {
      // Get error message from JSON response
      message = error.response.data.error;
    } else if (error.response.statusText) {
      // Or try statusText
      message = error.response.statusText;
    }

    // notify UI
    eventBus.$emit('http-error', {text: message});

    // // re-login on auth error
    // if (error.response && error.response.status === 401) {
    //   // Authorization error
    //   auth.login();
    // }
    return Promise.reject(error);
  },
);

export {http};
