import cookie from 'cookie';

export const setCookie = (k, v, maxAge = 315360000) => {
  document.cookie = cookie.serialize(String(k), String(v), {
    maxAge
  });
};

export const getCookie = (k) => {
  let cookies = cookie.parse(document.cookie);
  return cookies[k];
};
