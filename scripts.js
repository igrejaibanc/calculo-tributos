// Função para formatar valores monetários com pontos e vírgulas
function formatCurrency(amount) {
  return amount
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Função para formatar o valor de entrada
function formatInputValue(value) {
  let formattedValue = (parseFloat(value) / 100).toFixed(2).replace(".", ",");
  return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Função para atualizar os elementos da interface
function updateInterface(remuneration) {
  const tenthDiv = document.getElementById("tenth");
  const fistDiv = document.getElementById("fist");
  const totalDiv = document.getElementById("total");

  if (!isNaN(remuneration) && remuneration > 0) {
    const fist = Math.round(remuneration / 30);
    const tenth = Math.round((remuneration - fist) * 0.1);
    const total = fist + tenth;

    tenthDiv.textContent = `(10%): R$ ${formatCurrency(tenth)}`;
    fistDiv.textContent = `(${formatCurrency(remuneration)}/30): R$ ${formatCurrency(fist)}`;
    totalDiv.textContent = `R$ ${formatCurrency(total)}`;
  } else {
    tenthDiv.textContent = "(10%): R$ 0,00";
    fistDiv.textContent = "(valor/30): R$ 0,00";
    totalDiv.textContent = "R$ 0,00";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("remuneration");

  input.addEventListener("input", function () {
    let value = input.value.replace(/[^\d]/g, "");
    let formattedValue = formatInputValue(value);

    input.value = `R$ ${formattedValue}`;

    const remuneration = parseFloat(value) / 100;
    updateInterface(remuneration);
  });
});

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const element = document.body;

  try {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("documento.pdf");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
}
