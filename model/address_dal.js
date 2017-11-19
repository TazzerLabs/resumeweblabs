var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM address;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(address_id, callback) {
    var query = 'SELECT * from address where address_id = ?';
    var queryData = [address_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO address (street, zip_code) VALUES (?, ?)';

    var queryData = [params.street, params.zip_code];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.delete = function(address_id, callback) {
    var query = 'DELETE FROM address WHERE address_id = ?';
    var queryData = [address_id];

    connection.query(query, address_id, function(err, result) {
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    var query = 'UPDATE address SET street = ?, zip_code = ? WHERE address_id = ?';
    var queryData = [params.street, params.zip_code, params.address_id];

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

exports.edit = function(address_id, callback) {
    var query = 'select * from address where address_id = ?';
    var queryData = [address_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};