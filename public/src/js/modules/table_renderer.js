import { elements } from './dom_elements.js';
import { utils } from './utils.js';

let currentSortColumn = 'id';
let currentSortOrder = 'desc';

export const tableRenderer = {
    renderCreditos(creditos, onEdit, onDelete, onSort) {
        elements.creditosTableBody.innerHTML = '';
        let totalMonto = 0;

        if (creditos.length === 0) {
            elements.creditosTableBody.innerHTML = '<tr><td colspan="8">No hay créditos registrados que coincidan con los filtros.</td></tr>';
        } else {
            creditos.forEach(credito => {
                const row = elements.creditosTableBody.insertRow();
                row.dataset.id = credito.id;
                const pmt = utils.calculatePMT(credito.monto, credito.tasa_interes, credito.plazo);
                row.innerHTML = `
                    <td>${credito.id}</td>
                    <td>${credito.cliente}</td>
                    <td>$${credito.monto.toFixed(2)}</td>
                    <td>${(credito.tasa_interes * 100).toFixed(2)}%</td>
                    <td>${credito.plazo}</td>
                    <td>${credito.fecha_otorgamiento}</td>
                    <td>$${pmt.toFixed(2)}</td> <td class="creditos-table__actions">
                        <button class="button button--warning button--sm" data-action="edit" data-id="${credito.id}">Editar</button>
                        <button class="button button--danger button--sm" data-action="delete" data-id="${credito.id}">Eliminar</button>
                    </td>
                `;
                totalMonto += credito.monto;
            });
        }
        elements.totalCreditosSpan.textContent = `$${totalMonto.toFixed(2)}`;
        elements.creditosTableBody.removeEventListener('click', this._tableActionsClickListener);

        this._tableActionsClickListener = (e) => {
            const target = e.target;
            if (target.tagName === 'BUTTON') {
                const action = target.dataset.action;
                const id = target.dataset.id;
                if (action === 'edit' && onEdit) {
                    onEdit(id);
                } else if (action === 'delete' && onDelete) {
                    onDelete(id);
                }
            }
        };
        elements.creditosTableBody.addEventListener('click', this._tableActionsClickListener);
        elements.creditosTableHead.removeEventListener('click', this._tableSortClickListener);

        this._tableSortClickListener = (e) => {
            const header = e.target.closest('.creditos-table__header');
            if (header && header.dataset.sortBy) {
                const newSortColumn = header.dataset.sortBy;
                let newSortOrder = 'asc';

                if (newSortColumn === currentSortColumn) {
                    newSortOrder = (currentSortOrder === 'asc') ? 'desc' : 'asc';
                }
                currentSortColumn = newSortColumn;
                currentSortOrder = newSortOrder;
                this._updateSortIcons();
                onSort(currentSortColumn, currentSortOrder);
            }
        };

        elements.creditosTableHead.addEventListener('click', this._tableSortClickListener);
        this._updateSortIcons();
    },

    _updateSortIcons() {
        elements.creditosTableHead.querySelectorAll('.creditos-table__header').forEach(header => {
            header.removeAttribute('data-sort-order');
            const sortIcon = header.querySelector('.sort-icon');
            if (sortIcon) {
                sortIcon.style.border = 'none';
            }
        });

        const activeHeader = elements.creditosTableHead.querySelector(`[data-sort-by="${currentSortColumn}"]`);
        if (activeHeader) {
            activeHeader.setAttribute('data-sort-order', currentSortOrder);
            const sortIcon = activeHeader.querySelector('.sort-icon');
            if (sortIcon) {
                if (currentSortOrder === 'asc') {
                    sortIcon.style.borderBottom = '5px solid white';
                } else {
                    sortIcon.style.borderTop = '5px solid white';
                }
                sortIcon.style.transform = 'none';
            }
        }
    },

    getCurrentSortParams() {
        return { sortBy: currentSortColumn, sortOrder: currentSortOrder };
    }
};