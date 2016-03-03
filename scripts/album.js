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

  	if (currentlyPlayingSongNumber !== null) {
  		// Revert to song number for currently playing song because user started playing new song.
  		getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);
  	}
  	if (parseInt(currentlyPlayingSongNumber) !== songNumber) {
  		// Switch from Play -> Pause button to indicate new song is playing.
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
  getSongNumberCell(previousSongNumber).text(previousSongNumber)
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

  setVolume(currentVolume);
};

var setVolume = function(newValue){
  if(currentSoundFile){
    currentSoundFile.setVolume(newValue);
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
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function(){
  var albums = [albumBlink, albumPicasso, albumMarconi]
  setCurrentAlbum(albums[1]);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong)

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
