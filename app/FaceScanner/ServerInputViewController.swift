//
//  serverinputviewcontroller.swift
//  facescanner
//
//  lets u enter ur server ip and upload the scan data
//

import UIKit

// this is the third screen where u upload data to a server
class ServerInputViewController: UIViewController {

    // data properties

    // the 5 photos to upload
    var capturedPhotos: [UIImage] = []

    // whether this is the first time setup b4 capture
    var isInitialSetup = false

    // ui elements

    // textbox for server ip
    private var serverTextField: UITextField!

    // textbox for port number
    private var portTextField: UITextField!

    // button to upload data
    private var uploadButton: UIButton!

    // shows upload status and errors
    private var statusLabel: UILabel!

    // spinning thing while uploading
    private var activityIndicator: UIActivityIndicatorView!

    // progress bar for upload
    private var progressView: UIProgressView!

    // button to go back
    private var backButton: UIButton!

    // button to skip server setup
    private var skipButton: UIButton!

    // lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        // setup all the ui
        setupUI()
        // load previous server ip if saved
        loadSavedServerConfig()
    }

    // ui setup

    // creates all the buttons and text fields
    private func setupUI() {
        view.backgroundColor = .systemGroupedBackground

        // Title
        let titleLabel = UILabel(frame: CGRect(x: 20, y: 60, width: view.bounds.width - 40, height: 40))
        titleLabel.text = "Welcome to AURA"
        titleLabel.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        titleLabel.textAlignment = .center
        view.addSubview(titleLabel)

        // Instructions
        let instructionsLabel = UILabel(frame: CGRect(x: 40, y: 120, width: view.bounds.width - 80, height: 60))
        if isInitialSetup {
            instructionsLabel.text = "Begin by configuring your server to upload scans, or skip to capture photos first."
        }
        instructionsLabel.font = UIFont.systemFont(ofSize: 14)
        instructionsLabel.textColor = .secondaryLabel
        instructionsLabel.numberOfLines = 0
        instructionsLabel.textAlignment = .center
        view.addSubview(instructionsLabel)

        // Server IP container
        let serverContainer = UIView(frame: CGRect(x: 40, y: 200, width: view.bounds.width - 80, height: 120))
        serverContainer.backgroundColor = .white
        serverContainer.layer.cornerRadius = 12
        serverContainer.layer.shadowColor = UIColor.black.cgColor
        serverContainer.layer.shadowOpacity = 0.1
        serverContainer.layer.shadowOffset = CGSize(width: 0, height: 2)
        serverContainer.layer.shadowRadius = 8
        view.addSubview(serverContainer)

        // IP Address label
        let ipLabel = UILabel(frame: CGRect(x: 20, y: 15, width: serverContainer.bounds.width - 40, height: 20))
        ipLabel.text = "Server IP Address"
        ipLabel.font = UIFont.systemFont(ofSize: 14, weight: .semibold)
        ipLabel.textColor = .secondaryLabel
        serverContainer.addSubview(ipLabel)

        // Server IP text field
        serverTextField = UITextField(frame: CGRect(x: 20, y: 40, width: serverContainer.bounds.width - 40, height: 30))
        serverTextField.placeholder = "192.168.1.100"
        serverTextField.borderStyle = .none
        serverTextField.font = UIFont.systemFont(ofSize: 16)
        serverTextField.keyboardType = .URL
        serverTextField.autocapitalizationType = .none
        serverTextField.autocorrectionType = .no
        serverContainer.addSubview(serverTextField)

        let divider = UIView(frame: CGRect(x: 20, y: 70, width: serverContainer.bounds.width - 40, height: 1))
        divider.backgroundColor = .systemGray5
        serverContainer.addSubview(divider)

        // Port label
        let portLabel = UILabel(frame: CGRect(x: 20, y: 75, width: 100, height: 20))
        portLabel.text = "Port"
        portLabel.font = UIFont.systemFont(ofSize: 14, weight: .semibold)
        portLabel.textColor = .secondaryLabel
        serverContainer.addSubview(portLabel)

        // Port text field
        portTextField = UITextField(frame: CGRect(x: 20, y: 90, width: 100, height: 30))
        portTextField.placeholder = "5000"
        portTextField.borderStyle = .none
        portTextField.font = UIFont.systemFont(ofSize: 16)
        portTextField.keyboardType = .numberPad
        serverContainer.addSubview(portTextField)

        // Example label
        let exampleLabel = UILabel(frame: CGRect(x: 40, y: 340, width: view.bounds.width - 80, height: 40))
        exampleLabel.text = "Example: http://192.168.1.100:5000/upload"
        exampleLabel.font = UIFont.systemFont(ofSize: 12)
        exampleLabel.textColor = .tertiaryLabel
        exampleLabel.textAlignment = .center
        view.addSubview(exampleLabel)

        // Progress view
        progressView = UIProgressView(frame: CGRect(x: 40, y: 400, width: view.bounds.width - 80, height: 4))
        progressView.progressTintColor = .systemIndigo
        progressView.trackTintColor = .systemGray5
        progressView.alpha = 0
        view.addSubview(progressView)

        // Status label
        statusLabel = UILabel(frame: CGRect(x: 40, y: 420, width: view.bounds.width - 80, height: 60))
        statusLabel.numberOfLines = 0
        statusLabel.textAlignment = .center
        statusLabel.font = UIFont.systemFont(ofSize: 14)
        statusLabel.textColor = .secondaryLabel
        view.addSubview(statusLabel)

        // Activity indicator
        activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.center = CGPoint(x: view.bounds.width/2, y: 500)
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)

        // Back button (only shown if not initial setup)
        if !isInitialSetup {
            backButton = UIButton(frame: CGRect(x: 40, y: view.bounds.height - 100, width: (view.bounds.width - 100)/2, height: 50))
            backButton.setTitle("← Back", for: .normal)
            backButton.setTitleColor(.systemIndigo, for: .normal)
            backButton.backgroundColor = .systemGray6
            backButton.layer.cornerRadius = 25
            backButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
            backButton.addTarget(self, action: #selector(backTapped), for: .touchUpInside)
            view.addSubview(backButton)

            // Upload button
            uploadButton = UIButton(frame: CGRect(x: 60 + (view.bounds.width - 100)/2, y: view.bounds.height - 100, width: (view.bounds.width - 100)/2, height: 50))
            uploadButton.setTitle("Upload 🚀", for: .normal)
            uploadButton.backgroundColor = .systemGreen
            uploadButton.layer.cornerRadius = 25
            uploadButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .bold)
            uploadButton.addTarget(self, action: #selector(uploadTapped), for: .touchUpInside)
            view.addSubview(uploadButton)
        } else {
            // Skip button (left side)
            skipButton = UIButton(frame: CGRect(x: 40, y: view.bounds.height - 100, width: (view.bounds.width - 100)/2, height: 50))
            skipButton.setTitle("Skip →", for: .normal)
            skipButton.setTitleColor(.systemIndigo, for: .normal)
            skipButton.backgroundColor = .systemGray6
            skipButton.layer.cornerRadius = 25
            skipButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
            skipButton.addTarget(self, action: #selector(skipTapped), for: .touchUpInside)
            view.addSubview(skipButton)

            // Save & Continue button
            uploadButton = UIButton(frame: CGRect(x: 60 + (view.bounds.width - 100)/2, y: view.bounds.height - 100, width: (view.bounds.width - 100)/2, height: 50))
            uploadButton.setTitle("Save & Start", for: .normal)
            uploadButton.backgroundColor = .systemIndigo
            uploadButton.layer.cornerRadius = 25
            uploadButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .bold)
            uploadButton.addTarget(self, action: #selector(saveAndContinueTapped), for: .touchUpInside)
            view.addSubview(uploadButton)
        }

        // Dismiss keyboard on tap
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        view.addGestureRecognizer(tapGesture)
    }

    // configuration management stuff

    // loads the server ip and port from userdefaults if we saved it b4
    private func loadSavedServerConfig() {
        let defaults = UserDefaults.standard
        if let savedIP = defaults.string(forKey: "serverIP") {
            serverTextField.text = savedIP
        }
        if let savedPort = defaults.string(forKey: "serverPort") {
            portTextField.text = savedPort
        }
    }

    // saves the server config so we remember it next time
    private func saveServerConfig(ip: String, port: String) {
        let defaults = UserDefaults.standard
        defaults.set(ip, forKey: "serverIP")
        defaults.set(port, forKey: "serverPort")
    }

    // button actions

    // hides the keyboard when u tap on the background
    @objc private func dismissKeyboard() {
        view.endEditing(true)
    }

    // goes back to the previous screen
    @objc private func backTapped() {
        dismiss(animated: true)
    }

    // skips the server setup and goes straight to capture
    @objc private func skipTapped() {
        let captureVC = CaptureViewController()
        captureVC.modalPresentationStyle = .fullScreen
        present(captureVC, animated: true)
    }

    // saves the server config and goes to capture screen
    @objc private func saveAndContinueTapped() {
        // validate that both fields are filled
        guard let serverIP = serverTextField.text, !serverIP.isEmpty else {
            statusLabel.text = "⚠️ Please enter server IP address"
            statusLabel.textColor = .systemRed
            return
        }

        guard let port = portTextField.text, !port.isEmpty else {
            statusLabel.text = "⚠️ Please enter port number"
            statusLabel.textColor = .systemRed
            return
        }

        // save the configuration
        saveServerConfig(ip: serverIP, port: port)

        // go to capture screen
        let captureVC = CaptureViewController()
        captureVC.modalPresentationStyle = .fullScreen
        present(captureVC, animated: true)
    }

    // checks if the server ip and port are good then uploads data
    @objc private func uploadTapped() {
        guard let serverIP = serverTextField.text, !serverIP.isEmpty else {
            statusLabel.text = "⚠️ Please enter server IP address"
            statusLabel.textColor = .systemRed
            return
        }

        guard let port = portTextField.text, !port.isEmpty else {
            statusLabel.text = "⚠️ Please enter port number"
            statusLabel.textColor = .systemRed
            return
        }

        // Save configuration for next time
        saveServerConfig(ip: serverIP, port: port)

        // Build server URL
        let serverURL = "http://\(serverIP):\(port)/upload"

        // Start upload
        uploadToServer(url: serverURL)
    }

    // network upload stuff

    // uploads photos and lidar data to the server
    private func uploadToServer(url: String) {
        guard let endpoint = URL(string: url) else {
            statusLabel.text = "⚠️ Invalid server URL"
            statusLabel.textColor = .systemRed
            return
        }

        // disable buttons while uploading
        uploadButton.isEnabled = false
        serverTextField.isEnabled = false
        portTextField.isEnabled = false
        backButton.isEnabled = false
        activityIndicator.startAnimating()

        // show progress bar
        UIView.animate(withDuration: 0.3) {
            self.progressView.alpha = 1.0
        }
        progressView.progress = 0.0

        statusLabel.text = "Preparing upload..."
        statusLabel.textColor = .systemBlue

        // do the upload on a background thread
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            // setup the post request
            var request = URLRequest(url: endpoint)
            request.httpMethod = "POST"
            request.timeoutInterval = 120 // give it 2 mins to upload

            // create a boundary for multipart form data
            let boundary = UUID().uuidString
            request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

            // build the form data
            var data = Data()

            // track how many items we have
            var currentItem = 0
            let totalItems = self.capturedPhotos.count // just photos

            // add all the photos
            // using compressionQuality: 1.0 for maximum quality (no compression)
            // converts HEIC to JPEG automatically if needed
            for (index, photo) in self.capturedPhotos.enumerated() {
                DispatchQueue.main.async {
                    currentItem += 1
                    let progress = Float(currentItem) / Float(totalItems)
                    self.progressView.progress = progress * 0.8
                    self.statusLabel.text = "Adding photo \(index + 1) of \(self.capturedPhotos.count)..."
                }

                // compressionQuality: 1.0 = maximum quality, minimal compression
                // jpegData() ensures JPEG format even if source is HEIC
                if let imageData = photo.jpegData(compressionQuality: 1.0) {
                    data.append("--\(boundary)\r\n".data(using: .utf8)!)
                    data.append("Content-Disposition: form-data; name=\"image\(index + 1)\"; filename=\"face\(index + 1).jpg\"\r\n".data(using: .utf8)!)
                    data.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
                    data.append(imageData)
                    data.append("\r\n".data(using: .utf8)!)
                }
            }

            // add some metadata about the scan
            let metadata: [String: Any] = [
                "timestamp": ISO8601DateFormatter().string(from: Date()),
                "device": UIDevice.current.model,
                "ios_version": UIDevice.current.systemVersion,
                "photo_count": self.capturedPhotos.count
            ]

            if let metadataJSON = try? JSONSerialization.data(withJSONObject: metadata) {
                data.append("--\(boundary)\r\n".data(using: .utf8)!)
                data.append("Content-Disposition: form-data; name=\"metadata\"\r\n".data(using: .utf8)!)
                data.append("Content-Type: application/json\r\n\r\n".data(using: .utf8)!)
                data.append(metadataJSON)
                data.append("\r\n".data(using: .utf8)!)
            }

            // close the form data
            data.append("--\(boundary)--\r\n".data(using: .utf8)!)

            request.httpBody = data

            DispatchQueue.main.async {
                self.statusLabel.text = "Uploading \(self.formatBytes(data.count))..."
                self.progressView.progress = 0.8
            }

            // do the actual upload
            let task = URLSession.shared.dataTask(with: request) { [weak self] responseData, response, error in
                DispatchQueue.main.async {
                    self?.activityIndicator.stopAnimating()
                    self?.uploadButton.isEnabled = true
                    self?.serverTextField.isEnabled = true
                    self?.portTextField.isEnabled = true
                    self?.backButton.isEnabled = true
                    self?.progressView.progress = 1.0

                    if let error = error {
                        self?.statusLabel.text = "❌ Upload failed:\n\(error.localizedDescription)"
                        self?.statusLabel.textColor = .systemRed
                        UIView.animate(withDuration: 0.3) {
                            self?.progressView.alpha = 0
                        }
                        return
                    }

                    if let httpResponse = response as? HTTPURLResponse {
                        if httpResponse.statusCode == 200 {
                            self?.statusLabel.text = "✅ Upload successful!\nAll data sent to server"
                            self?.statusLabel.textColor = .systemGreen

                            // vibrate phone
                            let generator = UINotificationFeedbackGenerator()
                            generator.notificationOccurred(.success)

                            // go back to start after 2 secs
                            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                                self?.returnToStart()
                            }
                        } else {
                            self?.statusLabel.text = "❌ Server error: \(httpResponse.statusCode)"
                            self?.statusLabel.textColor = .systemRed
                            UIView.animate(withDuration: 0.3) {
                                self?.progressView.alpha = 0
                            }
                        }
                    }
                }
            }
            task.resume()
        }
    }

    // converts bytes to mb or kb so its readable
    private func formatBytes(_ bytes: Int) -> String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useKB, .useMB]
        formatter.countStyle = .file
        return formatter.string(fromByteCount: Int64(bytes))
    }

    // goes back to the capture screen after upload
    private func returnToStart() {
        // dismiss everything to go back to capture
        if let presentingVC = presentingViewController?.presentingViewController {
            presentingVC.dismiss(animated: true)
        }
    }
}
