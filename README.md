# ygopro2_updater
ygopro 2 updater


Hi there, so I will explain how to compile and use this updater.

1. You must install Node.Js from here: https://nodejs.org/en/download/
2. Now you can open command prompt and type:
        npm install electron --save-dev --save-exact 
   This will install electron.
3. Now you need to install Yarn from here: https://yarnpkg.com/en/docs/install#windows-stable
   This will install Yarn to allow you to download packages.   
4. Now you can open command prompt and type:
        yarn add electron-builder --dev
   This will install Electron builder.
5. To compile, navigate to the folder that contains the updater in command prompt. Use the commands in electron builder to compile for target platform. The package.json already has windows by default.

Read more here for help:
https://github.com/electron/electron
https://github.com/electron-userland/electron-builder
