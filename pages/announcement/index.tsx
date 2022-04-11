import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Pagination,
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { BASE_PATH, POST_PATH } from "../../apiCall/base";
import { fetchAllAnnouncementPostList } from "../../apiCall/post";
import CustomizedSnackbar from "../../components/CustomizedSnackbar";
import MyBackdrop from "../../components/MyBackdrop";
import { IPost } from "../../interface/IPost";

export default function Board() {
  const [write, setWrite] = useState(false);
  const [searchValueHolder, setSearchValueHolder] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");
  const { register, handleSubmit, getValues, setValue } = useForm();
  const { isLoading, isError, isSuccess, data } = useQuery<IPost[]>(
    "fetchAllAnnouncementPostList",
    fetchAllAnnouncementPostList
  );
  const queryClient = useQueryClient();

  axios.defaults.withCredentials = true;

  const AnnouncementPostSaveAPI = () => {
    const formData = getValues();
    axios
      .post(`${BASE_PATH}/${POST_PATH}/announcement`, formData)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        setWrite(false);
        setValue("title", "");
        setValue("content", "");

        queryClient.invalidateQueries();
      })
      .catch((error) => {
        if (error.response.status == "401") {
          setOpenSnackbar(true);
        } else {
          throw error;
        }
      });
  };

  // For Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const writeModeOn = () => {
    setWrite(true);
  };

  const writeModeOff = () => {
    setWrite(false);
    setValue("title", "");
    setValue("content", "");
  };

  // For Search Post
  const searchPost = (
    post: IPost,
    condition: string,
    searchValue: string
  ): boolean => {
    if (condition == "title") {
      return post.title.includes(searchValue);
    } else if (condition == "username") {
      return post.username.includes(searchValue);
    }
    return false;
  };

  const savePostForm = (
    <form onSubmit={handleSubmit(AnnouncementPostSaveAPI)}>
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
        <Button onClick={writeModeOff}>취소</Button>
      </ButtonGroup>
    </form>
  );

  if (isLoading) {
    return <MyBackdrop isLoading={isLoading} />;
  }

  return (
    <Box>
      <Typography
        component="h2"
        variant="h2"
        style={{ fontWeight: 600, color: "#AF8666" }}
      >
        Announcement
      </Typography>
      {write ? (
        <Box>{savePostForm}</Box>
      ) : (
        <Box>
          <Box>
            <Button
              variant="text"
              onClick={writeModeOn}
              sx={{ float: "left", color: "#AF8666" }}
            >
              새 글 쓰기
            </Button>
            <Box sx={{ float: "right" }}>
              <Select
                id="post-search-value"
                defaultValue="title"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                sx={{ height: 30, mr: 1 }}
              >
                <MenuItem value="title">제목</MenuItem>
                <MenuItem value="username">작성자</MenuItem>
              </Select>
              <Input
                placeholder="Search…"
                value={searchValueHolder}
                onChange={(e) => {
                  setSearchValueHolder(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    setSearchValue(searchValueHolder);
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setSearchValue(searchValueHolder)}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Box>
          </Box>
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
                {data
                  .filter(
                    (post) =>
                      searchValue == "" ||
                      searchPost(post, searchCategory, searchValue)
                  )
                  .map((post) => (
                    <TableRow
                      key={post.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {post.id}
                      </TableCell>
                      <TableCell align="center">
                        <Link href={`/announcement/${post.id}`}>
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
        </Box>
      )}
      <CustomizedSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity="error"
        message="글을 쓸 수 있는 권한이 없습니다."
      />
    </Box>
  );
}
