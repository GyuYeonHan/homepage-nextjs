import { useState, useEffect, useRef } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { sessionState, SESSION_STATUS } from "../atom/session";
import { useRouter } from "next/router";
import axios from "axios";
import { AUTH_PATH, BASE_PATH } from "../apiCall/base";
import { Person } from "@mui/icons-material";
import AccountMenu from "./AccountMenu";
import CustomizedSnackbar from "./CustomizedSnackbar";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { DRAWER_WIDTH } from "./Layout";
import MyNoticeMenu, { INotice } from "./MyNoticeMenu";
import { fetchUnreadNoticeOfUser } from "../apiCall/notice";
import { useQuery } from "react-query";
import { Badge, Skeleton } from "@mui/material";

interface MyAppBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  backgroundColor: "#AF8666",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  marginLeft: `400px`,
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function MyAppBar(props: MyAppBarProps) {
  const { open, handleDrawerOpen } = props;
  const [session, setSession] = useRecoilState(sessionState);
  const router = useRouter();

  axios.defaults.withCredentials = true;

  const getSession = () => {
    axios
      .get(`${BASE_PATH}/${AUTH_PATH}/session`)
      .then((res) => {
        // console.log(res, session);
        if (session.status == SESSION_STATUS.INITIAL) {
          if (res.data.loggedIn) {
            setSession({
              status: SESSION_STATUS.CONNECTED,
              userId: res.data.userId,
              username: res.data.username,
            });
            refetch();
          } else {
            setSession({
              status: SESSION_STATUS.NOSESSION,
              userId: null,
              username: null,
            });
          }
        } else if (session.status == SESSION_STATUS.NOSESSION) {
          if (res.data.loggedIn) {
            setSession({
              status: SESSION_STATUS.CONNECTED,
              userId: res.data.userId,
              username: res.data.username,
            });
            refetch();
          }
        } else if (session.status == SESSION_STATUS.PRECONNECTED) {
          setSession({
            status: SESSION_STATUS.CONNECTED,
            userId: res.data.userId,
            username: res.data.username,
          });
          refetch();
        } else {
          if (!res.data.loggedIn) {
            setSession({
              status: SESSION_STATUS.NOSESSION,
              userId: null,
              username: null,
            });
          }
        }
      })
      .catch();
  };

  const callLogoutAPI = () => {
    axios
      .post(`${BASE_PATH}/${AUTH_PATH}/logout`)
      .then((res) => {
        if (res) {
          setSession({
            status: SESSION_STATUS.NOSESSION,
            username: null,
            userId: null,
          });
          setOpenLogoutSnackbar(true);
        }
      })
      .catch((error) => console.log(error));
  };

  const { data, isError, error, refetch } = useQuery<INotice[]>(
    "UnreadNoticeList",
    () => fetchUnreadNoticeOfUser(session.userId),
    { enabled: false }
  );

  // For Account Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openAccountMenu = Boolean(anchorEl);
  const handleAccountMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  // For Notice Menu
  const [openNoticeMenu, setOpenNoticeMenu] = useState<boolean>(false);
  const [noticeList, setNoticeList] = useState<INotice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const anchorRef = useRef<HTMLButtonElement>(null);

  // For Snackbar
  const [openLogoutSnackbar, setOpenLogoutSnackbar] = useState(false);
  const [openLoginSnackbar, setOpenLoginSnackbar] = useState(false);

  useEffect(getSession, []);
  useEffect(getSession, [session]);
  useEffect(() => {
    if (data !== undefined) {
      setNoticeList(data);
      setIsLoading(false);
    }
  }, [data]);

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              <a>YS Academy</a>
            </Link>
          </Typography>
          {session.status === SESSION_STATUS.CONNECTED ? (
            <>
              {isLoading ? (
                <Skeleton variant="circular" width={40} height={40} />
              ) : (
                <>
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => {
                      setOpenNoticeMenu((prevOpen) => !prevOpen);
                    }}
                    ref={anchorRef}
                  >
                    <Badge badgeContent={noticeList.length} color="primary">
                      <NotificationsNone />
                    </Badge>
                  </IconButton>
                  <MyNoticeMenu
                    open={openNoticeMenu}
                    setOpen={setOpenNoticeMenu}
                    anchorRef={anchorRef}
                    noticeList={noticeList}
                  />
                </>
              )}
              <IconButton
                size="large"
                color="inherit"
                onClick={handleAccountMenuClick}
              >
                <Person />
              </IconButton>
              <AccountMenu
                openAccountMenu={openAccountMenu}
                handleClose={handleAccountMenuClose}
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
        open={openLoginSnackbar}
        setOpen={setOpenLoginSnackbar}
        severity="info"
        message="로그인 되었습니다."
      />
      <CustomizedSnackbar
        open={openLogoutSnackbar}
        setOpen={setOpenLogoutSnackbar}
        severity="info"
        message="로그아웃 되었습니다."
      />
    </>
  );
}
