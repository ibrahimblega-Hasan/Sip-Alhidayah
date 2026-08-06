import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToExcel(
  rows: Record<string, string | number>[],
  fileName: string,
  sheetName = "Sheet1"
) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  if (rows[0]) {
    worksheet["!cols"] = Object.keys(rows[0]).map(() => ({ wch: 18 }));
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}

export function exportToPDF(
  title: string,
  head: string[],
  body: (string | number)[][],
  fileName: string
) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.setTextColor(5, 150, 105);
  doc.text(title, 14, 16);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Dicetak pada ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`, 14, 22);

  autoTable(doc, {
    head: [head],
    body,
    startY: 28,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [5, 150, 105], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 253, 249] },
  });

  doc.save(fileName);
}
