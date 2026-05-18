import {
  Link,
} from "react-router-dom";

function RestaurantCard({
  restaurant,
}) {

  const fallbackImage =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop";

  return (

    <Link
      to={`/restaurant/${restaurant.id}`}

      style={{
        textDecoration:
          "none",

        color:
          "inherit",
      }}
    >

      <div
        style={{
          background:
            "white",

          borderRadius:
            "20px",

          overflow:
            "hidden",

          boxShadow:
            "0 2px 12px rgba(0,0,0,0.08)",

          transition:
            "0.3s",

          cursor:
            "pointer",
        }}
      >

        {/* IMAGE */}
        <img
          src={
            restaurant.image ||
            fallbackImage
          }

          alt={restaurant.name}

          onError={(e) => {
            e.target.src =
              fallbackImage;
          }}

          style={{
            width: "100%",
            height: "220px",
            objectFit:
              "cover",
          }}
        />

        {/* CONTENT */}
        <div
          style={{
            padding:
              "18px",
          }}
        >

          <h2
            style={{
              margin: 0,
              marginBottom:
                "10px",

              fontSize:
                "24px",

              color:
                "#222",
            }}
          >

            {restaurant.name}

          </h2>

          <p
            style={{
              color:
                "#777",

              marginBottom:
                "14px",
            }}
          >

            {restaurant.cuisine}

          </p>

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",
            }}
          >

            <span
              style={{
                background:
                  "#ff6b00",

                color:
                  "white",

                padding:
                  "6px 12px",

                borderRadius:
                  "8px",

                fontWeight:
                  "600",
              }}
            >

              ⭐ {restaurant.rating}

            </span>

          </div>

        </div>

      </div>

    </Link>
  );
}

export default RestaurantCard;