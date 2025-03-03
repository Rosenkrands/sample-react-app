import Copyright from "../Components/Copyright.tsx";
import { Container, Box, Stack, Typography, Link } from "@mui/material";

export default function Home() {
  return (
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
              Sample App
            </Typography>
            <Stack direction={"row"} spacing={2}>
              <Link href="/" underline="hover" sx={{ minWidth: 100 }}>
                Home
              </Link>
              <Link href="/" underline="hover" sx={{ minWidth: 100 }}>
                Contact
              </Link>
              <Link href="/" underline="hover" sx={{ minWidth: 100 }}>
                About Us
              </Link>
            </Stack>
          </Stack>
        </Box>
        <Typography variant="body1" component="p" sx={{ mb: 2 }}>
          Welcome to the Sample App! This application is designed to demonstrate
          the integration of Material-UI components with a React application.
          Explore the various features and components that we have implemented
          to help you get started with your own projects.
        </Typography>
        <Copyright />
      </Box>
    </Container>
  );
}
