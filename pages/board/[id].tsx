import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { BASE_PATH, COMMENT_PATH, POST_PATH } from "../../apiCall/base";
import { fetchPost } from "../../apiCall/post";
import {
  Backdrop,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from "@mui/icons-material/List";
import { Box } from "@mui/system";
import { useRecoilState } from "recoil";
import { sessionState } from "../../atom/session";

export default function Post({ postId }: { postId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);
  const [session, setSession] = useRecoilState(sessionState);

  const {
    register: pRegister,
    handleSubmit: pHandleSubmit,
    getValues: pGetValues,
  } = useForm();

  const {
    register: cRegister,
    handleSubmit: cHandleSubmit,
    getValues: cGetValues,
    setValue: cSetValue,
  } = useForm();

  const { isLoading, isError, isSuccess, data, error } = useQuery("post", () =>
    fetchPost(postId)
  );

  const toBoardHome = () => {
    router.push(`/board`);
  };

  axios.defaults.withCredentials = true;

  const callPostEditAPI = () => {
    const formData = pGetValues();
    axios
      .put(`${BASE_PATH}/${POST_PATH}/${postId}`, formData)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        queryClient.invalidateQueries();
        setEdit(false);
      })
      .catch((error) => console.log(error));
  };

  const callPostDeleteAPI = () => {
    axios
      .delete(`${BASE_PATH}/${POST_PATH}/${postId}`)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        router.push("/board");
      })
      .catch((error) => console.log(error));
  };

  const callCommentSaveAPI = (postId) => {
    const formData = cGetValues();
    console.log(formData);
    axios
      .post(`${BASE_PATH}/${COMMENT_PATH}/post/${postId}`, formData)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        cSetValue("content", "");
        queryClient.invalidateQueries();
      })
      .catch((error) => console.log(error));
  };

  const callCommentDeleteAPI = (commentId: String) => {
    axios
      .delete(`${BASE_PATH}/${COMMENT_PATH}/${commentId}`)
      .then((res) => {
        if (res) {
          console.log(res);
        }
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

  const editPostForm = (
    <form onSubmit={pHandleSubmit(callPostEditAPI)}>
      <Box sx={{ my: 2 }}>
        <TextField
          id="post-title"
          variant="standard"
          fullWidth
          defaultValue={data.post.title}
          {...pRegister("title", { required: true })}
        />
      </Box>
      <Box sx={{ my: 2 }}>
        <TextField
          id="post-content"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          defaultValue={data.post.content}
          {...pRegister("content", { required: true })}
        />
      </Box>
      <ButtonGroup variant="contained">
        <Button type="submit">수정</Button>
        <Button onClick={() => setEdit(false)}>취소</Button>
      </ButtonGroup>
    </form>
  );

  return (
    <Box>
      <Typography component="h2" variant="h2">
        게시판
      </Typography>
      {edit ? (
        <Box>{editPostForm}</Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Box>
            <Typography variant="h3" component="span">
              {data.post.title}
            </Typography>
            <Typography component="span" align="right">
              {data.post.username}
            </Typography>
            <ButtonGroup
              variant="contained"
              aria-label="contained primary button group"
              size="small"
              color="primary"
              sx={{
                float: "right",
              }}
            >
              <Button startIcon={<ListIcon />} onClick={toBoardHome}>
                목록
              </Button>
              {session.username === data.post.username ? (
                <Button startIcon={<EditIcon />} onClick={() => setEdit(true)}>
                  수정
                </Button>
              ) : null}
              <Button startIcon={<DeleteIcon />} onClick={callPostDeleteAPI}>
                삭제
              </Button>
            </ButtonGroup>
          </Box>
          <Divider />
          <Box sx={{ minHeight: 100, my: 2 }}>{data.post.content}</Box>
          <Divider />
          <Box sx={{ my: 2 }}>
            <Typography sx={{ mb: 2 }}>
              댓글 ({data.commentList.length})
            </Typography>
            <Box>
              {data.commentList.map((comment) => (
                <Box key={comment.id} sx={{ mb: 2 }}>
                  <Typography variant="h6" component="span">
                    {comment.username}{" "}
                  </Typography>
                  <Typography component="span">
                    {comment.modifiedDate}{" "}
                  </Typography>
                  <Box>
                    <Typography component="span">{comment.content} </Typography>
                    <IconButton
                      onClick={() => callCommentDeleteAPI(comment.id + "")}
                      sx={{ float: "right" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
            {session.connected ? (
              <Box sx={{ pt: 3 }}>
                <form
                  onSubmit={cHandleSubmit(() => callCommentSaveAPI(postId))}
                >
                  <Box sx={{ display: "flex" }}>
                    <Input
                      placeholder="댓글을 입력하세요."
                      inputProps={{ "aria-label": "comment write" }}
                      fullWidth
                      {...cRegister("content", { required: true })}
                    />
                    <Button type="submit">작성</Button>
                  </Box>
                </form>
              </Box>
            ) : null}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const postId = params.id;

  return {
    props: {
      postId,
    },
  };
};
