!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("CrossTab",[],e):"object"==typeof exports?exports.CrossTab=e():t.CrossTab=e()}(this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return t[o].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";var o=n(1);t.exports=o},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o=Math.random(),i=function t(e){var i=this;n(this,t),this.listen=function(t){i.listeners.indexOf(t)===-1&&i.listeners.push(t)},this.remove=function(t){i.listeners=i.listeners.filter(function(e){return e!==t})},this.emit=function(t){var e={origin:o,data:t};localStorage.setItem("cross-tab-"+i.id,JSON.stringify(e)),setTimeout(function(){localStorage.removeItem("cross-tab-"+i.id)},0)},this.id=e,this.listeners=[],"undefined"!=typeof window&&window.addEventListener("storage",function(t){if(t.newValue&&t.key==="cross-tab-"+i.id){var e=JSON.parse(t.newValue);e.origin!==o&&i.listeners.forEach(function(t){t(e.data)})}})};t.exports=i}])});
//# sourceMappingURL=CrossTab.js.map