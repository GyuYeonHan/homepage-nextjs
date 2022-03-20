import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export default function Admin() {
  const [value, setValue] = useState(0);

  return (
    <Box>
      <Typography component="h2" variant="h2">
        관리자 페이지
      </Typography>
      <Button>
        <Link href="/admin/user">
          <a>유저 관리</a>
        </Link>
      </Button>
    </Box>
  );
}
