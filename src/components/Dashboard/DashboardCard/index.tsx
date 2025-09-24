import { Box, Grid, MenuItem, Paper, Select, Skeleton, styled, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Icon from "../../../icons/DashboardCardIcon";
import { CardData } from "../utils/data";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  minHeight: theme.breakpoints.down("md") ? "120px" : "160px",
}));

const DashboardCard = ({
  title,
  numberOfApplicants,
  duration,
  bgColor,
  iconColor,
  illustration,
  loading,
  period,
  handleChange,
}: CardData) => {
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [showIllustration, setShowIllustration] = useState(false);

  const handleElementResized = () => {
    if (observedDiv.current?.offsetWidth !== width) {
      if (observedDiv.current?.offsetWidth > 400) {
        setShowIllustration(true);
      } else {
        setShowIllustration(false);
      }
      setWidth(observedDiv.current?.offsetWidth);
    }
    if (observedDiv.current && observedDiv.current?.offsetHeight !== height) {
      setHeight(observedDiv.current.offsetHeight);
    }
  };

  const observedDiv: React.MutableRefObject<any> = useRef(null);
  const resizeObserver: ResizeObserver = new ResizeObserver(handleElementResized);

  useEffect(() => {
    resizeObserver.observe(observedDiv.current);
    return function cleanup() {
      resizeObserver.disconnect();
    };
  });
  //

  return (
    <Grid item xs={12} sm={6} lg={3}>
      <Item ref={observedDiv} sx={{ p: 0, borderRadius: 5 }}>
        <Box
          sx={{
            bgcolor: bgColor,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            minHeight: { xs: 120, md: 160 },
            borderRadius: 5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon color={iconColor} />
            <Box
              sx={{
                color: "hsla(0, 0%, 26%, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <Typography sx={{ mb: 0.5 }} variant="body1" noWrap>
                {!loading ? (
                  title
                ) : (
                  <Skeleton
                    sx={{ borderRadius: 10 }}
                    animation="wave"
                    variant="rectangular"
                    width={180}
                    height={30}
                  />
                )}
              </Typography>
              <Typography sx={{ mb: 0.5 }} variant="h4" fontWeight={700}>
                {!loading ? (
                  numberOfApplicants
                ) : (
                  <Skeleton
                    sx={{ borderRadius: 10 }}
                    animation="wave"
                    variant="rectangular"
                    width={150}
                    height={30}
                  />
                )}
              </Typography>
              {/* <Typography sx={{ mb: 0.5 }}>
                {!loading ? (
                  duration
                ) : (
                  <Skeleton
                    sx={{ borderRadius: 10 }}
                    animation="wave"
                    variant="rectangular"
                    width={160}
                    height={30}
                  />
                )}
              </Typography> */}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={period}
                label="Age"
                onChange={handleChange}
                variant="standard"
                disableUnderline
              >
                <MenuItem value="yesterday">Since Yesterday</MenuItem>
                <MenuItem value="last_seven_days">Since Last 7 days</MenuItem>
                <MenuItem value="all">Since MTD</MenuItem>
                <MenuItem value="last_month">Since Last Month</MenuItem>
              </Select>
            </Box>
          </Box>
          {showIllustration && (
            <Box>
              <Image
                objectFit="contain"
                layout="fixed"
                src={illustration}
                alt={illustration}
                height={121.79}
                width={107.84}
              />
            </Box>
          )}
        </Box>
      </Item>
    </Grid>
  );
};

export default DashboardCard;
