import React from "react";
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { updateTotalMarketCap } from '../actions';

export const SocketContext = React.createContext({
  prices: {}
});

export const useWebsocket = () => React.useContext(SocketContext);

export class WrappedSocketManager extends React.Component {

  state = {
    prices: {}
  }

  socket = null;

  constructor (props) {

    this.socket = io.connect(process.env.NODE_ENV === 'development'
      ? `http://localhost:8200/`
      : `http://192.180.4.102:8200/`
      , {
        transports: ['websocket'],
        rejectUnauthorized: false,
        secure: true
      });

    this.socket.on('receive prices', (payload) => {

      // Redux store updates
      this.props.updateTotalMarketCap(payload.stats.total_market_cap);

      // Component state updates
      this.setState({
        prices: payload.markets
      });
    });
  }

  componentWillUnmount () {
    try {
      this.socket !== null && this.socket.disconnect();
    } catch (e) {
      // socket not connected
    }
  }

  render () {
    return (
      <SocketContext.Provider value={{
        prices: this.state.prices
      }}>
        {this.props.children}
      </SocketContext.Provider>
    );
  }
}


const mapDispatchToProps = {
  updateTotalMarketCap
};

export const SocketManager = connect(
  null,
  mapDispatchToProps
)(WrappedSocketManager);

export default SocketManager;