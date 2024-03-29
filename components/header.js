import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import _get from 'lodash/get';
import AppBar from '@mui/material/AppBar';
import Image from 'next/image';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person';
import { useUser } from '@supabase/auth-helpers-react';

const pages = [{
  key: 'dashboard',
  name: 'Dashboard',
}, {
  key: 'leaderboard',
  name: 'Leaderboard'
}, {
  key: 'recognize',
  name: 'Recognize and Reward'
}, {
  key: 'rewards',
  name: 'Rewards List',
}, {
  key: 'members',
  name: 'Members List'
}, {
  key: 'catalogue',
  name: 'Catalogue'
}];

function ResponsiveAppBar() {
  const router = useRouter();
  const user = useUser();
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleNavMenu = (nav) => () => {
    router.push(`/${nav}`)
    setAnchorElNav(null);
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = async () => {
    setAnchorElUser(null);
  };

  const logoutUser = async () => {
    setAnchorElUser(null);
    const { error } = await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Image
            src="/logo.png"
            width={45}
            height={30}
            alt="Logo"
            className={"logo-sm"}
          />
          <Typography
            variant="h5"
            noWrap
            className="product-card"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              color: '#FFF',
              fontWeight: 700,
              // letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Winner's Circle
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.key}
                  onClick={handleNavMenu(page.key)}
                  selected={`/${page.key}` === _get(router, "pathname" , "/") ? true : false}
                  className={`/${page.key}` === _get(router, "pathname" , "/") ? "selected" : ""}
                >
                  <Typography textAlign="center" className="camelcase">{`/${page.key}`}{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Image
            src="/logo.png"
            width={45}
            height={30}
            alt="Logo"
            className={"logo-xs"}
          />
          <Link href="/dashboard">
            <Typography
              variant="h5"
              noWrap
              className="product-card"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: '#FFF',
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.key}
                onClick={handleNavMenu(page.key)}
                sx={{ my: 2, color: 'white', display: 'block' }}
                selected={`/${page.key}` === _get(router, "pathname" , "/") ? true : false}
                className={`/${page.key}` === _get(router, "pathname" , "/") ? "camelcase selected" : "camelcase"}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <p className="header-email">{_get(user, "email")}</p>
                <Avatar sx={{ bgcolor: green[500] }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={'logout'} onClick={logoutUser}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;