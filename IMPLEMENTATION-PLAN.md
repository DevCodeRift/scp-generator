# SCP Generator - .dat Integration & Body Cam Video Processor

## Overview

Two major features:
1. **DAT Template Integration** - Import, display, and export Gmod addon `.dat` document templates
2. **SCP Body Cam Video Processor** - Upload Gmod clips, apply SCP-themed surveillance effects server-side with FFmpeg, download processed video

---

## Feature 1: .dat Template Integration

### 1.1 - DAT Parser & Serializer

**New file:** `src/lib/dat/parser.ts`
- Parse `.dat` JSON into internal types
- Handle all element types: `header`, `line`, `paragraph`, `smalltext`, `image`, `signature`, `dottedline`, `checkbox`
- Map `.dat` `type` field (`foundation_research_study`, `foundation_report`) to app document types
- Validate with Zod schema

**New file:** `src/lib/dat/serializer.ts`
- Convert app documents back to `.dat` JSON format
- Generate appropriate `draftId`, `date`, `creator` fields
- Map app document fields to `.dat` `pages[].elements[]` structure

**New file:** `src/lib/dat/types.ts`
- TypeScript types + Zod schemas for the `.dat` format:
  - `DatDocument`, `DatPage`, `DatElement`, `DatSettings`, `DatFields`
  - Element subtypes: `DatHeaderElement`, `DatImageElement`, `DatSignatureElement`, `DatCheckboxElement`

### 1.2 - DAT Import (Upload .dat files)

**New file:** `src/lib/components/ui/DatImport.svelte`
- File input accepting `.dat` files
- Parses uploaded file using `dat/parser.ts`
- Converts to nearest matching app document type
- Loads into document store for editing

**Modify:** `src/routes/+page.svelte`
- Add "Import .dat Template" button to landing page

### 1.3 - DAT Reference Display

**New route:** `src/routes/templates/+page.svelte`
- Lists all known `.dat` template structures
- Shows page-by-page breakdown of each template
- Read-only formatted preview

**New file:** `src/lib/components/preview/DatPreview.svelte`
- Renders a parsed `.dat` document as a styled preview
- Renders each element type visually (headers as large text, lines as `<hr>`, images as placeholders, signatures as boxes, checkboxes as toggles)

### 1.4 - DAT Export

**Modify:** `src/lib/components/ui/ExportOptions.svelte`
- Add `.dat` export format alongside existing PNG/PDF

**Modify:** `src/routes/editor/[type]/+page.svelte`
- Wire up `.dat` export handler similar to existing `handleExportPNG`/`handleExportPDF`

### 1.5 - .dat JSON Schema Reference

The `.dat` files in `Documentation/` are JSON with this structure:

```json
{
  "signatures": [],
  "settings": {
    "noCheckboxWhenStickied": false,
    "singleSign": false
  },
  "type": "foundation_research_study | foundation_report",
  "allowScanning": true,
  "draftId": 97212147,
  "date": 1751625801,
  "pages": [
    {
      "elements": [
        { "type": "header", "content": "Title" },
        { "type": "line", "content": "New Line" },
        { "type": "paragraph", "content": "Body text..." },
        { "type": "smalltext", "content": "Fine print..." },
        {
          "type": "image",
          "content": "New Image",
          "params": { "align": 0.5, "scale": 0.6 },
          "args": { "url": "https://..." }
        },
        { "type": "signature", "content": "New Signature Box", "uid": 588514658 },
        { "type": "dottedline", "content": "" },
        { "type": "checkbox", "content": "Checklist item", "checked": false }
      ],
      "effects": []
    }
  ],
  "creator": "76561198333877853",
  "fields": {
    "title": "RSD Experiment Template",
    "authorized": "- N/A",
    "participating": " - D-",
    "subjects": " - SCP-",
    "conducted": " - "
  }
}
```

### 1.6 - Files Summary

| Action | File |
|--------|------|
| Create | `src/lib/dat/types.ts` |
| Create | `src/lib/dat/parser.ts` |
| Create | `src/lib/dat/serializer.ts` |
| Create | `src/lib/components/ui/DatImport.svelte` |
| Create | `src/lib/components/preview/DatPreview.svelte` |
| Create | `src/routes/templates/+page.svelte` |
| Modify | `src/lib/components/ui/ExportOptions.svelte` |
| Modify | `src/routes/editor/[type]/+page.svelte` |
| Modify | `src/routes/+page.svelte` |

---

## Feature 2: SCP Body Cam Video Processor

### 2.1 - Infrastructure & Dependencies

**New dependencies:**
- `fluent-ffmpeg` - Node.js FFmpeg wrapper for building filter chains
- `@types/fluent-ffmpeg` - TypeScript types

**Modify:** `Dockerfile`
- Add FFmpeg to Alpine image: `RUN apk add --no-cache ffmpeg`
- Create temp directory: `RUN mkdir -p /tmp/video-processing`

**Modify:** `package.json`
- Add `fluent-ffmpeg` dependency

### 2.2 - Video Effects Schema

