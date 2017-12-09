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

    connection.query(query, queryData, function(err, result) {
        if(err) {
            callback(err, null);
        }
        else {

            var query = "CALL resume_getinfo(?)";
            connection.query(query, [resume_id], function (err, result) {

                if (err)
                {
                    console.log(err);
                    callback(err, null);
                }
                else
                {

                // all values that the current account has
                // for company, school, and skill Father showed multi variable inside 1 var.
                var InfoEdit =
                    {
                        resume: result[0],
                        company: result[1],
                        school: result[2],
                        skill: result[3]
                     };
                        callback(err, InfoEdit);
                }
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

//Deletes
var deletecompany = function(resume_id, callback) {
    var query = "DELETE FROM resume_company " +
        "WHERE resume_id = ?";
    connection.query(query, [resume_id], function(err, result){
        callback(err, result);
    });
};
var deleteschools = function(resume_id, callback) {
    var query = "DELETE FROM resume_school " +
        "WHERE resume_id = ?";
    connection.query(query, [resume_id], function(err, result){
        callback(err, result);
    });
};
var deleteskills= function(resume_id, callback) {
    var query = "DELETE FROM resume_skill " +
        "WHERE resume_id = ?";
    connection.query(query, [resume_id], function(err, result){
        callback(err, result);
    });
};

// Inserts
var insertcompany = function(company, callback) {
    var query = "INSERT INTO resume_company (resume_id, company_id) VALUES ?";
    connection.query(query, [company], function(err, result){
        callback(err, result);
    });
};
var insertschools = function(schools, callback) {
    var query = "INSERT INTO resume_school (resume_id, school_id) VALUES ?";
    connection.query(query, [schools], function(err, result){
        callback(err, result);
    });
};
var insertskills= function(skills, callback) {
    var query = "INSERT INTO resume_skill (resume_id, skill_id) VALUES ?";
    connection.query(query, [skills], function(err, result){
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    console.log("Update has params:\n", params);
    var query = "UPDATE resume SET resume_name = ? " +
        "WHERE resume_id = ?";
    var resumeData = [params.resume_name, params.resume_id];
    var resume_id = params.resume_id;
    connection.query(query, resumeData, function(err, result){
        if (err)
            callback(err, null);
        else {

            var resumecompanyData = [];
            if (params.company_id != null) {
                for (var i = 0; i < params.company_id.length; i++) {
                    resumecompanyData.push([resume_id, params.company_id[i]]);
                }
            }
            var resumeschoolData = [];
            if (params.school_id != null) {
                for (var i = 0; i < params.school_id.length; i++) {
                    resumeschoolData.push([resume_id, params.school_id[i]]);
                }
            }
            var resumeskillData = [];
            if (params.skill_id != null) {
                for (var i = 0; i < params.skill_id.length; i++) {
                    resumeskillData.push([resume_id, params.skill_id[i]]);
                }
            }

            /*
             * KNOWN BUG: if any of the categories have nothing,
             * there is a MySQL parse error, since we try INSERT INTO
             * with values of ''.
             *
             */

            //1. Delete all company from the user
            deletecompany(resume_id, function(err, resul) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    //2. Re-insert all selected company
                    insertcompany(resumecompanyData, function (err, resul) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            //3. Delete all schools from the user
                            deleteschools(resume_id, function(err, resul) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    //4. Re-insert all selected schools
                                    insertschools(resumeschoolData, function (err, resul) {
                                        if (err) {
                                            console.log(err);
                                            callback(err, null);
                                        } else {
                                            //5. Delete all skills from the user
                                            deleteskills(resume_id, function(err, resul) {
                                                if (err) {
                                                    console.log(err);
                                                    callback(err, null);
                                                } else {
                                                    //6. Re-insert all selected skills
                                                    insertskills(resumeskillData, function (err, resul) {
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
        } // end of resume update
    });
};