import { useEffect } from "react";
import { Button, Box } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

function buildIssuesAoA(report) {
  const {
    status,
    project_id,
    has_issues,
    summary,
    files = {},
  } = report || {};

  const tsISO = new Date().toISOString();

  const stringifyIssue = (issue = {}) => {
    const type = issue.type ?? "N/A";
    const field = issue.field ?? "N/A";
    const severity = issue.severity ?? "N/A";
    const message = issue.message ?? "No message provided.";
    let affectedRows = "N/A";
    if (Array.isArray(issue.affected_rows)) {
      affectedRows = issue.affected_rows.join(", ");
    } else if (typeof issue.affected_rows === "string") {
      affectedRows = issue.affected_rows;
    }
    return `Type: ${type}; Field: ${field}; Severity: ${severity}; Rows: ${affectedRows}; Message: ${message}`;
  };

  const aoa = [];

  // === Header ===
  aoa.push(["Upload Issue Report"]);
  aoa.push(["Generated at", tsISO]);
  aoa.push(["Project ID", project_id ?? "N/A"]);
  aoa.push(["Status", status ?? "N/A"]);
  aoa.push(["Has Issues", String(!!has_issues)]);
  aoa.push([""]); // blank

  // === Summary (one row merged across 2 columns) ===
  aoa.push(["Summary"]);
  const summaryText =
    (typeof summary === "string" && summary.trim())
      ? summary
      : "(No summary provided)";
  aoa.push([summaryText, ""]); // merged later
  aoa.push([""]); // spacer

  // === Errors (File | Error) ===
  aoa.push(["Errors"]);
  aoa.push(["File", "Error"]);

  const fileEntries = Object.entries(files || {});
  if (fileEntries.length === 0) {
    aoa.push(["(No files found in payload)", ""]);
  } else {
    for (const [fileKey, fileData] of fileEntries) {
      const issues = Array.isArray(fileData?.issues) ? fileData.issues : [];
      if (issues.length === 0) {
        aoa.push([fileKey, "No issues found for this file."]);
      } else {
        issues.forEach((issue) => {
          aoa.push([fileKey, stringifyIssue(issue)]);
        });
      }
    }
  }
  return aoa;
}

function saveIssuesAsXlsx(report, { filename } = {}) {
  if (!report || typeof report !== "object") {
    console.warn("No report data provided to saveIssuesAsXlsx.");
    return;
  }

  const projectId = report?.project_id || "project";
  const safeTs = new Date().toISOString().replace(/[:]/g, "-");
  const name = filename || `${projectId}_upload_issues_${safeTs}.xlsx`;

  const aoa = buildIssuesAoA(report);
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Column widths (File ~30, Error ~120)
  ws["!cols"] = [{ wch: 30 }, { wch: 120 }];

  // Merges
  ws["!merges"] = ws["!merges"] || [];
  ws["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } });
  ws["!merges"].push({ s: { r: 6, c: 0 }, e: { r: 6, c: 1 } });
  ws["!merges"].push({ s: { r: 7, c: 0 }, e: { r: 7, c: 1 } });

  // Optional: make the two summary rows taller for readability
  ws["!rows"] = ws["!rows"] || [];
  ws["!rows"][7] = { hpt: 72 }; // ~48 points


  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Upload Issues");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, name);
}

export default function PayloadIssue({
  report,
  filename,
  auto = false,
  onDownloaded,
}) {
  useEffect(() => {
    if (auto && report) {
      saveIssuesAsXlsx(report, { filename });
      onDownloaded?.();
    }
  }, [auto, report, filename, onDownloaded]);

  if (!report) return null;

  return (
    <Box>
      <Button
        variant="contained"
        size="small"
        onClick={() => saveIssuesAsXlsx(report, { filename })}
        sx={{
          backgroundColor: "#ffe600",
          "&:hover": { backgroundColor: "#fbe200" },
          color: '#2e2e38',
        }}
      >
        <FileDownloadOutlinedIcon sx={{ mr: 0.5, color: '#2e2e38' }} />
        Error Report
      </Button>
    </Box>
  );
}