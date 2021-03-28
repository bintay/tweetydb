# tweetydb

Practice problem interface for an introduction to databases workshop to introduce SQL, MongoDB, and Neo4j. [There are slides that go along with these practice problems here](https://docs.google.com/presentation/d/1BPelR_2577N5HI4iyiMs2HVIPWZiL0JsE9V-2UAHLIY/edit?usp=sharing). Enjoy!

First hosted at [vhHacks](https://vhhacks.ca/) 2021, and then at [UT Austin's 2021 Learnathon](https://freetailhackers.com/learnathon/).

## Deploying 

(hints to my future self, if you fork this your experience may be different)

I currently deploy the client on Netlify. Netlify is configured to build from the client folder using yarn, and will automatically build and deploy when `main` changes on GitHub.

The API is hosted on Heroku. This is not configured to deploy automatically. To deploy, push the api folder to the heroku origin with `git subtree push --prefix api heroku master`.
