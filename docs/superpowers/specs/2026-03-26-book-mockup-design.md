# Book Mockup Tool — Design Spec
**Date:** 2026-03-26

## Context

The user wants an interactive 3D book mockup tool that matches the realism and angle of a provided reference image (Igor Mann's "Personal Marketing Without Budget" cover). The tool must allow uploading custom front cover and spine PNGs, switching environments/backgrounds, and downloading the result as PNG. Everything should be configurable, with the architecture designed to later support other mockup types (phone, poster, packaging, etc.).

## Tech Stack

- **Framework:** React + Vite + TypeScript
- **3D:** Three.js via React Three Fiber (R3F) + Drei helpers
- **State:** Zustand
- **Styling:** Tailwind CSS
- **Export:** WebGL canvas `toDataURL` via custom hook

## Folder Structure

```
src/
  components/
    scene/
      BookScene.tsx        # R3F Canvas, camera, environment, post-processing
      Lighting.tsx         # Configurable lights (ambient, directional, spot)
      Environment.tsx      # HDRI/background switching
    book/
      BookMesh.tsx         # Custom book geometry + PBR materials
      BookGeometry.tsx     # Geometry builder (covers, spine, pages, bevel)
    ui/
      ControlPanel.tsx     # Main sidebar container
      sections/
        CoverSection.tsx   # Front cover + back cover upload
        SpineSection.tsx   # Spine PNG upload
        MaterialSection.tsx # Texture maps, finish (matte/gloss), roughness
        EnvironmentSection.tsx # Background type, HDRI preset, color
        CameraSection.tsx  # FOV, position presets, orbit enable/disable
        LightingSection.tsx # Per-light controls
        ExportSection.tsx  # Resolution, ratio, format, transparent bg
        PresetsSection.tsx # Load/save scene presets
      primitives/
        Slider.tsx         # Large circular thumb, uppercase label, right-aligned value
        ColorSwatch.tsx    # Filled circle swatches
        PillButton.tsx     # Rounded pill button
        Toggle.tsx         # Pill toggle
        UploadZone.tsx     # Drag-and-drop + click upload
        Dropdown.tsx       # Rounded pill select with chevron
        SectionHeader.tsx  # Uppercase monospace label
  config/
    book.config.ts         # Book geometry defaults (dimensions, bevel, page color)
    camera.config.ts       # Camera defaults (position, FOV, target)
    lighting.config.ts     # Light setup defaults (3-point studio)
    environment.config.ts  # HDRI presets list, default background
    material.config.ts     # PBR defaults (roughness, metalness, finish)
    export.config.ts       # Default resolution, ratio, format
  store/
    bookStore.ts           # Zustand store — textures, all config overrides
    presetStore.ts         # Built-in + user presets
  hooks/
    useExport.ts           # PNG capture: set resolution → capture → restore
    useBookTextures.ts     # Texture loading from uploaded files
  assets/
    hdri/                  # Studio, Outdoor, Dramatic, Minimal .hdr files
    defaults/
      cover-placeholder.png
      spine-placeholder.png
  App.tsx
  main.tsx
```

## Config System

Every visual parameter has a typed default in a config file. Zustand store holds **full copies** of config objects (not sparse patches). At init, the store is seeded from config defaults. UI reads from and writes to the store. This means:
- All configs can be serialized to JSON as a "preset" — the store IS the preset snapshot
- Applying a preset = `bookStore.setState(preset)` (full replacement, not merge)
- Future UI (sliders, inputs) just reads/writes to the store
- Adding a new mockup type = new config file + new mesh component

**`bookStore.ts`** holds: `{ book, camera, lighting, environment, material, export_ }` — one key per config domain, each typed to match its config file's shape.

**`presetStore.ts`** holds: `{ presets: Record<string, BookStoreState>, activePreset: string }`. Applying a preset calls `bookStore.setState(presets[name])`. Saving calls `presetStore.getState().save(name, bookStore.getState())` which persists to `localStorage`.

### Configurable Parameters

**Book Geometry (`book.config.ts`)**
- `width`, `height`, `depth` (cover thickness)
- `spineRadius` (rounded spine curve)
- `pageInset` (how much pages are inset from cover edges)
- `pageColor`, `pageRoughness`
- `coverBevelSize`
- `backCoverVisible: boolean` — v1 default `false` (camera angle hides it); when `true`, a back cover texture slot is exposed in the UI and material config

**Camera (`camera.config.ts`)**
- `position: [x, y, z]`
- `fov`
- `target: [x, y, z]`
- `near`, `far`
- `orbitEnabled` (toggle for interactive rotation)
- Named angle presets with coordinates:
  - `Reference`: position `[3.2, 1.8, 4.0]`, fov `42`, target `[0, 0, 0]`
  - `Front`: position `[0, 0, 5.0]`, fov `45`, target `[0, 0, 0]`
  - `Top`: position `[0, 5.0, 1.0]`, fov `45`, target `[0, 0, 0]`
  - `Side`: position `[-4.0, 0.5, 1.5]`, fov `45`, target `[0, 0, 0]`

**Lighting (`lighting.config.ts`)**
- Array of lights: `{ type, color, intensity, position, castShadow }`
- Default: 3-point studio (key, fill, rim)

**Environment (`environment.config.ts`)**
- `preset: 'studio' | 'outdoor' | 'dramatic' | 'minimal'`
- `backgroundType: 'hdri' | 'solid' | 'gradient' | 'transparent'`
- `backgroundColor`, `gradientFrom`, `gradientTo`

**Material (`material.config.ts`)**
- `coverRoughness`, `coverMetalness`
- `coverFinish: 'matte' | 'gloss' | 'satin'`
- `spineRoughness`, `spineMetalness`
- `coverNormalMap`, `coverRoughnessMap` (optional texture uploads)

**Export (`export.config.ts`)**
- `resolution: '1x' | '2x' | '4x'` — base unit is canvas native size (matches viewport); 2x = 2× pixel dimensions, 4x = 4×
- `ratio: '1:1' | '4:3' | '16:9' | 'custom'` — sets canvas aspect ratio before capture:
  - `1:1` → 1200×1200px at 1x
  - `4:3` → 1600×1200px at 1x
  - `16:9` → 1920×1080px at 1x
  - `custom` → user-entered width/height in px
- `format: 'png'` — only valid value in v1; field reserved for future WebP/JPEG support
- `transparentBackground: boolean`

## 3D Book Geometry

The book is NOT a plain Box. Custom geometry built in `BookGeometry.tsx`, which exports **geometry factory functions** (not React components) consumed by `BookMesh.tsx`. This keeps geometry logic reusable outside R3F if needed.

Parts:
- **Front cover:** flat `PlaneGeometry`, slightly proud of pages
- **Back cover:** flat `PlaneGeometry` (hidden by default, see `backCoverVisible`)
- **Spine:** `CylinderGeometry` arc segment (partial cylinder). UV mapping: the texture is mapped to the arc's angular range only (not the full 2π), so a spine PNG fills the spine face without squashing. Achieved by computing `uv.x = theta / arcAngle` per vertex.
- **Pages:** `BoxGeometry` block, inset from covers on all sides, subtle noise `DataTexture` for paper grain
- **Cover bevel:** thin chamfer geometry on cover edges

`BookMesh.tsx` is a React component (R3F mesh) that imports geometry factories from `BookGeometry.tsx`, applies `MeshStandardMaterial` with PBR maps from the store, and renders to the scene.

The reference angle: camera slightly above, from the right — `position: [3.2, 1.8, 4.0]`, `fov: 42`, `target: [0, 0, 0]`.

## Scene Component Wiring

Scene components (`Lighting.tsx`, `Environment.tsx`) consume `useBookStore` directly — they do not receive props from `BookScene.tsx`. Each reads only its domain slice (e.g., `useBookStore(s => s.lighting)`). `BookScene.tsx` is a thin wrapper that renders the Canvas and composes scene children.

`ControlPanel.tsx` sections each consume their own store slice and write back via store actions. There is no prop drilling.

## `useBookTextures` API

```ts
// Returns THREE.Texture | null for each texture slot
// Handles URL.revokeObjectURL cleanup on unmount or file change
// Exposes loading state per slot
const { coverTexture, spineTexture, loading } = useBookTextures()
```

The hook listens to `useBookStore(s => s.book.coverImageFile)` etc., creates object URLs, loads textures via `THREE.TextureLoader`, and cleans up on change.

## Shadow Config

Shadows use Drei's `<ContactShadows>` (not Three.js shadow maps — simpler, no shadow camera tuning needed). Added to `lighting.config.ts`:

```ts
contactShadow: {
  opacity: 0.3,
  blur: 2.5,
  far: 1.5,
  resolution: 512,
}
```

## Post-Processing

Out of scope for v1. The `BookScene.tsx` description referencing "post-processing" is removed. No bloom, vignette, or SSAO in v1.

## UI Design Language

Matching the provided reference UI:
- **Font:** Monospace or geometric sans-serif, uppercase labels
- **Sliders:** Large circular black thumb, thin gray track
- **Buttons:** Rounded pill shape, light gray fill or black CTA
- **Swatches:** Plain filled circles, no border
- **Toggle:** Standard pill, black/gray
- **Inputs:** Rounded rectangle, minimal border
- **Layout:** Single column, ~280px panel width, 24px section spacing
- **Download CTA:** Full-width black pill, chevron for format dropdown

## Preset System

Built-in presets:
1. **Studio** — matches reference image (teal bg compatible, white studio lighting)
2. **Dark** — dramatic black background, rim lighting
3. **Outdoor** — sky HDRI, natural diffuse
4. **Minimal** — transparent background, flat lighting

User can save current full state as named preset (stored in localStorage), load any preset, reset to default.

## Export Flow

1. User selects resolution + ratio + format in Export section
2. Clicks Download
3. `useExport` hook:
   - Temporarily resizes renderer to target pixel dimensions
   - Calls `gl.render(scene, camera)`
   - Calls `gl.domElement.toDataURL('image/png')`
   - Triggers browser download
   - Restores original renderer size

## Built-in Presets for Reference Match

The "Studio" preset will be tuned to match the reference image:
- Camera: `position: [3.2, 1.8, 4.0]`, `fov: 42`
- Key light: white, intensity 1.2, position upper-left
- Fill light: warm, intensity 0.4, position right
- Rim light: cool, intensity 0.6, position behind-left
- Background: solid `#f5f5f5` or transparent
- Shadow: soft, opacity 0.3

## Verification

1. `npm run dev` — app opens, placeholder book visible at reference angle
2. Upload a PNG → front cover updates in real time
3. Upload spine PNG → spine updates
4. Switch environment presets → background and lighting change
5. Adjust sliders → book geometry/material responds live
6. Click Download → PNG file saved at correct resolution
7. Save preset → reload page → preset still available
8. All config values match TypeScript types (no `any`)
