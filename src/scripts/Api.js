// utils/Api.js

class Api {
  constructor(baseURL, headers) {
    this._baseURL = baseURL;
    this._headers = headers;
  }

  getUserInfo() {
    return fetch("${this._baseURL}/users/me", {
      headers: this._headers,
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      });
  }
}

  getInitialCards() {
    return fetch("${this._baseURL}/cards", {
    headers: this._headers,
    })
    .then(res => {
      if (res.ok) {
         return res.json();
       }
       return Promise.reject(`Error: ${res.status}`);
    });
  }

    getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  editUserInfo({ name, about }) {
  return fetch(`${this._baseURL}/users/me`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  .then(res => {
      if (res.ok) {
         return res.json();
       }
       return Promise.reject(`Error: ${res.status}`);
    });
  });
}

  editAvatarInfo({ avatar }) {
  return fetch(`${this._baseURL}/users/me/avatar`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({
      avatar
    })
  .then(res => {
      if (res.ok) {
         return res.json();
       }
       return Promise.reject(`Error: ${res.status}`);
    });
})
}

export default Api; 