# FaceScanner Setup Guide

## Overview

This app captures 5 RGB photos of faces and uploads them to your server via SSH/SFTP.

**Flow:** Landing Page → Capture 5 Photos (with flash option) → Upload/Cancel

---

## Step 1: Configure SSH Credentials

1. Open the `.env` file in the project root
2. Fill in your server details:

```bash
# SSH/SFTP Configuration
SSH_HOST=YOUR_SERVER_IP        # e.g., 45.123.45.67
SSH_PORT=22                    # default SSH port
SSH_USERNAME=YOUR_USERNAME     # e.g., facescanner
SSH_PASSWORD=YOUR_PASSWORD     # your SSH password
REMOTE_PATH=/path/to/uploads/  # e.g., /home/facescanner/uploads/
```

3. Save the file
4. **IMPORTANT:** The `.env` file is in `.gitignore` and will NOT be pushed to GitHub

---

## Step 2: Add .env to Xcode

The `.env` file needs to be added to your Xcode project so it's included in the app bundle:

1. Open `FaceScanner.xcodeproj` in Xcode
2. Right-click on the `FaceScanner` folder in the Project Navigator
3. Select **"Add Files to FaceScanner..."**
4. Navigate to and select the `.env` file
5. **IMPORTANT:** Make sure "Copy items if needed" is UNCHECKED
6. Click **Add**
7. Select the `.env` file in Xcode
8. In the File Inspector (right panel), ensure it's added to the **FaceScanner** target

---

## Step 3: Add NMSSH Library (SSH/SFTP Support)

### Option A: Swift Package Manager (Recommended)

1. Open `FaceScanner.xcodeproj` in Xcode
2. Go to **File → Add Package Dependencies...**
3. In the search bar, paste: `https://github.com/NMSSH/NMSSH`
4. Click **Add Package**
5. Select **NMSSH** and click **Add Package** again

### Option B: CocoaPods (Alternative)

If you prefer CocoaPods:

1. Create a `Podfile` in the project root:
```ruby
platform :ios, '14.0'
use_frameworks!

target 'FaceScanner' do
  pod 'NMSSH'
end
```

2. Run in terminal:
```bash
cd /Users/munish/Desktop/FaceScanner
pod install
```

3. Open `FaceScanner.xcworkspace` (NOT .xcodeproj) from now on

---

## Step 4: Implement SFTP Upload

Once NMSSH is added, update `UploadViewController.swift`:

Add import at the top:
```swift
import NMSSH
```

Replace the `uploadViaSSH()` function with actual SFTP implementation:

```swift
private func uploadViaSSH() {
    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
        guard let self = self else { return }

        // Create SSH session
        let session = NMSSHSession(host: self.sshHost, port: self.sshPort, andUsername: self.sshUsername)

        do {
            // Connect
            try session.connect()

            // Authenticate
            try session.authenticate(byPassword: self.sshPassword)

            guard session.isConnected && session.isAuthorized else {
                DispatchQueue.main.async {
                    self.showError("Authentication failed")
                }
                return
            }

            // Start SFTP
            let sftp = NMSFTP(session: session)
            try sftp.connect()

            // Upload each image
            for (index, photo) in self.capturedPhotos.enumerated() {
                DispatchQueue.main.async {
                    let progress = Float(index + 1) / Float(self.capturedPhotos.count)
                    self.progressView.progress = progress
                    self.statusLabel.text = "Uploading image \(index + 1) of \(self.capturedPhotos.count)..."
                }

                // Convert to JPEG
                guard let imageData = photo.jpegData(compressionQuality: 1.0) else { continue }

                // Create filename
                let filename = "\(index + 1).jpg"
                let remotePath = self.remotePath.hasSuffix("/") ? self.remotePath : self.remotePath + "/"
                let remoteFilePath = remotePath + filename

                // Write to temporary file
                let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent(filename)
                try imageData.write(to: tempURL)

                // Upload via SFTP
                try sftp.writeFile(atPath: tempURL.path, toPath: remoteFilePath)

                // Clean up temp file
                try? FileManager.default.removeItem(at: tempURL)
            }

            // Close connections
            sftp.disconnect()
            session.disconnect()

            // Success!
            DispatchQueue.main.async {
                self.activityIndicator.stopAnimating()
                self.progressView.progress = 1.0
                self.statusLabel.text = "✅ Upload complete!\nAll 5 images sent via SSH"
                self.statusLabel.textColor = .systemGreen

                let generator = UINotificationFeedbackGenerator()
                generator.notificationOccurred(.success)

                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                    self.returnToStart()
                }
            }

        } catch {
            DispatchQueue.main.async {
                self.showError(error.localizedDescription)
            }
        }
    }
}

private func showError(_ message: String) {
    self.activityIndicator.stopAnimating()
    self.statusLabel.text = "❌ Upload failed:\n\(message)"
    self.statusLabel.textColor = .systemRed
    self.sendButton.isEnabled = true
    self.cancelButton.isEnabled = true
    UIView.animate(withDuration: 0.3) {
        self.progressView.alpha = 0
    }
}
```

