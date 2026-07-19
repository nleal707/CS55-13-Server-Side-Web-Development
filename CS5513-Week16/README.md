# Photo Gallery App (CS5513 Week 16)

A cross-platform mobile and web application built with [Ionic](https://ionicframework.com/), [Capacitor](https://capacitorjs.com/), and [TypeScript](https://www.typescriptlang.org/). This project serves as the Week 16 assignment for CS5513, featuring a photo gallery with capabilities to manage photos, articles, and places.

**Live Demo:** [https://cs-5513-week16.vercel.app](https://cs-5513-week16.vercel.app)

## 🚀 Features

* **Photo Gallery:** View and manage a collection of photos.
* **Articles & Places:** (Based on the app title) Functionality to browse articles and save/view locations.
* **Cross-Platform:** Runs on the Web, iOS, and Android from a single codebase.
* **Camera Integration:** Uses Capacitor plugins to access the native device camera (if applicable).
* **Filesystem Integration:** Persists data using the device filesystem (if applicable).

## 🛠 Tech Stack

* **Framework:** Ionic Framework
* **Runtime:** Capacitor (for native mobile deployment)
* **Language:** TypeScript
* **Bundler:** Vite
* **Styling:** CSS / Ionic Utilities

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (Latest LTS version recommended)
* [Ionic CLI](https://ionicframework.com/docs/cli): `npm install -g @ionic/cli`

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nleal707/CS5513-Week16.git
    cd CS5513-Week16
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the App

### Web (Development)
To run the app in your browser with live reload:
```bash
ionic serve
