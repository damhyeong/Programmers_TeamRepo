<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest




## Description


## Project setup


## Deployment


## Table Relation

```mermaid
flowchart BT
    
Meeting("meeting")

MeetingUsers("meeting_users")

Posts("posts")

Reply("reply")

ReplyLikes("reply_likes")

Topic("topic")

Users("users")

Meeting --> Users
Meeting --> Topic

MeetingUsers --> Meeting
MeetingUsers --> Users

Posts --> Users
Posts --> Meeting

Reply --> Posts
Reply --> Users
Reply --> Reply

ReplyLikes --> Reply
ReplyLikes --> Users
```





## Support



## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
