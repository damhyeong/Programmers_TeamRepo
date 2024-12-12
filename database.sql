CREATE TABLE users
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(255) NOT NULL UNIQUE,
    gender       VARCHAR(30)  NOT NULL,
    age          INT          NOT NULL,
    password     VARCHAR(255) NOT NULL,
    profile_img  TEXT,
    introduction TEXT,
    created_at   DATETIME              DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topics # 수업 때 테이블 이름을 "s" 붙이는 게 좋다 해서 붙였습니다.
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, # 나중에 topic 으로 검색했을 때, 해당 스터디 혹은 그룹을 검색하기 위함.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    owner_user_id INT          NOT NULL,
    topic_id      INT          NOT NULL,
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    start_date    DATETIME     NOT NULL,
    end_date      DATETIME     NOT NULL,
    age           INT          NULL, # 나이 제한이 없을 수도 있으므로.
    gender        VARCHAR(30)  NULL, # 성별 제한이 없을 수도 있으므로.
    max_members   INT          NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users (id),
    FOREIGN KEY (topic_id) REFERENCES topics (id)
);

CREATE TABLE room_users # 네이밍 컨벤션 맞추기
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member', # 방을 처음 만드는 사람 일 경우, 따로 "admin" 으로 보내기 - 추후, 방에서 역할을 생성할 수도 있게끔.
    is_active boolean DEFAULT TRUE, # 처음 그룹 내의 유저가 초대되었을 때, 그 사람은 현재 활성화 상태일 것이다.
    FOREIGN KEY (room_id) references rooms (id),
    FOREIGN KEY (user_id) references users (id)
);

CREATE TABLE posts # posting 보다는 posts 가 더 적합하다고 판단함.
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    img TEXT, # 추후 이미지를 가져올 경로.
    content TEXT, # 일반적인 글이거나, 마크다운 텍스트.
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) references rooms (id),
    FOREIGN KEY (user_id) references users (id)
);

CREATE TABLE reply
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    post_id    INT  NOT NULL,
    user_id    INT  NOT NULL,
    content    TEXT NOT NULL,
    # NULL 이라면, 대댓글이 아닌 최상위 댓글이다.
    reply_id   INT      DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE reply_likes # 이 제목이 좀 더 목적에 맞는 것 같아서 바꿨습니다!
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    reply_id   INT NOT NULL, # 좋아요 한 댓글의 PK
    user_id    INT NOT NULL, # 좋아요 한 유저 PK
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reply_id) REFERENCES reply (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);


