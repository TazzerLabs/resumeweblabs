var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal');
var account_dal = require('../model/account_dal');
var company_dal = require('../model/company_dal');

router.get('/success', function(req, res) {
    res.render('resume/resumeSuccess');
});

// View All companys
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });

});

router.get('/add/selectuser', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeAddSelectUser', {'account': result});
        }
    });
});

router.get('/add', function(req, res){
    resume_dal.add(req.query.account_id, function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeAdd', {'account_id': req.query.account_id, 'school': result[0], 'company': result[1], 'skill': result[2]});
        }
    });
});

// View the company for the given id
router.post('/insert', function(req, res){
    // simple validation
    if(req.body.resume_name == null) {
        res.send('Resume Name must be provided');
    }
    else if(req.body.school_id == null) {
        res.send('At least one school must be selected');
    }
    else if(req.body.company_id == null) {
        res.send('At least one company must be selected');
    }
    else if(req.body.skill_id == null) {
        res.send('At least one skill must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        resume_dal.insert(req.body, function(err,result) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/success');
            }
        });
    }
});

router.post('/update', function(req, res) {
    resume_dal.update(req.body, function(err, result){
        res.redirect(302, '/resume/success');
    })
});

router.get('/edit', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.edit(req.query.resume_id, function(err, result){
            res.render('resume/resumeUpdate', {resume: result[0][0], company: result[1], school: result[2], skill: result[3] });
        });
    }

});

router.get('/delete', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.delete(req.query.resume_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});


router.get('/edit', function(req, res){
    if (req.query.resume_id == null)
        res.send("A resume id is required");
    else
        resume_dal.edit(req.query.resume_id, function(err, result){
            res.render('resume/resumeUpdate', result);
        });
});

router.post('/update', function(req, res){
    if (typeof req.body.resume_id === 'undefined')
        res.send("A Resume id required");
    else {
        resume_dal.update(req.body, function (err, result) {
            if (err)
                res.send(err);
            else {
                resume_dal.edit(req.body.resume_id, function (err, result) {
                    result.was_successful = true;
                    res.render('resume/resumeUpdate', result)
                });
            }
        });
    }
});

module.exports = router;