import PriceEvolution from '../PriceEvolution';
import PriceComparison from '../PriceComparison';

export default function EvolutionSection() {
  return (
    <div className="space-y-8">
      <div className="section-header">
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Evolución de precios</h2>
        <p className="text-white/60 text-base leading-relaxed">
          Visualiza cambios detectados y el histórico de precios de cada producto.
        </p>
      </div>

      <PriceEvolution />
      <PriceComparison />
    </div>
  );
}
