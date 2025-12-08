export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Convierte valores de precio en numero soportando formatos ARS (puntos como miles, coma decimal).
export function safeNum(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const raw = String(value).replace(/\s+/g, '');
  // Quitar símbolos de moneda pero conservar separadores para analizarlos
  const cleaned = raw.replace(/(ARS|\$)/gi, '');

  // Detectar separadores presentes
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  let normalized = cleaned;

  if (hasComma && hasDot) {
    // Si hay ambos separadores, asumimos que el último que aparece es el decimal.
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    if (lastComma > lastDot) {
      // Formato "10.265,41" → miles con punto, decimal con coma
      normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
    } else {
      // Formato "10,265.41" → miles con coma, decimal con punto
      normalized = cleaned.replace(/,/g, '');
    }
  } else if (hasComma && !hasDot) {
    // Solo coma: tratar como decimal
    normalized = cleaned.replace(/,/g, '.');
  } else if (hasDot && !hasComma) {
    // Solo punto: ya es decimal, mantener
    normalized = cleaned;
  } else {
    // Solo dígitos
    normalized = cleaned;
  }

  // Quitar cualquier otro carácter no numérico ni punto decimal
  normalized = normalized.replace(/[^\d.]/g, '');

  const num = parseFloat(normalized);
  return Number.isFinite(num) ? num : null;
}

export function cleanText(value?: string | null): string {
  if (!value) return '';
  return value.replace(/\s+/g, ' ').trim();
}

export function parseCsvUrls(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => {
      // Remove BOM and trim
      const cleaned = line.replace(/^\uFEFF/, '').trim();
      // If it's a CSV with commas, take first column, otherwise take the whole line
      const url = cleaned.includes(',') ? cleaned.split(',')[0] : cleaned;
      return cleanText(url);
    })
    .filter((url) => url.startsWith('http://') || url.startsWith('https://'));
}

export function toCsv(rows: Record<string, unknown>[], headers?: string[]): string {
  if (!rows.length) return '';
  const cols = headers || Object.keys(rows[0]);
  const escape = (val: unknown) => {
    const str = val === undefined || val === null ? '' : String(val);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [cols.join(',')];
  for (const row of rows) {
    lines.push(cols.map((col) => escape((row as Record<string, unknown>)[col])).join(','));
  }
  return lines.join('\n');
}

export function isoNow(): string {
  return new Date().toISOString();
}
