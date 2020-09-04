import API from "../backend";

export const signup = user => {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

export const signin = user => {
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(res => {
      return new Promise((resolve, rej) => {
        resolve(res.json());
      });
    })
    .catch(
      err =>
        new Promise((res, rej) => {
          rej(err);
        })
    );
};

// this sets the token into user browser
export const authenticate = (data, next) => {
  if (typeof window !== undefined) {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

export const signout = next => {
  if (typeof window !== undefined) {
    localStorage.removeItem("jwt");
    next();
    // TODO: add token here
    return fetch(`${API}/signout`, {
      method: "GET"
    })
      .then(res => console.log("signout"))
      .catch(err => console.log(err));
  }
};

export const isAuthenticated = () => {
  if (typeof window !== "undefined" && localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
