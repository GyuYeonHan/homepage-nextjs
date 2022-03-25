import { Backdrop, BadgeProps, CircularProgress } from "@mui/material";

interface BackdropProps {
  isLoading: boolean;
}

export default function MyBackdrop({ isLoading }: BackdropProps) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
