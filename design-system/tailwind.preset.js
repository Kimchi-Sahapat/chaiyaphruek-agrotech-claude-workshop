/**
 * ชัยพฤกษ์ อโกรเทค — Tailwind preset
 * Usage in a consuming app's tailwind.config.js:
 *
 *   module.exports = {
 *     presets: [require('./design-system/tailwind.preset.js')],
 *     content: ['./src/**\/*.{html,js,ts,jsx,tsx,vue,svelte}'],
 *   }
 *
 * Then: bg-brand-green, text-brand-navy, text-cta, font-brand, rounded-pill, shadow-float ...
 * Source of truth: design-system/tokens.json
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#4DB748",
          navy: "#1B3A8C",
          red: "#E8323C",
          gold: "#FFD700",
          white: "#FFFFFF",
        },
        "green-dark": "#1E7B34",
        "green-light": "#7DC75A",
        cream: "#FFFDE0",
        // semantic aliases
        bg: "#4DB748",
        headline: "#1B3A8C",
        cta: "#E8323C",
        highlight: "#FFD700",
        "footer-bg": "#1E7B34",
      },
      fontFamily: {
        brand: ['Kanit', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        bold: "700",
        extrabold: "800",
      },
      fontSize: {
        // UI scale
        hero: ["3.5rem", { lineHeight: "1.15" }],
        // poster/social scale (for artwork rendered to 1080px canvases)
        "poster-hero": ["110px", { lineHeight: "1.15", fontWeight: "800" }],
        "poster-subhead": ["60px", { lineHeight: "1.15", fontWeight: "700" }],
        "poster-support": ["38px", { lineHeight: "1.4" }],
        "poster-footer": ["25px", { lineHeight: "1.4" }],
      },
      lineHeight: {
        headline: "1.15",
        body: "1.4",
      },
      borderRadius: {
        pill: "999px",
      },
      boxShadow: {
        float: "0 8px 24px rgba(27, 58, 140, 0.25)",
      },
      backgroundImage: {
        "banner-gradient": "linear-gradient(90deg, #4DB748 0%, #7DC75A 100%)",
      },
      // brand motion (ease-brand-enter, duration-base …) — see tokens.json › motion
      transitionTimingFunction: {
        "brand-enter": "cubic-bezier(0.05, 0.7, 0.1, 1)",
        "brand-info": "cubic-bezier(0, 0, 0.38, 0.9)",
        "brand-exit": "cubic-bezier(0.3, 0, 0.8, 0.15)",
        "brand-move": "cubic-bezier(0.2, 0, 0, 1)",
        "brand-pop": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: { snap: "100ms", quick: "200ms", base: "400ms", slow: "700ms", hero: "1000ms" },
    },
  },
};
