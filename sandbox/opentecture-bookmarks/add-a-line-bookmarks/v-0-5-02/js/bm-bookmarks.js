/* global FOB, TAG, BLBF, crypto */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const BM = {

	"copyright": "Copyright 2019 Opetecture authors. MIT License",
	"date": "2019-06-23",
	"description": "Display data of bookmark selected from left menu or drag & drop a link into this box",
	"version": "0.5.01-2bm",

};



BM.onLoad = function() {

	BM.jsonLines = [];

	BM.lines = FOB.text.split(/\r\n|\n/);

	for ( let line of BM.lines ) {
		//console.log( 'line', line );

		if ( line.slice( 0, 1 ) !== "{" ) { continue; }

		const jsonl = JSON.parse( line );
		//console.log( 'jsonl', jsonl );

		BM.jsonLines.push( jsonl );

	}
	//console.log( 'BM.jsonLines', BM.jsonLines.length );

	BM.setBookmarks();


};



BM.setBookmarks = function ( bookmarks = BM.jsonLines ) {

	const a = document.createElement( 'a' );
	const subdomains = ["www.", "m.", "en." ];

	htm = `<h1>Bookmarks from: ${ FOB.urlDefaultFile }</h1>`;

	const comments = BM.lines.filter( line => line.includes( `"type":"comment"` ) );
	//console.log( 'comments', comments );

	BM.comments = comments.map( comment => JSON.parse( comment ) ) || [];

	bookmarks.forEach( (bookmark ) => {

		if ( bookmark.type === "url" ) {

			a.href = bookmark.url;
			let site = a.hostname;

			const subdomain = subdomains.filter( bit => site.startsWith( bit ) === true );
			//console.log( 'subdomain', subdomain );

			site = site.replace ( subdomain, "" );
			//console.log( 'site', site );

			const comment = BM.comments.find( comment => comment.bookmarkId === bookmark.id ) || "";
			//console.log( 'comment', comment );

			index = BM.jsonLines.findIndex( line => line.id === bookmark.id );

			htm +=
			`<p>
				 <a href=${bookmark.url } target="_blank" >
					 <img src="${ bookmark.favicon }" height=16px >
					<b>${ bookmark.name }</b> - <i>${ site }</i>
				</a><br>
				tags: <i>${ bookmark.tags }</i> - added: ${ bookmark.dateAdd.slice( 0, 10 ) }<br>
				${ bookmark.description.startsWith ("No description" ) ? "" : bookmark.description }
				<p style=color:blue ><button onclick="BM.setContents(${ index });" >edit</button>
				${ comment.text ? ( "comment: " + comment.text + " tags: " + comment.tags ) : "" }</p>
				<hr>
			</p>`;

		}

	});

	divContents.innerHTML = htm;

};



BM.xxxgetBookmarks = function () {
	//console.log( '', FOB.text );

	BM.lines = FOB.text.split(/\r\n|\n/);

	BM.jsonLines = [];

	for ( let line of BM.lines ) {
		//console.log( 'line', line );

		if ( line.slice( 0, 1 ) !== "{" ) { continue; }

		const jsonl = JSON.parse( line );
		//console.log( 'jsonl', jsonl );

		BM.jsonLines.push( jsonl );

	}

	const comments = BM.lines.filter( line => line.includes( `"type":"comment"` ) );
	//console.log( 'comments', comments );

	BM.comments = comments.map( comment => JSON.parse( comment ) ) || [];

	//BM.setBookmarks();

	BBF.setMenuItemsByUrl();

};



//////////

