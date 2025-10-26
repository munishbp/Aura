//
//  captureviewcontroller.swift
//  facescanner
//
//  captures faces using the rear camera and lidar sensor
//

import UIKit
import ARKit
import RealityKit
import Vision
import AVFoundation

// this screen lets u take pics of ur face and scan it with lidar
class CaptureViewController: UIViewController {

    // all the ui stuff

    // the ar view shows what the camera sees
    private var arView: ARView!

    // button to take photos
    private var capturePhotoButton: UIButton!

    // shows instructions and status messages
    private var statusLabel: UILabel!

    // flash toggle button
    private var flashButton: UIButton!

    // flash enabled state
    private var isFlashEnabled = false

    // holds all the photo previews
    private var photoPreviewContainer: UIView!

    // individual photo preview boxes
    private var photoPreviewViews: [UIImageView] = []

    // the green box around the face
    private var faceDetectionLayer: CALayer!

    // button to go back to welcome page
    private var backButton: UIButton!

    // ar session stuff

    // the ar session for the rear camera
    private let session = ARSession()

    // face detection stuff

    // the vision thing that detects faces
    private var faceDetectionRequest: VNDetectFaceRectanglesRequest!

    // the box around the face that was detected
    private var detectedFaceRect: CGRect?

    // captured data variables

    // stores the 5 photos we take
    private var capturedPhotos: [UIImage] = []

    // tells the user what to photograph
    private let photoPrompts = [
        "Take Upper Left Quadrant of the Face",
        "Take Lower Left Quadrant of the Face",
        "Take Center of the Face",
        "Take Upper Right Quadrant of the Face",
        "Take Lower Right Quadrant of the Face"
    ]

    // lifecycle stuff

    override func viewDidLoad() {
        super.viewDidLoad()
        // setup face detection and ui when screen loads
        setupFaceDetection()
        setupUI()
        setupARSession()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        // stop the ar session when we leave
        session.pause()
    }

    // setup face detection stuff

    // makes the vision face detection thing work
    private func setupFaceDetection() {
        faceDetectionRequest = VNDetectFaceRectanglesRequest { [weak self] request, error in
            guard let observations = request.results as? [VNFaceObservation] else { return }

            DispatchQueue.main.async {
                self?.processFaceDetection(observations)
            }
        }
    }

    // ui setup functions

