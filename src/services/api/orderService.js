import { supabase } from "../supabase";

// RESOLVE CUSTOMER ID
const resolveCustomerId =
  async ({
    authId,
    email,
  }) => {

    try {

      // FIND BY AUTH ID
      if (authId) {

        const {
          data: customerByAuth,
        } = await supabase

          .from("customer")

          .select("*")

          .eq(
            "auth_id",
            authId
          )

          .single();

        if (
          customerByAuth
        ) {

          return customerByAuth.id;
        }
      }

      // FIND BY EMAIL
      if (email) {

        const {
          data: customerByEmail,
        } = await supabase

          .from("customer")

          .select("*")

          .eq(
            "email",
            email
          )

          .single();

        // EMAIL EXISTS
        if (
          customerByEmail
        ) {

          // UPDATE AUTH ID IF EMPTY
          if (
            !customerByEmail.auth_id &&
            authId
          ) {

            await supabase

              .from("customer")

              .update({
                auth_id:
                  authId,
              })

              .eq(
                "id",
                customerByEmail.id
              );
          }

          return customerByEmail.id;
        }

        // CREATE NEW CUSTOMER
        const {
          data: newCustomer,
          error: createError,
        } = await supabase

          .from("customer")

          .insert([
            {
              auth_id:
                authId,

              email:
                email,

              customer_name:
                email.split(
                  "@"
                )[0],
            },
          ])

          .select()

          .single();

        if (createError) {

          console.error(
            "Create customer error:",
            createError
          );

          return null;
        }

        return newCustomer.id;
      }

      return null;

    } catch (err) {

      console.error(
        "Resolve customer crash:",
        err
      );

      return null;
    }
  };

// CREATE ORDER
export const createOrder =
  async ({
    user,
    cartItems,
  }) => {

    try {

      // LOGIN CHECK
      if (!user) {

        alert(
          "Please login first"
        );

        return null;
      }

      // EMPTY CART CHECK
      if (
        !cartItems?.length
      ) {

        alert(
          "Cart is empty"
        );

        return null;
      }

      // CUSTOMER ID
      const customerId =
        await resolveCustomerId({
          authId:
            user.id,
          email:
            user.email,
        });

      if (!customerId) {

        alert(
          "Customer record not found"
        );

        return null;
      }

      // PRICE CALCULATIONS
      const subtotal =
        cartItems.reduce(
          (sum, item) =>
            sum +
            Number(
              item.price
            ) *
              item.quantity,
          0
        );

      const deliveryFee =
        subtotal > 0
          ? 40
          : 0;

      const platformFee =
        5;

      const gstAmount =
        subtotal * 0.05;

      const packingCharge =
        10;

      const totalPrice =
        subtotal +
        deliveryFee +
        platformFee +
        gstAmount +
        packingCharge;

      // RESTAURANT
      const restaurantId =
        cartItems[0]
          ?.restaurant_id;

      // CREATE ORDER
      const {
        data,
        error,
      } = await supabase

        .from(
          "placed_order"
        )

        .insert([
          {
            customer_email:
              user.email,

            restaurant_id:
              restaurantId,

            customer_id:
              customerId,

            order_time:
              new Date(),

            delivery_address:
              "Customer Address",

            price:
              subtotal,

            discount:
              0,

            total_price:
              totalPrice,

            delivery_fee:
              deliveryFee,

            platform_fee:
              platformFee,

            gst_amount:
              gstAmount,

            packing_charge:
              packingCharge,

            order_status:
              "Pending",
          },
        ])

        .select()

        .single();

      // ORDER ERROR
      if (error) {

        console.error(
          "Create order error:",
          error
        );

        alert(
          error.message
        );

        return null;
      }

      return data;

    } catch (err) {

      console.error(
        "Create order crash:",
        err
      );

      alert(
        err.message
      );

      return null;
    }
  };

// FETCH ORDERS
export const fetchOrders =
  async (user) => {

    try {

      if (!user?.email) {
        return [];
      }

      const {
        data,
        error,
      } = await supabase

        .from(
          "placed_order"
        )

        .select(`
          *,
          restaurant (
            id,
            restaurant_name,
            image_url
          )
        `)

        .eq(
          "customer_email",
          user.email
        )

        .order(
          "order_time",
          {
            ascending: false,
          }
        );

      if (error) {

        console.error(
          "Fetch orders error:",
          error
        );

        return [];
      }

      return data || [];

    } catch (err) {

      console.error(
        "Fetch orders crash:",
        err
      );

      return [];
    }
  };

// UPDATE ORDER STATUS
export const updateOrderStatus =
  async (
    orderId,
    status
  ) => {

    try {

      const {
        data,
        error,
      } = await supabase

        .from(
          "placed_order"
        )

        .update({
          order_status:
            status,
        })

        .eq(
          "id",
          orderId
        )

        .select()

        .single();

      if (error) {

        console.error(
          "Update order error:",
          error
        );

        return null;
      }

      return data;

    } catch (err) {

      console.error(
        "Update order crash:",
        err
      );

      return null;
    }
  };