import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * Flat SVG illustrations drawn with the active palette (they re-colour when the palette changes).
 * names: team | building | calendar | clock | pin | shield | search | error | lock | inbox
 */
const W = "#ffffff";

function Stage({ c, children }) {
  return (
    <>
      <circle cx="120" cy="86" r="66" fill={c.soft} opacity="0.4" />
      <ellipse cx="120" cy="160" rx="80" ry="9" fill={c.soft} opacity="0.7" />
      <g className="twinkle" fill={c.accent}>
        <path d="M34 54h10M39 49v10" stroke={c.accent} strokeWidth="3" strokeLinecap="round" />
        <circle cx="206" cy="46" r="4" />
      </g>
      <circle cx="200" cy="120" r="5" fill={c.primary} opacity="0.5" />
      <circle cx="36" cy="124" r="4" fill={c.accent} opacity="0.5" />
      <g className="float">{children}</g>
    </>
  );
}

const person = (cx, cy, s, color, c) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    <circle cx="0" cy="-26" r="15" fill={color} />
    <path d="M-27 34v-16a27 27 0 0 1 54 0v16z" fill={color} />
    <circle cx="0" cy="-26" r="15" fill="none" stroke={W} strokeWidth="3" opacity="0.5" />
    <path d="M-9 8l9 9 9-9" fill="none" stroke={c.bg} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
  </g>
);

