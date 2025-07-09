import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {DayData} from "@/components/layouts/DateManager";

export const generateDateReportPdf = async ({
  currentYear,
  currentMonth,
  days,
  total,
}: {
  currentYear: number;
  currentMonth: number;
  days: DayData[];
  total: number;
}) => {
  const doc = new jsPDF();

  // Add title
  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "en-US",
    {
      month: "long",
    }
  );

  let y = 20;
  doc.setFontSize(16);
  doc.text(`${monthName} ${currentYear}`, 105, y, {align: "center"});
  y += 10;

  // Add table headers
  doc.setFontSize(12);
  doc.text("Date", 40, y);
  doc.text("Count", 120, y);
  y += 7;

  // Add each day row
  days
    .filter((day) => day.isCurrentMonth)
    .forEach((day) => {
      const dateStr = day.date.toLocaleDateString("en-CA");
      doc.text(dateStr, 40, y);
      doc.text(day.count.toString(), 120, y);
      y += 7;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

  // Add total count
  y += 10;
  doc.setFontSize(14);
  doc.text(`Total Count: ${total}`, 105, y, {align: "center"});

  // Save the PDF
  doc.save(`${monthName}_${currentYear}_Report.pdf`);
};
