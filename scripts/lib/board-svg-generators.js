/**
 * Generate accurate board-exam SVG diagrams (not generic placeholders).
 */

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** SSC Cumilla 2024 Q17–18: R1=5Ω, R2=10Ω, R3=20Ω, 12V mixed circuit stimulus */
function cumilla2024CircuitR123() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 300" width="520" height="300" role="img" aria-label="বর্তনী উদ্দীপক R1 R2 R3">
  <rect width="520" height="300" rx="16" fill="#0f172a"/>
  <text x="260" y="28" text-anchor="middle" fill="#e2e8f0" font-family="Noto Sans Bengali, Arial, sans-serif" font-size="14" font-weight="700">$R_1=5\\,\\Omega$, $R_2=10\\,\\Omega$, $R_3=20\\,\\Omega$, $12\\,\\text{V}$</text>
  <rect x="40" y="50" width="440" height="200" rx="12" fill="#111c33" stroke="#334155"/>
  <circle cx="90" cy="150" r="18" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
  <text x="90" y="155" text-anchor="middle" fill="#e2e8f0" font-size="12" font-family="Arial">12V</text>
  <rect x="150" y="132" width="44" height="36" rx="4" fill="#1e293b" stroke="#f472b6" stroke-width="2"/>
  <text x="172" y="155" text-anchor="middle" fill="#fda4af" font-size="11" font-family="Arial">$R_1$</text>
  <text x="172" y="178" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="Arial">5Ω</text>
  <rect x="230" y="110" width="44" height="36" rx="4" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
  <text x="252" y="133" text-anchor="middle" fill="#86efac" font-size="11" font-family="Arial">$R_2$</text>
  <text x="252" y="156" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="Arial">10Ω</text>
  <rect x="230" y="170" width="44" height="36" rx="4" fill="#1e293b" stroke="#a78bfa" stroke-width="2"/>
  <text x="252" y="193" text-anchor="middle" fill="#c4b5fd" font-size="11" font-family="Arial">$R_3$</text>
  <text x="252" y="216" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="Arial">20Ω</text>
  <line x1="108" y1="150" x2="150" y2="150" stroke="#94a3b8" stroke-width="2"/>
  <line x1="194" y1="150" x2="230" y2="128" stroke="#94a3b8" stroke-width="2"/>
  <line x1="194" y1="150" x2="230" y2="188" stroke="#94a3b8" stroke-width="2"/>
  <line x1="274" y1="128" x2="350" y2="128" stroke="#94a3b8" stroke-width="2"/>
  <line x1="274" y1="188" x2="350" y2="188" stroke="#94a3b8" stroke-width="2"/>
  <line x1="350" y1="128" x2="350" y2="188" stroke="#94a3b8" stroke-width="2"/>
  <line x1="350" y1="158" x2="420" y2="158" stroke="#94a3b8" stroke-width="2"/>
  <line x1="420" y1="158" x2="420" y2="220" stroke="#94a3b8" stroke-width="2"/>
  <line x1="420" y1="220" x2="90" y2="220" stroke="#94a3b8" stroke-width="2"/>
  <line x1="90" y1="220" x2="90" y2="168" stroke="#94a3b8" stroke-width="2"/>
  <text x="260" y="280" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Noto Sans Bengali, Arial, sans-serif">উদ্দীপক বর্তনী (১৭ ও ১৮ নং প্রশ্ন)</text>
</svg>`;
}

/** SSC Cumilla 2024 Q6: transformer / potential divider style stimulus */
function cumilla2024VoltageDivider() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 280" width="480" height="280" role="img" aria-label="চিত্র অনুযায়ী Vs বিভব">
  <rect width="480" height="280" rx="16" fill="#0f172a"/>
  <text x="240" y="26" text-anchor="middle" fill="#e2e8f0" font-family="Noto Sans Bengali, Arial, sans-serif" font-size="13" font-weight="700">$V_p = 220\\,\\text{V}$, $n_p:n_s = 100:40$</text>
  <rect x="50" y="50" width="380" height="180" rx="12" fill="#111c33" stroke="#334155"/>
  <rect x="80" y="90" width="70" height="100" rx="6" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
  <rect x="170" y="90" width="70" height="100" rx="6" fill="#1e293b" stroke="#f472b6" stroke-width="2"/>
  <path d="M270 140 h40 M290 120 v40" stroke="#facc15" stroke-width="3"/>
  <text x="115" y="80" text-anchor="middle" fill="#7dd3fc" font-size="11" font-family="Arial">Primary</text>
  <text x="205" y="80" text-anchor="middle" fill="#fda4af" font-size="11" font-family="Arial">Secondary</text>
  <text x="115" y="210" text-anchor="middle" fill="#e2e8f0" font-size="12" font-family="Arial">$V_p$</text>
  <text x="290" y="210" text-anchor="middle" fill="#fde68a" font-size="13" font-weight="700" font-family="Arial">$V_s$</text>
  <text x="240" y="255" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Noto Sans Bengali, Arial, sans-serif">চিত্র অনুযায়ী $V_s$ কত?</text>
</svg>`;
}

