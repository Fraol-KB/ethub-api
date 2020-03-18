module.exports = function(app){
    const User = app.models.User;

   
    User.remoteMethod('getUser', {
        accepts: [
            {arg: 'req', type: 'object', required: true, http: {source: 'req'}}
        ],
        returns: {arg: 'user', type: 'object', root: true},
        http:    {verb: 'post', path: '/getUser'}
    });

    User.getUser = function(req,cb){
        var currentUser = null;

  // Retrieve the access token used in this request
       
        var AccessTokenModel = app.models.AccessToken;
        AccessTokenModel.findForRequest(req, {}, function (err, token) {
            console.log("request body:",req);
            if (err) return cb(null,err);
            if ( ! token) return cb("token not set",null); // No need to throw an error here

            // Logic borrowed from user.js -> User.logout() to get access token object
            // var UserModel = app.models.User;
            User.relations.accessTokens.modelTo.findById(token.id, function(err, accessToken) {
            if (err) return cb(null,err);
            if ( ! accessToken) return cb(null,'could not find the given token');

            // Look up the user associated with the access token
            User.findById(accessToken.userId, function (err, user) {
                if (err) return cb(null,err);
                if ( ! user) return cb(null,'could not find a valid user with the given token');

                currentUser = user;
                cb(null, currentUser);
            });

            });
        });

    }
    // User.getUser = Bluebird.promisify(function methodName(req, cb) {
    //     var context            = loopback.getCurrentContext();
    //     var currentUser        = req.accessToken && req.accessToken.currentUser || context && context.get('currentUser');
    //     console.log(currentUser)
    // });


}