import ResultsTable from '../ResultsTable';

type Props = {
  onRefresh: () => void;
};

export default function ResultsSection({ onRefresh }: Props) {
  return (
    <div className="space-y-8">
      <div className="section-header">
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Resultados del Scraping</h2>
        <p className="text-white/60 text-base leading-relaxed">
          Visualiza todos los productos scrapeados con sus precios y detalles
        </p>
      </div>

      <ResultsTable onRefresh={onRefresh} />
    </div>
  );
}
