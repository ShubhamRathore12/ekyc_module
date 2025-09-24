import DashboardLayout from "@components/layouts/DashboardLayout";
import Playlist from "@components/tutorials/Playlist";
import useWindowDimensions from "@hooks/useWindowDimensions";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import SwitchRightIcon from "@mui/icons-material/SwitchRight";
import { Grid, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import playbutton from "@public/assets/tutorial/playbutton.png";
import Watchlistv11 from "@public/assets/tutorial/Watchlist-v11.png";
import watchListImage from "@public/assets/tutorial/watchListImage.png";
import watchListImageShort from "@public/assets/tutorial/watchListImageShort.png";
import { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
const TutorialHeaderCards = () => {
  const { height, width } = useWindowDimensions();
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    return setWindowWidth(width);
  }, [width]);
  return (
    <>
      <Grid item xs={12} md={6} lg={8}>
        <Box
          sx={{
            bgcolor: "hsla(166, 100%, 40%, 1)",
            height: "450px",
            borderRadius: 5,
            position: "relative",
          }}
        >
          <Box
            sx={{
              color: "#FFFF",
              p: 3,
              display: "flex",
            }}
          >
            <Typography
              variant="h3"
              fontWeight={500}
              sx={{
                p: 3,
              }}
            >
              SMC Ace Login Process
            </Typography>
            <Box sx={{ mt: 5, ml: "auto", display: { xs: "none", sm: "block" } }}>
              {windowWidth < 1478 ? (
                <Box display={windowWidth < 1180 ? "none" : "block"}>
                  <Image
                    layout="fixed"
                    src={Watchlistv11}
                    alt="Watchlistv11"
                    height={320}
                    width={260}
                  />
                </Box>
              ) : (
                <Image
                  layout="fixed"
                  src={watchListImage}
                  alt="watchlistimage"
                  height={330}
                  width={480}
                />
              )}
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 30,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Image src={playbutton} alt="play button" height={73} width={73} layout="fixed" />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography>SMC HR</Typography>
                <Typography noWrap>53K views . 2 weeks ago</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Box
          sx={{
            bgcolor: "hsla(45, 100%, 74%, 1)",
            height: "450px",
            borderRadius: 5,
            p: 3,
            position: "relative",
          }}
        >
          <Box
            sx={{
              bgcolor: "hsla(225, 14%, 16%, 0.5)",
              color: "#FFFF",
              position: "absolute",
              m: 3,
              p: 1,
              borderRadius: 3,
              right: 0,
              bottom: 0,
              opacity: "10px",
              zIndex: 1,
            }}
          >
            10 min
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h3" fontWeight={600} lineHeight={1.1} color="secondary.main">
              SMC Ace Fund Transfer
            </Typography>
            <Box sx={{ ml: "auto", display: windowWidth < 375 ? "none" : "block" }}>
              <Image
                layout="fixed"
                src={watchListImageShort}
                alt="watchlistimage"
                height={280}
                width={250}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: 1,
              }}
            >
              <Image src={playbutton} alt="play button" height={73} width={73} layout="fixed" />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography>SMC HR</Typography>
                <Typography noWrap>53K views</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

const Tutorial: NextPage = () => {
  const playListRef = React.useRef<HTMLDivElement>();

  function handleScrollLeft() {
    if (playListRef.current) playListRef.current!.scrollLeft -= 150;
  }
  function handleScrollRight() {
    if (playListRef.current) playListRef.current!.scrollLeft += 150;
  }

  return (
    <Box
      sx={{
        m: 2,
      }}
    >
      <Grid container spacing={1.5}>
        <TutorialHeaderCards />
      </Grid>
      <Typography
        variant="h4"
        sx={{ mt: 2, mb: 2, ml: 1, fontWeight: 500, color: "hsla(0, 0%, 26%, 1)" }}
      >
        SMC Products Online Tutorial Library
      </Typography>
      <Box sx={{ position: "relative" }}>
        <Box
          component="div"
          ref={playListRef}
          sx={{
            overflow: "scroll",
            // chrome
            "&::-webkit-scrollbar": {
              background: "transparent",
              width: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "12px",
            },
          }}
        >
          <Playlist />
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: -10,
            top: 150,
            bgcolor: "#FFFF",
            borderRadius: 10,
            zIndex: 1,
          }}
        >
          <IconButton onClick={handleScrollRight}>
            <SwitchRightIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: "absolute",
            left: -10,
            top: 150,
            bgcolor: "#FFFF",
            borderRadius: 10,
            zIndex: 1,
          }}
        >
          <IconButton onClick={handleScrollLeft}>
            <SwitchLeftIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

Tutorial.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Tutorial;
