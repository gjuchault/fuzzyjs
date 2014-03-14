// Fuzzy.js
// Written by Extaze
// Released under MIT license
(function(h){h.fuzzy=function(b,e,k,d,l){if(!e)return b;void 0===k&&(k=!1);if(void 0===d||void 0===l)d="<span>",l="</span>";e=e.toLowerCase().split("");var a=0,h=b.length,g=[];for(a;a<h;a++)for(var m=0,c=0,f="",n=[],p=k?b[a]:b[a].toLowerCase();c<b[a].length;){if(p[c]===e[m]){if(f+=d+b[a][c]+l,n.push(c),m++,m>=e.length){g.push(f+b[a].slice(c+1));break}}else f+=b[a][c];c++}d&&(g=g.sort(function(a,b){var c=a.split(d).length-1;scoreB=b.split(d).length-1;return c>scoreB?1:scoreB>c?-1:0}));return g}})(window);
