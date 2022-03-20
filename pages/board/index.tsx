import { Search } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Input,
  InputAdornment,
  InputBase,
  Pagination,
  Paper,
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
import { BASE_PATH, POST_PATH } from "../../apiCall/base";
import { fetchAllPostList } from "../../apiCall/post";

export default function Board() {
  const [write, setWrite] = useState(false);
  const { register, handleSubmit, getValues } = useForm();
  const { isLoading, isError, data, error } = useQuery(
    "AllpostList",
    fetchAllPostList
  );
  const queryClient = useQueryClient();

  axios.defaults.withCredentials = true;

  const callPostSaveAPI = () => {
    const formData = getValues();
    axios
      .post(`${BASE_PATH}/${POST_PATH}`, formData)
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
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const savePostForm = (
    <form onSubmit={handleSubmit(callPostSaveAPI)}>
      <Box sx={{ my: 2 }}>
        <TextField
          id="post-title"
          variant="standard"
          fullWidth
          {...register("title", { required: true })}
        />
      </Box>
      <Box sx={{ my: 2 }}>
        <TextField
          id="post-content"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          {...register("content", { required: true })}
        />
      </Box>
      <ButtonGroup variant="contained">
        <Button type="submit">작성</Button>
        <Button onClick={() => setWrite(false)}>취소</Button>
      </ButtonGroup>
    </form>
  );

  return (
    <Box>
      <Typography component="h2" variant="h2">
        게시판
      </Typography>
      {write ? (
        <Box sx={{ width: 1 }}>{savePostForm}</Box>
      ) : (
        <Box>
          <Button
            variant="text"
            onClick={() => setWrite(true)}
            sx={{ float: "right" }}
          >
            새 글 쓰기
          </Button>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">No.</TableCell>
                  <TableCell align="center">제목</TableCell>
                  <TableCell align="center">작성자</TableCell>
                  <TableCell align="center">최종 수정일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((post) => (
                  <TableRow
                    key={post.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {post.id}
                    </TableCell>
                    <TableCell align="center">
                      <Link href={`/board/${post.id}`}>
                        <a>{post.title}</a>
                      </Link>
                    </TableCell>
                    <TableCell align="center">{post.username}</TableCell>
                    <TableCell align="center">{post.modifiedDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              my: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination count={10} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Input
              placeholder="Search…"
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
