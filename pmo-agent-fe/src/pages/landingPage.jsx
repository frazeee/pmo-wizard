import { Link as RouterLink } from 'react-router-dom';
import Appbar from '../components/appbar/appbar';
import CardNewsComponent from "../components/CardNewsComponent";
import { Box, Typography, Button, Container, Grid } from "@mui/material";

const LandingPage = () => {
  return (
    <Box>
    <Appbar />
      <Box sx={{ mt: '64px', ml: 7, px: 7 }} display="flex" >
        <Box sx={{ p: 2, width: '100%' }}>
          <Box className="banner">
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                height: "100%",
                px: 4
              }}
              disableGutters
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: '#fff'
                  }}
                  variant='h5'
                  gutterBottom>
                  Welcome to PMO Wizard!
                </Typography>

                <Typography
                  sx={{
                    color: '#fff',
                    fontSize: 16,
                    maxWidth: '1200px'
                  }}
                  gutterBottom
                >
                  A smart project management assistant for your reports, risks, resources, and schedules. Our platform helps you stay in control with clear insights, proactive monitoring, and streamlined planning—supporting your entire project lifecycle from start to finish.
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/projects"
                  sx={{
                    mt: 1,
                    fontWeight: 'bold',
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    '&:hover': {
                      backgroundColor: "#f0f0f0"
                    }
                  }}
                >
                  Get Started
                </Button>

              </Box>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, mt: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item sx={{ display: 'flex' }} size={{ xs: 12, md: 6, lg: 3 }}>
                <CardNewsComponent
                  URL="https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  CardName="AI Powered Report Generator"
                  Content="Streamline your reporting process and generate accurate project-related reports."
                  mediaHeight="200"
                  buttonOn={false}
                  cardWidth="380"
                />
              </Grid>
              <Grid item sx={{ display: 'flex' }} size={{ xs: 12, md: 6, lg: 3 }}>
                <CardNewsComponent
                  URL="https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  CardName="Knowledge Base Repository for AI"
                  Content="Access comprehensive AI insights and resources for your project related data."
                  mediaHeight="200"
                  cardWidth="380" />
              </Grid>
              <Grid item sx={{ display: 'flex' }} size={{ xs: 12, md: 6, lg: 3 }}>
                <CardNewsComponent
                  URL="https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  CardName="AI Driven Realtime Chatbot"
                  Content="Engage with your project reportsinstantly with our responsive AI chatbot solution."
                  mediaHeight="200"
                  cardWidth="380"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
