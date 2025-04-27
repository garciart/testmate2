# TestMate 2 Walkthrough

- [Introduction](#introduction)
- [Setup](#setup)
- [Create the Application](#create-the-application)

> **NOTE** - This repo does not contain default files created by `npx create-expo-app`, such as:
>
> - `.expo`
> - `assets`
> - `node_modules`
> - `expo-env.d.ts`
> - `package-lock.json`
> - `package.json`
> - `tsconfig.json.`

-----

## Introduction

This is a walkthrough of how to develop and run the TestMate 2 mobile quiz application.

References:

- npm Docs <https://docs.npmjs.com/> - Documentation for the npm registry, website, and command-line interface.
- Expo Documentation <https://docs.expo.dev/> - Get started creating apps with Expo.

-----

## Setup

1. If you have not done so yet, install Node.js and the Node Package Manger (NPM). You can install it directly from <https://nodejs.org/en/download> or use a Node Version Manager (NVM) (see <https://github.com/nvm-sh/nvm> for Linux or <https://github.com/coreybutler/nvm-windows> for Windows).
2. Go to <https://developer.android.com/studio> and download Android Studio.
3. Install and start Android Studio (you will need administrative privileges).
4. Select **More Actions** -> **Virtual Device Manager** -> **Create virtual device...**.
5. Select the phone you would like to develop for (I used the Pixel 7a), then select the default values.
6. Close the Virtual Device Manager and Android Studio.

-----

## Create the Application

To create, open and run your application, you will use Node Package Execute (`npx`) and Expo commands.

> **NOTE** - You will not install or run the Expo CLI commands globally (`npm install -g expo-cli`). Global installations of the Expo CLI are deprecated; use the NPM package runner (`npx`) to run Expo using local packages within your project (e.g., `npx expo start`, etc.) instead of `expo start`.

1. Open a Terminal.
2. Run the following commands:

    ```sh
    # Check your Node and NPM versions (I used Node.js v22 and NPM v10)
    node --version
    npm --version
    # Go to your Android Studio Projects directory
    cd ~/AndroidStudioProjects
    # Initialize the app using the default template, which includes recommended tools,
    # such as Expo CLI, Expo Router library and TypeScript configuration enabled.
    # See https://docs.expo.dev/more/create-expo/#options
    npx create-expo-app@latest testmate2 --template default --yes
    # Go to you project directory
    cd testmate2
    # Remove boilerplate code
    # When asked "Do you want to move existing files to /app-example instead of deleting them? (Y/n):",
    # select 'Y' to save the files for now
    npm run-script reset-project
    # Start the Expo development server
    npx expo start
    ```

3. Press <kbd>a</kbd> to open an emulator and the application.
4. To edit the app, you do not need to stop the Expo development server. However, if you must stop the server, press <kbd>Ctrl</kbd> + <kbd>c</kbd> in the terminal.

***To be continued...***