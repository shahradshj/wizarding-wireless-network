import Image from "next/image";

export default function Home() {
  return (
    <div style={{
      textAlign: "center",
      backgroundImage: `url(/hogwarts-wireless.jpeg)`,
      backgroundSize: 'cover', backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <h1>Welcome to the Wizarding Wireless Network</h1>
      <p>
        Home Streaming Service for Witches and Wizards
      </p>
    </div>
  );
}
