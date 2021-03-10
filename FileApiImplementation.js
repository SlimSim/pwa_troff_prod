var cacheImplementation = {
	nameOfCache : "songCache-v1.0",

	saveSong : async function( songKey, songData ) {
		var blob = new Blob([ JSON.stringify(songData) ], { type : 'application/json' }),
			init = { "status" : 200 , "statusText" : "SuperSmashingGreat!" },
			myResponseObject = new Response( blob, init );

		return caches.open( this.nameOfCache ).then(  cache => {
			return cache.put( songKey, myResponseObject );
		} );
	},

	getSong : async function( songKey ) {
		return caches.match(songKey).then(cachedResponse => {
			if (cachedResponse === undefined) {
				throw new Error(`songKey "${songKey}" does not exist in caches!`);
			}
			return cachedResponse.json();
		});
	},

	removeSong : async function( songKey ) {
		return caches.open( this.nameOfCache ).then(  cache => {
			return cache.delete( songKey );
		} );
	},

	getAllKeys : async function() {
		return caches.open( this.nameOfCache ).then( cache => {
			return cache.keys().then( keys =>
				keys.map( key => decodeURIComponent( key.url.split("/").pop() ) )
			);
		});
	}
},

musicPlayer = {
	handleFileSelect_new_spring_boot: function(files /*FileList object*/ , callbackFunk) {
		console.log("****** handleFileSelect ->");
		var i, f;
		//	        files = evt.target.files; // FileList object

		// Loop through the FileList and render the files as appropriate.
		for (i = 0, f; f = files[i]; i++) {

			// Only process image files.
			if (f.type.match('image.*') || f.type.match('audio.*') || f.type.match('video.*')) {
				// old: musicPlayer.processFile(f, callbackFunk);
				fileHandler.saveFile(f, callbackFunk);
			} else {
				console.error("handleFileSelect2: unrecognized type! f: ", f);
			}
		}
	},
	
	handleFileSelect : function(evt) {
		console.log( "DEPRECATED handleFileSelect" );
		console.log( "****** handleFileSelect ->");
    var i, f,
    	files = evt.target.files; // FileList object

    // Loop through the FileList and render the files as appropriate.
    for ( i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if ( f.type.match('image.*') || f.type.match('audio.*' ) || f.type.match('video.*' ) ) {
        musicPlayer.processFile( f );
      } else {
      	console.error( "handleFileSelect: unrecognized type! f: ", f );
      }
    }
  },

	processFile : function( f ) {
		console.log( "DEPRECATED processFile" );
		var self = this,
			reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = async function(e) {
			try{
				await cacheImplementation.saveSong( f.name, e.target.result );
			} catch (exeption) {
				alert( "Could not add file to cache" );
				return;
			}

			self.createMusicButton( f.name );
		};

		// Read in the audio file as a data URL.
		reader.readAsDataURL( f );
	},

	loadAllFiles : function() {
		console.log( "DEPRECATED loadAllFiles" );
		cacheImplementation.getAllKeys().then( keys => {
			keys.forEach( key => {
				this.createMusicButton( key );
			});
	  });
	},

	createSongAudio : async function( event ) {
		console.log( "DEPRECATED createSongAudio" );
		var path = $(event.target).val(),
			songData = await cacheImplementation.getSong( path );

		setSong2( path, "audio", songData );

		//var audio = $("<audio>").attr( "src", songData ).attr( "controls", true );
		//$("#playerParent").empty().append( audio );
	},

	createMusicButton : function( key ) {
		console.log( "DEPRECATED createMusicButton" );
		//varför måste denna vänta LITE? kan jag få ett event när det är ok att köra?
		//setTimeout( function() {
			addItem_NEW_2( key );
		//}, 50 );
		//$("#pwa-song-list").append($("<span>").append( 
		//	$("<input>").attr("type", "button").attr("value", key )
		//		.on( "click", this.createSongAudio )
		//));
	}
};

$( document ).ready( function() {
	// Check for the various File API support.
	if( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
	  alert('The File APIs are not fully supported in this browser.\nPlease use FireFox, Chrome or another modern browser.');
	}

  $( "#fileUpploader" ).on( "change", musicPlayer.handleFileSelect );

  musicPlayer.loadAllFiles();

});
