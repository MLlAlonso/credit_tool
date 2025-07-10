const API_BASE_URL = '/api/creditos';

export const api = {
    async getCreditos(url = API_BASE_URL) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener créditos: ${response.statusText}`);
        }
        return response.json();
    },

    async addCredito(data) {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error al añadir crédito: ${response.statusText}`);
        }
        return response.json();
    },

    async updateCredito(id, data) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error al actualizar crédito: ${response.statusText}`);
        }
        return response.json();
    },

    async deleteCredito(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error al eliminar crédito: ${response.statusText}`);
        }
        return response.json();
    }
};