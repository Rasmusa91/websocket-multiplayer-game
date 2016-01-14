Sound = (function() {
    var private, Sound = {};

    Sound.sounds = {
        "natureAmbient" : (new Audio("http://www.student.bth.se/~raap11/DV1483/kmom06/exercises/kmom05/game/sound/nature_ambient.wav")),
        "closeDoor" : (new Audio("http://www.student.bth.se/~raap11/DV1483/kmom06/exercises/kmom05/game/sound/door_close.wav")),
        "openDoor" : (new Audio("http://www.student.bth.se/~raap11/DV1483/kmom06/exercises/kmom05/game/sound/door_open.wav")),
        "explosion" : (new Audio("http://www.student.bth.se/~raap11/DV1483/kmom06/exercises/kmom05/game/sound/explosion.wav")),
        "footstep" : (new Audio("http://www.student.bth.se/~raap11/DV1483/kmom06/exercises/kmom05/game/sound/foot_step.wav")),
        "smash" : (new Audio("http://www.student.bth.se/~raap11/DV1483/kmom06/exercises/kmom05/game/sound/smash.wav")),
        "bloodsplat" : (new Audio("http://www.student.bth.se/~raap11/DV1483/kmom06/exercises/kmom05/game/sound/blood_splat.wav"))
    };

    Sound.play = function(sound, loop)
    {
        if(loop) {
            Sound.sounds[sound].addEventListener("ended", function() {
                this.currentTime = 0;
                this.play();
            });
        }

    //    Sound.sounds[sound].currentTime = 0;
        Sound.sounds[sound].play();
    };

    Sound.stop = function(sound)
    {
        Sound.sounds[sound].pause();
    };

    return Sound;
})();
