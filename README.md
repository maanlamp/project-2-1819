# Project 2
## Weather-app-ish Availability Checker Thingy
![An animated gif image showing a glimpse of the app being used.](assets/demo.gif)

Don't know where to have that meeting about whether everyone should be allowed to wear bright lime clothing? Worry no longer! Use this app to be able to quickly lookup a free room, and see its current climate. Now everyone can start discussing more important things! _Like the fact that lime is a cool colour and everyone should wear what they want..._

## Getting started
Clone
```shell
git clone https://github.com/maanlamp/project-2-1819.git
```

Install
```shell
npm i
```

Build
```shell
npm run build
```

Start
```shell
npm run start
```

This will start the app on port `1337`, and the database on port `3000`.

## Performance matters
In order to use the app effectively anywhere, I used compression middleware to spare precious bytes and seconds nobody is really willing to spare. Besides the compression, I've just about minified EVERY single file that I could minimize. I wanted to use a service worker to cache everything for offline use, but I didn't have the time.

## Browser technologies
The app should be usable in all modern browsers (due to a lack of time, I wasn't able to support IE11+ just yet). It was designed to be used by everyone, so I made sure it is properly readable by screenreaders, it has proper contrast, and it works entirely without javascript. It scores 100 points in Google lighthouse's Performance and Usability tests. If you were to enable JS, you can enjoy quicker responses, more seamless updating and more smooth interaction in general.

## Copyright
Copyright by [maanlamp](https://github.com/maanlamp) under MIT.