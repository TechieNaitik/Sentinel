# Sentinel - Password Strength & Hygiene Analyzer

Sentinel is a modern, privacy-focused password strength analyzer that goes beyond simple length checks. It uses information theory (Shannon Entropy), pattern detection, and cracking simulation to provide a comprehensive security assessment of your passwords.

## 🛡️ Features

- **Advanced Entropy Calculation:** Calculates the true information density in bits based on character pool analysis.
- **Pattern Detection:** Identifies weak patterns like sequential numbers ("1234"), keyboard walks ("qwerty"), and repetitive characters.
- **Cracking Simulation:** Estimates how long it would take for a modern GPU rig to crack the password using brute-force methods.
- **zxcvbn Integration:** Leverages Dropbox's `zxcvbn` library for dictionary matching and common password detection.
- **Breach Check (k-Anonymity):** Safely checks if your password has appeared in known data breaches using the HaveIBeenPwned API (uses k-Anonymity, never sends your full password).
- **Secure Hashing Visualization:** Educational tool demonstrating how modern hashing (bcrypt/Argon2) and salting protect passwords.
- **Passphrase Generator:** Generates high-entropy, memorable passphrases (e.g., "Correct-Horse-Battery-Staple").

## 🔒 Security Architecture

**Sentinel follows a strict Zero-Knowledge Architecture:**

1.  **Client-Side Only:** All password analysis logic runs entirely in your browser.
2.  **No Network Transmission:** Your password is NEVER sent over the network.
3.  **Safe Breach Check:** We use the k-Anonymity model. We hash your password locally (SHA-1) and send only the first 5 characters of the hash to the API. The API returns all suffixes matching those 5 characters, and we check for a match locally.

## 🛠️ Tech Stack

- **Frontend Library:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Design System)
- **Animations:** Framer Motion
- **Testing:** Vitest, React Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/TechieNaitik/sentinel.git
    cd sentinel
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:

    ```bash
    npm run dev
    ```

4.  Run tests:
    ```bash
    npm run test
    ```

## 📝 License

MIT License - feel free to use this for educational purposes.
