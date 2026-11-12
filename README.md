# binaryGame
 
A small browser-based training game for learning to read binary numbers. You're shown a row of bits and have to convert them into their decimal value. Built with plain HTML, CSS and JavaScript, with no frameworks, dependencies or build step.
 
The interface uses a dark, terminal look with glowing bits, and is fully available in **English** and **Japanese (日本語)**.
 
## Features
 
- **Random binary challenges**: bits are displayed in groups of four chunks so they're easier to read
- **Selectable bit length**: practise with 4, 8, 12 or 16 bits
- **Streak tracking**: current streak and best streak, shown live
- **Instant feedback**: correct and incorrect messages, with a shake animation on wrong answers
- **Show answer**: reveal the answer if you're stuck (this resets your streak)
- **Bilingual UI**: switch between English and Japanese at any time; your choice is remembered via `localStorage`
- **Keyboard friendly**: press `Enter` to submit or move on to the next number
- **Accessible**: ARIA labels and live regions for screen readers, visible focus states, and `prefers-reduced-motion` support
- **Responsive**: works on desktop and mobile layouts
