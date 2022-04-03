import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { fetchAllNoticeOfUser } from "../../apiCall/notice";
import { sessionState } from "../../atom/session";
import MyBackdrop from "../../components/MyBackdrop";
import { INotice } from "../../components/MyNoticeMenu";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { BASE_PATH, NOTICE_PATH } from "../../apiCall/base";
import axios from "axios";

export default function notice() {
  const router = useRouter();
  const session = useRecoilValue(sessionState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noticeList, setNoticeList] = useState<INotice[]>([]);

  const { isError, error, isSuccess, data } = useQuery<INotice[]>(
    "AllNoticeList",
    () => fetchAllNoticeOfUser(session.userId)
  );

  const readNotice = (notice: INotice) => {
    axios
      .patch(`${BASE_PATH}/${NOTICE_PATH}/${notice.id}`)
      .then((res) => {
        console.log(res);
        router.push(notice.url);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (session.userId == "-1") {
      console.log("you have to go");
      //   router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (data != undefined) {
      setNoticeList(data);
      setIsLoading(false);
    }
  }, [data]);

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
        Notice
      </Typography>
      <Box>
        <List>
          {noticeList.map((notice) => (
            <ListItem
              key={notice.id}
              onClick={() => readNotice(notice)}
              sx={{ "&:hover": { bgColor: "red" } }}
            >
              <ListItemIcon>
                <FiberManualRecordIcon
                  sx={{
                    color: notice.status == "UNREAD" ? "red" : "gray",
                    fontSize: 10,
                  }}
                />
              </ListItemIcon>
              <ListItemText>{notice.message}</ListItemText>
              <ListItemText>{notice.createdDate}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
