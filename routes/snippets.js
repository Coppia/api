var express = require('express');
var jwt    = require('jsonwebtoken'); 

var router = express.Router();

router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    var secret = req.app.get('jwtkey');

    // verifies secret and checks exp
    jwt.verify(token, secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

// GET ALL SNIPPET - will probably be never used in codeS
router.get('/', function(req, res, next) {
    try {
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            }
            else {
                conn.query('SELECT id, text, interview_id, create_user, create_datetime, update_user, update_datetime FROM snippets', function(err, rows, fields) {
                    if (err) {
                        console.error('SQL Error: ', err);
                        return next(err);
                    }
                    res.json(rows);
                });
            }
        });
    }
    catch(ex) {
        console.error("Internal error: ", ex);
        return next(ex);
    }
});


// GET SNIPPETS BY :id
router.get('/:snippet_id', function(req, res, next) {
    try {
        var request = req.params;
        var snippet_id = request.snippet_id;

        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            }
            else {
                conn.query('SELECT id, text, interview_id, create_user, create_datetime, update_user, update_datetime FROM snippets WHERE id = ?', snippet_id, function(err, rows, fields) {
                    if (err) {
                        console.error('SQL Error: ', err);
                        return next(err);
                    }
                    res.json(rows);
                });
            }
        });
    }
    catch(ex) {
        console.error("Internal error: ", ex);
        return next(ex);
    }
});

// CREATE SNIPPET BY INTERVIEW ID
router.post('/', function(req, res, next) {
    try {
        var currdatetime = new Date();
        var request = req.body;

        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection Error: ', err);
                return next(err);
            }
            else {
                var insertSql = "INSERT INTO snippets SET ?";
                var insertValues = {
                    "text" : request.text,
                    "interview_id" : request.interview_id,
                    "create_user" : request.create_user,
                    "create_datetime" : currdatetime,
                    "update_user" : request.create_user,
                    "update_datetime" : currdatetime
                };

                var query = conn.query(insertSql, insertValues, function(err, result) {
                    if (err) {
                        console.error('SQL Error: ', err);
                        return next(err);
                    }

                    var snippet_id = result.insertId;
                    res.json({"snippet_id":snippet_id});
                });
            }
        });
    }
    catch(ex) {
        console.error('Internal Error: ' + ex);
        return next(ex);
    }
});

// UPDATE SNIPPETS BY snippet_id
router.put('/:snippet_id', function(req, res, next) {
    try {
        var currdatetime = new Date();
        var snippet_id = req.params.snippet_id;
        var request = req.body;

        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection Error: ', err);
                return next(err);
            }
            else {
                var updateSql = "UPDATE snippets SET ? WHERE ?";
                var updateValues = {
                    "text" : request.text,
                    "update_user" : request.update_user,
                    "update_datetime" : currdatetime
                };
                var whereValue = {
                    "id" : snippet_id
                };

                var query = conn.query(updateSql, [updateValues, whereValue], function(err, result) {
                    if (err) {
                        console.error('SQL Error: ', err);
                        return next(err);
                    }
                    res.json(result);
                });
            }
        });
    }
    catch(ex) {
        console.error('Internal Error: ' + ex);
        return next(ex);
    }
});

//DELETE SNIPPETS BY snippet_id
router.delete('/:snippet_id', function(req, res, next) {
    try {
        var currdatetime = new Date();
        var snippet_id = req.params.snippet_id;
        var request = req.body;

        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection Error: ', err);
                return next(err);
            }
            else {
                var deleteSql1 = "DELETE FROM idea_snippet WHERE ?";
                
                var whereValue = {
                    "snippet_id" : snippet_id
                };

                var query = conn.query(deleteSql1, whereValue, function(err, result) {
                    if (err) {
                        console.error('SQL Error: ', err);
                        return next(err);
                    }

                    var deleteSql2 = "DELETE FROM snippets WHERE ?";
                
                    var whereValue = {
                        "id" : snippet_id
                    };

                    var query2 = conn.query(deleteSql2, whereValue, function(err, result) {
                        if (err) {
                            console.error('SQL Error: ' + err);
                            return next(err);
                        }

                        res.json(result);
                    });
                });
            }
        });
    }
    catch(ex) {
        console.error('Internal Error: ' + ex);
        return next(ex);
    }
});

module.exports = router;
