import { useAuth } from "@hooks/useAuth";
import Logo from "@icons/sidebar/Logo";
import { Button, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { getMenu } from "../menu";

interface IProps {
  isExpanded: boolean;
  clickHandler: any;
}

const DashboardSideBar = ({ isExpanded, clickHandler }: IProps) => {
  const router = useRouter();
  const { login } = useAuth();
  const type = login?.data.admin_type;
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "#FFFF",
        minHeight: "100%",
        height: "100vh",
        width: isExpanded ? "176px" : "60px",
        display: { xs: "none", sm: "block" },
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
        <Box>
          <Logo isExpanded={isExpanded} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            mt: 10,
            gap: 2,
          }}
        >
          {type &&
            getMenu(type).map((el) =>
              isExpanded ? (
                <Box
                  key={el.label}
                  sx={{
                    borderRadius: "4px",
                    width: "151.41px",
                    bgcolor: router.pathname.startsWith(el.href) ? "hsla(0, 0%, 0%, 0.2)" : "unset",
                    "&:hover": {
                      bgcolor: router.pathname.startsWith(el.href)
                        ? "hsla(0, 0%, 0%, 0.2)"
                        : "unset",
                    },
                  }}
                >
                  <Button
                    sx={
                      {
                        // color: "white",
                        // textTransform: "none",
                        // fontSize: "14px",
                      }
                    }
                    key={el.label}
                    variant="text"
                    size="large"
                    startIcon={<el.Icon height={20} width={20} />}
                    onClick={() => {
                      router.push(`${el.href}`);
                    }}
                  >
                    {el.label}
                  </Button>
                </Box>
              ) : (
                <IconButton
                  sx={{
                    borderRadius: "10%",
                    bgcolor: router.pathname.startsWith(el.href) ? "hsla(0, 0%, 0%, 0.2)" : "unset",
                    "&:hover": {
                      bgcolor: router.pathname.startsWith(el.href)
                        ? "hsla(0, 0%, 0%, 0.2)"
                        : "unset",
                    },
                  }}
                  key={el.label}
                  onClick={() => {
                    router.push(`${el.href}`);
                  }}
                >
                  <el.Icon height={20} width={20} />
                </IconButton>
              )
            )}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardSideBar;
