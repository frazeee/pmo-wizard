import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ENV } from "../../configure/env.jsx";
import CardNewsComponent from "../../components/CardNewsComponent.jsx";
import { Link as RouterLink } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Container,
  Stack,
  Divider,
  Grid,
  CircularProgress,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);          // <-- controls the MUI Dialog
  const [submitting, setSubmitting] = useState(false);

  const getProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ENV.API_URL}`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim() || !description.trim()) return;

    const requestBody = {
      project_name: projectName,
      description: description,
    };

    try {
      setSubmitting(true);
      const response = await axios.post(`${ENV.API_URL}`, requestBody);
      console.log("Project created:", response.data);

      // Reset fields
      setProjectName("");
      setDescription("");

      // Close modal
      setOpen(false);

      // Refresh list (no full reload)
      await getProjects();

      // Notify
      await Swal.fire({
        title: "Success!",
        text: "Project created successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn-primary" },
      });
    } catch (error) {
      console.error("Error creating project:", error);
      Swal.fire({
        title: "Oops!",
        text: error?.response?.data?.message || "Failed to create project.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{mt:"64px", width: '100%' }}>
      <Container sx={{ py: 5 }}>
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={600} color="black">
              Projects
            </Typography>

            <Typography variant="h6" color="black" sx={{ opacity: 0.9 }}>
              Your project portfolio at a glance - organized, clear, and actionable.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="medium"
            sx={{
              fontWeight: 600,
              height: "36px",
              backgroundColor: "#2e2e38",
              color: "white",
              fontSize: 14,
            }}
            onClick={() => setOpen(true)}
          >
            Create Project
          </Button>
        </Stack>

        {/* Divider */}
        <Divider sx={{ borderColor: "black", mb: 3 }} />

        {/* Loading Spinner */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 5,
            }}
          >
            <CircularProgress size={80} sx={{ color: "#fefe53" }} />
          </Box>
        ) : (
          <>
            {/* No Projects */}
            {projects.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <Typography variant="h4" color="white" fontWeight={600}>
                  No Projects Available.
                </Typography>
              </Box>
            ) : (
              /* Project Grid */
              <Grid container  xs={12} sm={6} md={3} lg={3} rowSpacing={2}>
                {projects.map((project) => (
                  <Grid item size={4} key={project.project_id}>
                    <Tooltip disableFocusListener title={project.project_name} placement="right">
                      <CardNewsComponent
                        URL="https://images.unsplash.com/photo-1606836576983-8b458e75221d?q=80&w=1470&auto=format&fit=crop"
                        CardName={project.project_name}
                        Content={project.description}
                        buttonOn
                        component={RouterLink}
                        to={`/projects/${project.project_id}`}
                        buttonLabel="Open Project"
                        cardWidth = "350px"
                      />
                    </Tooltip>

                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="createModal"
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", color: "#2e2e38", fontWeight: 600, fontFamily: "EYInterstate-Regular, sans-serif" }}>
            Create Project
            <IconButton onClick={() => setOpen(false)} aria-label="close">
              <CloseIcon sx={{ color: "#2e2e38" }} />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Box mb={2}>
              <Typography fontWeight={600} sx={{ fontFamily: "EYInterstate-Regular, sans-serif" }}>
                Project Name <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter Project Name"
                required
                disabled={submitting}
                sx={{ fontFamily: "EYInterstate-Regular, sans-serif" }}
              />
            </Box>

            <Box mb={2}>
              <Typography fontWeight={600} sx={{ fontFamily: "EYInterstate-Regular, sans-serif" }}>
                Description <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                sx={{ fontFamily: "EYInterstate-Regular, sans-serif" }}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Project Description"
                required
                disabled={submitting}
              // multiline
              // minRows={3}
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              color="#2e2e38"
              onClick={() => setOpen(false)}
              disabled={submitting}
              sx={{ fontFamily: "EYInterstate-Regular, sans-serif" }}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ fontFamily: "EYInterstate-Regular, sans-serif", backgroundColor: "#2e2e38" }}
            >
              {submitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Projects;