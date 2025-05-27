import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Grid } from "@mui/material";
import { useAuth } from "../context/authContext";

const pages = [
  { name: "Meals", url: "/meals" },
  { name: "Food Items", url: "/food" },
  { name: "About", url: "/about" },
  { name: "Add recipe", url: "/foodcollections/add"}
];
const settings = [
  { name: "Profile", url: "/profile" },
  { name: "Logout", url: "/logout" },
];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  React.useEffect(function() {
    if(location.pathname == "/") {
        if (auth.token) {
          navigate("/meals");
        }
        else {
          navigate("/login");
        }
      }
  },[location])

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page: { name: string; url: string }) => {
    navigate(page.url);
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting: { name: string; url: string }) => {
    navigate(setting.url);
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ mb: "30px", width: "100vw" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              noWrap
              component="a"
              onClick={function () {
                handleCloseNavMenu({ name: "Meals", url: "/meals" });
              }}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Calorie Tracker
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page, index) => (
                  <MenuItem
                    key={index}
                    onClick={function () {
                      handleCloseNavMenu(page);
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={function() {navigate("/meals")}}
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Calorie Tracker
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page, index) => (
                <Button
                  key={index}
                  onClick={function () {
                    handleCloseNavMenu(page);
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <Box onClick={handleOpenUserMenu}>
                  <AccountCircleIcon fontSize="large"/>
                </Box>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem
                    key={index}
                    onClick={function () {
                      handleCloseUserMenu(setting);
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Grid
        container
        sx={{
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          padding: "10px",
          maxWidth: "650px",
        }}
      >
        <Outlet />
      </Grid>
    </>
  );
}
export default ResponsiveAppBar;
