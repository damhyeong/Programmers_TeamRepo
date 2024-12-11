CREATE TABLE users
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(255) NOT NULL UNIQUE,
    gender       VARCHAR(30)  NOT NULL DEFAULT 'female',
    age          INT          NOT NULL,
    password     VARCHAR(255) NOT NULL,
    profile_img  TEXT,
    introduction TEXT,
    created_at   DATETIME              DEFAULT CURRENT_TIMESTAMP
)
