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
  		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  		currentlyPlayingCell.html(currentlyPlayingSongNumber);
  	}
  	if (parseInt(currentlyPlayingSongNumber) !== songNumber) {
  		// Switch from Play -> Pause button to indicate new song is playing.
  		$(this).html(pauseButtonTemplate);
  		currentlyPlayingSongNumber = songNumber;
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1]
      updatePlayerBar();
  	} else if (parseInt(currentlyPlayingSongNumber) === songNumber) {
  		// Switch from Pause -> Play button to pause currently playing song.
  		$(this).html(playButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPlayButton);
  		currentlyPlayingSongNumber = null;
      currentSongFromAlbum = null;
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
  currentlyPlayingSongNumber = previousSongNumber == currentAlbum.songs.length ? 1 : previousSongNumber + 1;

  //set current song playing
  currentSongFromAlbum = currentAlbum.songs[nextSongIndex];

  //update playerbar
  updatePlayerBar();

  //update previous song's number cell with it's number
  $('.song-item-number[data-song-number="' + previousSongNumber + '"]').text(previousSongNumber)

  //update the new playing song's number cell with the pauseButtonTemplate
  $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
};

var previousSong = function(){
  //store previous song number
  var previousSongNumber = currentlyPlayingSongNumber;
  var previousSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  var nextSongIndex = previousSongIndex == 0 ? currentAlbum.songs.length - 1 : previousSongIndex - 1;

  //set current song playing
  currentlyPlayingSongNumber = previousSongNumber == 1 ? currentAlbum.songs.length : previousSongNumber - 1;
  currentSongFromAlbum = currentAlbum.songs[nextSongIndex];

  //update playerbar
  updatePlayerBar();

  //update previous song's number cell with it's number
  $('.song-item-number[data-song-number="' + previousSongNumber + '"]').text(previousSongNumber);

  //update the new playing song's number cell with the pauseButtonTemplate
  $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
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

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function(){
  var albums = [albumBlink, albumPicasso, albumMarconi]
  setCurrentAlbum(albums[0]);
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
