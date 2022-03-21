import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { sessionState } from "../atom/session";
import { useRouter } from "next/router";
import axios from "axios";
import { AUTH_PATH, BASE_PATH } from "../apiCall/base";
import SideBar from "./SideBar";
import { Person } from "@mui/icons-material";
import AccountMenu from "./AccountMenu";
import CustomizedSnackbar from "./CustomizedSnackbar";

export default function ButtonAppBar() {
  const [session, setSession] = useRecoilState(sessionState);
  const router = useRouter();
  axios.defaults.withCredentials = true;

  const getSession = () => {
    axios
      .get(`${BASE_PATH}/${AUTH_PATH}/session`)
      .then((res) => {
        console.log(res.data);
        if (res.data.loggedIn) {
          setSession({ connected: true, username: res.data.username });
        }
      })
      .catch();
  };

  const callLogoutAPI = () => {
    axios
      .post(`${BASE_PATH}/${AUTH_PATH}/logout`)
      .then((res) => {
        if (res) {
          setSession({ connected: false, username: null });
          setOpenSnackbar(true);
        }
      })
      .catch((error) => console.log(error));
  };

  const [openSideBar, setOpenSideBar] = useState(false);

  const handleDrawerOpen = () => {
    setOpenSideBar(true);
  };

  const handleDrawerClose = () => {
    setOpenSideBar(false);
  };

  // For Account Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openAccountMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // For Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(getSession, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              <a>용석 아카데미</a>
            </Link>
          </Typography>
          {session.connected ? (
            <>
              <IconButton size="medium" color="inherit" onClick={handleClick}>
                <Typography>{session.username}</Typography>
                <Person />
              </IconButton>
              <AccountMenu
                openAccountMenu={openAccountMenu}
                handleClose={handleClose}
                anchorEl={anchorEl}
                callLogoutAPI={callLogoutAPI}
                session={session}
              />
            </>
          ) : (
            <Button color="inherit">
              <Link
                href={{
                  pathname: "/login",
                  query: { redirectURL: router.pathname },
                }}
              >
                <a>로그인</a>
              </Link>
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <CustomizedSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity="info"
        message="로그아웃 되었습니다."
      />
      <SideBar open={openSideBar} handleDrawerClose={handleDrawerClose} />
    </Box>
  );
}
