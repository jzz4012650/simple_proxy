import { createTheme } from "@mui/material";
import pink from "@mui/material/colors/pink";

const theme = createTheme({
  palette: {
    mode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    secondary: pink,
  },
});

export { theme };
