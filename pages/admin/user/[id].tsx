import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "react-query";
import { fetchUser } from "../../../apiCall/user";
import { Button, ButtonGroup, Divider, Typography } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import { Box } from "@mui/system";
import MyBackdrop from "../../../components/MyBackdrop";

export default function User({ userId }: { userId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isLoading, isError, isSuccess, data, error } = useQuery("user", () =>
    fetchUser(userId)
  );

  axios.defaults.withCredentials = true;

  if (isError) {
    return <div>error</div>;
  }

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
        User
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Box>
          <Typography variant="h3" component="span">
            {data.user.username}
          </Typography>
          <Typography component="span" align="right">
            {data.user.id}
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
            <Button
              startIcon={<ListIcon />}
              onClick={() => {
                router.push("/admin/user");
              }}
            >
              목록
            </Button>
          </ButtonGroup>
        </Box>
        <Divider />
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userId = params.id;

  return {
    props: {
      userId,
    },
  };
};
