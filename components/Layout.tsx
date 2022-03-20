import { Box, Container } from "@mui/material";
import ResponsiveDrawer from "../pages/test";
import ButtonAppBar from "./ButtonAppBar";

export default function Layout({ children }) {
  return (
    <Container component="main">
      <ButtonAppBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // justifyContent: "center",
          height: 600,
          pt: 12,
        }}
      >
        <Box sx={{ width: 800 }}>{children}</Box>
      </Box>
    </Container>
  );
}
