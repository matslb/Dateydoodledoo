# DateyDoodleDoo

A cross-platform desktop application for organizing film scan images by modifying EXIF metadata dates and automatically sorting them into year/month folders.

> **Disclaimer**: This is AI slop made in 20 minutes, please don't hate me.

## Features

- **File Selection**: Choose images via file browser or drag-and-drop
- **Date Picker**: Select full date or just month/year
- **EXIF Modification**: Updates DateTimeOriginal, DateTimeDigitized, and CreateDate fields
- **Automatic Organization**: Sorts images into `YYYY/MM` folder structure
- **Settings Persistence**: Remembers your destination folder and preferences
- **70's Inspired Design**: Minimalistic UI with earthy, retro color palette

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
npm install
```

### Development Mode

```bash
npm run electron:dev
```

This will:
1. Build the main process and preload scripts
2. Start the Vite dev server
3. Launch Electron with hot reload

### Building

```bash
npm run build
```

This will:
1. Compile TypeScript
2. Build the renderer (React app)
3. Package the application for your platform

### Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.ts     # Main entry point
│   ├── fileProcessor.ts  # EXIF modification & file operations
│   ├── settings.ts # Settings management
│   └── preload.ts  # Preload script for IPC
├── renderer/       # React UI
│   ├── App.tsx
│   ├── components/ # React components
│   └── styles/     # CSS styling
└── shared/         # Shared TypeScript types
```

## Releases

Pre-built releases are available on [GitHub Releases](https://github.com/YOUR_USERNAME/Dateydoodledoo/releases). 

### Creating a Release

To create a new release, push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The GitHub Actions workflow will automatically:
1. Build the app for macOS and Windows
2. Create a GitHub release with both installers attached

You can also trigger the workflow manually from the Actions tab in GitHub.

## Installation

After building the application locally, you'll find the installers in the `release/` directory:

### macOS

**Option 1: DMG Installer (Recommended)**
1. Open `release/DateyDoodleDoo-1.0.0-arm64.dmg`
2. Drag `DateyDoodleDoo.app` to your Applications folder
3. Open the app from Applications (you may need to right-click and select "Open" the first time due to macOS security)

**Option 2: ZIP Archive**
1. Extract `release/DateyDoodleDoo-1.0.0-arm64-mac.zip`
2. Move `DateyDoodleDoo.app` to your Applications folder
3. Open the app from Applications

**Option 3: Run Directly**
```bash
open release/mac-arm64/DateyDoodleDoo.app
```

### Windows

1. Run `release/DateyDoodleDoo Setup 1.0.0.exe`
2. Follow the installation wizard
3. Launch from the Start menu

### Linux

1. Make the AppImage executable: `chmod +x release/DateyDoodleDoo-1.0.0.AppImage`
2. Run: `./release/DateyDoodleDoo-1.0.0.AppImage`

## Usage

1. **Select Images**: Click "Open File Browser" or drag and drop image files
2. **Choose Date**: Select the date (or just month/year) for your images
3. **Configure Settings**: Click the settings button to set your destination folder
4. **Process**: Click "Go" to modify EXIF dates and organize files

## Supported Formats

The application supports all image formats that can contain EXIF metadata:
- JPEG (.jpg, .jpeg)
- TIFF (.tiff, .tif)
- HEIC/HEIF (.heic, .heif)
- PNG (limited EXIF support)

## Technical Details

- **Framework**: Electron + React + TypeScript
- **EXIF Library**: piexifjs
- **Date Handling**: date-fns
- **Settings Storage**: electron-store

## License

MIT
