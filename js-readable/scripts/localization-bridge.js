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
const localizations$$module$localization = {};
localizations$$module$localization["button-title"] = {"en":"Open Picture in Picture mode", "de":"Bild-in-Bild starten", "nl":"Beeld in beeld starten", "fr":"D\u00e9marrer Image dans l\u2019image",};
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
// Input 3
window["localizedString"] = localizedString$$module$localization;
var module$localization_bridge = {};
})());
