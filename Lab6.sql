use jsoto;

create table account (account_id int auto_increment PRIMARY KEY, email varchar(50) UNIQUE, 
							Fname varchar(25), Lname varchar(25));
                            
create table skill (skill_id int auto_increment PRIMARY KEY, skill_name varchar(50) UNIQUE, description varchar(100));


create table address(address_id int auto_increment PRIMARY KEY, street varchar(50), zip_code varchar(25));

create table school(school_id int auto_increment PRIMARY KEY, school_Name varchar(50) UNIQUE,
						address_id int,
                        FOREIGN KEY(address_id) REFERENCES address(address_id));

SELECT * FROM account_school;

create table resume(resume_id int auto_increment UNIQUE, account_id int, resume_name varchar(50),
						UNIQUE(account_id, resume_name), 
                        FOREIGN KEY(account_id) REFERENCES account(account_id));
					
create table company(company_id int auto_increment PRIMARY KEY, company_name varchar(50) UNIQUE);

create table account_skill (account_id int , skill_id int, 
							PRIMARY KEY(account_id, skill_id), 
                            FOREIGN KEY(account_id) REFERENCES account(account_id)ON DELETE CASCADE,
                            FOREIGN KEY(skill_id) REFERENCES skill(skill_id)ON DELETE CASCADE);
                        
create table account_company(account_id int , company_id int ,
								PRIMARY KEY(account_id, company_id),
                                FOREIGN KEY(account_id) REFERENCES account(account_id)ON DELETE CASCADE,
                                FOREIGN KEY(company_id) REFERENCES company(company_id)ON DELETE CASCADE);
                                
create table account_school(account_id int , school_id int , 
								PRIMARY KEY(account_id, school_id),
								start_date timestamp, end_date timestamp, gpa float,
                                FOREIGN KEY(account_id) REFERENCES account(account_id)ON DELETE CASCADE,
                                FOREIGN KEY(school_id) REFERENCES school(school_id)ON DELETE CASCADE);

create table resume_skill(resume_id int , skill_id int ,
							PRIMARY KEY(resume_id, skill_id),
                            FOREIGN KEY(skill_id) REFERENCES skill(skill_id)ON DELETE CASCADE,
                            FOREIGN KEY(resume_id) REFERENCES resume(resume_id)ON DELETE CASCADE);
                            
create table company_address(company_id int , address_id int , 
								PRIMARY KEY(company_id, address_id),
                                FOREIGN KEY(company_id) REFERENCES company(company_id)ON DELETE CASCADE,
								FOREIGN KEY(address_id) REFERENCES address(address_id)ON DELETE CASCADE);

create table resume_school(resume_id int , school_id int , 
						PRIMARY KEY(resume_id, school_id),
						FOREIGN KEY(resume_id) REFERENCES resume(resume_id)ON DELETE CASCADE,
                        FOREIGN KEY(school_id) REFERENCES school(school_id)ON DELETE CASCADE);
                        

create table resume_company(resume_id int , company_id int , 
								PRIMARY KEY(resume_id, company_id),
								date_shared timestamp, wasHired bool,
								FOREIGN KEY(resume_id) REFERENCES resume(resume_id)ON DELETE CASCADE,
                                FOREIGN KEY(company_id) REFERENCES company(company_id)ON DELETE CASCADE);  
                                
CREATE TABLE school_address(school_id INT, address_id INT,
							PRIMARY KEY(school_id, address_id),
							FOREIGN KEY(school_id) REFERENCES school(school_id),
                            FOREIGN KEY(address_id) REFERENCES address(address_id));
                                
insert into account (email, Fname, Lname) values ('sotojoh@sonoma.edu', 'John', 'Soto');
insert into account (email, Fname, Lname) values ('mhaderman@sonoma.edu', 'Mucheal', 'Handerman');
insert into account (email, Fname, Lname) values ('skywalkerlu@sonoma.edu', 'Luke', 'Skywalker');
insert into account (email, Fname, Lname) values ('vulcan@sonoma.edu', 'Vulcan', 'Volcano');
insert into account (email, Fname, Lname) values ('landerosB@sonoma.edu', 'Brenda', 'Landeros');

select * from account;

