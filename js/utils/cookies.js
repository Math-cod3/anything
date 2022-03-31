export function setCookie(name, value, days, customExpiration) {
  let expires = '';
  if (customExpiration) {
    expires = `; expires=${customExpiration}`;
  }
  else if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/`;
}

export function deleteCookie(name) {
  setCookie(name, '', -1);
}

export function getCookie(name) {
  const nameEq = name + '=';
  const cookies = document.cookie.split(';');
  const len = cookies.length;
  let i = 0;
  for (; i < len; i++) {
    let cookie = cookies[i];
    const len = cookie.length;
    while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, len);
    if (cookie.indexOf(nameEq) == 0) return cookie.substring(nameEq.length, len);
  }
  return null;
}

export function deleteAllCookies() {
  const cookies = document.cookie.split(';');
  const len = cookies.length;
  let i = 0;
  for (; i < len; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
