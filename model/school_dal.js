var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view school_view as
 select s.*, a.street, a.zip_code from school s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM school;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(school_id, callback) {
    var query = 'SELECT c.*, a.street, a.zip_code FROM school c ' +
        'LEFT JOIN school_address ca on ca.school_id = c.school_id ' +
        'LEFT JOIN address a on a.address_id = ca.address_id ' +
        'WHERE c.school_id = ?';
    var queryData = [school_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback)
{

    // FIRST INSERT THE school
    var query = 'INSERT INTO school (school_Name) VALUES (?)';

    var queryData = [params.school_Name];

    connection.query(query, params.school_Name, function(err, result)
    {

        // THEN USE THE school_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO school_ADDRESS
        var school_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO school_address (school_id, address_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var schoolAddressData = [];
        for(var i=0; i < params.address_id.length; i++) {
            schoolAddressData.push([school_id, params.address_id[i]]);
        }

        // NOTE THE EXTRA [] AROUND schoolAddressData
        connection.query(query, [schoolAddressData], function(err, result){
            callback(err, result);
        });
    });

};

exports.delete = function(school_id, callback) {
    var query = 'DELETE FROM school WHERE school_id = ?';
    var queryData = [school_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var schoolAddressInsert = function(school_id, addressIdArray, callback)
{

    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO school_address (school_id, address_id) VALUES ?';


    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var schoolAddressData = [];

    for(var i=0; i < addressIdArray.length; i++)
    {
        schoolAddressData.push([school_id, addressIdArray[i]]);
    }
    connection.query(query, [schoolAddressData], function(err, result)
    {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.schoolAddressInsert = schoolAddressInsert;

//declare the function so it can be used locally
var schoolAddressDeleteAll = function(school_id, callback){
    var query = 'DELETE FROM school_address WHERE school_id = ?';
    var queryData = [school_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.schoolAddressDeleteAll = schoolAddressDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE school SET school_Name = ? WHERE school_id = ?';
    var queryData = [params.school_Name, params.school_id];

    connection.query(query, queryData, function(err, result) {
        //delete school_address entries for this school
        schoolAddressDeleteAll(params.school_id, function(err, result){

            if(params.address_id != null) {
                //insert school_address ids
                schoolAddressInsert(params.school_id, params.address_id, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};

/*  Stored procedure used in this example
     DROP PROCEDURE IF EXISTS school_getinfo;

     DELIMITER //
     CREATE PROCEDURE school_getinfo (school_id int)
     BEGIN

     SELECT * FROM school WHERE school_id = _school_id;

     SELECT a.*, s.school_id FROM address a
     LEFT JOIN school_address s on s.address_id = a.address_id AND school_id = _school_id;

     END //
     DELIMITER ;

     # Call the Stored Procedure
     CALL school_getinfo (4);

 */

exports.edit = function(school_id, callback) {
    var query = 'CALL school_getinfo(?)';
    var queryData = [school_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};