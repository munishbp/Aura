//
//  reviewviewcontroller.swift
//  facescanner
//
//  lets u look at the photos and lidar data u captured b4 uploading
//

import UIKit

// this is the second screen where u review everything
class ReviewViewController: UIViewController {

    // data stuff we got from the capture screen

    // the 5 photos u took
    var capturedPhotos: [UIImage] = []

    // ui elements

    // scrolls through photo thumbnails
    private var photoScrollView: UIScrollView!

    // holds the photo buttons
    private var photoStackView: UIStackView!

    // big preview of the photo u selected
    private var selectedPhotoView: UIImageView!

    // button to go back and retake photos
    private var retakeButton: UIButton!

    // button to go to next screen
    private var nextButton: UIButton!

    // which photo is currently selected (0-4)
    private var selectedPhotoIndex = 0

    // lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        // setup the review screen
        setupUI()
        // show all the photos and data we captured
        displayCapturedData()
    }

    // ui setup

    // creates all the buttons labels and stuff for the review screen
    private func setupUI() {
        view.backgroundColor = .systemGroupedBackground

        // Title label
        let titleLabel = UILabel(frame: CGRect(x: 20, y: 60, width: view.bounds.width - 40, height: 40))
        titleLabel.text = "Review Captured Data"
        titleLabel.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        titleLabel.textAlignment = .center
        view.addSubview(titleLabel)

        // Selected photo large preview
        let photoContainer = UIView(frame: CGRect(x: 20, y: 120, width: view.bounds.width - 40, height: 300))
        photoContainer.backgroundColor = .white
        photoContainer.layer.cornerRadius = 12
        photoContainer.layer.shadowColor = UIColor.black.cgColor
        photoContainer.layer.shadowOpacity = 0.1
        photoContainer.layer.shadowOffset = CGSize(width: 0, height: 2)
        photoContainer.layer.shadowRadius = 8
        view.addSubview(photoContainer)

        let photoLabel = UILabel(frame: CGRect(x: 0, y: 10, width: photoContainer.bounds.width, height: 30))
        photoLabel.text = "📷 Photos (tap to select)"
        photoLabel.textAlignment = .center
        photoLabel.font = UIFont.systemFont(ofSize: 16, weight: .semibold)
        photoContainer.addSubview(photoLabel)

        selectedPhotoView = UIImageView(frame: CGRect(x: 10, y: 45, width: photoContainer.bounds.width - 20, height: 200))
        selectedPhotoView.contentMode = .scaleAspectFit
        selectedPhotoView.layer.cornerRadius = 8
        selectedPhotoView.clipsToBounds = true
        selectedPhotoView.backgroundColor = .systemGray6
        photoContainer.addSubview(selectedPhotoView)

        // Photo thumbnail scroll view
        photoScrollView = UIScrollView(frame: CGRect(x: 10, y: 250, width: photoContainer.bounds.width - 20, height: 40))
        photoScrollView.showsHorizontalScrollIndicator = false
        photoContainer.addSubview(photoScrollView)

        photoStackView = UIStackView()
        photoStackView.axis = .horizontal
        photoStackView.spacing = 10
        photoStackView.distribution = .fillEqually
        photoScrollView.addSubview(photoStackView)

        // Data summary
        let summaryLabel = UILabel(frame: CGRect(x: 20, y: 440, width: view.bounds.width - 40, height: 60))
        summaryLabel.numberOfLines = 0
        summaryLabel.textAlignment = .center
        summaryLabel.font = UIFont.systemFont(ofSize: 12)
        summaryLabel.textColor = .tertiaryLabel
        summaryLabel.text = "All photos ready for upload to processing server"
        view.addSubview(summaryLabel)

        // Retake button
        retakeButton = UIButton(frame: CGRect(x: 40, y: view.bounds.height - 100, width: (view.bounds.width - 100)/2, height: 50))
        retakeButton.setTitle("← Retake", for: .normal)
        retakeButton.backgroundColor = .systemGray
        retakeButton.layer.cornerRadius = 25
        retakeButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        retakeButton.addTarget(self, action: #selector(retakeTapped), for: .touchUpInside)
        view.addSubview(retakeButton)

        // Next button
        nextButton = UIButton(frame: CGRect(x: 60 + (view.bounds.width - 100)/2, y: view.bounds.height - 100, width: (view.bounds.width - 100)/2, height: 50))
        nextButton.setTitle("Continue →", for: .normal)
        nextButton.backgroundColor = .systemIndigo
        nextButton.layer.cornerRadius = 25
        nextButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        nextButton.addTarget(self, action: #selector(continueTapped), for: .touchUpInside)
        view.addSubview(nextButton)
    }

    // display data stuff

    // shows all the photos
    private func displayCapturedData() {
        // create buttons for each photo so u can click them
        for (index, photo) in capturedPhotos.enumerated() {
            let thumbnailButton = UIButton(frame: CGRect(x: 0, y: 0, width: 100, height: 40))
            thumbnailButton.setImage(photo, for: .normal)
            thumbnailButton.imageView?.contentMode = .scaleAspectFill
            thumbnailButton.clipsToBounds = true
            thumbnailButton.layer.cornerRadius = 6
            thumbnailButton.layer.borderWidth = 2
            thumbnailButton.layer.borderColor = (index == 0 ? UIColor.systemIndigo.cgColor : UIColor.systemGray4.cgColor)
            thumbnailButton.tag = index
            thumbnailButton.addTarget(self, action: #selector(thumbnailTapped(_:)), for: .touchUpInside)
            photoStackView.addArrangedSubview(thumbnailButton)
        }

        // set the size of the stack view
        photoStackView.frame = CGRect(x: 0, y: 0, width: CGFloat(capturedPhotos.count * 110), height: 40)
        photoScrollView.contentSize = photoStackView.frame.size

        // show the first photo
        if !capturedPhotos.isEmpty {
            selectedPhotoView.image = capturedPhotos[0]
        }
    }

    // when u tap a photo thumbnail
    @objc private func thumbnailTapped(_ sender: UIButton) {
        selectedPhotoIndex = sender.tag

        // update the big photo preview
        selectedPhotoView.image = capturedPhotos[selectedPhotoIndex]

        // update the border colors to show which one is selected
        for (index, view) in photoStackView.arrangedSubviews.enumerated() {
            if let button = view as? UIButton {
                button.layer.borderColor = (index == selectedPhotoIndex ? UIColor.systemIndigo.cgColor : UIColor.systemGray4.cgColor)
            }
        }
    }

    // button actions

    // goes back to take more photos
    @objc private func retakeTapped() {
        dismiss(animated: true)
    }

    // goes to the next screen to upload
    @objc private func continueTapped() {
        let serverInputVC = ServerInputViewController()
        serverInputVC.capturedPhotos = capturedPhotos
        serverInputVC.modalPresentationStyle = .fullScreen

        present(serverInputVC, animated: true)
    }
}
