---
name: xcode-integration
description: >
  Build, test, debug, and deploy iOS/macOS apps using Xcode command-line tools and XcodeBuildMCP.
  Use when building iOS apps, running simulators, debugging Swift code, deploying to devices,
  or creating new Xcode projects. Enables autonomous iOS development with visual verification.
---

# Xcode Integration — iOS/macOS Development

Build iOS and macOS applications autonomously using Xcode 26.3+ command-line tools, XcodeBuildMCP (59 tools), and Apple's native Xcode MCP (20 tools).

## When to Use This Skill

- User mentions iOS, iPhone, iPad, macOS, or SwiftUI development
- User wants to build/test an existing Xcode project
- User requests a new iOS/macOS app
- User needs to debug Swift code or run simulators
- User wants to deploy apps to physical devices
- User mentions App Store, TestFlight, or Xcode

## Prerequisites Check

Before using Xcode tools, verify:

```bash
# Check Xcode is installed
xcodebuild -version

# Check XcodeBuildMCP is installed (if using MCP features)
npx xcodebuildmcp@latest --version
```

**If XcodeBuildMCP is not installed:**
```bash
# Install XcodeBuildMCP
npx xcodebuildmcp@latest init

# Add to Claude Code MCP config
claude mcp add --transport stdio XcodeBuildMCP -- npx -y xcodebuildmcp@latest
```

## Core Capabilities

### 1. Build iOS/macOS Apps

```bash
# Build for simulator
xcodebuild -project MyApp.xcodeproj -scheme MyApp -destination 'platform=iOS Simulator,name=iPhone 16' build

# Build for device
xcodebuild -project MyApp.xcodeproj -scheme MyApp -destination 'generic/platform=iOS' build

# Clean build folder
xcodebuild clean -project MyApp.xcodeproj -scheme MyApp
```

### 2. Run in Simulator

```bash
# List available simulators
xcrun simctl list devices available

# Boot a simulator
xcrun simctl boot "iPhone 16"

# Install app on booted simulator
xcrun simctl install booted MyApp.app

# Launch app
xcrun simctl launch booted com.company.MyApp

# Shutdown simulator
xcrun simctl shutdown "iPhone 16"
```

### 3. Visual Verification (Screenshot Capture)

**This is the killer feature** - capture screenshots to verify UI without manual inspection.

```bash
# Take screenshot of booted simulator
xcrun simctl io booted screenshot screenshot.png

# Record video
xcrun simctl io booted recordVideo video.mp4

# Stop recording (Ctrl+C after a few seconds)
```

**Workflow:**
1. Build and run app in simulator
2. Capture screenshot
3. Read the screenshot file (you can analyze images!)
4. Identify layout issues, color problems, alignment errors
5. Fix code and iterate

### 4. Run Tests

```bash
# Run all tests
xcodebuild test -project MyApp.xcodeproj -scheme MyApp -destination 'platform=iOS Simulator,name=iPhone 16'

# Run specific test
xcodebuild test -project MyApp.xcodeproj -scheme MyApp -only-testing:MyAppTests/MyTestClass/testExample
```

### 5. Debug with LLDB

```bash
# Attach to running app
lldb -n MyApp

# Set breakpoint
(lldb) breakpoint set --name viewDidLoad

# Continue execution
(lldb) continue

# Print variable
(lldb) po myVariable

# Backtrace
(lldb) bt
```

### 6. Create New Xcode Project

```bash
# Using XcodeBuildMCP (requires installation)
# Creates SwiftUI iOS app template

# Or manually via Xcode command line
mkdir MyNewApp && cd MyNewApp
# Then scaffold with Swift Package Manager
swift package init --type executable
```

### 7. Deploy to Physical Device

```bash
# List connected devices
xcrun xctrace list devices

# Build for device
xcodebuild -project MyApp.xcodeproj -scheme MyApp -destination 'platform=iOS,name=Tina's iPhone' build

# Install on device (requires XcodeBuildMCP or manual Xcode)
# Via Xcode: Product > Run (Cmd+R) with device selected
```

## Autonomous iOS Development Workflow

When user requests a new iOS app:

### Phase 1: Planning
1. Clarify app requirements (features, UI, data model)
2. Choose architecture (SwiftUI vs UIKit, data persistence)
3. Outline file structure

