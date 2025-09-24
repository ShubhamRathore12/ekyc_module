import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import playbutton from "@public/assets/tutorial/playbutton.png";
import Image from "next/image";
import { content, ContentItem } from "./lib";
const Playlist = () => {
  return (
    <Box
      sx={{
        width: "2000px",
        display: "flex",
        gap: 2,
        m: 1,
      }}
    >
      {content.map((item: ContentItem, j) => {
        return (
          <Paper
            key={j}
            sx={{
              width: "259px",
              height: "313px",
              borderRadius: 5,
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                zIndex: 1,
                right: 5,
                top: 135,
              }}
            >
              <Image src={playbutton} alt="play button" height={63} width={63} layout="fixed" />
            </Box>
            <Box
              sx={{
                zIndex: 1,
                color: "#FFFF",
                width: "56px",
                height: "25px",
                bgcolor: "hsla(225, 14%, 16%, 0.5)",
                borderRadius: 5,
                position: "absolute",
                top: 5,
                right: 5,
              }}
            >
              <Typography sx={{ textAlign: "center" }}>6 min</Typography>
            </Box>
            <Box>
              <Image
                style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                src={item.thumbnail}
                alt={item.title}
                width={240}
                height={150}
                layout="responsive"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                m: 3,
              }}
            >
              <Typography>SMC HR</Typography>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="caption" sx={{ position: "absolute", bottom: 5 }}>
                53K Views . 2 Months ago
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default Playlist;
