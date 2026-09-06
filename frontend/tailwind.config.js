/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0F1C",
        surface: "#111A2C",
        raised: "#17233A",
        overlay: "#1E2C47",
        line: "#26314A",
        "line-soft": "#1B2740",
        ink: "#E7ECF5",
        "ink-dim": "#9AA7C2",
        "ink-faint": "#5C6A88",
        signal: "#49D3C4",
        "signal-dim": "#1F4A47",
        amber: "#F0B858",
        "amber-dim": "#4A3A1C",
        critical: "#EF6461",
        "critical-dim": "#4A2323",
        good: "#5FD98A",
        "good-dim": "#1F3D2C",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
      },
      boxShadow: {
        panel: "none",
      },
      animation: {
        "pulse-slow": "pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
