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

        var query = 'insert into resume_school (resume_id, school_id) values ?';

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

exports.edit = function(resume_id, callback) {
    var query = 'CALL account_getinfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
/*
exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
*/