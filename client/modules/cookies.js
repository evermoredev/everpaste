import cookie from 'cookie';

const maxAge = 315360000;

/**
 * Takes in a cookies object or array of objects with name, value, and maxAge
 * @param cookies
 */
export const setCookies = (cookies) => {
  if (!Array.isArray(cookies)) {
    cookies = [cookies];
  }
  cookies.forEach(c => {
    document.cookie = cookie.serialize(String(c.name), String(c.value), {
      maxAge: c.maxAge || maxAge
    });
  });
};

export const getCookie = (k) => {
  let cookies = cookie.parse(document.cookie);
  return cookies[k];
};
