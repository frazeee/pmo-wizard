import { useEffect, useState } from "react";
import { Box, Stack, TextField, IconButton, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const AdditionalDocuments = ({ files, setFiles, uploading }) => {
  // Internal row placeholders; rows can hold File | null to show empty inputs
  const [rows, setRows] = useState(() => {
    const initial = Array.isArray(files?.additional_documents)
      ? files.additional_documents.map((f) => f || null)
      : [null]; // start with one empty row for UX
    return initial.length > 0 ? initial : [null];
  });

  // Keep parent `files.additional_documents` aligned whenever rows change
  useEffect(() => {
    const onlyFiles = rows.filter((f) => f instanceof File);
    setFiles((prev) => ({
      ...prev,
      additional_documents: onlyFiles.length > 0 ? onlyFiles : undefined, // keep undefined if empty
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  // Initialize parent when it didn't exist (optional; safe no-op if already present)
  useEffect(() => {
    if (!Array.isArray(files?.additional_documents)) {
      setFiles((prev) => ({ ...prev, additional_documents: undefined }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilePick = (index, event) => {
    const file = event.target.files?.[0] || null;
    setRows((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, null]);
  };

  const removeRow = (index) => {
    setRows((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      // Always keep at least one row for UX
      return next.length > 0 ? next : [null];
    });
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Additional Documents
        </Typography>
        <Button
          variant="text"
          size="small"
          startIcon={<AddCircleOutlineIcon />}
          onClick={addRow}
          disabled={uploading}
          sx={{ textTransform: "none" }}
        >
          Add another document
        </Button>
      </Stack>

      <Stack spacing={1.5}>
        {rows.map((value, idx) => (
          <Stack key={`additional-doc-row-${idx}`} direction="row" alignItems="center" spacing={1}>
            <TextField
              fullWidth
              margin="normal"
              label={`Additional Document ${idx + 1}`}
              type="file"
              name="additional_documents" // keep original name
              onChange={(e) => handleFilePick(idx, e)}
              InputLabelProps={{ shrink: true }}
              disabled={uploading}
            />
            <IconButton
              aria-label="remove additional document row"
              onClick={() => removeRow(idx)}
              disabled={uploading || rows.length == 1}
              size="small"
              edge="end"
            >       
            <DeleteIcon
              sx={{
                color: rows.length > 1 ? "red" : "grey"
              }}
            />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default AdditionalDocuments;