import { Box } from "@mui/system";
import { useState } from "react";
import { BASE_PATH } from "../apiCall/base";
import CustomizedSnackbar from "../components/CustomizedSnackbar";

export default function Home() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  // console.log(BASE_PATH);

  return (
    <Box>
      <span>홈페이지 입니다.</span>
      <button onClick={handleClick}>open</button>
      <CustomizedSnackbar
        open={open}
        setOpen={setOpen}
        handleClick={handleClick}
        severity="error"
        message="This is test!"
      />
    </Box>
  );
}
