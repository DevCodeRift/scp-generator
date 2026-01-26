# SCP Document Generator

A web-based document formatting tool for creating authentic-looking SCP Foundation documents. Generate research reports, letters, interview logs, and standard SCP entries with a terminal/CRT aesthetic.

## Features

- **4 Document Types**: SCP Entries, Research Reports, Letters/Memos, Interview Logs
- **7 Faction Themes**: SCP Foundation, Chaos Insurgency, GOC, Serpent's Hand, MC&D, Church of the Broken God, Dr. Wondertainment
- **CRT/Terminal Aesthetic**: Scanlines, phosphor glow, and vignette effects
- **Live Preview**: Side-by-side editing with real-time document preview
- **PDF Export**: Export documents as PDF files
- **Auto-save**: Documents are automatically saved to localStorage

## Tech Stack

- **Framework**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Validation**: Zod schemas
- **Export**: html2pdf.js (client-side PDF generation)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Coolify

### Option 1: Docker (Recommended)

1. Create a new service in Coolify
2. Select "Docker" as the build pack
3. Point to this repository
4. Set environment variables:
   - `ORIGIN`: Your domain (e.g., `https://scp.yourdomain.com`)

The included `Dockerfile` will handle the build process.

### Option 2: Nixpacks

Coolify can also auto-detect SvelteKit projects using Nixpacks. Just:

1. Create a new service
2. Point to the repository
3. Set the `ORIGIN` environment variable

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `0.0.0.0` |
| `ORIGIN` | Your domain URL | Required for production |

## Project Structure

```
src/
├── lib/
│   ├── assets/logos/     # SVG faction logos
│   ├── components/
│   │   ├── editor/       # Form components for each document type
│   │   ├── preview/      # Document preview components
│   │   └── ui/           # Reusable UI components
│   ├── schemas/          # Zod validation schemas
│   ├── stores/           # Svelte stores (document, faction)
│   └── themes/           # Faction theme configurations
├── routes/
│   ├── editor/[type]/    # Document editor pages
│   └── +page.svelte      # Landing page
└── app.css               # Global styles + CRT effects
```

## Supported Factions

| Faction | Theme Colors | Aesthetic |
|---------|-------------|-----------|
| SCP Foundation | Black/White, Red accent | Clinical, authoritative |
| Chaos Insurgency | Red/Black | Military, aggressive |
| Global Occult Coalition | White/Gold | Military-bureaucratic |
| Serpent's Hand | Black/White, Green | Mystical, humanistic |
| Marshall, Carter & Dark | Gold/Deep Red | Luxury, high-society |
| Church of the Broken God | Bronze/Mechanical | Industrial, religious |
| Dr. Wondertainment | Purple/Yellow | Whimsical, playful |

## License

This project is for creative/entertainment purposes. SCP Foundation content is licensed under CC BY-SA 3.0.

## Credits

- SCP Foundation and related content created by the SCP Wiki community
- Faction logos created for this project (CC BY-SA 3.0)
