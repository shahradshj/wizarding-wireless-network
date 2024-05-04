
import App from "./components/App";

export default function Home({ searchParams }) {

  return (
    <div style={{
      backgroundImage: `url(/hogwarts-wireless.jpeg)`,
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      justifyContent: 'center',
      width: '100vw',
      minHeight: '100vh',
      maxWidth: '100%'
    }}>
      <App searchParams={searchParams}/>
    </div>
  );
}
