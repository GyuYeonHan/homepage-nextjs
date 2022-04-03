import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRecoilState } from "recoil";
import { openSidebarState } from "../atom/sidebar";
import MyAppBar from "./MyAppBar";
import SideBar from "./SideBar";

export const DRAWER_WIDTH = 240;

const Main = styled(Container, {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `0px`,
  width: "100vw",
  minWidth: "100vw",
  height: "100vh",
  minHeight: "100vh",
  marginTop: "64px",
  // backgroundColor: "red",
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${DRAWER_WIDTH}px`,
  }),
}));

export default function Layout({ children }) {
  const [openSidebar, setOpenSidebar] = useRecoilState(openSidebarState);

  return (
    <>
      <MyAppBar
        open={openSidebar}
        handleDrawerOpen={() => setOpenSidebar(true)}
      />
      <SideBar
        open={openSidebar}
        handleDrawerClose={() => setOpenSidebar(false)}
      />
      <Main open={openSidebar}>
        <Box
          sx={{
            height: "90%",
            // bgcolor: "blue",
          }}
        >
          {children}
        </Box>
      </Main>
    </>
  );
}
