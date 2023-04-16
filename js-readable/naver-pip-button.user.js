// ==UserScript==
// @name         naver-pip-button
// @namespace    https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main
// @homepage     https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main
// @version      1.0.4
// @description  Add Picture in Picture button on videos from naver.com.
// @icon         https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/toolbar/icon.png
// @author       amarcu5
// @match        *://*.naver.com/*
// @downloadURL  https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-readable/naver-pip-button.user.js
// @updateURL    https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-readable/naver-pip-button.user.js
// @grant        GM.xmlHttpRequest
// @connect      naver.com
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
localizations$$module$localization["button-title"] = {"en":"Open Picture in Picture mode", "de":"Bild-in-Bild starten", "ko":"\ud654\uba74 \uc18d \ud654\uba74", "nl":"Beeld in beeld starten", "fr":"D\u00e9marrer Image dans l\u2019image",};
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
const domain$$module$resources$naver = "naver";
const resource$$module$resources$naver = {buttonClassName:"control", buttonScale:0.7, buttonStyle:`
    /* Declaring CSS this way ensures it gets optimized when the extension is built */
    cursor: pointer;
    opacity: 1;
    padding: 0 0 0 12px;
    background-color: transparent;
    border-style: none;
  `, buttonHoverStyle:`opacity: 1 !important`, buttonParent:function() {
  var naverVidElements = [document.querySelector(".ControlBox_comp_control_box__zduPu .ControlBox_view_control_group__1DCTL"),document.querySelector(".VideoControlBox_view_control_group__Gls_j"), document.querySelector(".rmc_control_right"), document.querySelector(".pzp-pc__bottom-buttons-right"),];
  var naverVidElement = naverVidElements.findIndex(function(el) {
    return el !== null;
  });
  return naverVidElements[naverVidElement];
}, videoElement:function() {
  return document.querySelector(".webplayer-internal-video");
},};
var module$resources$naver = {};
module$resources$naver.domain = domain$$module$resources$naver;
module$resources$naver.resource = resource$$module$resources$naver;
// Input 6
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
// Input 7
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
// Input 8
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
// Input 9
const resources$$module$resources$index = {};
resources$$module$resources$index[domain$$module$resources$naver] = resource$$module$resources$naver;
var module$resources$index = {};
module$resources$index.resources = resources$$module$resources$index;
// Input 10
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
