import pandas as pd
import mysql.connector

mydb = mysql.connector.connect(
		host="localhost",
		user="akash",
		passwd="Akash@15",
		database="SIH"
	)

user = 'akash'
passw = 'Akash@15'
host =  'localhost'  # either localhost or ip e.g. '172.17.0.2' or hostname address 
port = 3306 
database = 'SIH'

dataset=pd.read_csv('AI_scopus.csv')

from sqlalchemy import create_engine

engine = create_engine('mysql+mysqlconnector://{}:{}@{}:{}/{}'.format(user,passw,host,port,database), echo=False)
dataset.to_sql(name='DOCUMENTS', con=engine, if_exists = 'append', index=True)