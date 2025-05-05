import React, { useEffect, useState } from "react";
import axios from "axios";

interface ServerUser {
  name: string;
  displayName: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}

const CallbackPage = () => {
  const [user, setUser] = useState<ServerUser | null>(null);

  useEffect(() => {
    axios
      .get("https://localhost:3000/auth/casdoor/profile", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user profile", err);
      });
  }, []);

  return (
    <div>
      <h1>Callback Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Display Name: {user.displayName}</p>
          <p>Role: {user.isAdmin ? "Admin" : "User"}</p>
          <img src={user.avatar} alt="User Avatar" width={100} />
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default CallbackPage;
