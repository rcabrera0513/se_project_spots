// utils/Api.js

class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
  headers: {
    authorization: "f68a5f4c-877a-4883-a993-ebbc32a66d1e"
  }
})
  .then(res => res.json())
  }

  // other methods for working with the API
}

export default Api; 