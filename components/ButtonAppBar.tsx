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
import { Avatar } from "@mui/material";
import { Person } from "@mui/icons-material";

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

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name[0]}`,
    };
  }

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
          <Avatar {...stringAvatar(session.username)} />
          <IconButton size="medium" color="inherit">
            <Person />
          </IconButton>
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
      <SideBar open={open} handleDrawerClose={handleDrawerClose} />
    </Box>
  );
}
