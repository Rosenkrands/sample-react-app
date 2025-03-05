import { Box, Paper, CircularProgress, Typography, Stack } from "@mui/material";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router";

const UserContext = createContext({});

interface User {
  email: string;
}

export default function AuthorizeView({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const emptyUser: User = { email: "" };
  const [user, setUser] = useState<User>(emptyUser);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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
        setRetryCount(retryCount);
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
          setUser({ email: response.data?.email });
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
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
            <Typography variant="body2" color="textSecondary">
              Please wait while we verify your credentials.
            </Typography>
            <CircularProgress />
            <Typography variant="h6">Attempt {retryCount} of 10</Typography>
            <Typography variant="body2" color="textSecondary">
              If you know you are not signed in, please{" "}
              <a href="/signin">sign in</a>.
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  if (authorized && !loading) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }

  return <Navigate to="/signin" />;
}
