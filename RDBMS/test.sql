############### TEST ##############
INSERT INTO STUDENT(student_name,registered_email,mentor_email,register_date,dob,gender) values
	(
		'Akash Raj Singh',
        'ars.050697@gmail.com',
        '',
        current_date(),
        date("1997-06-15"),
        'Male'
    );
    
INSERT INTO STUDENT(student_name,registered_email,mentor_email,register_date,dob,gender) values
	(
		'Aryaka Bhakta',
        'aryakabhakta1997@gmail.com',
        '',
        current_date(),
        date("1997-09-11"),
        'Female'
    );
    

    
INSERT INTO STUDENT(student_name,registered_email,mentor_email,dob,gender,is_subscribed) values
	(
		'Akash Raj Singh',
        'ars.150697@gmail.com',
        '',
        date("1997-06-15"),
        'Male',
        true
    );
    
INSERT INTO STUDENT(student_name,registered_email,mentor_email,register_date,dob,gender) values
	(
		'Akash Raj Singh',
        'dcenskcgmail.com',
        '',
        current_date(),
        date("1997-06-15"),
        'Male'
    );
    

INSERT INTO STUDENT(student_name,registered_email,mentor_email,register_date,dob,gender) values
	(
		'Akash Raj Singh',
        'ars.050697@gmail.com',
        '',
        current_date(),
        date("1997-06-15"),
        'Malea'
    );

DELETE from STUDENT;
DELETE FROM STUDENT_SEQUENCING_TABLE;

SELECT current_date()-interval 1 day,count(*),(SELECT Count(*) from STUDENT where is_subscribed=True) from STUDENT;

SELECT * from ADMIN;
SELECT * from USER_STATS;
SELECT * from KEYWORD;



DROP DATABASE SIH;

INSERT INTO KEYWORD_STUDENT_REQUEST(student_id,keyword_id) values("STU_PK_00002","KEY_WRD_0017"),("STU_PK_00002","KEY_WRD_0015"),("STU_PK_00002","KEY_WRD_0008"),("STU_PK_00002","KEY_WRD_0007");

INSERT INTO KEYWORD(keyword_name) values("Machine learning"),("Clustering"),("Artificial Intelligence");

SELECT current_date()-interval 3 year;

SELECT student_id,renewal_date from STUDENT where renewal_date IS NOT NULL and current_date()-interval 3 year > renewal_date;

SELECT * from KEYWORD_STUDENT_STATS;

INSERT INTO STUDENT(student_name,registered_email,mentor_email,register_date,renewal_date,dob,gender) values
	(
		'Akash Raj Singh',
        'dcenskc@gmail.com',
        '',
        current_date(),
        date("1997-06-15"),
        date("1997-06-15"),
        'Male'
    );

SHOW TABLES;
SHOW TRIGGERS;
SHOW events;
show processlist;

SELECT concat(date_format(current_date()+interval 1 day,'%d-%m-%Y')," 0:0:0");
SELECT STR_TO_DATE(concat(DATE_FORMAT(current_date()+interval 1 day,'%d-%m-%Y')," 0:0:0"),'%d-%m-%Y %H:%i:%s');

INSERT INTO ADMIN(admin_email,admin_name,hashdigest,is_superadmin) VALUES('ars.150697@gmail.com','Akash Raj','Akash@15',true);
INSERT INTO ADMIN(admin_email,admin_name,hashdigest,is_superadmin) VALUES('ars.050697@gmail.com','Akash Raj Singh','Akash@15',false);

SELECT count(*) as sa_count from ADMIN where is_superadmin = true;
SELECT * from ADMIN;

USE SIH;

SHOW TABLES;

DROP DATABASE SIH;

INSERT INTO KEYWORD(keyword_name) values('artificial'),('network'),('semantic'),('linguistic'),('algorithm'),('intelligence'),('pattern');

INSERT INTO KEYWORD_STUDENT_REQUEST(student_id,keyword_id) values("STU_PK_00002","KEY_WRD_0004");
INSERT INTO KEYWORD_STUDENT_REQUEST(student_id,keyword_id) values("STU_PK_00002","KEY_WRD_0005");
INSERT INTO KEYWORD_STUDENT_REQUEST(student_id,keyword_id) values("STU_PK_00002","KEY_WRD_0006");
INSERT INTO KEYWORD_STUDENT_REQUEST(student_id,keyword_id) values("STU_PK_00002","KEY_WRD_0007");

SELECT *  from KEYWORD;

SELECT * from KEYWORD_STUDENT_REQUEST;

SELECT * from ADMIN;

DELETE FROM ADMIN where is_superadmin=1;

USE SIH;

UPDATE STUDENT SET renewal_date='2019-02-15' where student_id like 'STU_PK_00002';

SELECT * from STUDENT where student_id like 'STU_PK_00002';
SELECT * from KEYWORD_STUDENT_REQUEST where student_id like 'STU_PK_00002';

DELETE from KEYWORD_STUDENT_REQUEST where student_id like 'STU_PK_00002';


DELETE from STUDENT where student_name like 'akash';

DELETE FROM KEYWORD;
	
USE SIH;

SELECT * FROM STUDENT;

DELETE FROM DOCUMENT where DOCUMENT_name like 'A%' limit 500;

DROP TABLE DOCUMENT;

SET AUTOCOMMIT = 1;

