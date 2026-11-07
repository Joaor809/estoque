import multer from "multer";
import { request } from "node:http";
import path from "node:path";

// Configura onde e como os arquivos serão armazenados.
const storage = multer.diskStorage({

    // Define a pasta onde as imagens serão salvas.
    destination: (req, file, cb) => {
        cb(null, path.resolve("uploads/products"));
    },
    // req: request
    // file: arquivo
    // cb: callback


    // Define o nome do arquivo que será salvo.
    filename: (req, file, cb) => {

        // Obtém a extensão original da imagem (.png, .jpg, etc.).
        const extension = path.extname(file.originalname);

        // Gera um nome único usando a data atual e mantém a extensão.
        cb(null, `${Date.now()}${extension}`);
    }
});

// Cria a configuração do Multer utilizando o armazenamento definido acima.
const upload = multer({ storage });

// Exporta o Multer para ser utilizado nas rotas.
export default upload;