insert into skill (skill_name, description) values ('Programming', 'Reverse Malware Engineer');
insert into skill (skill_name, description) values ('Programmer', 'Programs databases');
insert into skill (skill_name, description) values ('Force use', 'Can use the force');
insert into skill (skill_name, description) values ('Inventor', 'Invents new gadgets');
insert into skill (skill_name, description) values ('Mother', 'Takes care of her children');

insert into address (street, zip_code) values ('12345 Santa Clause Cir.', '12345');
insert into address (street, zip_code) values ('12345 Santa Cruz Cir.', '12545');
insert into address (street, zip_code) values ('12345 Santa Jose Cir.', '12645');
insert into address (street, zip_code) values ('12345 Santa John Cir.', '12745');
insert into address (street, zip_code) values ('12345 Santa Same Cir.', '12845');

SELECT school_name, address.street, address.zip_code 
		FROM school
        LEFT JOIN address  on address.address_id = school.address_id
        WHERE school.school_id > 0;

insert into school (school_id,school_name, address_id) values (1,'Sonoma State University', 1);
insert into school (school_id,school_name, address_id) values (2,'Universit of California Irvine', 2);
insert into school (school_id,school_name, address_id) values (3,'Jedi University', 3);
insert into school (school_id,school_name, address_id) values (4,'Volcano University', 4);
insert into school (school_id,school_name, address_id) values (5,'Mothers University', 5);

insert into resume (resume_name, account_id) values ('Polito.Inc resume', 1);
insert into resume (resume_name, account_id) values ('Sonoma State resume', 2);
insert into resume (resume_name, account_id) values ('Jedi Apprentice resume', 3);
insert into resume (resume_name, account_id) values ('Volcanist resume', 4);
insert into resume (resume_name, account_id) values ('Mother resume', 5);

insert into resume (resume_name, account_id) values ('Politics.inc resume', 1);
insert into resume (resume_name, account_id) values ('Professor resume', 1);

insert into resume (resume_name, account_id) values ('Chancelor resume', 2);
insert into resume (resume_name, account_id) values ('San Diego State resume', 2);
insert into resume (resume_name, account_id) values ('Database resume', 2);
insert into resume (resume_name, account_id) values ('Child resume', 2);

insert into resume (resume_name, account_id) values ('Jedi Master resume', 3);




select * from company;

insert into company (company_name) values ('Polito.Inc');
insert into company (company_name) values ('Sonoma State University');
insert into company (company_name) values ('Jedi Council');
insert into company (company_name) values ('Volcano.Inc');
insert into company (company_name) values ('Mother.Inc');

insert into account_skill (account_id, skill_id) value (1, 1);
insert into account_skill (account_id, skill_id) value (2, 2);
insert into account_skill (account_id, skill_id) value (3, 3);
insert into account_skill (account_id, skill_id) value (4, 4);

insert into account_company (account_id, company_id) values (1,1);
insert into account_company (account_id, company_id) values (2,2);
insert into account_company (account_id, company_id) values (3,3);
insert into account_company (account_id, company_id) values (5,1);

insert into account_school (account_id, school_id, start_date, end_date, gpa) values (1,1, '2017-01-01 12:00', '2027-02-01 12:00', 3.6);
insert into account_school (account_id, school_id, start_date, end_date, gpa) values (2,2, '2016-01-01 12:00', '2037-02-01 12:00', 4.0);
insert into account_school (account_id, school_id, start_date, end_date, gpa) values (3,3, '2015-01-01 12:00', '2027-01-01 12:00', 2.6);
insert into account_school (account_id, school_id, start_date, end_date, gpa) values (4,3, '2012-01-01 12:00', '2017-02-01 12:00', 3.3);
insert into account_school (account_id, school_id, start_date, end_date, gpa) values (4,4, '2012-01-01 12:00', '2017-02-01 12:00', 3.1);

select * from school;

insert into resume_skill (skill_id, resume_id) values (1,1);
insert into resume_skill (skill_id, resume_id) values (1,2);
insert into resume_skill (skill_id, resume_id) values (3,3);
insert into resume_skill (skill_id, resume_id) values (5,5);

insert into company_address (company_id, address_id) values (1,1);
insert into company_address (company_id, address_id) values (2,2);
insert into company_address (company_id, address_id) values (3,3);
insert into company_address (company_id, address_id) values (4,4);
insert into company_address (company_id, address_id) values (4,3);