COMMIT;
SELECT * FROM KEYWORD_STUDENT_REQUEST;

INSERT INTO KEYWORD(keyword_name) values('MACHINE LEARNING'),('ARTIFICIAL INTELLIGENCE');

INSERT INTO USER_STATS(datevalue,active_users,subscribed_users) values 
	('2018-10-15',190,60),
    ('2018-11-15',200,50),
    ('2018-12-15',287,126),
    ('2019-01-15',312,199),
    ('2019-02-15',325,185),
    ('2019-03-15',520,205);


SELECT max(active_users),max(subscribed_users),datevalue from USER_STATS group by datevalue order by datevalue;


DESC DOCUMENT;

SELECT keyword_name,count(*) from KEYWORD inner join KEYWORD_STUDENT_STATS on KEYWORD_STUDENT_STATS.keyword_id=KEYWORD.keyword_id group by keyword_name;


ALTER TABLE STUDENT ADD column tenure_period int;

UPDATE STUDENT SET phone=9836864111;

SHOW TABLES;

SELECT * from DOCUMENT;
############################

DELETE FROM DOCUMENT;

INSERT INTO DOCUMENT(Title,Keywords,Citation,Link) VALUES ('SD-CNN: A shallow-deep CNN for improved breast cancer diagnosis','Deep learning;Image synthesis;Breast tumor;Digital mammography;Classification',100,'1.pdf');
INSERT INTO DOCUMENT(Title,Keywords,Citation,Link) VALUES ('Morcellation During Gynaecologic Surgery: Its Uses, Complications, and Risks of Unsuspected Malignancy','cancer;gynaecology;malignancy;Morcellation',150,'2.pdf');
INSERT INTO DOCUMENT(Title,Keywords,Citation,Link) VALUES ('Cancer-associated malnutrition: An introduction','Cancer; Disease-related malnutrition; Nutritional intervention',75,'3.pdf');
INSERT INTO DOCUMENT(Title,Keywords,Citation,Link) VALUES ('Carboplatin versus two doses of cisplatin in combination with gemcitabine in the treatment of advanced non-smallcell lung cancer: Results from a British Thoracic Oncology Group randomised phase III trial','Non-small-cell lung cancer; Carboplatin; Cisplatin; Gemcitabine; Randomised phase III trial; Quality of life',60,'4.pdf');
INSERT INTO DOCUMENT(Title,Keywords,Citation,Link) VALUES ('Prevalence and clinical association of MET gene overexpression and amplification in patients with NSCLC: Results from the European Thoracic Oncology Platform (ETOP) Lungscape project','Non-small cell lung carcinoma; IHC MET overexpression; SISH MET amplification; MET exon14 mutation',24,'5.pdf');
INSERT INTO DOCUMENT(Title,Keywords,Citation,Link) VALUES ('Use of a simplified geriatric evaluation in thoracic oncology','Geriatric evaluation;Lung cancer;Elderly patients;Geriatric oncology',88,'6.pdf');
INSERT INTO DOCUMENT(Title,Keywords,Citation,Link) VALUES ('Treatment of Elderly Patients With NoneSmall-Cell Lung Cancer: Results of an International Expert Panel Meeting of the Italian Association of Thoracic Oncology','Adjuvant treatment; Geriatric assessment; Locally advanced NSCLC; Molecular testing; Platinum-based chemotherapy',111,'7.pdf');
INSERT INTO DOCUMENT(Title,Keywords,Citation,Link) VALUES ('The Evolving Role of Nivolumab in Non-Small-Cell Lung Cancer for Second-Line Treatment: A New Cornerstone for Our Treatment Algorithms','Anti-PD-1 antibody; Immunotherapy; Nivolumab; PD-L1; Second-line treatment',11,'8.pdf');
INSERT INTO DOCUMENT(Title,Keywords,Citation,Link) VALUES ('Creating Computable Algorithms for Symptom Management in an Outpatient Thoracic Oncology Setting','Lung cancer and symptom management algorithms; decision making; decision support systems; guideline implementation; consensus methods',51,'9.pdf');
INSERT INTO DOCUMENT(Title,Keywords,Citation,Link) VALUES ('The Impact of Chemotherapy on the Lymphatic System in Thoracic Oncology','Non-small cell lung cancer; Adjuvant chemotherapy ; Neoadjuvant chemotherapy; Lymph node',72,'10.pdf');



INSERT INTO HISTORY values
	(current_date(),'STU_PK_00001',11),
	(current_date(),'STU_PK_00001',14),
	('2019-01-15','STU_PK_00001',15),
	(current_date(),'STU_PK_00003',19);
    
SELECT datevalue,title from HISTORY join DOCUMENT on HISTORY.DOCUMENT_id=DOCUMENT.id where HISTORY.student_id like 'STU_PK_00003';

UPDATE STUDENT SET is_and=1;


ALTER TABLE STUDENT Add COLUMN is_and boolean default 1;

DESC DOCUMENT;


USE SIH;

DELETE from HISTORY;

SELECT * from DOCUMENT limit 500;

SELECT * from STUDENT;

DESC STUDENT;

USE SIH;


UPDATE KEYWORD set keyword_name = upper(keyword_name);

SELECT * from HISTORY limit 50;

UPDATE DOCUMENT SET link = replace(link,' ','_');

ALTER TABLE STUDENT ADD COLUMN research_faculty varchar(50);