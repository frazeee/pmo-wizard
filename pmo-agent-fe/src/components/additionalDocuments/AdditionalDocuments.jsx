import { useEffect, useState } from "react";
import { Box, Stack, TextField, IconButton, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";

const AdditionalDocuments = ({ files, setFiles, uploading }) => {
  // Internal row placeholders; rows can hold File | null to show empty inputs
  const [rows, setRows] = useState(() => {
    const initial = Array.isArray(files?.additional_documents)
      ? files.additional_documents.map((f) => f || null)
      : [null]; // start with one empty row for UX
    return initial.length > 0 ? initial : [null];
  });

  // NEW: Header inputs per row (UI-only; not pushed to parent `files`)
  const [headers, setHeaders] = useState(() => rows.map(() => ""));

  // Keep parent `files.additional_documents` aligned whenever rows change
  useEffect(() => {
    const onlyFiles = rows.filter((f) => f instanceof File);
    setFiles((prev) => ({
      ...prev,
      additional_documents: onlyFiles.length > 0 ? onlyFiles : undefined, // keep undefined if empty
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  
  // NEW: Keep headers length aligned with rows (add/remove)
  useEffect(() => {
    setHeaders((prev) => {
      if (prev.length === rows.length) return prev;
      if (prev.length < rows.length) {
        // add empty headers for each new row
        return [...prev, ...Array(rows.length - prev.length).fill("")];
      }
      // trim headers when rows removed
      return prev.slice(0, rows.length);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);


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

    // NEW: Keep headers array in sync with row removal
    setHeaders((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next.length > 0 ? next : [""];
    });
  };


  // NEW: Update a header value for a specific row
  const handleHeaderChange = (index, value) => {
    setHeaders((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };
  
  //Clear a selected file but keep the row
  const clearFile = (index) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });

    // reset actual file input value
    if (inputRefs[index]) {
      inputRefs[index].value = "";
    }
  };
  const inputRefs = useState([])[0];

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
          <Box
            key={`additional-doc-row-${idx}`}
            sx={{
              p: 1.5,
              border: "1px solid #e0e0e0",
              borderRadius: 1.5,
              bgcolor: "#fafafa",
            }}
          >
                  
            {/* NEW: Header input above the file input */}
            <TextField
              fullWidth
              margin="none"
              label={`Additional Document Header ${idx + 1}`}
              placeholder="Enter Header / Title"
              value={headers[idx] ?? ""}
              onChange={(e) => handleHeaderChange(idx, e.target.value)}
              disabled={uploading}
              sx={{ mb: 2 }}
            />

            {/* Existing row content kept intact */}
            <Stack direction="row" alignItems="center" spacing={1}>
              {/*Added Clear File Input*/}
              <TextField
                fullWidth
                margin="normal"
                label={`Additional Document ${idx + 1}`}
                type="file"
                name="additional_documents"
                onChange={(e) => handleFilePick(idx, e)}
                InputLabelProps={{ shrink: true }}
                disabled={uploading}
                inputRef={(el) => (inputRefs[idx] = el)}
                sx={{ mt: 0.5 }}
                InputProps={{
                  endAdornment:
                    value instanceof File && (
                      <IconButton
                        aria-label="clear selected file"
                        onClick={() => clearFile(idx)}
                        size="small"
                        sx={{ mr: 1 }}
                        disabled={uploading}
                      >
                        <ClearIcon sx={{ color: "#2e2e38" }} />
                      </IconButton>
                    ),
                }}
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
                      color: rows.length > 1 ? "#2e2e38" : "#7f7f91",
                    }}
                  />
                </IconButton>
              </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
export default AdditionalDocuments;