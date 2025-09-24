import { Box, Container } from "@mui/material";
import Artwork from "@public/assets/signin/artwork.png";
import Logo from "@public/Logo.png";
import Image from "next/image";

interface IProps {
  children: JSX.Element | JSX.Element[];
}

const AuthLayout = (props: IProps) => {
  const { children } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Box sx={{ p: 2, bgcolor: "#FFFF" }}>
        <Image src={Logo} height={60} width={180} alt="smc logo" />
      </Box>
      <Box
        sx={{
          bgcolor: "#FFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              height: "calc(100vh-67px)",
            }}
          >
            <Box sx={{ display: { xs: "none", md: "block", width: "min(100%,700px)" } }}>
              <Image src={Artwork} alt="illustration" height={502} width={619} />
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "500px" },
                  bgcolor: "#FFFF",
                  boxShadow: "1px 1px 21px 1px rgb(243, 245, 255)",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 4,
                  px: 7,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1, xl: 2 },
                    margin: "auto",
                  }}
                >
                  <>{children}</>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;
