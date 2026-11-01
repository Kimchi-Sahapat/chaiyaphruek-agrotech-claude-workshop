/* =====================================================================
   Brand logo for motion compositions.
   Compositions use <div class="cyp-logo" data-logo></div>; the kit fills it.

   ⚠️ CYP_LOGO_SVG below is a PLACEHOLDER drawn from the written description in
   design.md (red ring, white disc, navy curved name, 3 green trees, 5 navy waves,
   gold mound). It is NOT the official artwork — do not publish with it.

   When the official logo arrives: put the file in this folder (PNG with
   transparent background, or SVG with text converted to outlines) and set
   CYP_LOGO_SRC to its filename. The kit then uses it everywhere.
   ===================================================================== */
window.CYP_LOGO_SRC = null; // e.g. 'logo-official.png'
window.CYP_LOGO_BASE = new URL('.', document.currentScript.src).href;
window.CYP_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="ชัยพฤกษ์ อโกรเทค">
  <defs>
    <clipPath id="inner"><circle cx="200" cy="200" r="172"/></clipPath>
    <path id="arc" d="M 82.2,231.6 A 122,122 0 1 1 317.8,231.6"/>
  </defs>
  <circle cx="200" cy="200" r="186" fill="#FFFFFF" stroke="#E8323C" stroke-width="24"/>
  <g clip-path="url(#inner)">
    <path d="M 128,372 A 72,72 0 0 1 272,372 Z" fill="#FFD700"/>
    <g fill="none" stroke="#1B3A8C" stroke-width="7" stroke-linecap="round">
      <path d="M 96,270 q 13,-9 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0"/>
      <path d="M 96,283 q 13,-9 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0"/>
      <path d="M 96,296 q 13,-9 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0"/>
      <path d="M 104,309 q 13,-9 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0"/>
      <path d="M 118,322 q 13,-9 26,0 t 26,0 t 26,0 t 26,0 t 26,0 t 26,0"/>
    </g>
    <g fill="#4DB748">
      <path d="M 129,262 L 147,262 L 141,196 L 135,196 Z"/>
      <circle cx="138" cy="182" r="30"/>
      <path d="M 253,262 L 271,262 L 265,196 L 259,196 Z"/>
      <circle cx="262" cy="182" r="30"/>
      <path d="M 188,262 L 212,262 L 205,170 L 195,170 Z"/>
      <circle cx="200" cy="146" r="42"/>
    </g>
  </g>
  <text font-family="Kanit, 'Noto Sans Thai', sans-serif" font-weight="800" font-size="44" fill="#1B3A8C" letter-spacing="1">
    <textPath href="#arc" startOffset="50%" text-anchor="middle">ชัยพฤกษ์ อโกรเทค</textPath>
  </text>
</svg>`;
