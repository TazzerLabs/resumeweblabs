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

exports.getById = function(account_id, callback) {
    var query = 'SELECT * from account where account_id = ?';
    var queryData = [account_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO account (Fname, Lname, email) VALUES (?, ?, ?)';

    var queryData = [params.Fname, params.Lname, params.email];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.delete = function(account_id, callback) {
    var query = 'DELETE FROM account WHERE account_id = ?';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    var query = 'UPDATE account SET Fname = ?, Lname = ?, email = ? WHERE account_id = ?';
    var queryData = [params.Fname, params.Lname, params.email, params.account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

/*  Stored procedure used in this example
     DROP PROCEDURE IF EXISTS company_getinfo;

     DELIMITER //
     CREATE PROCEDURE company_getinfo (company_id int)
     BEGIN

     SELECT * FROM company WHERE company_id = _company_id;

     SELECT a.*, s.company_id FROM address a
     LEFT JOIN company_address s on s.address_id = a.address_id AND company_id = _company_id;

     END //
     DELIMITER ;

     # Call the Stored Procedure
     CALL company_getinfo (4);

 */

exports.edit = function(account_id, callback) {
    var query = 'select * from account where account_id = ?';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};