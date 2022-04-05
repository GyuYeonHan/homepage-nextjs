import * as React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_PATH, NOTICE_PATH } from "../apiCall/base";
import { Divider } from "@mui/material";

interface MenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorRef: React.MutableRefObject<HTMLButtonElement>;
  noticeList: INotice[];
}

export interface INotice {
  id: string;
  status: string;
  message: string;
  url: string;
  createdDate: string;
}

export interface ItemProps {
  notice: INotice;
}

function NoticeItem(props: ItemProps) {
  const { notice } = props;

  return <div>{notice.message}</div>;
}

export default function MyNoticeMenu(props: MenuProps) {
  const { open, setOpen, anchorRef, noticeList } = props;
  const router = useRouter();

  const readNotice = (notice: INotice) => {
    axios
      .patch(`${BASE_PATH}/${NOTICE_PATH}/${notice.id}`)
      .then((res) => {
        router.push(notice.url);
      })
      .catch((error) => {});
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Popper
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      placement="bottom-start"
      transition
      disablePortal
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: "top right",
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                id="notice-menu"
                // onKeyDown={3}
              >
                {noticeList.slice(0, 8).map((notice: INotice) => (
                  <MenuItem
                    key={notice.id}
                    onClick={(e) => {
                      readNotice(notice);
                      handleClose(e);
                    }}
                  >
                    <NoticeItem notice={notice} />
                  </MenuItem>
                ))}
                {noticeList.length > 8 ? <Divider /> : null}
                {noticeList.length > 8 ? (
                  <MenuItem
                    onClick={() => {
                      setOpen(false);
                      router.push("/notice");
                    }}
                  >
                    ...더 보기
                  </MenuItem>
                ) : null}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
