# Information-Retrieval-from-Image
Developed a web application hosted on AWS EC2 along with a Python Lamda function script, S3 bucket and RDS database to upload a ID and extract necessary information from it

When the image is uploaded on web application, it gets stored in S3 bucket,
S3 bucket sets a trigger to Lambda fuction which makes a database connectivity to RDS 
Information is extracted from image with the help of textract
and uploaded on database. 
The web application retrives the information from RDS to display on front end