insert into resume_school (resume_id, school_id) values (1,1);
insert into resume_school (resume_id, school_id) values (2,2);
insert into resume_school (resume_id, school_id) values (3,3);
insert into resume_school (resume_id, school_id) values (3,4);
insert into resume_school (resume_id, school_id) values (5,3);

insert into resume_company (resume_id, company_id, date_shared, wasHired) values (1,1,'2016-01-01 12:00', 1);
insert into resume_company (resume_id, company_id, date_shared, wasHired) values (2,1, '2016-01-01 12:00', 1);
insert into resume_company (resume_id, company_id, date_shared, wasHired) values (3,1,'2016-01-01 12:00', 0);
insert into resume_company (resume_id, company_id, date_shared, wasHired) values (5,1,'2016-01-01 12:00', 0);

insert into resume_company (resume_id, company_id, date_shared, wasHired) values (1,3, '2016-01-01 12:00', 0);
insert into resume_company (resume_id, company_id, date_shared, wasHired) values (5,3, '2016-01-01 12:00', 1);
insert into resume_company (resume_id, company_id, date_shared, wasHired) values (3,3, '2016-01-01 12:00', 0);
insert into resume_company (resume_id, company_id, date_shared, wasHired) values (2,3, '2016-01-01 12:00', 1);


insert into school_address(school_id, address_id) values (1,1);
insert into school_address(school_id, address_id) values (2,2);
insert into school_address(school_id, address_id) values (3,3);
insert into school_address(school_id, address_id) values (4,4);
insert into school_address(school_id, address_id) values (5,5);


select company_name, AVG(gpa) as average_gpa
FROM company c
LEFT JOIN resume_company rc ON c.company_id = rc.company_id
LEFT JOIN resume r ON r.resume_id = rc.resume_id
LEFT JOIN resume_school rs ON rs.resume_id = r.resume_id
LEFT JOIN account_school as1 ON as1.account_id = r.account_id 
WHERE rc.wasHired = 1
GROUP BY company_name;

select Fname, Lname
FROM account a
JOIN resume r ON r.account_id = a.account_id
JOIN resume_company rc ON rc.resume_id = r.resume_id
WHERE rc.wasHired = 1;

Create OR REPLACE view school_gpa_view AS 
select school_name, AVG(gpa) as average_gpa
FROM company c
Inner JOIN resume_company rc ON c.company_id = rc.company_id
Inner JOIN resume r ON r.resume_id = rc.resume_id
Inner JOIN resume_school rs ON rs.resume_id = r.resume_id
Inner JOIN account_school as1 ON as1.account_id = r.account_id 
Inner JOIN school s ON s.school_id = as1.school_id
GROUP BY gpa
HAVING AVG(gpa) >= 2.0;

DROP PROCEDURE IF EXISTS school_get_gpa;
DELIMITER //
	CREATE PROCEDURE school_get_gpa (_school_name varchar(50))
     BEGIN
	   SELECT * FROM school_gpa_view WHERE school_name = _school_name;
	 END //
DELIMITER ;

CALL school_get_gpa('Sonoma State University');

DROP PROCEDURE IF EXISTS school_gpa_value;
DELIMITER //
	CREATE PROCEDURE school_gpa_value (_gpa float)
     BEGIN
	   SELECT * FROM school_gpa_view WHERE average_gpa >= _gpa;
	 END //
DELIMITER ; 

CALL school_gpa_value(3.0);



DROP PROCEDURE IF EXISTS account_gpa_info;
DELIMITER //
	CREATE PROCEDURE account_gpa_info (_gpa float)
     BEGIN
	   SELECT * FROM account_gpa_view WHERE avrg_gpa >= _gpa;
	 END //
DELIMITER ; 

CALL account_gpa_info(3.0);


DROP FUNCTION IF EXISTS fn_school_get_gpa;
DELIMITER //
CREATE FUNCTION fn_school_get_gpa(_school_name VARCHAR(50)) RETURNS DOUBLE
BEGIN
DECLARE _gpa DOUBLE;

SELECT avg(average_gpa) INTO _gpa FROM school_gpa_view WHERE school_name = _school_name;