const SCENES = {
  team: (c) => (
    <Stage c={c}>
      {person(76, 112, 0.78, c.ink, c)}
      {person(164, 112, 0.78, c.accent, c)}
      {person(120, 100, 1, c.primary, c)}
      <circle cx="168" cy="52" r="15" fill={c.accent} />
      <path d="M168 45v14M161 52h14" stroke={W} strokeWidth="3.5" strokeLinecap="round" />
    </Stage>
  ),
  building: (c) => (
    <Stage c={c}>
      <rect x="64" y="56" width="58" height="102" rx="6" fill={c.ink} />
      <rect x="126" y="86" width="52" height="72" rx="6" fill={c.primary} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((k) => <rect key={`a${r}${k}`} x={72 + k * 17} y={66 + r * 21} width="10" height="12" rx="2" fill={c.soft} opacity={(r + k) % 3 === 0 ? 1 : 0.55} />)
      )}
      {[0, 1, 2].map((r) =>
        [0, 1].map((k) => <rect key={`b${r}${k}`} x={134 + k * 20} y={96 + r * 19} width="11" height="11" rx="2" fill={c.bg} opacity="0.85" />)
      )}
      <rect x="86" y="132" width="14" height="26" rx="3" fill={c.accent} />
      <path d="M120 40v14" stroke={c.ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M120 40l14 5-14 5z" fill={c.accent} />
    </Stage>
  ),
  calendar: (c) => (
    <Stage c={c}>
      <rect x="60" y="44" width="120" height="108" rx="14" fill={W} stroke={c.ink} strokeWidth="3.5" />
      <path d="M60 58a14 14 0 0 1 14-14h92a14 14 0 0 1 14 14v18H60z" fill={c.ink} />
      <rect x="88" y="34" width="7" height="20" rx="3.5" fill={c.primary} />
      <rect x="145" y="34" width="7" height="20" rx="3.5" fill={c.primary} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((k) => <circle key={`${r}${k}`} cx={82 + k * 25} cy={96 + r * 19} r="5.5" fill={r === 1 && k === 2 ? "none" : c.soft} />)
      )}
      <circle cx="132" cy="115" r="13" fill={c.accent} />
      <path d="M126 115l5 5 9-10" fill="none" stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </Stage>
  ),
  clock: (c) => (
    <Stage c={c}>
      <circle cx="116" cy="90" r="52" fill={W} stroke={c.ink} strokeWidth="5" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        return <line key={i} x1={116 + Math.sin(a) * 40} y1={90 - Math.cos(a) * 40} x2={116 + Math.sin(a) * 45} y2={90 - Math.cos(a) * 45} stroke={c.soft} strokeWidth="3" strokeLinecap="round" />;
      })}
      <path d="M116 90V62" stroke={c.ink} strokeWidth="5" strokeLinecap="round" />
      <path d="M116 90l20 12" stroke={c.primary} strokeWidth="5" strokeLinecap="round" />
      <circle cx="116" cy="90" r="6" fill={c.accent} />
      <circle cx="166" cy="130" r="17" fill={c.primary} />
      <path d="M158 130l6 6 11-12" fill="none" stroke={W} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </Stage>
  ),
  pin: (c) => (
    <Stage c={c}>
      <rect x="52" y="82" width="136" height="72" rx="14" fill={W} stroke={c.soft} strokeWidth="3" />
      <path d="M62 140c24-30 40 6 62-18s34-22 58-34" fill="none" stroke={c.primary} strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
      <ellipse cx="120" cy="132" rx="18" ry="5" fill={c.ink} opacity="0.18" />
      <path d="M120 128c-22-24-30-36-30-50a30 30 0 0 1 60 0c0 14-8 26-30 50z" fill={c.accent} />
      <circle cx="120" cy="78" r="12" fill={W} />
    </Stage>
  ),
  shield: (c) => (
    <Stage c={c}>
      <path d="M120 36l48 18v36c0 32-22 52-48 62-26-10-48-30-48-62V54z" fill={c.primary} />
      <path d="M120 36l48 18v36c0 32-22 52-48 62z" fill={c.ink} opacity="0.22" />
      <path d="M102 92l14 14 26-30" fill="none" stroke={W} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="170" cy="50" r="11" fill={c.accent} />
    </Stage>
  ),
  search: (c) => (
    <Stage c={c}>
      <rect x="66" y="40" width="88" height="112" rx="12" fill={W} stroke={c.ink} strokeWidth="3.5" />
      {[62, 78, 94].map((y, i) => <rect key={y} x="80" y={y} width={i === 2 ? 36 : 60} height="8" rx="4" fill={c.soft} />)}
      <circle cx="142" cy="112" r="26" fill={W} fillOpacity="0.9" stroke={c.primary} strokeWidth="7" />
      <path d="M161 131l22 22" stroke={c.accent} strokeWidth="9" strokeLinecap="round" />
    </Stage>
  ),
  error: (c) => (
    <Stage c={c}>
      <path d="M120 42l60 102H60z" fill={c.soft} stroke={c.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M120 74v34" stroke={c.accent} strokeWidth="9" strokeLinecap="round" />
      <circle cx="120" cy="126" r="6" fill={c.accent} />
    </Stage>
  ),
  lock: (c) => (
    <Stage c={c}>
      <path d="M94 88V72a26 26 0 0 1 52 0v16" fill="none" stroke={c.primary} strokeWidth="11" strokeLinecap="round" />
      <rect x="78" y="86" width="84" height="64" rx="14" fill={c.ink} />
      <circle cx="120" cy="114" r="9" fill={c.accent} />
      <rect x="116" y="118" width="8" height="18" rx="4" fill={c.accent} />
    </Stage>
  ),
  inbox: (c) => (
    <Stage c={c}>
      <path d="M62 104l16-44a10 10 0 0 1 9-6h66a10 10 0 0 1 9 6l16 44v38a10 10 0 0 1-10 10H72a10 10 0 0 1-10-10z" fill={W} stroke={c.ink} strokeWidth="4" strokeLinejoin="round" />
      <path d="M62 104h32a8 8 0 0 1 8 8v2a8 8 0 0 0 8 8h24a8 8 0 0 0 8-8v-2a8 8 0 0 1 8-8h32" fill="none" stroke={c.ink} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="120" cy="66" r="17" fill={c.primary} />
      <path d="M112 66l6 6 11-12" fill="none" stroke={W} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </Stage>
  ),
};

export function Illustration({ name = "search", size = 180, label }) {
  const c = useTheme().palette.brand;
  const Scene = SCENES[name] ?? SCENES.search;
  return (
    <Box
      component="svg"
      viewBox="0 0 240 180"
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      sx={{
        width: size,
        maxWidth: "100%",
        height: "auto",
        flexShrink: 0,
        "@keyframes illoFloat": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        "@keyframes illoTwinkle": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.35 } },
        "& .float": { animation: "illoFloat 5s ease-in-out infinite" },
        "& .twinkle": { animation: "illoTwinkle 3s ease-in-out infinite" },
      }}
    >
      {Scene(c)}
    </Box>
  );
}
