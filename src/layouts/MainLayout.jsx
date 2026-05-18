import Navbar
  from "../components/Navbar";

function MainLayout({
  children,
}) {

  return (

    <div>

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <div
        style={{
          padding: "20px",
        }}
      >

        {children}

      </div>

    </div>
  );
}

export default MainLayout;