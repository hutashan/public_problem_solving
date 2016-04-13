
var Promise = require('promise');
var request = require('request');

/*
Global functions area for the util module
*/

function getErrorObject(){
/*
  Very silly but useful hack to extract the time and place of the error for easy peasy line and location or error tracking :)
*/
    try { throw Error('') } catch(err) { return err; }
}


/*
Extracting what we need from an error at the time of error assertion / emition
*/

function lineNumberAndFile() {
  var err = getErrorObject();
  var caller_line = err.stack.split("\n")[5];
  var index = caller_line.indexOf("at ");
  var clean = caller_line.slice(index+2, caller_line.length);

  return caller_line;
}

/*
Main module here
*/
module.exports = function(baseURL, secretToken) {
  return {
  	secretToken: secretToken,
    baseURL: baseURL,
    channels: undefined,

    /*
      Use the console but emit error / warn / debug candy
    */
  	errorlog: function() {
      var d = new Date();
      console.log(d, '*****ERROR' + lineNumberAndFile(), arguments)
    },
    log: function() {
      var d = new Date();

      console.log(d, '*****DEBUG' + lineNumberAndFile(), arguments)
    },

    /*
    Issue a simple GET request on slack api: Object.Command
    Assumes baseURL is here, along with the secret token.
    Extra safety employed on construction of URL to ensure no hanky panky
    */
    issueSimpleGETRequest: function(object, command) {
      var self = this;
      var p = new Promise(function(resolve,reject) {

        var URL = self.baseURL + object + '.' + command + '?' + 'token=' + encodeURIComponent(self.secretToken);

        /*
        Snap the main request
        */
        request.get(URL,function (err, res, body) {
          if(err) {
            reject(err);
            return;
          }
          if(res.statusCode !== 200) {
          
            reject('Something bad happened at URL ' + URL);
            return;
          }
                
          var res = JSON.parse(body);

          resolve(res);

        });
      });

      return p;
      
      
    },

    /*
    getChannel:
    will employ getChannels which caches all the channels available
    Linear search :_( eh cardinality < 1024?!  One thing to test in the next test library I make :)
    */
    getChannel: function(channelName) {
      var self = this;
      var p = new Promise(function(resolve,reject) {

        self.getChannels(false).then(function success(channels) {

          if(!channels || !channelName || channelName.length === 0) {
            reject('getChannel failed: ' + channelName);
            return;
          }

          var x,n;
          n = channels.length;

          for(x=0; x < n; x++) {
            if(channels[x].name && channels[x].name.toLowerCase() === channelName.toLowerCase()) {
              resolve(channels[x]);
              return;
            }
          }
          reject('Cannot find channel ' + channelName);
        },
        function error(e) {
          reject(e);
        })
      });

      return p;
    },


    getChannels: function(forceRefresh) {
      var self = this;
      var p = new Promise(function(resolve,reject) {
        if((!self.channels) || forceRefresh) {
          self.issueSimpleGETRequest('channels','list').then(
          function success(data) {
            if(!data.ok) {
              reject('Data is not ok');
              return;
            }
            self.channels = data.channels;
            resolve(data.channels);
          },
          function error(e) {
            reject(e);
          });
        } else {
          resolve(self.channels);
        }
        
      });
      return p;
    }
  };
};