BM.setContents = function ( index ) {

	const htm =
	`
	<div id=BMdivBookmark></div>

	<div id=BMEdivBookmarkEdit></div>

	<div id=BMNdivBookmarkNew ></div>

	<div id=COMdivCommentAdd ></div>

	<div id=TGAdivTagsAdd ></div>

	<div id=TAGdivTagSets ></div>
	`;

	divContents.innerHTML = htm;

	//BMdivBookmark.innerHTML = BM.getBookmarksData();

	BMNdivBookmarkNew.innerHTML = BMN.getMenuBookmarkNew();

	BMEdivBookmarkEdit.innerHTML = BME.getMenuBookmarkEdit();

	COMdivCommentAdd.innerHTML = COM.getMenuCommentAdd();

	TGAdivTagsAdd.innerHTML = TGA.getMenuTagsAdd();

	TAGdivTagSets.innerHTML = TAG.getMenuTagSets();


	BM.parseJson( index );

	BMNdivDrop.addEventListener( "input", BMN.onInput, false);

};



BM.parseJson = function( index ) {

	BMdivBookmark.innerHTML = BM.getBookmarksData();

	const bookmark = BM.bookmark = BM.jsonLines[ index ];
	//console.log( 'bookmark', bookmark );

	BMinpUrl.value = bookmark.url;
	BMinpName.value = bookmark.name;
	BMinpDateAdd.value = bookmark.dateAdd;
	BMinpDateUpdate.value = bookmark.dateUpdate;
	BMinpId.value = bookmark.id;
	BMinpType.value = bookmark.type;
	BMinpImages.value = bookmark.images || "";
	BMinpFavicon.value = bookmark.favicon;
	BMinpTags.value = bookmark.tags;
	BMtxtDescription.value = bookmark.description;

	BMdivUrl.innerHTML = `<a href="${  bookmark.url }" target="_blank"><img src="${ bookmark.favicon }" height=32></a>`;

	BM.comments = BM.lines.filter( line => line.includes( bookmark.id ) && line.includes( `"type":"comment"` ) );

	//console.log( 'comments', BM.comments );

	if ( BM.comments.length ) {

		const comment = JSON.parse( BM.comments[ 0 ] );
		console.log( 'comment', comment );

		BMtxtComment.value =
		`comment: ${ comment.text }\n\ntags: ${ comment.tags }`;

	} else {

		BMtxtComment.value = "";

	}

	BMEtxtJson.value = "";
	COM.onToggle();

};



BM.getBookmarksData = function() {

	const htm =
	`
		<details open >

			<summary>Bookmark ~ BM V ${ BM.version } ~ ${ BM.date }</summary>

			<p contenteditable=true id="BMNdivDrop" title="Drag a URL into this area" data-text="${ BM.description }" ></p>

			<div class=container >

				<div id=BMdivUrl >url </div><div><input id=BMinpUrl ></div>

				<div>name </div><div><input id=BMinpName ></div>

			</div>

			<div class=container4 >

				<div>date add </div><div><input id=BMinpDateAdd ></div>

				<div>update </div><div><input id=BMinpDateUpdate ></div>

				<div>id </div><div><input id=BMinpId ></div>

				<div>type </div><div><input id=BMinpType ></div>

			</div>

			<div class=container >

				<div>images </div><div><input id=BMinpImages ></div>

				<div>favicon </div><div><input id=BMinpFavicon ></div>

				<div>tags </div><div><input id=BMinpTags ></div>

				<div>description </div><div><textarea id=BMtxtDescription ></textarea></div>

				<div>comment </div><div><textarea id=BMtxtComment onclick=alert("not here"); placeholder="No editing here. Use 'Comment add/edit'" ></textarea></div>

			</div>

		</details>
	`;

	return htm;

};



/////////

BM.uuidv4 = function() {

	return ( [ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11 ).replace( /[018]/g, c =>
		( c ^ crypto.getRandomValues( new Uint8Array( 1 )  )[ 0 ] & 15 >> c / 4 ).toString( 16 )
	);

};



BM.butSaveFile = function() {

	const name = FOB.name;
	const blob = new Blob( [ BM.lines.join( "\n" ) ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = name;
	a.click();
	a = null;

};