RETURN _gpa;
END//
DELIMITER ;

SELECT school_name, fn_school_get_gpa(school_name) AS school_gpa
FROM school;

-- 4

Create OR REPLACE view account_gpa_view AS 
SELECT account.* , AVG(gpa) as avrg_gpa
FROM account
INNER JOIN account_school ON account.account_id = account_school.account_id
GROUP BY account_id; 

DROP FUNCTION IF EXISTS account_avg_gpa;
DELIMITER //
CREATE FUNCTION account_avg_gpa(_account_id VARCHAR(50)) RETURNS DOUBLE
BEGIN
DECLARE _gpa DOUBLE;

SELECT avg(avrg_gpa) INTO _gpa FROM account_gpa_view WHERE account_id = _account_id;

RETURN _gpa;
END//
DELIMITER ;

SELECT account_id, account_avg_gpa(account_id) AS acct_avg_gpa
FROM account
GROUP BY account_id;

-- 5

Create OR REPLACE view account_num_resumes AS 
SELECT account.account_id as AC, count(resume_id) AS amountRes, count(account.account_id) AS amountAc
FROM account
INNER JOIN resume ON account.account_id = resume.account_id
GROUP BY account_id; 



DROP FUNCTION IF EXISTS account_amount_resume;
DELIMITER //
CREATE FUNCTION account_amount_resume(_account_id VARCHAR(50)) RETURNS INT
BEGIN
DECLARE _numRes INT;

SELECT (amountRes) INTO _numRes AND (amountAc) INTO FROM account_num_resumes WHERE account_id = _account_id;

RETURN _numRes;
END//
DELIMITER ;

SELECT account_id, account_amount_resume(account_id) AS resume_amount
FROM account
GROUP BY account_id;

SELECT anr.account_id, (amountRes), amountAc FROM account_num_resumes  anr
JOIN account a on a.account_id = AC
where anr.account_id = 1;

-- -----Testing Function ------

SELECT account_id, account_avg_gpa(account_id) AS acct_avg_gpa
FROM account
GROUP BY account_id;


SELECT account_id, account_amount_resume(account_id) AS resume_amount
FROM account
GROUP BY account_id;


-- FOR WEBSTORM APPLICATION, Start HERE --------------------------------------------------------------------------------

		/*company_getinfo*/

DELIMITER //
CREATE PROCEDURE company_getinfo(_company_id INT)
BEGIN 
	SELECT * FROM company WHERE company_id = _company_id;

SELECT a.*, ca.company_id FROM company_address ca
JOIN address a on a.address_id = ca.address_id
WHERE company_id = _company_id;

end; //



		/*address_getinfo*/

DROP PROCEDURE IF EXISTS address_getinfo;

 DELIMITER //
 CREATE PROCEDURE address_getinfo (address_id int)
 BEGIN

 SELECT * FROM address WHERE address_id = _address_id;


 END //
DELIMITER ;


		/*account_getinfo*/

DROP PROCEDURE IF EXISTS account_getinfo;

DELIMITER //
CREATE PROCEDURE account_getinfo (_account_id int)
BEGIN

SELECT a.*, sc.* FROM account a
JOIN account_school asch ON asch.account_id = a.account_id
JOIN school sc ON sc.school_id = asch.school_id
WHERE a.account_id = _account_id;

-- Skill
SELECT c.*, sk.*, a.account_id FROM account a
JOIN account_company ac ON ac.account_id = a.account_id
JOIN company c ON c.company_id = ac.company_id
JOIN account_skill ask ON ask.account_id = a.account_id
JOIN skill sk ON sk.skill_id = ask.skill_id
WHERE a.account_id = _account_id;

-- company
SELECT c.*, sk.*, a.account_id FROM account a
JOIN account_company ac ON ac.account_id = a.account_id
JOIN company c ON c.company_id = ac.company_id
JOIN account_skill ask ON ask.account_id = a.account_id
JOIN skill sk ON sk.skill_id = ask.skill_id
WHERE a.account_id = _account_id;


END //
DELIMITER ;


DROP PROCEDURE IF EXISTS accounts_getinfo;
DELIMITER //
CREATE PROCEDURE accounts_getinfo(_account_id int)
BEGIN

SELECT * FROM account a WHERE a.account_id = _account_id;

