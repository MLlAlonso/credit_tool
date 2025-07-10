import { elements } from './dom_elements.js';
let currentEditingId = null;

export const formHandler = {
    init(onSubmit, onCancelEdit) {
        elements.creditoForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(elements.creditoForm);
            const data = Object.fromEntries(formData.entries());

            // Convertir a números
            data.monto = parseFloat(data.monto);
            data.tasa_interes = parseFloat(data.tasa_interes);
            data.plazo = parseInt(data.plazo);

            if (isNaN(data.monto) || data.monto < 0) {
                alert('El monto debe ser un número válido y no negativo.');
                return;
            }
            if (isNaN(data.tasa_interes) || data.tasa_interes < 0) {
                alert('La tasa de interés debe ser un número válido y no negativo.');
                return;
            }
            if (isNaN(data.plazo) || data.plazo <= 0) {
                alert('El plazo debe ser un número entero válido y positivo.');
                return;
            }
            onSubmit(data, currentEditingId);
        });
        elements.cancelEditBtn.addEventListener('click', () => {
            this.resetForm();
            this.hideForm();
            if (onCancelEdit) {
                onCancelEdit();
            }
        });
        elements.toggleFormBtn.addEventListener('click', () => {
            this.toggleFormVisibility();
        });
    },

    setEditingMode(credito) {
        currentEditingId = credito.id;
        elements.clienteInput.value = credito.cliente;
        elements.montoInput.value = credito.monto;
        elements.tasaInteresInput.value = credito.tasa_interes;
        elements.plazoInput.value = credito.plazo;
        elements.fechaOtorgamientoInput.value = credito.fecha_otorgamiento;
        elements.submitButton.textContent = 'Actualizar Crédito';
        elements.cancelEditBtn.style.display = 'inline-block';
        this.showForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    resetForm() {
        currentEditingId = null;
        elements.creditoForm.reset();
        elements.submitButton.textContent = 'Registrar Crédito';
        elements.cancelEditBtn.style.display = 'inline-block';
    },

    getEditingId() {
        return currentEditingId;
    },

    showForm() {
        elements.creditoFormSection.style.display = 'block';
        elements.toggleFormBtn.style.display = 'none';
    },

    hideForm() {
        elements.creditoFormSection.style.display = 'none';
        elements.toggleFormBtn.style.display = 'inline-block';
    },

    toggleFormVisibility() {
        if (elements.creditoFormSection.style.display === 'none') {
            this.showForm();
        } else {
            this.hideForm();
        }
    }
};