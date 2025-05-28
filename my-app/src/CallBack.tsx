import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from 'socket.io-client';
import "./CallBack.css";
import { Trade } from "./protobuf/generated/trade";

interface ServerUser {
  name: string;
  displayName: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}

const CallbackPage = () => {
  const [user, setUser] = useState<ServerUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [prices, setPrices] = useState<{ [symbol: string]: number }>({});
  
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const connectionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://localhost:3000/auth/casdoor/profile", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      alert("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const startBinanceConnection = async () => {
    try {
      const res = await axios.get("https://localhost:3000/binance/start");
      console.log("Binance connection start:", res.data);
      connectSocket();
    } catch (error) {
      console.error("Failed to start Binance connection:", error);
      alert("Failed to start Binance connection.");
    }
  };

  const stopBinanceConnection = async () => {
    try {
      const res = await axios.get("https://localhost:3000/binance/stop");
      console.log("Binance connection stop:", res.data);
      disconnectSocket();
    } catch (error) {
      console.error("Failed to stop Binance connection:", error);
      alert("Failed to stop Binance connection.");
    }
  };

  const connectSocket = () => {
    if (socketRef.current || connectionStatus !== "disconnected") return;

    setConnectionStatus("connecting");
    
    socketRef.current = io('http://localhost:8080', {
      path: '/socket.io',
      transports: ['websocket'],
      autoConnect: true,
      reconnection: false
    });

    connectionTimeoutRef.current = window.setTimeout(() => {
      if (!socketRef.current?.connected) {
        disconnectSocket();
        alert("Connection timeout. Please try again.");
      }
    }, 5000);

    socketRef.current.on('connect', () => {
      clearTimeout(connectionTimeoutRef.current!);
      setConnectionStatus("connected");
    });

    socketRef.current.on('tradeData', (data: ArrayBuffer) => {
      try {
        const message = Trade.decode(new Uint8Array(data));
        setPrices(prev => ({
          ...prev,
          [message.coin]: parseFloat(message.price),
        }));
      } catch (error) {
        console.error("Error decoding protobuf:", error);
      }
    });

    socketRef.current.on('disconnect', () => {
      setConnectionStatus("disconnected");
    });

    socketRef.current.on('connect_error', (err) => {
      console.error("Connection error:", err);
      setConnectionStatus("disconnected");
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnectionStatus("disconnected");
  };

  return (
    <div className="mainCallBackContainer">
      <h1>Callback Page</h1>

      <button 
        className="loadUserButton" 
        onClick={fetchProfile} 
        disabled={loading}
      >
        {loading ? "Loading..." : "Load User from Cookie"}
      </button>

      <div className="connection-controls">
        <button
          className={`wsButton ${connectionStatus}`}
          onClick={startBinanceConnection}
          disabled={connectionStatus !== "disconnected"}
        >
          {connectionStatus === "connected"
            ? "Connected ✅"
            : connectionStatus === "connecting"
            ? "Connecting... ⏳"
            : "Start Connection"}
        </button>

        <button
          className="wsDisconnectButton"
          onClick={stopBinanceConnection}
          disabled={connectionStatus !== "connected"}
        >
          Stop Connection ⛔
        </button>
      </div>

      {Object.keys(prices).length > 0 && (
        <div className="wsData">
          <h3>📈 Binance Prices</h3>
          <ul>
            {Object.entries(prices).map(([symbol, price]) => (
              <li key={symbol}>
                {symbol}: <strong>{price.toFixed(4)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {user && (
        <div className="user-profile">
          <div className="avatar-container">
            <img 
              src={user.avatar} 
              alt="User Avatar" 
              className="user-avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'fallback-avatar.png';
              }}
            />
          </div>
          <div className="user-info">
            <h2>{user.displayName}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.isAdmin ? "Administrator 👑" : "Regular User 👤"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallbackPage;