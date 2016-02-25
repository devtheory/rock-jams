// Example Album
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};

// Another Example Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

//my custom album
var albumBlink = {
  title: 'Enema of the State',
  artist: 'Blink-182',
  label: 'Interscope',
  year: '1999',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [
      { title: 'Whats my age again?', duration: '3:01' },
      { title: 'Dumpweed', duration: '5:01' },
      { title: 'Going Away to College', duration: '3:21'},
      { title: 'All the Small Things', duration: '3:14' },
      { title: 'The Rock Show', duration: '2:15'}
  ]
};
// Create a row for each song
var createSongRow = function(songNumber, songName, songLength){
  var template =
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="'+ songNumber +'">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;

  return $(template);
};

var setCurrentAlbum = function(album){

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

var findParentByClassName = function(element, targetClassName){
  if(element){
    var currentParent = element.parentElement;
    if(currentParent === null){
      alert("No parent found");
      return;
    }
    while(currentParent.className != targetClassName){
      currentParent = currentParent.parentElement;
    }
    if(currentParent === null){
      alert("No parent found with that class name");
      return;
    }
    return currentParent;
  }
};

var getSongItem = function(element){
  switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element, 'song-item-number');
    case 'album-view-song-item':
      return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number':
      return element;
    default:
      return;

  }
};

var clickHandler = function(targetElement){
  //grab the song item number row
  var songItem = getSongItem(targetElement);
  var dataSongNumberForSongItem = songItem.getAttribute('data-song-number');

  if(currentlyPlayingSong === null){ //if no song is playing
    songItem.innerHTML = pauseButtonTemplate; //make this row play
    currentlyPlayingSong =  dataSongNumberForSongItem//store song number playing
  } else if(currentlyPlayingSong === dataSongNumberForSongItem){ //if there is a song playing and it's the one you clicked on
    songItem.innerHTML = playButtonTemplate; //render the play button
    currentlyPlayingSong = null //stop playing music
  } else if(currentlyPlayingSong !== dataSongNumberForSongItem){ //if you were playing a song and clicked on another song to play
    var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong +'"]') //grab the song item element
    currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number'); //set the number as a data attribute
    songItem.innerHTML = pauseButtonTemplate; //render the pause button template
    currentlyPlayingSong = dataSongNumberForSongItem; //store the current song number
  }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

//store current song
var currentlyPlayingSong = null;

window.onload = function(){
  var albums = [albumBlink, albumPicasso, albumMarconi]
  setCurrentAlbum(albums[0]);

  songListContainer.addEventListener('mouseover', function(event){

    if(event.target.parentElement.className === 'album-view-song-item'){

      var songItem = getSongItem(event.target);

      if(songItem.getAttribute('data-song-number') !== currentlyPlayingSong){
        songItem.innerHTML = playButtonTemplate;
      }
    }
  });

  //add mouseleave listeners to all song rows
  for(var i = 0 ; i < songRows.length ; i++){
    songRows[i].addEventListener('mouseleave', function(event){
      //grab first child and grab attribute value for song number

      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');

      if(songItemNumber !== currentlyPlayingSong){
        songItem.innerHTML = songItemNumber;
      }
    });
    songRows[i].addEventListener('click', function(event){
      //click handler for song playing
      clickHandler(event.target);
    });
  }

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
};
