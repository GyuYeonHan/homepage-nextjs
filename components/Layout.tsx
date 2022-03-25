import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRecoilState } from "recoil";
import { openSidebarState } from "../atom/sidebar";
import MyAppBar from "./MyAppBar";
import SideBar from "./SideBar";

export const DRAWER_WIDTH = 240;

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
    marginLeft: `${DRAWER_WIDTH}px`,
  }),
}));

export default function Layout({ children }) {
  const [openSidebar, setOpenSidebar] = useRecoilState(openSidebarState);

  const handleDrawerClose = () => {
    setOpenSidebar(false);
  };

  return (
    <>
      <MyAppBar
        open={openSidebar}
        handleDrawerOpen={() => setOpenSidebar(true)}
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
    </>
  );
}
