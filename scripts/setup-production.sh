# Install NodeCG 8.x
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential

# Install NodeCG
sudo npm install -g bower
git clone https://github.com/nodecg/nodecg.git
cd nodecg
sudo npm install --production
sudo bower install --allow-root

# Install the bundle
mkdir cfg
echo '{}' > cfg/nodecg.json
echo '{}' > cfg/rtainjapan-layout.json
cd bundles
git clone https://github.com/Hoishin/rtainjapan-layouts.git
cd rtainjapan-layouts
sudo npm install --production
sudo bower install --allow-root