/** Unit symbol option card for fundamental-unit MCQs */
function unitSymbolOption(symbol, labelBn) {
  const safe = escapeXml(symbol);
  const label = escapeXml(labelBn);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="${safe}">
  <rect width="280" height="200" rx="14" fill="#0f172a"/>
  <rect x="20" y="20" width="240" height="140" rx="10" fill="#1e293b" stroke="#334155"/>
  <text x="140" y="105" text-anchor="middle" fill="#38bdf8" font-family="Arial, sans-serif" font-size="42" font-weight="700">${safe}</text>
  <text x="140" y="185" text-anchor="middle" fill="#e2e8f0" font-family="Noto Sans Bengali, Arial, sans-serif" font-size="13">${label}</text>
</svg>`;
}

/** Generic mixed circuit stimulus from question text (best-effort). */
function circuitFromQuestionText(text, title = "উদ্দীপক বর্তনী") {
  const t = String(text ?? "");
  const r1 = t.match(/R[_\s]*1\s*[=:]\s*([0-9০-৯]+)\s*Ω?/i)?.[1] ?? "5";
  const r2 = t.match(/R[_\s]*2\s*[=:]\s*([0-9০-৯]+)\s*Ω?/i)?.[1] ?? "10";
  const r3 = t.match(/R[_\s]*3\s*[=:]\s*([0-9০-৯]+)\s*Ω?/i)?.[1] ?? "20";
  const v = t.match(/([0-9০-৯]+)\s*V\b|([0-9০-৯]+)\s*ভোল্ট/i)?.[1] ?? "12";
  const safeTitle = escapeXml(title);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 300" width="520" height="300" role="img" aria-label="${safeTitle}">
  <rect width="520" height="300" rx="16" fill="#0f172a"/>
  <text x="260" y="28" text-anchor="middle" fill="#e2e8f0" font-family="Noto Sans Bengali, Arial, sans-serif" font-size="14" font-weight="700">$R_1=${r1}Ω$, $R_2=${r2}Ω$, $R_3=${r3}Ω$, ${v}V</text>
  <rect x="40" y="50" width="440" height="200" rx="12" fill="#111c33" stroke="#334155"/>
  <circle cx="90" cy="150" r="18" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
  <text x="90" y="155" text-anchor="middle" fill="#e2e8f0" font-size="12" font-family="Arial">${v}V</text>
  <rect x="160" y="132" width="44" height="36" rx="4" fill="#1e293b" stroke="#f472b6" stroke-width="2"/>
  <text x="182" y="155" text-anchor="middle" fill="#fda4af" font-size="11" font-family="Arial">R1</text>
  <rect x="240" y="110" width="44" height="36" rx="4" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
  <text x="262" y="133" text-anchor="middle" fill="#86efac" font-size="11" font-family="Arial">R2</text>
  <rect x="240" y="170" width="44" height="36" rx="4" fill="#1e293b" stroke="#a78bfa" stroke-width="2"/>
  <text x="262" y="193" text-anchor="middle" fill="#c4b5fd" font-size="11" font-family="Arial">R3</text>
  <line x1="108" y1="150" x2="160" y2="150" stroke="#94a3b8" stroke-width="2"/>
  <line x1="204" y1="150" x2="240" y2="128" stroke="#94a3b8" stroke-width="2"/>
  <line x1="204" y1="150" x2="240" y2="188" stroke="#94a3b8" stroke-width="2"/>
  <line x1="284" y1="128" x2="380" y2="128" stroke="#94a3b8" stroke-width="2"/>
  <line x1="284" y1="188" x2="380" y2="188" stroke="#94a3b8" stroke-width="2"/>
  <line x1="380" y1="128" x2="380" y2="188" stroke="#94a3b8" stroke-width="2"/>
  <line x1="380" y1="158" x2="430" y2="158" stroke="#94a3b8" stroke-width="2"/>
  <line x1="430" y1="158" x2="430" y2="220" stroke="#94a3b8" stroke-width="2"/>
  <line x1="430" y1="220" x2="90" y2="220" stroke="#94a3b8" stroke-width="2"/>
  <line x1="90" y1="220" x2="90" y2="168" stroke="#94a3b8" stroke-width="2"/>
  <text x="260" y="280" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Noto Sans Bengali, Arial, sans-serif">${safeTitle}</text>
</svg>`;
}

module.exports = {
  cumilla2024CircuitR123,
  cumilla2024VoltageDivider,
  unitSymbolOption,
  circuitFromQuestionText,
};
