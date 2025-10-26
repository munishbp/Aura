//
//  config.swift
//  facescanner
//
//  reads ssh configuration from .env file
//

import Foundation

struct Config {
    // ssh configuration from .env file
    static let sshHost: String = {
        return getEnvValue(for: "SSH_HOST") ?? ""
    }()

    static let sshPort: Int = {
        if let portString = getEnvValue(for: "SSH_PORT"),
           let port = Int(portString) {
            return port
        }
        return 22 // default ssh port
    }()

    static let sshUsername: String = {
        return getEnvValue(for: "SSH_USERNAME") ?? ""
    }()

    static let sshPassword: String = {
        return getEnvValue(for: "SSH_PASSWORD") ?? ""
    }()

    static let remotePath: String = {
        return getEnvValue(for: "REMOTE_PATH") ?? ""
    }()

    // reads value from .env file
    private static func getEnvValue(for key: String) -> String? {
        // try to read from .env file in main bundle
        guard let envPath = Bundle.main.path(forResource: ".env", ofType: nil) else {
            print("⚠️ .env file not found in bundle")
            return nil
        }

        do {
            let envContent = try String(contentsOfFile: envPath, encoding: .utf8)
            let lines = envContent.components(separatedBy: .newlines)

            for line in lines {
                // skip comments and empty lines
                let trimmed = line.trimmingCharacters(in: .whitespaces)
                if trimmed.isEmpty || trimmed.hasPrefix("#") {
                    continue
                }

                // parse key=value
                let parts = trimmed.components(separatedBy: "=")
                if parts.count == 2 {
                    let envKey = parts[0].trimmingCharacters(in: .whitespaces)
                    let envValue = parts[1].trimmingCharacters(in: .whitespaces)

                    if envKey == key {
                        return envValue
                    }
                }
            }
        } catch {
            print("⚠️ Error reading .env file: \(error)")
        }

        return nil
    }

    // validates that all required config is present
    static func isConfigured() -> Bool {
        return !sshHost.isEmpty &&
               !sshUsername.isEmpty &&
               !sshPassword.isEmpty &&
               !remotePath.isEmpty
    }
}
