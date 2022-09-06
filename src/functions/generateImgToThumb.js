import { Storage } from '@google-cloud/storage';
import sharp from 'sharp';

export async function generateImgToThumb(event, context) {
  console.log('===== HELLO, TRIGGER IS STARTED =====');

  // thumbNail 로 변환된 파일을 다시 write(저장) 할 때도, 트리거가 실행된다. (재귀의 일종)
  // thumb 폴더로 저장된 파일을 다시 읽어올 때, 함수를 종료한다.
  if (event.name.includes('thumb/')) return;

  // 미디어파일을 Stream 형식으로 Read / Write 할 수 있도록 Storage 선언
  const storage = new Storage().bucket(event.bucket);

  // event.name; // 2022/09/06/${uuidv4}/origin/강아지.jpg
  // 위와 같은 형식으로 저장했기에, /origin/ 을 기준으로 prefix, postfix 설정
  const prefix = event.name.split('/origin/')[0];
  const postfix = event.name.split('/origin/')[1];

  // Promise.all 을 통한 통합저장 (3회)
  await Promise.all(
    // 한 파일당 총 3회 변환 - 저장의 단계를 진행
    [
      { size: 320, fname: `${prefix}/thumb/s/${postfix}` },
      { size: 640, fname: `${prefix}/thumb/m/${postfix}` },
      { size: 1280, fname: `${prefix}/thumb/l/${postfix}` },
    ].map((el) => {
      return new Promise((resolve, reject) => {
        storage
          .file(event.name)
          .createReadStream() // 기존 파일 읽어오기
          .pipe(sharp().resize({ width: el.size })) // 사이즈에 맞는 썸네일 생성
          .pipe(storage.file(`${el.fname}`).createWriteStream()) // 생성된 썸네일 재 업로드
          .on('finish', () => resolve())
          .on('error', (e) => reject(console.log(e)));
      });
    }),
  );

  console.log('===== BYE, TRIGGER IS TERMINATED =====');
}
