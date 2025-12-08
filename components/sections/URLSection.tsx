import URLManager from '../URLManager';
import ScraperControls from '../ScraperControls';
import ProgressBar from '../ProgressBar';
import { ProgressTotals } from '@/types';

type Props = {
  totals: ProgressTotals;
  onRefresh: () => void;
};

export default function URLSection({ totals, onRefresh }: Props) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Agregar URLs</h2>
          <p className="text-white/60 text-base leading-relaxed">
            Agrega URLs de productos. El scraper se ejecutará automáticamente.
          </p>
        </div>
        <ScraperControls onRefresh={onRefresh} totals={totals} />
      </div>

      <ProgressBar totals={totals} />

      <URLManager onChange={onRefresh} />
    </div>
  );
}
