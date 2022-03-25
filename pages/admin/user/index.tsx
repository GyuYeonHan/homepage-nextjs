import {
  Box,
  Button,
  ButtonGroup,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { BASE_PATH, USER_PATH } from "../../../apiCall/base";
import { fetchAllUserList } from "../../../apiCall/user";
import MyBackdrop from "../../../components/MyBackdrop";

export default function User() {
  const [write, setWrite] = useState(false);
  const { register, handleSubmit, getValues } = useForm();
  const { isLoading, isError, data, error } = useQuery(
    "AllUserList",
    fetchAllUserList
  );
  const queryClient = useQueryClient();

  axios.defaults.withCredentials = true;

  const callUserSaveAPI = () => {
    const formData = getValues();
    axios
      .post(`${BASE_PATH}/${USER_PATH}`, formData)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        setWrite(false);
        queryClient.invalidateQueries();
      })
      .catch((error) => console.log(error));
  };

  if (isLoading) {
    return <MyBackdrop isLoading={isLoading} />;
  }

  return (
    <Box>
      <Typography component="h2" variant="h2">
        유저 관리
      </Typography>
      {write ? (
        <Box>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(callUserSaveAPI)}
          >
            <TextField
              id="user-username"
              type="text"
              variant="standard"
              label="이름"
              required
              {...register("username", { required: true })}
            />
            <TextField
              id="user-loginId"
              type="text"
              variant="standard"
              label="아이디"
              required
              {...register("loginId", { required: true })}
            />
            <TextField
              id="user-password"
              type="password"
              variant="standard"
              label="비밀번호"
              required
              {...register("password", { required: true })}
            />
            <Select
              id="user-role"
              label="role"
              required
              defaultValue={"ROLE_USER"}
              {...register("role", { required: true })}
            >
              <MenuItem value="ROLE_USER">일반 사용자</MenuItem>
              <MenuItem value="ROLE_STUDENT">학생</MenuItem>
              <MenuItem value="ROLE_TEACHER">선생님</MenuItem>
              <MenuItem value="ROLE_ADMIN">관리자</MenuItem>
            </Select>
            <Box sx={{ my: 2 }}>
              <ButtonGroup variant="contained">
                <Button type="submit">추가</Button>
                <Button onClick={() => setWrite(false)}>취소</Button>
              </ButtonGroup>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Button onClick={() => setWrite(true)}>유저 추가</Button>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">유저 번호</TableCell>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">권한</TableCell>
                  <TableCell align="center">가입일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {user.id}
                    </TableCell>
                    <TableCell align="center">
                      <Link href={`/user/${user.id}`}>
                        <a>{user.username}</a>
                      </Link>
                    </TableCell>
                    <TableCell align="center">{user.loginId}</TableCell>
                    <TableCell align="center">{user.role}</TableCell>
                    <TableCell align="center">{user.createdDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