SELECT c.company_name FROM account_company a_c
RIGHT JOIN company c ON c.company_id = a_c.company_id
GROUP BY c.company_name;

SELECT a_sc.*, s.school_Name FROM account_school a_sc
JOIN school s ON s.school_id=a_sc.school_id
GROUP BY school_Name;

SELECT a_sk.*, sk.skill_name FROM account_skill a_sk
RIGHT JOIN skill sk ON sk.skill_id=a_sk.skill_id
GROUP BY sk.skill_name;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS all_companies_schools_skills;
DELIMITER //
CREATE PROCEDURE all_companies_schools_skills()
BEGIN

SELECT a_c.*, c.company_name FROM account_company a_c
JOIN company c ON c.company_id = a_c.company_id;

SELECT a_sc.*, s.school_Name FROM account_school a_sc
JOIN school s ON s.school_id=a_sc.school_id;

SELECT a_sk.*, sk.skill_name FROM account_skill a_sk
JOIN skill sk ON sk.skill_id=a_sk.skill_id;

END //
DELIMITER ;


SELECT * FROM account a
JOIN account_company ac ON ac.account_id = a.account_id
JOIN company c ON c.company_id = ac.company_id
JOIN account_skill ask ON ask.account_id = a.account_id
JOIN skill sk ON sk.skill_id = ask.skill_id
JOIN account_school asch on asch.account_id = a.account_id
JOIN school s on s.school_id = asch.school_id; 


SELECT a.*, sc.* FROM account a
JOIN account_school asch ON asch.account_id = a.account_id
JOIN school sc ON sc.school_id = asch.school_id;

DROP PROCEDURE IF EXISTS accounts_getinfo;


DROP PROCEDURE IF EXISTS resume_getinfo;

DELIMITER //
CREATE PROCEDURE resume_getinfo(_resume_id int)
BEGIN

SELECT resume_id, resume_name FROM resume r WHERE r.resume_id = _resume_id;

SELECT r_c.resume_id, r_c.company_id, c.* FROM resume_company r_c
RIGHT JOIN company c ON c.company_id = r_c.company_id
WHERE r_c.resume_id = _resume_id
GROUP BY company_name;

SELECT r_sc.resume_id, r_sc.school_id, s.* FROM resume_school r_sc
RIGHT JOIN school s ON s.school_id = r_sc.school_id
WHERE r_sc.resume_id = _resume_id
GROUP BY school_Name;

SELECT r_sk.resume_id, r_sk.skill_id, sk.* FROM resume_skill r_sk
RIGHT JOIN skill sk ON sk.skill_id = r_sk.skill_id
WHERE r_sk.resume_id = _resume_id
GROUP BY skill_name;



END //
DELIMITER ;


DROP PROCEDURE IF EXISTS resume_Delete;

DELIMITER //
CREATE PROCEDURE resume_Delete(_resume_id INT)
BEGIN

DELETE FROM resume where resume_id = _resume_id;

END //
DELIMITER ;


select * from resume;

delete from account where account_id = 30;

delete from resume where resume_id = 23;

select * from account_resume;

delete from account_resume where resume_id = 23;



select * from account_school;


 DROP PROCEDURE IF EXISTS account_getsinfo;

 DELIMITER //
 CREATE PROCEDURE account_getsinfo (_account_id int)
 BEGIN

SELECT sk.*, a.account_id FROM account a
JOIN account_skill ask ON ask.account_id = a.account_id
JOIN skill sk ON sk.skill_id = ask.skill_id
WHERE a.account_id = _account_id;

 END //
 DELIMITER ;

 
		/*skill_getinfo*/

 DROP PROCEDURE IF EXISTS skill_getinfo;

 DELIMITER //
 CREATE PROCEDURE skill_getinfo (skill_id int)
 BEGIN

 SELECT * FROM skill WHERE skill_id = _skill_id;


 END; //
 
		/*school_getinfo*/

DELIMITER //
CREATE PROCEDURE school_getinfo(_school_id INT)
BEGIN 
	SELECT * FROM school WHERE school_id = _school_id;

SELECT a.*, sa.school_id FROM school_address sa
JOIN address a on a.address_id = sa.address_id
WHERE school_id = _school_id;

end; //





