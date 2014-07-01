(function waveInit(api)
{
  // Load a sound file
  // urls - An array of paths to sound files that will be tested for
  // browser compatibility. This way you can pass ["sound.ogg", "sound.mp3"], and
  // the format supported by the browser will be loaded. You can also just pass a single
  // string.
  // name - Name to refer to the sound by later on
  // onLoad - [Optional] Callback when the sound is loaded
  // Returns true if the sound format is supported by the browser
  api.load = function(urls, name, onLoad)
  {
    // If already loaded return immediately
    if (bufferMap[name])
    {
      onLoad && onLoad(name);
      return true;
    }

    // Find which, if any of the supplied files is playable
    if (!Array.isArray(urls))
      urls = [urls];
    var supportedIndex = getSupportedIndex(urls);

    // Load the supported file
    if (supportedIndex >= 0)
      loadSound(urls[supportedIndex], name, onLoad);
    else
    {
      onLoad && onLoad(name, "None of the specified files are supported by this browser")
      return false;
    }
  };

  // Play a sound
  // name - Name of the sound to play
  // onEnded - [Optional] Callback when the sound is finished playing
  api.play = function(name, onEnded)
  {
    if (!bufferMap[name])
      throw "Wave: Sound with name " + name + " hasn't been loaded";

    playSound(name, onEnded);
  };

  // Get audio context
  var audioContext = null;
  if (window.AudioContext)
    audioContext = new AudioContext();
  else if (window.webkitAudioContext)
    audioContext = new webkitAudioContext();

  // Map of sound names to buffers
  var bufferMap = {};

  // Dummy audio object to do compat testing
  var audioObject = new Audio();

  var loadSoundWebAudio = function(url, name, onLoad)
  {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function()
    {
      audioContext.decodeAudioData(request.response, function(buffer)
      {
        bufferMap[name] = buffer;
        if (onLoad)
          onLoad(name);
      });
    };

    request.send();
  };

  var loadSoundHTML5 = function(url, name, onLoad)
  {
    var buffer = new Audio();
    function callback()
    {
      if (bufferMap[name])
        return;
      bufferMap[name] = buffer;
      onLoad && onLoad(name);
    }
    buffer.oncanplay = callback;
    buffer.oncanplaythrough = callback;
    buffer.src = url;
  };

  var playSoundWebAudio = function(name, onEnded)
  {
    var source = audioContext.createBufferSource();
    source.buffer = bufferMap[name];
    source.connect(audioContext.destination);
    source.onended = onEnded;
    source.start(0);
  };

  var playSoundHTML5 = function(name, onEnded)
  {
    var buffer = bufferMap[name];
    buffer.onended = onEnded;
    buffer.play();
  };

  var getSupportedIndex = function(urls)
  {
    for (var i = 0; i < urls.length; ++i)
    {
      var ext = urls[i].slice(urls[i].lastIndexOf(".") + 1);
      if (audioObject.canPlayType("audio/" + ext) !== "")
        return i;
    }

    return -1;
  };

  var loadSound = audioContext ? loadSoundWebAudio : loadSoundHTML5;
  var playSound = audioContext ? playSoundWebAudio : playSoundHTML5;

})(window.Wave = window.Wave || {});