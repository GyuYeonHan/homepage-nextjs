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
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { AUTH_PATH, BASE_PATH } from "../../apiCall/base";
import { sessionState } from "../../atom/session";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, getValues } = useForm();
  const setSession = useSetRecoilState(sessionState);
  const [error, setError] = useState(false);

  axios.defaults.withCredentials = true;

  const onValid = () => {
    const data = getValues();
    axios
      .post(`${BASE_PATH}/${AUTH_PATH}/login`, data)
      .then((res) => {
        if (res) {
          const username = res.data.user.username;
          setSession({ connected: true, username: username });
        }
      })
      .catch();
    router.push(decodeURIComponent(router.query.redirectURL as string));
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
          {...register("password", { required: true })}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="로그인 정보 유지"
        />
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
