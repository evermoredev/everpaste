/**
 * Use native xhr
 * @param opt
 * @returns {Promise}
 */
export const doRequest = (opt) => {
  let { method, url, params, headers } = opt;
  // Default to GET
  method = method || 'GET';

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Parse the response if it's valid JSON
        try {
          resolve(JSON.parse(xhr.response));
        } catch(e) {
          resolve(xhr.response);
        }
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      }
    };

    xhr.onerror = () => {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };

    if (method.toLowerCase() == 'post')
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Set additional headers if they exist
    Object.keys(headers || {})
      .forEach((k) => xhr.setRequestHeader(k, headers[k]));

    // Set params if they exist
    params = Object.keys(params || {})
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');

    console.log(method, url, params, headers);

    xhr.send(params);
  });

};
