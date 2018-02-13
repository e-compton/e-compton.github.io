---
title: Coping with iOS in 100vh webapps
layout: post
category: front end
---

Working in a mobile browser there are several things that can cover the viewport, namely the url bar and the virtual keyboard. Unfortunately, Android and iOS have decided to implement how they effect the size of the viewport differently. In Android world the view-port is what the user can currently see. So as the keyboard rises from the base of the screen it pushes up the bottom of the viewport, resizing it, reducing the value of `vh`. However, in iOS land the viewport does not resize, the viewport is the screen size. When the keyboard rises it merely covers the viewport, no change in `vh`.

Now some might argue that the viewport is what is currently in view, but those people don't make these kinds of decisions at apple. So, I've been working on a messaging webapp recently and I came across this problem how do I make my footer stick to the bottom of the screen when keyboard pops up:

[gif of samsung vs iphone on resizing]

Lets rip some bandaids off:

1. There is no unit or api in css or javascript that tells you the height of what is currently in view.
2. There is no event that is fired when the keyboard appears.
3. There is no event that is fired when the keyboard disappears.

Ok... not so good a situation. We're going to have to this... manually.

But there is hope! The keyboard is in view when a text input field is in focus (even better there's only one of those in my example). So to solve problems 2 and 3 we just need to look at when my text input gains and loses focus:

```js
$('#txtInput').on('focus', () => {
  shrinkScreen()
});
$('#txtInput').on('unfocus', () => {
  growScreen()
});
```
Buuuut, if the page loads focused the keyboard won't appear until the user clicks on it. Ok, we'll listen for clicks and add some sanity checks.

```js
let shrunk = false;
$('#txtInput').on('click focus', () => {
  if (!shrunk) {
    shrunk = true;
    shrinkScreen();
  }
});
$('#txtInput').on('unfocus', () => {
  if (shrunk) {
    shrunk = false;
    growScreen()
  }
});
```

How tall is the iOS keyboard? Oh its not a consistent size across devices? Or orientation? And can even change if the user enables quick type? That's a lot of heights, a lot of heights I don't want to google. A lot of heights I don't want to write in my code and a lot of heights that I don't want to try guess which one to use. So lets go back to iOS viewport land...

What is Apple actually doing when I open the keyboard? With a little bit of detective work we can see that they are actually scrolling the `<body>` up in the `<html>`... sneaky... But that means we can work out the height of the keyboard! It scrolls the body up exactly the height of the keyboard!!

[animation of heights being printed out]

...But it doesn't do it instantly. Nor (my god) does it even do it in a consistent amount of time across devices.... Nevertheless! We shall persist!

[code block of recursive shrinkage]

When called this function will check every 10ms for 1s to see if iOS has scrolled, and if it has, it will shrink the height of the main outer div `.page`. And there you have it!

#### important notes
- This does not work in the iPhone X... for reasons that I have not investigated
- You'll have to do this in all iOS browsers not just Safari because Chrome in iOS treats the keyboard just the same.
