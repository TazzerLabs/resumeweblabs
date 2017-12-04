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
    var query = 'SELECT * FROM account;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};


/*
DROP PROCEDURE IF EXISTS accounts_getinfo;
DELIMITER //
CREATE PROCEDURE accounts_getinfo(_account_id int)
BEGIN

SELECT * FROM account a WHERE a.account_id = _account_id;

SELECT c.company_name FROM account_company a_c
JOIN company c ON c.company_id = a_c.company_id
WHERE a_c.account_id = _account_id;

SELECT a_sc.*, s.school_Name FROM account_school a_sc
JOIN school s ON s.school_id=a_sc.school_id
WHERE a_sc.account_id = _account_id;

SELECT a_sk.*, sk.skill_name FROM account_skill a_sk
JOIN skill sk ON sk.skill_id=a_sk.skill_id
WHERE a_sk.account_id = _account_id;

END //
DELIMITER ;
 */

exports.getById = function(account_id, callback) {
    var query = 'CALL accounts_getinfo(?)';
    var queryData = [account_id];

    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};

exports.getAttributesForUpdate = function(callback) {
    var query = 'CALL all_companies_schools_skills()';
    connection.query(query, function(err, result){
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO account(Fname, Lname, email) VALUES (?, ?, ?)';
    var queryData = [params.Fname, params.Lname, params.email];
    connection.query(query, queryData, function(err, result){
        if (err) {
            callback(err, null);
        }
        else
            {
                //Use the inserted[tables]Id here so you can get the info and use later
            var insertedAccountId = result.insertId;
            var accountCompanyData = [];
            for (var i = 0; i < params.company_id.length; i++) {
                accountCompanyData.push([insertedAccountId, params.company_id[i]]);
            }
            var accountSchoolData = [];
            for (var i = 0; i < params.school_id.length; i++) {
                accountSchoolData.push([insertedAccountId, params.school_id[i]]);
            }
            var accountSkillData = [];
            for (var i = 0; i < params.skill_id.length; i++) {
                accountSkillData.push([insertedAccountId, params.skill_id[i]]);
            }
            var query = "INSERT INTO account_company (account_id, company_id) VALUES ?";
            connection.query(query, [accountCompanyData], function(err, result){
                if (err)
                    callback(err, null);
                else {
                    var query = "INSERT INTO account_school(account_id, school_id) VALUES ?";
                    connection.query(query, [accountSchoolData], function(err, result){
                       if (err)
                           callback(err, null);
                       else {
                           var query = "INSERT INTO account_skill(account_id, skill_id) " +
                                       "VALUES ?";
                           connection.query(query, [accountSkillData], function (err, result) {
                               callback(err, result);
                           });
                       }
                    });
                }
            });
        }
    });
};

exports.delete = function(account_id, callback) {
    var query = 'DELETE FROM account WHERE account_id = ?';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.edit = function(account_id, callback) {
    var query = 'CALL accounts_getinfo(?);';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        if (err)
            callback(err, null);
        else {
            var accountData = {
                'account': result[0],
                'account_company': result[1],
                'account_school': result[2],
                'account_skill': result[3]
            };
            var query = 'CALL all_companies_schools_skills()';
            connection.query(query, null, function(err, result){
                accountData.company = result[0];
                accountData.school = result[1];
                accountData.skill = result[2];
                callback(err, accountData);
            });
        }
    });
};

//Deletes
var deleteCompanies = function(account_id, callback) {
    var query = "DELETE FROM account_company " +
                "WHERE account_id = ?";
    connection.query(query, [account_id], function(err, result){
        callback(err, result);
    });
};
var deleteSchools = function(account_id, callback) {
    var query = "DELETE FROM account_school " +
                "WHERE account_id = ?";
    connection.query(query, [account_id], function(err, result){
        callback(err, result);
    });
};
var deleteSkills= function(account_id, callback) {
    var query = "DELETE FROM account_skill " +
                "WHERE account_id = ?";
    connection.query(query, [account_id], function(err, result){
        callback(err, result);
    });
};

// Inserts
var insertCompanies = function(companies, callback) {
    var query = "INSERT INTO account_company (account_id, company_id) VALUES ?";
    connection.query(query, [companies], function(err, result){
        callback(err, result);
    });
};
var insertSchools = function(schools, callback) {
    var query = "INSERT INTO account_school (account_id, school_id) VALUES ?";
    connection.query(query, [schools], function(err, result){
        callback(err, result);
    });
};
var insertSkills= function(skills, callback) {
    var query = "INSERT INTO account_skill (account_id, skill_id) VALUES ?";
    connection.query(query, [skills], function(err, result){
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    console.log("Update has params:\n", params);
    var query = "UPDATE account SET Fname = ?, Lname = ?, email = ?" +
                "WHERE account_id = ?";
    var accountData = [params.Fname, params.Lname, params.email, params.account_id];
    var account_id = params.account_id;
    connection.query(query, accountData, function(err, result){
        if (err)
            callback(err, null);
        else {

            var accountCompanyData = [];
            if (params.hasOwnProperty('company_id')) {
                for (var i = 0; i < params.company_id.length; i++) {
                    accountCompanyData.push([account_id, params.company_id[i]]);
                }
            }
            var accountSchoolData = [];
            if (params.hasOwnProperty('school_id')) {
                for (var i = 0; i < params.school_id.length; i++) {
                    accountSchoolData.push([account_id, params.school_id[i]]);
                }
            }
            var accountSkillData = [];
            if (params.hasOwnProperty('skill_id')) {
                for (var i = 0; i < params.skill_id.length; i++) {
                    accountSkillData.push([account_id, params.skill_id[i]]);
                }
            }

            /*
             * KNOWN BUG: if any of the categories have nothing,
             * there is a MySQL parse error, since we try INSERT INTO
             * with values of ''.
             *
             */

            //1. Delete all companies from the user
            deleteCompanies(account_id, function(err, resul) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    //2. Re-insert all selected companies
                    insertCompanies(accountCompanyData, function (err, resul) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            //3. Delete all Schools from the user
                            deleteSchools(account_id, function(err, resul) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    //4. Re-insert all selected Schools
                                    insertSchools(accountSchoolData, function (err, resul) {
                                        if (err) {
                                            console.log(err);
                                            callback(err, null);
                                        } else {
                                            //5. Delete all Skills from the user
                                            deleteSkills(account_id, function(err, resul) {
                                                if (err) {
                                                    console.log(err);
                                                    callback(err, null);
                                                } else {
                                                    //6. Re-insert all selected Skills
                                                    insertSkills(accountSkillData, function (err, resul) {
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else {
                                                            callback(null, null);
                                                        } // End of skill insertion
                                                    });
                                                } // End of skill deletion
                                            });
                                        } // End of school insertion
                                    });
                                } // end of school deletion
                            });
                        } // end of company insertion
                    });
                } // end of company deletion
            });
        } // end of account update
    });
};