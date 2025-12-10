# KYC Impaya Frontend

Frontend application for KYC (Know Your Customer) verification with document capture and verification, liveness detection, and utility bill verification. Can run as a standalone application or be embedded in an iframe.

## Version

v0 - Not released yet

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 6** - build tool and dev server
- **Reatom** - state management
- **TensorFlow.js** - face detection and liveness verification
- **styled-components** - styling
- **i18next** - internationalization
- **axios** - HTTP client

## Development Commands

```bash
# Development
npm run dev                    # Start dev server on port 3003 with HTTPS
npm run dev:localClient        # Start dev server with VITE_LOCAL_CLIENT=true

# Build & Preview
npm run build                  # TypeScript check + Vite build
npm run preview                # Preview production build

# Code Quality
npm run lint                   # Run ESLint on .ts/.tsx files
npm run ts-check               # TypeScript type checking (no emit)
npm run pr                     # Create pull request
```

## Key Features

### Camera Modes

The application supports multiple camera modes:

- **document** - Capture front of ID/passport (environment camera)
- **document-flip** - Capture back of document (environment camera)
- **liveness** - Face detection with head movement tracking (user camera)
- **utility** - Capture utility bill (environment camera)
- **selfie** - Special mode for avatar selfie capture (user camera)

### Liveness Detection

Implemented using TensorFlow.js:

- MediaPipeFaceMesh model for face landmarks detection
- WebGL backend for performance
- Head rotation tracking (yaw) - requires movement > 6 degrees
- Face position validation within oval overlay with correct size ratio
- Real-time drawing with overlay, guides, and face outline
- Position suggestions: "move closer", "move further", "turn left", "turn right"

### Browser Fingerprinting

Device information collection for fraud detection:

- User agent, platform, screen resolution
- Hardware specs (memory, CPU cores)
- Browser capabilities (storage, cookies, IndexedDB)
- Touch support detection
- SHA-256 hash generation for unique device identification

## Architecture

### State Management (Reatom)

The application uses **@reatom/framework** with a context-based approach:

- `ctx = createCtx()` is created in main.tsx
- All state is managed through atoms and actions
- React integration via hooks: `useAtom()`, `useAction()`

**Key Models (src/models/):**

- **Session.ts** - `sessionIDAtom` tracks current session ID
- **Camera.ts** - Camera stream, video element, facing mode, and camera mode state
- **FaceMesh.ts** - TensorFlow.js face detection, liveness detection, face mesh drawing
- **DocumentClassifier.ts** - MobileNet-based document classification with stability tracking

### Session & Verification Flow

**SessionContext.tsx** manages the verification workflow:

1. Session creation: `createSession(token)`
2. Required steps: Server defines steps like `['document-check', 'liveness', 'utility-check']`
3. Current step tracking: `currentStep` determines which camera mode to use
4. Verification methods:
    - `verifyDocument(image, flip)` - sends document photo
    - `verifyLiveness(photos)` - sends multiple selfies for liveness check
    - `verifyUtilityBill(image)` - sends utility bill photo
5. Embedded mode: Detects iframe embedding, communicates with parent via postMessage

### API Service

All API calls go through `apiService` (src/services/api.ts):

- Session management (create, check, delete)
- Document verification with flip support
- Liveness verification with multiple images
- Utility bill verification and confirmation
- Client payload modification
- Translation fetching

### Path Aliases

```typescript
'@ui' → 'src/components/ui'
'@contexts' → 'src/contexts'
```

Configured in vite.config.ts, automatic resolution via `vite-tsconfig-paths`.

### Routing & Page Flow

State-based routing in App.tsx:

1. **BeginPage** (`/`) - Initial screen, terms acceptance, session initialization
2. **CameraPage** (`/camera`) - Main capture interface, switches between document/liveness/utility
3. **ResultPage** (`/result`) - Verification results
4. **SelfieComponent** (`/selfie/:sessionId`) - Standalone selfie capture mode

## Component Structure

### UI Components (src/components/ui/)

Reusable styled-components:

- **Theme**: GlobalTheme, ThemeLight, ThemeDark
- **Layout**: Box, VBox, HBox, Page, Panel
- **Form**: Input, Checkbox, Select, Button
- **Feedback**: Dialog, Informer, Spinner, ProgressBar

### Feature Components (src/components/)

- **DocumentFrame** - Document capture with flip support
- **FaceMeshCanvas** - Liveness check with real-time face tracking
- **Selfie** - Standalone selfie capture for avatar
- **UtilityBill** - Utility bill capture and verification
- **Video** - Video stream display component

## Utilities

### tensorflowBackend.ts

Common TensorFlow.js backend configuration:

- `ensureBackend()` - Configures WebGL backend for optimal performance
- Handles backend registration, cleanup, and initialization

### canvasHelpers.ts

Canvas manipulation utilities:

- `calculateImgResize()` - Calculates crop/resize parameters for fitting video into canvas
- Maintains aspect ratio, centers image
- Handles both horizontal and vertical crops

## Important Notes

- **HTTPS required**: Dev server uses `@vitejs/plugin-basic-ssl` for camera access
- **SSL certificates**: `/Users/sorokin/.ssl_certs`
- **Port**: 3003 (hardcoded in vite.config.ts)
- **Husky**: Git hooks managed via `.husky/install.mjs`
- **ESLint**: No console.log allowed (use console.warn/error/info), no alerts or debuggers
- **TypeScript**: Strict project references setup

## Internationalization

- i18next with translation files in src/utils/en.json (base)
- API-fetched translations via `apiService.getTranslation()`
- `REQ_CHANGE_LANGUAGE` signal for language switching
- Trans component for complex translations with embedded links

## Error Handling

- **ErrorBoundary** component wraps entire app
- Camera errors handled with user-friendly messages in `streamErrorAtom`
- API errors returned in consistent format: `{ code, message, details? }`
- Session validation on init with fallback UI for invalid/expired sessions

## Key Files

- **src/App.tsx** - Main app component with routing logic
- **src/models/Camera.ts** - Camera state and stream management
- **src/models/FaceMesh.ts** - Face detection and liveness algorithms
- **src/utils/tensorflowBackend.ts** - Shared TensorFlow.js backend configuration
- **src/utils/canvasHelpers.ts** - Canvas utilities (crop/resize video frames)
- **src/components/DocumentFrame/index.tsx** - Manual document capture with visual frame overlay
- **src/contexts/SessionContext.tsx** - Session and API integration
- **src/services/api.ts** - All backend communication
- **vite.config.ts** - Build configuration with path aliases

## License

Private
