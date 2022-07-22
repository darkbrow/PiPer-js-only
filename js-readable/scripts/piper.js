// ==UserScript==
// @name         PiPer-js-only
// @namespace    https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main
// @homepage     https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main
// @version      1.0.1
// @encoding     utf-8
// @description  Add Picture in Picture button on Youtube toolbar. And fix to show subtitle in PIP window. This script is blatantly copied from amarcu5's good safari extension PiPer(https://github.com/amarcu5/PiPer.git).
// @icon         https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/toolbar/icon.png
// @author       amarcu5
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @compatible   safari
// @downloadURL  https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-readable/scripts/piper.js
// @updateURL    https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-readable/scripts/piper.js
// @grant        GM.xmlHttpRequest
// @connect      youtube.com
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

var a;a||(a=!0,(()=>{// Input 0
const LOGGING_LEVEL$$module$defines = 0;
const BROWSER$$module$defines = 0;
var module$defines = {};
module$defines.BROWSER = BROWSER$$module$defines;
module$defines.LOGGING_LEVEL = LOGGING_LEVEL$$module$defines;
// Input 1
const loggingPrefix$$module$logger = "[PiPer] ";
const LoggingLevel$$module$logger = {ALL:0, TRACE:10, INFO:20, WARNING:30, ERROR:40,};
const trace$$module$logger = LoggingLevel$$module$logger.TRACE >= LOGGING_LEVEL$$module$defines ? console.trace.bind(console) : function() {
};
const info$$module$logger = LoggingLevel$$module$logger.INFO >= LOGGING_LEVEL$$module$defines ? console.info.bind(console, loggingPrefix$$module$logger) : function() {
};
const warn$$module$logger = LoggingLevel$$module$logger.WARNING >= LOGGING_LEVEL$$module$defines ? console.warn.bind(console, loggingPrefix$$module$logger) : function() {
};
const error$$module$logger = LoggingLevel$$module$logger.ERROR >= LOGGING_LEVEL$$module$defines ? console.error.bind(console, loggingPrefix$$module$logger) : function() {
};
var module$logger = {};
module$logger.LoggingLevel = LoggingLevel$$module$logger;
module$logger.error = error$$module$logger;
module$logger.info = info$$module$logger;
module$logger.trace = trace$$module$logger;
module$logger.warn = warn$$module$logger;
// Input 2
const Browser$$module$common = {UNKNOWN:0, SAFARI:1, CHROME:2,};
const getBrowser$$module$common = function() {
  if (BROWSER$$module$defines != Browser$$module$common.UNKNOWN) {
    return BROWSER$$module$defines;
  }
  if (/Safari/.test(navigator.userAgent) && /Apple/.test(navigator.vendor)) {
    return Browser$$module$common.SAFARI;
  }
  if (/Chrome/.test(navigator.userAgent) && /Google/.test(navigator.vendor)) {
    return Browser$$module$common.CHROME;
  }
  return Browser$$module$common.UNKNOWN;
};
let PiperResource$$module$common;
let currentResource$$module$common = null;
const getResource$$module$common = function() {
  return currentResource$$module$common;
};
const setResource$$module$common = function(resource) {
  currentResource$$module$common = resource;
};
const getExtensionURL$$module$common = function(path) {
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      return safari.extension.baseURI + path;
    case Browser$$module$common.CHROME:
      return chrome.runtime.getURL(path);
    case Browser$$module$common.UNKNOWN:
    default:
      return path;
  }
};
const bypassBackgroundTimerThrottling$$module$common = function() {
  if (!currentResource$$module$common.captionElement) {
    warn$$module$logger("Unnecessary bypassing of background timer throttling on page without caption support");
  }
  const request = new XMLHttpRequest();
  request.open("GET", getExtensionURL$$module$common("scripts/fix.js"));
  request.onload = function() {
    const script = document.createElement("script");
    script.setAttribute("type", "module");
    script.appendChild(document.createTextNode(request.responseText));
    document.head.appendChild(script);
  };
  request.send();
};
var module$common = {};
module$common.Browser = Browser$$module$common;
module$common.bypassBackgroundTimerThrottling = bypassBackgroundTimerThrottling$$module$common;
module$common.getBrowser = getBrowser$$module$common;
module$common.getExtensionURL = getExtensionURL$$module$common;
module$common.getResource = getResource$$module$common;
module$common.setResource = setResource$$module$common;
// Input 3
const CHROME_PLAYING_PIP_ATTRIBUTE$$module$video = "data-playing-picture-in-picture";
const eventListeners$$module$video = [];
const togglePictureInPicture$$module$video = function(video) {
  const playingPictureInPicture = videoPlayingPictureInPicture$$module$video(video);
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      if (playingPictureInPicture) {
        video.webkitSetPresentationMode("inline");
      } else {
        video.webkitSetPresentationMode("picture-in-picture");
      }
      break;
    case Browser$$module$common.CHROME:
      if (playingPictureInPicture) {
        const script = document.createElement("script");
        script.textContent = "document.exitPictureInPicture()";
        document.head.appendChild(script);
        script.remove();
      } else {
        video.removeAttribute("disablepictureinpicture");
        video.requestPictureInPicture();
      }
      break;
    case Browser$$module$common.UNKNOWN:
    default:
      break;
  }
};
const addPictureInPictureEventListener$$module$video = function(listener) {
  const index = eventListeners$$module$video.indexOf(listener);
  if (index == -1) {
    eventListeners$$module$video.push(listener);
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI) {
    document.addEventListener("webkitpresentationmodechanged", videoPresentationModeChanged$$module$video, {capture:true,});
  }
};
const removePictureInPictureEventListener$$module$video = function(listener) {
  const index = eventListeners$$module$video.indexOf(listener);
  if (index > -1) {
    eventListeners$$module$video.splice(index, 1);
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI && eventListeners$$module$video.length == 0) {
    document.removeEventListener("webkitpresentationmodechanged", videoPresentationModeChanged$$module$video);
  }
};
const dispatchPictureInPictureEvent$$module$video = function(video) {
  const expectedVideo = getResource$$module$common().videoElement(true);
  if (video != expectedVideo) {
    return;
  }
  const isPlayingPictureInPicture = videoPlayingPictureInPicture$$module$video(video);
  if (isPlayingPictureInPicture) {
    info$$module$logger("Video entering Picture in Picture mode");
  } else {
    info$$module$logger("Video leaving Picture in Picture mode");
  }
  const eventListenersCopy = eventListeners$$module$video.slice();
  for (let listener; listener = eventListenersCopy.pop();) {
    listener(video, isPlayingPictureInPicture);
  }
};
const videoPresentationModeChanged$$module$video = function(event) {
  const video = event.target;
  dispatchPictureInPictureEvent$$module$video(video);
};
const videoPlayingPictureInPicture$$module$video = function(video) {
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      return video.webkitPresentationMode == "picture-in-picture";
    case Browser$$module$common.CHROME:
      return video.hasAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video);
    case Browser$$module$common.UNKNOWN:
    default:
      return false;
  }
};
const videoDidEnterPictureInPicture$$module$video = function(event) {
  const video = event.target;
  video.setAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video, true);
  dispatchPictureInPictureEvent$$module$video(video);
  video.addEventListener("leavepictureinpicture", function(event) {
    video.removeAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video);
    dispatchPictureInPictureEvent$$module$video(video);
  }, {once:true});
};
const addVideoElementListeners$$module$video = function() {
  const elements = document.getElementsByTagName("video");
  for (let index = 0, element; element = elements[index]; index++) {
    element.addEventListener("enterpictureinpicture", videoDidEnterPictureInPicture$$module$video);
  }
};
var module$video = {};
module$video.addPictureInPictureEventListener = addPictureInPictureEventListener$$module$video;
module$video.addVideoElementListeners = addVideoElementListeners$$module$video;
module$video.removePictureInPictureEventListener = removePictureInPictureEventListener$$module$video;
module$video.togglePictureInPicture = togglePictureInPicture$$module$video;
module$video.videoPlayingPictureInPicture = videoPlayingPictureInPicture$$module$video;
// Input 4
const localizations$$module$localization = {};
localizations$$module$localization["button-title"] = {"en":"Open Picture in Picture mode", "ko":"화면 속 화면", "de":"Bild-in-Bild starten", "nl":"Beeld in beeld starten", "fr":"D\u00e9marrer Image dans l\u2019image",};
localizations$$module$localization["donate"] = {"en":"Donate", "de":"Spenden",};
localizations$$module$localization["donate-small"] = {"en":"Small donation",};
localizations$$module$localization["donate-medium"] = {"en":"Medium donation",};
localizations$$module$localization["donate-large"] = {"en":"Grand donation",};
localizations$$module$localization["total-donations"] = {"en":"Total donations:",};
localizations$$module$localization["donate-error"] = {"en":"In-app purchase unavailable",};
localizations$$module$localization["report-bug"] = {"en":"Report a bug", "de":"Einen Fehler melden",};
localizations$$module$localization["options"] = {"en":"Options",};
localizations$$module$localization["install-thanks"] = {"en":"Thanks for adding PiPer!",};
localizations$$module$localization["enable"] = {"en":"Enable",};
localizations$$module$localization["safari-disabled-warning"] = {"en":"Extension is currently disabled, enable in Safari preferences",};
localizations$$module$localization["chrome-flags-open"] = {"en":"Open Chrome Flags",};
localizations$$module$localization["chrome-flags-warning"] = {"en":'Before you get started you need to enable the chrome flag [emphasis]"SurfaceLayer objects for videos"[/emphasis]',};
const defaultLanguage$$module$localization = "en";
const localizedString$$module$localization = function(key, language = navigator.language.substring(0, 2)) {
  const localizationsForKey = localizations$$module$localization[key];
  if (localizationsForKey) {
    let string = localizationsForKey[language] || localizationsForKey[defaultLanguage$$module$localization];
    if (string) {
      return string;
    }
  }
  error$$module$logger(`No localized string found for key '${key}'`);
  return "";
};
const localizedStringWithReplacements$$module$localization = function(key, replacements, language) {
  let string = localizedString$$module$localization(key, language);
  for (let index = replacements.length; index--;) {
    let replacement = replacements[index];
    if (/[^-_0-9a-zA-Z\/]/.test(replacement[0])) {
      error$$module$logger(`Invalid characters used in localized string tag '${replacement[0]}'`);
    }
    const regex = new RegExp(`\\\[${replacement[0]}\\\]`, "g");
    string = string.replace(regex, replacement[1]);
  }
  return string;
};
var module$localization = {};
module$localization.localizedString = localizedString$$module$localization;
module$localization.localizedStringWithReplacements = localizedStringWithReplacements$$module$localization;
// Input 5
const TRACK_ID$$module$captions = "PiPer_track";
let track$$module$captions = null;
let captionsEnabled$$module$captions = false;
let showingCaptions$$module$captions = false;
let showingEmptyCaption$$module$captions = false;
let lastUnprocessedCaption$$module$captions = "";
const disableCaptions$$module$captions = function() {
  captionsEnabled$$module$captions = false;
  showingCaptions$$module$captions = false;
  processCaptions$$module$captions();
  removePictureInPictureEventListener$$module$video(pictureInPictureEventListener$$module$captions);
  info$$module$logger("Closed caption support disabled");
};
const enableCaptions$$module$captions = function(ignoreNowPlayingCheck) {
  if (!getResource$$module$common().captionElement) {
    return;
  }
  captionsEnabled$$module$captions = true;
  addPictureInPictureEventListener$$module$video(pictureInPictureEventListener$$module$captions);
  info$$module$logger("Closed caption support enabled");
  if (ignoreNowPlayingCheck) {
    return;
  }
  const video = getResource$$module$common().videoElement(true);
  if (!video) {
    return;
  }
  showingCaptions$$module$captions = videoPlayingPictureInPicture$$module$video(video);
  track$$module$captions = getCaptionTrack$$module$captions(video);
  processCaptions$$module$captions();
};
const shouldProcessCaptions$$module$captions = function() {
  return captionsEnabled$$module$captions && showingCaptions$$module$captions;
};
const getCaptionTrack$$module$captions = function(video) {
  const allTracks = video.textTracks;
  for (let trackId = allTracks.length; trackId--;) {
    if (allTracks[trackId].label === TRACK_ID$$module$captions) {
      info$$module$logger("Existing caption track found");
      return allTracks[trackId];
    }
  }
  info$$module$logger("Caption track created");
  return video.addTextTrack("captions", TRACK_ID$$module$captions, "en");
};
const addVideoCaptionTracks$$module$captions = function() {
  const elements = document.getElementsByTagName("video");
  for (let index = 0, element; element = elements[index]; index++) {
    getCaptionTrack$$module$captions(element);
  }
};
const pictureInPictureEventListener$$module$captions = function(video, isPlayingPictureInPicture) {
  showingCaptions$$module$captions = isPlayingPictureInPicture;
  if (showingCaptions$$module$captions) {
    track$$module$captions = getCaptionTrack$$module$captions(video);
    track$$module$captions.mode = "showing";
  }
  lastUnprocessedCaption$$module$captions = "";
  processCaptions$$module$captions();
  info$$module$logger(`Video presentation mode changed (showingCaptions: ${showingCaptions$$module$captions})`);
};
const removeCaptions$$module$captions = function(video, workaround = true) {
  while (track$$module$captions.activeCues.length) {
    track$$module$captions.removeCue(track$$module$captions.activeCues[0]);
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI && workaround && video && !showingEmptyCaption$$module$captions) {
    track$$module$captions.addCue(new VTTCue(video.currentTime, video.currentTime + 60, ""));
    showingEmptyCaption$$module$captions = true;
  }
};
const addCaption$$module$captions = function(video, caption) {
  info$$module$logger(`Showing caption '${caption}'`);
  track$$module$captions.mode = "showing";
  track$$module$captions.addCue(new VTTCue(video.currentTime, video.currentTime + 60, caption));
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI) {
    showingEmptyCaption$$module$captions = false;
  }
};
const processCaptions$$module$captions = function() {
  const captionElement = getResource$$module$common().captionElement();
  const video = getResource$$module$common().videoElement();
  if (!showingCaptions$$module$captions || !captionElement) {
    removeCaptions$$module$captions(video);
    if (captionElement) {
      captionElement.style.visibility = "";
    }
    return;
  }
  captionElement.style.visibility = "hidden";
  const unprocessedCaption = captionElement.textContent;
  if (unprocessedCaption == lastUnprocessedCaption$$module$captions) {
    return;
  }
  lastUnprocessedCaption$$module$captions = unprocessedCaption;
  removeCaptions$$module$captions(video, !unprocessedCaption);
  if (!unprocessedCaption) {
    return;
  }
  let caption = "";
  const walk = document.createTreeWalker(captionElement, NodeFilter.SHOW_TEXT, null, false);
  while (walk.nextNode()) {
    const segment = walk.currentNode.nodeValue.trim();
    if (segment) {
      const style = window.getComputedStyle(walk.currentNode.parentElement);
      if (style.fontStyle == "italic") {
        caption += `<i>${segment}</i>`;
      } else if (style.textDecoration == "underline") {
        caption += `<u>${segment}</u>`;
      } else {
        caption += segment;
      }
      caption += " ";
    } else if (caption.charAt(caption.length - 1) != "\n") {
      caption += "\n";
    }
  }
  caption = caption.trim();
  addCaption$$module$captions(video, caption);
};
var module$captions = {};
module$captions.addVideoCaptionTracks = addVideoCaptionTracks$$module$captions;
module$captions.disableCaptions = disableCaptions$$module$captions;
module$captions.enableCaptions = enableCaptions$$module$captions;
module$captions.processCaptions = processCaptions$$module$captions;
module$captions.shouldProcessCaptions = shouldProcessCaptions$$module$captions;
// Input 6
const BUTTON_ID$$module$button = "PiPer_button";
let button$$module$button = null;
const addButton$$module$button = function(parent) {
  if (!button$$module$button) {
    const buttonElementType = getResource$$module$common().buttonElementType || "button";
    button$$module$button = document.createElement(buttonElementType);
    button$$module$button.id = BUTTON_ID$$module$button;
    button$$module$button.title = localizedString$$module$localization("button-title");
    const buttonStyle = getResource$$module$common().buttonStyle;
    if (buttonStyle) {
      button$$module$button.style.cssText = buttonStyle;
    }
    const buttonClassName = getResource$$module$common().buttonClassName;
    if (buttonClassName) {
      button$$module$button.className = buttonClassName;
    }
    const image = document.createElement("img");
    image.style.width = image.style.height = "100%";
    const buttonScale = getResource$$module$common().buttonScale;
    if (buttonScale) {
      image.style.transform = `scale(${buttonScale})`;
    }
    button$$module$button.appendChild(image);
    let buttonImage = getResource$$module$common().buttonImage;
    let buttonExitImage = getResource$$module$common().buttonExitImage;
    if (!buttonImage) {
      buttonImage = "default";
      buttonExitImage = "default-exit";
    }
    const buttonImageURL = `https://gist.githubusercontent.com/darkbrow/abfec4b22576d06a633346f06c3cc2f2/raw/444d3b120581cc4d8bf4a913d89948b10802c7c2/` + `${buttonImage}.svg`;
    image.src = buttonImageURL;
    if (buttonExitImage) {
      const buttonExitImageURL = `https://gist.githubusercontent.com/darkbrow/abfec4b22576d06a633346f06c3cc2f2/raw/444d3b120581cc4d8bf4a913d89948b10802c7c2/` + `${buttonExitImage}.svg`;
      addPictureInPictureEventListener$$module$video(function(video, isPlayingPictureInPicture) {
        image.src = isPlayingPictureInPicture ? buttonExitImageURL : buttonImageURL;
      });
    }
    const buttonHoverStyle = getResource$$module$common().buttonHoverStyle;
    if (buttonHoverStyle) {
      const style = document.createElement("style");
      const css = `#${BUTTON_ID$$module$button}:hover{${buttonHoverStyle}}`;
      style.appendChild(document.createTextNode(css));
      button$$module$button.appendChild(style);
    }
    button$$module$button.addEventListener("click", function(event) {
      event.preventDefault();
      const video = getResource$$module$common().videoElement(true);
      if (!video) {
        error$$module$logger("Unable to find video");
        return;
      }
      togglePictureInPicture$$module$video(video);
    });
    info$$module$logger("Picture in Picture button created");
  }
  const referenceNode = getResource$$module$common().buttonInsertBefore ? getResource$$module$common().buttonInsertBefore(parent) : null;
  parent.insertBefore(button$$module$button, referenceNode);
};
const getButton$$module$button = function() {
  return button$$module$button;
};
const checkButton$$module$button = function() {
  return !!document.getElementById(BUTTON_ID$$module$button);
};
var module$button = {};
module$button.addButton = addButton$$module$button;
module$button.checkButton = checkButton$$module$button;
module$button.getButton = getButton$$module$button;
// Input 7
const domain$$module$resources$youtube = ["youtube", "youtu"];
const resource$$module$resources$youtube = {buttonClassName:"ytp-button", buttonDidAppear:function() {
  const button = getButton$$module$button();
  const neighbourButton = button.nextSibling;
  const title = button.title;
  const neighbourTitle = neighbourButton.title;
  button.title = "";
  button.addEventListener("mouseover", function() {
    neighbourButton.title = title;
    neighbourButton.dispatchEvent(new Event("mouseover"));
  });
  button.addEventListener("mouseout", function() {
    neighbourButton.dispatchEvent(new Event("mouseout"));
    neighbourButton.title = neighbourTitle;
  });
  bypassBackgroundTimerThrottling$$module$common();
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI) {
    const video = getResource$$module$common().videoElement();
    let captionsVisible = false;
    const navigateStart = function() {
      captionsVisible = shouldProcessCaptions$$module$captions();
      if (captionsVisible) {
        disableCaptions$$module$captions();
      }
    };
    const navigateFinish = function() {
      if (captionsVisible) {
        enableCaptions$$module$captions();
      }
    };
    window.addEventListener("spfrequest", navigateStart);
    window.addEventListener("spfdone", navigateFinish);
    window.addEventListener("yt-navigate-start", navigateStart);
    window.addEventListener("yt-navigate-finish", navigateFinish);
  }
}, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".ytp-right-controls");
}, buttonScale:0.68, captionElement:function() {
  return document.querySelector(".caption-window");
}, videoElement:function() {
  return document.querySelector("video.html5-main-video");
},};
var module$resources$youtube = {};
module$resources$youtube.domain = domain$$module$resources$youtube;
module$resources$youtube.resource = resource$$module$resources$youtube;
// Input 8
const domain$$module$resources$yeloplay = "yeloplay";
const resource$$module$resources$yeloplay = {buttonClassName:"button", buttonDidAppear:function() {
  const parent = getResource$$module$common().buttonParent();
  parent.style.width = "210px";
}, buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return document.getElementsByTagName("player-fullscreen-button")[0];
}, buttonParent:function() {
  return document.getElementsByClassName("buttons")[0];
}, buttonScale:0.8, buttonStyle:`
    margin-bottom: -10px;
    margin-left: 10px;
    width: 50px;
    cursor: pointer;
    opacity: 0.8;
    height: 40px !important;
    margin-bottom: 0px !important;
  `, videoElement:function() {
  return document.querySelector("video[src]");
},};
var module$resources$yeloplay = {};
module$resources$yeloplay.domain = domain$$module$resources$yeloplay;
module$resources$yeloplay.resource = resource$$module$resources$yeloplay;
// Input 9
const domain$$module$resources$vrv = "vrv";
const resource$$module$resources$vrv = {buttonClassName:"vjs-control vjs-button", buttonDidAppear:function() {
  const neighbourButton = getButton$$module$button().nextSibling;
  neighbourButton.addEventListener("click", function() {
    const video = getResource$$module$common().videoElement();
    if (videoPlayingPictureInPicture$$module$video(video)) {
      togglePictureInPicture$$module$video(video);
    }
  });
  bypassBackgroundTimerThrottling$$module$common();
}, buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, buttonScale:0.6, buttonStyle:`
    position: absolute;
    right: 114px;
    width: 50px;
    cursor: pointer;
    opacity: 0.6;
  `, captionElement:function() {
  return document.querySelector(".libjass-subs");
}, videoElement:function() {
  return document.getElementById("player_html5_api");
},};
var module$resources$vrv = {};
module$resources$vrv.domain = domain$$module$resources$vrv;
module$resources$vrv.resource = resource$$module$resources$vrv;
// Input 10
const domain$$module$resources$vrt = "vrt";
const resource$$module$resources$vrt = {buttonClassName:"vuplay-control", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.getElementsByClassName("vuplay-control-right")[0];
}, captionElement:function() {
  return document.querySelector(".theoplayer-texttracks");
}, buttonStyle:`
    width: 30px;
    height: 47px;
    padding: 0;
    position: relative;
    top: -9px;
    right: 8px;
  `, videoElement:function() {
  return document.querySelector('video[preload="metadata"]');
},};
var module$resources$vrt = {};
module$resources$vrt.domain = domain$$module$resources$vrt;
module$resources$vrt.resource = resource$$module$resources$vrt;
// Input 11
const domain$$module$resources$vk = "vk";
const resource$$module$resources$vk = {buttonClassName:"videoplayer_btn", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return document.querySelector("div.videoplayer_btn_fullscreen");
}, buttonStyle:`
    width: 24px;
    height: 45px;
    padding: 0 8px;
  `, buttonParent:function() {
  return document.querySelector("div.videoplayer_controls");
}, videoElement:function() {
  return document.querySelector("video.videoplayer_media_provider");
},};
var module$resources$vk = {};
module$resources$vk.domain = domain$$module$resources$vk;
module$resources$vk.resource = resource$$module$resources$vk;
// Input 12
const domain$$module$resources$viervijfzes = ["vijf", "vier", "zes"];
const resource$$module$resources$viervijfzes = {buttonClassName:"vjs-control vjs-button", buttonDidAppear:function() {
  const fullScreenButton = document.getElementsByClassName("vjs-fullscreen-control")[0];
  fullScreenButton.style.order = 10;
}, buttonParent:function() {
  return document.getElementsByClassName("vjs-control-bar")[0];
}, buttonStyle:`
    text-indent: 0! important;
    margin-left: 10px;
    order: 9;
  `, videoElement:function() {
  return document.querySelector('video[preload="metadata"]');
},};
var module$resources$viervijfzes = {};
module$resources$viervijfzes.domain = domain$$module$resources$viervijfzes;
module$resources$viervijfzes.resource = resource$$module$resources$viervijfzes;
// Input 13
const domain$$module$resources$vid = "vid";
const resource$$module$resources$vid = {buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, buttonScale:0.7, buttonStyle:`
    position: relative;
    top: -2px;
    left: 9px;
    padding: 0px;
    margin: 0px;
  `, videoElement:function() {
  return document.getElementById("video_player_html5_api");
},};
var module$resources$vid = {};
module$resources$vid.domain = domain$$module$resources$vid;
module$resources$vid.resource = resource$$module$resources$vid;
// Input 14
const domain$$module$resources$vice = "vice";
const resource$$module$resources$vice = {buttonClassName:"vp__controls__icon__popup__container", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".vp__controls__icons");
}, buttonScale:0.6, buttonStyle:`top: -11px`, videoElement:function() {
  return document.querySelector("video.jw-video");
},};
var module$resources$vice = {};
module$resources$vice.domain = domain$$module$resources$vice;
module$resources$vice.resource = resource$$module$resources$vice;
// Input 15
const domain$$module$resources$vevo = "vevo";
const resource$$module$resources$vevo = {buttonClassName:"player-control", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector("#control-bar .right-controls");
}, buttonScale:0.7, buttonStyle:`
    border: 0px;
    background: transparent;
  `, videoElement:function() {
  return document.getElementById("html5-player");
},};
var module$resources$vevo = {};
module$resources$vevo.domain = domain$$module$resources$vevo;
module$resources$vevo.resource = resource$$module$resources$vevo;
// Input 16
const domain$$module$resources$ustream = "ustream";
const resource$$module$resources$ustream = {buttonClassName:"component shown", buttonElementType:"div", buttonHoverStyle:`
    opacity: 1 !important;
    filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.5));
  `, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonScale:0.8, buttonStyle:`
    opacity: 0.7;
  `, buttonParent:function() {
  return document.getElementById("controlPanelRight");
}, videoElement:function() {
  return document.querySelector("#ViewerContainer video");
},};
var module$resources$ustream = {};
module$resources$ustream.domain = domain$$module$resources$ustream;
module$resources$ustream.resource = resource$$module$resources$ustream;
// Input 17
const domain$$module$resources$udemy = "udemy";
const resource$$module$resources$udemy = {buttonClassName:"btn", buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return document.querySelector('button[aria-label="Fullscreen"]');
}, buttonParent:function() {
  return document.querySelector('div[class^="control-bar--control-bar--"]');
}, buttonScale:0.8, buttonStyle:`
    width: 3em;
    height: 3em;
    padding: 0;
    opacity: 0.8;
  `, captionElement:function() {
  return document.querySelector('div[class^="captions-display--captions-container"]');
}, videoElement:function() {
  return document.querySelector("video.vjs-tech");
},};
var module$resources$udemy = {};
module$resources$udemy.domain = domain$$module$resources$udemy;
module$resources$udemy.resource = resource$$module$resources$udemy;
// Input 18
const domain$$module$resources$twitch = "twitch";
const resource$$module$resources$twitch = {buttonClassName:"tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-relative", buttonDidAppear:function() {
  const button = getButton$$module$button();
  const title = button.title;
  button.title = "";
  const tooltip = document.createElement("div");
  tooltip.className = "tw-tooltip tw-tooltip--align-right tw-tooltip--up";
  tooltip.appendChild(document.createTextNode(title));
  button.appendChild(tooltip);
  const fullscreenButton = document.querySelector("[data-a-target='player-fullscreen-button']");
  if (!fullscreenButton) {
    return;
  }
  fullscreenButton.addEventListener("click", function() {
    const video = getResource$$module$common().videoElement();
    if (videoPlayingPictureInPicture$$module$video(video)) {
      togglePictureInPicture$$module$video(video);
    }
  });
}, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".player-controls__right-control-group,.player-buttons-right");
}, buttonScale:0.8, captionElement:function() {
  return document.querySelector(".player-captions-container");
}, videoElement:function() {
  return document.querySelector("video[src]");
},};
var module$resources$twitch = {};
module$resources$twitch.domain = domain$$module$resources$twitch;
module$resources$twitch.resource = resource$$module$resources$twitch;
// Input 19
const domain$$module$resources$theonion = "theonion";
const resource$$module$resources$theonion = {buttonClassName:"jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-logo", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".jw-controlbar-right-group");
}, buttonStyle:`
    top: -2px;
    left: 10px;
    width: 38px;
  `, videoElement:function() {
  return document.querySelector("video.jw-video");
},};
var module$resources$theonion = {};
module$resources$theonion.domain = domain$$module$resources$theonion;
module$resources$theonion.resource = resource$$module$resources$theonion;
// Input 20
const domain$$module$resources$ted = "ted";
const resource$$module$resources$ted = {buttonClassName:"z-i:0 pos:r bottom:0 hover/bg:white.7 b-r:.1 p:1 cur:p", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  const playButton = document.querySelector('[aria-controls="video1"]');
  return playButton.parentElement.parentElement;
}, buttonDidAppear:function() {
  const img = getButton$$module$button().querySelector("img");
  img.classList.add("w:2");
  img.classList.add("h:2");
}, videoElement:function() {
  return document.querySelector('video[id^="ted-player-"]');
}};
var module$resources$ted = {};
module$resources$ted.domain = domain$$module$resources$ted;
module$resources$ted.resource = resource$$module$resources$ted;
// Input 21
const domain$$module$resources$streamable = "streamable";
const resource$$module$resources$streamable = {buttonDidAppear:function() {
  const progressBar = document.getElementById("player-progress");
  const progressBarStyle = window.getComputedStyle(progressBar);
  getButton$$module$button().style.right = progressBarStyle.right;
  progressBar.style.right = parseInt(progressBarStyle.right, 10) + 40 + "px";
}, buttonElementType:"div", buttonHoverStyle:`opacity: 1 !important`, buttonParent:function() {
  return document.querySelector(".player-controls-right");
}, buttonStyle:`
    position: absolute;
    bottom: 10px;
    height: 26px;
    width: 26px;
    cursor: pointer;
    opacity: 0.9;
    filter: drop-shadow(rgba(0, 0, 0, 0.5) 0px 0px 2px);
  `, videoElement:function() {
  return document.getElementById("video-player-tag");
},};
var module$resources$streamable = {};
module$resources$streamable.domain = domain$$module$resources$streamable;
module$resources$streamable.resource = resource$$module$resources$streamable;
// Input 22
const domain$$module$resources$seznam = ["seznam", "stream"];
const resource$$module$resources$seznam = {buttonClassName:"sznp-ui-widget-box", buttonElementType:"div", buttonHoverStyle:`transform: scale(1.05)`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".sznp-ui-ctrl-panel-layout-wrapper");
}, buttonScale:0.75, buttonStyle:`cursor: pointer`, videoElement:function() {
  return document.querySelector(".sznp-ui-tech-video-wrapper video");
},};
var module$resources$seznam = {};
module$resources$seznam.domain = domain$$module$resources$seznam;
module$resources$seznam.resource = resource$$module$resources$seznam;
// Input 23
const domain$$module$resources$plex = "plex";
const resource$$module$resources$plex = {buttonDidAppear:function() {
  bypassBackgroundTimerThrottling$$module$common();
}, buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  const e = document.querySelector('div[class^="FullPlayerTopControls-topControls"]');
  return e && e.lastChild;
}, buttonScale:2, buttonStyle:`
    position: relative;
    top: -3px;
    width: 30px;
    padding: 10px;
    border: 0px;
    background: transparent;
    opacity: 0.7;
    outline: 0;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.45);
  `, captionElement:function() {
  return document.querySelector(".libjass-subs");
}, videoElement:function() {
  return document.querySelector('video[class^="HTMLMedia-mediaElement"]');
},};
var module$resources$plex = {};
module$resources$plex.domain = domain$$module$resources$plex;
module$resources$plex.resource = resource$$module$resources$plex;
// Input 24
const domain$$module$resources$periscope = ["periscope", "pscp"];
const resource$$module$resources$periscope = {buttonClassName:"Pill Pill--withIcon", buttonElementType:"span", buttonHoverStyle:`
    opacity: 0.8 !important;
    filter: brightness(125%) !important;
  `, buttonInsertBefore:function(parent) {
  return parent.querySelector(".ShareBroadcast").nextSibling;
}, buttonParent:function() {
  return document.querySelector(".VideoOverlayRedesign-BottomBar-Right");
}, buttonScale:0.6, buttonStyle:`
    opacity: 0.5;
    filter: brightness(200%);
  `, videoElement:function() {
  return document.querySelector(".Video video");
},};
var module$resources$periscope = {};
module$resources$periscope.domain = domain$$module$resources$periscope;
module$resources$periscope.resource = resource$$module$resources$periscope;
// Input 25
const domain$$module$resources$pbs = "pbs";
const resource$$module$resources$pbs = {buttonClassName:"jw-icon jw-icon-inline jw-button-color jw-reset", buttonDidAppear:function() {
  const fullscreenButton = document.querySelector(".jw-icon-fullscreen");
  fullscreenButton.addEventListener("click", function() {
    const video = getResource$$module$common().videoElement();
    if (videoPlayingPictureInPicture$$module$video(video)) {
      togglePictureInPicture$$module$video(video);
    }
  });
}, buttonElementType:"div", buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".jw-button-container");
}, buttonScale:0.6, buttonStyle:`opacity: 0.8`, videoElement:function() {
  return document.querySelector(".jw-video");
},};
var module$resources$pbs = {};
module$resources$pbs.domain = domain$$module$resources$pbs;
module$resources$pbs.resource = resource$$module$resources$pbs;
// Input 26
const domain$$module$resources$openload = ["openload", "oload"];
const resource$$module$resources$openload = {buttonClassName:"vjs-control vjs-button", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, buttonScale:0.6, buttonStyle:`
    left: 5px;
    cursor: pointer;
  `, videoElement:function() {
  return document.getElementById("olvideo_html5_api");
},};
var module$resources$openload = {};
module$resources$openload.domain = domain$$module$resources$openload;
module$resources$openload.resource = resource$$module$resources$openload;
// Input 27
const domain$$module$resources$ocs = "ocs";
const resource$$module$resources$ocs = {buttonClassName:"footer-elt fltr", buttonInsertBefore:function(parent) {
  return parent.querySelector("#togglePlay");
}, buttonParent:function() {
  return document.querySelector(".footer-block:last-child");
}, buttonScale:1.2, buttonStyle:`
    display: block;
    width: 25px;
    height: 18px;
    margin-right: 10px;
    margin-bottom: -10px;
    padding: 0px;
    border: 0px;
    background-color: transparent;
  `, videoElement:function() {
  return document.getElementById("LgyVideoPlayer");
},};
var module$resources$ocs = {};
module$resources$ocs.domain = domain$$module$resources$ocs;
module$resources$ocs.resource = resource$$module$resources$ocs;
// Input 28
const domain$$module$resources$netflix = "netflix";
const resource$$module$resources$netflix = {buttonClassName:"touchable PlayerControls--control-element nfp-button-control default-control-button", buttonHoverStyle:`transform: scale(1.2);`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector('div[style="align-items: normal; justify-content: normal;"] > [style="align-items: normal; justify-content: flex-end;"]');
}, buttonScale:1.5, buttonStyle:`min-width: 2.3em`, captionElement:function() {
  const e = getResource$$module$common().videoElement();
  return e && e.parentElement.querySelector(".player-timedtext-text-container");
}, videoElement:function() {
  return document.querySelector('video[tabindex="-1"]');
},};
var module$resources$netflix = {};
module$resources$netflix.domain = domain$$module$resources$netflix;
module$resources$netflix.resource = resource$$module$resources$netflix;
// Input 29
const domain$$module$resources$motogp = "motogp";
const resource$$module$resources$motogp = {buttonStyle:`
    width: 3em;
    height: 3em;
    color: white;
    background: transparent;
    position: relative;
    border: none;
    outline: none;
    border-radius: 0;
    cursor: pointer;
    -webkit-appearance: none;
    z-index: 1;
  `, buttonHoverStyle:`
    background: radial-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0)) !important;
  `, buttonInsertBefore:function(parent) {
  const fullScreenButton = document.querySelector(".vjs-fullscreen-control");
  if (fullScreenButton) {
    return fullScreenButton;
  }
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, videoElement:function() {
  return document.querySelector('video[class="vjs-tech"]');
}};
var module$resources$motogp = {};
module$resources$motogp.domain = domain$$module$resources$motogp;
module$resources$motogp.resource = resource$$module$resources$motogp;
// Input 30
const domain$$module$resources$mlb = "mlb";
const resource$$module$resources$mlb = {buttonScale:0.7, buttonStyle:`
    border: 0px;
    background: transparent;
    filter: brightness(80%);
  `, buttonHoverStyle:`filter: brightness(120%) !important`, buttonParent:function() {
  return document.querySelector(".bottom-controls-right");
}, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, videoElement:function() {
  return document.querySelector(".mlbtv-media-player video");
},};
var module$resources$mlb = {};
module$resources$mlb.domain = domain$$module$resources$mlb;
module$resources$mlb.resource = resource$$module$resources$mlb;
// Input 31
const domain$$module$resources$mixer = "mixer";
const resource$$module$resources$mixer = {buttonClassName:"control", buttonElementType:"div", buttonHoverStyle:`background: rgba(255, 255, 255, 0.08)`, buttonInsertBefore:function(parent) {
  return parent.lastChild.previousSibling;
}, buttonParent:function() {
  return document.querySelector(".control-container .toolbar .right");
}, buttonScale:0.65, buttonStyle:`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
  `, videoElement:function() {
  return document.querySelector(".control-container + video");
},};
var module$resources$mixer = {};
module$resources$mixer.domain = domain$$module$resources$mixer;
module$resources$mixer.resource = resource$$module$resources$mixer;
// Input 32
const domain$$module$resources$metacafe = "metacafe";
const resource$$module$resources$metacafe = {buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector("#player_place .tray");
}, buttonScale:0.85, videoElement:function() {
  return document.querySelector("#player_place video");
},};
var module$resources$metacafe = {};
module$resources$metacafe.domain = domain$$module$resources$metacafe;
module$resources$metacafe.resource = resource$$module$resources$metacafe;
// Input 33
const domain$$module$resources$mashable = "mashable";
const resource$$module$resources$mashable = {buttonClassName:"jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-logo", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".jw-controlbar-right-group");
}, buttonStyle:`
    top: -2px;
    width: 38px;
  `, videoElement:function() {
  return document.querySelector("video.jw-video");
},};
var module$resources$mashable = {};
module$resources$mashable.domain = domain$$module$resources$mashable;
module$resources$mashable.resource = resource$$module$resources$mashable;
// Input 34
const domain$$module$resources$littlethings = "littlethings";
const resource$$module$resources$littlethings = {buttonClassName:"jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-logo", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".jw-controlbar-right-group");
}, buttonStyle:`width: 38px`, videoElement:function() {
  return document.querySelector("video.jw-video");
},};
var module$resources$littlethings = {};
module$resources$littlethings.domain = domain$$module$resources$littlethings;
module$resources$littlethings.resource = resource$$module$resources$littlethings;
// Input 35
const domain$$module$resources$hulu = "hulu";
const resource$$module$resources$hulu = {buttonDidAppear:function() {
  const button = getButton$$module$button();
  const title = button.title;
  button.title = "";
  const tooltip = document.createElement("div");
  tooltip.className = "button-tool-tips";
  tooltip.style.cssText = `
      white-space: nowrap;
      padding: 0 5px;
      right: 0;
    `;
  tooltip.textContent = title.toUpperCase();
  button.appendChild(tooltip);
  button.addEventListener("mouseover", function() {
    tooltip.style.display = "block";
  });
  button.addEventListener("mouseout", function() {
    tooltip.style.display = "none";
  });
}, buttonElementType:"div", buttonHoverStyle:`opacity: 1.0 !important`, buttonInsertBefore:function(parent) {
  return document.querySelector(".controls__view-mode-button");
}, buttonParent:function() {
  return document.querySelector("#dash-player-container .controls__menus-right");
}, buttonStyle:`
    opacity: 0.7;
    cursor: pointer;
    width: 24px;
  `, captionElement:function() {
  return document.querySelector(".closed-caption-outband");
}, videoElement:function() {
  return document.querySelector(".video-player");
},};
var module$resources$hulu = {};
module$resources$hulu.domain = domain$$module$resources$hulu;
module$resources$hulu.resource = resource$$module$resources$hulu;
// Input 36
const domain$$module$resources$giantbomb = "giantbomb";
const resource$$module$resources$giantbomb = {buttonClassName:"av-chrome-control", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.querySelector(".js-vid-pin-wrap").nextSibling;
}, buttonParent:function() {
  return document.querySelector(".av-controls--right");
}, buttonScale:0.7, buttonStyle:`
    height: 100%;
    width: 30px;
    opacity: 1.0;
    cursor: pointer;
  `, videoElement:function() {
  return document.querySelector('video[id^="video_js-vid-player"]');
}};
var module$resources$giantbomb = {};
module$resources$giantbomb.domain = domain$$module$resources$giantbomb;
module$resources$giantbomb.resource = resource$$module$resources$giantbomb;
// Input 37
const domain$$module$resources$fubotv = "fubo";
const resource$$module$resources$fubotv = {buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".css-ja7yk7");
}, buttonScale:1.25, buttonStyle:`
    height: 24px;
    width: 25px;
    margin: 8px 10px 12px;
    cursor: pointer;
  `, videoElement:function() {
  return document.getElementById("bitmovinplayer-video-video");
},};
var module$resources$fubotv = {};
module$resources$fubotv.domain = domain$$module$resources$fubotv;
module$resources$fubotv.resource = resource$$module$resources$fubotv;
// Input 38
const domain$$module$resources$eurosportplayer = "eurosportplayer";
const resource$$module$resources$eurosportplayer = {buttonElementType:"div", buttonHoverStyle:`opacity: 1 !important`, buttonParent:function() {
  return document.querySelector(".controls-bar-right-section");
}, buttonScale:0.9, buttonStyle:`
    height: 100%;
    margin-right: 15px;
    opacity: 0.8;
    cursor: pointer;
  `, videoElement:function() {
  return document.querySelector(".video-player__screen");
},};
var module$resources$eurosportplayer = {};
module$resources$eurosportplayer.domain = domain$$module$resources$eurosportplayer;
module$resources$eurosportplayer.resource = resource$$module$resources$eurosportplayer;
// Input 39
const domain$$module$resources$espn = "espn";
const resource$$module$resources$espn = {buttonClassName:"media-icon", buttonDidAppear:function() {
  const button = getButton$$module$button();
  const title = button.title;
  button.title = "";
  const tooltip = document.createElement("div");
  tooltip.className = "control-tooltip";
  tooltip.style.cssText = `
      right: 0px;
      bottom: 35px;
      transition: bottom 0.2s ease-out;
    `;
  tooltip.textContent = title;
  button.appendChild(tooltip);
  button.addEventListener("mouseover", function() {
    button.classList.add("displaying");
    tooltip.style.bottom = "75px";
  });
  button.addEventListener("mouseout", function() {
    button.classList.remove("displaying");
    tooltip.style.bottom = "35px";
  });
}, buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".controls-right-horizontal");
}, buttonScale:0.7, buttonStyle:`
    width: 44px;
    height: 44px;
    order: 4;
  `, captionElement:function() {
  return document.querySelector(".text-track-display");
}, videoElement:function() {
  return document.querySelector("video.js-video-content");
},};
var module$resources$espn = {};
module$resources$espn.domain = domain$$module$resources$espn;
module$resources$espn.resource = resource$$module$resources$espn;
// Input 40
const domain$$module$resources$disneyplus = "disneyplus";
const resource$$module$resources$disneyplus = {buttonClassName:"control-icon-btn", buttonInsertBefore:function(parent) {
  return document.querySelector(".fullscreen-icon");
}, buttonParent:function() {
  return document.querySelector(".controls__right");
}, videoElement:function() {
  return document.querySelector("video[src]");
},};
var module$resources$disneyplus = {};
module$resources$disneyplus.domain = domain$$module$resources$disneyplus;
module$resources$disneyplus.resource = resource$$module$resources$disneyplus;
// Input 41
const domain$$module$resources$dazn = "dazn";
const resource$$module$resources$dazn = {buttonStyle:`
    width: 1.5rem;
    height: 1.5rem;
    color: white;
    background: transparent;
    position: relative;
    border: none;
    outline: none;
    border-radius: 0;
    cursor: pointer;
    -webkit-appearance: none;
    margin: 0.5rem;
    z-index: 1;
  `, buttonInsertBefore:function(parent) {
  const liveIndicator = document.querySelector('div[data-test-id^="PLAYER_LIVE_INDICATOR"]');
  if (liveIndicator) {
    return liveIndicator;
  }
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector('div[data-test-id^="PLAYER_BAR"]');
}, videoElement:function() {
  return document.querySelector('div[data-test-id^="PLAYER_SOLUTION"] video');
}};
var module$resources$dazn = {};
module$resources$dazn.domain = domain$$module$resources$dazn;
module$resources$dazn.resource = resource$$module$resources$dazn;
// Input 42
const domain$$module$resources$curiositystream = "curiositystream";
const resource$$module$resources$curiositystream = {buttonClassName:"vjs-control vjs-button", buttonDidAppear:function() {
  if (getBrowser$$module$common() != Browser$$module$common.SAFARI) {
    return;
  }
  const video = getResource$$module$common().videoElement();
  const videoContainer = video.parentElement;
  video.addEventListener("webkitbeginfullscreen", function() {
    const height = Math.floor(100 * video.videoHeight / video.videoWidth) + "vw";
    const maxHeight = video.videoHeight + "px";
    videoContainer.style.setProperty("height", height, "important");
    videoContainer.style.setProperty("max-height", maxHeight);
  });
  video.addEventListener("webkitendfullscreen", function() {
    videoContainer.style.removeProperty("height");
    videoContainer.style.removeProperty("max-height");
  });
}, buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  const e = document.getElementById("main-player");
  return e && e.querySelector(".vjs-control-bar");
}, buttonScale:0.7, buttonStyle:`
    opacity: 0.8;
    cursor: pointer;
  `, videoElement:function() {
  return document.getElementById("main-player_html5_api");
},};
var module$resources$curiositystream = {};
module$resources$curiositystream.domain = domain$$module$resources$curiositystream;
module$resources$curiositystream.resource = resource$$module$resources$curiositystream;
// Input 43
const domain$$module$resources$crunchyroll = "crunchyroll";
const resource$$module$resources$crunchyroll = {buttonClassName:"vjs-control vjs-button", buttonHoverStyle:`opacity: 1 !important`, buttonScale:0.6, buttonStyle:`
    position: absolute;
    right: 100px;
    opacity: 0.75;
    cursor: pointer;
  `, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, videoElement:function() {
  return document.getElementById("player_html5_api");
},};
var module$resources$crunchyroll = {};
module$resources$crunchyroll.domain = domain$$module$resources$crunchyroll;
module$resources$crunchyroll.resource = resource$$module$resources$crunchyroll;
// Input 44
const domain$$module$resources$ceskatelevize = "ceskatelevize";
const resource$$module$resources$ceskatelevize = {buttonClassName:"videoButtonShell dontHideControls cursorPointer focusableBtn", buttonElementType:"div", buttonHoverStyle:`
    filter: brightness(50%) sepia(1) hue-rotate(170deg) saturate(250%) brightness(90%);
  `, buttonInsertBefore:function(parent) {
  return document.getElementById("fullScreenShell");
}, buttonScale:1.2, buttonStyle:`
    width: 18px;
    height: 18px;
    display: inline-block;
  `, buttonParent:function() {
  return document.getElementById("videoButtons");
}, videoElement:function() {
  return document.getElementById("video");
},};
var module$resources$ceskatelevize = {};
module$resources$ceskatelevize.domain = domain$$module$resources$ceskatelevize;
module$resources$ceskatelevize.resource = resource$$module$resources$ceskatelevize;
// Input 45
const domain$$module$resources$bbc = "bbc";
const resource$$module$resources$bbc = {buttonParent:function() {
  return null;
}, captionElement:function() {
  return document.querySelector(".p_subtitlesContainer");
}, videoElement:function() {
  return document.querySelector("#mediaContainer video[src]");
},};
var module$resources$bbc = {};
module$resources$bbc.domain = domain$$module$resources$bbc;
module$resources$bbc.resource = resource$$module$resources$bbc;
// Input 46
const domain$$module$resources$apple = "apple";
const getNestedShadowRoot$$module$resources$apple = function(selectors) {
  let dom = document;
  for (const selector of selectors) {
    dom = dom.querySelector(selector);
    dom = dom && dom.shadowRoot;
    if (!dom) {
      return null;
    }
  }
  return dom;
};
const resource$$module$resources$apple = {buttonClassName:"footer__control hydrated", buttonElementType:"div", buttonHoverStyle:`opacity: 0.8 !important`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  const internal = getNestedShadowRoot$$module$resources$apple(["apple-tv-plus-player", "amp-video-player-internal"]);
  if (!internal) {
    return;
  }
  const fullscreenButton = internal.querySelector("amp-playback-controls-full-screen");
  if (!fullscreenButton) {
    return;
  }
  return fullscreenButton.parentElement;
}, buttonStyle:`
    transition: opacity 0.15s;
    cursor: pointer;
    opacity: 0.9;
  `, videoElement:function() {
  const video = getNestedShadowRoot$$module$resources$apple(["apple-tv-plus-player", "amp-video-player-internal", "amp-video-player"]);
  if (!video) {
    return;
  }
  return video.querySelector("video");
},};
var module$resources$apple = {};
module$resources$apple.domain = domain$$module$resources$apple;
module$resources$apple.resource = resource$$module$resources$apple;
// Input 47
const domain$$module$resources$amazon = ["amazon", "primevideo"];
const resource$$module$resources$amazon = {buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return parent.querySelector(".fullscreenButtonWrapper");
}, buttonParent:function() {
  const e = document.getElementById("dv-web-player");
  return e && e.querySelector(".hideableTopButtons");
}, buttonStyle:`
    position: relative;
    left: 8px;
    width: 3vw;
    height: 2vw;
    min-width: 35px;
    min-height: 24px;
    border: 0px;
    padding: 0px;
    background-color: transparent;
    opacity: 0.8;
  `, captionElement:function() {
  const e = document.getElementById("dv-web-player");
  return e && e.querySelector(".captions");
}, videoElement:function() {
  const e = document.querySelector(".rendererContainer");
  return e && e.querySelector('video[width="100%"]');
},};
var module$resources$amazon = {};
module$resources$amazon.domain = domain$$module$resources$amazon;
module$resources$amazon.resource = resource$$module$resources$amazon;
// Input 48
const domain$$module$resources$aktualne = "aktualne";
const resource$$module$resources$aktualne = {buttonClassName:"jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-logo", buttonElementType:"div", buttonHoverStyle:`
    filter: brightness(50%) sepia(1) hue-rotate(311deg) saturate(550%) brightness(49%) !important;
  `, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".jw-controlbar-right-group");
}, buttonStyle:`
    width: 38px;
    filter: brightness(80%);
  `, videoElement:function() {
  return document.querySelector("video.jw-video");
},};
var module$resources$aktualne = {};
module$resources$aktualne.domain = domain$$module$resources$aktualne;
module$resources$aktualne.resource = resource$$module$resources$aktualne;
// Input 49
const domain$$module$resources$9now = "9now";
const resource$$module$resources$9now = {buttonClassName:"vjs-control vjs-button", buttonHoverStyle:`
    filter: brightness(50%) sepia(1) hue-rotate(167deg) saturate(253%) brightness(104%);
  `, buttonInsertBefore:function(parent) {
  return parent.querySelector(".vjs-fullscreen-control");
}, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, buttonScale:0.7, buttonStyle:`
    order: 999999;
    cursor: pointer;
    height: 44px;
    width: 40px;
  `, captionElement:function() {
  const e = getResource$$module$common().videoElement();
  return e && e.parentElement.querySelector(".vjs-text-track-display");
}, videoElement:function() {
  return document.querySelector("video.vjs-tech");
},};
var module$resources$9now = {};
module$resources$9now.domain = domain$$module$resources$9now;
module$resources$9now.resource = resource$$module$resources$9now;
// Input 50
const initialiseCaches$$module$cache = function() {
  let uniqueIdCounter = 0;
  const uniqueId = function() {
    return "PiPer_" + uniqueIdCounter++;
  };
  const cacheElementWrapper = function(elementFunction) {
    let cachedElementId = null;
    return function(bypassCache) {
      const cachedElement = cachedElementId ? document.getElementById(cachedElementId) : null;
      if (cachedElement && !bypassCache) {
        return cachedElement;
      }
      const uncachedElement = elementFunction();
      if (uncachedElement) {
        if (!uncachedElement.id) {
          uncachedElement.id = uniqueId();
        }
        cachedElementId = uncachedElement.id;
      }
      return uncachedElement;
    };
  };
  const currentResource = getResource$$module$common();
  currentResource.buttonParent = cacheElementWrapper(currentResource.buttonParent);
  currentResource.videoElement = cacheElementWrapper(currentResource.videoElement);
  if (currentResource.captionElement) {
    currentResource.captionElement = cacheElementWrapper(currentResource.captionElement);
  }
};
var module$cache = {};
module$cache.initialiseCaches = initialiseCaches$$module$cache;
// Input 51
const resources$$module$resources$index = {};
resources$$module$resources$index[domain$$module$resources$9now] = resource$$module$resources$9now;
resources$$module$resources$index[domain$$module$resources$aktualne] = resource$$module$resources$aktualne;
resources$$module$resources$index["amazon"] = resource$$module$resources$amazon;
resources$$module$resources$index[domain$$module$resources$apple] = resource$$module$resources$apple;
resources$$module$resources$index[domain$$module$resources$bbc] = resource$$module$resources$bbc;
resources$$module$resources$index[domain$$module$resources$ceskatelevize] = resource$$module$resources$ceskatelevize;
resources$$module$resources$index[domain$$module$resources$crunchyroll] = resource$$module$resources$crunchyroll;
resources$$module$resources$index[domain$$module$resources$curiositystream] = resource$$module$resources$curiositystream;
resources$$module$resources$index[domain$$module$resources$dazn] = resource$$module$resources$dazn;
resources$$module$resources$index[domain$$module$resources$disneyplus] = resource$$module$resources$disneyplus;
resources$$module$resources$index[domain$$module$resources$espn] = resource$$module$resources$espn;
resources$$module$resources$index[domain$$module$resources$eurosportplayer] = resource$$module$resources$eurosportplayer;
resources$$module$resources$index[domain$$module$resources$fubotv] = resource$$module$resources$fubotv;
resources$$module$resources$index[domain$$module$resources$giantbomb] = resource$$module$resources$giantbomb;
resources$$module$resources$index[domain$$module$resources$hulu] = resource$$module$resources$hulu;
resources$$module$resources$index[domain$$module$resources$littlethings] = resource$$module$resources$littlethings;
resources$$module$resources$index[domain$$module$resources$mashable] = resource$$module$resources$mashable;
resources$$module$resources$index[domain$$module$resources$metacafe] = resource$$module$resources$metacafe;
resources$$module$resources$index[domain$$module$resources$mixer] = resource$$module$resources$mixer;
resources$$module$resources$index[domain$$module$resources$mlb] = resource$$module$resources$mlb;
resources$$module$resources$index[domain$$module$resources$motogp] = resource$$module$resources$motogp;
resources$$module$resources$index[domain$$module$resources$netflix] = resource$$module$resources$netflix;
resources$$module$resources$index[domain$$module$resources$ocs] = resource$$module$resources$ocs;
resources$$module$resources$index["openload"] = resource$$module$resources$openload;
resources$$module$resources$index[domain$$module$resources$pbs] = resource$$module$resources$pbs;
resources$$module$resources$index["periscope"] = resource$$module$resources$periscope;
resources$$module$resources$index[domain$$module$resources$plex] = resource$$module$resources$plex;
resources$$module$resources$index["seznam"] = resource$$module$resources$seznam;
resources$$module$resources$index[domain$$module$resources$streamable] = resource$$module$resources$streamable;
resources$$module$resources$index[domain$$module$resources$ted] = resource$$module$resources$ted;
resources$$module$resources$index[domain$$module$resources$theonion] = resource$$module$resources$theonion;
resources$$module$resources$index[domain$$module$resources$twitch] = resource$$module$resources$twitch;
resources$$module$resources$index[domain$$module$resources$udemy] = resource$$module$resources$udemy;
resources$$module$resources$index[domain$$module$resources$ustream] = resource$$module$resources$ustream;
resources$$module$resources$index[domain$$module$resources$vevo] = resource$$module$resources$vevo;
resources$$module$resources$index[domain$$module$resources$vice] = resource$$module$resources$vice;
resources$$module$resources$index[domain$$module$resources$vid] = resource$$module$resources$vid;
resources$$module$resources$index["vijf"] = resource$$module$resources$viervijfzes;
resources$$module$resources$index[domain$$module$resources$vk] = resource$$module$resources$vk;
resources$$module$resources$index[domain$$module$resources$vrt] = resource$$module$resources$vrt;
resources$$module$resources$index[domain$$module$resources$vrv] = resource$$module$resources$vrv;
resources$$module$resources$index[domain$$module$resources$yeloplay] = resource$$module$resources$yeloplay;
resources$$module$resources$index["youtube"] = resource$$module$resources$youtube;
resources$$module$resources$index["primevideo"] = resources$$module$resources$index["amazon"];
resources$$module$resources$index["oload"] = resources$$module$resources$index["openload"];
resources$$module$resources$index["pscp"] = resources$$module$resources$index["periscope"];
resources$$module$resources$index["stream"] = resources$$module$resources$index["seznam"];
resources$$module$resources$index["vier"] = resources$$module$resources$index["vijf"];
resources$$module$resources$index["zes"] = resources$$module$resources$index["vijf"];
resources$$module$resources$index["youtu"] = resources$$module$resources$index["youtube"];
var module$resources$index = {};
module$resources$index.resources = resources$$module$resources$index;
// Input 52
const mutationObserver$$module$main = function() {
  const currentResource = getResource$$module$common();
  if (shouldProcessCaptions$$module$captions()) {
    processCaptions$$module$captions();
  }
  if (getBrowser$$module$common() == Browser$$module$common.CHROME) {
    addVideoElementListeners$$module$video();
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI && currentResource.captionElement) {
    addVideoCaptionTracks$$module$captions();
  }
  if (checkButton$$module$button()) {
    return;
  }
  const buttonParent = currentResource.buttonParent();
  if (buttonParent) {
    addButton$$module$button(buttonParent);
    if (currentResource.buttonDidAppear) {
      currentResource.buttonDidAppear();
    }
    info$$module$logger("Picture in Picture button added to webpage");
  }
};
const getCurrentDomainName$$module$main = function() {
  if (location.port == 32400) {
    return "plex";
  } else {
    return (location.hostname.match(/([^.]+)\.(?:com?\.)?[^.]+$/) || [])[1];
  }
};
const domainName$$module$main = getCurrentDomainName$$module$main();
if (domainName$$module$main in resources$$module$resources$index) {
  info$$module$logger(`Matched site ${domainName$$module$main} (${location})`);
  setResource$$module$common(resources$$module$resources$index[domainName$$module$main]);
  initialiseCaches$$module$cache();
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI) {
    enableCaptions$$module$captions(true);
  }
  const observer = new MutationObserver(mutationObserver$$module$main);
  observer.observe(document, {childList:true, subtree:true,});
  mutationObserver$$module$main();
}
var module$main = {};
})());
var a;a||(a=!0,(()=>{// Input 0
const LOGGING_LEVEL$$module$defines = 0;
const BROWSER$$module$defines = 0;
var module$defines = {};
module$defines.BROWSER = BROWSER$$module$defines;
module$defines.LOGGING_LEVEL = LOGGING_LEVEL$$module$defines;
// Input 1
const loggingPrefix$$module$logger = "[PiPer] ";
const LoggingLevel$$module$logger = {ALL:0, TRACE:10, INFO:20, WARNING:30, ERROR:40,};
const trace$$module$logger = LoggingLevel$$module$logger.TRACE >= LOGGING_LEVEL$$module$defines ? console.trace.bind(console) : function() {
};
const info$$module$logger = LoggingLevel$$module$logger.INFO >= LOGGING_LEVEL$$module$defines ? console.info.bind(console, loggingPrefix$$module$logger) : function() {
};
const warn$$module$logger = LoggingLevel$$module$logger.WARNING >= LOGGING_LEVEL$$module$defines ? console.warn.bind(console, loggingPrefix$$module$logger) : function() {
};
const error$$module$logger = LoggingLevel$$module$logger.ERROR >= LOGGING_LEVEL$$module$defines ? console.error.bind(console, loggingPrefix$$module$logger) : function() {
};
var module$logger = {};
module$logger.LoggingLevel = LoggingLevel$$module$logger;
module$logger.error = error$$module$logger;
module$logger.info = info$$module$logger;
module$logger.trace = trace$$module$logger;
module$logger.warn = warn$$module$logger;
// Input 2
const Browser$$module$common = {UNKNOWN:0, SAFARI:1, CHROME:2,};
const getBrowser$$module$common = function() {
  if (BROWSER$$module$defines != Browser$$module$common.UNKNOWN) {
    return BROWSER$$module$defines;
  }
  if (/Safari/.test(navigator.userAgent) && /Apple/.test(navigator.vendor)) {
    return Browser$$module$common.SAFARI;
  }
  if (/Chrome/.test(navigator.userAgent) && /Google/.test(navigator.vendor)) {
    return Browser$$module$common.CHROME;
  }
  return Browser$$module$common.UNKNOWN;
};
let PiperResource$$module$common;
let currentResource$$module$common = null;
const getResource$$module$common = function() {
  return currentResource$$module$common;
};
const setResource$$module$common = function(resource) {
  currentResource$$module$common = resource;
};
const getExtensionURL$$module$common = function(path) {
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      return safari.extension.baseURI + path;
    case Browser$$module$common.CHROME:
      return chrome.runtime.getURL(path);
    case Browser$$module$common.UNKNOWN:
    default:
      return path;
  }
};
const bypassBackgroundTimerThrottling$$module$common = function() {
  if (!currentResource$$module$common.captionElement) {
    warn$$module$logger("Unnecessary bypassing of background timer throttling on page without caption support");
  }
  const request = new XMLHttpRequest();
  request.open("GET", getExtensionURL$$module$common("scripts/fix.js"));
  request.onload = function() {
    const script = document.createElement("script");
    script.setAttribute("type", "module");
    script.appendChild(document.createTextNode(request.responseText));
    document.head.appendChild(script);
  };
  request.send();
};
var module$common = {};
module$common.Browser = Browser$$module$common;
module$common.bypassBackgroundTimerThrottling = bypassBackgroundTimerThrottling$$module$common;
module$common.getBrowser = getBrowser$$module$common;
module$common.getExtensionURL = getExtensionURL$$module$common;
module$common.getResource = getResource$$module$common;
module$common.setResource = setResource$$module$common;
// Input 3
const CHROME_PLAYING_PIP_ATTRIBUTE$$module$video = "data-playing-picture-in-picture";
const eventListeners$$module$video = [];
const togglePictureInPicture$$module$video = function(video) {
  const playingPictureInPicture = videoPlayingPictureInPicture$$module$video(video);
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      if (playingPictureInPicture) {
        video.webkitSetPresentationMode("inline");
      } else {
        video.webkitSetPresentationMode("picture-in-picture");
      }
      break;
    case Browser$$module$common.CHROME:
      if (playingPictureInPicture) {
        const script = document.createElement("script");
        script.textContent = "document.exitPictureInPicture()";
        document.head.appendChild(script);
        script.remove();
      } else {
        video.removeAttribute("disablepictureinpicture");
        video.requestPictureInPicture();
      }
      break;
    case Browser$$module$common.UNKNOWN:
    default:
      break;
  }
};
const addPictureInPictureEventListener$$module$video = function(listener) {
  const index = eventListeners$$module$video.indexOf(listener);
  if (index == -1) {
    eventListeners$$module$video.push(listener);
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI) {
    document.addEventListener("webkitpresentationmodechanged", videoPresentationModeChanged$$module$video, {capture:true,});
  }
};
const removePictureInPictureEventListener$$module$video = function(listener) {
  const index = eventListeners$$module$video.indexOf(listener);
  if (index > -1) {
    eventListeners$$module$video.splice(index, 1);
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI && eventListeners$$module$video.length == 0) {
    document.removeEventListener("webkitpresentationmodechanged", videoPresentationModeChanged$$module$video);
  }
};
const dispatchPictureInPictureEvent$$module$video = function(video) {
  const expectedVideo = getResource$$module$common().videoElement(true);
  if (video != expectedVideo) {
    return;
  }
  const isPlayingPictureInPicture = videoPlayingPictureInPicture$$module$video(video);
  if (isPlayingPictureInPicture) {
    info$$module$logger("Video entering Picture in Picture mode");
  } else {
    info$$module$logger("Video leaving Picture in Picture mode");
  }
  const eventListenersCopy = eventListeners$$module$video.slice();
  for (let listener; listener = eventListenersCopy.pop();) {
    listener(video, isPlayingPictureInPicture);
  }
};
const videoPresentationModeChanged$$module$video = function(event) {
  const video = event.target;
  dispatchPictureInPictureEvent$$module$video(video);
};
const videoPlayingPictureInPicture$$module$video = function(video) {
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      return video.webkitPresentationMode == "picture-in-picture";
    case Browser$$module$common.CHROME:
      return video.hasAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video);
    case Browser$$module$common.UNKNOWN:
    default:
      return false;
  }
};
const videoDidEnterPictureInPicture$$module$video = function(event) {
  const video = event.target;
  video.setAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video, true);
  dispatchPictureInPictureEvent$$module$video(video);
  video.addEventListener("leavepictureinpicture", function(event) {
    video.removeAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video);
    dispatchPictureInPictureEvent$$module$video(video);
  }, {once:true});
};
const addVideoElementListeners$$module$video = function() {
  const elements = document.getElementsByTagName("video");
  for (let index = 0, element; element = elements[index]; index++) {
    element.addEventListener("enterpictureinpicture", videoDidEnterPictureInPicture$$module$video);
  }
};
var module$video = {};
module$video.addPictureInPictureEventListener = addPictureInPictureEventListener$$module$video;
module$video.addVideoElementListeners = addVideoElementListeners$$module$video;
module$video.removePictureInPictureEventListener = removePictureInPictureEventListener$$module$video;
module$video.togglePictureInPicture = togglePictureInPicture$$module$video;
module$video.videoPlayingPictureInPicture = videoPlayingPictureInPicture$$module$video;
// Input 4
let activeVideo$$module$fix = null;
let timeoutId$$module$fix = 0;
let timeouts$$module$fix = {};
const requests$$module$fix = [];
const callbacks$$module$fix = [];
const originalSetTimeout$$module$fix = window.setTimeout;
const originalClearTimeout$$module$fix = window.clearTimeout;
const originalRequestAnimationFrame$$module$fix = window.requestAnimationFrame;
const trackAnimationFrameRequest$$module$fix = function(callback) {
  let request = 0;
  if (!activeVideo$$module$fix) {
    request = originalRequestAnimationFrame$$module$fix(callback);
    requests$$module$fix.push(request);
  }
  callbacks$$module$fix.push(callback);
  return request;
};
window.requestAnimationFrame = trackAnimationFrameRequest$$module$fix;
const clearAnimationFrameRequests$$module$fix = function() {
  requests$$module$fix.length = 0;
  callbacks$$module$fix.length = 0;
  originalRequestAnimationFrame$$module$fix(clearAnimationFrameRequests$$module$fix);
};
clearAnimationFrameRequests$$module$fix();
const callAnimationFrameRequestsAndTimeouts$$module$fix = function() {
  const callbacksCopy = callbacks$$module$fix.slice();
  callbacks$$module$fix.length = 0;
  const timestamp = window.performance.now();
  for (let callback; callback = callbacksCopy.pop();) {
    callback(timestamp);
  }
  const timeoutsCopy = timeouts$$module$fix;
  timeouts$$module$fix = {};
  for (let id in timeoutsCopy) {
    let timeout = timeoutsCopy[id];
    if (timeout[0] <= timestamp) {
      if (typeof timeout[1] == "function") {
        timeout[1]();
      } else {
        eval(timeout[1]);
      }
    } else {
      timeouts$$module$fix[id] = timeout;
    }
  }
};
const unthrottledSetTimeout$$module$fix = function(callback, timeout) {
  const id = timeoutId$$module$fix++;
  timeouts$$module$fix[id.toString()] = [window.performance.now() + (timeout || 0), callback];
  return id;
};
const unthrottledClearTimeout$$module$fix = function(id) {
  if (id) {
    delete timeouts$$module$fix[id.toString()];
  }
};
const bypassBackgroundTimerThrottling$$module$fix = function() {
  if (document.hidden) {
    const allVideos = document.querySelectorAll("video");
    for (let videoId = allVideos.length; videoId--;) {
      const video = allVideos[videoId];
      if (videoPlayingPictureInPicture$$module$video(video)) {
        activeVideo$$module$fix = video;
        break;
      }
    }
    if (!activeVideo$$module$fix) {
      return;
    }
    for (let request; request = requests$$module$fix.pop();) {
      window.cancelAnimationFrame(request);
    }
    window.setTimeout = unthrottledSetTimeout$$module$fix;
    window.clearTimeout = unthrottledClearTimeout$$module$fix;
    activeVideo$$module$fix.addEventListener("timeupdate", callAnimationFrameRequestsAndTimeouts$$module$fix);
    info$$module$logger("Bypassing background timer throttling");
  } else if (activeVideo$$module$fix) {
    info$$module$logger("Finished bypassing background timer throttling");
    window.setTimeout = originalSetTimeout$$module$fix;
    window.clearTimeout = originalClearTimeout$$module$fix;
    activeVideo$$module$fix.removeEventListener("timeupdate", callAnimationFrameRequestsAndTimeouts$$module$fix);
    activeVideo$$module$fix = null;
    for (let callbackId = callbacks$$module$fix.length; callbackId--;) {
      let request = originalRequestAnimationFrame$$module$fix(callbacks$$module$fix[callbackId]);
      requests$$module$fix.push(request);
    }
    const timestamp = window.performance.now();
    for (let id in timeouts$$module$fix) {
      let timeout = timeouts$$module$fix[id];
      originalSetTimeout$$module$fix(timeout[1], timeout[0] - timestamp);
    }
    timeouts$$module$fix = {};
  }
};
document.addEventListener("visibilitychange", bypassBackgroundTimerThrottling$$module$fix);
var module$fix = {};
})());