    // sets up all the buttons and labels on the screen
    private func setupUI() {
        view.backgroundColor = .black

        // the camera view takes up whole screen
        arView = ARView(frame: view.bounds)
        view.addSubview(arView)

        // the layer where we draw the face box
        faceDetectionLayer = CALayer()
        arView.layer.addSublayer(faceDetectionLayer)

        // instructions at the top of screen
        statusLabel = UILabel(frame: CGRect(x: 20, y: 60, width: view.bounds.width - 40, height: 80))
        statusLabel.textAlignment = .center
        statusLabel.textColor = .white
        statusLabel.backgroundColor = UIColor.black.withAlphaComponent(0.7)
        statusLabel.layer.cornerRadius = 10
        statusLabel.clipsToBounds = true
        statusLabel.numberOfLines = 3
        statusLabel.font = UIFont.systemFont(ofSize: 16, weight: .medium)
        statusLabel.text = photoPrompts[0]
        view.addSubview(statusLabel)

        // back button to return to welcome page
        backButton = UIButton(frame: CGRect(x: 20, y: 60, width: 44, height: 44))
        backButton.setTitle("←", for: .normal)
        backButton.setTitleColor(.white, for: .normal)
        backButton.backgroundColor = UIColor.black.withAlphaComponent(0.7)
        backButton.layer.cornerRadius = 22
        backButton.titleLabel?.font = UIFont.systemFont(ofSize: 24, weight: .medium)
        backButton.addTarget(self, action: #selector(backButtonTapped), for: .touchUpInside)
        view.addSubview(backButton)

        // the box on the right that shows all the photos u took
        let containerHeight: CGFloat = 580
        let containerWidth: CGFloat = 100
        photoPreviewContainer = UIView(frame: CGRect(
            x: view.bounds.width - containerWidth - 20,
            y: 160,
            width: containerWidth,
            height: containerHeight
        ))
        photoPreviewContainer.backgroundColor = UIColor.black.withAlphaComponent(0.3)
        photoPreviewContainer.layer.cornerRadius = 8
        photoPreviewContainer.layer.borderWidth = 2
        photoPreviewContainer.layer.borderColor = UIColor.systemGreen.cgColor
        view.addSubview(photoPreviewContainer)

        // make 5 little boxes for the 5 photos
        for i in 0..<5 {
            let previewView = UIImageView(frame: CGRect(
                x: 10,
                y: 10 + CGFloat(i) * 110,
                width: containerWidth - 20,
                height: 100
            ))
            previewView.contentMode = .scaleAspectFill
            previewView.clipsToBounds = true
            previewView.layer.cornerRadius = 6
            previewView.backgroundColor = UIColor.darkGray.withAlphaComponent(0.5)
            previewView.transform = CGAffineTransform(rotationAngle: .pi / 2) // 90 degree rotation

            // add numbers to the boxes
            let numberLabel = UILabel(frame: CGRect(x: 0, y: 0, width: 100, height: 100))
            numberLabel.text = "\(i + 1)"
            numberLabel.textAlignment = .center
            numberLabel.font = UIFont.systemFont(ofSize: 36, weight: .bold)
            numberLabel.textColor = UIColor.white.withAlphaComponent(0.3)
            previewView.addSubview(numberLabel)

            photoPreviewContainer.addSubview(previewView)
            photoPreviewViews.append(previewView)
        }

        // green button to take photos
        capturePhotoButton = UIButton(frame: CGRect(x: view.bounds.width/2 - 35, y: view.bounds.height - 120, width: 70, height: 70))
        capturePhotoButton.backgroundColor = .systemGreen
        capturePhotoButton.layer.cornerRadius = 30
        capturePhotoButton.layer.borderWidth = 4
        capturePhotoButton.layer.borderColor = UIColor.white.cgColor
        capturePhotoButton.setTitle("", for: .normal)
        capturePhotoButton.titleLabel?.font = UIFont.systemFont(ofSize: 30)
        capturePhotoButton.addTarget(self, action: #selector(capturePhotoTapped), for: .touchUpInside)
        view.addSubview(capturePhotoButton)

        // flash toggle button
        flashButton = UIButton(frame: CGRect(x: 30, y: view.bounds.height - 120, width: 60, height: 60))
        flashButton.setTitle("⚡", for: .normal)
        flashButton.titleLabel?.font = UIFont.systemFont(ofSize: 30)
        flashButton.backgroundColor = UIColor.darkGray.withAlphaComponent(0.7)
        flashButton.layer.cornerRadius = 30
        flashButton.addTarget(self, action: #selector(flashToggleTapped), for: .touchUpInside)
        view.addSubview(flashButton)

        // button to go to review screen
        let nextButton = UIButton(frame: CGRect(x: view.bounds.width/2 - 60, y: view.bounds.height - 50, width: 120, height: 44))
        nextButton.setTitle("Review →", for: .normal)
        nextButton.backgroundColor = UIColor.systemIndigo
        nextButton.layer.cornerRadius = 22
        nextButton.titleLabel?.font = UIFont.systemFont(ofSize: 16, weight: .semibold)
        nextButton.addTarget(self, action: #selector(nextButtonTapped), for: .touchUpInside)
        nextButton.alpha = 0 // hidden at first
        nextButton.tag = 999
        view.addSubview(nextButton)
    }

    // ar session setup stuff

    // starts up the ar session for the rear camera and lidar
    private func setupARSession() {
        arView.session = session

        guard ARWorldTrackingConfiguration.isSupported else {
            statusLabel.text = "AR World Tracking not supported"
            return
        }

        let configuration = ARWorldTrackingConfiguration()
        configuration.planeDetection = [.horizontal, .vertical]

        session.delegate = self
        session.run(configuration)
    }

    // face detection functions

    // processes the faces that were detected
    private func processFaceDetection(_ observations: [VNFaceObservation]) {
        // remove old boxes
        faceDetectionLayer.sublayers?.forEach { $0.removeFromSuperlayer() }

        guard let face = observations.first else {
            detectedFaceRect = nil
            return
        }

        // convert the coords to screen coords
        let boundingBox = face.boundingBox
        let size = arView.bounds.size

        // vision uses different origin than uikit so we gotta convert
        let x = boundingBox.origin.x * size.width
        let y = (1 - boundingBox.origin.y - boundingBox.height) * size.height
        let width = boundingBox.width * size.width
        let height = boundingBox.height * size.height

        detectedFaceRect = CGRect(x: x, y: y, width: width, height: height)

        // draw the green box around the face
        let boxLayer = CALayer()
        boxLayer.frame = detectedFaceRect!
        boxLayer.borderColor = UIColor.systemGreen.cgColor
        boxLayer.borderWidth = 3
        boxLayer.cornerRadius = 8
        faceDetectionLayer.addSublayer(boxLayer)

        // add label text
        let label = CATextLayer()
        label.string = "Face Detected"
        label.fontSize = 14
        label.foregroundColor = UIColor.systemGreen.cgColor
        label.backgroundColor = UIColor.black.withAlphaComponent(0.7).cgColor
        label.frame = CGRect(x: x, y: y - 25, width: 120, height: 20)
        label.alignmentMode = .center
        faceDetectionLayer.addSublayer(label)
    }

    // runs face detection on each frame
    private func detectFaces(in pixelBuffer: CVPixelBuffer) {
        let imageRequestHandler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .right, options: [:])

        try? imageRequestHandler.perform([faceDetectionRequest])
    }

    // capture photo functions

    // when u tap the camera button it captures a photo
    @objc private func capturePhotoTapped() {
        guard capturedPhotos.count < 5 else {
            statusLabel.text = "Already captured 5 photos!"
            return
        }

        guard let frame = session.currentFrame else {
            statusLabel.text = "No camera frame available"
            return
        }

        // Warn if no face detected
        if detectedFaceRect == nil {
            statusLabel.text = "No face detected - capture anyway?"
        }

        // Convert pixel buffer to UIImage
        let image = CIImage(cvPixelBuffer: frame.capturedImage)
        let context = CIContext()
        guard let cgImage = context.createCGImage(image, from: image.extent) else {
            statusLabel.text = "Failed to capture photo"
            return
        }

        let capturedPhoto = UIImage(cgImage: cgImage)
        capturedPhotos.append(capturedPhoto)

        // Update preview for this photo
        let index = capturedPhotos.count - 1
        if index < photoPreviewViews.count {
            photoPreviewViews[index].image = capturedPhoto
            // Remove number label
            photoPreviewViews[index].subviews.forEach { $0.removeFromSuperview() }
        }

        // Haptic feedback
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()

        // Update status with next prompt
        if capturedPhotos.count < 5 {
            statusLabel.text = "Photo \(capturedPhotos.count)/5 captured!\n\n" + photoPrompts[capturedPhotos.count]
        } else {
            statusLabel.text = "All 5 photos captured! ✓\nTap Review to continue"

            // Show the review button
            checkIfReadyToReview()
        }
    }

    // shows the next button when all data is ready
    private func checkIfReadyToReview() {
        if capturedPhotos.count == 5 {
            if let nextButton = view.viewWithTag(999) {
                UIView.animate(withDuration: 0.3) {
                    nextButton.alpha = 1.0
                }
            }
        }
    }

    // goes back to welcome page
    @objc private func backButtonTapped() {
        dismiss(animated: true)
    }

    // toggles flash on/off
    @objc private func flashToggleTapped() {
        isFlashEnabled.toggle()

        if isFlashEnabled {
            flashButton.backgroundColor = UIColor.systemYellow.withAlphaComponent(0.9)
            enableTorch(on: true)
        } else {
            flashButton.backgroundColor = UIColor.darkGray.withAlphaComponent(0.7)
            enableTorch(on: false)
        }
    }

    // enables or disables the torch (flash light)
    private func enableTorch(on: Bool) {
        guard let device = AVCaptureDevice.default(for: .video),
              device.hasTorch else { return }

        do {
            try device.lockForConfiguration()
            if on {
                try device.setTorchModeOn(level: 1.0)
            } else {
                device.torchMode = .off
            }
            device.unlockForConfiguration()
        } catch {
            print("Torch could not be used")
        }
    }

    // goes to the upload screen
    @objc private func nextButtonTapped() {
        guard capturedPhotos.count == 5 else {
            statusLabel.text = "Please capture 5 photos"
            return
        }

        // turn off flash when leaving
        enableTorch(on: false)

        let uploadVC = UploadViewController()
        uploadVC.capturedPhotos = capturedPhotos
        uploadVC.modalPresentationStyle = .fullScreen

        present(uploadVC, animated: true)
    }

}

// ar session delegate stuff

extension CaptureViewController: ARSessionDelegate {
    // this gets called every time the ar frame updates
    func session(_ session: ARSession, didUpdate frame: ARFrame) {
        // detect faces in the current frame
        detectFaces(in: frame.capturedImage)
    }
}
