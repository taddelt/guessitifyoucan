# Guess it if you can
#### Video Demo:  <URL HERE>
#### Overiew:
My final project for CS50x is a mobile multiplayer party game called ***"Guess it if you can"***. It is designed to be played by groups of at least four people, where players explain words to their teammates in different ways across multiple rounds. The inspiration came from playing a similar game with my family using paper, pens and stopwatches, which was always funny and chaotic. I wanted to build a digital version that is easier to set up, more flexible and provides a smoother gameplay experience.

The app is built with **React Native, Expo and TypeScript** and uses several **external libraries** for navigation, UI and functionality. The game logic is managed with global contexts and the words are drawn from a customizable word pool of categories and difficulties.

#### Motivation
The idea came from real life. I originally found the game rules on instagram and started playing the game with my extended family more and more often. It became our **favorite family game** and was the reason for the increase in the number of family evenings. But it was always a lot of effort to prepare, we had to write words on slips of paper, keep the score manually, explain the rules over and over and time each round with a phone. Over time, the games also became a bit repetitive, because the rounds were always the same and the words that the players anonomously wrote down doubled, were too difficult, too easy or just not creative.

I expanded and developed the game in many different ways and built an app to solve all these problems. With a digital version we could customize the rules, balance the teams automatically and always have new fun and fair sets of words. That is how "Guess it if you can" was born.

#### Technologies and Tools
I used:
- **React Native with Expo and Expo Go** to run and test the app on mobile devices.
- **TypeScript** (`.tsx` and `.ts` files) for type safety and cleaner code.
- **React Navigation** for handling multiple screens and nested navigation flows.
- **External libraries** such as `@expo/vector-icons` (FontAwesome5 icons), `react-native-svg` (animated timer), `@react-native-community/slider` (slider) and others to enrich the UI.
- **VS Code** as my development evnironment together with **Node.js**.

I also created some special files myself:
- **wordPool**: provides the categories, difficulties and colors of words (in my final submission it is cut down to only a few example words).
- **roundConfig**: contains the rules of the game rounds.
- **AppNavigator**: controls the navigation logic.
- **GameContext and SettingsContext**: contain methods, rules and shared states.

#### Features
The most important features of the game are:
- **Configurable Rules**: Users can either use preset rules or customize everything (number of teams and players, size differences balanced mathematically, number of jokers, categories, number of words per player, difficulties, round types, time per player and whether wildcards are enabled (not working yet).
- **Multiple Rounds**: Before each round, an explanation screen is shown. Every player plays exactly once per round.
- **Word Distribution**: Words always come from the same pool, but are reshuffled and redistributed for each round. No duplicates within a round.
- **Word Carousel**: Each players sees their personal set of words displayed in a horizontal carousel. Words belong to categories and difficulties.
- **Marking Correct/Wrong**: During play, teammates can mark each word as guessed or not guessed.
- **Jokers**: In the first round, each player has a set number of jokers. A joker replaces the current word with another one of the same category and difficulty and permanently changes the word pool.
- **Timer**: A circular animated timer runs a button. If the player finishes early, they can hold the button to fast-forward the timer. If they release the button, it snaps back to the real elapsed time.
- **Results**: At the end of the entire game, there is a results screen with rankings. If teams have the the same amount of points, they share a rank.

I am especially proud of the animated timer, the joker feature and the personalized settings system that makes the game flexible for different groups.

#### How to Run
To **start the app** locally:
```
npx expo start
```
Then scan the QR code with Expo Go on your mobile device (I designed everything for IOS devices amd didn't check android devices yet).

Before the game starts, you need to **configure the teams**. In DIY mode you also need to choose at least one word category. Everything else can be designed, otherwise the defaults are used.

#### Challanges and Lessons Learned
The hardest part of the project was definitely the **game logic**. Designing the word pool so that words never duplicated, always matched categories and difficulties and redistributed correctly each round was very challanging. Especially all the preventive debugging to handle the worst case scenarios was a lot of work. Adding the joker feature on top of that pushed me to think carefully about how to update state without breaking the logic.

Another huge challange was **navigation**. With so many screens and nested routes, bugs appeared often, and some were very hard to fix. I learned that sometimes the best way to fix a bug is to step back, rethink the design and rebuild a piece from scratch.

The **timer and joker** features were also difficult, because tehy involved coordinating animations, user input and state changes. But in the end, they became some of the features I am most proud of.

Overall I learned to:
- Work cleanly and structure my code better.
- Move global logic into contexts instead of scattering it.
- Debug issues patiently.
- know that sometimes small errors in a single line can cause big issues.

This project was a continuous learning process. I had to teach myself React Native, Expo and Type Script along the way, which made it both harder and more rewarding.

#### Future Improvements
There are several things I would like to add in the future:
- **Info boxes**: to explain rules, buttons and features for beginners.
- **Tutorial Labels**: during the first round, some buttons should be temporarily labeled to help new players.
- **Wildcards**: fun challanges that make explaining harder or funnier.
- **Accessibility mode**: a mode for older players or people with disabilities, giving them easier words so everyone can join in.
- **More Preset Modes**: so players can quickly start games with balanced rules.
- **Custom Word Mode**: where players choose all the words themselves instead of generating them.

#### Conclusion
Working on "Guess it if you can" was a **rewarding experience**. What started as a simple idea from family game nights turned into a full mobile application with complex logic and customizable settings. I struggled with bugs, learned new technologies and built something I am proud of.

This project showed me how much I enjoy creating tools that bring people togehter. I plan to continue improving the app, use it with my family and friends and maybe one day publish it for everyone to play.
