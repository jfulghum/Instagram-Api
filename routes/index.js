const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const superagent = require('superagent')

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */
router.get('/', function(req, res){
	var data = {
		text: 'Hello from WeWork!',
		firstName: 'LeBron',
		lastName: 'James'
	}
	res.render('index', data)
})

router.get('/:page', function(req, res){
	var page = req.params.page
	var user = req.query.user
	if (user == null){
		res.json({
			confirmation: 'fail',
			message: 'Please enter a user query parameter!'
		})
		return
	}
	if (page == 'instagram'){
		//make API call to
		superagent.get('https://www.instagram.com/' + user + '/?__a=1')
		.query(null)
		.set('Accept', 'application/json')
		.end((err,response) => {
			if(err){
				res.json({
					confirmation: 'fail',
					message: err.message
				})
				return
			}
			const data = response.body || response.text
			// const feed = data.user.media.nodes
			let feed = []
			data.user.media.nodes.forEach((post, i) => {
				feed.push({
					image: post.thumbnail_src,
					caption: post.caption
				})
			})
			// res.json({
			// 	feed: feed
			// })
			res.render('instagram', {feed: feed})
			return
		})
		return
	}
	res.json({
		confirmation:'success',
		page: page
	})
})

module.exports = router
