import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { AUTH_PATH, BASE_PATH } from "../../apiCall/base";
import { sessionState, SESSION_STATUS } from "../../atom/session";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, getValues } = useForm();
  const [session, setSession] = useRecoilState(sessionState);
  const [idError, setIdError] = useState(false);
  const [pwError, setPwError] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const redirectURL = decodeURIComponent(router.query.redirectURL as string);

    if (session.status === SESSION_STATUS.CONNECTED) {
      if (redirectURL === "undefined") {
        router.push("/");
      } else {
        router.push(redirectURL);
      }
    }
  }, []);

  interface Ilogin {
    loginStatus: "LOGIN_SUCCESS" | "WRONG_ID" | "WRONG_PASSWORD";
    userId: string;
    username: string;
  }

  const onValid = () => {
    const data = getValues();
    const redirectURL = decodeURIComponent(router.query.redirectURL as string);
    axios
      .post(`${BASE_PATH}/${AUTH_PATH}/login`, data)
      .then((res) => {
        if (res.data.loginStatus === "LOGIN_SUCCESS") {
          setSession({
            status: SESSION_STATUS.PRECONNECTED,
            username: res.data.username,
            userId: res.data.userId,
          });

          if (redirectURL === "undefined") {
            router.push("/");
          } else {
            router.push(redirectURL);
          }
        }
      })
      .catch((error) => {
        if (error.response.status == "400") {
          const loginStatus = error.response.data.loginStatus;
          if (loginStatus === "WRONG_ID") {
            setIdError(true);
            setPwError(false);
          } else if (loginStatus === "WRONG_PASSWORD") {
            setIdError(false);
            setPwError(true);
          }
        } else {
          throw error;
        }
      });
  };

  return (
    <Box
      sx={{
        marginTop: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        ?????????
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onValid)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="?????????"
          name="loginId"
          autoComplete="loginId"
          autoFocus
          error={idError}
          helperText={idError ? "???????????? ???????????? ????????????." : null}
          {...register("loginId", { required: true })}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="????????????"
          type="password"
          id="password"
          autoComplete="current-password"
          error={pwError}
          helperText={pwError ? "??????????????? ???????????? ????????????." : null}
          {...register("password", { required: true })}
        />
        {/* <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="????????? ?????? ??????"
        /> */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
        >
          ?????????
        </Button>
        {/* <Grid container>
          <Grid item xs>
            <Link href="/">
              <a>Forgot password?</a>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/home">{"Don't have an account? Sign Up"}</Link>
          </Grid>
        </Grid> */}
      </Box>
    </Box>
  );
}
