var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view company_view as
 select s.*, a.street, a.zip_code from company s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT a.Fname, a.Lname, r.resume_name, r.resume_id FROM resume r ' +
        'left join account a on r.account_id = a.account_id;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES ?';

    var resumeAccountData = [];
    resumeAccountData.push([params.resume_name, params.account_id]);

    connection.query(query, [resumeAccountData], function(err, result) {

        // THEN USE THE COMPANY_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO COMPANY_ADDRESS
        var resume_id = result.insertId;

        var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

        var resumeSchoolData = [];
        for(var i=0; i < params.school_id.length; i++) {
            resumeSchoolData.push([resume_id, params.school_id[i]]);
        }

        connection.query(query, [resumeSchoolData], function(err, result) {

            var query = 'insert into resume_company (resume_id, company_id) values ?';

            var resumeCompanyData = [];
            for(var i=0; i < params.company_id.length; i++) {
                resumeCompanyData.push([resume_id, params.company_id[i]]);
            }

            connection.query(query, [resumeCompanyData], function(err, result) {

                var query = 'insert into resume_skill (resume_id, skill_id) values ?';

                var resumeSkillData = [];
                for(var i=0; i < params.skill_id.length; i++) {
                    resumeSkillData.push([resume_id, params.skill_id[i]]);
                }

                connection.query(query, [resumeSkillData], function (err, result) {
                    callback(err, result);
                });
            });
        });
    });
};

exports.add = function(account_id, callback) {
    var query = 'CALL account_getinfo(?)';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};


exports.AccountInfo = function(account_id, callback) {
    var query = "CALL accounts_getinfo(?)";
    connection.query(query, [account_id], function (err, result) {
        callback(err, result);
    });
};

exports.edit = function(resume_id, callback) {
    var query = 'SELECT account_id FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result){
        if(err) {
            callback(err, null);
        }
        else {
            // Get account info from the return account_id
            exports.AccountInfo(result[0].account_id, function(err, result){

                // all values that the current account has
                // for company, school, and skill Father showed multi variable inside 1 var.
                var InfoEdit =
                    {
                        account: result[0][0],
                        account_company: result[1],
                        account_school: result[2],
                        account_skill: result[3]
                     };

                // query for the given resume_id
                var query = "CALL resume_getinfo(?)";
                connection.query(query, [resume_id], function (err, result) {
                    if (err)
                    {
                        console.log(err);
                        callback(err, null);
                    }
                    else
                    {

                        InfoEdit.resume = result[0];
                        InfoEdit.resume_company = result[1];
                        InfoEdit.resume_school = result[2];
                        InfoEdit.resume_skill = result[3];
                        callback(err, InfoEdit);
                    }
                });

            });
        }
    });
};

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';

    connection.query(query, [resume_id], function(err, result) {
        callback(err, result);
    });
};

// Father showed how to have var with how professor had it but used when

var insertCompanies = function(companies, callback) {
    var query = "INSERT INTO resume_company (resume_id, company_id) VALUES ?";
    connection.query(query, [companies], function (err, result) {
        callback(err, result);
    });
};
var insertSchools = function(schools, callback) {
    var query = "INSERT INTO resume_school (resume_id, school_id) VALUES ?";
    connection.query(query, [schools], function (err, result) {
        callback(err, result);
    });
};
var insertSkills = function(skills, callback) {
    var query = "INSERT INTO resume_skill (resume_id, skill_id) VALUES ?";
    connection.query(query, [skills], function (err, result) {
        callback(err, result);
    });
};

exports.update = function(params, callback) {

    var query =  "UPDATE resume SET resume_name = ? WHERE resume_id = ?";
    var queryData = [params.resume_name, params.resume_id];
    connection.query(query, queryData, function (err, result) {

        var resume_id = params.resume_id;

        var resumeCompanyData = [];
        // Only loop through if there are multiple resume_company's
        if (params.resume_company.constructor === Array) {
            for (var i = 0; i < params.resume_company.length; i++) {
                resumeCompanyData.push([resume_id, params.resume_company[i]]);
            }
        } else {
            resumeCompanyData.push([resume_id, params.resume_company]);
        }

        var resumeschoolData = [];
        // Only loop through if there are multiple resume_school's
        if (params.resume_school.constructor === Array) {
            for (var i = 0; i < params.resume_school.length; i++) {
                resumeschoolData.push([resume_id, params.resume_school[i]]);
            }
        } else {
            resumeschoolData.push([resume_id, params.resume_school]);
        }

        var resumeskillData = [];
        // Only loop through if there are multiple resume_skill's
        if (params.resume_skill.constructor === Array) {
            for (var i = 0; i < params.resume_skill.length; i++) {
                resumeskillData.push([resume_id, params.resume_skill[i]]);
            }
        } else {
            resumeskillData.push([resume_id, params.resume_skill]);
        }

    });
};