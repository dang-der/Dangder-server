# TEAM VIEWPOINT

# Dangder

![Dangder_Logo_2x1](https://user-images.githubusercontent.com/107927849/193513415-c07e95f0-04fb-42fb-a65b-366fc02db5b8.jpg)


860만 반려동물 시대를 맞이한 대한민국! ([기사](https://www.korea.kr/news/pressReleaseView.do?newsId=156448339))  🐶 애견인들은 이미 다양한 커뮤니티 안에서 여러 활동을 하고 있습니다.

반려동물의 다양한 경험과 활동을 위해 열심을 다하는 애견인들을 위한 프로젝트 🐾 **‘Dangder’** (댕더) 는

반려견의 Play-Mate 를 찾아 함께함을 통해 반려견(댕댕이) ‘멍라밸'의 질을 높이기 위한 서비스로,

친구와 함께 할 때 더 즐거워하는 사랑스러운 우리 댕댕이들을 위해

플랫폼을 통해 산책, 간식, 애견카페(애견수영장 애견수영장 애견캠핑 등..)탐방을 함께 할 친구를 찾고

서로 마음이 맞는 친구를 매칭시켜 채팅을 통해 함께 만나 볼 수 있는 기능을 제공하여

더 행복한 멍라벨을 누릴 수 있도록 지원하는

애견인과 댕댕이를 위한 프로젝트입니다. 🦴

### 혹시.. 댕더세요? ❤️

댕댕이의 사랑을 위하여. ‘댕댕이, 라이프, 업' - Dangder🔥

<br><br>

# 팀원 소개

<img width="1512" alt="스크린샷 2022-10-03 오후 3 34 37" src="https://user-images.githubusercontent.com/107927849/193514820-1b343fd7-2eec-4fa3-b69c-5720ceeb7a1a.png">

<br><br>

# 기술 스택

<img width="1512" alt="스크린샷 2022-10-03 오후 3 37 20" src="https://user-images.githubusercontent.com/107927849/193515151-8791aa1c-e6a3-43d0-8dec-5450a82a4bfd.png">

<br><br>

# Flow Chart

![user-flow chart](https://user-images.githubusercontent.com/107927849/193515816-da9e294c-b227-4c7f-b3c9-463fc7c1cc21.png)

<br><br>

# ERD

![Dangder 2 0](https://user-images.githubusercontent.com/107927849/193516288-abebf469-8698-4548-b86c-83743b45b082.png)

<br><br>

# API

![api](https://user-images.githubusercontent.com/107927849/193517291-a4bce0da-82fb-43bc-a476-8aa22f16b780.png)

<br><br>

# 서버 폴더구조

dangder-server
 ┣ .vscode
 ┃ ┗ settings.json
 ┣ elk
 ┃ ┗ logstash
 ┃ ┃ ┣ logstash.conf
 ┃ ┃ ┣ mysql-connector-java-8.0.28.jar
 ┃ ┃ ┗ search-avoid-breed-template.json
 ┣ frontend
 ┃ ┗ payment.html
 ┣ src
 ┃ ┣ apis
 ┃ ┃ ┣ adminUsers
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ adminUser.entity.ts
 ┃ ┃ ┃ ┣ adminUsers.module.ts
 ┃ ┃ ┃ ┣ adminUsers.resolver.ts
 ┃ ┃ ┃ ┗ adminUsers.service.ts
 ┃ ┃ ┣ auths
 ┃ ┃ ┃ ┣ auths.controller.ts
 ┃ ┃ ┃ ┣ auths.module.ts
 ┃ ┃ ┃ ┣ auths.resolver.ts
 ┃ ┃ ┃ ┗ auths.service.ts
 ┃ ┃ ┣ avoidBreeds
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┗ avoidBreed.input.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ avoidBreed.entity.ts
 ┃ ┃ ┃ ┣ avoidBreeds.module.ts
 ┃ ┃ ┃ ┣ avoidBreeds.resolver.ts
 ┃ ┃ ┃ ┗ avoidBreeds.service.ts
 ┃ ┃ ┣ blockUsers
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┣ createBlockUser.input.ts
 ┃ ┃ ┃ ┃ ┗ updateBlockUser.input.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ blockUser.entity.ts
 ┃ ┃ ┃ ┣ blockUsers.module.ts
 ┃ ┃ ┃ ┣ blockUsers.resolver.ts
 ┃ ┃ ┃ ┗ blockUsers.service.ts
 ┃ ┃ ┣ breeds
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ breed.entity.ts
 ┃ ┃ ┃ ┣ breeds.module.ts
 ┃ ┃ ┃ ┣ breeds.resolver.ts
 ┃ ┃ ┃ ┗ breeds.service.ts
 ┃ ┃ ┣ characters
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ character.entity.ts
 ┃ ┃ ┃ ┣ characters.module.ts
 ┃ ┃ ┃ ┣ characters.resolver.ts
 ┃ ┃ ┃ ┗ characters.service.ts
 ┃ ┃ ┣ chatMessages
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┗ chatMessageInput.input.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ chatMessage.entity.ts
 ┃ ┃ ┃ ┣ chatMessages.module.ts
 ┃ ┃ ┃ ┣ chatMessages.resolver.ts
 ┃ ┃ ┃ ┗ chatMessages.service.ts
 ┃ ┃ ┣ chatRooms
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┗ chatRoomsOutput.output.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ chatRoom.entity.ts
 ┃ ┃ ┃ ┣ chatRooms.module.ts
 ┃ ┃ ┃ ┣ chatRooms.resolver.ts
 ┃ ┃ ┃ ┗ chatRooms.service.ts
 ┃ ┃ ┣ dogs
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┣ aroundDog.output.ts
 ┃ ┃ ┃ ┃ ┣ createDog.input.ts
 ┃ ┃ ┃ ┃ ┗ updateDog.input.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ dog.entity.ts
 ┃ ┃ ┃ ┣ dogs.module.ts
 ┃ ┃ ┃ ┣ dogs.resolver.ts
 ┃ ┃ ┃ ┗ dogs.service.ts
 ┃ ┃ ┣ dogsImages
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ dogImage.entity.ts
 ┃ ┃ ┃ ┣ dogsImages.module.ts
 ┃ ┃ ┃ ┣ dogsImages.resolver.ts
 ┃ ┃ ┃ ┗ dogsImages.service.ts
 ┃ ┃ ┣ donateIOs
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ donateIO.entity.ts
 ┃ ┃ ┃ ┣ donateIOs.module.ts
 ┃ ┃ ┃ ┣ donateIOs.resolver.ts
 ┃ ┃ ┃ ┗ donateIOs.service.ts
 ┃ ┃ ┣ donates
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ donate.entity.ts
 ┃ ┃ ┃ ┣ donates.module.ts
 ┃ ┃ ┃ ┣ donates.resolver.ts
 ┃ ┃ ┃ ┗ donates.service.ts
 ┃ ┃ ┣ files
 ┃ ┃ ┃ ┣ files.module.ts
 ┃ ┃ ┃ ┣ files.resolver.ts
 ┃ ┃ ┃ ┗ files.service.ts
 ┃ ┃ ┣ imports
 ┃ ┃ ┃ ┣ imports.module.ts
 ┃ ┃ ┃ ┣ imports.resolver.ts
 ┃ ┃ ┃ ┗ imports.services.ts
 ┃ ┃ ┣ interests
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ interest.entity.ts
 ┃ ┃ ┃ ┣ interests.module.ts
 ┃ ┃ ┃ ┣ interests.resolver.ts
 ┃ ┃ ┃ ┗ interests.service.ts
 ┃ ┃ ┣ likes
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┣ createLike.input.ts
 ┃ ┃ ┃ ┃ ┣ createLike.output.ts
 ┃ ┃ ┃ ┃ ┗ todayLikeDog.output.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ like.entity.ts
 ┃ ┃ ┃ ┣ likes.module.ts
 ┃ ┃ ┃ ┣ likes.resolver.ts
 ┃ ┃ ┃ ┗ likes.service.ts
 ┃ ┃ ┣ locations
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┗ location.input.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ location.entity.ts
 ┃ ┃ ┃ ┣ locations.module.ts
 ┃ ┃ ┃ ┣ locations.resolver.ts
 ┃ ┃ ┃ ┗ locations.service.ts
 ┃ ┃ ┣ orders
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┣ createOrder.input.ts
 ┃ ┃ ┃ ┃ ┗ updateOrder.input.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ order.entity.ts
 ┃ ┃ ┃ ┣ orders.module.ts
 ┃ ┃ ┃ ┣ orders.resolver.ts
 ┃ ┃ ┃ ┗ orders.service.ts
 ┃ ┃ ┣ passTickets
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ passTicket.entity.ts
 ┃ ┃ ┃ ┣ passTickets.module.ts
 ┃ ┃ ┃ ┣ passTickets.resolver.ts
 ┃ ┃ ┃ ┗ passTickets.service.ts
 ┃ ┃ ┣ payments
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ payment.entity.ts
 ┃ ┃ ┃ ┣ payments.module.ts
 ┃ ┃ ┃ ┣ payments.resolver.ts
 ┃ ┃ ┃ ┗ payments.service.ts
 ┃ ┃ ┣ products
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┣ createProduct.input.ts
 ┃ ┃ ┃ ┃ ┗ updateProduct.input.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ product.entity.ts
 ┃ ┃ ┃ ┣ products.module.ts
 ┃ ┃ ┃ ┣ products.resolver.ts
 ┃ ┃ ┃ ┗ products.service.ts
 ┃ ┃ ┣ reports
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┗ createReport.input.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ report.entity.ts
 ┃ ┃ ┃ ┣ reports.module.ts
 ┃ ┃ ┃ ┣ reports.resolver.ts
 ┃ ┃ ┃ ┗ reports.service.ts
 ┃ ┃ ┗ users
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┣ createUser.input.ts
 ┃ ┃ ┃ ┃ ┣ updateUser.input.ts
 ┃ ┃ ┃ ┃ ┗ userOutput.output.ts
 ┃ ┃ ┃ ┣ entities
 ┃ ┃ ┃ ┃ ┗ user.entity.ts
 ┃ ┃ ┃ ┣ users.module.ts
 ┃ ┃ ┃ ┣ users.resolver.ts
 ┃ ┃ ┃ ┗ users.service.ts
 ┃ ┣ commons
 ┃ ┃ ┣ auth
 ┃ ┃ ┃ ┣ gql-auth.guard.ts
 ┃ ┃ ┃ ┣ jwt-access.strategy.ts
 ┃ ┃ ┃ ┣ jwt-admin-access.strategy.ts
 ┃ ┃ ┃ ┣ jwt-admin-refresh.strategy.ts
 ┃ ┃ ┃ ┣ jwt-refresh.strategy.ts
 ┃ ┃ ┃ ┣ jwt-social-google.strategy.ts
 ┃ ┃ ┃ ┣ jwt-social-kakao.strategy.ts
 ┃ ┃ ┃ ┗ jwt-social-naver.strategy.ts
 ┃ ┃ ┣ filter
 ┃ ┃ ┃ ┗ http-exception.filter.ts
 ┃ ┃ ┣ graphql
 ┃ ┃ ┃ ┗ schema.gql
 ┃ ┃ ┣ libraries
 ┃ ┃ ┃ ┗ utils.ts
 ┃ ┃ ┣ mailTemplates
 ┃ ┃ ┃ ┣ layouts
 ┃ ┃ ┃ ┃ ┣ footer.pug
 ┃ ┃ ┃ ┃ ┣ header.pug
 ┃ ┃ ┃ ┃ ┣ layout.pug
 ┃ ┃ ┃ ┃ ┗ styles.css
 ┃ ┃ ┃ ┗ tokenSend.pug
 ┃ ┃ ┗ type
 ┃ ┃ ┃ ┣ authUser.ts
 ┃ ┃ ┃ ┗ context.ts
 ┃ ┣ gateways
 ┃ ┃ ┗ chat
 ┃ ┃ ┃ ┣ chat.gateway.ts
 ┃ ┃ ┃ ┣ chat.module.ts
 ┃ ┃ ┃ ┗ chat.service.ts
 ┃ ┣ app.controller.ts
 ┃ ┣ app.module.ts
 ┃ ┗ main.ts
 ┣ test
 ┃ ┣ app.e2e-spec.ts
 ┃ ┗ jest-e2e.json
 ┣ .dockerignore
 ┣ .env.dev
 ┣ .eslintrc.js
 ┣ .gitignore
 ┣ .prettierrc
 ┣ Dockerfile
 ┣ README.md
 ┣ docker-compose.dev.yaml
 ┣ gcp-file-storage-dangder.json
 ┣ nest-cli.json
 ┣ package.json
 ┣ tsconfig.build.json
 ┣ tsconfig.json
 ┗ yarn.lock
