import { useState, useEffect } from "react";
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
import { Person } from "@mui/icons-material";
import AccountMenu from "./AccountMenu";
import CustomizedSnackbar from "./CustomizedSnackbar";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { DRAWER_WIDTH } from "./Layout";

interface Props {
  openSidebar: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
}

interface AppBarProps extends MuiAppBarProps {
  openSidebar?: boolean;
}


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, openSidebar }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(openSidebar && {
    width: `calc(100% + ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function MyAppBar(props) {
  const { openSidebar, handleDrawerOpen, handleDrawerClose } = props;
  const [session, setSession] = useRecoilState(sessionState);
  const router = useRouter();

  axios.defaults.withCredentials = true;

  const getSession = () => {
    axios
      .get(`${BASE_PATH}/${AUTH_PATH}/session`)
      .then((res) => {
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
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
            sx={{ mr: 2, ...(openSidebar && { display: "inline" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              <a>YongSeok Academy</a>
            </Link>
          </Typography>
          {session.connected ? (
            <>
              <IconButton size="large" color="inherit" onClick={handleClick}>
                {/* <Typography>{session.username}</Typography> */}
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
                <a>Sign In</a>
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
    </>
  );
}
