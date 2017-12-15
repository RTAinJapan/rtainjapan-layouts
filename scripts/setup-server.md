# Production Setup

This setup assumes Ubuntu 16.04 on Digital Ocean Droplets.

## Setup Server
https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04

## Install Nginx
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04

## Setup SSL
https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04


## Install NodeCG and the bundle
Run `setup-production.sh`

## Setup Production
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04

```sh
sudo npm install -g pm2
pm2 start index.js
pm2 startup systemd
# Copy and run the output script
sudo nano /etc/nginx/sites-available/default
```

Replace `location /`
```
. . .
  location / {
    proxy_pass http://localhost:9090;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

```sh
sudo nginx -t
sudo systemctl restart nginx
```