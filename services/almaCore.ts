
// SISTEMA: ALMA CORE // LÓGICA DE NEGOCIO DE IDENTIDAD
// VERSIÓN: 3.0 (Swap Efficiency Update)

export interface ROIStatus {
    coherence: number;
    vnm: number;
    purificationActive: boolean;
    trend: 'BULLISH' | 'BEARISH' | 'STAGNANT';
    candles: number[];
    swapFee: number;        // Costo de transferencia Thorne -> Letra
}

class AlmaCoreService {
    private coherence: number = 50;
    private candleHistory: number[] = new Array(20).fill(50);
    private purificationThreshold: number = 100;

    private sacredLexicon = [
        "soberanía", "voluntad", "vacío", "arquitecto",
        "frecuencia", "ancla", "jazz", "imperfección",
        "hambre", "grasa", "teseo", "diamante", "swap", "transferencia"
    ];

    /**
     * Calcula el ROI de Identidad integrando la eficiencia de Swap.
     * Si la transferencia de datos es ineficiente, el ROI sufre una "tasa de Thorne".
     */
    calculateROI(friction: number, content: string, swapEfficiency: number = 1.0): ROIStatus {
        let dividend = 0;

        if (content) {
            const lowerText = content.toLowerCase();
            this.sacredLexicon.forEach(word => {
                if (lowerText.includes(word)) {
                    dividend += 15;
                }
            });
        }

        // El costo de swap es proporcional a la fricción y la ineficiencia
        const swapFee = (1 - swapEfficiency) * 20;

        // Dinámica de Mercado ajustada por Swap
        const marketPressure = (swapEfficiency > 0.8) ? 3 : -2;

        this.coherence = Math.min(200, Math.max(0, this.coherence + marketPressure + (dividend * 0.1) - swapFee));

        this.candleHistory.shift();
        this.candleHistory.push(this.coherence);

        const trend = this.candleHistory[19] > this.candleHistory[18] ? 'BULLISH' : 'BEARISH';

        return {
            coherence: this.coherence,
            vnm: dividend,
            purificationActive: this.coherence < this.purificationThreshold,
            trend,
            candles: [...this.candleHistory],
            swapFee
        };
    }

    getMarketReport(status: ROIStatus): string {
        const icon = status.trend === 'BULLISH' ? '📈' : '📉';
        return `${icon} ROI: ${status.coherence.toFixed(1)}% | SWAP_FEE: ${status.swapFee.toFixed(1)} | VNM: +${status.vnm}`;
    }
}

export const almaCore = new AlmaCoreService();
