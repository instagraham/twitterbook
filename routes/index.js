var RSS = require('rss');
/*
 * GET home page.
 */
var feed =  new RSS({
	    title: 'title',
	    description: 'description',
	    feed_url: 'http://example.com/rss.xml',
	    site_url: 'http://example.com',
	    image_url: 'http://example.com/icon.png',
	    author: 'Dylan Greene'
	});


exports.index = function(req, res){
	/* lets create an rss feed */

	feed.items.push({
	    title:  'fda',
	    description: 'asdf',
	    url: 'dsaf', // link to the item
	    date: 'asdf' // any format that js Date can parse.
	});
	var xml = feed.xml();
	console.log(xml)
	res.render('index', { title: 'Express', feed :xml});
};

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

	var xml = feed.xml();
	console.log(xml)
	res.render('index', { title: 'Express', feed :xml});

    res.redirect('/')
}