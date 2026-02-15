# ⚡ Khamba Game: The Great Pole Heist

![Game Banner](https://via.placeholder.com/800x400?text=Khamba+Game+Preview)
*(Note: Replace the link above with a screenshot of your actual game once uploaded)*

**Khamba Game** is a satirical, fast-paced infinite runner built entirely with **Vanilla JavaScript** and the **HTML5 Canvas API**. 

Step into the shoes of a determined man on a bizarre mission: steal as many Electric Poles ("Khamba") as possible while dodging speeding police cars. How long can you run before you get BUSTED?

## 🎮 Play Online
**[Click here to play the demo!] (INSERT_YOUR_GITHUB_PAGES_LINK_HERE)**

## ✨ Features
* **Infinite Gameplay:** The game speed increases the longer you survive.
* **Responsive Design:** Fully playable on both Desktop and Mobile devices.
* **Custom Canvas Rendering:** No external sprite sheets—all characters and assets are drawn programmatically using the Canvas API.
* **High Score Tracking:** Counts every "Khamba" stolen in real-time.
* **Cross-Platform Controls:** Supports Keyboard inputs and Touch gestures.

## 🕹️ Controls
| Platform | Action | Input |
| :--- | :--- | :--- |
| **Desktop** | Jump | `Spacebar` or `Arrow Up` |
| **Mobile** | Jump | `Tap Screen` |

## 🛠️ Technologies Used
* **HTML5:** Structure and Semantic markup.
* **CSS3:** Responsive layout using `clamp()` and Flexbox.
* **JavaScript (ES6+):** Game logic, physics, collision detection, and rendering.
* **Canvas API:** Used for all graphical rendering (Player, Poles, Police Cars).

## 📂 Project Structure
```text
khamba-game/
├── img/
│   └── logo.png       # Favicon
├── index.html         # Main entry point
├── script.js          # Game loop and logic
├── style.css          # Styling and responsiveness
└── README.md          # Documentation
