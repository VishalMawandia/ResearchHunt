CREATE DATABASE SIH;

USE SIH;

SET GLOBAL EVENT_SCHEDULER = ON;

################################ Student Table ####################################

CREATE TABLE STUDENT_SEQUENCING_TABLE(id int not null auto_increment primary key);

CREATE TABLE STUDENT(student_id varchar(12) primary key not null,
						student_name varchar(30) not null,
                        registered_email varchar(50) not null unique,
                        mentor_email varchar(50),
                        register_date date not null,
                        renewal_date date,
                        dob date,
                        gender varchar(6),
                        is_subscribed boolean default false);

################################# Trigger
DELIMITER $$
CREATE TRIGGER email_verification_trigger BEFORE INSERT ON STUDENT
FOR EACH ROW 
BEGIN 
IF (NEW.registered_email REGEXP '^[a-zA-Z0-9][+a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]*\\.[a-zA-Z]{2,4}$') = 0 THEN 
  SIGNAL SQLSTATE '12345'
     SET MESSAGE_TEXT = 'Invalid email address';
END IF; 
END$$
DELIMITER ;


################################# Trigger
DELIMITER $$
CREATE TRIGGER gender_verification_trigger BEFORE INSERT ON STUDENT
FOR EACH ROW
BEGIN
IF (NEW.gender="Male" or NEW.gender="Female" or NEW.gender="Others") = 0 THEN
	SIGNAL SQLSTATE '12345'
		SET MESSAGE_TEXT = "Invalid gender entry";
END IF;
END$$
DELIMITER ;

################################# Trigger
DELIMITER $$
CREATE TRIGGER student_pk_generate_trigger
BEFORE INSERT ON STUDENT
FOR EACH ROW
BEGIN
  INSERT INTO STUDENT_SEQUENCING_TABLE VALUES (NULL);
  SET NEW.student_id = CONCAT('STU_PK_', LPAD(LAST_INSERT_ID(), 5, '0'));
END$$
DELIMITER ;



################################ ADMIN Table ####################################

CREATE TABLE ADMIN_SEQUENCING_TABLE(id int not null auto_increment primary key);

CREATE TABLE ADMIN(admin_id varchar(12) primary key not null,
						admin_email varchar(50) not null unique,
						admin_name varchar(30) not null,
                        hashdigest text not null,
                        is_superadmin boolean default false);


################################# Trigger
DELIMITER $$
CREATE TRIGGER admin_email_verification_trigger BEFORE INSERT ON ADMIN
FOR EACH ROW 
BEGIN 
IF (NEW.admin_email REGEXP '^[a-zA-Z0-9][+a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]*\\.[a-zA-Z]{2,4}$') = 0 THEN 
  SIGNAL SQLSTATE '12345'
     SET MESSAGE_TEXT = 'Invalid email address';
END IF; 
END$$
DELIMITER ;

################################# Trigger
DELIMITER $$
CREATE TRIGGER admin_pk_generate_trigger
BEFORE INSERT ON ADMIN
FOR EACH ROW
BEGIN
  INSERT INTO ADMIN_SEQUENCING_TABLE VALUES (NULL);
  SET NEW.admin_id = CONCAT('ADM_PK_', LPAD(LAST_INSERT_ID(), 5, '0'));
END$$
DELIMITER ;


######################### KEYWORD TABLE ########################

CREATE TABLE KEYWORD_SEQUENCING_TABLE(id int not null auto_increment primary key);

CREATE TABLE KEYWORD(keyword_id varchar(12) primary key not null,
						keyword_name varchar(100) not null unique);
                        
################################# Trigger
DELIMITER $$
CREATE TRIGGER keyword_pk_generate_trigger
BEFORE INSERT ON KEYWORD
FOR EACH ROW
BEGIN
  INSERT INTO KEYWORD_SEQUENCING_TABLE VALUES (NULL);
  SET NEW.keyword_id = CONCAT('KEY_WRD_', LPAD(LAST_INSERT_ID(), 4, '0'));
END$$
DELIMITER ;


###################### KEYWORD_STUDENT_REQUEST TABLE ########################

CREATE TABLE KEYWORD_STUDENT_REQUEST(keyword_id varchar(12),
										student_id varchar(12),
                                        foreign key (keyword_id) REFERENCES KEYWORD(keyword_id) ON DELETE CASCADE,
                                        foreign key (student_id) REFERENCES STUDENT(student_id) ON DELETE CASCADE);
                                        
CREATE TABLE KEYWORD_STUDENT_STATS(keyword_id varchar(12),student_id varchar(12));


DELIMITER $$
CREATE TRIGGER keyword_student_stats_trigger
AFTER INSERT ON KEYWORD_STUDENT_REQUEST
FOR EACH ROW
BEGIN
	INSERT INTO KEYWORD_STUDENT_STATS values(NEW.keyword_id,NEW.student_id);
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER keyword_student_renew_date_update
AFTER INSERT ON KEYWORD_STUDENT_REQUEST
FOR EACH ROW
BEGIN
	UPDATE STUDENT set renewal_date=now() where student_id like NEW.student_id;
	UPDATE STUDENT set is_subscribed=true where student_id like NEW.student_id;
END$$
DELIMITER ;	

DELIMITER //
CREATE TRIGGER unsubscribe_on_removal
AFTER DELETE ON KEYWORD_STUDENT_REQUEST
FOR EACH ROW
BEGIN
	DECLARE counter INT;
	SELECT COUNT(*) INTO counter FROM KEYWORD_STUDENT_REQUEST WHERE student_id like old.student_id;
	if counter=0
		then
			UPDATE STUDENT SET is_subscribed=false where student_id like old.student_id;
	end if;
END //
DELIMITER ;


###################### KEYWORD_STUDENT_REQUEST TABLE ########################

CREATE TABLE USER_STATS(datevalue date,
						active_users int,
                        subscribed_users int);
                        
CREATE EVENT user_stats_update_event
ON SCHEDULE EVERY 1 DAY
STARTS STR_TO_DATE(concat(DATE_FORMAT(current_date()+interval 1 day,'%d-%m-%Y')," 0:0:0"),'%d-%m-%Y %H:%i:%s')
DO
	INSERT INTO USER_STATS SELECT current_date()-interval 1 day,count(*),(SELECT Count(*) from STUDENT where is_subscribed=True) from STUDENT;
    
##################### Auto Unsubscribe after 3 year Event #######################

DELIMITER $$
CREATE EVENT unsubscribe_user_event
ON SCHEDULE EVERY 1 DAY
STARTS STR_TO_DATE(concat(DATE_FORMAT(current_date()+interval 1 day,'%d-%m-%Y')," 0:0:0"),'%d-%m-%Y %H:%i:%s')
DO
BEGIN
	DELETE FROM KEYWORD_STUDENT_REQUEST where student_id in (SELECT student_id from Student where renewal_date IS NOT NULL and current_date()-interval 3 year > renewal_date);
    UPDATE Student set is_subscribed=false where renewal_date IS NOT NULL and current_date()-interval 3 year > renewal_date;
END$$
DELIMITER ;

######################  HISTORY Table ########################

CREATE TABLE DOCUMENT(id int auto_increment primary key,title varchar(1000) not null,keywords varchar(5000) not null,citation int,link varchar(2000));

CREATE TABLE HISTORY(datevalue date not null,student_id varchar(12),document_ids varchar(1000),keyword_ids varchar(5000),foreign key (student_id) references STUDENT(student_id) ON DELETE CASCADE);