import sys
import logging
import rdsconfig
import pymysql
from urllib.parse import unquote_plus
import boto3
import json
from datetime import datetime

#rds settings
rds_host  = rdsconfig.rds_host
name = rdsconfig.name
password = rdsconfig.password
db_name = rdsconfig.db_name


region = rdsconfig.region

logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = pymysql.connect(host=rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()

logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")

def lambda_handler(event, context):
    if event:
        file_obj = event["Records"][0]
        bucketname = str(file_obj["s3"]["bucket"]["name"])
        filename = unquote_plus(str(file_obj["s3"]["object"]["key"]))
        analyze_id(region, bucketname, filename)


def analyze_id(region, bucket_name, file_name):
    textract_client = boto3.client('textract', region_name=region)
    response = textract_client.analyze_id(DocumentPages=[{"S3Object": {"Bucket": bucket_name, "Name": file_name}}])

    elements = response["IdentityDocuments"][0]["IdentityDocumentFields"]
    elements_parsed = dict()
    for elem in elements:
        elements_parsed[elem["Type"]["Text"]] = elem["ValueDetection"]["Text"]

    elements_parsed["file_name"] = file_name
    sendDatatoRDS(elements_parsed)
    print("End of method: analyze_id")
    
    
def sendDatatoRDS(data):
    format = '%y-%m-%d'
    
    dob = try_strptime(data["DATE_OF_BIRTH"], format)
    expdt = try_strptime(data["EXPIRATION_DATE"], format)
    
    insertString = 'insert into Information (filename,firstname, lastname, DOB, id_type, document_number, expiration_date,class, state_name) values ("{}","{}","{}","{}","{}","{}","{}","{}","{}")'
    insertStmt = insertString.format(str(data["file_name"]),str(data["FIRST_NAME"]),str(data["LAST_NAME"]),str(dob),str(data["ID_TYPE"]),str(data["DOCUMENT_NUMBER"]),str(expdt),str(data["CLASS"]),str(data["STATE_NAME"]))
    
    with conn.cursor() as cur:
        cur.execute(insertStmt)
        conn.commit()
        
        
def try_strptime(s, wantedFormat):
    fmts=['%m-%d-%y','%m/%d/%y','%m/%d/%Y','%d %b %Y', '%d %b %y']
    for fmt in fmts:
        try:
            return datetime.strptime(s, fmt).strftime(wantedFormat)
        except:
            continue