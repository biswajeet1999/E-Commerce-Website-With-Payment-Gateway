export const addItem = (item, next) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.push({ ...item, count: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    next();
  }
};

export const loadCart = () => {
  if (localStorage.getItem("cart")) {
    return JSON.parse(localStorage.getItem("cart"));
  }
};

export const removeItemFromCart = (prodId, next) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
      let updatedCart = cart.filter((item, index) => {
        return item._id !== prodId;
      });

      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  }
};

export const cartEmpty = next => {
  if (typeof window !== undefined) {
    localStorage.removeItem("cart");
    next();
  }
};
