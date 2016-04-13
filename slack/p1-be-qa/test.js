
/*
Joshua Teitelbaum 4/12/2016
Testing the Slack FILE API
*/

var assert = require('assert');
var Promise = require('promise');
var request = require('request');

/*
Secret key never stored in source code, and only is accessible through configuration files not in any RCS
*/
var secretToken = process.env.SLACK_SECRET_TOKEN;


/*
Switchable environment qa.slack.com/api, devint.slack.com/api, or default slack.com/api/
*/
var baseURL = process.env.SLACK_API_BASEURL;



/*
If the base URL is not set assume we're testing PROD!
!YOLO! :)
*/
if(!baseURL) {
	baseURL = "https://slack.com/api/";
}
var util = require('./util.js')(baseURL, secretToken);


describe('Test suite to test Slack 3 API Endpoints: files.upload, files.list, files.delete', function() {

/*
Library setup and initialization:
*/

/*
Never store keys in source code!  Only in configuration where access can/should be limited!
*/
	describe('Library initialization for testing the file suite', function() {

		it('Has tokens initialized', function(done) { 
			if(!secretToken) {
				assert(1==2,'could not get initialize secret token not defined!');
			}
			done();
		});

		it('Can load channels', function(done) {
			util.getChannels().then( function success(channels) {
				
				assert(channels);
				channels =
				done();
			},
			function error(e) {
				util.errorlog('Met error!',e);
				assert(1==2,'Could not resolve channels');
				done();
			});
		});
		it('Can load find general channel', function(done) {
			util.getChannel('general').then( function success(channel) {
				
				assert(channel);
				done();
			},
			function error(e) {
				util.errorlog('Met error!',e);
				assert(1==2,'Could not resolve channel general');
				done();
			});
		});
	});
	
});