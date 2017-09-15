/*
 * Added for temporary i18n support.s
 */

import en from './en';
import ar from './ar';

export default {

  bundleForLocale(){
    // @TODO Harjeet Singh added a patch for now for easy testing. Remove later.
    let lang = document.documentElement.getAttribute('lang') || 'en';
    if(window.location.search.indexOf("rtl")>0){
      lang = 'ar'
    }

    return this[lang] || this['defaultLocale'];
  },

  getI18N(key, parameters, boldParameters) {
    if(!this.bundle){
      this.bundle = this.bundleForLocale();
    }
    const replaceParameters = function(format, args) {
      for (let i = 0; i < args.length; i++) {
        format = format.replace(new RegExp('\\{' + i + '\\}', 'gm'), ((boldParameters) ? '<b>'+args[i]+'</b>' : args[i]));
      }
      return format;
    };

    if(parameters && parameters.length>0){
      return replaceParameters(this.bundle[key] || key, parameters);
    } else {
      return this.bundle[key] || key;
    }

  },

  'bundle': null,
  'defaultLocale': 'en',
  en,
  ar
}
