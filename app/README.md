# FaceScanner - LiDAR Face Capture App

A hackathon demo app for capturing 3D face scans using iPhone's rear camera and LiDAR sensor with Vision framework face detection.

## Architecture Overview

The app uses a **4-step workflow** with continuous LiDAR scanning:

### Flow Diagram
```
ViewController (Landing)
    ↓
CaptureViewController (Capture 3 photos + LiDAR scan)
    ↓
ReviewViewController (Preview all data)
    ↓
ServerInputViewController (Configure & Upload)
```

## View Controllers

### 1. **ViewController.swift**
- **Purpose**: Landing screen and app entry point
- **Function**: Displays app title and immediately launches capture flow

### 2. **CaptureViewController.swift** ⭐ Main Capture Screen
- **Purpose**: Capture 3 RGB photos and continuous LiDAR depth scan
- **Features**:
  - **Rear camera** with ARWorldTracking
  - **Face detection** using Vision framework (green bounding box overlay)
  - **Three photo capture**: Must capture 3 separate photos
  - **Continuous LiDAR scanning**:
    - Tap 📡 to start scanning
    - Move around face slowly for 5-10 seconds
    - Tap ⏹ to stop when complete
    - Accumulates depth frames continuously during scan
  - **Rotated preview boxes** (90° clockwise for landscape viewing)
  - **Live progress tracking** showing frame count and scan percentage
  - **Sequential workflow**: Photos first, then LiDAR scan

### 3. **ReviewViewController.swift**
- **Purpose**: Preview all captured data before uploading
- **Features**:
  - Photo gallery with thumbnail navigation
  - Tap thumbnails to view each photo full-size
  - LiDAR statistics (frame count, total data size)
  - Options to retake or continue

### 4. **ServerInputViewController.swift**
- **Purpose**: Configure server and upload all data
- **Features**:
  - Input fields for server IP and port
  - Saves configuration to UserDefaults
  - **Uploads**:
    - 3 photos (image1.jpg, image2.jpg, image3.jpg)
    - Combined LiDAR scan (depth_scan.bin with all frames)
    - Metadata (timestamp, device info, frame counts)
  - Progress bar with detailed status
  - Returns to capture screen after success

## Key Features

### 🎯 Face Detection
- **Vision Framework** integration for rear camera face detection
- Green bounding box overlay when face detected
- Warning if capturing without detected face
- Real-time face tracking

### 📷 Three Photo Capture
- Must capture exactly 3 photos
- Preview boxes show numbers 1, 2, 3 until captured
- Photo previews rotated 90° clockwise
- LiDAR button disabled until 3 photos captured

### 📡 Continuous LiDAR Scanning
- **Start/Stop control**: Tap to begin, tap again to finish
- **Accumulates depth frames** during entire scan period
- Recommended 5-10 seconds of scanning
- Real-time progress: "Scanning... 47% (235 frames)"
- Depth preview updates every 10 frames
- Button changes to red ⏹ during scan

### 🔄 Rotated Preview Boxes
- Both photo and LiDAR previews rotated 90° clockwise
- Better viewing angle for demo purposes
- Maintains aspect ratio

## Captured Data

The app captures and uploads:

1. **3 RGB Images** (JPEG, 0.8 compression quality)
   - Uploaded as: image1, image2, image3
2. **Continuous LiDAR Scan** (multiple depth frames)
   - All frames combined into single binary file
   - Uploaded as: depth_scan.bin
3. **Metadata** (JSON)
   - timestamp
   - device model
   - iOS version
   - photo_count (always 3)
   - depth_frame_count (number of LiDAR frames)
   - total_depth_bytes

## Device Requirements

- **iPhone 12 Pro or later** (requires LiDAR sensor)
- iOS 14.0+
- ARKit support
- Rear camera access

## Server Endpoint Format

Expected format: `http://[IP_ADDRESS]:[PORT]/upload`

Example: `http://192.168.1.100:5000/upload`

### Upload Request Format

```
POST /upload
Content-Type: multipart/form-data

Parts:
- image1: face1.jpg (image/jpeg)
- image2: face2.jpg (image/jpeg)
- image3: face3.jpg (image/jpeg)
- depth_scan: depth_scan.bin (application/octet-stream) [all frames combined]
- metadata: {...} (application/json)
```

### Metadata Schema

```json
{
  "timestamp": "2025-01-15T10:30:45Z",
  "device": "iPhone 13 Pro",
  "ios_version": "15.0",
  "photo_count": 3,
  "depth_frame_count": 287,
  "total_depth_bytes": 14567890
}
```

## Usage Instructions

### Capture Workflow

