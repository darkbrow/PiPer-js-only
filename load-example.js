const loadScript = async (url) => {
  const response = await fetch(url);
  const script = await response.text();
  new Function(script)();
}

const pipButtonInToolBar = "https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-compressed/scripts/main.js";
const subtitleInPIPFix= "https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-compressed/scripts/fix.js";

loadScript(pipButtonInToolBar);
loadScript(subtitleInPIPFix);
