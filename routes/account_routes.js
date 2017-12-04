var express = require('express');
var router = express.Router();
var account_dal = require('../model/account_dal')

router.get('/all', function(req, res) {
    account_dal.getAll(function(err, result) {
        if (err)
            res.send(err);
        else
            res.render('account/accountViewAll', {'result': result})
    });
});

router.get('/', function(req, res){
    if (req.query.account_id == null)
        res.send('account_id is null');
    else {
        account_dal.getById(req.query.account_id, function(err, result) {
           if (err)
               res.send(err);
           else {

               var account_data =
                   {
                   'account': result[0][0],
                   'account_company': result[1],
                   'account_school': result[2],
                   'account_skill': result[3]
                    };
               res.render('account/accountViewByID', account_data);
           }
        });
    }

});

router.get('/add', function(req, res) {
    account_dal.getAttributesForUpdate(function(err, result) {
       if (err)
           res.send(err);
       else
           {
           var companySchoolsSkills =
               {
               'company': result[0],
               'school': result[1],
               'skill': result[2]
               };

           res.render('account/accountAdd', companySchoolsSkills);

            }
    });
});

router.get('/insert', function(req, res) {
    var accountData =
        {
        'Fname': req.query.Fname,
        'Lname': req.query.Lname,
        'email': req.query.email,
        'school_id': req.query.school_id,
        'company_id': req.query.company_id,
        'skill_id': req.query.skill_id
        };
    account_dal.insert(accountData, function(err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else
            res.redirect(302, '/account/all');
    });
});

router.get('/edit', function(req, res) {
   if (req.query.account_id == null)
       res.send('A company id is required');
   else {
       account_dal.edit(req.query.account_id, function(err, result) {
           res.render('account/accountUpdate', result);
       });
   }
});

router.get('/update', function(req, res) {
    account_dal.update(req.query, function(err, result) {
        res.redirect(302, "/account/all");
    });
});

router.get('/delete', function(req, res) {
    if (req.query.account_id == null)
        res.send('account_id is null');
    else {
        account_dal.delete(req.query.account_id, function(err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else
                res.redirect(302, '/account/all');
        });
    }
});

module.exports = router;