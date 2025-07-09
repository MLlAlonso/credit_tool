document.addEventListener('DOMContentLoaded', () => {
    const creditoForm = document.getElementById('creditoForm');
    const creditosTableBody = document.querySelector('#creditosTable tbody');
    const totalCreditosSpan = document.getElementById('totalCreditos');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    let editingId = null; 
    // Función para obtener y mostrar créditos
    async function fetchCreditos() {
        try {
            const response = await fetch('/api/creditos');
            const creditos = await response.json();
            
            creditosTableBody.innerHTML = '';
            let totalMonto = 0;

            if (creditos.length === 0) {
                creditosTableBody.innerHTML = '<tr><td colspan="7">No hay créditos registrados.</td></tr>';
            } else {
                creditos.forEach(credito => {
                    const row = creditosTableBody.insertRow();
                    row.dataset.id = credito.id; 
                    row.innerHTML = `
                        <td>${credito.id}</td>
                        <td>${credito.cliente}</td>
                        <td>$${credito.monto.toFixed(2)}</td>
                        <td>${(credito.tasa_interes * 100).toFixed(2)}%</td>
                        <td>${credito.plazo}</td>
                        <td>${credito.fecha_otorgamiento}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" data-action="edit" data-id="${credito.id}">Editar</button>
                            <button class="btn btn-danger btn-sm" data-action="delete" data-id="${credito.id}">Eliminar</button>
                        </td>
                    `;
                    totalMonto += credito.monto;
                });
            }
            totalCreditosSpan.textContent = `$${totalMonto.toFixed(2)}`;
            updateChart(creditos.map(c => c.monto));
        } catch (error) {
            console.error('Error al obtener créditos:', error);
            creditosTableBody.innerHTML = '<tr><td colspan="7" style="color: red;">Error al cargar los créditos.</td></tr>';
            totalCreditosSpan.textContent = '$0.00';
        }
    }

    // Maneja el envío del formulario
    creditoForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const formData = new FormData(creditoForm);
        const data = Object.fromEntries(formData.entries());

        // Convertir monto, tasa_interes y plazo a números
        data.monto = parseFloat(data.monto);
        data.tasa_interes = parseFloat(data.tasa_interes);
        data.plazo = parseInt(data.plazo);

        if (isNaN(data.monto) || isNaN(data.tasa_interes) || isNaN(data.plazo)) {
            alert('Por favor, ingrese valores numéricos válidos para Monto, Tasa de Interés y Plazo.');
            return;
        }

        try {
            let response;
            if (editingId) {
                response = await fetch(`/api/creditos/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                editingId = null;
                creditoForm.reset();
                creditoForm.querySelector('button[type="submit"]').textContent = 'Registrar Crédito';
                cancelEditBtn.style.display = 'none';
                alert('Crédito actualizado exitosamente!');

            } else {
                response = await fetch('/api/creditos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                creditoForm.reset();
                alert('Crédito registrado exitosamente!');
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al procesar el crédito');
            }
            fetchCreditos();
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert(`Error: ${error.message}`);
        }
    });

    creditosTableBody.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.tagName === 'BUTTON') {
            const action = target.dataset.action;
            const id = target.dataset.id;

            if (action === 'edit') {
                try {
                    const response = await fetch(`/api/creditos`);
                    const creditos = await response.json();
                    const creditoToEdit = creditos.find(c => String(c.id) === String(id));

                    if (creditoToEdit) {
                        document.getElementById('cliente').value = creditoToEdit.cliente;
                        document.getElementById('monto').value = creditoToEdit.monto;
                        document.getElementById('tasa_interes').value = creditoToEdit.tasa_interes;
                        document.getElementById('plazo').value = creditoToEdit.plazo;
                        document.getElementById('fecha_otorgamiento').value = creditoToEdit.fecha_otorgamiento;
                        editingId = id;
                        creditoForm.querySelector('button[type="submit"]').textContent = 'Actualizar Crédito';
                        cancelEditBtn.style.display = 'inline-block';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        alert('Crédito no encontrado para edición.');
                    }
                } catch (error) {
                    console.error('Error al cargar crédito para edición:', error);
                    alert('Error al cargar crédito para edición.');
                }
            } else if (action === 'delete') {
                if (confirm('¿Estás seguro de que quieres eliminar este crédito?')) {
                    try {
                        const response = await fetch(`/api/creditos/${id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || 'Error al eliminar el crédito');
                        }
                        alert('Crédito eliminado exitosamente!');
                        fetchCreditos();
                    } catch (error) {
                        console.error('Error al eliminar crédito:', error);
                        alert(`Error: ${error.message}`);
                    }
                }
            }
        }
    });

    cancelEditBtn.addEventListener('click', () => {
        editingId = null;
        creditoForm.reset();
        creditoForm.querySelector('button[type="submit"]').textContent = 'Registrar Crédito';
        cancelEditBtn.style.display = 'none';
    });
    fetchCreditos();
});


let creditosChartInstance = null;
function updateChart(montos) {
    const ctx = document.getElementById('creditosChart').getContext('2d');

    if (creditosChartInstance) {
        creditosChartInstance.destroy();
    }

    const data = {
        labels: montos.map((_, i) => `Crédito ${i + 1}`),
        datasets: [{
            label: 'Monto del Crédito',
            data: montos,
            backgroundColor: 'rgba(0, 123, 255, 0.6)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Monto ($)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Crédito'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Distribución de Montos de Crédito'
            }
        }
    };

    creditosChartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}