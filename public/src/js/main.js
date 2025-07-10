import { api } from './modules/api.js';
import { elements } from './modules/dom_elements.js';
import { tableRenderer } from './modules/table_renderer.js';
import { formHandler } from './modules/form_handler.js';
import { chartManager } from './modules/chart_manager.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentFilters = {
        cliente: '',
        min_monto: '',
        max_monto: ''
    };

    async function fetchAndRenderCreditos() {
        try {
            const sortParams = tableRenderer.getCurrentSortParams();
            const queryParams = new URLSearchParams();
            
            if (currentFilters.cliente) {
                queryParams.append('cliente', currentFilters.cliente);
            }
            if (currentFilters.min_monto) { 
                queryParams.append('min_monto', currentFilters.min_monto);
            }
            if (currentFilters.max_monto) {
                queryParams.append('max_monto', currentFilters.max_monto);
            }

            // Parámetros de ordenamiento
            queryParams.append('sort_by', sortParams.sortBy);
            queryParams.append('sort_order', sortParams.sortOrder);

            const url = `/api/creditos?${queryParams.toString()}`;
            console.log("Fetching credits with URL:", url);
            
            const creditos = await api.getCreditos(url);
            
            tableRenderer.renderCreditos(
                creditos,
                (id) => handleEdit(id, creditos),
                (id) => handleDelete(id),
                (sortBy, sortOrder) => {
                    fetchAndRenderCreditos(); 
                }
            );
            chartManager.updateChart(creditos.map(c => c.monto));
        } catch (error) {
            console.error('Error al cargar créditos:', error);
            elements.creditosTableBody.innerHTML = '<tr><td colspan="8" style="color: red;">Error al cargar los créditos.</td></tr>';
            elements.totalCreditosSpan.textContent = '$0.00';
        }
    }

    async function handleSubmit(data, id) {
        try {
            let message = '';
            if (id) {
                await api.updateCredito(id, data);
                message = 'Crédito actualizado exitosamente!';
            } else {
                await api.addCredito(data);
                message = 'Crédito registrado exitosamente!';
            }
            alert(message);
            formHandler.resetForm();
            formHandler.hideForm();
            fetchAndRenderCreditos();
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            alert(`Error: ${error.message}`);
        }
    }

    async function handleEdit(id, allCreditos) {
        const creditoToEdit = allCreditos.find(c => String(c.id) === String(id));
        if (creditoToEdit) {
            formHandler.setEditingMode(creditoToEdit);
        } else {
            alert('Crédito no encontrado para edición.');
        }
    }

    async function handleDelete(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este crédito?')) {
            try {
                await api.deleteCredito(id);
                alert('Crédito eliminado exitosamente!');
                fetchAndRenderCreditos();
            } catch (error) {
                console.error('Error al eliminar crédito:', error);
                alert(`Error: ${error.message}`);
            }
        }
    }

    // --- Lógica de Filtrado ---
    function applyFilters() {
        const minMontoVal = elements.minMontoInput.value.trim();
        const maxMontoVal = elements.maxMontoInput.value.trim();

        if (minMontoVal !== '' && parseFloat(minMontoVal) < 0) {
            alert('El monto mínimo no puede ser negativo.');
            return;
        }
        if (maxMontoVal !== '' && parseFloat(maxMontoVal) < 0) {
            alert('El monto máximo no puede ser negativo.');
            return;
        }
        currentFilters.cliente = elements.filterClienteInput.value.trim();
        currentFilters.min_monto = minMontoVal;
        currentFilters.max_monto = maxMontoVal;
        fetchAndRenderCreditos();
    }

    function clearFilters() {
        elements.filterClienteInput.value = '';
        elements.minMontoInput.value = '';
        elements.maxMontoInput.value = '';
        currentFilters = { cliente: '', min_monto: '', max_monto: '' };
        fetchAndRenderCreditos();
    }

    elements.applyFiltersBtn.addEventListener('click', applyFilters);
    elements.clearFiltersBtn.addEventListener('click', clearFilters);
    elements.filterClienteInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') applyFilters(); });
    elements.minMontoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') applyFilters(); });
    elements.maxMontoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') applyFilters(); });
    formHandler.init(handleSubmit, () => {});
    fetchAndRenderCreditos();
});