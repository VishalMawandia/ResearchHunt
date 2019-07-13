import pandas as pd
import mysql.connector

mydb = mysql.connector.connect(
		host="localhost",
		user="akash",
		passwd="Akash@15",
		database="SIH"
	)

print(mydb)

mycursor = mydb.cursor()