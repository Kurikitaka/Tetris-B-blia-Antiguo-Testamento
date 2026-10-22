// Exportador a PDF usando jsPDF y html2canvas
const PDFExporter = {
  generatePDF(pieces) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFontSize(16);
    doc.text("Rompecabezas Bíblico - Antiguo Testamento", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text("Recorta las 39 fichas para armar el tablero en orden de los libros.", 105, 22, { align: "center" });

    let x = 15;
    let y = 30;
    let colCount = 0;

    pieces.forEach((p, idx) => {
      doc.setFillColor(p.color);
      doc.rect(x, y, 40, 25, 'F');
      doc.setDrawColor(0);
      doc.rect(x, y, 40, 25, 'D');

      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.text(`${p.bookId}. ${p.name}`, x + 20, y + 12, { align: "center" });
      doc.setFontSize(7);
      doc.text(p.group, x + 20, y + 18, { align: "center" });

      x += 45;
      colCount++;

      if (colCount >= 4) {
        colCount = 0;
        x = 15;
        y += 30;
      }

      if (y > 260 && idx < pieces.length - 1) {
        doc.addPage();
        y = 20;
        x = 15;
        colCount = 0;
      }
    });

    doc.save("Rompecabezas_Biblico_Antiguo_Testamento.pdf");
  }
};