**New file:** `src/lib/schemas/video-effects.ts`

Configurable effects:
| Effect | Type | Default | Description |
|--------|------|---------|-------------|
| `scanlines` | boolean | `true` | CRT-style horizontal scanline overlay |
| `timestamp` | boolean | `true` | Running HH:MM:SS timecode display |
| `timestampFormat` | string | `"%{pts\\:hms}"` | FFmpeg timestamp format |
| `facilityId` | string | `"CAM-07 // SITE-19"` | Camera/facility label at top-left |
| `vignette` | boolean | `true` | Darkened edges |
| `vignetteIntensity` | number (0-1) | `0.5` | Vignette darkness level |
| `colorGrade` | enum | `'green'` | `'green' | 'gray' | 'blue' | 'sepia' | 'none'` |
| `noise` | boolean | `true` | Film grain / static noise |
| `noiseIntensity` | number (0-1) | `0.3` | Noise strength |
| `recIndicator` | boolean | `true` | Blinking red REC dot + text |
| `cameraShake` | boolean | `false` | Subtle camera wobble |
| `shakeIntensity` | number (0-1) | `0.2` | Shake amplitude |
| `scpWatermark` | boolean | `false` | SCP Foundation logo overlay |
| `outputQuality` | enum | `'medium'` | `'low' | 'medium' | 'high'` |

### 2.3 - Server-Side API Routes

**New file:** `src/routes/api/video/upload/+server.ts`
- `POST` - Accepts multipart video upload
- Validates file type (mp4, webm, avi, mov) and size (max 500MB)
- Saves to temp directory with UUID filename
- Probes video with FFmpeg for metadata
- Returns `{ jobId, filename, duration, resolution, fileSize }`

**New file:** `src/routes/api/video/process/+server.ts`
- `POST` - Accepts `{ jobId, effects: VideoEffects }`
- Builds FFmpeg filter chain based on selected effects
- Kicks off async processing
- Returns `{ jobId, status: 'processing' }`

**New file:** `src/routes/api/video/status/[jobId]/+server.ts`
- `GET` - Poll processing status
- Returns `{ status: 'processing' | 'complete' | 'error', progress?: number, error?: string }`

**New file:** `src/routes/api/video/download/[jobId]/+server.ts`
- `GET` - Stream processed video for download
- Sets appropriate Content-Disposition header
- Cleans up temp files after download (or on configurable timeout)

### 2.4 - Core Processing Logic

**New file:** `src/lib/server/video-processor.ts`

Builds FFmpeg complex filter chain. Example full-effect output:

```bash
ffmpeg -i input.mp4 \
  -vf "
    noise=alls=20:allf=t,
    colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3:0,
    vignette=angle=PI/4,
    drawtext=text='CAM-07 // SITE-19':x=20:y=20:fontsize=18:fontcolor=white@0.7:font=Courier,
    drawtext=text='%{pts\\:hms}':x=w-200:y=20:fontsize=18:fontcolor=white@0.7:font=Courier,
    drawtext=text='REC':x=20:y=h-40:fontsize=16:fontcolor=red@0.8:enable='lt(mod(t,2),1.5)',
    drawtext=text='●':x=50:y=h-40:fontsize=16:fontcolor=red@0.8:enable='lt(mod(t,2),1.5)'
  " \
  -c:a copy output.mp4
```

Filter breakdown per effect:
- **Scanlines:** Overlay generated scanline texture or use `drawbox` in a loop pattern
- **Timestamp:** `drawtext` with `%{pts\:hms}` positioned top-right, white @ 70% opacity, Courier font
- **Facility ID:** `drawtext` with fixed text at top-left
- **Vignette:** `vignette=angle=PI/4` (adjustable via intensity)
- **Color grading (green):** `colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3:0`
- **Color grading (gray):** `colorchannelmixer=.33:.33:.33:0:.33:.33:.33:0:.33:.33:.33:0`
- **Color grading (blue):** `colorchannelmixer=.2:.2:.4:0:.2:.2:.4:0:.2:.2:.6:0`
- **Color grading (sepia):** `colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131:0`
- **Noise:** `noise=alls={intensity*60}:allf=t`
- **REC indicator:** `drawtext` with `enable='lt(mod(t,2),1.5)'` for blinking
- **Camera shake:** `crop=iw-10:ih-10:5*sin(t*10):5*cos(t*8)` (oscillating crop)
- **Watermark:** `-i watermark.png` as second input + `overlay=W-w-20:H-h-20` (bottom-right)

**New file:** `src/lib/server/job-manager.ts`
- In-memory `Map<string, JobStatus>` tracking active jobs
- Job states: `uploading`, `uploaded`, `processing`, `complete`, `error`, `expired`
- Progress tracking via FFmpeg `progress` event
- Cleanup: delete temp files after download or after 1-hour timeout
- Periodic cleanup interval (every 15 minutes)

### 2.5 - Client UI

