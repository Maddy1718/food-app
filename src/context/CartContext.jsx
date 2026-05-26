import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { AuthContext } from "./AuthContext";
import {
  fetchCartByCustomer,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart as clearCartService,
} from "../services/api/cartService";

export const CartContext = createContext();

function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        const savedCart = localStorage.getItem("cartItems");
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
        return;
      }

      const userRef = { authId: user.id, email: user.email };
      setLoadingCart(true);
      try {
        const { items } = await fetchCartByCustomer(userRef);
        const savedCart = localStorage.getItem("cartItems");
        const localCart = savedCart ? JSON.parse(savedCart) : [];

        if (items.length > 0) {
          setCartItems(items);
        } else if (localCart.length > 0) {
          setCartItems(localCart);
          for (const item of localCart) {
            await addCartItem(userRef, item, item.quantity || 1);
          }
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
        const savedCart = localStorage.getItem("cartItems");
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.id === item.id
    );

    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              total_price:
                (cartItem.total_price || 0) +
                (cartItem.price || item.price || 0),
            }
          : cartItem
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          ...item,
          quantity: 1,
          total_price: item.price || 0,
        },
      ];
    }

    setCartItems(updatedCart);

    if (user?.id) {
      const result = await addCartItem({ authId: user.id, email: user.email }, item, 1);
      if (result?.items) {
        setCartItems(result.items);
      }
      return;
    }
  };

  const removeFromCart = async (id) => {
    const selectedItem = cartItems.find((item) => item.id === id);

    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);

    if (user?.id && selectedItem?.cartItemId) {
      const result = await removeCartItem(selectedItem.cartItemId);
      if (result) {
        const { items } = await fetchCartByCustomer({ authId: user.id, email: user.email });
        setCartItems(items);
      }
      return;
    }
  };

  const increaseQuantity = async (id) => {
    const selectedItem = cartItems.find((item) => item.id === id);
    if (!selectedItem) return;

    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
            total_price:
              (item.total_price || 0) +
              (item.price || 0),
          }
        : item
    );
    setCartItems(updatedCart);

    if (user?.id && selectedItem?.cartItemId) {
      const result = await updateCartItemQuantity(
        selectedItem.cartItemId,
        selectedItem.quantity + 1
      );
      if (result) {
        const { items } = await fetchCartByCustomer({ authId: user.id, email: user.email });
        setCartItems(items);
      }
      return;
    }
  };

  const decreaseQuantity = async (id) => {
    const selectedItem = cartItems.find((item) => item.id === id);
    if (!selectedItem) return;

    const newQuantity = selectedItem.quantity - 1;
    const updatedCart = cartItems
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
              total_price:
                (item.total_price || 0) -
                (item.price || 0),
            }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updatedCart);

    if (user?.id && selectedItem?.cartItemId) {
      if (newQuantity <= 0) {
        await removeCartItem(selectedItem.cartItemId);
      } else {
        await updateCartItemQuantity(
          selectedItem.cartItemId,
          newQuantity
        );
      }
      const { items } = await fetchCartByCustomer({ authId: user.id, email: user.email });
      setCartItems(items);
      return;
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user?.id) {
      await clearCartService({ authId: user.id, email: user.email });
      return;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loadingCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
