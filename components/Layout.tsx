import { Box } from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/styles";
import { useRecoilState } from "recoil";
import { openSidebarState } from "../atom/sidebar";
import MyAppBar from "./MyAppBar";
import SideBar from "./SideBar";

const drawerWidth = 240;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `0px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

export default function Layout({ children }) {
  const theme = createTheme({});
  const [openSidebar, setOpenSidebar] = useRecoilState(openSidebarState);

  const handleDrawerClose = () => {
    setOpenSidebar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <MyAppBar
        position="fixed"
        open={openSidebar}
        handleDrawerOpen={() => setOpenSidebar(true)}
        handleDrawerClose={handleDrawerClose}
      />
      <SideBar open={openSidebar} handleDrawerClose={handleDrawerClose} />
      {/* <Container maxWidth="xs"> */}
      <Main open={openSidebar}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: 600,
            pt: 12,
          }}
        >
          <Box sx={{ width: "xs", maxWidth: "xs" }}>{children}</Box>
        </Box>
      </Main>
      {/* </Container> */}
    </ThemeProvider>
  );
}
