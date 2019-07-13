try:
    import pandas as pd
    import re
    import nltk
    from nltk.corpus import stopwords
    import string
    import mysql.connector    
    from sqlalchemy import create_engine
    import PyPDF2
    


    mydb = mysql.connector.connect(
        		host="localhost",
        		user="akash",
        		passwd="Akash@15",
        		database="SIH"
        	)
    
    user = "akash"
    passw = "Akash@15"
    host="localhost"
    port = 3306
    database = "SIH"
    
    engine = create_engine('mysql+mysqlconnector://{}:{}@{}:{}/{}'.format(user,passw,host,port,database), echo=False)

    connection = engine.raw_connection()

    
    
    def searchinpdf(pdf,searchstr):
         
        object = PyPDF2.PdfFileReader(pdf)
        flag1=0
        # get number of pages
        NumPages = object.getNumPages()

        
        # extract text and do the search
        for i in range(0, NumPages):
            PageObj = object.getPage(i)
            #print("this is page " + str(i)) 
            Text = PageObj.extractText() 
            Text=Text.lower()
            # print(Text)
            if re.search(searchstr, Text):
                flag1=1
        if flag1==1:
            return 1
        else:
            return 0

            
    def filterkeywords(input_string):
        input_string=input_string.lower()
        keywords_searched = input_string.split(';')
        for_split=' '.join(keywords_searched)
        for_split=for_split.strip()
        for_split=re.sub(' +',';',for_split)
        keywords_searched=nltk.word_tokenize(for_split)
        stop = set(stopwords.words('english'))
        keywords_filtered=[t for t in keywords_searched if t not in stop and t not in string.punctuation]
        return list(set(keywords_filtered))

    
    
    flag=input()
    if flag=='1':
        threshold=0.5
    else:
        threshold=0.7
    query = "SELECT * from DOCUMENT";
    df1=pd.read_sql(sql= query,con=engine)
    
    (nrow,ncol)=df1.shape

    
    input_string = input()

    keywords_searched=filterkeywords(input_string)

    titles=[]
    paper_links=[]
    paper_ids=[]
    keywords_matched_wnet=[]
    
    cited_by=[]
    for i in range(nrow):
        titles.append(df1.iloc[i,1])
        paper_links.append(df1.iloc[i,-1])
        cited_by.append(df1.iloc[i,-2])
        paper_ids.append(df1.iloc[i,0])
        score1=0
        
        pdflink="/home/akash/SIH2019/webapp/lib/email_modulle/documents/"+df1.iloc[i,-1]
            
        for j in range(len(keywords_searched)):
            if searchinpdf(pdflink,keywords_searched[j]):
                score1+=1
            
        
        keywords_matched_wnet.append(score1)
        

    df2=pd.DataFrame(list(zip(paper_ids,titles,keywords_matched_wnet,cited_by, paper_links)),
                columns=['Paper_ID','Titles','KeyMatch_wnet','Citations', 'Links'])
    
    if flag=='1':
        check=len(keywords_searched) 
    else:
        check=1
    df2=df2.loc[(df2['KeyMatch_wnet']>=check)]

    df2=df2.sort_values(by='KeyMatch_wnet',ascending=False)

    finallinklist= list(df2.iloc[:,-1])
    finaltitlelist= list(df2.iloc[:,1])
    finalidlist=list(df2.iloc[:,0])

    counter=0
    for i in range(len(finaltitlelist)):
        if (counter<30):
            st=str(finalidlist[i])+" , "+finaltitlelist[i]+' , '+finallinklist[i]
            print(st)
            counter+=1
        else:
            break
except Exception as e:
    print(e);