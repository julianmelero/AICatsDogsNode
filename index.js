const express = require("express");
const file_upload = require("express-fileupload")
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const sharp = require('sharp');




const app = express();
const port = 3000;

app.use(file_upload());
app.use(express.json());

const modelPath = path.resolve('model.json');


const fileToTensor = async (fileBuffer: Buffer ) => ({
  const { data, info } = await sharp(fileBuffer)
    .removeAlpha()
    .grayscale()
    .toBuffer({ resolveWithObject: true });
  // return imageToTensor(data, info);
});


// Función para cargar el modelo
const loadModel = async () => {
  const model = await tf.loadLayersModel(`file://${modelPath}`);  
  return model;
};

const model = loadModel();


app.post('/api/v1/catsdogs', (req, res) => {

  if (!req.files){
    return res.status(400).send(
     {"Error:":"No hay imagen" }
     );
  }


  let file = req.files.file;

  console.log(file.name.split(".").pop());
  
  if (req.is("multipart/form-data")) {
    return res.send("Yes!")
  }

});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});