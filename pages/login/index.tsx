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
import { sessionState } from "../../atom/session";
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

    if (session.userId != "-1") {
      if (redirectURL === "undefined") {
        router.push("/");
      } else {
        router.push(redirectURL);
      }
    }
  }, []);

  const onValid = () => {
    const data = getValues();
    const redirectURL = decodeURIComponent(router.query.redirectURL as string);
    axios
      .post(`${BASE_PATH}/${AUTH_PATH}/login`, data)
      .then((res) => {
        setSession({
          connected: true,
          username: null,
          userId: "-1",
        });

        if (redirectURL === "undefined") {
          router.push("/");
        } else {
          router.push(redirectURL);
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
        로그인
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
          label="아이디"
          name="loginId"
          autoComplete="loginId"
          autoFocus
          error={idError}
          helperText={idError ? "아이디가 올바르지 않습니다." : null}
          {...register("loginId", { required: true })}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="비밀번호"
          type="password"
          id="password"
          autoComplete="current-password"
          error={pwError}
          helperText={pwError ? "비밀번호가 올바르지 않습니다." : null}
          {...register("password", { required: true })}
        />
        {/* <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="로그인 정보 유지"
        /> */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
        >
          로그인
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
