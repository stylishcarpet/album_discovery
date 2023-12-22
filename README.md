Build and Run
---
* `sudo docker build . -t album_discovery`
* `sudo docker run -e APP_SECRET=$(cat app_secret.secret) -e CLIENT_ID=$(cat client_id.secret) -e CLIENT_SECRET=$(cat client_secret.secret) -d --rm -p 443:8080 album_discovery`

Secrets
---
* app_secret.secret - made up and can be anything
* client_id.secret - from spotify developer portal
* client_secret.secret - from spotify developer portal

SSL Certs
---
* `sudo apt-get remove certbot`
* `sudo snap install --classic certbot`
* `sudo ln -s /snap/bin/certbot /usr/bin/certbot`
* `sudo certbot certonly --standalone`
*  copy keys to fullchain.pem and privkey.pem to root of repo
