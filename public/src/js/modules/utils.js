export const utils = {
    /**
     * Calcula el pago mensual de un préstamo.
     * @param {number} principal - El monto principal del préstamo.
     * @param {number} annualRate - La tasa de interés anual (ej. 0.05 para 5%).
     * @param {number} months - El número total de meses.
     * @returns {number} El pago mensual.
     */
    calculatePMT(principal, annualRate, months) {
        if (annualRate === 0) {
            return principal / months;
        }
        const monthlyRate = annualRate / 12;
        const pmt = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
        return pmt;
    }
};