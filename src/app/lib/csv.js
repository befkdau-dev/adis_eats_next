export function toCsv(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return "";

  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];

  const escapeCell = (value) => {
    let text = "";

    if (value == null) {
      text = "";
    } else if (typeof value === "object") {
      text = JSON.stringify(value);
    } else {
      text = String(value);
    }

    return `"${text.replace(/"/g, '""')}"`;
  };

  return [
    headers.map(escapeCell).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCell(row[header])).join(","),
    ),
  ].join("\r\n");
}

export function downloadCsv(filename, csv) {
  if (typeof window === "undefined") return;

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
