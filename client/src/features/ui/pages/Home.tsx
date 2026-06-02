import background from "../../../assets/Background.jpg";

export default function Home() {
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p
        style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "4rem",
          color: "white",
          margin: 0,
        }}
      >
        New Travel Vibes
      </p>
    </div>
  );
}
