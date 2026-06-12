# v0.5 Visual Bar — Reference Analysis

Source: Sam's reference video (another Three.js starship, 2026-06-12). Extracted frames at
`C:\Users\bates\AppData\Local\Temp\claude\starship-ref-frames\ref-01..10.png` (02/05/08 are the keepers).
Goal: close the gap between our build and this bar. Interior = Starfield, exterior = No Man's Sky.

## What the reference does that we don't (ranked by impact)

1. **Dark, pooled lighting.** His corridor is mostly shadow with warm light POOLS under ceiling
   fixtures and emissive accents punching through. Ours is a uniform bright wash (hemisphere+ambient
   too high). Fix: cut ambient/hemisphere ~60-70%, let placed lights create pools with real falloff,
   raise emissive contrast. The mood IS the lighting.
2. **Specular life / PBR.** His floor is glossy — light panels reflect in streaks; metals read as
   metal. We are matte Lambert everywhere. Fix: MeshStandardMaterial BY DEFAULT + scene environment
   map (THREE RoomEnvironment via PMREMGenerator — cheap, no files) + procedural roughnessMap
   variation (worn gloss streaks on deck plates, brushed metal counters, satin painted walls).
3. **Crevice darkness (AO).** Corners, panel seams, under-furniture all darken. Fix: SSAO pass
   default-on if budget holds (we have p95 7ms of an 18ms budget — spend it), plus cheap baked
   corner-darkening in wall textures.
4. **Filmic grade.** Visible tone curve: deep blacks that don't crush, highlights roll off, slight
   vignette. Fix: renderer.toneMapping = ACESFilmic + exposure tune (~1.0-1.2), vignette in the
   final post pass, keep bloom subtle.
5. **Shadows.** At least key fixtures cast. Fix: 1-2 shadow-casting lights max (corridor spine +
   cockpit/engineering hero), 1024 maps, tight frustums. Headed-gated.
6. **Round portholes with presence.** His porthole is a thick beveled ring with bolts — a real
   ship part — framing a RINGED planet. Ours are bare rectangular cutouts. Fix: circular porthole
   geometry (ring rim + bolt ring + inner bevel) replacing the rectangular reveals; windowWall
   keeps a square structural opening, the round bezel overlays it.
7. **Space has color depth.** Behind his planet: red/teal nebula washes, not pure black. Fix: 2-3
   huge soft nebula billboards (additive, very low alpha, palette-tinted) + the v0.4 encounter
   bodies. Ringed planet class must look as good as his Saturn (ring alpha texture + tilt).
8. **Diegetic flight HUD.** Top bar: "DRIFTER · T+18:21 · CRUISE". Fix: top-center HUD strip:
   "STREL-7 · T+<shipclock> · CRUISE" in the existing HUD language.
9. **Console glow.** His console screens wash the cockpit in light — screens are the cockpit's
   light source. Fix: stronger emissive on screens + (if shadows lane allows) one teal point light
   at the console, or fake with emissive underglow planes.

## Hard constraints that survive
- Headed avgFps ≥ 60, p95 ≤ 18ms (we may SPEND from 7ms → ~12-14ms for all of the above, gated).
- Draw calls ≤ 300, tris ≤ 500k. Verify harness + 5 functional tests stay green.
- Palette identity stays: cream/orange/teal/gunmetal/rust — the reference is compatible (his ship
  is grey/orange/teal too). We are darkening VALUES, not changing HUES.
- All procedural, zero asset files. PMREM RoomEnvironment is generated, allowed.

## Order of operations (v0.5, after v0.4 lanes merge)
Tone+env+PBR-default first (global feel), then lighting rebalance per room, then SSAO/shadows
(headed-gate each), then portholes + nebula + HUD strip, then a full screenshot pass vs ref frames.
