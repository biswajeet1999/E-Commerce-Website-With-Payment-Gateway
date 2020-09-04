import API from "../../backend";

export const createOrder = (userId, token, orders) => {
  return fetch(`${API}/order/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ order: orders })
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};
