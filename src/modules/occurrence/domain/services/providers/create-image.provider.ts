import { HttpException, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export class CreateImageProvider {
  private readonly logger = new Logger(CreateImageProvider.name);

  async execute(
    file: Express.Multer.File, // O tipo de arquivo que o Multer nos dá
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new HttpException('Nenhum arquivo de imagem fornecido.', 400));
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image', // Dizendo que é uma imagem
          folder: 'occurrences', // Organiza os uploads em uma pasta na Cloudinary
        },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary Error:', error);
            return reject(new HttpException('Falha no upload da imagem.', 500));
          }
          // Resolve com a URL segura da imagem
          resolve(result.secure_url);
        },
      );

      // Isso "conecta" o arquivo que recebemos com o stream de upload da Cloudinary
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
