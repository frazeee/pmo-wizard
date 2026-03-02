import React, { useEffect, useMemo } from "react";
import { Button, Stack } from "@mui/material";

/**
 * Turn the backend issues JSON into readable .txt content.
 * Handles empty sections, adds totals, and timestamps.
 */

export function FormatPayloadIssue(report) {
  if (!report || typeof report !== "object") {
    return "No report data provided.";
  }

  const {
    status,
    project_id,
    has_issues,
    summary,
    files = {},
  } = report;

  const ts = new Date();
  const tsISO = ts.toISOString();

  const lines = [];
  lines.push("=== Upload Issue Report ===");
  lines.push(`Generated at: ${tsISO}`);
  lines.push(`Project ID  : ${project_id ?? "N/A"}`);
  lines.push(`Status      : ${status ?? "N/A"}`);
  lines.push(`Has Issues  : ${String(!!has_issues)}`);
  lines.push("");

  if (summary) {
    lines.push("Summary:");
    lines.push(summary.trim());
    lines.push("");
  }

  let totalIssues = 0;

  // Per-file details
  for (const [fileKey, fileData] of Object.entries(files)) {
    const issueCount = fileData?.issue_count ?? 0;
    totalIssues += Number.isFinite(issueCount) ? issueCount : 0;

    lines.push(`--- File: ${fileKey} ---`);
    if (!fileData || !Array.isArray(fileData.issues) || fileData.issues.length === 0) {
      lines.push("No issues found for this file.");
      lines.push("");
      continue;
    }

    fileData.issues.forEach((issue, idx) => {
      const n = idx + 1;
      const type = issue.type ?? "N/A";
      const field = issue.field ?? "N/A";
      const severity = issue.severity ?? "N/A";
      const message = issue.message ?? "No message provided.";
      const affectedRows = Array.isArray(issue.affected_rows) ? issue.affected_rows.join(", ") : "N/A";

      lines.push(`${n}) Type     : ${type}`);
      lines.push(`   Field    : ${field}`);
      lines.push(`   Severity : ${severity}`);
      lines.push(`   Rows     : ${affectedRows}`);
      lines.push(`   Message  : ${message}`);
      lines.push("");
    });
  }

  lines.push("=== Totals ===");
  lines.push(`Total Issue Count: ${totalIssues}`);
  lines.push("");

  return lines.join("\n");
}

/**
 * Create a Blob and trigger a client-side download as .txt.
 */
export function saveIssuesAsTxt(report, { filename } = {}) {
  const projectId = report?.project_id || "project";
  const ts = new Date();
  const safeTs = ts.toISOString().replace(/[:]/g, "-"); // Windows-safe
  const name = filename || `${projectId}_upload_issues_${safeTs}.txt`;

  const content = FormatPayloadIssue(report);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * UI component: renders a button that downloads the .txt.
 * If `auto` is true, it will auto-download when `report` changes.
 */
export default function PayloadIssue({ report, filename, auto = false, onDownloaded }) {
  const disabled = !report;
  const textPreview = useMemo(() => (report ? FormatPayloadIssue(report) : ""), [report]);

  useEffect(() => {
    if (auto && report) {
      saveIssuesAsTxt(report, { filename });
      onDownloaded?.();
    }
  }, [auto, report, filename, onDownloaded]);

  if (!report) return null;

  return (
    <Stack direction="row" spacing={1}>
      <Button
        variant="outlined"
        size="small"
        onClick={() => saveIssuesAsTxt(report, { filename })}
        sx={{ textTransform: "none" }}
        disabled={disabled}
      >
        Download Error Report (.txt)
      </Button>
    </Stack>
  );
}
