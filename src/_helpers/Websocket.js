import React, { createContext } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { updateNotifications } from '../_actions';
import { getAccessToken } from '_helpers/globalVariables';
import { BASE_URL_CLOUD, BASE_URL_LOCAL } from 'constants/api';

const { NODE_ENV } = process.env;
const WebSocketContext = createContext(null);

export { WebSocketContext };

export default ({ children }) => {
  let socket;
  let ws;
  let WS_BASE = NODE_ENV === 'development' ? BASE_URL_LOCAL : BASE_URL_CLOUD;
  let token = getAccessToken();

  const dispatch = useDispatch();

  if (!socket) {
    socket = io.connect(`${WS_BASE}/ws/websocket`, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      secure: true,
    });

    socket.on('/user/queue/notify', (msg) => {
      const payload = JSON.parse(msg);
      // console.log('my message notification is in', payload);
      dispatch(updateNotifications(payload));
    });
    ws = {
      socket: socket,
    };
  }
  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
