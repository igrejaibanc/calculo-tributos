document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("remuneration");
  const tenthDiv = document.getElementById("tenth");
  const fistDiv = document.getElementById("fist");

  input.addEventListener("input", function () {
    let value = input.value.replace(/[^\d]/g, "");
    value = (value / 100).toFixed(2).replace(".", ",");
    input.value = `R$ ${value}`;

    const remuneration = parseFloat(value.replace("R$ ", "").replace(",", "."));

    if (!isNaN(remuneration) && remuneration > 0) {
      const fist = Math.round(remuneration / 30);
      const tenth = Math.round((remuneration - fist) * 0.1);

      tenthDiv.textContent = `(10%): R$ ${tenth.toFixed(2).replace(".", ",")}`;
      fistDiv.textContent = `(${remuneration}/30): R$ ${fist.toFixed(2).replace(".", ",")}`;
    } else {
      tenthDiv.textContent = "(10%): R$ 0,00";
      fistDiv.textContent = "(valor/30): R$ 0,00";
    }
  });
});

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const element = document.body;

  try {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0, 0, 175);

    pdf.save("documento.pdf");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
}
