function changeTheme(){
    const bg = document.getElementById('bg');
    const theme = document.getElementById('change_theme');
    const audio_guitar = document.getElementById('audio_guitar');
    const audio_piano = document.getElementById('audio_piano');
    if(theme.value=="Guitar"){
        theme.innerHTML='Piano';
        // (theme.firstChild).replaceData(0, -1, 'Piano');
        theme.value="Piano";
        audio_guitar.pause();
        bg.style.backgroundImage = "url(./images/piano1.jpg)"; 
    }else if(theme.value=="Piano"){
        theme.innerHTML = "Guitar";
        // (theme.firstChild).replaceData(0, -1, 'Guitar');
        theme.value="Guitar";
        audio_piano.pause();
        bg.style.backgroundImage = "url(./images/guitar0.jpg)"; 
    }
}

function menuOn(){
    const theme = document.getElementById('change_theme');
    const audio_guitar = document.getElementById('audio_guitar');
    const audio_piano = document.getElementById('audio_piano');
    const left = document.getElementById('left');
    const right = document.getElementById('right');
    if(theme.value=="Guitar"){
        left.style.display="block";
    }else if(theme.value=="Piano"){
        right.style.display="block";
    }
}

function menuOff(){
    const theme = document.getElementById('change_theme');
    const audio_guitar = document.getElementById('audio_guitar');
    const audio_piano = document.getElementById('audio_piano');
    const left = document.getElementById('left');
    const right = document.getElementById('right');
    if(theme.value=="Guitar"){
        left.style.display="none";
    }else if(theme.value=="Piano"){
        right.style.display="none";
    }
}

// guitar

function guitar_play(){
    const audio_guitar = document.getElementById('audio_guitar');
    const play = document.getElementById('guitar_play');
    const pause = document.getElementById('guitar_pause');

    audio_guitar.play();
    play.style.display = 'none';
    pause.style.display = 'block';
}

function guitar_pause(){
    const audio_guitar = document.getElementById('audio_guitar');
    const play = document.getElementById('guitar_play');
    const pause = document.getElementById('guitar_pause');

    audio_guitar.pause();
    play.style.display = 'block';
    pause.style.display = 'none';
}

function guitarStart(e){
    const audio_guitar = document.getElementById('audio_guitar');
    const playing_song = document.getElementById('playing_song_guitar');
    const play = document.getElementById('guitar_play');
    const pause = document.getElementById('guitar_pause');
    audio_guitar.setAttribute('src', `./music/${e}.mp3`)
    audio_guitar.play();
    playing_song.innerHTML=e;
    play.style.display = 'none';
    pause.style.display = 'block';
}


//piano


function piano_play(){
    const audio_piano = document.getElementById('audio_piano');
    const play = document.getElementById('piano_play');
    const pause = document.getElementById('piano_pause');

    audio_piano.play();
    play.style.display = 'none';
    pause.style.display = 'block';
}

function piano_pause(){
    const audio_piano = document.getElementById('audio_piano');
    const play = document.getElementById('piano_play');
    const pause = document.getElementById('piano_pause');

    audio_piano.pause();
    play.style.display = 'block';
    pause.style.display = 'none';
}

function pianoStart(e){
    const audio_piano = document.getElementById('audio_piano');
    const playing_song = document.getElementById('playing_song_piano');
    const play = document.getElementById('piano_play');
    const pause = document.getElementById('piano_pause');
    audio_piano.setAttribute('src', `./music/${e}.mp3`)
    audio_piano.play();
    playing_song.innerHTML=e;
    play.style.display = 'none';
    pause.style.display = 'block';
}