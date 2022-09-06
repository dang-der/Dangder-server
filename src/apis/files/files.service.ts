import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { getToday } from 'src/commons/libraries/utils';
import { v4 as uuidv4 } from 'uuid';

const { STORAGE_BUCKET, STORAGE_PROJECT_ID, STORAGE_KET_FILENAME } =
  process.env;

@Injectable()
export class FilesService {
  async upload({ files }) {
    // 파일을 클라우드 스토리지에 저장하는 로직
    const waitedFiles = await Promise.all(files);

    const bucket = STORAGE_BUCKET;
    const storage = new Storage({
      projectId: STORAGE_PROJECT_ID,
      keyFilename: STORAGE_KET_FILENAME,
    }).bucket(bucket);

    // Promise.all 을 이용한, 한번에 기다리기 + map 을 이용한 각 파일 배열화 처리
    const results = await Promise.all(
      waitedFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const fname = `${getToday()}/${uuidv4()}/origin/${file.filename}`;
            file
              .createReadStream()
              .pipe(storage.file(fname).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${fname}`))
              .on('error', () => reject('Fail !!'));
          }),
      ),
    );

    return results;
  }

  // 파일 이름(배열) 을 이용한, 클라우드 저장소 파일 삭제
  async delete({ fileNames }) {
    // Creates a client
    const bucket = STORAGE_BUCKET;
    const storage = new Storage({
      projectId: STORAGE_PROJECT_ID,
      keyFilename: STORAGE_KET_FILENAME,
    }).bucket(bucket);

    try {
      await Promise.all(
        fileNames.map((fileName: string) => storage.file(fileName).delete()),
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
