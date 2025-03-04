import axios from "axios";
import AuthorizeView from "../Components/AuthorizeView.tsx";
import Copyright from "../Components/Copyright.tsx";
import { Container, Box, Stack, Typography, Link } from "@mui/material";

export default function Home() {
  const handleLogout = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Logout successful");
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    }
  };

  return (
    <AuthorizeView>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                <Link href="/" underline="none" color="inherit">
                  Sample App
                </Link>
              </Typography>
              <Link
                href="#"
                sx={{ minWidth: 100 }}
                onClick={(e) => handleLogout(e)}
              >
                Logout
              </Link>
            </Stack>
          </Box>
          <Typography variant="body1" component="p" sx={{ mb: 2 }}>
            Welcome to the Sample App! This application is designed to
            demonstrate the integration of Material-UI components with a React
            application. Explore the various features and components that we
            have implemented to help you get started with your own projects.
            Check out the new additions to the repository, including the ASP.NET
            Core backend, Docker setup, and database migrations, for more
            examples and features.
          </Typography>
          <Copyright />
        </Box>
      </Container>
    </AuthorizeView>
  );
}
