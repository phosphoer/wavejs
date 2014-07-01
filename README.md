WaveJS
======

A tiny Javascript abstraction API over WebAudio and HTML5 audio. The library attempts to use WebAudio API if available, if not it falls back to using HTML5 Audio objects. I made this because I wanted something like [lowLag](http://lowlag.alienbill.com/) but I didn't want the Flash audio fallback.

Use it for whatever!

## Usage

```javascript
// Loading a sound
// The first parameter is an array of file paths that Wave will test browser
// compatibility against. For example, in the below code, Wave will check if audio/ogg
// is supported by the browser, if not, it will check audio/mp3, and if that is supported,
// it will load the file. If none of the specified formats are compatible with the browser,
// the function will just return false, and the callback will be called with an error parameter.
// The second parameter is the name to refer to that sound by in the future.
// The third parameter is an optional callback for when the sound has been loaded.
Wave.loadSound(["sounds/mysound.ogg", "sounds/mysound.mp3"], "mysound", function(name, error)
{
  // Error checking
  if (error)
  {
    console.error(error);
    return;
  }

  // Playing a sound
  // The first parameter is the sound name to play
  // The second parameter is an optional callback when the sound has ended.
  // The callback is passed directly to audio.onended (html5) or source.onended (webaudio)
  Wave.playSound("mysound", function()
  {
    console.log("Sound ended!");
  });
});

// You can also load a sound with just a single string instead of an array
Wave.loadSound("sounds/mysound.wav", "mysound");
```
