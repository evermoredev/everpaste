const getCookie = (name) => {
  name = name + '=';
  let c = document.cookie,
    idx = c.indexOf(name),
    len = name.length;

  return (idx > -1) ? c.substring(idx + len, c.indexOf(';', idx)) : false;
};

export default getCookie;