**New route:** `src/routes/video/+page.svelte`
- Full-page video processor tool matching app's CRT/terminal aesthetic
- Three-step workflow UI:
  1. **Upload** - Drag-and-drop zone + file picker
  2. **Configure** - Effect toggles and settings
  3. **Process & Download** - Progress bar + download button

**New file:** `src/lib/components/video/VideoUpload.svelte`
- Drag-and-drop zone styled with terminal aesthetic
- File type validation (.mp4, .webm, .avi, .mov)
- Upload progress indicator
- Displays video metadata after upload (duration, resolution, file size)

**New file:** `src/lib/components/video/EffectsConfigurator.svelte`
- Toggle switches for each effect using existing `terminal-window` styling
- Sliders (using existing `Slider.svelte`) for intensity values
- `Select` dropdown for color grade preset
- `Input` for facility ID / camera label text
- Preset buttons: "Standard Body Cam", "Surveillance CCTV", "Recovered Tape", "Corrupted Feed"

**New file:** `src/lib/components/video/ProcessingStatus.svelte`
- Animated progress bar (terminal-styled)
- Phase indicator: "Applying effects..." / "Encoding..." / "Complete"
- Download button when done (auto-names file: `SCP-BODYCAM-{timestamp}.mp4`)
- Error display with retry option

**Modify:** `src/routes/+page.svelte`
- Add "Body Cam Processor" card/link in the tools section

### 2.6 - Static Assets

**New file:** `src/lib/assets/overlays/scanlines.png`
- Tileable 1px scanline texture (transparent PNG)

**New file:** `src/lib/assets/overlays/scp-watermark.png`
- Transparent SCP Foundation logo for video watermark overlay

### 2.7 - Files Summary

| Action | File |
|--------|------|
| Create | `src/lib/schemas/video-effects.ts` |
| Create | `src/lib/server/video-processor.ts` |
| Create | `src/lib/server/job-manager.ts` |
| Create | `src/routes/api/video/upload/+server.ts` |
| Create | `src/routes/api/video/process/+server.ts` |
| Create | `src/routes/api/video/status/[jobId]/+server.ts` |
| Create | `src/routes/api/video/download/[jobId]/+server.ts` |
| Create | `src/routes/video/+page.svelte` |
| Create | `src/lib/components/video/VideoUpload.svelte` |
| Create | `src/lib/components/video/EffectsConfigurator.svelte` |
| Create | `src/lib/components/video/ProcessingStatus.svelte` |
| Create | `src/lib/assets/overlays/scanlines.png` |
| Create | `src/lib/assets/overlays/scp-watermark.png` |
| Modify | `Dockerfile` |
| Modify | `package.json` |
| Modify | `src/routes/+page.svelte` |

---

## Implementation Order

### Phase 1: DAT Types & Parser (Foundation)
1. Create `src/lib/dat/types.ts` - Zod schemas for .dat format
2. Create `src/lib/dat/parser.ts` - Parse .dat JSON into internal types
3. Create `src/lib/dat/serializer.ts` - Convert documents back to .dat format

### Phase 2: DAT UI Integration
4. Create `src/lib/components/ui/DatImport.svelte` - File upload component
5. Create `src/lib/components/preview/DatPreview.svelte` - Render .dat documents
6. Create `src/routes/templates/+page.svelte` - Template reference page
7. Modify `src/lib/components/ui/ExportOptions.svelte` - Add .dat export option
8. Modify `src/routes/editor/[type]/+page.svelte` - Wire .dat export
9. Modify `src/routes/+page.svelte` - Add import button + templates link

### Phase 3: Video Infrastructure
10. Add `fluent-ffmpeg` + types to `package.json`
11. Modify `Dockerfile` to install FFmpeg
12. Create `src/lib/schemas/video-effects.ts`
13. Create `src/lib/server/job-manager.ts`
14. Create `src/lib/server/video-processor.ts`

### Phase 4: Video API Routes
15. Create upload endpoint
16. Create process endpoint
17. Create status endpoint
18. Create download endpoint

### Phase 5: Video UI
19. Create `VideoUpload.svelte`
20. Create `EffectsConfigurator.svelte`
21. Create `ProcessingStatus.svelte`
22. Create `src/routes/video/+page.svelte` - Main video processor page
23. Modify `src/routes/+page.svelte` - Add video processor link
24. Create overlay assets (scanlines.png, scp-watermark.png)

---

## Verification

### DAT Feature Testing
- Import each `.dat` file from `Documentation/` and verify it parses without errors
- Verify the preview renders all element types (headers, images, signatures, checkboxes)
- Export a document to `.dat` format, re-import it, and confirm round-trip fidelity
- Test with the Gmod addon if possible (load exported .dat in-game)

### Video Feature Testing
- Upload a sample .mp4 clip via the UI
- Enable all effects and process
- Verify output video contains: scanlines, timestamp, facility ID, vignette, color grading, noise, REC indicator
- Test with various input formats (mp4, webm, mov)
- Test error handling: oversized files, invalid formats, processing failures
- Verify temp file cleanup after download
- Test in Docker container to confirm FFmpeg availability