---

## Step 5: Add aura.png to Xcode Assets

1. Open Xcode
2. Navigate to `Assets.xcassets` in the Project Navigator
3. Right-click and select **"New Image Set"**
4. Name it **"aura"**
5. Drag your `aura.png` file into the **1x**, **2x**, or **3x** slot (or all three if you have different sizes)

---

## Step 6: Server Preparation

On your AMD cloud server (240GB RAM, 5TB):

### 1. Create Upload Directory
```bash
ssh your_username@your_server_ip
mkdir -p /home/facescanner/uploads
chmod 755 /home/facescanner/uploads
```

### 2. Create Dedicated User (Recommended)
```bash
sudo adduser facescanner
sudo passwd facescanner
```

### 3. Test SSH Connection
```bash
ssh facescanner@your_server_ip
```

Enter password and verify you can connect.

---

## App Usage

1. **Launch App** - See landing page with AURA logo
2. **Tap "Get Started"** - Opens camera
3. **Take 5 Photos:**
   - Tap flash button (⚡) to enable/disable flash (turns yellow when on)
   - Tap green camera button to capture each photo
   - Follow prompts for each quadrant
4. **Tap "Review →"** - See upload screen with 5 thumbnails
5. **Tap "Send"** - Uploads via SSH to your server
6. **Tap "Cancel"** - Goes back to retake photos

---

## File Structure

```
FaceScanner/
├── .env                          # SSH credentials (NOT in git)
├── .env.example                  # Template for .env
├── .gitignore                    # Ignores .env and Xcode files
├── SETUP.md                      # This file
├── FaceScanner/
│   ├── ViewController.swift      # Landing page with AURA logo
│   ├── CaptureViewController.swift  # Camera with flash toggle
│   ├── UploadViewController.swift   # Upload screen with SSH
│   ├── Config.swift              # Reads .env file
│   └── Assets.xcassets/
│       └── aura/                 # Your logo
```

---

## Security Notes

- ✅ `.env` is in `.gitignore` - credentials won't be pushed to GitHub
- ✅ Use `.env.example` to share config template
- ⚠️ **Never commit `.env` to git!**
- 🔒 Consider using SSH keys instead of passwords for production
- 🔒 Images are uploaded with maximum quality (compressionQuality: 1.0)

---

## Troubleshooting

### "SSH configuration missing" error
- Make sure `.env` file is filled out completely
- Verify `.env` is added to Xcode project and included in target

### "NMSSH not found" error
- Re-add the package in Xcode
- Clean build folder: **Product → Clean Build Folder**
- Restart Xcode

### Upload fails
- Test SSH connection from terminal first
- Verify server IP, port, username, password
- Check remote path exists and is writable
- Ensure server SSH is running: `sudo systemctl status ssh`

### Flash not working
- Only works on physical devices (not simulator)
- Some devices may not have rear flash

---

## Next Steps

1. Fill in `.env` with your server credentials
2. Add `.env` to Xcode project
3. Add NMSSH library via Swift Package Manager
4. Implement SFTP upload code in `UploadViewController.swift`
5. Add `aura.png` to Assets
6. Build and run on your iPhone!

---

**Your server specs (240GB RAM, 5TB) can easily handle uncompressed JPEGs!** 🚀

Each photo will be ~2-5MB at quality 1.0, so 5 photos = ~10-25MB per upload.
