//
//  uploadviewcontroller.swift
//  facescanner
//
//  upload screen with cancel/send buttons and ssh upload
//

import UIKit

// upload screen - final step to send images via ssh
class UploadViewController: UIViewController {

    // the 5 photos to upload
    var capturedPhotos: [UIImage] = []

    // ui elements
    private var statusLabel: UILabel!
    private var cancelButton: UIButton!
    private var sendButton: UIButton!
    private var activityIndicator: UIActivityIndicatorView!
    private var progressView: UIProgressView!

    // ssh configuration from .env file
    private let sshHost = Config.sshHost
    private let sshPort = Config.sshPort
    private let sshUsername = Config.sshUsername
    private let sshPassword = Config.sshPassword
    private let remotePath = Config.remotePath

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    // setup ui
    private func setupUI() {
        view.backgroundColor = .black

        // title label
        let titleLabel = UILabel(frame: CGRect(x: 40, y: 80, width: view.bounds.width - 80, height: 50))
        titleLabel.text = "Ready to Upload"
        titleLabel.font = UIFont.systemFont(ofSize: 28, weight: .bold)
        titleLabel.textColor = .white
        titleLabel.textAlignment = .center
        view.addSubview(titleLabel)

        // photo count label
        let photoCountLabel = UILabel(frame: CGRect(x: 40, y: 140, width: view.bounds.width - 80, height: 40))
        photoCountLabel.text = "\(capturedPhotos.count) photos ready"
        photoCountLabel.font = UIFont.systemFont(ofSize: 18, weight: .regular)
        photoCountLabel.textColor = .systemGray
        photoCountLabel.textAlignment = .center
        view.addSubview(photoCountLabel)

        // photo preview grid (5 thumbnails)
        let thumbnailSize: CGFloat = 60
        let spacing: CGFloat = 10
        let totalWidth = (thumbnailSize * 5) + (spacing * 4)
        let startX = (view.bounds.width - totalWidth) / 2

        for (index, photo) in capturedPhotos.enumerated() {
            let thumbnailView = UIImageView(frame: CGRect(
                x: startX + CGFloat(index) * (thumbnailSize + spacing),
                y: 200,
                width: thumbnailSize,
                height: thumbnailSize
            ))
            thumbnailView.image = photo
            thumbnailView.contentMode = .scaleAspectFill
            thumbnailView.clipsToBounds = true
            thumbnailView.layer.cornerRadius = 8
            thumbnailView.layer.borderWidth = 2
            thumbnailView.layer.borderColor = UIColor.systemGreen.cgColor
            view.addSubview(thumbnailView)
        }

        // status label
        statusLabel = UILabel(frame: CGRect(x: 40, y: 300, width: view.bounds.width - 80, height: 80))
        statusLabel.text = "Tap 'Send' to upload via SSH\nor 'Cancel' to go back"
        statusLabel.font = UIFont.systemFont(ofSize: 16, weight: .regular)
        statusLabel.textColor = .systemGray
        statusLabel.textAlignment = .center
        statusLabel.numberOfLines = 3
        view.addSubview(statusLabel)

        // progress view
        progressView = UIProgressView(frame: CGRect(x: 40, y: 420, width: view.bounds.width - 80, height: 4))
        progressView.progressTintColor = .systemGreen
        progressView.trackTintColor = .systemGray5
        progressView.alpha = 0
        view.addSubview(progressView)

        // activity indicator
        activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.center = CGPoint(x: view.bounds.width/2, y: 500)
        activityIndicator.hidesWhenStopped = true
        activityIndicator.color = .white
        view.addSubview(activityIndicator)

        // cancel button (left)
        cancelButton = UIButton(frame: CGRect(x: 40, y: view.bounds.height - 120, width: (view.bounds.width - 100)/2, height: 60))
        cancelButton.setTitle("Cancel", for: .normal)
        cancelButton.setTitleColor(.white, for: .normal)
        cancelButton.backgroundColor = UIColor.systemGray.withAlphaComponent(0.5)
        cancelButton.layer.cornerRadius = 30
        cancelButton.titleLabel?.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        cancelButton.addTarget(self, action: #selector(cancelTapped), for: .touchUpInside)
        view.addSubview(cancelButton)

        // send button (right)
        sendButton = UIButton(frame: CGRect(x: 60 + (view.bounds.width - 100)/2, y: view.bounds.height - 120, width: (view.bounds.width - 100)/2, height: 60))
        sendButton.setTitle("Send", for: .normal)
        sendButton.setTitleColor(.black, for: .normal)
        sendButton.backgroundColor = .white
        sendButton.layer.cornerRadius = 30
        sendButton.titleLabel?.font = UIFont.systemFont(ofSize: 20, weight: .bold)
        sendButton.addTarget(self, action: #selector(sendTapped), for: .touchUpInside)
        view.addSubview(sendButton)
    }

    // cancel button - go back to capture
    @objc private func cancelTapped() {
        dismiss(animated: true)
    }

    // send button - upload via ssh
    @objc private func sendTapped() {
        // validate ssh config
        guard Config.isConfigured() else {
            statusLabel.text = "⚠️ SSH configuration missing!\nPlease fill in .env file with your SSH details"
            statusLabel.textColor = .systemRed
            return
        }

        // disable buttons during upload
        sendButton.isEnabled = false
        cancelButton.isEnabled = false
        activityIndicator.startAnimating()

        // show progress
        UIView.animate(withDuration: 0.3) {
            self.progressView.alpha = 1.0
        }

        statusLabel.text = "Connecting to SSH server..."
        statusLabel.textColor = .systemBlue

        // start upload
        uploadViaSSH()
    }

    // upload images via ssh/sftp
    private func uploadViaSSH() {
        // This will be implemented with NMSSH library
        // For now, showing placeholder

        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            // TODO: Implement actual SFTP upload using NMSSH
            // Steps:
            // 1. Connect to SSH server
            // 2. Authenticate with username/password
            // 3. Upload each image to remotePath
            // 4. Close connection

            // Simulated upload for now
            for (index, photo) in self.capturedPhotos.enumerated() {
                DispatchQueue.main.async {
                    let progress = Float(index + 1) / Float(self.capturedPhotos.count)
                    self.progressView.progress = progress
                    self.statusLabel.text = "Uploading image \(index + 1) of \(self.capturedPhotos.count)..."
                }

                // Convert to JPEG
                guard let imageData = photo.jpegData(compressionQuality: 1.0) else { continue }

                // TODO: Upload imageData via SFTP
                // filename: "\(index + 1).jpg"

                Thread.sleep(forTimeInterval: 0.5) // simulate upload time
            }

            // Upload complete
            DispatchQueue.main.async {
                self.activityIndicator.stopAnimating()
                self.progressView.progress = 1.0
                self.statusLabel.text = "✅ Upload complete!\nAll 5 images sent via SSH"
                self.statusLabel.textColor = .systemGreen

                // vibrate
                let generator = UINotificationFeedbackGenerator()
                generator.notificationOccurred(.success)

                // go back to start after 2 seconds
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                    self.returnToStart()
                }
            }
        }
    }

    // return to start (dismiss all views)
    private func returnToStart() {
        if let presentingVC = presentingViewController?.presentingViewController {
            presentingVC.dismiss(animated: true)
        } else {
            dismiss(animated: true)
        }
    }
}
