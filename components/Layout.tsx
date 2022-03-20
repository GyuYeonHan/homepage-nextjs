import { Box, Container } from "@mui/material";
import ButtonAppBar from "./ButtonAppBar";

export default function Layout({ children }) {
  return (
    <Container component="main" maxWidth="xs">
      <ButtonAppBar />
      <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 800,
      }}
      >
        {children}
      </Box>
    </Container>
  );
}
