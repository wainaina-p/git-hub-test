echo "Switching to master branch"

git checkout master

echo "Building app..."

npm run build


echo "Deploying smart connect project to server..."

scp -r build/* root@192.180.4.131:/var/www/192.180.4.131/build

echo "Done!"