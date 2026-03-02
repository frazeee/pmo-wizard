import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  Box,
  CssBaseline,
  IconButton
} from "@mui/material";

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { Link as RouterLink, useLocation, matchPath } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { ENV } from "../../configure/env.jsx";
import React from 'react';
import axios from "axios";

import logo from '../../assets/logo.svg';
import powered from '../../assets/powered.svg';

const drawerWidth = 60;

// Optional: if you're using env vars, ensure ENV.API_URL exists or replace with your base URL.
// Example: const API_BASE = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;
const API_BASE = ENV?.API_URL;

export default function Appbar() {
  const location = useLocation();
  const activePath = location.pathname;

  // Detect /projects/:projectId or any nested route under it
  const projectMatch =
    matchPath("/projects/:projectId/*", activePath) ||
    matchPath("/projects/:projectId", activePath);

  const projectId = projectMatch?.params?.projectId ?? null;
  const isInsideProject = Boolean(projectId);

  const [projectName, setProjectName] = React.useState(null);
  const [projectLoading, setProjectLoading] = React.useState(false);
  const [projectError, setProjectError] = React.useState(null);

  React.useEffect(() => {
    let ignore = false;

    async function loadProject() {
      if (!isInsideProject) {
        setProjectName(null);
        setProjectError(null);
        return;
      }
      setProjectLoading(true);
      setProjectError(null);
      try {
        // ⬇️ Adjust to your real endpoint; commonly `/api/projects/:projectId`
        // Example: `${API_BASE}/projects/${projectId}`
        const url = `${API_BASE}/${projectId}`;
        const res = await axios.get(url);

        // Your API example:
        // {
        //   "project_id": "proj_dd827e87c31d",
        //   "project_name": "testfeb",
        //   ...
        // }
        const nameFromApi = res?.data?.project_name;
        if (!ignore) {
          setProjectName(nameFromApi || `Project ${projectId}`);
        }
      } catch (err) {
        if (!ignore) {
          setProjectError(err);
          setProjectName(null);
        }
      } finally {
        if (!ignore) setProjectLoading(false);
      }
    }

    loadProject();
    return () => { ignore = true; };
  }, [isInsideProject, projectId]);

  const menu = [
    { label: 'Home', icon: <HomeIcon fontSize="inherit" />, to: '/' },
    { label: 'Projects', icon: <WorkIcon fontSize="inherit" />, to: '/projects' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ backgroundColor: '#f3f3f5', color: 'black', boxShadow: 'none' }}
      >
        <Toolbar disableGutters sx={{ minHeight: 10, px: 1.5, alignItems: 'center', mr: .5 }}>
          <Box
            component="img"
            src={logo}
            alt="PMO"
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Typography
            variant="body2"
            component="div"
            noWrap
            sx={{ fontSize: 16, lineHeight: 1, mr: 1, fontWeight: 600 }}
          >
            PMO Wizard
          </Typography>
          <Box
            component="img"
            src={powered}
            alt="Powered"
            sx={{ height: 16, mr: 2 }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <IconButton size="small" edge="end">
            <AccountCircleOutlinedIcon fontSize="medium" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: "#f3f3f5",
            boxSizing: 'border-box',
            mt: '64px',
          },
        }}
      >
        <List sx={{ pt: 1 }}>
          {menu.map((item) => {
            // If you want Projects to be active when inside any project, use startsWith:
            // const isActive = activePath === item.to || activePath.startsWith(`${item.to}/`);
            const isActive = activePath === item.to;

            return (
              <React.Fragment key={item.label}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <Tooltip title={item.label} placement="right" arrow>
                    <ListItemButton
                      to={item.to}
                      component={RouterLink}
                      sx={{
                        minHeight: 48,
                        minWidth: 48,
                        justifyContent: 'center',
                        px: 1,
                        my: 0.5,
                        borderRadius: 2,
                        mx: 1,
                        ...(isActive && { bgcolor: '#e6e6e8' }),
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          fontSize: 28, // controls icon size inside
                          mr: 0,
                          justifyContent: 'center',
                          color: isActive ? '#2e2e38' : 'gray',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                </ListItem>

                {/* ▶️ Extra dynamic item right BELOW the Projects icon */}
                {item.to === '/projects' && isInsideProject && (
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <Tooltip
                      title={
                        projectLoading
                          ? 'Loading…'
                          : projectError
                            ? 'Project not found'
                            : (projectName || `Project ${projectId}`)
                      }
                      placement="right"
                      arrow
                    >
                      <ListItemButton
                        to={`/projects/${projectId}`}
                        component={RouterLink}
                        sx={{
                          minHeight: 48,
                          minWidth: 48,
                          justifyContent: 'center',
                          px: 1,
                          my: 0.5,
                          borderRadius: 2,
                          mx: 1,
                          ...(activePath.startsWith(`/projects/${projectId}`)
                            ? { bgcolor: '#e6e6e8' }
                            : {}),
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            fontSize: 28,
                            mr: 0,
                            justifyContent: 'center',
                            color: activePath.startsWith(`/projects/${projectId}`) ? '#2e2e38' : 'gray',
                          }}
                        >
                          <FilePresentIcon fontSize="inherit" />
                        </ListItemIcon>
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}