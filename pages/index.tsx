import { Box, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Home() {
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
        <Grid item xs={12}>
          <Item>
            <Typography>찾아오시는 길은 없어용.</Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
