
// Módulos necesarios
const tf = require('@tensorflow/tfjs');
const tfnode = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');


// Ponemos las dimensiones del modelo
const IMG_SIZE = 100;

// Iniciamos la variable del modelo
let model = null;


// Función asíncrona para inicar la app
async function start() {
  const modelPath = path.resolve('./model.json');
  model = await tf.loadLayersModel(`file://${modelPath}`);

  await imageClassification(process.argv[2]);
}


// Constante con la función anónimo de leer la imagen
const readImage = path => {
  const imageBuffer = fs.readFileSync(path);

  const tfimage = tfnode.node
    .decodeImage(imageBuffer) 
    .resizeBilinear([parseInt(IMG_SIZE), parseInt(IMG_SIZE)]) 
    .div(tf.scalar(255))
    .mean(2)
    .expandDims(0)
    .expandDims(3);
  return tfimage;
};

const imageClassification = async imagePath => {
  // Obtenemos el tensor
  const tensor = readImage(imagePath);
  // Realizamos la predicción
  const prediccion = await model.predict(tensor).data();

  if (prediccion >= 0.5) {
      console.log("Es un PERRO");
  }
  else{
    console.log("Es un GATO");
  }
};

// Si la langitud de los argumentos no es distinto de 3 damos un error
if (process.argv.length !== 3)
  throw new Error('incorrect arguments: node main.js <IMAGE_FILE>');

start();
