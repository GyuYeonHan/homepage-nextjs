import {
  Box,
  Button,
  Container,
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
    return <span>Loading...</span>;
  }

  return (
    <Box>
      {write ? (
        <Box>
          <form onSubmit={handleSubmit(callPostSaveAPI)}>
            <TextField
              id="outlined-basic"
              label="제목"
              variant="outlined"
              {...register("title", { required: true })}
            />
            <br />
            <TextField
              id="outlined-basic"
              label="내용"
              variant="outlined"
              multiline
              {...register("content", { required: true })}
            />
            <hr />
            <div className="my-2">
              <button className="border-0 rounded w-20 h-10 bg-black hover:bg-red-400 text-white">
                작성
              </button>
              <button
                onClick={() => setWrite(false)}
                className="border-2 rounded w-20 h-10 bg-white hover:bg-white/70 text-black"
              >
                취소
              </button>
            </div>
          </form>
        </Box>
      ) : (
        <Box>
          <Typography component="h2" variant="h2">
            게시판
          </Typography>
          <Button
            variant="text"
            onClick={() => setWrite(true)}
            sx={{ float: "right" }}
          >
            새 글 쓰기
          </Button>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
        </Box>
      )}
    </Box>
  );
}
