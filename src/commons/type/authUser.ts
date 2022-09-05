export interface IOAuthUser {
  user: {
    email: string;
    password: string;
    // 테스트를 위한 임시 추가.
    // 향후 user entity 에서 nullable 하게 처리 필요.
    pet: boolean;
    phone: string;
  };
}
