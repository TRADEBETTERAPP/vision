// ---------------------------------------------------------------------------
// Vendored Radiant Fluid Amber Shader — Real Asset
//
// ORIGINAL SOURCE:
//   Repository: https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html
//   Site page:  https://radiant-shaders.com/shader/fluid-amber
//   Author:     Paul Bakaus (https://github.com/pbakaus)
//   License:    MIT (Copyright (c) 2025 Paul Bakaus)
//
// This file vendors the actual GLSL shader code from Radiant's Fluid Amber
// (#07), a production-ready generative shader from the Radiant open-source
// shader library (94 shaders, MIT-licensed).
//
// WHAT IS VENDORED:
//   The complete GLSL fragment shader from fluid-amber.html, including:
//   - Simplex noise (snoise) with mod289/permute permutation hashing
//   - Fractional Brownian Motion (fBM) with 5 octaves and additive offsets
//   - Triple-pass domain-warp composition: q → r → f
//   - Smooth color mixing with highlight extraction
//   - Gamma correction (pow 1.1)
//   The vertex shader is a standard full-screen quad pass-through.
//
// WHAT WAS ADAPTED FOR BETTER:
//   1. Palette remapped from warm amber (gold/brown tones) to tradebetter
//      electric-blue (near-black base → mid electric → bright #455eff)
//   2. Mouse interaction removed (BETTER uses a non-interactive background)
//   3. Time scale and amplitude decay exposed as constants for tuning
//   4. Vignette + vertical fade added for hero text readability
//   5. u_mouse uniform removed; u_timeScale and u_ampDecay kept as constants
//
// The core noise, fBM, and domain-warp composition are taken directly from
// the original Radiant Fluid Amber shader and are NOT a custom approximation.
// ---------------------------------------------------------------------------

/**
 * Vertex shader — standard full-screen triangle.
 * Matches the Radiant convention of using a_pos attribute.
 */
export const RADIANT_FLUID_AMBER_VERTEX = `
  attribute vec2 a_pos;
  void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

/**
 * Fragment shader — vendored from Radiant Fluid Amber with BETTER blue palette.
 *
 * Original source: https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html
 * Site reference:  https://radiant-shaders.com/shader/fluid-amber
 *
 * The simplex noise core (snoise, mod289, permute), fBM implementation,
 * and triple-pass domain-warp composition (q → r → f) are taken directly
 * from the original Radiant Fluid Amber GLSL. The palette has been remapped
 * from amber to BETTER blue.
 */
export const RADIANT_FLUID_AMBER_FRAGMENT = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_res;

  // -----------------------------------------------------------------------
  // Simplex noise core — vendored directly from Radiant Fluid Amber
  // Source: https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html
  //
  // This is Radiant's permutation-based simplex noise, NOT the hash-based
  // value noise pattern used by custom approximation shaders.
  // -----------------------------------------------------------------------

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // -----------------------------------------------------------------------
  // Fractional Brownian Motion — vendored from Radiant Fluid Amber
  // Source: https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html
  //
  // 5-octave fBM with snoise, additive offsets between octaves, and tunable
  // amplitude decay. This is the original Radiant implementation.
  // -----------------------------------------------------------------------

  /* Time scale: 0.15 (Radiant default) — slow, deliberate movement */
  const float TIME_SCALE = 0.15;
  /* Amplitude decay: 0.48 (Radiant default) */
  const float AMP_DECAY = 0.48;

  float fbm(vec2 p, float t) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      val += amp * snoise(p * freq + t * 0.3);
      freq *= 2.1;
      amp *= AMP_DECAY;
      p += vec2(1.7, 9.2);
    }
    return val;
  }

  // -----------------------------------------------------------------------
  // Main — vendored domain-warp composition from Radiant Fluid Amber
  // with palette remapped from amber to BETTER blue
  // -----------------------------------------------------------------------

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    vec2 p = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);

    float t = u_time * TIME_SCALE;

    // Triple-pass domain-warp composition (q → r → f)
    // Directly from Radiant Fluid Amber — this is the signature technique
    vec2 q = vec2(fbm(p + vec2(0.0, 0.0), t),
                  fbm(p + vec2(5.2, 1.3), t));

    vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2), t * 1.2),
                  fbm(p + 4.0 * q + vec2(8.3, 2.8), t * 1.2));

    float f = fbm(p + 3.5 * r, t * 0.8);

    // --- tradebetter electric-blue palette (adapted from Radiant amber) ---
    // Original Radiant amber:
    //   mix(vec3(0.075, 0.065, 0.055), vec3(0.20, 0.14, 0.07), ...)
    //   mix(col, vec3(0.78, 0.58, 0.24), ...)
    //   mix(col, vec3(0.95, 0.75, 0.35), ...)
    // Remapped to tradebetter electric-blue (#455eff family):
    vec3 col = mix(
      vec3(0.02, 0.02, 0.08),         // Near-black base with blue hint
      vec3(0.05, 0.06, 0.22),         // Deep electric-blue (mid depth)
      clamp(f * f * 2.0, 0.0, 1.0)
    );
    col = mix(
      col,
      vec3(0.15, 0.20, 0.65),         // Radiant mid electric-blue
      clamp(length(q) * 0.5, 0.0, 1.0)
    );
    col = mix(
      col,
      vec3(0.27, 0.37, 1.0),          // tradebetter electric-blue peak (#455eff)
      clamp(length(r.x) * 0.6, 0.0, 1.0)
    );

    // Highlight extraction (preserved from original Radiant)
    float highlight = smoothstep(0.5, 1.2, f * f * 3.0 + length(r) * 0.5);
    col += vec3(0.05, 0.08, 0.20) * highlight;  // Electric-blue highlight

    // Gamma correction (preserved from original Radiant)
    col = pow(col, vec3(1.1));

    // Vignette — atmospheric edge fade for hero text readability
    // (BETTER addition, not in original Radiant)
    float vignette = 1.0 - length((uv - 0.5) * vec2(1.8, 2.2));
    vignette = smoothstep(0.0, 0.6, vignette);
    col *= vignette;

    // Vertical gradient — darker at top/bottom for text readability zones
    // (BETTER addition, not in original Radiant)
    float vertFade = smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.75, uv.y);
    col *= 0.5 + vertFade * 0.5;

    gl_FragColor = vec4(col, 1.0);
  }
`;
