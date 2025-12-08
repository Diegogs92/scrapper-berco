import URLManager from '../URLManager';
import ProgressBar from '../ProgressBar';
import { ProgressTotals } from '@/types';

type Props = {
  totals: ProgressTotals;
  onRefresh: () => void;
};

export default function URLSection({ totals, onRefresh }: Props) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="card p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">URLs</p>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Gestión centralizada</h2>
          <p className="text-white/70 text-base leading-relaxed">
            Agrega URLs individualmente o por CSV. El scraping corre solo después de cargarlas, sin pasos extra.
          </p>
        </div>
        <div className="card p-5 flex flex-col gap-3 bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-strong)]/10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Scraping automático</p>
            <span className="px-3 py-1 rounded-full text-xs bg-white/15 text-white">Activo</span>
          </div>
          <p className="text-white/70 text-sm">
            Cada URL nueva entra en cola y se procesa en el siguiente ciclo sin que hagas nada.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-white/60">Pendientes</p>
              <p className="text-xl font-semibold text-white">{totals.pending}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-white/60">En curso</p>
              <p className="text-xl font-semibold text-white">{totals.processing}</p>
            </div>
          </div>
        </div>
      </div>

      <ProgressBar totals={totals} />

      <URLManager onChange={onRefresh} />
    </div>
  );
}
