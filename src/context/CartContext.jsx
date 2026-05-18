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

      setLoadingCart(true);
      try {
        const { items } = await fetchCartByCustomer(user.id);
        const savedCart = localStorage.getItem("cartItems");
        const localCart = savedCart ? JSON.parse(savedCart) : [];

        if (items.length > 0 || localCart.length === 0) {
          setCartItems(items);
        } else {
          for (const item of localCart) {
            await addCartItem(user.id, item, item.quantity || 1);
          }
          const updated = await fetchCartByCustomer(user.id);
          setCartItems(updated.items);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (item) => {
    if (user?.id) {
      const result = await addCartItem(user.id, item, 1);
      if (result?.items) {
        setCartItems(result.items);
      }
      return;
    }

    const existingItem = cartItems.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
                total_price:
                  (cartItem.total_price || 0) +
                  (cartItem.price || item.price || 0),
              }
            : cartItem
        )
      );
      return;
    }

    setCartItems([
      ...cartItems,
      {
        ...item,
        quantity: 1,
        total_price: item.price || 0,
      },
    ]);
  };

  const removeFromCart = async (id) => {
    const selectedItem = cartItems.find((item) => item.id === id);

    if (user?.id && selectedItem?.cartItemId) {
      await removeCartItem(selectedItem.cartItemId);
      const { items } = await fetchCartByCustomer(user.id);
      setCartItems(items);
      return;
    }

    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const increaseQuantity = async (id) => {
    const selectedItem = cartItems.find((item) => item.id === id);
    if (!selectedItem) return;

    if (user?.id && selectedItem?.cartItemId) {
      await updateCartItemQuantity(
        selectedItem.cartItemId,
        selectedItem.quantity + 1
      );
      const { items } = await fetchCartByCustomer(user.id);
      setCartItems(items);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              total_price:
                (item.total_price || 0) +
                (item.price || 0),
            }
          : item
      )
    );
  };

  const decreaseQuantity = async (id) => {
    const selectedItem = cartItems.find((item) => item.id === id);
    if (!selectedItem) return;

    const newQuantity = selectedItem.quantity - 1;

    if (user?.id && selectedItem?.cartItemId) {
      if (newQuantity <= 0) {
        await removeCartItem(selectedItem.cartItemId);
      } else {
        await updateCartItemQuantity(
          selectedItem.cartItemId,
          newQuantity
        );
      }
      const { items } = await fetchCartByCustomer(user.id);
      setCartItems(items);
      return;
    }

    setCartItems(
      cartItems
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
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = async () => {
    if (user?.id) {
      await clearCartService(user.id);
      setCartItems([]);
      return;
    }
    setCartItems([]);
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
