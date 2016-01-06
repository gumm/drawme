#Drawme
A little SVG based drawing program using Mongo and NodeJs (with Express) on the
back, and Jade Templates and Google Closure JS on the front.

###Become root
```bash
sudo su -
```

###Get some basic build tools onto the box
```bash
apt-get update
apt-get upgrade
apt-get install git-core build-essential openssl libssl-dev pkg-config figlet python-setuptools
```

###Get and install node from source
```bash
cd /usr/local/src
git clone git://github.com/nodejs/node.git 
cd node
git checkout v0.12.7-release
./configure
make
make install
```

###Install PM2 (For process management of node applications)
```bash
npm install pm2@latest -g
```

###Get and install Mongo DB
```bash
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
apt-get update
apt-get install -y mongodb-org
```

###Get and install Oracle Java - Needed to compile the JS
```bash
add-apt-repository ppa:webupd8team/java
apt-get install oracle-java8-installer
java -version
```

###Finally install the drawme app.
```bash
cd /opt
git clone https://github.com/gumm/drawme.git
```


###Use the projects scripted build tools to build and compile
```bash
cd drawme/
npm run-script build
npm run-script compile
```

###Create a settings_local.json file for stuff that is deploy specific
```bash
vi settings_local.json
```
```json
    {
      "jsIsCompiled": true,
      "mailUser": "some@gmail.com",
      "mailPass": "strongpassword",
      "siteUrl": "http://localhost:3000"
    }
```    

###Start Mongo
```bash
service mongod start
```

###Start the app using PM2 as process manager
```bash
pm2 start /opt/drawme/bin/www --name drawme --watch --log-date-format="YYYY-MM-DD HH:mm:ss.SSS" --max-memory-restart 200M
pm2 save
```

####Useful PM2 Commands for updating and service and log monitoring
```bash
pm2 pull drawme
pm2 logs
pm2 monit
```


