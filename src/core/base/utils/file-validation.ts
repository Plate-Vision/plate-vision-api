import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

export function saveFileWithFormat(): MulterOptions {
  const saveFileWithFormatInParams: MulterOptions = {
    storage: diskStorage({
      destination: (_req, _, cb) => {
        return cb(null, './tmp');
      },
      filename: (_req, file, cb) => {
        return cb(null, file.originalname);
      },
    }),
  };

  return saveFileWithFormatInParams;
}
