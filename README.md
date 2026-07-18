# Desktop Pet  
Yo! Welcome to the repo. My screen was a bit too boring while studying and coding, so I built this little desktop pet to hang out with me. Right now, it’s not fully transparent and has a white screen.  

## What is this?  
It's a borderless pixel pet that lives directly on your macOS desktop. It walks around, takes naps, gets excited, and reacts when you wiggle your mouse over it. You can literally pick him up and toss him across the screen.  

## The AI Brain  
The pet uses the **Google Gemini API**. I connected it to the Gemini 2.5 Flash model and gave it a sassy, slightly mischievous system prompt.  

## Tech Stack  
* **Frontend:** React.js (Vite) + Tailwind CSS for the chat UI and making everything look clean.  
* **Backend / Windowing:** Tauri v2 + Rust. Rust handles all the backend processes.  
* **AI:** Gemini API for the chat feature.  

## AI use  
* Mostly during the build process and troubleshooting code.  

## To run .dmg  
* Download Releases  
* Drag into Applications  
* Open terminal and run this:  
    ```  
    xattr -cr /Applications/DesktopPet.app  
    ```  
    Then open the application; it will run without any error or damage.  

### 1. What you need installed first:  
* [Node.js](https://nodejs.org/) for npm  
* [Rust](https://www.rust-lang.org/tools/install). Tauri needs this to compile the native Mac window.  

### 2. Clone and Run:  
Open your terminal and enter these commands:  

```bash  
# Clone the repo (or just download the folder)  
git clone  
cd desktop-pet  

# Install the Node dependencies  
npm install  

# IMPORTANT: You need your own Gemini API key for the brain!  
# Open src/App.jsx and paste your key in the `apiKey` variable at the top.  

# Fire it up!  
npm run tauri dev  
```  

## Changes  
Now it’s resizable, and you can do this by dragging its area.  

**To Quit, use CMD + Q.**
