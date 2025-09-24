import { useAuth } from "@hooks/useAuth";
import useWindowDimensions from "@hooks/useWindowDimensions";
import Logo from "@icons/sidebar/Logo";
import { Button, Drawer } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useState } from "react";
import { getMenu } from "../menu";

interface IProps {
  isExpanded: boolean;
  clickHanler: any;
}

function DrawerComp({ isExpanded, clickHanler }: IProps) {
  const { height, width } = useWindowDimensions();
  const [isOpen, setisOpen] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  return (
    <Box>
      <Drawer open={isExpanded} onClose={() => clickHanler(false)}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "#FFFF",
            width: "100%",
            // minHeight: "100%",
            minHeight: "auto",
            height: "100%",
          }}
        >
          <Box
            sx={{
              py: 1.5,
              px: 1.5,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              position: "sticky",
              top: 0,
            }}
          >
            <Logo isExpanded={isExpanded} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                mt: 10,
                gap: 2,
              }}
            >
              {login?.data?.admin_type &&
                getMenu(login?.data?.admin_type).map((el) => {
                  return (
                    <Button
                      sx={{
                        color: "white",
                        textTransform: "none",
                        bgcolor: router.pathname.startsWith(el.href)
                          ? "hsla(0, 0%, 0%, 0.2)"
                          : "unset",
                        "&:hover": {
                          bgcolor: router.pathname.startsWith(el.href)
                            ? "hsla(0, 0%, 0%, 0.2)"
                            : "unset",
                        },
                      }}
                      key={el.label}
                      variant="text"
                      size="large"
                      startIcon={<el.Icon height={24} width={24} />}
                      onClick={() => {
                        router.push(`${el.href}`);
                      }}
                    >
                      {el.label}
                    </Button>
                  );
                })}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

export default DrawerComp;

{
  /* <List>
    <ListItemButton>
        <ListItemIcon>
        <ListItemText>Something 1</ListItemText>
        </ListItemIcon>
    </ListItemButton>
    <ListItemButton>
        <ListItemIcon>
        <ListItemText>Something 2</ListItemText>
        </ListItemIcon>
    </ListItemButton>
    <ListItemButton>
        <ListItemIcon>
        <ListItemText>Something 3</ListItemText>
        </ListItemIcon>
    </ListItemButton>
    <hr />
    <ListItemButton>
        <ListItemIcon>
        <ListItemText>Something 4</ListItemText>
        </ListItemIcon>
    </ListItemButton>
    </List>
    </Drawer>
    <Button sx={{ml:'auto'}} onClick={()=> setisOpen(!isOpen)}>
    <MenuIcon sx={{color:"white"}} />
    </Button> */
}
