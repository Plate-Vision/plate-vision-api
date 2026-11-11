import { Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

export class DeleteImageProvider {
  private readonly logger = new Logger(DeleteImageProvider.name);

  async execute(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      this.logger.error(
        `Falha ao deletar imagem da Cloudinary: ${publicId}`,
        error.stack,
      );
    }
  }

  // Função auxiliar para extrair o public_id da URL
  extractPublicIdFromUrl(url: string): string | null {
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