1. **Launch App** - Opens to capture screen with rear camera
2. **Detect Face** - Point camera at face, green box appears when detected
3. **Capture Photo 1** - Tap green 📷 button
4. **Capture Photo 2** - Tap 📷 again (different angle recommended)
5. **Capture Photo 3** - Tap 📷 third time
6. **Start LiDAR Scan** - Tap blue 📡 button (now enabled)
7. **Move Around Face** - Slowly move device around face for 5-10 seconds
8. **Stop Scan** - Tap red ⏹ button when complete
9. **Review** - Tap "Review →" to preview all captures
10. **Browse Photos** - Tap thumbnails to view each photo
11. **Configure Server** - Enter IP address and port
12. **Upload** - Tap "Upload 🚀" to send all data
13. **Repeat** - App returns to capture screen for next patient

### Best Practices for LiDAR Scanning

- **Distance**: Keep 0.5-1m from face
- **Movement**: Slow, steady arc around face
- **Coverage**: Capture front, both sides, top angles
- **Duration**: 5-10 seconds recommended
- **Lighting**: Good lighting improves photo quality
- **Stability**: Smooth movements, avoid shaking

## File Structure

```
FaceScanner/
├── AppDelegate.swift                 # App lifecycle
├── SceneDelegate.swift                # Scene lifecycle
├── ViewController.swift               # Landing screen
├── CaptureViewController.swift       # Step 1: Capture (photos + LiDAR)
├── ReviewViewController.swift        # Step 2: Review
├── ServerInputViewController.swift   # Step 3: Upload
├── Info.plist                        # Permissions & config
├── Assets.xcassets/                  # App assets
└── README.md                         # This file
```

## Troubleshooting

### Face Detection Issues

**"No face detected" warning**
- Ensure face is visible and well-lit
- Try different angle or distance
- Can still capture without detection (warning only)

**Green box not appearing**
- Check camera permissions
- Restart app
- Verify Vision framework working

### LiDAR Issues

**"LiDAR not available"**
- Device must be iPhone 12 Pro or later
- Check ARWorldTrackingConfiguration.supportsFrameSemantics(.sceneDepth)

**Low frame count**
- Scan for longer duration (10+ seconds)
- Ensure LiDAR not obstructed
- Check device temperature (throttling)

**"AR World Tracking not supported"**
- Device lacks ARKit support
- Must use physical device, not simulator

### Camera & Permissions

**Camera permission denied**
- Settings → FaceScanner → Camera → Enable
- NSCameraUsageDescription in Info.plist

**Black screen**
- Check camera hardware
- Close other camera apps
- Restart device

### Upload Issues

**Upload fails**
- Verify server is running and accessible
- Check IP address and port
- Ensure network connectivity (same WiFi recommended)
- Server must accept multipart/form-data POST
- Check server timeout (large LiDAR scans)

**Timeout errors**
- Request timeout set to 120 seconds
- Reduce scan duration for smaller uploads
- Check network speed

## Demo Tips

1. **Lighting**: Good overhead and front lighting
2. **Scanning pattern**: Front → Left → Right → Top arc
3. **Photo variety**: Front, 45° left, 45° right angles
4. **Network**: Use same WiFi for device and server
5. **Server config**: App remembers last IP/port
6. **Quick retakes**: Easy to go back and recapture
7. **Preview verification**: Always review before upload

## Technical Details

### Face Detection
- **Framework**: Apple Vision (VNDetectFaceRectanglesRequest)
- **Orientation**: .right (rear camera landscape)
- **Real-time**: Processed every AR frame
- **Overlay**: CALayer-based bounding box

### LiDAR Scanning
- **Type**: ARWorldTrackingConfiguration with .sceneDepth
- **Frequency**: ~60 fps (depending on device)
- **Accumulation**: All frames stored in memory
- **Format**: CVPixelBuffer → Data
- **Typical scan**: 5-10 seconds = 300-600 frames

### Data Size Estimates
- **Each photo**: ~200-500 KB (JPEG 0.8 quality)
- **Each depth frame**: ~50-100 KB (device dependent)
- **10 second scan**: ~300 frames × 75 KB = ~22 MB
- **Total upload**: 3 photos (~1.5 MB) + scan (~22 MB) = ~23.5 MB

## Server Implementation Notes

When building your server to receive this data:

1. **Parse multipart/form-data** with boundary
2. **Expect 3 image files** (image1, image2, image3)
3. **Receive depth_scan.bin** as binary blob
4. **Parse metadata** for frame count and dimensions
5. **Reconstruct depth frames** by splitting binary data
6. **Use frame count** to determine individual frame sizes

## Next Steps for Production

- Add face quality scoring before capture
- Implement local storage/backup
- Add HTTPS for secure uploads
- Compress depth data before upload
- Support offline mode with queue
- Add user authentication
- Implement automatic face centering
- Add haptic feedback for optimal distance
- Create 3D preview from depth scan
- Support batch processing multiple patients
- Add cloud sync

## Known Limitations

- Requires iPhone 12 Pro or later (LiDAR)
- Memory intensive for very long scans (>30 seconds)
- Large uploads may timeout on slow networks
- Face detection less accurate in low light
- Preview boxes may appear small on some devices
