import { Box, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useQuery } from "react-query";
import { fetchAllAnnouncementPostList } from "../apiCall/post";
import MyBackdrop from "../components/MyBackdrop";
import { IPost } from "../interface/IPost";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const { isLoading, isError, isSuccess, data } = useQuery<IPost[]>(
    "fetchAllAnnouncementPostList",
    fetchAllAnnouncementPostList
  );

  if (isLoading) {
    return <MyBackdrop isLoading={isLoading} />;
  }

  return (
    <Box>
      <Box
        sx={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          opacity: "90%",
          zIndex: "-1",
        }}
      >
        <img width="100%" src="/bgImage.jpeg" alt="image" />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>
            <Typography>용석 스쿨입니다.</Typography>
          </Item>
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Item>
            <Link href="/announcement">
              <a>
                <Typography>공지사항</Typography>
              </a>
            </Link>
            {data.map((post) => (
              <div key={post.id}>{post.title}</div>
            ))}
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
