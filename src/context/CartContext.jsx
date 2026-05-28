import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthContext,
} from "./AuthContext";

import {
  fetchCartByCustomer,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../services/api/cartService";

export const CartContext =
  createContext();

const CartProvider =
  ({ children }) => {

    const { user } =
      useContext(AuthContext);

    const [cartItems, setCartItems] =
      useState([]);

    const [loading, setLoading] =
      useState(false);

    // LOAD CART
    useEffect(() => {

      const loadCart =
        async () => {

          try {

            if (!user) {

              setCartItems([]);

              return;
            }

            setLoading(true);

            const response =
              await fetchCartByCustomer({
                authId:
                  user.id,

                email:
                  user.email,
              });

            setCartItems(
              response?.items ||
                []
            );

          } catch (err) {

            console.error(
              "Load cart error:",
              err
            );

          } finally {

            setLoading(false);
          }
        };

      loadCart();

    }, [user]);

    // ADD ITEM
    const addToCart =
      async (item) => {

        try {

          if (!user) {

            alert(
              "Please login first"
            );

            return;
          }

          // LOCAL UPDATE
          setCartItems(
            (prev) => {

              const existing =
                prev.find(
                  (i) =>
                    i.id ===
                    item.id
                );

              // INCREASE
              if (existing) {

                return prev.map(
                  (i) =>
                    i.id ===
                    item.id
                      ? {
                          ...i,
                          quantity:
                            i.quantity +
                            1,
                        }
                      : i
                );
              }

              // NEW ITEM
              return [
                ...prev,
                {
                  ...item,
                  quantity: 1,
                },
              ];
            }
          );

          // DB SYNC
          await addCartItem(
            {
              authId:
                user.id,

              email:
                user.email,
            },
            item,
            1
          );

        } catch (err) {

          console.error(
            "Add cart error:",
            err
          );
        }
      };

    // INCREASE
    const increaseQuantity =
      async (itemId) => {

        const updated =
          cartItems.map(
            (item) =>
              item.id === itemId
                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      1,
                  }
                : item
          );

        setCartItems(updated);

        const updatedItem =
          updated.find(
            (i) =>
              i.id === itemId
          );

        if (
          updatedItem?.cartItemId
        ) {

          await updateCartItemQuantity(
            updatedItem.cartItemId,
            updatedItem.quantity
          );
        }
      };

    // DECREASE
    const decreaseQuantity =
      async (itemId) => {

        const existing =
          cartItems.find(
            (i) =>
              i.id === itemId
          );

        if (!existing)
          return;

        // REMOVE
        if (
          existing.quantity <=
          1
        ) {

          removeFromCart(
            itemId
          );

          return;
        }

        const updated =
          cartItems.map(
            (item) =>
              item.id === itemId
                ? {
                    ...item,
                    quantity:
                      item.quantity -
                      1,
                  }
                : item
          );

        setCartItems(updated);

        const updatedItem =
          updated.find(
            (i) =>
              i.id === itemId
          );

        if (
          updatedItem?.cartItemId
        ) {

          await updateCartItemQuantity(
            updatedItem.cartItemId,
            updatedItem.quantity
          );
        }
      };

    // REMOVE
    const removeFromCart =
      async (itemId) => {

        const existing =
          cartItems.find(
            (i) =>
              i.id === itemId
          );

        setCartItems(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !==
                itemId
            )
        );

        if (
          existing?.cartItemId
        ) {

          await removeCartItem(
            existing.cartItemId
          );
        }
      };

    // CLEAR
    const clearCartItems =
      async () => {

        setCartItems([]);

        if (!user)
          return;

        await clearCart({
          authId:
            user.id,

          email:
            user.email,
        });
      };

    return (

      <CartContext.Provider
        value={{
          cartItems,
          loading,
          addToCart,
          increaseQuantity,
          decreaseQuantity,
          removeFromCart,
          clearCart:
            clearCartItems,
        }}
      >

        {children}

      </CartContext.Provider>
    );
  };

export default CartProvider;