### Phase 2: Scaffolding
1. Create Xcode project directory structure
2. Set up `.xcodeproj` or use Swift Package Manager
3. Create initial SwiftUI views or UIKit view controllers

### Phase 3: Implementation
1. Write Swift code (models, views, view models)
2. Implement data persistence (UserDefaults, Core Data, SwiftData)
3. Add any API integrations

### Phase 4: Build & Test
1. Build for simulator: `xcodebuild build ...`
2. Run in simulator: `xcrun simctl launch ...`
3. **Capture screenshot**: `xcrun simctl io booted screenshot screenshot.png`
4. **Analyze screenshot** - verify UI looks correct
5. Fix any visual bugs discovered

### Phase 5: Testing
1. Write XCTest unit tests
2. Run tests: `xcodebuild test ...`
3. Verify all pass

### Phase 6: Deployment
1. Build for device
2. Deploy to physical device for user testing
3. Or archive for TestFlight/App Store

## Common Commands Reference

| Task | Command |
|------|---------|
| Build for simulator | `xcodebuild -project X.xcodeproj -scheme X -destination 'platform=iOS Simulator,name=iPhone 16' build` |
| Run tests | `xcodebuild test -project X.xcodeproj -scheme X -destination 'platform=iOS Simulator,name=iPhone 16'` |
| List simulators | `xcrun simctl list devices available` |
| Boot simulator | `xcrun simctl boot "iPhone 16"` |
| Screenshot | `xcrun simctl io booted screenshot shot.png` |
| Install app | `xcrun simctl install booted X.app` |
| Launch app | `xcrun simctl launch booted com.bundle.id` |
| Clean build | `xcodebuild clean -project X.xcodeproj -scheme X` |

## XcodeBuildMCP Tools (59 Total)

If XcodeBuildMCP is installed, you have access to 59 specialized tools via MCP.

**Categories:**
- **Build & Test**: `simulator/build`, `simulator/test`, `device/build`
- **Simulators**: `simulator/boot`, `simulator/screenshot`, `simulator/video`
- **Debugging**: `debugging/attach`, `debugging/breakpoint`, `debugging/evaluate`
- **UI Automation**: `ui-automation/tap`, `ui-automation/swipe`, `ui-automation/type`
- **Project**: `project/create`, `project/analyze`, `project/info`

Full list: https://www.xcodebuildmcp.com/tools

## Error Handling

### "xcode-select: error: tool requires Xcode"
```bash
# Point xcode-select to Xcode.app
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### "Unable to boot device in current state: Booted"
```bash
# Simulator already running, use it or shutdown first
xcrun simctl shutdown "iPhone 16"
```

### Build failed with signing errors
```bash
# For simulator builds, signing shouldn't be required
# Add CODE_SIGN_IDENTITY="" to xcodebuild command
xcodebuild -project X.xcodeproj -scheme X CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
```

### App crashes on launch
```bash
# Check simulator logs
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "MyApp"'
```

## Integration with AntiGravity Workflow

### Your Education Apps
If you have iOS versions of:
- LittleTigerFlashcards (Port 4610 for web)
- TinyTigressFlashcards (Port 4615 for web)
- QME_Exam (Port 4620 for web)

You can now build/test/deploy their iOS counterparts autonomously.

### CI/CD Integration
Create scripts in your project's `scripts/` directory:
- `build-ios.sh` - Build for simulator
- `test-ios.sh` - Run all tests
- `deploy-testflight.sh` - Archive and upload to TestFlight

## Resources

- **Xcode Command Line Tools**: Pre-installed with Xcode
- **XcodeBuildMCP**: https://www.xcodebuildmcp.com/
- **Apple Xcode MCP**: Built into Xcode 26.3+
- **Claude Code iOS Guide**: https://github.com/keskinonur/claude-code-ios-dev-guide
- **xcodebuild man page**: `man xcodebuild`
- **simctl man page**: `man simctl`

## Quick Start Checklist

- [ ] Verify Xcode installed: `xcodebuild -version`
- [ ] Install XcodeBuildMCP: `npx xcodebuildmcp@latest init`
- [ ] Add to Claude Code MCP: `claude mcp add ...`
- [ ] Restart Claude Code to load new tools
- [ ] Test with: `xcrun simctl list devices`
- [ ] Ready to build iOS apps autonomously!
