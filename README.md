#  Desktop Pet 
Yo! Welcome to the repo. Ngl, my screen was looking a bit too boring while studying and writing code, so I built this little desktop pet to just chill with me. Currently it is not fully transparent open with white screen.

##  What is this?
Basically, it's a borderless pixel pet that lives directly on your macOS desktop. It walks around, takes naps, gets the zoomies, and reacts when you wiggle your mouse on it. You can literally pick him up and yeet him across the screen.

##  The AI Brain (not used I don't have it) to use your api do clone and build it

The pet is powered by the **Google Gemini API**. I hooked it up to the Gemini 2.5 Flash model and gave it a sassy, slightly mischievous system prompt.

## 🛠️ Tech Stack The OP
* **Frontend:** React.js (Vite) + Tailwind CSS (for styling the chat UI and making everything look clean).

* **Backend / Windowing:** Tauri v2 + Rust  Rust handles all the 
* **AI:** Gemini API for the LLM chat feature.

## AI use 

 * Mostly while build dmg file and troubleshooting code.


 ## To run .dmg 
 * Download Releases
 * Draw into Application 
 * Open terminal and run this 
    ```
    xattr -cr /Applications/DesktopPet.app
    ```
    then open Application it will run without any error and damage 

### 1. What you need installed first:
* [Node.js](https://nodejs.org/) (for npm)
* [Rust](https://www.rust-lang.org/tools/install) (Tauri needs this to compile the native Mac window)

### 2. Clone and Run:
Open your terminal and smash in these commands:

```bash
# Clone the repo (or just download the folder)
git clone 
cd desktop-pet

# Install the Node dependencies
npm install

#  IMPORTANT: You need your own Gemini API key for the brain!
# Open src/App.jsx and paste your key in the `apiKey` variable at the top.

# Fire it up!
npm run tauri dev
