var RSS = require('rss');
/*
 * GET home page.
 */
var feed =  new RSS({
	    title: 'Twitbook Ahoy',
	    description: 'Twitbook transforms your facebook newsfeed into individual tweets for you',
	    feed_url: 'http://stormy-lowlands-8280.herokuapp.com/',
	    site_url: 'http://stormy-lowlands-8280.herokuapp.com/',
	    image_url: 'http://example.com/icon.png',
	    author: 'Kai Austin and Graham Hooton'
	});

var exthash = function exthash(stry){
	//Extracting a link from a string
	var fin = []
		, words = stry.replace("\r\n", " ").split(" ")
		, comp = "";

	for (var i=0; i<words.length; i++){
		var temp = words[i],
			addnext = true;

		//Making hashtag from dashed words
		if (temp.search("http") == -1){
			if (temp.search("-") != -1){
				temp = "#" + temp.replace("-", "");
			};
		};

		//Making hashtags from capital words
		if (temp.search("@") == -1){
			if (temp.search("#") == -1){
				if (temp.length > 1){
					if (temp.charAt(0) == temp.charAt(0).toUpperCase()){
						addnext = false;
						comp = comp + temp;
					}
					else{
						if (comp != ""){
							temp = "#" + comp;
						};
						addnext = true;
						comp = "";
					};

					if (comp.indexOf(".") != -1){
						if (comp != ""){
							temp = "#" + comp;
						};
						addnext = true;
						comp = "";
					};

					if (comp.indexOf(",") != -1){
						if (comp != ""){
							temp = "#" + comp;
						};
						addnext = true;
						comp = "";
					};

					if (comp.indexOf("!") != -1){
						if (comp != ""){
							temp = "#" + comp;
						};
						addnext = true;
						comp = "";
					};

					if (i == words.length - 1){
						if (comp != ""){
							temp = "#" + comp;
						};
						addnext = true;
						comp = "";
					};
				};
			};
		};


		if (addnext == true){
			fin.push(temp);
		};
	};

	var retstr = "";
	for (var i=0; i<fin.length; i++){
		retstr = retstr + " " + fin[i];
	};
	return retstr;

};

var sortString = function sortString(max, post){
	var strx = post.message.replace("\n", " ")
		, img = post.picture;

	if (strx != null){
		if (strx.length > max){
			strx = strx.substring(0, max);
			var flstop = strx.search("\n");
			if (flstop != -1){
				strx = strx.substring(0, flstop);
			}
		};

		return exthash(strx);
	}
	else{
		return "";
	};
};

var makeTweet = function makeTweet(postx){
	//RSS Feed for Tweets: name, date, 140 char message
	var maxlen = 140
		, name = "@" + postx.name.replace(' ', '')
		, messlen = maxlen - name.length - 1 //(-1) creates a space between
		, date = new Date().getTime();


	var mess = sortString(messlen, postx);

	newTweet = mess + " " + name;

	return newTweet;
};

var maketweetlist = function(req, res){
	req.facebook.api('/me/home', function(err, data) {
		var pdata = data.data;
		for (var i=0; i<pdata.length; i++){
			if (pdata.story == null){
				var nm = pdata[i].from.name
					, fid = pdata[i].id
					, mes = pdata[i].message
					, pic = pdata[i].picture;
				if (pdata[i].message != null){
					feed.items.push({
						title: makeTweet(pdata[i]),
						description: 'this is a tweet',
						url: fid, // link to the item
						date: '01-01-01' // any format that js Date can parse.
					});
				};
			};
		};
		return;
	});
};

exports.index = function(req, res){
	maketweetlist(req, res);
	var xml = feed.xml()
    res.setHeader('Content-Type', 'application/rss+xml');
    res.send(xml);
}

exports.additem = function(req, res){
	var new_tit = req.body.title;
	var new_des = req.body.description;
	var new_url = req.body.link;
	var new_dat = req.body.date;

	feed.items.push({
	    title:  new_tit,
	    description: new_des,
	    url: new_url, // link to the item
	    date: new_dat // any format that js Date can parse.
	});
    res.redirect('/')
}