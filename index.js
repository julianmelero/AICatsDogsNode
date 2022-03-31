
// Cargamos los módulos necesarios, como son Tensorflow para Node y jimp para manipular imágenes

const tf = require('@tensorflow/tfjs-node');
const Jimp = require('jimp');

// Directorio para el modelo
const MODEL_DIR_PATH = `${"./"}`;

// Directorio y archivo de la imagen
const IMAGE_FILE_PATH = "./dog.jpg";

// Función asíncrona para la carga del modelo, de la imagen, transformación y predicción

(async () => {

  
  
  const model = await tf.loadLayersModel(`file://${MODEL_DIR_PATH}/model.json`);
  
  const image = await Jimp.read(IMAGE_FILE_PATH);

  // Redimensionamos la imagen a 1200 * 600 y la alineamos al centro
  image.cover(1200, 600, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

  const NUM_OF_CHANNELS = 1;
  // EL modelo requiere un array de 100*100*1
  let values = new Float32Array(100 * 100 * NUM_OF_CHANNELS);


  // Normalizamos
  let i = 0;
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
    pixel.r = pixel.r / 127.0 - 1;
    pixel.g = pixel.g / 127.0 - 1;
    pixel.b = pixel.b / 127.0 - 1;
    pixel.a = pixel.a / 127.0 - 1;
    values[i * NUM_OF_CHANNELS + 0] = pixel.r;
    values[i * NUM_OF_CHANNELS + 1] = pixel.g;
    values[i * NUM_OF_CHANNELS + 2] = pixel.b;
    i++;
  });

  const outShape = [100, 100, NUM_OF_CHANNELS];
  let img_tensor = tf.tensor3d(values, outShape, 'float32');
  img_tensor = img_tensor.expandDims(0);

  const prediction = await model.predict(img_tensor).dataSync();

  if (prediction >= 0.5){
      console.log("Es un perro");
  }
  else{
      console.log("Es un gato");
  }
  console.log(prediction);



})();