# docusaurus 프로세스 pm2 등록

프로세스를 백그라운드에서 실행하고 서버가 재시작시 자동으로 시작등록

## 등록

```bash
npm install -g pm2

pm2 -v

cd ~/my-docs  # Docusaurus 프로젝트 폴더 이동
pm2 start npm --name "docusaurus" -- run start -- --host 0.0.0.0

pm2 list

pm2 logs docusaurus

pm2 save
pm2 startup

sudo env "PATH=$PATH:/home/administrator/.nvm/versions/node/v22.14.0/bin" /home/administrator/.nvm/versions/node/v22.14.0/lib/node_modules/pm2/bin/pm2 startup systemd -u administrator --hp /home/administrator
```

## 제거

```bash
pm2 stop docusaurus
pm2 restart docusaurus
pm2 delete docusaurus
pm2 list

```
