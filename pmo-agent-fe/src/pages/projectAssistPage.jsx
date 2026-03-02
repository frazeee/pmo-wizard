import Appbar from "../components/appbar/appbar";
import ProjectAssistDashboard from "../components/projectAssistDashboard/projectAssistDashboard";
import { Box } from "@mui/material";

function ProjectAssistPage() {
    return (
        <Box>
            <Appbar />
            <ProjectAssistDashboard />
        </Box>
    );
}

export default ProjectAssistPage;
