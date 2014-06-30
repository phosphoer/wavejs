(function waveInit(api)
{
  // Load a sound file
  // url - Path or url to the sound file
  // name - Name to refer to the sound by later on
  // onLoad - [Optional] Callback when the sound is loaded
  api.loadSound = function(url, name, onLoad)
  {
    if (bufferMap[name])
    {
      onLoad && onLoad(name);
      return;
    }

    loadSound(url, name, onLoad);
  };

  // Play a sound
  // name - Name of the sound to play
  // onEnded - [Optional] Callback when the sound is finished playing
  api.playSound = function(name, onEnded)
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

  var loadSound = audioContext ? loadSoundWebAudio : loadSoundHTML5;
  var playSound = audioContext ? playSoundWebAudio : playSoundHTML5;

})(window.Wave = window.Wave || {});