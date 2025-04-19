/**
 * Utility to set/remove the auth token in axios defaults
 */
const setAuthToken = (token) => {
  if (token) {
    // Apply the token to all requests
    localStorage.setItem('token', token);
  } else {
    // Remove the token from localStorage
    localStorage.removeItem('token');
  }
};

export default setAuthToken;