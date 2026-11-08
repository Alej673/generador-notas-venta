document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("cuerpo-tabla");
    const btnAgregar = document.getElementById("btn-agregar-fila");
    const elTotal = document.getElementById("gran-total");
    const btnDescargar = document.getElementById("btn-descargar");
    const elNumero = document.getElementById("numero-nota");
    const CLAVE = "numero_nota_chorlango";   // "numero_nota_brachiguer" en el otro

    try {
        const guardado = localStorage.getItem(CLAVE);
        if (guardado) elNumero.textContent = guardado;
    } catch (e) {}

    elNumero.addEventListener("input", () => {
        try { localStorage.setItem(CLAVE, elNumero.textContent.trim()); } catch (e) {}
    });

    // Agrega una nueva fila al DOM
    function agregarFila() {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="col-cant">
                <input type="number" class="input-limpio input-cant calc-trigger" min="1" inputmode="decimal">
            </td>
            <td class="col-desc">
                <input type="text" class="input-limpio input-desc">
            </td>
            <td class="col-vunit">
                <input type="number" class="input-limpio input-precio calc-trigger" min="0" step="0.01" inputmode="decimal">
            </td>
            <td class="col-vtotal">
                <span class="texto-total"></span>
                <button class="btn-eliminar" data-html2canvas-ignore="true">X</button>
            </td>
        `;
        tbody.appendChild(tr);
    }

    // Calcula sumatorias automáticamente
    function calcularTotales() {
        let sumaTotal = 0;

        tbody.querySelectorAll("tr").forEach(fila => {
            const cantidad = parseFloat(fila.querySelector(".input-cant").value) || 0;
            const precio = parseFloat(fila.querySelector(".input-precio").value) || 0;
            const totalFila = cantidad * precio;

            fila.querySelector(".texto-total").textContent = totalFila > 0 ? totalFila.toFixed(2) : "";
            sumaTotal += totalFila;
        });

        elTotal.textContent = sumaTotal.toFixed(2);
    }

    // Eventos de la tabla
    tbody.addEventListener("input", (e) => {
        if (e.target.classList.contains("calc-trigger")) calcularTotales();
    });

    tbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-eliminar")) {
            e.target.closest("tr").remove();
            calcularTotales();
        }
    });

    btnAgregar.addEventListener("click", agregarFila);

    // Exportación a PDF (A4 vertical, siempre con el diseño de escritorio)
    btnDescargar.addEventListener("click", () => {
        const elemento = document.getElementById("comprobante-pdf");

        const opciones = {
            margin:       [10, 15, 10, 15],
            filename:     'Nota_Venta_Chorlango.pdf',   // 'Nota_Venta_Brachiguer.pdf' en el otro
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opciones).from(elemento).save();
    });

    // Iniciar con 5 filas vacías y el total en 0.00
    for (let i = 0; i < 5; i++) {
        agregarFila();
    }
    calcularTotales();
});