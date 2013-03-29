var RSS = require('rss');
var fs = require('fs');
/*
 * GET home page.
 */
var feed =  new RSS({
	    title: 'Twitbook',
	    description: 'Twitbook transforms your facebook newsfeed into individual tweets for you',
	    feed_url: 'http://stormy-lowlands-8280.herokuapp.com/',
	    site_url: 'http://stormy-lowlands-8280.herokuapp.com/',
	    image_url: 'http://example.com/icon.png',
	    author: 'Kai Austin and Graham Hooton'
	});

exports.index = function(req, res){
	var xml = feed.xml()
	console.log(xml)
	fs.writeFile("/tmp/file.xml", xml, function(err) {
    if(err) {
        console.log(err);
    } else {

    	res.send('index', { title: 'Express', feed:xml});
        console.log("The file was saved!");
    }
  }); 
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