// Create a row for each song
var createSongRow = function(songNumber, songName, songLength){
  var template =
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="'+ songNumber +'">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;

  var $row = $(template);

  var clickHandler = function() {
  	var songNumber = parseInt($(this).attr('data-song-number'));
    var $seekBar = $('.volume .seek-bar');

  	if (currentlyPlayingSongNumber !== null) {
  		// Revert to song number for currently playing song because user started playing new song.
  		getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);
  	}
  	if (parseInt(currentlyPlayingSongNumber) !== songNumber) {
  		// Switch from Play -> Pause button to indicate new song is playing.
      $seekBar.find('.fill').width(currentVolume / 100);
      $seekBar.find('.thumb').css({left: currentVolume / 100});

  		$(this).html(pauseButtonTemplate);
  		setSong(songNumber);
      currentSoundFile.play();
      updatePlayerBar();
  	} else if (parseInt(currentlyPlayingSongNumber) === songNumber) {
  		// resume playing song

      if(currentSoundFile.isPaused()){
        currentSoundFile.play();
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
      } else { // pause the song
        currentSoundFile.pause();
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
      }
  	}
    updateSeekBarWhileSongPlays();
  };

  var onHover = function(event){
    var $songItemNumber = $(this).find('.song-item-number');
    if(parseInt($songItemNumber.attr('data-song-number')) !== parseInt(currentlyPlayingSongNumber)){
      $songItemNumber.html(playButtonTemplate);
    }
  };

  var offHover = function(event){
    var $songItemNumber = $(this).find('.song-item-number');
    if(parseInt($songItemNumber.attr('data-song-number')) !== parseInt(currentlyPlayingSongNumber)){
      $songItemNumber.text($songItemNumber.attr('data-song-number'));
    }
  };
  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

var setCurrentAlbum = function(album){
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
  }
};

var trackIndex = function(album, song){
  return album.songs.indexOf(song);
}

var nextSong = function(){
  //store previous song number
  var previousSongNumber = currentlyPlayingSongNumber;
  var previousSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  var nextSongIndex = previousSongIndex == currentAlbum.songs.length - 1 ? 0 : previousSongIndex + 1;

  //set current song playing number
  setSong(previousSongNumber == currentAlbum.songs.length ? 1 : previousSongNumber + 1);

  //update playerbar
  updatePlayerBar();

  //update previous song's number cell with it's number
  getSongNumberCell(previousSongNumber).text(previousSongNumber);
};

var previousSong = function(){
  //store previous song number
  var previousSongNumber = currentlyPlayingSongNumber;
  var previousSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  var nextSongIndex = previousSongIndex == 0 ? currentAlbum.songs.length - 1 : previousSongIndex - 1;

  //set current song playing
  setSong(previousSongNumber == 1 ? currentAlbum.songs.length : previousSongNumber - 1);
  currentSoundFile.play();
  //update playerbar
  updatePlayerBar();

  //update previous song's number cell with it's number
  getSongNumberCell(previousSongNumber).text(previousSongNumber);
};

var setSong = function(number){
  if(currentSoundFile){
    currentSoundFile.stop();
  }
  // update currentlyPlayingSongNumber to be number
  currentlyPlayingSongNumber = number;
  // update currentSongFromAlbum to be the song number passed in
  currentSongFromAlbum = currentAlbum.songs[number - 1];

  // render pause button on the song-item-number cell
  getSongNumberCell(number).html(pauseButtonTemplate);

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });

  currentSoundFile.play();
  updateSeekBarWhileSongPlays();

  setVolume(currentVolume);
};

var setVolume = function(newValue){
  if(currentSoundFile){
    currentSoundFile.setVolume(newValue);
    currentVolume = newValue;
  }
};

var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var updatePlayerBar = function(){
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist)
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var togglePlayFromPlayerBar = function(){
  //grab currently playing number cell, if any
  var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $playerBarPlayPauseButton = $('.main-controls .play-pause');
  //if currentlyPlayingCell is null, no song is playing, play first song
  if(currentSoundFile == null){
    setSong(1);
    $playerBarPlayPauseButton.html(playerBarPauseButton);
  } else { //if there is a currentSoundFile,
    //  if it's paused, play currentSoundFile, render pauseButtonTemplate
    //  in currentlyPlayingCell and playerBarPauseButton
    if(currentSoundFile.isPaused()){
      currentSoundFile.play();
      $playerBarPlayPauseButton.html(playerBarPauseButton);
      $currentlyPlayingCell.html(pauseButtonTemplate);
    } else {
      //  else, pause currentSoundFile and render play buttons, render playButtonTemplate in currentlyPlayingCell
      currentSoundFile.pause();
      $playerBarPlayPauseButton.html(playerBarPlayButton);
      $currentlyPlayingCell.html(playButtonTemplate);
    }
  }

};

var updateSeekBarWhileSongPlays = function(){
  if(currentSoundFile){
    currentSoundFile.bind('timeupdate', function(e){
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');
      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
  var offsetXPercent = seekBarFillRatio * 100; //get percentage

  offsetXPercent = Math.max(0, offsetXPercent); //make sure it isn't < 0
  offsetXPercent = Math.min(100, offsetXPercent); //make sure it isn't > 100

  var percentageString = offsetXPercent + "%";
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function(){
  var $seekBars = $('.player-bar .seek-bar'); //grab both seekbars

  $seekBars.click(function(e){
    // substract the amount to the left of the bar to the place clicked
    var offsetX = e.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    //divide the offset by the width of the bar to get fill area
    var seekBarFillRatio = offsetX / barWidth;

    updateSeekPercentage($(this), seekBarFillRatio);

    if($(this).parent().attr('class') == 'seek-control'){
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);
    }
  });

  $seekBars.find('.thumb').mousedown(function(e){
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(e){
      var offsetX = e.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      updateSeekPercentage($seekBar, seekBarFillRatio);

      if($seekBar.parent().attr('class') == 'seek-control'){
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
        setVolume(seekBarFillRatio * 100);
      }
    });

    $(document).bind('mouseup.thumb', function(){
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

var seek = function(time){
  console.log(time);
  if(currentSoundFile){
    currentSoundFile.setTime(time);
  }
}

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

//playerBar templates
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//store current song
var currentAlbum = null; //array of songs
var currentlyPlayingSongNumber = null; //index in album
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80 * 100;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

$(document).ready(function(){
  var albums = [albumBlink, albumPicasso, albumMarconi]
  setCurrentAlbum(albums[1]);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playPauseButton.click(togglePlayFromPlayerBar);

  //toggle between albums
  // var cover = document.getElementsByClassName('album-cover-art')[0];
  // var count = 0;
  // cover.addEventListener('click', function(){
  //   if(count >= albums.length - 1){
  //     count = 0;
  //   }
  //   else {
  //     count++;
  //   }
  //   setCurrentAlbum(albums[count]);
  // })
});
