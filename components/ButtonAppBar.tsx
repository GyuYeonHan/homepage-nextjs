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
import { BASE_PATH } from "../apiCall/base";
import SideBar from "./SideBar";

export default function ButtonAppBar() {
  const [session, setSession] = useRecoilState(sessionState);
  const router = useRouter();
  axios.defaults.withCredentials = true;

  const callLogoutAPI = () => {
    axios
      .post(`${BASE_PATH}/api/auth/logout`)
      .then((res) => {
        if (res) {
          console.log(res);
          setSession({ connected: false, username: null });
          router.push("/");
        }
      })
      .catch((error) => console.log(error));
  };

  const getSession = () => {
    axios
      .get(`${BASE_PATH}/api/auth/session`)
      .then((res) => {
        console.log(res.data);
        if (res.data.loggedIn) {
          setSession({ connected: true, username: res.data.username });
        }
      })
      .catch();
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    console.log(mobileOpen);
  };

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
            onClick={() => handleDrawerToggle()}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              <a>용석 아카데미</a>
            </Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 50 }}>
            <Link href="/board">
              <a>게시판</a>
            </Link>
          </Typography>
          <Button color="inherit">
            {session.connected ? (
              <Link href="/">
                <a onClick={callLogoutAPI}>로그아웃</a>
              </Link>
            ) : (
              <Link href="/login">
                <a>로그인</a>
              </Link>
            )}
          </Button>
        </Toolbar>
      </AppBar>
      <SideBar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
    </Box>
  );
}
