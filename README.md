WaveJS
======

A tiny Javascript abstraction API over WebAudio and HTML5 audio. The library attempts to use WebAudio API if available, if not it falls back to using HTML5 Audio objects. I made this because I wanted something like [lowLag](http://lowlag.alienbill.com/) but I didn't want the Flash audio fallback. 

Use it for whatever!

## Usage

```javascript
// Loading a sound
// The first parameter is the path to the file.
// The second parameter is the name to refer to that sound by in the future.
// The third parameter is an optional callback for when the sound has been loaded.
Wave.loadSound("sounds/mysound.wav", "mysound", function()
{
  // Playing a sound
  // The first parameter is the sound name to play
  // The second parameter is an optional callback when the sound has ended.
  Wave.playSound("mysound", function()
  {
    console.log("Sound ended!");
  });
});
```
