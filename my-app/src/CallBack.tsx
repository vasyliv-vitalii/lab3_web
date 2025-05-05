import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Define the type for the decoded token
interface DecodedToken {
  owner: string;
  name: string;
  createdTime: string;
  updatedTime: string;
  id: string;
  type: string;
  password: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  countryCode: string;
  region: string;
  affiliation: string;
  title: string;
  score: number;
  karma: number;
  ranking: number;
  isAdmin: boolean;
  isForbidden: boolean;
  isDeleted: boolean;
  tokenType: string;
  tag: string;
  scope: string;
  azp: string;
  iss: string;
  sub: string;
  aud: string[];
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
}

const CallbackPage = () => {
  const [user, setUser] = useState<DecodedToken | null>(null); // Define the type for the state

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      // Decode the token
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log(decodedToken); // This will log the decoded token
      setUser(decodedToken); // Set the decoded token as user
    }
  }, []);

  return (
    <div>
      <h1>Callback Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.type}</p>
          <img src={user.avatar} alt="User Avatar" />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CallbackPage;
