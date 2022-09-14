import express from 'express';
import { generateUploadURL } from './s3.js';
import { getDataFromRDS, updateNameById, deleteRowById } from './db.js';
import path from 'path';
const app = express()
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../front')));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

var imageNameDb = ''

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../front', 'index.html'));
});

app.get('/s3Url', async (req, res) => {
  const  {url,imageName}  = await generateUploadURL()
  res.send({url})
});

// read
app.get('/getAll', (request, response) => {
  const result = getDataFromRDS();
  
  result
  .then(data => response.json({data}))
  .catch(err => console.log(err));
});

// update
app.patch('/update', (request, response) => {
  const { id, fname,lname,dob,idType, state, docNum, expDate } = request.body;

  
  const result = updateNameById(id, fname,lname,dob,idType, state, docNum, expDate);
  
  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
});

// delete
app.delete('/delete/:id', (request, response) => {
  const { id } = request.params;
  const result = deleteRowById(id);
  
  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
});


app.listen(8080, () => console.log("listening on port 8080"))