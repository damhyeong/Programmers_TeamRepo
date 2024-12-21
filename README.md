<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest




## Description


## Project setup


## Deployment

```mermaid
flowchart TB
    
subgraph Local1 ["로컬 컴퓨터"]
    direction RL
    Local-branch-main1("Branch main")
    Local-branch-feat1("Branch feat")
    
    Local-branch-main1 --> Local-branch-feat1
end
subgraph Local2 ["로컬 컴퓨터"]
    direction LR
    Local-branch-main2("Branch main")
    Local-branch-feat2("Branch feat")

    Local-branch-main2 --> Local-branch-feat2
end

subgraph GitHubRepo ["GitHub"]
    direction BT
    subgraph feature ["Feature Branch"]
        Github-Branch-feat1("Feature1")
        Github-Branch-feat2("Feature2")
    end
    
    Github-Branch-main("main")
    
    feature -- Pull Request --> Github-Branch-main
end

Local1 --- feature
Local2 --- feature

subgraph GithubAction ["Github Actions"]
    direction TB
    Env("환경 변수")
    SSL("RSA 키")
    Cmd("어플리케이션 명령어")
end

Github-Branch-main --> GithubAction

subgraph AWS ["AWS"]
    direction TB
    subgraph VPC ["보안 네트워크 그룹(VPC)"]
        subgraph EC2
            PM2
            Nest("Nest Application")
            PM2 --> Nest
            Nginx("Nginx\n (https 구현 위함)")
            Nginx <---> Nest
        end
        subgraph RDS
            MariaDB
        end
        EC2 <---> RDS
    end
    subgraph Route53
        nest-aws.site("https nest-aws.site 도메인 \n (public IPv4)")
    end
    
    Nginx <--> Route53
    
end

GithubAction --> PM2

FrontEnd("웹 사이트")

Route53 <----> FrontEnd
```

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
