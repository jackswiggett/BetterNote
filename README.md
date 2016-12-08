BetterNote is a tool for assessing alternative music notation systems (i.e. any system other than traditional, Western music notation). It allows users to run sight-reading tests using different notation systems, and records reading speed and accuracy. It logs these results in a database, and permits searching and filtering results on the "Test Results" page.

BetterNote is built with Node.js and React.js, and communicates with MongoDB to store data. It currently supports testing of traditional music notation and [Klavarskribo](https://en.wikipedia.org/wiki/Klavarskribo).

## Installation

To install and run BetterNote:
* Make sure that you have installed MongoDB and that it is running on port 27017. Without MongoDB, BetterNote will run, but will be unable to store or load test logs. BetterNote will use a MongoDB database named "betternote".
* Execute the following commands:
```
git clone https://github.com/jackswiggett/BetterNote.git
cd BetterNote
npm install
cd client
npm install
cd ..
npm start
```
* Visit `http://localhost:3000/` in your browser.
