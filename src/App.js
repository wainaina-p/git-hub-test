import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { view as Loading } from './components/loading';
import { view as Home } from './views';
import Login from './views/auth/components/Login';
import { authRoutes } from './routes';
import { setAccessToken } from './_helpers/globalVariables';
import { userService } from './_services';
import { notification } from 'antd';
// import useSound from 'use-sound';
// import soundUrl from 'assets/appointment-notification.mp3';
// import soundUrl from 'assets/short-notification.mp3';

// const SOCKET_URL = `http://localhost:8500/ws-message?t=${localStorage.getItem(
//   'naks_token'
// )}`;

// localStorage.setItem(
//   'naks_token',
//   JSON.stringify(
//     'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYXRyaWNrIiwiaWF0IjoxNjc2NDcyMjEyLCJleHAiOjE2NzY0NzQwMTJ9.qf-Lr2GFlFahaPGhCzTFgBPqyxZq2r9vyEm5KY8D18s'
//   )
// );

function App() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('You server message here.');

  //  const soundUrl = '/sounds/glug-a.mp3';

  // const [playbackRate, setPlaybackRate] = React.useState(0.75);

  // const [play] = useSound(soundUrl, {
  //   playbackRate,
  //   volume: 0.5,
  // });
  // const [playActive] = useSound('./appointment-notification.mp3', {
  //   volume: 0.25,
  // });
  // const [playActive] = useSound(soundUrl, {
  //   playbackRate,
  //   volume: 0.5,
  // });

  useEffect(() => {
    console.log('Playing soundUrl:\n');
    // setPlaybackRate(playbackRate + 0.1);
    // play();
    // playActive();
  }, []);
  // useEffect(() => {
  //   if (localStorage.getItem('naks_token')) {
  //     userService
  //       .refreshToken()
  //       .then(async (res) => {
  //         const data = await res.data.access_token;
  //         console.log('Refresh data:\n', data);
  //         setAccessToken(data);

  //         endLoading();
  //       })
  //       .catch((err) => {
  //         endLoading();
  //       });
  //   } else {
  //     endLoading();
  //   }
  // }, []);

  // const endLoading = (params) => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // };

  // let onConnected = () => {
  //   console.log('Connected!!');
  // };

  // let onMessageReceived = (msg) => {
  //   setMessage(msg.message);
  //   // play();
  //   notification.open({
  //     message: 'Notice',
  //     description: msg.message,
  //     duration: 0,
  //     type: 'success',
  //     key: 'notice',
  //   });
  // };

  return (
    <div>
      <Loading />
      <Switch>
        {authRoutes.map((route, idx) => {
          return route.component ? (
            <Route
              key={idx}
              path={route.path}
              exact={route.exact}
              name={route.name}
              render={(props) => <route.component {...props} />}
            />
          ) : null;
        })}
        {localStorage.getItem('naks_token') ? (
          <Route path='/' name='Home' component={Home} />
        ) : (
          <Route path='/' name='Login' component={Login} />
        )}
      </Switch>
    </div>
  );
}

export default App;
