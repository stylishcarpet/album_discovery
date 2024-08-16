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

SSL Cert Renewal
---
The certs will expire and be auto renewed but not placed in the correct location, copy them over
* cp /etc/letsencrypt/live/stylishcar.pet/fullchain.pem album_discovery
* cp /etc/letsencrypt/live/stylishcar.pet/privkey.pem album_discovery
* sudo chown user:group album_discovery/fullchain.pem
* sudo chown user:group album_discovery/privkey.pem
