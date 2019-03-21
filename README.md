# React Rewind : A Time Travel Debugger for React
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/reactrewind/react-rewind/pulls) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)<br/>
A time travel debugger tool made to work with React 16.8+, designed to help engineers record and replay user sessions to fix bugs faster.
Debug issues easier by “rewinding” your session instead of having to reproduce the issue until you find the bug

- Press record and start interacting with your application
- Each action will be stored as a unique “event” in time
- Pause your recording and start observing all program activities
- Press play to “rewind” through your recorded actions
- View a real-time playback representation of your application state at any given time


 **React Rewind is in active development. Please follow this repo for contribution guidelines and our development road map.**
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Your application must be using the hooks useReducer for actions to be record.

### Installing
React Rewind is available as a Chrome extension through the Google Chrome Web Store.
On your application page open Chrome Developer tools and select React Rewind from the tool bar. 
Click `Record` and begin interacting with your application.

If you prefer to install locally, setup instructions are as follows:
```
git clone https://github.com/reactrewind/react-rewind.git`
cd reactrewind
npm install
npm run rewind
```

Head to [chrome://extensions/](chrome://extensions/)
Click `Load Unpacked` button and upload the chrome folder, located at react-rewind/src/browser/chrome
On your application page open Chrome Developer tools and select React Rewind from the tool bar. 
Click `Record` and begin interacting with your application.

As you interact with your application actions will populate in the events panel.  These actions are clickable and will change the state of your page. The actions can be viewed in more detail in the right panel by inspecting the actions, effects, and state.  The bottom panel allow you to rewind, fast forward,and play through all recorded actions. 

## Running the tests

`npm run tests`

## Contributing

Please fork this repo.  We welcome pull requests. For suggestions or to report bugs please log an issue.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

[Brandon Murphy](https://github.com/murphybrandon) | [Victor Varaschin](https://github.com/victorvrv) | [Kia Colbert](https://github.com/kiacolbert) | [Gabor Mowiena](https://github.com/GaberMowiena)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

