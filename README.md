# Infinity web

## Contents
1. [Images](#images)
2. [Install with docker](#install-with-docker)
3. [Create new account](#create-new-account)
4. [Admin page](#admin-page)

## Images

![image 1](https://github.com/ImperialBreakCode/infinity-web/blob/main/images/img.png)
![image 2](https://github.com/ImperialBreakCode/infinity-web/blob/main/images/img1.png)
![image 3](https://github.com/ImperialBreakCode/infinity-web/blob/main/images/img2.png)
![image 4](https://github.com/ImperialBreakCode/infinity-web/blob/main/images/img3.png)
![image 4](https://github.com/ImperialBreakCode/infinity-web/blob/main/images/img4.png)

## Install with docker

1. Run docker compose 
```
docker compose up
```

2. Create database tables
execute the command below inside the `web` container
```
flask main-cmd tb-create
```

3. Create Super user
execute the command below inside the `web` container
```
flask main-cmd su-create
```

## Create new account
1. Login as super user at [http://localhost:5000/login](http://localhost:5000/login).
 - su username: admin@infinity.acc
 - su password: georgia123
   
2. Then go to [http://localhost:5000/register](http://localhost:5000/register) and create new account. Only super users can access this page.

## Admin page
[http://localhost:5000/admin/](http://localhost:5000/admin/)
