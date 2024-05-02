'use client'

import NavigationBar from "./components/NavigationBar";
import User from "./components/User";
import Movies from "./components/Movies";

export default function Home() {

  return (

    <div style={{
      backgroundImage: `url(/hogwarts-wireless.jpeg)`,
      backgroundSize: 'cover', backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <User setUserId={(id) => console.log(id)} />
      <NavigationBar changeNavigation={(option) => {console.log(option)}}/>
      {/* <Movies /> */}
    </div>
  );
}
