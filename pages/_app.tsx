import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import { ReactQueryDevtools } from "react-query/devtools";
import Layout from "../components/Layout";
import { RecoilRoot } from "recoil";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Seo from "../components/Seo";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();
  const theme = createTheme({});

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <Layout>
            {/* <Seo title={"Hi"} /> */}
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </RecoilRoot>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default MyApp;
