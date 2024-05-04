
import App from "./components/App";
import Movies from "./components/Movies";


export default function Home() {

  return (
    <div style={{
      backgroundImage: `url(/hogwarts-wireless.jpeg)`,
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100%',
      maxWidth: '100%'
    }}>
      <App>
        {{
          movies: <Movies />
        }}
      </App>
    </div>
  );
}
