//
//  viewcontroller.swift
//  facescanner
//
//  landing page with aura logo and get started button
//

import UIKit

// landing page - first screen when app opens
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    // setup the landing page ui
    private func setupUI() {
        // black background
        view.backgroundColor = .black

        // aura logo at the top center
        let logoImageView = UIImageView(frame: CGRect(x: view.bounds.width/2 - 100, y: 150, width: 200, height: 200))
        logoImageView.image = UIImage(named: "aura")
        logoImageView.contentMode = .scaleAspectFit
        view.addSubview(logoImageView)

        // instruction text below logo
        let instructionLabel = UILabel(frame: CGRect(x: 40, y: 380, width: view.bounds.width - 80, height: 60))
        instructionLabel.text = "Take 5 pictures in the next steps"
        instructionLabel.font = UIFont.systemFont(ofSize: 18, weight: .regular)
        instructionLabel.textColor = .white
        instructionLabel.textAlignment = .center
        instructionLabel.numberOfLines = 2
        view.addSubview(instructionLabel)

        // get started button
        let getStartedButton = UIButton(frame: CGRect(x: 60, y: view.bounds.height - 150, width: view.bounds.width - 120, height: 60))
        getStartedButton.setTitle("Get Started", for: .normal)
        getStartedButton.setTitleColor(.black, for: .normal)
        getStartedButton.backgroundColor = .white
        getStartedButton.layer.cornerRadius = 30
        getStartedButton.titleLabel?.font = UIFont.systemFont(ofSize: 20, weight: .bold)
        getStartedButton.addTarget(self, action: #selector(getStartedTapped), for: .touchUpInside)
        view.addSubview(getStartedButton)
    }

    // when get started is tapped, go to capture screen
    @objc private func getStartedTapped() {
        let captureVC = CaptureViewController()
        captureVC.modalPresentationStyle = .fullScreen
        present(captureVC, animated: true)
    }
}
