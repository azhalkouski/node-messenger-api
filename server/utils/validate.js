const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const passwordRegexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

/**
 * @param {string} email
 * @returns {boolean}
 */
export const isEmailValid = email => emailRegexp.test(email);

/**
 * @param {string} password
 * @returns {boolean}
 */
export const isPasswordValid = password => passwordRegexp.test(password);
