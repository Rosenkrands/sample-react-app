import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";

const UserContext = createContext({});

interface User {
  email: string;
}

export default function AuthorizeView({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigate = useNavigate();
  const emptyUser: User = { email: "" };
  const [user, setUser] = useState<User>(emptyUser);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  function wait(delay: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  useEffect(() => {
    let retryCount = 0;
    let maxRetries = 10;
    let delay = 1000;

    async function axiosGetWithRetry(url: string) {
      try {
        const response = await axios.get(url, { withCredentials: true });

        if (response.status === 200) {
          console.log("Authorized");
          return response;
        } else if (response.status === 401) {
          console.error("Unauthorized");
          return response;
        } else {
          throw new Error("Unexpected response: " + response.status);
        }
      } catch (error) {
        retryCount++;
        if (retryCount > maxRetries) {
          throw error;
        } else {
          console.log("Retrying in " + delay + "ms...");
          await wait(delay);
          return axiosGetWithRetry(url);
        }
      }
    }

    axiosGetWithRetry("http://localhost:4000/pingauth")
      .then((response) => {
        if (response.status === 200) {
          setAuthorized(true);
          console.log(response.data);
        } else {
          console.error("Unauthorized");
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (authorized && !loading) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }

  return <Navigate to="/login" />;
}
