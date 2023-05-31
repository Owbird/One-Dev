clear

rm -rf build


wails build -o onedev 

mkdir -p build/bin/DEBIAN
mkdir -p build/bin/usr/bin

mv build/bin/onedev build/bin/usr/bin

touch build/bin/DEBIAN/control

echo "Package: onedev" >> build/bin/DEBIAN/control
echo "Version: 1" >> build/bin/DEBIAN/control
echo "Architecture: amd64" >> build/bin/DEBIAN/control
echo "Maintainer: OneDev" >> build/bin/DEBIAN/control
echo "Description: All in one dev tools" >> build/bin/DEBIAN/control


chmod +x build/bin/usr/bin

mkdir -p build/bin/usr/share/icons/

cp appicon.png build/bin/usr/share/icons/appicon.png

chmod 644 build/bin/usr/share/icons/appicon.png


dpkg-deb --build build/bin  onedev.deb

wails build -platform windows -nsis