import {
  AUTH_ERROR_TYPE,
  CREATE_USER_ERROR_TYPE,
  CREATE_CHAT_BY_EMAIL_ERROR_TYPE,
} from '../constants';

export const authErrorMessage = {
  type: AUTH_ERROR_TYPE,
  message: {
    email: '',
    password: '',
  }
};

export const createUserErrorMessage = {
  type: CREATE_USER_ERROR_TYPE,
  message: {
    email: '',
    password: '',
  }
};

export const createChatByEmailErrorMessage = {
  type: CREATE_CHAT_BY_EMAIL_ERROR_TYPE,
  message: {
    email: '',
    password: '',
  }
};
