import { elements } from './dom_elements.js';
let creditosChartInstance = null;

export const chartManager = {
    updateChart(montos) {
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

        creditosChartInstance = new Chart(elements.creditosChartCtx, {
            type: 'bar',
            data: data,
            options: options
        });
    }
};