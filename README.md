# ygopro2_updater
ygopro 2 updater


Hi there, so I will explain how to compile and use this updater.

1. You must install Node.Js from here: https://nodejs.org/en/download/
2. Now you can open command prompt and type:
        npm install electron --save-dev --save-exact 
   This will install electron.
3. Next, type: 
        npm install electron-packager -g
   This will install electron packager.
   
 4. To compile using Electron packager from the command line:

electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]
This will:

Find or download the correct release of Electron
Use that version of Electron to create a app in <out>/<appname>-<platform>-<arch> (this can be customized via an optional flag)
--platform and --arch can be omitted, in two cases:

If you specify --all instead, bundles for all valid combinations of target platforms/architectures will be created.
Otherwise, a single bundle for the host platform/architecture will be created.
For an overview of the other optional flags, run electron-packager --help or see usage.txt. For detailed descriptions, see the API documentation.

If appname is omitted, this will use the name specified by "productName" or "name" in the nearest package.json.

Characters in the Electron app name which are not allowed in all target platforms' filenames (e.g., /), will be replaced by hyphens (-).

You should be able to launch the app on the platform you built for. If not, check your settings and try again.

Sources: 
https://github.com/electron/electron
https://github.com/electron-userland/electron-packager
