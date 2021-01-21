import axios from "axios";
import * as actionTypes from "./actionTypes";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (isSignup) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    isSignup: isSignup,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_ERROR,
    error: error,
  };
};

export const authGoBackToForm = () => {
  return {
    type: actionTypes.AUTH_GO_BACK,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authCheckIfLoggedIn = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      dispatch(authSuccess(false));
    }
  };
};

export const auth = (
  username,
  password,
  isSignup,
  closeHandler = null,
  firstName = null,
  lastName = null,
  email = null,
  subscriptions = null,
  lists = null
) => {
  return (dispatch) => {
    let authData = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email,
      subscriptions: subscriptions,
      lists: lists,
    };
    let url = "http://localhost:5000/api/users/signup";
    if (!isSignup) {
      url = "http://localhost:5000/api/users/login";
      authData = {
        username: username,
        password: password,
      };
    }
    axios
      .post(url, authData)
      .then((response) => {
        dispatch(authSuccess(isSignup));
        if (!isSignup && closeHandler) {
          localStorage.setItem("token", response.data);
          console.log(closeHandler);
          closeHandler();
        } else if (!isSignup && !closeHandler) {
          localStorage.setItem("token", response.data);
        }
      })
      .catch((err) => {
        dispatch(authFail(err.response.data.message));
      });
  };
};
