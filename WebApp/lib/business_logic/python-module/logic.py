try:
    import pandas as pd
    import re
    from nltk.corpus import wordnet
    import nltk
    from nltk.corpus import stopwords
    import string
    import pickle
    import os
    import mysql.connector    
    from sqlalchemy import create_engine


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

    file = open(os.path.join(__file__.replace('logic.py',""),"GloveModel"),'rb')
    model = pickle.load(file)
    file.close()

    def glovesim(word1,word2):
        
        if word1 in model.vocab and word2 in model.vocab:
            return(model.similarity(word1,word2))
        else:
            return(0)


    def simwordnet(word1,word2):
        listl=[]
        if wordnet.synsets(word1) and wordnet.synsets(word2) :
            wordFromList1 = wordnet.synsets(word1)
            wordFromList2 = wordnet.synsets(word2)
            if wordFromList1 and wordFromList2:
                s = wordFromList1[0].wup_similarity(wordFromList2[0])
                listl.append(s)
            if(max(listl)==None):
                return 0
            else:
                return(max(listl))
        else:
            return(int(word1==word2))
            
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
    keywords_matched_glove=[]
    cited_by=[]
    for i in range(nrow):
        titles.append(df1.iloc[i,1])
        paper_links.append(df1.iloc[i,-1])
        cited_by.append(df1.iloc[i,-2])
        paper_ids.append(df1.iloc[i,0])
        score1=0
        score2=0
        
        paper_keywords_str=df1.iloc[i,2]
        paper_keywords=filterkeywords(paper_keywords_str)
        
        title_str=df1.iloc[i,1]
        title_keys=title_str.split(' ')
        title_keys=';'.join(title_keys)
        
        title_keywords=filterkeywords(title_str)
        
        paper_keywords.extend(title_keywords)
            
        for j in range(len(keywords_searched)):
            for k in range(len(paper_keywords)):
                simwnet=simwordnet(keywords_searched[j],paper_keywords[k])
                if(simwnet>=threshold):
                    score1+=1
                simglove=glovesim(keywords_searched[j],paper_keywords[k])
                if(simglove>=threshold):
                    score2+=1
        keywords_matched_wnet.append(score1)
        keywords_matched_glove.append(score2)

    df2=pd.DataFrame(list(zip(paper_ids,titles,keywords_matched_wnet, keywords_matched_glove,cited_by, paper_links)),
                columns=['Paper_ID','Titles','KeyMatch_wnet','KeyMatch_Glove','Citations', 'Links'])
    
    if flag=='1':
        check=len(keywords_searched) 
    else:
        check=1
    df2=df2.loc[(df2['KeyMatch_wnet']>=check) | (df2['KeyMatch_Glove']>=check)]

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