# PiPer-js-only

[PiPer](https://github.com/amarcu5/PiPer.git) is the browser extension to watch video Picture in Picture. It adds picture in picture toolbar icon on youtube toolbar and can display subtitle in picture in picture window. It works well on macOS 12.

Although PiPer has desktop browser extensions for Safari and Chrome, extension for iOS/iPadOS is not available at this time. As it has not been updated since Nov. 2019, it is unlikely that a new version will come out in the future.

So, I copied correspoing javascript files from PiPer git repository and made it available to apps support userscript([Userscipts](https://apps.apple.com/us/app/userscripts/id1463298887), [StopTheMadness](https://apps.apple.com/us/app/stopthemadness-mobile/id1583082931), etc.)

## Userscript

Compressed js file by Google-closure-compiler
```
https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-compressed/piper-compressed.js
```

Readable one for debugging
```
https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-readable/piper.js
```

## Loading remote js file

```
const loadScript = async (url) => {
  const response = await fetch(url);
  const script = await response.text();
  new Function(script)();
}

const piper = "https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-readable/piper.js";

loadScript(piper);
```
