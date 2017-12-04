var express = require('express');
var router = express.Router();
var skill_dal = require('../model/skill_dal');


// View All companys
router.get('/all', function(req, res) {
    skill_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('skill/skillViewAll', { 'result':result });
        }
    });

});

// View the company for the given id
router.get('/', function(req, res){
    if(req.query.skill_id == null) {
        res.send('skill_id is null');
    }
    else {
        skill_dal.getById(req.query.skill_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('skill/skillViewById', {'result': result});
           }
        });
    }
});

// Return the add a new company form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    skill_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('skill/skillAdd', {'account': result});
        }
    });
});

// View the company for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.skill_name == null) {
        res.send('Skill Name must be provided.');
    }
    else if(req.query.description == null) {
        res.send('description must be provided. ');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        skill_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/skill/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.skill_id == null) {
        res.send('An skill id is required');
    }
    else {
        skill_dal.edit(req.query.skill_id, function(err, result){
            res.render('skill/skillUpdate', {'skill': result[0] });
        });
    }

});

router.get('/update', function(req, res) {
    skill_dal.update(req.query, function(err, result){
       res.redirect(302, '/skill/all');
    });
});

// Delete a company for the given company_id
router.get('/delete', function(req, res){
    if(req.query.skill_id == null) {
        res.send('skill_id is null');
    }
    else {
         skill_dal.delete(req.query.skill_id, function(err, result){
             if(err) {
                 res.send(err);
             }
             else {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/skill/all');
             }
         });
    }
});

module.exports = router;
