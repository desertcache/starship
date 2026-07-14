(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=e(o);fetch(o.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Hh="165",lx=0,Af=1,dx=2,Pg=1,Lg=2,Vi=3,It=0,je=1,me=2,pn=0,vr=1,Ae=2,Cf=3,Rf=4,Dg=5,di=100,ux=101,hx=102,fx=103,px=104,da=200,mx=201,gx=202,vx=203,Ju=204,Qu=205,$u=206,xx=207,th=208,Sx=209,_x=210,Mx=211,wx=212,yx=213,bx=214,Tx=0,Ex=1,Ax=2,bl=3,Cx=4,Rx=5,Px=6,Lx=7,kh=0,Dx=1,Ix=2,Do=0,Ig=1,Ng=2,Og=3,Wh=4,Nx=5,Ug=6,Fg=7,zg=300,br=301,Tr=302,eh=303,nh=304,ed=306,Dt=1e3,ue=1001,ih=1002,dn=1003,Ox=1004,tc=1005,On=1006,Ad=1007,hs=1008,to=1009,Ux=1010,Fx=1011,Tl=1012,Bg=1013,Er=1014,Ki=1015,Gn=1016,Hg=1017,kg=1018,xs=1020,zx=35902,Bx=1021,Hx=1022,fi=1023,kx=1024,Wx=1025,xr=1026,Ss=1027,Wg=1028,Gg=1029,Gx=1030,Vg=1031,Xg=1033,Cd=33776,Rd=33777,Pd=33778,Ld=33779,Pf=35840,Lf=35841,Df=35842,If=35843,Nf=36196,Of=37492,Uf=37496,Ff=37808,zf=37809,Bf=37810,Hf=37811,kf=37812,Wf=37813,Gf=37814,Vf=37815,Xf=37816,Yf=37817,qf=37818,Zf=37819,Kf=37820,jf=37821,Dd=36492,Jf=36494,Qf=36495,Vx=36283,$f=36284,tp=36285,ep=36286,Xx=3200,Yx=3201,nd=0,qx=1,Ao="",Ke="srgb",Fo="srgb-linear",Gh="display-p3",id="display-p3-linear",El="linear",Ce="srgb",Al="rec709",Cl="p3",Es=7680,np=519,Zx=512,Kx=513,jx=514,Yg=515,Jx=516,Qx=517,$x=518,t2=519,oh=35044,e2=35048,ip="300 es",ji=2e3,Rl=2001;class ws{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const o=this._listeners[t];if(o!==void 0){const s=o.indexOf(e);s!==-1&&o.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const o=i.slice(0);for(let s=0,r=o.length;s<r;s++)o[s].call(this,t);t.target=null}}}const vn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let op=1234567;const ga=Math.PI/180,Ar=180/Math.PI;function $i(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(vn[n&255]+vn[n>>8&255]+vn[n>>16&255]+vn[n>>24&255]+"-"+vn[t&255]+vn[t>>8&255]+"-"+vn[t>>16&15|64]+vn[t>>24&255]+"-"+vn[e&63|128]+vn[e>>8&255]+"-"+vn[e>>16&255]+vn[e>>24&255]+vn[i&255]+vn[i>>8&255]+vn[i>>16&255]+vn[i>>24&255]).toLowerCase()}function ln(n,t,e){return Math.max(t,Math.min(e,n))}function Vh(n,t){return(n%t+t)%t}function n2(n,t,e,i,o){return i+(n-t)*(o-i)/(e-t)}function i2(n,t,e){return n!==t?(e-n)/(t-n):0}function va(n,t,e){return(1-e)*n+e*t}function o2(n,t,e,i){return va(n,t,1-Math.exp(-e*i))}function s2(n,t=1){return t-Math.abs(Vh(n,t*2)-t)}function r2(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function a2(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function c2(n,t){return n+Math.floor(Math.random()*(t-n+1))}function l2(n,t){return n+Math.random()*(t-n)}function d2(n){return n*(.5-Math.random())}function u2(n){n!==void 0&&(op=n);let t=op+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function h2(n){return n*ga}function f2(n){return n*Ar}function p2(n){return(n&n-1)===0&&n!==0}function m2(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function g2(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function v2(n,t,e,i,o){const s=Math.cos,r=Math.sin,a=s(e/2),c=r(e/2),l=s((t+i)/2),d=r((t+i)/2),u=s((t-i)/2),h=r((t-i)/2),f=s((i-t)/2),m=r((i-t)/2);switch(o){case"XYX":n.set(a*d,c*u,c*h,a*l);break;case"YZY":n.set(c*h,a*d,c*u,a*l);break;case"ZXZ":n.set(c*u,c*h,a*d,a*l);break;case"XZX":n.set(a*d,c*m,c*f,a*l);break;case"YXY":n.set(c*f,a*d,c*m,a*l);break;case"ZYZ":n.set(c*m,c*f,a*d,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+o)}}function ui(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function we(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const gn={DEG2RAD:ga,RAD2DEG:Ar,generateUUID:$i,clamp:ln,euclideanModulo:Vh,mapLinear:n2,inverseLerp:i2,lerp:va,damp:o2,pingpong:s2,smoothstep:r2,smootherstep:a2,randInt:c2,randFloat:l2,randFloatSpread:d2,seededRandom:u2,degToRad:h2,radToDeg:f2,isPowerOfTwo:p2,ceilPowerOfTwo:m2,floorPowerOfTwo:g2,setQuaternionFromProperEuler:v2,normalize:we,denormalize:ui};class rt{constructor(t=0,e=0){rt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,o=t.elements;return this.x=o[0]*e+o[3]*i+o[6],this.y=o[1]*e+o[4]*i+o[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ln(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),o=Math.sin(e),s=this.x-t.x,r=this.y-t.y;return this.x=s*i-r*o+t.x,this.y=s*o+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ee{constructor(t,e,i,o,s,r,a,c,l){ee.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,o,s,r,a,c,l)}set(t,e,i,o,s,r,a,c,l){const d=this.elements;return d[0]=t,d[1]=o,d[2]=a,d[3]=e,d[4]=s,d[5]=c,d[6]=i,d[7]=r,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,o=e.elements,s=this.elements,r=i[0],a=i[3],c=i[6],l=i[1],d=i[4],u=i[7],h=i[2],f=i[5],m=i[8],v=o[0],p=o[3],g=o[6],S=o[1],x=o[4],w=o[7],E=o[2],b=o[5],T=o[8];return s[0]=r*v+a*S+c*E,s[3]=r*p+a*x+c*b,s[6]=r*g+a*w+c*T,s[1]=l*v+d*S+u*E,s[4]=l*p+d*x+u*b,s[7]=l*g+d*w+u*T,s[2]=h*v+f*S+m*E,s[5]=h*p+f*x+m*b,s[8]=h*g+f*w+m*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],o=t[2],s=t[3],r=t[4],a=t[5],c=t[6],l=t[7],d=t[8];return e*r*d-e*a*l-i*s*d+i*a*c+o*s*l-o*r*c}invert(){const t=this.elements,e=t[0],i=t[1],o=t[2],s=t[3],r=t[4],a=t[5],c=t[6],l=t[7],d=t[8],u=d*r-a*l,h=a*c-d*s,f=l*s-r*c,m=e*u+i*h+o*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=u*v,t[1]=(o*l-d*i)*v,t[2]=(a*i-o*r)*v,t[3]=h*v,t[4]=(d*e-o*c)*v,t[5]=(o*s-a*e)*v,t[6]=f*v,t[7]=(i*c-l*e)*v,t[8]=(r*e-i*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,o,s,r,a){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*r+l*a)+r+t,-o*l,o*c,-o*(-l*r+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Id.makeScale(t,e)),this}rotate(t){return this.premultiply(Id.makeRotation(-t)),this}translate(t,e){return this.premultiply(Id.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let o=0;o<9;o++)if(e[o]!==i[o])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Id=new ee;function qg(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Pl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function x2(){const n=Pl("canvas");return n.style.display="block",n}const sp={};function Xh(n){n in sp||(sp[n]=!0,console.warn(n))}function S2(n,t,e){return new Promise(function(i,o){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:o();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}const rp=new ee().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ap=new ee().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ec={[Fo]:{transfer:El,primaries:Al,toReference:n=>n,fromReference:n=>n},[Ke]:{transfer:Ce,primaries:Al,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[id]:{transfer:El,primaries:Cl,toReference:n=>n.applyMatrix3(ap),fromReference:n=>n.applyMatrix3(rp)},[Gh]:{transfer:Ce,primaries:Cl,toReference:n=>n.convertSRGBToLinear().applyMatrix3(ap),fromReference:n=>n.applyMatrix3(rp).convertLinearToSRGB()}},_2=new Set([Fo,id]),ve={enabled:!0,_workingColorSpace:Fo,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!_2.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;const i=ec[t].toReference,o=ec[e].fromReference;return o(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return ec[n].primaries},getTransfer:function(n){return n===Ao?El:ec[n].transfer}};function Sr(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Nd(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let As;class M2{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{As===void 0&&(As=Pl("canvas")),As.width=t.width,As.height=t.height;const i=As.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=As}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Pl("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const o=i.getImageData(0,0,t.width,t.height),s=o.data;for(let r=0;r<s.length;r++)s[r]=Sr(s[r]/255)*255;return i.putImageData(o,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Sr(e[i]/255)*255):e[i]=Sr(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let w2=0;class Zg{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:w2++}),this.uuid=$i(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},o=this.data;if(o!==null){let s;if(Array.isArray(o)){s=[];for(let r=0,a=o.length;r<a;r++)o[r].isDataTexture?s.push(Od(o[r].image)):s.push(Od(o[r]))}else s=Od(o);i.url=s}return e||(t.images[this.uuid]=i),i}}function Od(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?M2.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let y2=0;class un extends ws{constructor(t=un.DEFAULT_IMAGE,e=un.DEFAULT_MAPPING,i=ue,o=ue,s=On,r=hs,a=fi,c=to,l=un.DEFAULT_ANISOTROPY,d=Ao){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:y2++}),this.uuid=$i(),this.name="",this.source=new Zg(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=o,this.magFilter=s,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new rt(0,0),this.repeat=new rt(1,1),this.center=new rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ee,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==zg)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Dt:t.x=t.x-Math.floor(t.x);break;case ue:t.x=t.x<0?0:1;break;case ih:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Dt:t.y=t.y-Math.floor(t.y);break;case ue:t.y=t.y<0?0:1;break;case ih:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=zg;un.DEFAULT_ANISOTROPY=1;class Ne{constructor(t=0,e=0,i=0,o=1){Ne.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=o}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,o){return this.x=t,this.y=e,this.z=i,this.w=o,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,o=this.z,s=this.w,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*o+r[12]*s,this.y=r[1]*e+r[5]*i+r[9]*o+r[13]*s,this.z=r[2]*e+r[6]*i+r[10]*o+r[14]*s,this.w=r[3]*e+r[7]*i+r[11]*o+r[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,o,s;const c=t.elements,l=c[0],d=c[4],u=c[8],h=c[1],f=c[5],m=c[9],v=c[2],p=c[6],g=c[10];if(Math.abs(d-h)<.01&&Math.abs(u-v)<.01&&Math.abs(m-p)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+v)<.1&&Math.abs(m+p)<.1&&Math.abs(l+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,w=(f+1)/2,E=(g+1)/2,b=(d+h)/4,T=(u+v)/4,C=(m+p)/4;return x>w&&x>E?x<.01?(i=0,o=.707106781,s=.707106781):(i=Math.sqrt(x),o=b/i,s=T/i):w>E?w<.01?(i=.707106781,o=0,s=.707106781):(o=Math.sqrt(w),i=b/o,s=C/o):E<.01?(i=.707106781,o=.707106781,s=0):(s=Math.sqrt(E),i=T/s,o=C/s),this.set(i,o,s,e),this}let S=Math.sqrt((p-m)*(p-m)+(u-v)*(u-v)+(h-d)*(h-d));return Math.abs(S)<.001&&(S=1),this.x=(p-m)/S,this.y=(u-v)/S,this.z=(h-d)/S,this.w=Math.acos((l+f+g-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class b2 extends ws{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ne(0,0,t,e),this.scissorTest=!1,this.viewport=new Ne(0,0,t,e);const o={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:On,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new un(o,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const r=i.count;for(let a=0;a<r;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let o=0,s=this.textures.length;o<s;o++)this.textures[o].image.width=t,this.textures[o].image.height=e,this.textures[o].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,o=t.textures.length;i<o;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Zg(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wn extends b2{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Kg extends un{constructor(t=null,e=1,i=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:o},this.magFilter=dn,this.minFilter=dn,this.wrapR=ue,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class T2 extends un{constructor(t=null,e=1,i=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:o},this.magFilter=dn,this.minFilter=dn,this.wrapR=ue,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class He{constructor(t=0,e=0,i=0,o=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=o}static slerpFlat(t,e,i,o,s,r,a){let c=i[o+0],l=i[o+1],d=i[o+2],u=i[o+3];const h=s[r+0],f=s[r+1],m=s[r+2],v=s[r+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(a===1){t[e+0]=h,t[e+1]=f,t[e+2]=m,t[e+3]=v;return}if(u!==v||c!==h||l!==f||d!==m){let p=1-a;const g=c*h+l*f+d*m+u*v,S=g>=0?1:-1,x=1-g*g;if(x>Number.EPSILON){const E=Math.sqrt(x),b=Math.atan2(E,g*S);p=Math.sin(p*b)/E,a=Math.sin(a*b)/E}const w=a*S;if(c=c*p+h*w,l=l*p+f*w,d=d*p+m*w,u=u*p+v*w,p===1-a){const E=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=E,l*=E,d*=E,u*=E}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,o,s,r){const a=i[o],c=i[o+1],l=i[o+2],d=i[o+3],u=s[r],h=s[r+1],f=s[r+2],m=s[r+3];return t[e]=a*m+d*u+c*f-l*h,t[e+1]=c*m+d*h+l*u-a*f,t[e+2]=l*m+d*f+a*h-c*u,t[e+3]=d*m-a*u-c*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,o){return this._x=t,this._y=e,this._z=i,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,o=t._y,s=t._z,r=t._order,a=Math.cos,c=Math.sin,l=a(i/2),d=a(o/2),u=a(s/2),h=c(i/2),f=c(o/2),m=c(s/2);switch(r){case"XYZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"YXZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"ZXY":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"ZYX":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"YZX":this._x=h*d*u+l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u-h*f*m;break;case"XZY":this._x=h*d*u-l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u+h*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,o=Math.sin(i);return this._x=t.x*o,this._y=t.y*o,this._z=t.z*o,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],o=e[4],s=e[8],r=e[1],a=e[5],c=e[9],l=e[2],d=e[6],u=e[10],h=i+a+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-c)*f,this._y=(s-l)*f,this._z=(r-o)*f}else if(i>a&&i>u){const f=2*Math.sqrt(1+i-a-u);this._w=(d-c)/f,this._x=.25*f,this._y=(o+r)/f,this._z=(s+l)/f}else if(a>u){const f=2*Math.sqrt(1+a-i-u);this._w=(s-l)/f,this._x=(o+r)/f,this._y=.25*f,this._z=(c+d)/f}else{const f=2*Math.sqrt(1+u-i-a);this._w=(r-o)/f,this._x=(s+l)/f,this._y=(c+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ln(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const o=Math.min(1,e/i);return this.slerp(t,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,o=t._y,s=t._z,r=t._w,a=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+r*a+o*l-s*c,this._y=o*d+r*c+s*a-i*l,this._z=s*d+r*l+i*c-o*a,this._w=r*d-i*a-o*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,o=this._y,s=this._z,r=this._w;let a=r*t._w+i*t._x+o*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=i,this._y=o,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-e;return this._w=f*r+e*this._w,this._x=f*i+e*this._x,this._y=f*o+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,a),u=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=r*u+this._w*h,this._x=i*u+this._x*h,this._y=o*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),o=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(o*Math.sin(t),o*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class M{constructor(t=0,e=0,i=0){M.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(cp.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(cp.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,o=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*o,this.y=s[1]*e+s[4]*i+s[7]*o,this.z=s[2]*e+s[5]*i+s[8]*o,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,o=this.z,s=t.elements,r=1/(s[3]*e+s[7]*i+s[11]*o+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*o+s[12])*r,this.y=(s[1]*e+s[5]*i+s[9]*o+s[13])*r,this.z=(s[2]*e+s[6]*i+s[10]*o+s[14])*r,this}applyQuaternion(t){const e=this.x,i=this.y,o=this.z,s=t.x,r=t.y,a=t.z,c=t.w,l=2*(r*o-a*i),d=2*(a*e-s*o),u=2*(s*i-r*e);return this.x=e+c*l+r*u-a*d,this.y=i+c*d+a*l-s*u,this.z=o+c*u+s*d-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,o=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*o,this.y=s[1]*e+s[5]*i+s[9]*o,this.z=s[2]*e+s[6]*i+s[10]*o,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,o=t.y,s=t.z,r=e.x,a=e.y,c=e.z;return this.x=o*c-s*a,this.y=s*r-i*c,this.z=i*a-o*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ud.copy(this).projectOnVector(t),this.sub(Ud)}reflect(t){return this.sub(Ud.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ln(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,o=this.z-t.z;return e*e+i*i+o*o}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const o=Math.sin(e)*t;return this.x=o*Math.sin(i),this.y=Math.cos(e)*t,this.z=o*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),o=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=o,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ud=new M,cp=new He;class ys{constructor(t=new M(1/0,1/0,1/0),e=new M(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ni.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ni.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ni.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=s.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,ni):ni.fromBufferAttribute(s,r),ni.applyMatrix4(t.matrixWorld),this.expandByPoint(ni);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),nc.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),nc.copy(i.boundingBox)),nc.applyMatrix4(t.matrixWorld),this.union(nc)}const o=t.children;for(let s=0,r=o.length;s<r;s++)this.expandByObject(o[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,ni),ni.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(kr),ic.subVectors(this.max,kr),Cs.subVectors(t.a,kr),Rs.subVectors(t.b,kr),Ps.subVectors(t.c,kr),co.subVectors(Rs,Cs),lo.subVectors(Ps,Rs),Zo.subVectors(Cs,Ps);let e=[0,-co.z,co.y,0,-lo.z,lo.y,0,-Zo.z,Zo.y,co.z,0,-co.x,lo.z,0,-lo.x,Zo.z,0,-Zo.x,-co.y,co.x,0,-lo.y,lo.x,0,-Zo.y,Zo.x,0];return!Fd(e,Cs,Rs,Ps,ic)||(e=[1,0,0,0,1,0,0,0,1],!Fd(e,Cs,Rs,Ps,ic))?!1:(oc.crossVectors(co,lo),e=[oc.x,oc.y,oc.z],Fd(e,Cs,Rs,Ps,ic))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ni).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ni).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Pi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Pi=[new M,new M,new M,new M,new M,new M,new M,new M],ni=new M,nc=new ys,Cs=new M,Rs=new M,Ps=new M,co=new M,lo=new M,Zo=new M,kr=new M,ic=new M,oc=new M,Ko=new M;function Fd(n,t,e,i,o){for(let s=0,r=n.length-3;s<=r;s+=3){Ko.fromArray(n,s);const a=o.x*Math.abs(Ko.x)+o.y*Math.abs(Ko.y)+o.z*Math.abs(Ko.z),c=t.dot(Ko),l=e.dot(Ko),d=i.dot(Ko);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>a)return!1}return!0}const E2=new ys,Wr=new M,zd=new M;class bs{constructor(t=new M,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):E2.setFromPoints(t).getCenter(i);let o=0;for(let s=0,r=t.length;s<r;s++)o=Math.max(o,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(o),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Wr.subVectors(t,this.center);const e=Wr.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),o=(i-this.radius)*.5;this.center.addScaledVector(Wr,o/i),this.radius+=o}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(zd.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Wr.copy(t.center).add(zd)),this.expandByPoint(Wr.copy(t.center).sub(zd))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Li=new M,Bd=new M,sc=new M,uo=new M,Hd=new M,rc=new M,kd=new M;class Yh{constructor(t=new M,e=new M(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Li)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Li.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Li.copy(this.origin).addScaledVector(this.direction,e),Li.distanceToSquared(t))}distanceSqToSegment(t,e,i,o){Bd.copy(t).add(e).multiplyScalar(.5),sc.copy(e).sub(t).normalize(),uo.copy(this.origin).sub(Bd);const s=t.distanceTo(e)*.5,r=-this.direction.dot(sc),a=uo.dot(this.direction),c=-uo.dot(sc),l=uo.lengthSq(),d=Math.abs(1-r*r);let u,h,f,m;if(d>0)if(u=r*c-a,h=r*a-c,m=s*d,u>=0)if(h>=-m)if(h<=m){const v=1/d;u*=v,h*=v,f=u*(u+r*h+2*a)+h*(r*u+h+2*c)+l}else h=s,u=Math.max(0,-(r*h+a)),f=-u*u+h*(h+2*c)+l;else h=-s,u=Math.max(0,-(r*h+a)),f=-u*u+h*(h+2*c)+l;else h<=-m?(u=Math.max(0,-(-r*s+a)),h=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l):h<=m?(u=0,h=Math.min(Math.max(-s,-c),s),f=h*(h+2*c)+l):(u=Math.max(0,-(r*s+a)),h=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l);else h=r>0?-s:s,u=Math.max(0,-(r*h+a)),f=-u*u+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),o&&o.copy(Bd).addScaledVector(sc,h),f}intersectSphere(t,e){Li.subVectors(t.center,this.origin);const i=Li.dot(this.direction),o=Li.dot(Li)-i*i,s=t.radius*t.radius;if(o>s)return null;const r=Math.sqrt(s-o),a=i-r,c=i+r;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,o,s,r,a,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,o=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,o=(t.min.x-h.x)*l),d>=0?(s=(t.min.y-h.y)*d,r=(t.max.y-h.y)*d):(s=(t.max.y-h.y)*d,r=(t.min.y-h.y)*d),i>r||s>o||((s>i||isNaN(i))&&(i=s),(r<o||isNaN(o))&&(o=r),u>=0?(a=(t.min.z-h.z)*u,c=(t.max.z-h.z)*u):(a=(t.max.z-h.z)*u,c=(t.min.z-h.z)*u),i>c||a>o)||((a>i||i!==i)&&(i=a),(c<o||o!==o)&&(o=c),o<0)?null:this.at(i>=0?i:o,e)}intersectsBox(t){return this.intersectBox(t,Li)!==null}intersectTriangle(t,e,i,o,s){Hd.subVectors(e,t),rc.subVectors(i,t),kd.crossVectors(Hd,rc);let r=this.direction.dot(kd),a;if(r>0){if(o)return null;a=1}else if(r<0)a=-1,r=-r;else return null;uo.subVectors(this.origin,t);const c=a*this.direction.dot(rc.crossVectors(uo,rc));if(c<0)return null;const l=a*this.direction.dot(Hd.cross(uo));if(l<0||c+l>r)return null;const d=-a*uo.dot(kd);return d<0?null:this.at(d/r,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Lt{constructor(t,e,i,o,s,r,a,c,l,d,u,h,f,m,v,p){Lt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,o,s,r,a,c,l,d,u,h,f,m,v,p)}set(t,e,i,o,s,r,a,c,l,d,u,h,f,m,v,p){const g=this.elements;return g[0]=t,g[4]=e,g[8]=i,g[12]=o,g[1]=s,g[5]=r,g[9]=a,g[13]=c,g[2]=l,g[6]=d,g[10]=u,g[14]=h,g[3]=f,g[7]=m,g[11]=v,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Lt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,o=1/Ls.setFromMatrixColumn(t,0).length(),s=1/Ls.setFromMatrixColumn(t,1).length(),r=1/Ls.setFromMatrixColumn(t,2).length();return e[0]=i[0]*o,e[1]=i[1]*o,e[2]=i[2]*o,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*r,e[9]=i[9]*r,e[10]=i[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,o=t.y,s=t.z,r=Math.cos(i),a=Math.sin(i),c=Math.cos(o),l=Math.sin(o),d=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const h=r*d,f=r*u,m=a*d,v=a*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=h-v*l,e[9]=-a*c,e[2]=v-h*l,e[6]=m+f*l,e[10]=r*c}else if(t.order==="YXZ"){const h=c*d,f=c*u,m=l*d,v=l*u;e[0]=h+v*a,e[4]=m*a-f,e[8]=r*l,e[1]=r*u,e[5]=r*d,e[9]=-a,e[2]=f*a-m,e[6]=v+h*a,e[10]=r*c}else if(t.order==="ZXY"){const h=c*d,f=c*u,m=l*d,v=l*u;e[0]=h-v*a,e[4]=-r*u,e[8]=m+f*a,e[1]=f+m*a,e[5]=r*d,e[9]=v-h*a,e[2]=-r*l,e[6]=a,e[10]=r*c}else if(t.order==="ZYX"){const h=r*d,f=r*u,m=a*d,v=a*u;e[0]=c*d,e[4]=m*l-f,e[8]=h*l+v,e[1]=c*u,e[5]=v*l+h,e[9]=f*l-m,e[2]=-l,e[6]=a*c,e[10]=r*c}else if(t.order==="YZX"){const h=r*c,f=r*l,m=a*c,v=a*l;e[0]=c*d,e[4]=v-h*u,e[8]=m*u+f,e[1]=u,e[5]=r*d,e[9]=-a*d,e[2]=-l*d,e[6]=f*u+m,e[10]=h-v*u}else if(t.order==="XZY"){const h=r*c,f=r*l,m=a*c,v=a*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=h*u+v,e[5]=r*d,e[9]=f*u-m,e[2]=m*u-f,e[6]=a*d,e[10]=v*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(A2,t,C2)}lookAt(t,e,i){const o=this.elements;return Fn.subVectors(t,e),Fn.lengthSq()===0&&(Fn.z=1),Fn.normalize(),ho.crossVectors(i,Fn),ho.lengthSq()===0&&(Math.abs(i.z)===1?Fn.x+=1e-4:Fn.z+=1e-4,Fn.normalize(),ho.crossVectors(i,Fn)),ho.normalize(),ac.crossVectors(Fn,ho),o[0]=ho.x,o[4]=ac.x,o[8]=Fn.x,o[1]=ho.y,o[5]=ac.y,o[9]=Fn.y,o[2]=ho.z,o[6]=ac.z,o[10]=Fn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,o=e.elements,s=this.elements,r=i[0],a=i[4],c=i[8],l=i[12],d=i[1],u=i[5],h=i[9],f=i[13],m=i[2],v=i[6],p=i[10],g=i[14],S=i[3],x=i[7],w=i[11],E=i[15],b=o[0],T=o[4],C=o[8],y=o[12],_=o[1],R=o[5],D=o[9],N=o[13],z=o[2],B=o[6],V=o[10],j=o[14],Y=o[3],J=o[7],k=o[11],$=o[15];return s[0]=r*b+a*_+c*z+l*Y,s[4]=r*T+a*R+c*B+l*J,s[8]=r*C+a*D+c*V+l*k,s[12]=r*y+a*N+c*j+l*$,s[1]=d*b+u*_+h*z+f*Y,s[5]=d*T+u*R+h*B+f*J,s[9]=d*C+u*D+h*V+f*k,s[13]=d*y+u*N+h*j+f*$,s[2]=m*b+v*_+p*z+g*Y,s[6]=m*T+v*R+p*B+g*J,s[10]=m*C+v*D+p*V+g*k,s[14]=m*y+v*N+p*j+g*$,s[3]=S*b+x*_+w*z+E*Y,s[7]=S*T+x*R+w*B+E*J,s[11]=S*C+x*D+w*V+E*k,s[15]=S*y+x*N+w*j+E*$,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],o=t[8],s=t[12],r=t[1],a=t[5],c=t[9],l=t[13],d=t[2],u=t[6],h=t[10],f=t[14],m=t[3],v=t[7],p=t[11],g=t[15];return m*(+s*c*u-o*l*u-s*a*h+i*l*h+o*a*f-i*c*f)+v*(+e*c*f-e*l*h+s*r*h-o*r*f+o*l*d-s*c*d)+p*(+e*l*u-e*a*f-s*r*u+i*r*f+s*a*d-i*l*d)+g*(-o*a*d-e*c*u+e*a*h+o*r*u-i*r*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const o=this.elements;return t.isVector3?(o[12]=t.x,o[13]=t.y,o[14]=t.z):(o[12]=t,o[13]=e,o[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],o=t[2],s=t[3],r=t[4],a=t[5],c=t[6],l=t[7],d=t[8],u=t[9],h=t[10],f=t[11],m=t[12],v=t[13],p=t[14],g=t[15],S=u*p*l-v*h*l+v*c*f-a*p*f-u*c*g+a*h*g,x=m*h*l-d*p*l-m*c*f+r*p*f+d*c*g-r*h*g,w=d*v*l-m*u*l+m*a*f-r*v*f-d*a*g+r*u*g,E=m*u*c-d*v*c-m*a*h+r*v*h+d*a*p-r*u*p,b=e*S+i*x+o*w+s*E;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/b;return t[0]=S*T,t[1]=(v*h*s-u*p*s-v*o*f+i*p*f+u*o*g-i*h*g)*T,t[2]=(a*p*s-v*c*s+v*o*l-i*p*l-a*o*g+i*c*g)*T,t[3]=(u*c*s-a*h*s-u*o*l+i*h*l+a*o*f-i*c*f)*T,t[4]=x*T,t[5]=(d*p*s-m*h*s+m*o*f-e*p*f-d*o*g+e*h*g)*T,t[6]=(m*c*s-r*p*s-m*o*l+e*p*l+r*o*g-e*c*g)*T,t[7]=(r*h*s-d*c*s+d*o*l-e*h*l-r*o*f+e*c*f)*T,t[8]=w*T,t[9]=(m*u*s-d*v*s-m*i*f+e*v*f+d*i*g-e*u*g)*T,t[10]=(r*v*s-m*a*s+m*i*l-e*v*l-r*i*g+e*a*g)*T,t[11]=(d*a*s-r*u*s-d*i*l+e*u*l+r*i*f-e*a*f)*T,t[12]=E*T,t[13]=(d*v*o-m*u*o+m*i*h-e*v*h-d*i*p+e*u*p)*T,t[14]=(m*a*o-r*v*o-m*i*c+e*v*c+r*i*p-e*a*p)*T,t[15]=(r*u*o-d*a*o+d*i*c-e*u*c-r*i*h+e*a*h)*T,this}scale(t){const e=this.elements,i=t.x,o=t.y,s=t.z;return e[0]*=i,e[4]*=o,e[8]*=s,e[1]*=i,e[5]*=o,e[9]*=s,e[2]*=i,e[6]*=o,e[10]*=s,e[3]*=i,e[7]*=o,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],o=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,o))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),o=Math.sin(e),s=1-i,r=t.x,a=t.y,c=t.z,l=s*r,d=s*a;return this.set(l*r+i,l*a-o*c,l*c+o*a,0,l*a+o*c,d*a+i,d*c-o*r,0,l*c-o*a,d*c+o*r,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,o,s,r){return this.set(1,i,s,0,t,1,r,0,e,o,1,0,0,0,0,1),this}compose(t,e,i){const o=this.elements,s=e._x,r=e._y,a=e._z,c=e._w,l=s+s,d=r+r,u=a+a,h=s*l,f=s*d,m=s*u,v=r*d,p=r*u,g=a*u,S=c*l,x=c*d,w=c*u,E=i.x,b=i.y,T=i.z;return o[0]=(1-(v+g))*E,o[1]=(f+w)*E,o[2]=(m-x)*E,o[3]=0,o[4]=(f-w)*b,o[5]=(1-(h+g))*b,o[6]=(p+S)*b,o[7]=0,o[8]=(m+x)*T,o[9]=(p-S)*T,o[10]=(1-(h+v))*T,o[11]=0,o[12]=t.x,o[13]=t.y,o[14]=t.z,o[15]=1,this}decompose(t,e,i){const o=this.elements;let s=Ls.set(o[0],o[1],o[2]).length();const r=Ls.set(o[4],o[5],o[6]).length(),a=Ls.set(o[8],o[9],o[10]).length();this.determinant()<0&&(s=-s),t.x=o[12],t.y=o[13],t.z=o[14],ii.copy(this);const l=1/s,d=1/r,u=1/a;return ii.elements[0]*=l,ii.elements[1]*=l,ii.elements[2]*=l,ii.elements[4]*=d,ii.elements[5]*=d,ii.elements[6]*=d,ii.elements[8]*=u,ii.elements[9]*=u,ii.elements[10]*=u,e.setFromRotationMatrix(ii),i.x=s,i.y=r,i.z=a,this}makePerspective(t,e,i,o,s,r,a=ji){const c=this.elements,l=2*s/(e-t),d=2*s/(i-o),u=(e+t)/(e-t),h=(i+o)/(i-o);let f,m;if(a===ji)f=-(r+s)/(r-s),m=-2*r*s/(r-s);else if(a===Rl)f=-r/(r-s),m=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,o,s,r,a=ji){const c=this.elements,l=1/(e-t),d=1/(i-o),u=1/(r-s),h=(e+t)*l,f=(i+o)*d;let m,v;if(a===ji)m=(r+s)*u,v=-2*u;else if(a===Rl)m=s*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let o=0;o<16;o++)if(e[o]!==i[o])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ls=new M,ii=new Lt,A2=new M(0,0,0),C2=new M(1,1,1),ho=new M,ac=new M,Fn=new M,lp=new Lt,dp=new He;class Je{constructor(t=0,e=0,i=0,o=Je.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=o}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,o=this._order){return this._x=t,this._y=e,this._z=i,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const o=t.elements,s=o[0],r=o[4],a=o[8],c=o[1],l=o[5],d=o[9],u=o[2],h=o[6],f=o[10];switch(e){case"XYZ":this._y=Math.asin(ln(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ln(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(ln(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-ln(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(ln(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ln(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-d,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return lp.makeRotationFromQuaternion(t),this.setFromRotationMatrix(lp,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return dp.setFromEuler(this),this.setFromQuaternion(dp,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Je.DEFAULT_ORDER="XYZ";class qh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let R2=0;const up=new M,Ds=new He,Di=new Lt,cc=new M,Gr=new M,P2=new M,L2=new He,hp=new M(1,0,0),fp=new M(0,1,0),pp=new M(0,0,1),mp={type:"added"},D2={type:"removed"},Is={type:"childadded",child:null},Wd={type:"childremoved",child:null};class ye extends ws{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:R2++}),this.uuid=$i(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ye.DEFAULT_UP.clone();const t=new M,e=new Je,i=new He,o=new M(1,1,1);function s(){i.setFromEuler(e,!1)}function r(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Lt},normalMatrix:{value:new ee}}),this.matrix=new Lt,this.matrixWorld=new Lt,this.matrixAutoUpdate=ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ds.setFromAxisAngle(t,e),this.quaternion.multiply(Ds),this}rotateOnWorldAxis(t,e){return Ds.setFromAxisAngle(t,e),this.quaternion.premultiply(Ds),this}rotateX(t){return this.rotateOnAxis(hp,t)}rotateY(t){return this.rotateOnAxis(fp,t)}rotateZ(t){return this.rotateOnAxis(pp,t)}translateOnAxis(t,e){return up.copy(t).applyQuaternion(this.quaternion),this.position.add(up.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(hp,t)}translateY(t){return this.translateOnAxis(fp,t)}translateZ(t){return this.translateOnAxis(pp,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Di.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?cc.copy(t):cc.set(t,e,i);const o=this.parent;this.updateWorldMatrix(!0,!1),Gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Di.lookAt(Gr,cc,this.up):Di.lookAt(cc,Gr,this.up),this.quaternion.setFromRotationMatrix(Di),o&&(Di.extractRotation(o.matrixWorld),Ds.setFromRotationMatrix(Di),this.quaternion.premultiply(Ds.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(mp),Is.child=t,this.dispatchEvent(Is),Is.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(D2),Wd.child=t,this.dispatchEvent(Wd),Wd.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Di.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Di.multiply(t.parent.matrixWorld)),t.applyMatrix4(Di),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(mp),Is.child=t,this.dispatchEvent(Is),Is.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,o=this.children.length;i<o;i++){const r=this.children[i].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const o=this.children;for(let s=0,r=o.length;s<r;s++)o[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,t,P2),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,L2,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,o=e.length;i<o;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,o=e.length;i<o;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,o=e.length;i<o;i++){const s=e[i];(s.matrixWorldAutoUpdate===!0||t===!0)&&s.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const o=this.children;for(let s=0,r=o.length;s<r;s++){const a=o[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.visibility=this._visibility,o.active=this._active,o.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),o.maxGeometryCount=this._maxGeometryCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.geometryCount=this._geometryCount,o.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(o.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(o.boundingSphere={center:o.boundingSphere.center.toArray(),radius:o.boundingSphere.radius}),this.boundingBox!==null&&(o.boundingBox={min:o.boundingBox.min.toArray(),max:o.boundingBox.max.toArray()}));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(t.materials,this.material[c]));o.material=a}else o.material=s(t.materials,this.material);if(this.children.length>0){o.children=[];for(let a=0;a<this.children.length;a++)o.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){o.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];o.animations.push(s(t.animations,c))}}if(e){const a=r(t.geometries),c=r(t.materials),l=r(t.textures),d=r(t.images),u=r(t.shapes),h=r(t.skeletons),f=r(t.animations),m=r(t.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=o,i;function r(a){const c=[];for(const l in a){const d=a[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const o=t.children[i];this.add(o.clone())}return this}}ye.DEFAULT_UP=new M(0,1,0);ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const oi=new M,Ii=new M,Gd=new M,Ni=new M,Ns=new M,Os=new M,gp=new M,Vd=new M,Xd=new M,Yd=new M;class hi{constructor(t=new M,e=new M,i=new M){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,o){o.subVectors(i,e),oi.subVectors(t,e),o.cross(oi);const s=o.lengthSq();return s>0?o.multiplyScalar(1/Math.sqrt(s)):o.set(0,0,0)}static getBarycoord(t,e,i,o,s){oi.subVectors(o,e),Ii.subVectors(i,e),Gd.subVectors(t,e);const r=oi.dot(oi),a=oi.dot(Ii),c=oi.dot(Gd),l=Ii.dot(Ii),d=Ii.dot(Gd),u=r*l-a*a;if(u===0)return s.set(0,0,0),null;const h=1/u,f=(l*c-a*d)*h,m=(r*d-a*c)*h;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,o){return this.getBarycoord(t,e,i,o,Ni)===null?!1:Ni.x>=0&&Ni.y>=0&&Ni.x+Ni.y<=1}static getInterpolation(t,e,i,o,s,r,a,c){return this.getBarycoord(t,e,i,o,Ni)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Ni.x),c.addScaledVector(r,Ni.y),c.addScaledVector(a,Ni.z),c)}static isFrontFacing(t,e,i,o){return oi.subVectors(i,e),Ii.subVectors(t,e),oi.cross(Ii).dot(o)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,o){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[o]),this}setFromAttributeAndIndices(t,e,i,o){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,o),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return oi.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),oi.cross(Ii).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return hi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return hi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,o,s){return hi.getInterpolation(t,this.a,this.b,this.c,e,i,o,s)}containsPoint(t){return hi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return hi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,o=this.b,s=this.c;let r,a;Ns.subVectors(o,i),Os.subVectors(s,i),Vd.subVectors(t,i);const c=Ns.dot(Vd),l=Os.dot(Vd);if(c<=0&&l<=0)return e.copy(i);Xd.subVectors(t,o);const d=Ns.dot(Xd),u=Os.dot(Xd);if(d>=0&&u<=d)return e.copy(o);const h=c*u-d*l;if(h<=0&&c>=0&&d<=0)return r=c/(c-d),e.copy(i).addScaledVector(Ns,r);Yd.subVectors(t,s);const f=Ns.dot(Yd),m=Os.dot(Yd);if(m>=0&&f<=m)return e.copy(s);const v=f*l-c*m;if(v<=0&&l>=0&&m<=0)return a=l/(l-m),e.copy(i).addScaledVector(Os,a);const p=d*m-f*u;if(p<=0&&u-d>=0&&f-m>=0)return gp.subVectors(s,o),a=(u-d)/(u-d+(f-m)),e.copy(o).addScaledVector(gp,a);const g=1/(p+v+h);return r=v*g,a=h*g,e.copy(i).addScaledVector(Ns,r).addScaledVector(Os,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const jg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fo={h:0,s:0,l:0},lc={h:0,s:0,l:0};function qd(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class St{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const o=t;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ke){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ve.toWorkingColorSpace(this,e),this}setRGB(t,e,i,o=ve.workingColorSpace){return this.r=t,this.g=e,this.b=i,ve.toWorkingColorSpace(this,o),this}setHSL(t,e,i,o=ve.workingColorSpace){if(t=Vh(t,1),e=ln(e,0,1),i=ln(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,r=2*i-s;this.r=qd(r,s,t+1/3),this.g=qd(r,s,t),this.b=qd(r,s,t-1/3)}return ve.toWorkingColorSpace(this,o),this}setStyle(t,e=Ke){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const r=o[1],a=o[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=o[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ke){const i=jg[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Sr(t.r),this.g=Sr(t.g),this.b=Sr(t.b),this}copyLinearToSRGB(t){return this.r=Nd(t.r),this.g=Nd(t.g),this.b=Nd(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ke){return ve.fromWorkingColorSpace(xn.copy(this),t),Math.round(ln(xn.r*255,0,255))*65536+Math.round(ln(xn.g*255,0,255))*256+Math.round(ln(xn.b*255,0,255))}getHexString(t=Ke){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ve.workingColorSpace){ve.fromWorkingColorSpace(xn.copy(this),e);const i=xn.r,o=xn.g,s=xn.b,r=Math.max(i,o,s),a=Math.min(i,o,s);let c,l;const d=(a+r)/2;if(a===r)c=0,l=0;else{const u=r-a;switch(l=d<=.5?u/(r+a):u/(2-r-a),r){case i:c=(o-s)/u+(o<s?6:0);break;case o:c=(s-i)/u+2;break;case s:c=(i-o)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=ve.workingColorSpace){return ve.fromWorkingColorSpace(xn.copy(this),e),t.r=xn.r,t.g=xn.g,t.b=xn.b,t}getStyle(t=Ke){ve.fromWorkingColorSpace(xn.copy(this),t);const e=xn.r,i=xn.g,o=xn.b;return t!==Ke?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(o*255)})`}offsetHSL(t,e,i){return this.getHSL(fo),this.setHSL(fo.h+t,fo.s+e,fo.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(fo),t.getHSL(lc);const i=va(fo.h,lc.h,e),o=va(fo.s,lc.s,e),s=va(fo.l,lc.l,e);return this.setHSL(i,o,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,o=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*o,this.g=s[1]*e+s[4]*i+s[7]*o,this.b=s[2]*e+s[5]*i+s[8]*o,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const xn=new St;St.NAMES=jg;let I2=0;class Ei extends ws{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:I2++}),this.uuid=$i(),this.name="",this.type="Material",this.blending=vr,this.side=It,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ju,this.blendDst=Qu,this.blendEquation=di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=bl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=np,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Es,this.stencilZFail=Es,this.stencilZPass=Es,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const o=this[e];if(o===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(i):o&&o.isVector3&&i&&i.isVector3?o.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==vr&&(i.blending=this.blending),this.side!==It&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ju&&(i.blendSrc=this.blendSrc),this.blendDst!==Qu&&(i.blendDst=this.blendDst),this.blendEquation!==di&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==bl&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==np&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Es&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Es&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Es&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function o(s){const r=[];for(const a in s){const c=s[a];delete c.metadata,r.push(c)}return r}if(e){const s=o(t.textures),r=o(t.images);s.length>0&&(i.textures=s),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const o=e.length;i=new Array(o);for(let s=0;s!==o;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class lt extends Ei{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Je,this.combine=kh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const qe=new M,dc=new rt;class re{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=oh,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Ki,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return Xh("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let o=0,s=this.itemSize;o<s;o++)this.array[t+o]=e.array[i+o];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)dc.fromBufferAttribute(this,e),dc.applyMatrix3(t),this.setXY(e,dc.x,dc.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)qe.fromBufferAttribute(this,e),qe.applyMatrix3(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)qe.fromBufferAttribute(this,e),qe.applyMatrix4(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)qe.fromBufferAttribute(this,e),qe.applyNormalMatrix(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)qe.fromBufferAttribute(this,e),qe.transformDirection(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=ui(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=we(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ui(e,this.array)),e}setX(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ui(e,this.array)),e}setY(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ui(e,this.array)),e}setZ(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ui(e,this.array)),e}setW(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=we(e,this.array),i=we(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,o){return t*=this.itemSize,this.normalized&&(e=we(e,this.array),i=we(i,this.array),o=we(o,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=o,this}setXYZW(t,e,i,o,s){return t*=this.itemSize,this.normalized&&(e=we(e,this.array),i=we(i,this.array),o=we(o,this.array),s=we(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=o,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==oh&&(t.usage=this.usage),t}}class Jg extends re{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Qg extends re{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class oe extends re{constructor(t,e,i){super(new Float32Array(t),e,i)}}let N2=0;const Kn=new Lt,Zd=new ye,Us=new M,zn=new ys,Vr=new ys,rn=new M;class ce extends ws{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:N2++}),this.uuid=$i(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(qg(t)?Qg:Jg)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ee().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(t),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Kn.makeRotationFromQuaternion(t),this.applyMatrix4(Kn),this}rotateX(t){return Kn.makeRotationX(t),this.applyMatrix4(Kn),this}rotateY(t){return Kn.makeRotationY(t),this.applyMatrix4(Kn),this}rotateZ(t){return Kn.makeRotationZ(t),this.applyMatrix4(Kn),this}translate(t,e,i){return Kn.makeTranslation(t,e,i),this.applyMatrix4(Kn),this}scale(t,e,i){return Kn.makeScale(t,e,i),this.applyMatrix4(Kn),this}lookAt(t){return Zd.lookAt(t),Zd.updateMatrix(),this.applyMatrix4(Zd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Us).negate(),this.translate(Us.x,Us.y,Us.z),this}setFromPoints(t){const e=[];for(let i=0,o=t.length;i<o;i++){const s=t[i];e.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new oe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ys);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new M(-1/0,-1/0,-1/0),new M(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,o=e.length;i<o;i++){const s=e[i];zn.setFromBufferAttribute(s),this.morphTargetsRelative?(rn.addVectors(this.boundingBox.min,zn.min),this.boundingBox.expandByPoint(rn),rn.addVectors(this.boundingBox.max,zn.max),this.boundingBox.expandByPoint(rn)):(this.boundingBox.expandByPoint(zn.min),this.boundingBox.expandByPoint(zn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new bs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new M,1/0);return}if(t){const i=this.boundingSphere.center;if(zn.setFromBufferAttribute(t),e)for(let s=0,r=e.length;s<r;s++){const a=e[s];Vr.setFromBufferAttribute(a),this.morphTargetsRelative?(rn.addVectors(zn.min,Vr.min),zn.expandByPoint(rn),rn.addVectors(zn.max,Vr.max),zn.expandByPoint(rn)):(zn.expandByPoint(Vr.min),zn.expandByPoint(Vr.max))}zn.getCenter(i);let o=0;for(let s=0,r=t.count;s<r;s++)rn.fromBufferAttribute(t,s),o=Math.max(o,i.distanceToSquared(rn));if(e)for(let s=0,r=e.length;s<r;s++){const a=e[s],c=this.morphTargetsRelative;for(let l=0,d=a.count;l<d;l++)rn.fromBufferAttribute(a,l),c&&(Us.fromBufferAttribute(t,l),rn.add(Us)),o=Math.max(o,i.distanceToSquared(rn))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,o=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new re(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<i.count;C++)a[C]=new M,c[C]=new M;const l=new M,d=new M,u=new M,h=new rt,f=new rt,m=new rt,v=new M,p=new M;function g(C,y,_){l.fromBufferAttribute(i,C),d.fromBufferAttribute(i,y),u.fromBufferAttribute(i,_),h.fromBufferAttribute(s,C),f.fromBufferAttribute(s,y),m.fromBufferAttribute(s,_),d.sub(l),u.sub(l),f.sub(h),m.sub(h);const R=1/(f.x*m.y-m.x*f.y);isFinite(R)&&(v.copy(d).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(R),p.copy(u).multiplyScalar(f.x).addScaledVector(d,-m.x).multiplyScalar(R),a[C].add(v),a[y].add(v),a[_].add(v),c[C].add(p),c[y].add(p),c[_].add(p))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let C=0,y=S.length;C<y;++C){const _=S[C],R=_.start,D=_.count;for(let N=R,z=R+D;N<z;N+=3)g(t.getX(N+0),t.getX(N+1),t.getX(N+2))}const x=new M,w=new M,E=new M,b=new M;function T(C){E.fromBufferAttribute(o,C),b.copy(E);const y=a[C];x.copy(y),x.sub(E.multiplyScalar(E.dot(y))).normalize(),w.crossVectors(b,y);const R=w.dot(c[C])<0?-1:1;r.setXYZW(C,x.x,x.y,x.z,R)}for(let C=0,y=S.length;C<y;++C){const _=S[C],R=_.start,D=_.count;for(let N=R,z=R+D;N<z;N+=3)T(t.getX(N+0)),T(t.getX(N+1)),T(t.getX(N+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new re(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const o=new M,s=new M,r=new M,a=new M,c=new M,l=new M,d=new M,u=new M;if(t)for(let h=0,f=t.count;h<f;h+=3){const m=t.getX(h+0),v=t.getX(h+1),p=t.getX(h+2);o.fromBufferAttribute(e,m),s.fromBufferAttribute(e,v),r.fromBufferAttribute(e,p),d.subVectors(r,s),u.subVectors(o,s),d.cross(u),a.fromBufferAttribute(i,m),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,p),a.add(d),c.add(d),l.add(d),i.setXYZ(m,a.x,a.y,a.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let h=0,f=e.count;h<f;h+=3)o.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),r.fromBufferAttribute(e,h+2),d.subVectors(r,s),u.subVectors(o,s),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)rn.fromBufferAttribute(t,e),rn.normalize(),t.setXYZ(e,rn.x,rn.y,rn.z)}toNonIndexed(){function t(a,c){const l=a.array,d=a.itemSize,u=a.normalized,h=new l.constructor(c.length*d);let f=0,m=0;for(let v=0,p=c.length;v<p;v++){a.isInterleavedBufferAttribute?f=c[v]*a.data.stride+a.offset:f=c[v]*d;for(let g=0;g<d;g++)h[m++]=l[f++]}return new re(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ce,i=this.index.array,o=this.attributes;for(const a in o){const c=o[a],l=t(c,i);e.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let d=0,u=l.length;d<u;d++){const h=l[d],f=t(h,i);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,c=r.length;a<c;a++){const l=r[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const o={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,h=l.length;u<h;u++){const f=l[u];d.push(f.toJSON(t.data))}d.length>0&&(o[c]=d,s=!0)}s&&(t.data.morphAttributes=o,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const o=t.attributes;for(const l in o){const d=o[l];this.setAttribute(l,d.clone(e))}const s=t.morphAttributes;for(const l in s){const d=[],u=s[l];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,d=r.length;l<d;l++){const u=r[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const vp=new Lt,jo=new Yh,uc=new bs,xp=new M,Fs=new M,zs=new M,Bs=new M,Kd=new M,hc=new M,fc=new rt,pc=new rt,mc=new rt,Sp=new M,_p=new M,Mp=new M,gc=new M,vc=new M;class L extends ye{constructor(t=new ce,e=new lt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const o=e[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=o.length;s<r;s++){const a=o[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const i=this.geometry,o=i.attributes.position,s=i.morphAttributes.position,r=i.morphTargetsRelative;e.fromBufferAttribute(o,t);const a=this.morphTargetInfluences;if(s&&a){hc.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const d=a[c],u=s[c];d!==0&&(Kd.fromBufferAttribute(u,t),r?hc.addScaledVector(Kd,d):hc.addScaledVector(Kd.sub(e),d))}e.add(hc)}return e}raycast(t,e){const i=this.geometry,o=this.material,s=this.matrixWorld;o!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),uc.copy(i.boundingSphere),uc.applyMatrix4(s),jo.copy(t.ray).recast(t.near),!(uc.containsPoint(jo.origin)===!1&&(jo.intersectSphere(uc,xp)===null||jo.origin.distanceToSquared(xp)>(t.far-t.near)**2))&&(vp.copy(s).invert(),jo.copy(t.ray).applyMatrix4(vp),!(i.boundingBox!==null&&jo.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,jo)))}_computeIntersections(t,e,i){let o;const s=this.geometry,r=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(r))for(let m=0,v=h.length;m<v;m++){const p=h[m],g=r[p.materialIndex],S=Math.max(p.start,f.start),x=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let w=S,E=x;w<E;w+=3){const b=a.getX(w),T=a.getX(w+1),C=a.getX(w+2);o=xc(this,g,t,i,l,d,u,b,T,C),o&&(o.faceIndex=Math.floor(w/3),o.face.materialIndex=p.materialIndex,e.push(o))}}else{const m=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let p=m,g=v;p<g;p+=3){const S=a.getX(p),x=a.getX(p+1),w=a.getX(p+2);o=xc(this,r,t,i,l,d,u,S,x,w),o&&(o.faceIndex=Math.floor(p/3),e.push(o))}}else if(c!==void 0)if(Array.isArray(r))for(let m=0,v=h.length;m<v;m++){const p=h[m],g=r[p.materialIndex],S=Math.max(p.start,f.start),x=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let w=S,E=x;w<E;w+=3){const b=w,T=w+1,C=w+2;o=xc(this,g,t,i,l,d,u,b,T,C),o&&(o.faceIndex=Math.floor(w/3),o.face.materialIndex=p.materialIndex,e.push(o))}}else{const m=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let p=m,g=v;p<g;p+=3){const S=p,x=p+1,w=p+2;o=xc(this,r,t,i,l,d,u,S,x,w),o&&(o.faceIndex=Math.floor(p/3),e.push(o))}}}}function O2(n,t,e,i,o,s,r,a){let c;if(t.side===je?c=i.intersectTriangle(r,s,o,!0,a):c=i.intersectTriangle(o,s,r,t.side===It,a),c===null)return null;vc.copy(a),vc.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(vc);return l<e.near||l>e.far?null:{distance:l,point:vc.clone(),object:n}}function xc(n,t,e,i,o,s,r,a,c,l){n.getVertexPosition(a,Fs),n.getVertexPosition(c,zs),n.getVertexPosition(l,Bs);const d=O2(n,t,e,i,Fs,zs,Bs,gc);if(d){o&&(fc.fromBufferAttribute(o,a),pc.fromBufferAttribute(o,c),mc.fromBufferAttribute(o,l),d.uv=hi.getInterpolation(gc,Fs,zs,Bs,fc,pc,mc,new rt)),s&&(fc.fromBufferAttribute(s,a),pc.fromBufferAttribute(s,c),mc.fromBufferAttribute(s,l),d.uv1=hi.getInterpolation(gc,Fs,zs,Bs,fc,pc,mc,new rt)),r&&(Sp.fromBufferAttribute(r,a),_p.fromBufferAttribute(r,c),Mp.fromBufferAttribute(r,l),d.normal=hi.getInterpolation(gc,Fs,zs,Bs,Sp,_p,Mp,new M),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new M,materialIndex:0};hi.getNormal(Fs,zs,Bs,u.normal),d.face=u}return d}class U extends ce{constructor(t=1,e=1,i=1,o=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:o,heightSegments:s,depthSegments:r};const a=this;o=Math.floor(o),s=Math.floor(s),r=Math.floor(r);const c=[],l=[],d=[],u=[];let h=0,f=0;m("z","y","x",-1,-1,i,e,t,r,s,0),m("z","y","x",1,-1,i,e,-t,r,s,1),m("x","z","y",1,1,t,i,e,o,r,2),m("x","z","y",1,-1,t,i,-e,o,r,3),m("x","y","z",1,-1,t,e,i,o,s,4),m("x","y","z",-1,-1,t,e,-i,o,s,5),this.setIndex(c),this.setAttribute("position",new oe(l,3)),this.setAttribute("normal",new oe(d,3)),this.setAttribute("uv",new oe(u,2));function m(v,p,g,S,x,w,E,b,T,C,y){const _=w/T,R=E/C,D=w/2,N=E/2,z=b/2,B=T+1,V=C+1;let j=0,Y=0;const J=new M;for(let k=0;k<V;k++){const $=k*R-N;for(let mt=0;mt<B;mt++){const at=mt*_-D;J[v]=at*S,J[p]=$*x,J[g]=z,l.push(J.x,J.y,J.z),J[v]=0,J[p]=0,J[g]=b>0?1:-1,d.push(J.x,J.y,J.z),u.push(mt/T),u.push(1-k/C),j+=1}}for(let k=0;k<C;k++)for(let $=0;$<T;$++){const mt=h+$+B*k,at=h+$+B*(k+1),X=h+($+1)+B*(k+1),tt=h+($+1)+B*k;c.push(mt,at,tt),c.push(at,X,tt),Y+=6}a.addGroup(f,Y,y),f+=Y,h+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new U(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Cr(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const o=n[e][i];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=o.clone():Array.isArray(o)?t[e][i]=o.slice():t[e][i]=o}}return t}function En(n){const t={};for(let e=0;e<n.length;e++){const i=Cr(n[e]);for(const o in i)t[o]=i[o]}return t}function U2(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function $g(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ve.workingColorSpace}const Wn={clone:Cr,merge:En};var F2=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,z2=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class de extends Ei{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=F2,this.fragmentShader=z2,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Cr(t.uniforms),this.uniformsGroups=U2(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const o in this.uniforms){const r=this.uniforms[o].value;r&&r.isTexture?e.uniforms[o]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[o]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[o]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[o]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[o]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[o]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[o]={type:"m4",value:r.toArray()}:e.uniforms[o]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const o in this.extensions)this.extensions[o]===!0&&(i[o]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class tv extends ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Lt,this.projectionMatrix=new Lt,this.projectionMatrixInverse=new Lt,this.coordinateSystem=ji}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const po=new M,wp=new rt,yp=new rt;class Cn extends tv{constructor(t=50,e=1,i=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=o,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ar*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ga*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ar*2*Math.atan(Math.tan(ga*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){po.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(po.x,po.y).multiplyScalar(-t/po.z),po.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(po.x,po.y).multiplyScalar(-t/po.z)}getViewSize(t,e){return this.getViewBounds(t,wp,yp),e.subVectors(yp,wp)}setViewOffset(t,e,i,o,s,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=o,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ga*.5*this.fov)/this.zoom,i=2*e,o=this.aspect*i,s=-.5*o;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;s+=r.offsetX*o/c,e-=r.offsetY*i/l,o*=r.width/c,i*=r.height/l}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+o,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Hs=-90,ks=1;class B2 extends ye{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new Cn(Hs,ks,t,e);o.layers=this.layers,this.add(o);const s=new Cn(Hs,ks,t,e);s.layers=this.layers,this.add(s);const r=new Cn(Hs,ks,t,e);r.layers=this.layers,this.add(r);const a=new Cn(Hs,ks,t,e);a.layers=this.layers,this.add(a);const c=new Cn(Hs,ks,t,e);c.layers=this.layers,this.add(c);const l=new Cn(Hs,ks,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,o,s,r,a,c]=e;for(const l of e)this.remove(l);if(t===ji)i.up.set(0,1,0),i.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Rl)i.up.set(0,-1,0),i.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:o}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,r,a,c,l,d]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,o),t.render(e,s),t.setRenderTarget(i,1,o),t.render(e,r),t.setRenderTarget(i,2,o),t.render(e,a),t.setRenderTarget(i,3,o),t.render(e,c),t.setRenderTarget(i,4,o),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,o),t.render(e,d),t.setRenderTarget(u,h,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class ev extends un{constructor(t,e,i,o,s,r,a,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:br,super(t,e,i,o,s,r,a,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class H2 extends wn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},o=[i,i,i,i,i,i];this.texture=new ev(o,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:On}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},o=new U(5,5,5),s=new de({name:"CubemapFromEquirect",uniforms:Cr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:je,blending:pn});s.uniforms.tEquirect.value=e;const r=new L(o,s),a=e.minFilter;return e.minFilter===hs&&(e.minFilter=On),new B2(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,i,o){const s=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,i,o);t.setRenderTarget(s)}}const jd=new M,k2=new M,W2=new ee;class bo{constructor(t=new M(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,o){return this.normal.set(t,e,i),this.constant=o,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const o=jd.subVectors(i,e).cross(k2.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(o,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(jd),o=this.normal.dot(i);if(o===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/o;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||W2.getNormalMatrix(t),o=this.coplanarPoint(jd).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-o.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Jo=new bs,Sc=new M;class od{constructor(t=new bo,e=new bo,i=new bo,o=new bo,s=new bo,r=new bo){this.planes=[t,e,i,o,s,r]}set(t,e,i,o,s,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(o),a[4].copy(s),a[5].copy(r),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ji){const i=this.planes,o=t.elements,s=o[0],r=o[1],a=o[2],c=o[3],l=o[4],d=o[5],u=o[6],h=o[7],f=o[8],m=o[9],v=o[10],p=o[11],g=o[12],S=o[13],x=o[14],w=o[15];if(i[0].setComponents(c-s,h-l,p-f,w-g).normalize(),i[1].setComponents(c+s,h+l,p+f,w+g).normalize(),i[2].setComponents(c+r,h+d,p+m,w+S).normalize(),i[3].setComponents(c-r,h-d,p-m,w-S).normalize(),i[4].setComponents(c-a,h-u,p-v,w-x).normalize(),e===ji)i[5].setComponents(c+a,h+u,p+v,w+x).normalize();else if(e===Rl)i[5].setComponents(a,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Jo.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Jo.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Jo)}intersectsSprite(t){return Jo.center.set(0,0,0),Jo.radius=.7071067811865476,Jo.applyMatrix4(t.matrixWorld),this.intersectsSphere(Jo)}intersectsSphere(t){const e=this.planes,i=t.center,o=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<o)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const o=e[i];if(Sc.x=o.normal.x>0?t.max.x:t.min.x,Sc.y=o.normal.y>0?t.max.y:t.min.y,Sc.z=o.normal.z>0?t.max.z:t.min.z,o.distanceToPoint(Sc)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function nv(){let n=null,t=!1,e=null,i=null;function o(s,r){e(s,r),i=n.requestAnimationFrame(o)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(o),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function G2(n){const t=new WeakMap;function e(a,c){const l=a.array,d=a.usage,u=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),a.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,c,l){const d=c.array,u=c._updateRange,h=c.updateRanges;if(n.bindBuffer(l,a),u.count===-1&&h.length===0&&n.bufferSubData(l,0,d),h.length!==0){for(let f=0,m=h.length;f<m;f++){const v=h[f];n.bufferSubData(l,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}c.clearUpdateRanges()}u.count!==-1&&(n.bufferSubData(l,u.offset*d.BYTES_PER_ELEMENT,d,u.offset,u.count),u.count=-1),c.onUploadCallback()}function o(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(n.deleteBuffer(c.buffer),t.delete(a))}function r(a,c){if(a.isGLBufferAttribute){const d=t.get(a);(!d||d.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:o,remove:s,update:r}}class qt extends ce{constructor(t=1,e=1,i=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:o};const s=t/2,r=e/2,a=Math.floor(i),c=Math.floor(o),l=a+1,d=c+1,u=t/a,h=e/c,f=[],m=[],v=[],p=[];for(let g=0;g<d;g++){const S=g*h-r;for(let x=0;x<l;x++){const w=x*u-s;m.push(w,-S,0),v.push(0,0,1),p.push(x/a),p.push(1-g/c)}}for(let g=0;g<c;g++)for(let S=0;S<a;S++){const x=S+l*g,w=S+l*(g+1),E=S+1+l*(g+1),b=S+1+l*g;f.push(x,w,b),f.push(w,E,b)}this.setIndex(f),this.setAttribute("position",new oe(m,3)),this.setAttribute("normal",new oe(v,3)),this.setAttribute("uv",new oe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qt(t.width,t.height,t.widthSegments,t.heightSegments)}}var V2=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,X2=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Y2=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,q2=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Z2=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,K2=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,j2=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,J2=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Q2=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,$2=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,tS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,eS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iS=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,oS=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,sS=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,rS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,aS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,lS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,dS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,uS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( batchId );
	vColor.xyz *= batchingColor.xyz;
#endif`,fS=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,pS=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,mS=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,gS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,SS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_S="gl_FragColor = linearToOutputTexel( gl_FragColor );",MS=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,wS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,yS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,bS=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,TS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ES=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,AS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,CS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,RS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,PS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,LS=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,DS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,IS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,NS=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,OS=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,US=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,FS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zS=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,BS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,HS=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,kS=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,WS=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,GS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,VS=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,XS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,YS=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qS=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ZS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,KS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,JS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,QS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,$S=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,t_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,e_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,n_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,i_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,o_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,s_=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,r_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,a_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,c_=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,l_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,d_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,u_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,h_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,f_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,p_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,m_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,g_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,v_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,x_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,S_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,__=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,M_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,w_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,y_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,b_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,T_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,E_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,A_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,C_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,R_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,P_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,L_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,D_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,I_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,N_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,O_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,U_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,F_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,z_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,B_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,H_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,k_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,W_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const G_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,V_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Y_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,q_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Z_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,j_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,J_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Q_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,$_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,iM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,oM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,aM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,cM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,dM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,uM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,pM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,SM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_M=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,MM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,wM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,te={alphahash_fragment:V2,alphahash_pars_fragment:X2,alphamap_fragment:Y2,alphamap_pars_fragment:q2,alphatest_fragment:Z2,alphatest_pars_fragment:K2,aomap_fragment:j2,aomap_pars_fragment:J2,batching_pars_vertex:Q2,batching_vertex:$2,begin_vertex:tS,beginnormal_vertex:eS,bsdfs:nS,iridescence_fragment:iS,bumpmap_pars_fragment:oS,clipping_planes_fragment:sS,clipping_planes_pars_fragment:rS,clipping_planes_pars_vertex:aS,clipping_planes_vertex:cS,color_fragment:lS,color_pars_fragment:dS,color_pars_vertex:uS,color_vertex:hS,common:fS,cube_uv_reflection_fragment:pS,defaultnormal_vertex:mS,displacementmap_pars_vertex:gS,displacementmap_vertex:vS,emissivemap_fragment:xS,emissivemap_pars_fragment:SS,colorspace_fragment:_S,colorspace_pars_fragment:MS,envmap_fragment:wS,envmap_common_pars_fragment:yS,envmap_pars_fragment:bS,envmap_pars_vertex:TS,envmap_physical_pars_fragment:US,envmap_vertex:ES,fog_vertex:AS,fog_pars_vertex:CS,fog_fragment:RS,fog_pars_fragment:PS,gradientmap_pars_fragment:LS,lightmap_pars_fragment:DS,lights_lambert_fragment:IS,lights_lambert_pars_fragment:NS,lights_pars_begin:OS,lights_toon_fragment:FS,lights_toon_pars_fragment:zS,lights_phong_fragment:BS,lights_phong_pars_fragment:HS,lights_physical_fragment:kS,lights_physical_pars_fragment:WS,lights_fragment_begin:GS,lights_fragment_maps:VS,lights_fragment_end:XS,logdepthbuf_fragment:YS,logdepthbuf_pars_fragment:qS,logdepthbuf_pars_vertex:ZS,logdepthbuf_vertex:KS,map_fragment:jS,map_pars_fragment:JS,map_particle_fragment:QS,map_particle_pars_fragment:$S,metalnessmap_fragment:t_,metalnessmap_pars_fragment:e_,morphinstance_vertex:n_,morphcolor_vertex:i_,morphnormal_vertex:o_,morphtarget_pars_vertex:s_,morphtarget_vertex:r_,normal_fragment_begin:a_,normal_fragment_maps:c_,normal_pars_fragment:l_,normal_pars_vertex:d_,normal_vertex:u_,normalmap_pars_fragment:h_,clearcoat_normal_fragment_begin:f_,clearcoat_normal_fragment_maps:p_,clearcoat_pars_fragment:m_,iridescence_pars_fragment:g_,opaque_fragment:v_,packing:x_,premultiplied_alpha_fragment:S_,project_vertex:__,dithering_fragment:M_,dithering_pars_fragment:w_,roughnessmap_fragment:y_,roughnessmap_pars_fragment:b_,shadowmap_pars_fragment:T_,shadowmap_pars_vertex:E_,shadowmap_vertex:A_,shadowmask_pars_fragment:C_,skinbase_vertex:R_,skinning_pars_vertex:P_,skinning_vertex:L_,skinnormal_vertex:D_,specularmap_fragment:I_,specularmap_pars_fragment:N_,tonemapping_fragment:O_,tonemapping_pars_fragment:U_,transmission_fragment:F_,transmission_pars_fragment:z_,uv_pars_fragment:B_,uv_pars_vertex:H_,uv_vertex:k_,worldpos_vertex:W_,background_vert:G_,background_frag:V_,backgroundCube_vert:X_,backgroundCube_frag:Y_,cube_vert:q_,cube_frag:Z_,depth_vert:K_,depth_frag:j_,distanceRGBA_vert:J_,distanceRGBA_frag:Q_,equirect_vert:$_,equirect_frag:tM,linedashed_vert:eM,linedashed_frag:nM,meshbasic_vert:iM,meshbasic_frag:oM,meshlambert_vert:sM,meshlambert_frag:rM,meshmatcap_vert:aM,meshmatcap_frag:cM,meshnormal_vert:lM,meshnormal_frag:dM,meshphong_vert:uM,meshphong_frag:hM,meshphysical_vert:fM,meshphysical_frag:pM,meshtoon_vert:mM,meshtoon_frag:gM,points_vert:vM,points_frag:xM,shadow_vert:SM,shadow_frag:_M,sprite_vert:MM,sprite_frag:wM},xt={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ee}},envmap:{envMap:{value:null},envMapRotation:{value:new ee},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ee}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ee}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ee},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ee},normalScale:{value:new rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ee},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ee}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ee}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ee}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0},uvTransform:{value:new ee}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}}},wi={basic:{uniforms:En([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.fog]),vertexShader:te.meshbasic_vert,fragmentShader:te.meshbasic_frag},lambert:{uniforms:En([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new St(0)}}]),vertexShader:te.meshlambert_vert,fragmentShader:te.meshlambert_frag},phong:{uniforms:En([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30}}]),vertexShader:te.meshphong_vert,fragmentShader:te.meshphong_frag},standard:{uniforms:En([xt.common,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.roughnessmap,xt.metalnessmap,xt.fog,xt.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:te.meshphysical_vert,fragmentShader:te.meshphysical_frag},toon:{uniforms:En([xt.common,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.gradientmap,xt.fog,xt.lights,{emissive:{value:new St(0)}}]),vertexShader:te.meshtoon_vert,fragmentShader:te.meshtoon_frag},matcap:{uniforms:En([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,{matcap:{value:null}}]),vertexShader:te.meshmatcap_vert,fragmentShader:te.meshmatcap_frag},points:{uniforms:En([xt.points,xt.fog]),vertexShader:te.points_vert,fragmentShader:te.points_frag},dashed:{uniforms:En([xt.common,xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:te.linedashed_vert,fragmentShader:te.linedashed_frag},depth:{uniforms:En([xt.common,xt.displacementmap]),vertexShader:te.depth_vert,fragmentShader:te.depth_frag},normal:{uniforms:En([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,{opacity:{value:1}}]),vertexShader:te.meshnormal_vert,fragmentShader:te.meshnormal_frag},sprite:{uniforms:En([xt.sprite,xt.fog]),vertexShader:te.sprite_vert,fragmentShader:te.sprite_frag},background:{uniforms:{uvTransform:{value:new ee},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:te.background_vert,fragmentShader:te.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ee}},vertexShader:te.backgroundCube_vert,fragmentShader:te.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:te.cube_vert,fragmentShader:te.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:te.equirect_vert,fragmentShader:te.equirect_frag},distanceRGBA:{uniforms:En([xt.common,xt.displacementmap,{referencePosition:{value:new M},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:te.distanceRGBA_vert,fragmentShader:te.distanceRGBA_frag},shadow:{uniforms:En([xt.lights,xt.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:te.shadow_vert,fragmentShader:te.shadow_frag}};wi.physical={uniforms:En([wi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ee},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ee},clearcoatNormalScale:{value:new rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ee},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ee},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ee},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ee},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ee},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ee},transmissionSamplerSize:{value:new rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ee},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ee},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ee},anisotropyVector:{value:new rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ee}}]),vertexShader:te.meshphysical_vert,fragmentShader:te.meshphysical_frag};const _c={r:0,b:0,g:0},Qo=new Je,yM=new Lt;function bM(n,t,e,i,o,s,r){const a=new St(0);let c=s===!0?0:1,l,d,u=null,h=0,f=null;function m(S){let x=S.isScene===!0?S.background:null;return x&&x.isTexture&&(x=(S.backgroundBlurriness>0?e:t).get(x)),x}function v(S){let x=!1;const w=m(S);w===null?g(a,c):w&&w.isColor&&(g(w,1),x=!0);const E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(S,x){const w=m(x);w&&(w.isCubeTexture||w.mapping===ed)?(d===void 0&&(d=new L(new U(1,1,1),new de({name:"BackgroundCubeMaterial",uniforms:Cr(wi.backgroundCube.uniforms),vertexShader:wi.backgroundCube.vertexShader,fragmentShader:wi.backgroundCube.fragmentShader,side:je,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(E,b,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(d)),Qo.copy(x.backgroundRotation),Qo.x*=-1,Qo.y*=-1,Qo.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Qo.y*=-1,Qo.z*=-1),d.material.uniforms.envMap.value=w,d.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(yM.makeRotationFromEuler(Qo)),d.material.toneMapped=ve.getTransfer(w.colorSpace)!==Ce,(u!==w||h!==w.version||f!==n.toneMapping)&&(d.material.needsUpdate=!0,u=w,h=w.version,f=n.toneMapping),d.layers.enableAll(),S.unshift(d,d.geometry,d.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new L(new qt(2,2),new de({name:"BackgroundMaterial",uniforms:Cr(wi.background.uniforms),vertexShader:wi.background.vertexShader,fragmentShader:wi.background.fragmentShader,side:It,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=ve.getTransfer(w.colorSpace)!==Ce,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||h!==w.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=w,h=w.version,f=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,x){S.getRGB(_c,$g(n)),i.buffers.color.setClear(_c.r,_c.g,_c.b,x,r)}return{getClearColor:function(){return a},setClearColor:function(S,x=1){a.set(S),c=x,g(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,g(a,c)},render:v,addToRenderList:p}}function TM(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},o=h(null);let s=o,r=!1;function a(_,R,D,N,z){let B=!1;const V=u(N,D,R);s!==V&&(s=V,l(s.object)),B=f(_,N,D,z),B&&m(_,N,D,z),z!==null&&t.update(z,n.ELEMENT_ARRAY_BUFFER),(B||r)&&(r=!1,w(_,R,D,N),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function c(){return n.createVertexArray()}function l(_){return n.bindVertexArray(_)}function d(_){return n.deleteVertexArray(_)}function u(_,R,D){const N=D.wireframe===!0;let z=i[_.id];z===void 0&&(z={},i[_.id]=z);let B=z[R.id];B===void 0&&(B={},z[R.id]=B);let V=B[N];return V===void 0&&(V=h(c()),B[N]=V),V}function h(_){const R=[],D=[],N=[];for(let z=0;z<e;z++)R[z]=0,D[z]=0,N[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:D,attributeDivisors:N,object:_,attributes:{},index:null}}function f(_,R,D,N){const z=s.attributes,B=R.attributes;let V=0;const j=D.getAttributes();for(const Y in j)if(j[Y].location>=0){const k=z[Y];let $=B[Y];if($===void 0&&(Y==="instanceMatrix"&&_.instanceMatrix&&($=_.instanceMatrix),Y==="instanceColor"&&_.instanceColor&&($=_.instanceColor)),k===void 0||k.attribute!==$||$&&k.data!==$.data)return!0;V++}return s.attributesNum!==V||s.index!==N}function m(_,R,D,N){const z={},B=R.attributes;let V=0;const j=D.getAttributes();for(const Y in j)if(j[Y].location>=0){let k=B[Y];k===void 0&&(Y==="instanceMatrix"&&_.instanceMatrix&&(k=_.instanceMatrix),Y==="instanceColor"&&_.instanceColor&&(k=_.instanceColor));const $={};$.attribute=k,k&&k.data&&($.data=k.data),z[Y]=$,V++}s.attributes=z,s.attributesNum=V,s.index=N}function v(){const _=s.newAttributes;for(let R=0,D=_.length;R<D;R++)_[R]=0}function p(_){g(_,0)}function g(_,R){const D=s.newAttributes,N=s.enabledAttributes,z=s.attributeDivisors;D[_]=1,N[_]===0&&(n.enableVertexAttribArray(_),N[_]=1),z[_]!==R&&(n.vertexAttribDivisor(_,R),z[_]=R)}function S(){const _=s.newAttributes,R=s.enabledAttributes;for(let D=0,N=R.length;D<N;D++)R[D]!==_[D]&&(n.disableVertexAttribArray(D),R[D]=0)}function x(_,R,D,N,z,B,V){V===!0?n.vertexAttribIPointer(_,R,D,z,B):n.vertexAttribPointer(_,R,D,N,z,B)}function w(_,R,D,N){v();const z=N.attributes,B=D.getAttributes(),V=R.defaultAttributeValues;for(const j in B){const Y=B[j];if(Y.location>=0){let J=z[j];if(J===void 0&&(j==="instanceMatrix"&&_.instanceMatrix&&(J=_.instanceMatrix),j==="instanceColor"&&_.instanceColor&&(J=_.instanceColor)),J!==void 0){const k=J.normalized,$=J.itemSize,mt=t.get(J);if(mt===void 0)continue;const at=mt.buffer,X=mt.type,tt=mt.bytesPerElement,ft=X===n.INT||X===n.UNSIGNED_INT||J.gpuType===Bg;if(J.isInterleavedBufferAttribute){const ot=J.data,Nt=ot.stride,Et=J.offset;if(ot.isInstancedInterleavedBuffer){for(let Vt=0;Vt<Y.locationSize;Vt++)g(Y.location+Vt,ot.meshPerAttribute);_.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Vt=0;Vt<Y.locationSize;Vt++)p(Y.location+Vt);n.bindBuffer(n.ARRAY_BUFFER,at);for(let Vt=0;Vt<Y.locationSize;Vt++)x(Y.location+Vt,$/Y.locationSize,X,k,Nt*tt,(Et+$/Y.locationSize*Vt)*tt,ft)}else{if(J.isInstancedBufferAttribute){for(let ot=0;ot<Y.locationSize;ot++)g(Y.location+ot,J.meshPerAttribute);_.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let ot=0;ot<Y.locationSize;ot++)p(Y.location+ot);n.bindBuffer(n.ARRAY_BUFFER,at);for(let ot=0;ot<Y.locationSize;ot++)x(Y.location+ot,$/Y.locationSize,X,k,$*tt,$/Y.locationSize*ot*tt,ft)}}else if(V!==void 0){const k=V[j];if(k!==void 0)switch(k.length){case 2:n.vertexAttrib2fv(Y.location,k);break;case 3:n.vertexAttrib3fv(Y.location,k);break;case 4:n.vertexAttrib4fv(Y.location,k);break;default:n.vertexAttrib1fv(Y.location,k)}}}}S()}function E(){C();for(const _ in i){const R=i[_];for(const D in R){const N=R[D];for(const z in N)d(N[z].object),delete N[z];delete R[D]}delete i[_]}}function b(_){if(i[_.id]===void 0)return;const R=i[_.id];for(const D in R){const N=R[D];for(const z in N)d(N[z].object),delete N[z];delete R[D]}delete i[_.id]}function T(_){for(const R in i){const D=i[R];if(D[_.id]===void 0)continue;const N=D[_.id];for(const z in N)d(N[z].object),delete N[z];delete D[_.id]}}function C(){y(),r=!0,s!==o&&(s=o,l(s.object))}function y(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:a,reset:C,resetDefaultState:y,dispose:E,releaseStatesOfGeometry:b,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:p,disableUnusedAttributes:S}}function EM(n,t,e){let i;function o(l){i=l}function s(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function r(l,d,u){u!==0&&(n.drawArraysInstanced(i,l,d,u),e.update(d,i,u))}function a(l,d,u){if(u===0)return;const h=t.get("WEBGL_multi_draw");if(h===null)for(let f=0;f<u;f++)this.render(l[f],d[f]);else{h.multiDrawArraysWEBGL(i,l,0,d,0,u);let f=0;for(let m=0;m<u;m++)f+=d[m];e.update(f,i,1)}}function c(l,d,u,h){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)r(l[m],d[m],h[m]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,u);let m=0;for(let v=0;v<u;v++)m+=d[v];for(let v=0;v<h.length;v++)e.update(m,i,h[v])}}this.setMode=o,this.render=s,this.renderInstances=r,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function AM(n,t,e,i){let o;function s(){if(o!==void 0)return o;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");o=n.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function r(b){return!(b!==fi&&i.convert(b)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(b){const T=b===Gn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(b!==to&&i.convert(b)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&b!==Ki&&!T)}function c(b){if(b==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,h=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),f=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_TEXTURE_SIZE),v=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),g=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=f>0,E=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:v,maxAttributes:p,maxVertexUniforms:g,maxVaryings:S,maxFragmentUniforms:x,vertexTextures:w,maxSamples:E}}function CM(n){const t=this;let e=null,i=0,o=!1,s=!1;const r=new bo,a=new ee,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||i!==0||o;return o=h,i=u.length,f},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){e=d(u,h,0)},this.setState=function(u,h,f){const m=u.clippingPlanes,v=u.clipIntersection,p=u.clipShadows,g=n.get(u);if(!o||m===null||m.length===0||s&&!p)s?d(null):l();else{const S=s?0:i,x=S*4;let w=g.clippingState||null;c.value=w,w=d(m,h,x,f);for(let E=0;E!==x;++E)w[E]=e[E];g.clippingState=w,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(u,h,f,m){const v=u!==null?u.length:0;let p=null;if(v!==0){if(p=c.value,m!==!0||p===null){const g=f+v*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(p===null||p.length<g)&&(p=new Float32Array(g));for(let x=0,w=f;x!==v;++x,w+=4)r.copy(u[x]).applyMatrix4(S,a),r.normal.toArray(p,w),p[w+3]=r.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}function RM(n){let t=new WeakMap;function e(r,a){return a===eh?r.mapping=br:a===nh&&(r.mapping=Tr),r}function i(r){if(r&&r.isTexture){const a=r.mapping;if(a===eh||a===nh)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new H2(c.height);return l.fromEquirectangularTexture(n,r),t.set(r,l),r.addEventListener("dispose",o),e(l.texture,r.mapping)}else return null}}return r}function o(r){const a=r.target;a.removeEventListener("dispose",o);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class iv extends tv{constructor(t=-1,e=1,i=1,o=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=o,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,o,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=o,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let s=i-t,r=i+t,a=o+e,c=o-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,r=s+l*this.view.width,a-=d*this.view.offsetY,c=a-d*this.view.height}this.projectionMatrix.makeOrthographic(s,r,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const lr=4,bp=[.125,.215,.35,.446,.526,.582],ds=20,Jd=new iv,Tp=new St;let Qd=null,$d=0,tu=0,eu=!1;const ss=(1+Math.sqrt(5))/2,Ws=1/ss,Ep=[new M(-ss,Ws,0),new M(ss,Ws,0),new M(-Ws,0,ss),new M(Ws,0,ss),new M(0,ss,-Ws),new M(0,ss,Ws),new M(-1,1,-1),new M(1,1,-1),new M(-1,1,1),new M(1,1,1)];class sh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,o=100){Qd=this._renderer.getRenderTarget(),$d=this._renderer.getActiveCubeFace(),tu=this._renderer.getActiveMipmapLevel(),eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,o,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Rp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Qd,$d,tu),this._renderer.xr.enabled=eu,t.scissorTest=!1,Mc(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===br||t.mapping===Tr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Qd=this._renderer.getRenderTarget(),$d=this._renderer.getActiveCubeFace(),tu=this._renderer.getActiveMipmapLevel(),eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:On,minFilter:On,generateMipmaps:!1,type:Gn,format:fi,colorSpace:Fo,depthBuffer:!1},o=Ap(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ap(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=PM(s)),this._blurMaterial=LM(s,t,e)}return o}_compileMaterial(t){const e=new L(this._lodPlanes[0],t);this._renderer.compile(e,Jd)}_sceneToCubeUV(t,e,i,o){const a=new Cn(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(Tp),d.toneMapping=Do,d.autoClear=!1;const f=new lt({name:"PMREM.Background",side:je,depthWrite:!1,depthTest:!1}),m=new L(new U,f);let v=!1;const p=t.background;p?p.isColor&&(f.color.copy(p),t.background=null,v=!0):(f.color.copy(Tp),v=!0);for(let g=0;g<6;g++){const S=g%3;S===0?(a.up.set(0,c[g],0),a.lookAt(l[g],0,0)):S===1?(a.up.set(0,0,c[g]),a.lookAt(0,l[g],0)):(a.up.set(0,c[g],0),a.lookAt(0,0,l[g]));const x=this._cubeSize;Mc(o,S*x,g>2?x:0,x,x),d.setRenderTarget(o),v&&d.render(m,a),d.render(t,a)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=h,d.autoClear=u,t.background=p}_textureToCubeUV(t,e){const i=this._renderer,o=t.mapping===br||t.mapping===Tr;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=Rp()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cp());const s=o?this._cubemapMaterial:this._equirectMaterial,r=new L(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const c=this._cubeSize;Mc(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(r,Jd)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const o=this._lodPlanes.length;for(let s=1;s<o;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Ep[(o-s-1)%Ep.length];this._blur(t,s-1,s,r,a)}e.autoClear=i}_blur(t,e,i,o,s){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,i,o,"latitudinal",s),this._halfBlur(r,t,i,i,o,"longitudinal",s)}_halfBlur(t,e,i,o,s,r,a){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new L(this._lodPlanes[o],l),h=l.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*ds-1),v=s/m,p=isFinite(s)?1+Math.floor(d*v):ds;p>ds&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ds}`);const g=[];let S=0;for(let T=0;T<ds;++T){const C=T/v,y=Math.exp(-C*C/2);g.push(y),T===0?S+=y:T<p&&(S+=2*y)}for(let T=0;T<g.length;T++)g[T]=g[T]/S;h.envMap.value=t.texture,h.samples.value=p,h.weights.value=g,h.latitudinal.value=r==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:x}=this;h.dTheta.value=m,h.mipInt.value=x-i;const w=this._sizeLods[o],E=3*w*(o>x-lr?o-x+lr:0),b=4*(this._cubeSize-w);Mc(e,E,b,3*w,2*w),c.setRenderTarget(e),c.render(u,Jd)}}function PM(n){const t=[],e=[],i=[];let o=n;const s=n-lr+1+bp.length;for(let r=0;r<s;r++){const a=Math.pow(2,o);e.push(a);let c=1/a;r>n-lr?c=bp[r-n+lr-1]:r===0&&(c=0),i.push(c);const l=1/(a-2),d=-l,u=1+l,h=[d,d,u,d,u,u,d,d,u,u,d,u],f=6,m=6,v=3,p=2,g=1,S=new Float32Array(v*m*f),x=new Float32Array(p*m*f),w=new Float32Array(g*m*f);for(let b=0;b<f;b++){const T=b%3*2/3-1,C=b>2?0:-1,y=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];S.set(y,v*m*b),x.set(h,p*m*b);const _=[b,b,b,b,b,b];w.set(_,g*m*b)}const E=new ce;E.setAttribute("position",new re(S,v)),E.setAttribute("uv",new re(x,p)),E.setAttribute("faceIndex",new re(w,g)),t.push(E),o>lr&&o--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Ap(n,t,e){const i=new wn(n,t,e);return i.texture.mapping=ed,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Mc(n,t,e,i,o){n.viewport.set(t,e,i,o),n.scissor.set(t,e,i,o)}function LM(n,t,e){const i=new Float32Array(ds),o=new M(0,1,0);return new de({name:"SphericalGaussianBlur",defines:{n:ds,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Zh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function Cp(){return new de({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Zh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function Rp(){return new de({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Zh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function Zh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function DM(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){const c=a.mapping,l=c===eh||c===nh,d=c===br||c===Tr;if(l||d){let u=t.get(a);const h=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return e===null&&(e=new sh(n)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return l&&f&&f.height>0||d&&f&&o(f)?(e===null&&(e=new sh(n)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",s),u.texture):null}}}return a}function o(a){let c=0;const l=6;for(let d=0;d<l;d++)a[d]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:r}}function IM(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let o;switch(i){case"WEBGL_depth_texture":o=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=n.getExtension(i)}return t[i]=o,o}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const o=e(i);return o===null&&Xh("THREE.WebGLRenderer: "+i+" extension not supported."),o}}}function NM(n,t,e,i){const o={},s=new WeakMap;function r(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const m in h.attributes)t.remove(h.attributes[m]);for(const m in h.morphAttributes){const v=h.morphAttributes[m];for(let p=0,g=v.length;p<g;p++)t.remove(v[p])}h.removeEventListener("dispose",r),delete o[h.id];const f=s.get(h);f&&(t.remove(f),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function a(u,h){return o[h.id]===!0||(h.addEventListener("dispose",r),o[h.id]=!0,e.memory.geometries++),h}function c(u){const h=u.attributes;for(const m in h)t.update(h[m],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const m in f){const v=f[m];for(let p=0,g=v.length;p<g;p++)t.update(v[p],n.ARRAY_BUFFER)}}function l(u){const h=[],f=u.index,m=u.attributes.position;let v=0;if(f!==null){const S=f.array;v=f.version;for(let x=0,w=S.length;x<w;x+=3){const E=S[x+0],b=S[x+1],T=S[x+2];h.push(E,b,b,T,T,E)}}else if(m!==void 0){const S=m.array;v=m.version;for(let x=0,w=S.length/3-1;x<w;x+=3){const E=x+0,b=x+1,T=x+2;h.push(E,b,b,T,T,E)}}else return;const p=new(qg(h)?Qg:Jg)(h,1);p.version=v;const g=s.get(u);g&&t.remove(g),s.set(u,p)}function d(u){const h=s.get(u);if(h){const f=u.index;f!==null&&h.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:a,update:c,getWireframeAttribute:d}}function OM(n,t,e){let i;function o(h){i=h}let s,r;function a(h){s=h.type,r=h.bytesPerElement}function c(h,f){n.drawElements(i,f,s,h*r),e.update(f,i,1)}function l(h,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,h*r,m),e.update(f,i,m))}function d(h,f,m){if(m===0)return;const v=t.get("WEBGL_multi_draw");if(v===null)for(let p=0;p<m;p++)this.render(h[p]/r,f[p]);else{v.multiDrawElementsWEBGL(i,f,0,s,h,0,m);let p=0;for(let g=0;g<m;g++)p+=f[g];e.update(p,i,1)}}function u(h,f,m,v){if(m===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<h.length;g++)l(h[g]/r,f[g],v[g]);else{p.multiDrawElementsInstancedWEBGL(i,f,0,s,h,0,v,0,m);let g=0;for(let S=0;S<m;S++)g+=f[S];for(let S=0;S<v.length;S++)e.update(g,i,v[S])}}this.setMode=o,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function UM(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,r,a){switch(e.calls++,r){case n.TRIANGLES:e.triangles+=a*(s/3);break;case n.LINES:e.lines+=a*(s/2);break;case n.LINE_STRIP:e.lines+=a*(s-1);break;case n.LINE_LOOP:e.lines+=a*s;break;case n.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function o(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:o,update:i}}function FM(n,t,e){const i=new WeakMap,o=new Ne;function s(r,a,c){const l=r.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(a);if(h===void 0||h.count!==u){let _=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",_)};var f=_;h!==void 0&&h.texture.dispose();const m=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],S=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let w=0;m===!0&&(w=1),v===!0&&(w=2),p===!0&&(w=3);let E=a.attributes.position.count*w,b=1;E>t.maxTextureSize&&(b=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);const T=new Float32Array(E*b*4*u),C=new Kg(T,E,b,u);C.type=Ki,C.needsUpdate=!0;const y=w*4;for(let R=0;R<u;R++){const D=g[R],N=S[R],z=x[R],B=E*b*4*R;for(let V=0;V<D.count;V++){const j=V*y;m===!0&&(o.fromBufferAttribute(D,V),T[B+j+0]=o.x,T[B+j+1]=o.y,T[B+j+2]=o.z,T[B+j+3]=0),v===!0&&(o.fromBufferAttribute(N,V),T[B+j+4]=o.x,T[B+j+5]=o.y,T[B+j+6]=o.z,T[B+j+7]=0),p===!0&&(o.fromBufferAttribute(z,V),T[B+j+8]=o.x,T[B+j+9]=o.y,T[B+j+10]=o.z,T[B+j+11]=z.itemSize===4?o.w:1)}}h={count:u,texture:C,size:new rt(E,b)},i.set(a,h),a.addEventListener("dispose",_)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,e);else{let m=0;for(let p=0;p<l.length;p++)m+=l[p];const v=a.morphTargetsRelative?1:1-m;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function zM(n,t,e,i){let o=new WeakMap;function s(c){const l=i.render.frame,d=c.geometry,u=t.get(c,d);if(o.get(u)!==l&&(t.update(u),o.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),o.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),o.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;o.get(h)!==l&&(h.update(),o.set(h,l))}return u}function r(){o=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:r}}class Kh extends un{constructor(t,e,i,o,s,r,a,c,l,d=xr){if(d!==xr&&d!==Ss)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===xr&&(i=Er),i===void 0&&d===Ss&&(i=xs),super(null,o,s,r,a,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:dn,this.minFilter=c!==void 0?c:dn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ov=new un,sv=new Kh(1,1);sv.compareFunction=Yg;const rv=new Kg,av=new T2,cv=new ev,Pp=[],Lp=[],Dp=new Float32Array(16),Ip=new Float32Array(9),Np=new Float32Array(4);function Or(n,t,e){const i=n[0];if(i<=0||i>0)return n;const o=t*e;let s=Pp[o];if(s===void 0&&(s=new Float32Array(o),Pp[o]=s),t!==0){i.toArray(s,0);for(let r=1,a=0;r!==t;++r)a+=e,n[r].toArray(s,a)}return s}function nn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function on(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function sd(n,t){let e=Lp[t];e===void 0&&(e=new Int32Array(t),Lp[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function BM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function HM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(nn(e,t))return;n.uniform2fv(this.addr,t),on(e,t)}}function kM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(nn(e,t))return;n.uniform3fv(this.addr,t),on(e,t)}}function WM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(nn(e,t))return;n.uniform4fv(this.addr,t),on(e,t)}}function GM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(nn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),on(e,t)}else{if(nn(e,i))return;Np.set(i),n.uniformMatrix2fv(this.addr,!1,Np),on(e,i)}}function VM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(nn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),on(e,t)}else{if(nn(e,i))return;Ip.set(i),n.uniformMatrix3fv(this.addr,!1,Ip),on(e,i)}}function XM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(nn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),on(e,t)}else{if(nn(e,i))return;Dp.set(i),n.uniformMatrix4fv(this.addr,!1,Dp),on(e,i)}}function YM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function qM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(nn(e,t))return;n.uniform2iv(this.addr,t),on(e,t)}}function ZM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(nn(e,t))return;n.uniform3iv(this.addr,t),on(e,t)}}function KM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(nn(e,t))return;n.uniform4iv(this.addr,t),on(e,t)}}function jM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function JM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(nn(e,t))return;n.uniform2uiv(this.addr,t),on(e,t)}}function QM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(nn(e,t))return;n.uniform3uiv(this.addr,t),on(e,t)}}function $M(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(nn(e,t))return;n.uniform4uiv(this.addr,t),on(e,t)}}function tw(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o);const s=this.type===n.SAMPLER_2D_SHADOW?sv:ov;e.setTexture2D(t||s,o)}function ew(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),e.setTexture3D(t||av,o)}function nw(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),e.setTextureCube(t||cv,o)}function iw(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),e.setTexture2DArray(t||rv,o)}function ow(n){switch(n){case 5126:return BM;case 35664:return HM;case 35665:return kM;case 35666:return WM;case 35674:return GM;case 35675:return VM;case 35676:return XM;case 5124:case 35670:return YM;case 35667:case 35671:return qM;case 35668:case 35672:return ZM;case 35669:case 35673:return KM;case 5125:return jM;case 36294:return JM;case 36295:return QM;case 36296:return $M;case 35678:case 36198:case 36298:case 36306:case 35682:return tw;case 35679:case 36299:case 36307:return ew;case 35680:case 36300:case 36308:case 36293:return nw;case 36289:case 36303:case 36311:case 36292:return iw}}function sw(n,t){n.uniform1fv(this.addr,t)}function rw(n,t){const e=Or(t,this.size,2);n.uniform2fv(this.addr,e)}function aw(n,t){const e=Or(t,this.size,3);n.uniform3fv(this.addr,e)}function cw(n,t){const e=Or(t,this.size,4);n.uniform4fv(this.addr,e)}function lw(n,t){const e=Or(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function dw(n,t){const e=Or(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function uw(n,t){const e=Or(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function hw(n,t){n.uniform1iv(this.addr,t)}function fw(n,t){n.uniform2iv(this.addr,t)}function pw(n,t){n.uniform3iv(this.addr,t)}function mw(n,t){n.uniform4iv(this.addr,t)}function gw(n,t){n.uniform1uiv(this.addr,t)}function vw(n,t){n.uniform2uiv(this.addr,t)}function xw(n,t){n.uniform3uiv(this.addr,t)}function Sw(n,t){n.uniform4uiv(this.addr,t)}function _w(n,t,e){const i=this.cache,o=t.length,s=sd(e,o);nn(i,s)||(n.uniform1iv(this.addr,s),on(i,s));for(let r=0;r!==o;++r)e.setTexture2D(t[r]||ov,s[r])}function Mw(n,t,e){const i=this.cache,o=t.length,s=sd(e,o);nn(i,s)||(n.uniform1iv(this.addr,s),on(i,s));for(let r=0;r!==o;++r)e.setTexture3D(t[r]||av,s[r])}function ww(n,t,e){const i=this.cache,o=t.length,s=sd(e,o);nn(i,s)||(n.uniform1iv(this.addr,s),on(i,s));for(let r=0;r!==o;++r)e.setTextureCube(t[r]||cv,s[r])}function yw(n,t,e){const i=this.cache,o=t.length,s=sd(e,o);nn(i,s)||(n.uniform1iv(this.addr,s),on(i,s));for(let r=0;r!==o;++r)e.setTexture2DArray(t[r]||rv,s[r])}function bw(n){switch(n){case 5126:return sw;case 35664:return rw;case 35665:return aw;case 35666:return cw;case 35674:return lw;case 35675:return dw;case 35676:return uw;case 5124:case 35670:return hw;case 35667:case 35671:return fw;case 35668:case 35672:return pw;case 35669:case 35673:return mw;case 5125:return gw;case 36294:return vw;case 36295:return xw;case 36296:return Sw;case 35678:case 36198:case 36298:case 36306:case 35682:return _w;case 35679:case 36299:case 36307:return Mw;case 35680:case 36300:case 36308:case 36293:return ww;case 36289:case 36303:case 36311:case 36292:return yw}}class Tw{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=ow(e.type)}}class Ew{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=bw(e.type)}}class Aw{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const o=this.seq;for(let s=0,r=o.length;s!==r;++s){const a=o[s];a.setValue(t,e[a.id],i)}}}const nu=/(\w+)(\])?(\[|\.)?/g;function Op(n,t){n.seq.push(t),n.map[t.id]=t}function Cw(n,t,e){const i=n.name,o=i.length;for(nu.lastIndex=0;;){const s=nu.exec(i),r=nu.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&r+2===o){Op(e,l===void 0?new Tw(a,n,t):new Ew(a,n,t));break}else{let u=e.map[a];u===void 0&&(u=new Aw(a),Op(e,u)),e=u}}}class rl{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const s=t.getActiveUniform(e,o),r=t.getUniformLocation(e,s.name);Cw(s,r,this)}}setValue(t,e,i,o){const s=this.map[e];s!==void 0&&s.setValue(t,i,o)}setOptional(t,e,i){const o=e[i];o!==void 0&&this.setValue(t,i,o)}static upload(t,e,i,o){for(let s=0,r=e.length;s!==r;++s){const a=e[s],c=i[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,o)}}static seqWithValue(t,e){const i=[];for(let o=0,s=t.length;o!==s;++o){const r=t[o];r.id in e&&i.push(r)}return i}}function Up(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Rw=37297;let Pw=0;function Lw(n,t){const e=n.split(`
`),i=[],o=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let r=o;r<s;r++){const a=r+1;i.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return i.join(`
`)}function Dw(n){const t=ve.getPrimaries(ve.workingColorSpace),e=ve.getPrimaries(n);let i;switch(t===e?i="":t===Cl&&e===Al?i="LinearDisplayP3ToLinearSRGB":t===Al&&e===Cl&&(i="LinearSRGBToLinearDisplayP3"),n){case Fo:case id:return[i,"LinearTransferOETF"];case Ke:case Gh:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Fp(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),o=n.getShaderInfoLog(t).trim();if(i&&o==="")return"";const s=/ERROR: 0:(\d+)/.exec(o);if(s){const r=parseInt(s[1]);return e.toUpperCase()+`

`+o+`

`+Lw(n.getShaderSource(t),r)}else return o}function Iw(n,t){const e=Dw(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Nw(n,t){let e;switch(t){case Ig:e="Linear";break;case Ng:e="Reinhard";break;case Og:e="OptimizedCineon";break;case Wh:e="ACESFilmic";break;case Ug:e="AgX";break;case Fg:e="Neutral";break;case Nx:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Ow(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ua).join(`
`)}function Uw(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Fw(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let o=0;o<i;o++){const s=n.getActiveAttrib(t,o),r=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),e[r]={type:s.type,location:n.getAttribLocation(t,r),locationSize:a}}return e}function ua(n){return n!==""}function zp(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Bp(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const zw=/^[ \t]*#include +<([\w\d./]+)>/gm;function rh(n){return n.replace(zw,Hw)}const Bw=new Map;function Hw(n,t){let e=te[t];if(e===void 0){const i=Bw.get(t);if(i!==void 0)e=te[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return rh(e)}const kw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hp(n){return n.replace(kw,Ww)}function Ww(n,t,e,i){let o="";for(let s=parseInt(t);s<parseInt(e);s++)o+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return o}function kp(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Gw(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Pg?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Lg?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Vi&&(t="SHADOWMAP_TYPE_VSM"),t}function Vw(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case br:case Tr:t="ENVMAP_TYPE_CUBE";break;case ed:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Xw(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Tr:t="ENVMAP_MODE_REFRACTION";break}return t}function Yw(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case kh:t="ENVMAP_BLENDING_MULTIPLY";break;case Dx:t="ENVMAP_BLENDING_MIX";break;case Ix:t="ENVMAP_BLENDING_ADD";break}return t}function qw(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Zw(n,t,e,i){const o=n.getContext(),s=e.defines;let r=e.vertexShader,a=e.fragmentShader;const c=Gw(e),l=Vw(e),d=Xw(e),u=Yw(e),h=qw(e),f=Ow(e),m=Uw(s),v=o.createProgram();let p,g,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(ua).join(`
`),p.length>0&&(p+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(ua).join(`
`),g.length>0&&(g+=`
`)):(p=[kp(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ua).join(`
`),g=[kp(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Do?"#define TONE_MAPPING":"",e.toneMapping!==Do?te.tonemapping_pars_fragment:"",e.toneMapping!==Do?Nw("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",te.colorspace_pars_fragment,Iw("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ua).join(`
`)),r=rh(r),r=zp(r,e),r=Bp(r,e),a=rh(a),a=zp(a,e),a=Bp(a,e),r=Hp(r),a=Hp(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,g=["#define varying in",e.glslVersion===ip?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ip?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const x=S+p+r,w=S+g+a,E=Up(o,o.VERTEX_SHADER,x),b=Up(o,o.FRAGMENT_SHADER,w);o.attachShader(v,E),o.attachShader(v,b),e.index0AttributeName!==void 0?o.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&o.bindAttribLocation(v,0,"position"),o.linkProgram(v);function T(R){if(n.debug.checkShaderErrors){const D=o.getProgramInfoLog(v).trim(),N=o.getShaderInfoLog(E).trim(),z=o.getShaderInfoLog(b).trim();let B=!0,V=!0;if(o.getProgramParameter(v,o.LINK_STATUS)===!1)if(B=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(o,v,E,b);else{const j=Fp(o,E,"vertex"),Y=Fp(o,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(v,o.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+D+`
`+j+`
`+Y)}else D!==""?console.warn("THREE.WebGLProgram: Program Info Log:",D):(N===""||z==="")&&(V=!1);V&&(R.diagnostics={runnable:B,programLog:D,vertexShader:{log:N,prefix:p},fragmentShader:{log:z,prefix:g}})}o.deleteShader(E),o.deleteShader(b),C=new rl(o,v),y=Fw(o,v)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let y;this.getAttributes=function(){return y===void 0&&T(this),y};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=o.getProgramParameter(v,Rw)),_},this.destroy=function(){i.releaseStatesOfProgram(this),o.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Pw++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=b,this}let Kw=0;class jw{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,o=this._getShaderStage(e),s=this._getShaderStage(i),r=this._getShaderCacheForMaterial(t);return r.has(o)===!1&&(r.add(o),o.usedTimes++),r.has(s)===!1&&(r.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Jw(t),e.set(t,i)),i}}class Jw{constructor(t){this.id=Kw++,this.code=t,this.usedTimes=0}}function Qw(n,t,e,i,o,s,r){const a=new qh,c=new jw,l=new Set,d=[],u=o.logarithmicDepthBuffer,h=o.vertexTextures;let f=o.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(y){return l.add(y),y===0?"uv":`uv${y}`}function p(y,_,R,D,N){const z=D.fog,B=N.geometry,V=y.isMeshStandardMaterial?D.environment:null,j=(y.isMeshStandardMaterial?e:t).get(y.envMap||V),Y=j&&j.mapping===ed?j.image.height:null,J=m[y.type];y.precision!==null&&(f=o.getMaxPrecision(y.precision),f!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));const k=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,$=k!==void 0?k.length:0;let mt=0;B.morphAttributes.position!==void 0&&(mt=1),B.morphAttributes.normal!==void 0&&(mt=2),B.morphAttributes.color!==void 0&&(mt=3);let at,X,tt,ft;if(J){const fe=wi[J];at=fe.vertexShader,X=fe.fragmentShader}else at=y.vertexShader,X=y.fragmentShader,c.update(y),tt=c.getVertexShaderID(y),ft=c.getFragmentShaderID(y);const ot=n.getRenderTarget(),Nt=N.isInstancedMesh===!0,Et=N.isBatchedMesh===!0,Vt=!!y.map,O=!!y.matcap,Ut=!!j,Rt=!!y.aoMap,ie=!!y.lightMap,bt=!!y.bumpMap,Kt=!!y.normalMap,Ht=!!y.displacementMap,zt=!!y.emissiveMap,_e=!!y.metalnessMap,I=!!y.roughnessMap,A=y.anisotropy>0,W=y.clearcoat>0,K=y.dispersion>0,nt=y.iridescence>0,it=y.sheen>0,At=y.transmission>0,gt=A&&!!y.anisotropyMap,pt=W&&!!y.clearcoatMap,kt=W&&!!y.clearcoatNormalMap,ct=W&&!!y.clearcoatRoughnessMap,st=nt&&!!y.iridescenceMap,Pt=nt&&!!y.iridescenceThicknessMap,_t=it&&!!y.sheenColorMap,ut=it&&!!y.sheenRoughnessMap,Xt=!!y.specularMap,jt=!!y.specularColorMap,he=!!y.specularIntensityMap,F=At&&!!y.transmissionMap,vt=At&&!!y.thicknessMap,Q=!!y.gradientMap,et=!!y.alphaMap,dt=y.alphaTest>0,Yt=!!y.alphaHash,le=!!y.extensions;let Pe=Do;y.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(Pe=n.toneMapping);const Le={shaderID:J,shaderType:y.type,shaderName:y.name,vertexShader:at,fragmentShader:X,defines:y.defines,customVertexShaderID:tt,customFragmentShaderID:ft,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:Et,batchingColor:Et&&N._colorsTexture!==null,instancing:Nt,instancingColor:Nt&&N.instanceColor!==null,instancingMorph:Nt&&N.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ot===null?n.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:Fo,alphaToCoverage:!!y.alphaToCoverage,map:Vt,matcap:O,envMap:Ut,envMapMode:Ut&&j.mapping,envMapCubeUVHeight:Y,aoMap:Rt,lightMap:ie,bumpMap:bt,normalMap:Kt,displacementMap:h&&Ht,emissiveMap:zt,normalMapObjectSpace:Kt&&y.normalMapType===qx,normalMapTangentSpace:Kt&&y.normalMapType===nd,metalnessMap:_e,roughnessMap:I,anisotropy:A,anisotropyMap:gt,clearcoat:W,clearcoatMap:pt,clearcoatNormalMap:kt,clearcoatRoughnessMap:ct,dispersion:K,iridescence:nt,iridescenceMap:st,iridescenceThicknessMap:Pt,sheen:it,sheenColorMap:_t,sheenRoughnessMap:ut,specularMap:Xt,specularColorMap:jt,specularIntensityMap:he,transmission:At,transmissionMap:F,thicknessMap:vt,gradientMap:Q,opaque:y.transparent===!1&&y.blending===vr&&y.alphaToCoverage===!1,alphaMap:et,alphaTest:dt,alphaHash:Yt,combine:y.combine,mapUv:Vt&&v(y.map.channel),aoMapUv:Rt&&v(y.aoMap.channel),lightMapUv:ie&&v(y.lightMap.channel),bumpMapUv:bt&&v(y.bumpMap.channel),normalMapUv:Kt&&v(y.normalMap.channel),displacementMapUv:Ht&&v(y.displacementMap.channel),emissiveMapUv:zt&&v(y.emissiveMap.channel),metalnessMapUv:_e&&v(y.metalnessMap.channel),roughnessMapUv:I&&v(y.roughnessMap.channel),anisotropyMapUv:gt&&v(y.anisotropyMap.channel),clearcoatMapUv:pt&&v(y.clearcoatMap.channel),clearcoatNormalMapUv:kt&&v(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ct&&v(y.clearcoatRoughnessMap.channel),iridescenceMapUv:st&&v(y.iridescenceMap.channel),iridescenceThicknessMapUv:Pt&&v(y.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&v(y.sheenColorMap.channel),sheenRoughnessMapUv:ut&&v(y.sheenRoughnessMap.channel),specularMapUv:Xt&&v(y.specularMap.channel),specularColorMapUv:jt&&v(y.specularColorMap.channel),specularIntensityMapUv:he&&v(y.specularIntensityMap.channel),transmissionMapUv:F&&v(y.transmissionMap.channel),thicknessMapUv:vt&&v(y.thicknessMap.channel),alphaMapUv:et&&v(y.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(Kt||A),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!B.attributes.uv&&(Vt||et),fog:!!z,useFog:y.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:N.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:$,morphTextureStride:mt,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:Pe,decodeVideoTexture:Vt&&y.map.isVideoTexture===!0&&ve.getTransfer(y.map.colorSpace)===Ce,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===me,flipSided:y.side===je,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:le&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:le&&y.extensions.multiDraw===!0&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Le.vertexUv1s=l.has(1),Le.vertexUv2s=l.has(2),Le.vertexUv3s=l.has(3),l.clear(),Le}function g(y){const _=[];if(y.shaderID?_.push(y.shaderID):(_.push(y.customVertexShaderID),_.push(y.customFragmentShaderID)),y.defines!==void 0)for(const R in y.defines)_.push(R),_.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(S(_,y),x(_,y),_.push(n.outputColorSpace)),_.push(y.customProgramCacheKey),_.join()}function S(y,_){y.push(_.precision),y.push(_.outputColorSpace),y.push(_.envMapMode),y.push(_.envMapCubeUVHeight),y.push(_.mapUv),y.push(_.alphaMapUv),y.push(_.lightMapUv),y.push(_.aoMapUv),y.push(_.bumpMapUv),y.push(_.normalMapUv),y.push(_.displacementMapUv),y.push(_.emissiveMapUv),y.push(_.metalnessMapUv),y.push(_.roughnessMapUv),y.push(_.anisotropyMapUv),y.push(_.clearcoatMapUv),y.push(_.clearcoatNormalMapUv),y.push(_.clearcoatRoughnessMapUv),y.push(_.iridescenceMapUv),y.push(_.iridescenceThicknessMapUv),y.push(_.sheenColorMapUv),y.push(_.sheenRoughnessMapUv),y.push(_.specularMapUv),y.push(_.specularColorMapUv),y.push(_.specularIntensityMapUv),y.push(_.transmissionMapUv),y.push(_.thicknessMapUv),y.push(_.combine),y.push(_.fogExp2),y.push(_.sizeAttenuation),y.push(_.morphTargetsCount),y.push(_.morphAttributeCount),y.push(_.numDirLights),y.push(_.numPointLights),y.push(_.numSpotLights),y.push(_.numSpotLightMaps),y.push(_.numHemiLights),y.push(_.numRectAreaLights),y.push(_.numDirLightShadows),y.push(_.numPointLightShadows),y.push(_.numSpotLightShadows),y.push(_.numSpotLightShadowsWithMaps),y.push(_.numLightProbes),y.push(_.shadowMapType),y.push(_.toneMapping),y.push(_.numClippingPlanes),y.push(_.numClipIntersection),y.push(_.depthPacking)}function x(y,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),y.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.skinning&&a.enable(4),_.morphTargets&&a.enable(5),_.morphNormals&&a.enable(6),_.morphColors&&a.enable(7),_.premultipliedAlpha&&a.enable(8),_.shadowMapEnabled&&a.enable(9),_.doubleSided&&a.enable(10),_.flipSided&&a.enable(11),_.useDepthPacking&&a.enable(12),_.dithering&&a.enable(13),_.transmission&&a.enable(14),_.sheen&&a.enable(15),_.opaque&&a.enable(16),_.pointsUvs&&a.enable(17),_.decodeVideoTexture&&a.enable(18),_.alphaToCoverage&&a.enable(19),y.push(a.mask)}function w(y){const _=m[y.type];let R;if(_){const D=wi[_];R=Wn.clone(D.uniforms)}else R=y.uniforms;return R}function E(y,_){let R;for(let D=0,N=d.length;D<N;D++){const z=d[D];if(z.cacheKey===_){R=z,++R.usedTimes;break}}return R===void 0&&(R=new Zw(n,_,y,s),d.push(R)),R}function b(y){if(--y.usedTimes===0){const _=d.indexOf(y);d[_]=d[d.length-1],d.pop(),y.destroy()}}function T(y){c.remove(y)}function C(){c.dispose()}return{getParameters:p,getProgramCacheKey:g,getUniforms:w,acquireProgram:E,releaseProgram:b,releaseShaderCache:T,programs:d,dispose:C}}function $w(){let n=new WeakMap;function t(s){let r=n.get(s);return r===void 0&&(r={},n.set(s,r)),r}function e(s){n.delete(s)}function i(s,r,a){n.get(s)[r]=a}function o(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:o}}function ty(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Wp(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Gp(){const n=[];let t=0;const e=[],i=[],o=[];function s(){t=0,e.length=0,i.length=0,o.length=0}function r(u,h,f,m,v,p){let g=n[t];return g===void 0?(g={id:u.id,object:u,geometry:h,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:p},n[t]=g):(g.id=u.id,g.object=u,g.geometry=h,g.material=f,g.groupOrder=m,g.renderOrder=u.renderOrder,g.z=v,g.group=p),t++,g}function a(u,h,f,m,v,p){const g=r(u,h,f,m,v,p);f.transmission>0?i.push(g):f.transparent===!0?o.push(g):e.push(g)}function c(u,h,f,m,v,p){const g=r(u,h,f,m,v,p);f.transmission>0?i.unshift(g):f.transparent===!0?o.unshift(g):e.unshift(g)}function l(u,h){e.length>1&&e.sort(u||ty),i.length>1&&i.sort(h||Wp),o.length>1&&o.sort(h||Wp)}function d(){for(let u=t,h=n.length;u<h;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:o,init:s,push:a,unshift:c,finish:d,sort:l}}function ey(){let n=new WeakMap;function t(i,o){const s=n.get(i);let r;return s===void 0?(r=new Gp,n.set(i,[r])):o>=s.length?(r=new Gp,s.push(r)):r=s[o],r}function e(){n=new WeakMap}return{get:t,dispose:e}}function ny(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new M,color:new St};break;case"SpotLight":e={position:new M,direction:new M,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new M,color:new St,distance:0,decay:0};break;case"HemisphereLight":e={direction:new M,skyColor:new St,groundColor:new St};break;case"RectAreaLight":e={color:new St,position:new M,halfWidth:new M,halfHeight:new M};break}return n[t.id]=e,e}}}function iy(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let oy=0;function sy(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function ry(n){const t=new ny,e=iy(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new M);const o=new M,s=new Lt,r=new Lt;function a(l){let d=0,u=0,h=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let f=0,m=0,v=0,p=0,g=0,S=0,x=0,w=0,E=0,b=0,T=0;l.sort(sy);for(let y=0,_=l.length;y<_;y++){const R=l[y],D=R.color,N=R.intensity,z=R.distance,B=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=D.r*N,u+=D.g*N,h+=D.b*N;else if(R.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(R.sh.coefficients[V],N);T++}else if(R.isDirectionalLight){const V=t.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const j=R.shadow,Y=e.get(R);Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,i.directionalShadow[f]=Y,i.directionalShadowMap[f]=B,i.directionalShadowMatrix[f]=R.shadow.matrix,S++}i.directional[f]=V,f++}else if(R.isSpotLight){const V=t.get(R);V.position.setFromMatrixPosition(R.matrixWorld),V.color.copy(D).multiplyScalar(N),V.distance=z,V.coneCos=Math.cos(R.angle),V.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),V.decay=R.decay,i.spot[v]=V;const j=R.shadow;if(R.map&&(i.spotLightMap[E]=R.map,E++,j.updateMatrices(R),R.castShadow&&b++),i.spotLightMatrix[v]=j.matrix,R.castShadow){const Y=e.get(R);Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,i.spotShadow[v]=Y,i.spotShadowMap[v]=B,w++}v++}else if(R.isRectAreaLight){const V=t.get(R);V.color.copy(D).multiplyScalar(N),V.halfWidth.set(R.width*.5,0,0),V.halfHeight.set(0,R.height*.5,0),i.rectArea[p]=V,p++}else if(R.isPointLight){const V=t.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),V.distance=R.distance,V.decay=R.decay,R.castShadow){const j=R.shadow,Y=e.get(R);Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,Y.shadowCameraNear=j.camera.near,Y.shadowCameraFar=j.camera.far,i.pointShadow[m]=Y,i.pointShadowMap[m]=B,i.pointShadowMatrix[m]=R.shadow.matrix,x++}i.point[m]=V,m++}else if(R.isHemisphereLight){const V=t.get(R);V.skyColor.copy(R.color).multiplyScalar(N),V.groundColor.copy(R.groundColor).multiplyScalar(N),i.hemi[g]=V,g++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=xt.LTC_FLOAT_1,i.rectAreaLTC2=xt.LTC_FLOAT_2):(i.rectAreaLTC1=xt.LTC_HALF_1,i.rectAreaLTC2=xt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const C=i.hash;(C.directionalLength!==f||C.pointLength!==m||C.spotLength!==v||C.rectAreaLength!==p||C.hemiLength!==g||C.numDirectionalShadows!==S||C.numPointShadows!==x||C.numSpotShadows!==w||C.numSpotMaps!==E||C.numLightProbes!==T)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=p,i.point.length=m,i.hemi.length=g,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=w+E-b,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=T,C.directionalLength=f,C.pointLength=m,C.spotLength=v,C.rectAreaLength=p,C.hemiLength=g,C.numDirectionalShadows=S,C.numPointShadows=x,C.numSpotShadows=w,C.numSpotMaps=E,C.numLightProbes=T,i.version=oy++)}function c(l,d){let u=0,h=0,f=0,m=0,v=0;const p=d.matrixWorldInverse;for(let g=0,S=l.length;g<S;g++){const x=l[g];if(x.isDirectionalLight){const w=i.directional[u];w.direction.setFromMatrixPosition(x.matrixWorld),o.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(o),w.direction.transformDirection(p),u++}else if(x.isSpotLight){const w=i.spot[f];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(x.matrixWorld),o.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(o),w.direction.transformDirection(p),f++}else if(x.isRectAreaLight){const w=i.rectArea[m];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(p),r.identity(),s.copy(x.matrixWorld),s.premultiply(p),r.extractRotation(s),w.halfWidth.set(x.width*.5,0,0),w.halfHeight.set(0,x.height*.5,0),w.halfWidth.applyMatrix4(r),w.halfHeight.applyMatrix4(r),m++}else if(x.isPointLight){const w=i.point[h];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(p),h++}else if(x.isHemisphereLight){const w=i.hemi[v];w.direction.setFromMatrixPosition(x.matrixWorld),w.direction.transformDirection(p),v++}}}return{setup:a,setupView:c,state:i}}function Vp(n){const t=new ry(n),e=[],i=[];function o(d){l.camera=d,e.length=0,i.length=0}function s(d){e.push(d)}function r(d){i.push(d)}function a(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:o,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:r}}function ay(n){let t=new WeakMap;function e(o,s=0){const r=t.get(o);let a;return r===void 0?(a=new Vp(n),t.set(o,[a])):s>=r.length?(a=new Vp(n),r.push(a)):a=r[s],a}function i(){t=new WeakMap}return{get:e,dispose:i}}class cy extends Ei{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ly extends Ei{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const dy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,uy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function hy(n,t,e){let i=new od;const o=new rt,s=new rt,r=new Ne,a=new cy({depthPacking:Yx}),c=new ly,l={},d=e.maxTextureSize,u={[It]:je,[je]:It,[me]:me},h=new de({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new rt},radius:{value:4}},vertexShader:dy,fragmentShader:uy}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const m=new ce;m.setAttribute("position",new re(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new L(m,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Pg;let g=this.type;this.render=function(b,T,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;const y=n.getRenderTarget(),_=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),D=n.state;D.setBlending(pn),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const N=g!==Vi&&this.type===Vi,z=g===Vi&&this.type!==Vi;for(let B=0,V=b.length;B<V;B++){const j=b[B],Y=j.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;o.copy(Y.mapSize);const J=Y.getFrameExtents();if(o.multiply(J),s.copy(Y.mapSize),(o.x>d||o.y>d)&&(o.x>d&&(s.x=Math.floor(d/J.x),o.x=s.x*J.x,Y.mapSize.x=s.x),o.y>d&&(s.y=Math.floor(d/J.y),o.y=s.y*J.y,Y.mapSize.y=s.y)),Y.map===null||N===!0||z===!0){const $=this.type!==Vi?{minFilter:dn,magFilter:dn}:{};Y.map!==null&&Y.map.dispose(),Y.map=new wn(o.x,o.y,$),Y.map.texture.name=j.name+".shadowMap",Y.camera.updateProjectionMatrix()}n.setRenderTarget(Y.map),n.clear();const k=Y.getViewportCount();for(let $=0;$<k;$++){const mt=Y.getViewport($);r.set(s.x*mt.x,s.y*mt.y,s.x*mt.z,s.y*mt.w),D.viewport(r),Y.updateMatrices(j,$),i=Y.getFrustum(),w(T,C,Y.camera,j,this.type)}Y.isPointLightShadow!==!0&&this.type===Vi&&S(Y,C),Y.needsUpdate=!1}g=this.type,p.needsUpdate=!1,n.setRenderTarget(y,_,R)};function S(b,T){const C=t.update(v);h.defines.VSM_SAMPLES!==b.blurSamples&&(h.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new wn(o.x,o.y)),h.uniforms.shadow_pass.value=b.map.texture,h.uniforms.resolution.value=b.mapSize,h.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(T,null,C,h,v,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(T,null,C,f,v,null)}function x(b,T,C,y){let _=null;const R=C.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)_=R;else if(_=C.isPointLight===!0?c:a,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const D=_.uuid,N=T.uuid;let z=l[D];z===void 0&&(z={},l[D]=z);let B=z[N];B===void 0&&(B=_.clone(),z[N]=B,T.addEventListener("dispose",E)),_=B}if(_.visible=T.visible,_.wireframe=T.wireframe,y===Vi?_.side=T.shadowSide!==null?T.shadowSide:T.side:_.side=T.shadowSide!==null?T.shadowSide:u[T.side],_.alphaMap=T.alphaMap,_.alphaTest=T.alphaTest,_.map=T.map,_.clipShadows=T.clipShadows,_.clippingPlanes=T.clippingPlanes,_.clipIntersection=T.clipIntersection,_.displacementMap=T.displacementMap,_.displacementScale=T.displacementScale,_.displacementBias=T.displacementBias,_.wireframeLinewidth=T.wireframeLinewidth,_.linewidth=T.linewidth,C.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const D=n.properties.get(_);D.light=C}return _}function w(b,T,C,y,_){if(b.visible===!1)return;if(b.layers.test(T.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&_===Vi)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,b.matrixWorld);const N=t.update(b),z=b.material;if(Array.isArray(z)){const B=N.groups;for(let V=0,j=B.length;V<j;V++){const Y=B[V],J=z[Y.materialIndex];if(J&&J.visible){const k=x(b,J,y,_);b.onBeforeShadow(n,b,T,C,N,k,Y),n.renderBufferDirect(C,null,N,k,b,Y),b.onAfterShadow(n,b,T,C,N,k,Y)}}}else if(z.visible){const B=x(b,z,y,_);b.onBeforeShadow(n,b,T,C,N,B,null),n.renderBufferDirect(C,null,N,B,b,null),b.onAfterShadow(n,b,T,C,N,B,null)}}const D=b.children;for(let N=0,z=D.length;N<z;N++)w(D[N],T,C,y,_)}function E(b){b.target.removeEventListener("dispose",E);for(const C in l){const y=l[C],_=b.target.uuid;_ in y&&(y[_].dispose(),delete y[_])}}}function fy(n){function t(){let F=!1;const vt=new Ne;let Q=null;const et=new Ne(0,0,0,0);return{setMask:function(dt){Q!==dt&&!F&&(n.colorMask(dt,dt,dt,dt),Q=dt)},setLocked:function(dt){F=dt},setClear:function(dt,Yt,le,Pe,Le){Le===!0&&(dt*=Pe,Yt*=Pe,le*=Pe),vt.set(dt,Yt,le,Pe),et.equals(vt)===!1&&(n.clearColor(dt,Yt,le,Pe),et.copy(vt))},reset:function(){F=!1,Q=null,et.set(-1,0,0,0)}}}function e(){let F=!1,vt=null,Q=null,et=null;return{setTest:function(dt){dt?ft(n.DEPTH_TEST):ot(n.DEPTH_TEST)},setMask:function(dt){vt!==dt&&!F&&(n.depthMask(dt),vt=dt)},setFunc:function(dt){if(Q!==dt){switch(dt){case Tx:n.depthFunc(n.NEVER);break;case Ex:n.depthFunc(n.ALWAYS);break;case Ax:n.depthFunc(n.LESS);break;case bl:n.depthFunc(n.LEQUAL);break;case Cx:n.depthFunc(n.EQUAL);break;case Rx:n.depthFunc(n.GEQUAL);break;case Px:n.depthFunc(n.GREATER);break;case Lx:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Q=dt}},setLocked:function(dt){F=dt},setClear:function(dt){et!==dt&&(n.clearDepth(dt),et=dt)},reset:function(){F=!1,vt=null,Q=null,et=null}}}function i(){let F=!1,vt=null,Q=null,et=null,dt=null,Yt=null,le=null,Pe=null,Le=null;return{setTest:function(fe){F||(fe?ft(n.STENCIL_TEST):ot(n.STENCIL_TEST))},setMask:function(fe){vt!==fe&&!F&&(n.stencilMask(fe),vt=fe)},setFunc:function(fe,Yn,qn){(Q!==fe||et!==Yn||dt!==qn)&&(n.stencilFunc(fe,Yn,qn),Q=fe,et=Yn,dt=qn)},setOp:function(fe,Yn,qn){(Yt!==fe||le!==Yn||Pe!==qn)&&(n.stencilOp(fe,Yn,qn),Yt=fe,le=Yn,Pe=qn)},setLocked:function(fe){F=fe},setClear:function(fe){Le!==fe&&(n.clearStencil(fe),Le=fe)},reset:function(){F=!1,vt=null,Q=null,et=null,dt=null,Yt=null,le=null,Pe=null,Le=null}}}const o=new t,s=new e,r=new i,a=new WeakMap,c=new WeakMap;let l={},d={},u=new WeakMap,h=[],f=null,m=!1,v=null,p=null,g=null,S=null,x=null,w=null,E=null,b=new St(0,0,0),T=0,C=!1,y=null,_=null,R=null,D=null,N=null;const z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,V=0;const j=n.getParameter(n.VERSION);j.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(j)[1]),B=V>=1):j.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),B=V>=2);let Y=null,J={};const k=n.getParameter(n.SCISSOR_BOX),$=n.getParameter(n.VIEWPORT),mt=new Ne().fromArray(k),at=new Ne().fromArray($);function X(F,vt,Q,et){const dt=new Uint8Array(4),Yt=n.createTexture();n.bindTexture(F,Yt),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let le=0;le<Q;le++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(vt,0,n.RGBA,1,1,et,0,n.RGBA,n.UNSIGNED_BYTE,dt):n.texImage2D(vt+le,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,dt);return Yt}const tt={};tt[n.TEXTURE_2D]=X(n.TEXTURE_2D,n.TEXTURE_2D,1),tt[n.TEXTURE_CUBE_MAP]=X(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),tt[n.TEXTURE_2D_ARRAY]=X(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),tt[n.TEXTURE_3D]=X(n.TEXTURE_3D,n.TEXTURE_3D,1,1),o.setClear(0,0,0,1),s.setClear(1),r.setClear(0),ft(n.DEPTH_TEST),s.setFunc(bl),bt(!1),Kt(Af),ft(n.CULL_FACE),Rt(pn);function ft(F){l[F]!==!0&&(n.enable(F),l[F]=!0)}function ot(F){l[F]!==!1&&(n.disable(F),l[F]=!1)}function Nt(F,vt){return d[F]!==vt?(n.bindFramebuffer(F,vt),d[F]=vt,F===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=vt),F===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=vt),!0):!1}function Et(F,vt){let Q=h,et=!1;if(F){Q=u.get(vt),Q===void 0&&(Q=[],u.set(vt,Q));const dt=F.textures;if(Q.length!==dt.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let Yt=0,le=dt.length;Yt<le;Yt++)Q[Yt]=n.COLOR_ATTACHMENT0+Yt;Q.length=dt.length,et=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,et=!0);et&&n.drawBuffers(Q)}function Vt(F){return f!==F?(n.useProgram(F),f=F,!0):!1}const O={[di]:n.FUNC_ADD,[ux]:n.FUNC_SUBTRACT,[hx]:n.FUNC_REVERSE_SUBTRACT};O[fx]=n.MIN,O[px]=n.MAX;const Ut={[da]:n.ZERO,[mx]:n.ONE,[gx]:n.SRC_COLOR,[Ju]:n.SRC_ALPHA,[_x]:n.SRC_ALPHA_SATURATE,[th]:n.DST_COLOR,[$u]:n.DST_ALPHA,[vx]:n.ONE_MINUS_SRC_COLOR,[Qu]:n.ONE_MINUS_SRC_ALPHA,[Sx]:n.ONE_MINUS_DST_COLOR,[xx]:n.ONE_MINUS_DST_ALPHA,[Mx]:n.CONSTANT_COLOR,[wx]:n.ONE_MINUS_CONSTANT_COLOR,[yx]:n.CONSTANT_ALPHA,[bx]:n.ONE_MINUS_CONSTANT_ALPHA};function Rt(F,vt,Q,et,dt,Yt,le,Pe,Le,fe){if(F===pn){m===!0&&(ot(n.BLEND),m=!1);return}if(m===!1&&(ft(n.BLEND),m=!0),F!==Dg){if(F!==v||fe!==C){if((p!==di||x!==di)&&(n.blendEquation(n.FUNC_ADD),p=di,x=di),fe)switch(F){case vr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ae:n.blendFunc(n.ONE,n.ONE);break;case Cf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Rf:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case vr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ae:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Cf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Rf:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}g=null,S=null,w=null,E=null,b.set(0,0,0),T=0,v=F,C=fe}return}dt=dt||vt,Yt=Yt||Q,le=le||et,(vt!==p||dt!==x)&&(n.blendEquationSeparate(O[vt],O[dt]),p=vt,x=dt),(Q!==g||et!==S||Yt!==w||le!==E)&&(n.blendFuncSeparate(Ut[Q],Ut[et],Ut[Yt],Ut[le]),g=Q,S=et,w=Yt,E=le),(Pe.equals(b)===!1||Le!==T)&&(n.blendColor(Pe.r,Pe.g,Pe.b,Le),b.copy(Pe),T=Le),v=F,C=!1}function ie(F,vt){F.side===me?ot(n.CULL_FACE):ft(n.CULL_FACE);let Q=F.side===je;vt&&(Q=!Q),bt(Q),F.blending===vr&&F.transparent===!1?Rt(pn):Rt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),s.setFunc(F.depthFunc),s.setTest(F.depthTest),s.setMask(F.depthWrite),o.setMask(F.colorWrite);const et=F.stencilWrite;r.setTest(et),et&&(r.setMask(F.stencilWriteMask),r.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),r.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),zt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ft(n.SAMPLE_ALPHA_TO_COVERAGE):ot(n.SAMPLE_ALPHA_TO_COVERAGE)}function bt(F){y!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),y=F)}function Kt(F){F!==lx?(ft(n.CULL_FACE),F!==_&&(F===Af?n.cullFace(n.BACK):F===dx?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ot(n.CULL_FACE),_=F}function Ht(F){F!==R&&(B&&n.lineWidth(F),R=F)}function zt(F,vt,Q){F?(ft(n.POLYGON_OFFSET_FILL),(D!==vt||N!==Q)&&(n.polygonOffset(vt,Q),D=vt,N=Q)):ot(n.POLYGON_OFFSET_FILL)}function _e(F){F?ft(n.SCISSOR_TEST):ot(n.SCISSOR_TEST)}function I(F){F===void 0&&(F=n.TEXTURE0+z-1),Y!==F&&(n.activeTexture(F),Y=F)}function A(F,vt,Q){Q===void 0&&(Y===null?Q=n.TEXTURE0+z-1:Q=Y);let et=J[Q];et===void 0&&(et={type:void 0,texture:void 0},J[Q]=et),(et.type!==F||et.texture!==vt)&&(Y!==Q&&(n.activeTexture(Q),Y=Q),n.bindTexture(F,vt||tt[F]),et.type=F,et.texture=vt)}function W(){const F=J[Y];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function K(){try{n.compressedTexImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function nt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function it(){try{n.texSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function At(){try{n.texSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function gt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function pt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function kt(){try{n.texStorage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ct(){try{n.texStorage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function st(){try{n.texImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Pt(){try{n.texImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function _t(F){mt.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),mt.copy(F))}function ut(F){at.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),at.copy(F))}function Xt(F,vt){let Q=c.get(vt);Q===void 0&&(Q=new WeakMap,c.set(vt,Q));let et=Q.get(F);et===void 0&&(et=n.getUniformBlockIndex(vt,F.name),Q.set(F,et))}function jt(F,vt){const et=c.get(vt).get(F);a.get(vt)!==et&&(n.uniformBlockBinding(vt,et,F.__bindingPointIndex),a.set(vt,et))}function he(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),l={},Y=null,J={},d={},u=new WeakMap,h=[],f=null,m=!1,v=null,p=null,g=null,S=null,x=null,w=null,E=null,b=new St(0,0,0),T=0,C=!1,y=null,_=null,R=null,D=null,N=null,mt.set(0,0,n.canvas.width,n.canvas.height),at.set(0,0,n.canvas.width,n.canvas.height),o.reset(),s.reset(),r.reset()}return{buffers:{color:o,depth:s,stencil:r},enable:ft,disable:ot,bindFramebuffer:Nt,drawBuffers:Et,useProgram:Vt,setBlending:Rt,setMaterial:ie,setFlipSided:bt,setCullFace:Kt,setLineWidth:Ht,setPolygonOffset:zt,setScissorTest:_e,activeTexture:I,bindTexture:A,unbindTexture:W,compressedTexImage2D:K,compressedTexImage3D:nt,texImage2D:st,texImage3D:Pt,updateUBOMapping:Xt,uniformBlockBinding:jt,texStorage2D:kt,texStorage3D:ct,texSubImage2D:it,texSubImage3D:At,compressedTexSubImage2D:gt,compressedTexSubImage3D:pt,scissor:_t,viewport:ut,reset:he}}function py(n,t,e,i,o,s,r){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new rt,d=new WeakMap;let u;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(I,A){return f?new OffscreenCanvas(I,A):Pl("canvas")}function v(I,A,W){let K=1;const nt=_e(I);if((nt.width>W||nt.height>W)&&(K=W/Math.max(nt.width,nt.height)),K<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const it=Math.floor(K*nt.width),At=Math.floor(K*nt.height);u===void 0&&(u=m(it,At));const gt=A?m(it,At):u;return gt.width=it,gt.height=At,gt.getContext("2d").drawImage(I,0,0,it,At),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+it+"x"+At+")."),gt}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),I;return I}function p(I){return I.generateMipmaps&&I.minFilter!==dn&&I.minFilter!==On}function g(I){n.generateMipmap(I)}function S(I,A,W,K,nt=!1){if(I!==null){if(n[I]!==void 0)return n[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let it=A;if(A===n.RED&&(W===n.FLOAT&&(it=n.R32F),W===n.HALF_FLOAT&&(it=n.R16F),W===n.UNSIGNED_BYTE&&(it=n.R8)),A===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(it=n.R8UI),W===n.UNSIGNED_SHORT&&(it=n.R16UI),W===n.UNSIGNED_INT&&(it=n.R32UI),W===n.BYTE&&(it=n.R8I),W===n.SHORT&&(it=n.R16I),W===n.INT&&(it=n.R32I)),A===n.RG&&(W===n.FLOAT&&(it=n.RG32F),W===n.HALF_FLOAT&&(it=n.RG16F),W===n.UNSIGNED_BYTE&&(it=n.RG8)),A===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(it=n.RG8UI),W===n.UNSIGNED_SHORT&&(it=n.RG16UI),W===n.UNSIGNED_INT&&(it=n.RG32UI),W===n.BYTE&&(it=n.RG8I),W===n.SHORT&&(it=n.RG16I),W===n.INT&&(it=n.RG32I)),A===n.RGB&&W===n.UNSIGNED_INT_5_9_9_9_REV&&(it=n.RGB9_E5),A===n.RGBA){const At=nt?El:ve.getTransfer(K);W===n.FLOAT&&(it=n.RGBA32F),W===n.HALF_FLOAT&&(it=n.RGBA16F),W===n.UNSIGNED_BYTE&&(it=At===Ce?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT_4_4_4_4&&(it=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(it=n.RGB5_A1)}return(it===n.R16F||it===n.R32F||it===n.RG16F||it===n.RG32F||it===n.RGBA16F||it===n.RGBA32F)&&t.get("EXT_color_buffer_float"),it}function x(I,A){let W;return I?A===null||A===Er||A===xs?W=n.DEPTH24_STENCIL8:A===Ki?W=n.DEPTH32F_STENCIL8:A===Tl&&(W=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Er||A===xs?W=n.DEPTH_COMPONENT24:A===Ki?W=n.DEPTH_COMPONENT32F:A===Tl&&(W=n.DEPTH_COMPONENT16),W}function w(I,A){return p(I)===!0||I.isFramebufferTexture&&I.minFilter!==dn&&I.minFilter!==On?Math.log2(Math.max(A.width,A.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?A.mipmaps.length:1}function E(I){const A=I.target;A.removeEventListener("dispose",E),T(A),A.isVideoTexture&&d.delete(A)}function b(I){const A=I.target;A.removeEventListener("dispose",b),y(A)}function T(I){const A=i.get(I);if(A.__webglInit===void 0)return;const W=I.source,K=h.get(W);if(K){const nt=K[A.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&C(I),Object.keys(K).length===0&&h.delete(W)}i.remove(I)}function C(I){const A=i.get(I);n.deleteTexture(A.__webglTexture);const W=I.source,K=h.get(W);delete K[A.__cacheKey],r.memory.textures--}function y(I){const A=i.get(I);if(I.depthTexture&&I.depthTexture.dispose(),I.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(A.__webglFramebuffer[K]))for(let nt=0;nt<A.__webglFramebuffer[K].length;nt++)n.deleteFramebuffer(A.__webglFramebuffer[K][nt]);else n.deleteFramebuffer(A.__webglFramebuffer[K]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[K])}else{if(Array.isArray(A.__webglFramebuffer))for(let K=0;K<A.__webglFramebuffer.length;K++)n.deleteFramebuffer(A.__webglFramebuffer[K]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let K=0;K<A.__webglColorRenderbuffer.length;K++)A.__webglColorRenderbuffer[K]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[K]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const W=I.textures;for(let K=0,nt=W.length;K<nt;K++){const it=i.get(W[K]);it.__webglTexture&&(n.deleteTexture(it.__webglTexture),r.memory.textures--),i.remove(W[K])}i.remove(I)}let _=0;function R(){_=0}function D(){const I=_;return I>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+o.maxTextures),_+=1,I}function N(I){const A=[];return A.push(I.wrapS),A.push(I.wrapT),A.push(I.wrapR||0),A.push(I.magFilter),A.push(I.minFilter),A.push(I.anisotropy),A.push(I.internalFormat),A.push(I.format),A.push(I.type),A.push(I.generateMipmaps),A.push(I.premultiplyAlpha),A.push(I.flipY),A.push(I.unpackAlignment),A.push(I.colorSpace),A.join()}function z(I,A){const W=i.get(I);if(I.isVideoTexture&&Ht(I),I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){const K=I.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{at(W,I,A);return}}e.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+A)}function B(I,A){const W=i.get(I);if(I.version>0&&W.__version!==I.version){at(W,I,A);return}e.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+A)}function V(I,A){const W=i.get(I);if(I.version>0&&W.__version!==I.version){at(W,I,A);return}e.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+A)}function j(I,A){const W=i.get(I);if(I.version>0&&W.__version!==I.version){X(W,I,A);return}e.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+A)}const Y={[Dt]:n.REPEAT,[ue]:n.CLAMP_TO_EDGE,[ih]:n.MIRRORED_REPEAT},J={[dn]:n.NEAREST,[Ox]:n.NEAREST_MIPMAP_NEAREST,[tc]:n.NEAREST_MIPMAP_LINEAR,[On]:n.LINEAR,[Ad]:n.LINEAR_MIPMAP_NEAREST,[hs]:n.LINEAR_MIPMAP_LINEAR},k={[Zx]:n.NEVER,[t2]:n.ALWAYS,[Kx]:n.LESS,[Yg]:n.LEQUAL,[jx]:n.EQUAL,[$x]:n.GEQUAL,[Jx]:n.GREATER,[Qx]:n.NOTEQUAL};function $(I,A){if(A.type===Ki&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===On||A.magFilter===Ad||A.magFilter===tc||A.magFilter===hs||A.minFilter===On||A.minFilter===Ad||A.minFilter===tc||A.minFilter===hs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(I,n.TEXTURE_WRAP_S,Y[A.wrapS]),n.texParameteri(I,n.TEXTURE_WRAP_T,Y[A.wrapT]),(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)&&n.texParameteri(I,n.TEXTURE_WRAP_R,Y[A.wrapR]),n.texParameteri(I,n.TEXTURE_MAG_FILTER,J[A.magFilter]),n.texParameteri(I,n.TEXTURE_MIN_FILTER,J[A.minFilter]),A.compareFunction&&(n.texParameteri(I,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(I,n.TEXTURE_COMPARE_FUNC,k[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===dn||A.minFilter!==tc&&A.minFilter!==hs||A.type===Ki&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");n.texParameterf(I,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,o.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function mt(I,A){let W=!1;I.__webglInit===void 0&&(I.__webglInit=!0,A.addEventListener("dispose",E));const K=A.source;let nt=h.get(K);nt===void 0&&(nt={},h.set(K,nt));const it=N(A);if(it!==I.__cacheKey){nt[it]===void 0&&(nt[it]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,W=!0),nt[it].usedTimes++;const At=nt[I.__cacheKey];At!==void 0&&(nt[I.__cacheKey].usedTimes--,At.usedTimes===0&&C(A)),I.__cacheKey=it,I.__webglTexture=nt[it].texture}return W}function at(I,A,W){let K=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(K=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(K=n.TEXTURE_3D);const nt=mt(I,A),it=A.source;e.bindTexture(K,I.__webglTexture,n.TEXTURE0+W);const At=i.get(it);if(it.version!==At.__version||nt===!0){e.activeTexture(n.TEXTURE0+W);const gt=ve.getPrimaries(ve.workingColorSpace),pt=A.colorSpace===Ao?null:ve.getPrimaries(A.colorSpace),kt=A.colorSpace===Ao||gt===pt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);let ct=v(A.image,!1,o.maxTextureSize);ct=zt(A,ct);const st=s.convert(A.format,A.colorSpace),Pt=s.convert(A.type);let _t=S(A.internalFormat,st,Pt,A.colorSpace,A.isVideoTexture);$(K,A);let ut;const Xt=A.mipmaps,jt=A.isVideoTexture!==!0,he=At.__version===void 0||nt===!0,F=it.dataReady,vt=w(A,ct);if(A.isDepthTexture)_t=x(A.format===Ss,A.type),he&&(jt?e.texStorage2D(n.TEXTURE_2D,1,_t,ct.width,ct.height):e.texImage2D(n.TEXTURE_2D,0,_t,ct.width,ct.height,0,st,Pt,null));else if(A.isDataTexture)if(Xt.length>0){jt&&he&&e.texStorage2D(n.TEXTURE_2D,vt,_t,Xt[0].width,Xt[0].height);for(let Q=0,et=Xt.length;Q<et;Q++)ut=Xt[Q],jt?F&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,ut.width,ut.height,st,Pt,ut.data):e.texImage2D(n.TEXTURE_2D,Q,_t,ut.width,ut.height,0,st,Pt,ut.data);A.generateMipmaps=!1}else jt?(he&&e.texStorage2D(n.TEXTURE_2D,vt,_t,ct.width,ct.height),F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ct.width,ct.height,st,Pt,ct.data)):e.texImage2D(n.TEXTURE_2D,0,_t,ct.width,ct.height,0,st,Pt,ct.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){jt&&he&&e.texStorage3D(n.TEXTURE_2D_ARRAY,vt,_t,Xt[0].width,Xt[0].height,ct.depth);for(let Q=0,et=Xt.length;Q<et;Q++)if(ut=Xt[Q],A.format!==fi)if(st!==null)if(jt){if(F)if(A.layerUpdates.size>0){for(const dt of A.layerUpdates){const Yt=ut.width*ut.height;e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,dt,ut.width,ut.height,1,st,ut.data.slice(Yt*dt,Yt*(dt+1)),0,0)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ut.width,ut.height,ct.depth,st,ut.data,0,0)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,_t,ut.width,ut.height,ct.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else jt?F&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ut.width,ut.height,ct.depth,st,Pt,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,Q,_t,ut.width,ut.height,ct.depth,0,st,Pt,ut.data)}else{jt&&he&&e.texStorage2D(n.TEXTURE_2D,vt,_t,Xt[0].width,Xt[0].height);for(let Q=0,et=Xt.length;Q<et;Q++)ut=Xt[Q],A.format!==fi?st!==null?jt?F&&e.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,ut.width,ut.height,st,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,Q,_t,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):jt?F&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,ut.width,ut.height,st,Pt,ut.data):e.texImage2D(n.TEXTURE_2D,Q,_t,ut.width,ut.height,0,st,Pt,ut.data)}else if(A.isDataArrayTexture)if(jt){if(he&&e.texStorage3D(n.TEXTURE_2D_ARRAY,vt,_t,ct.width,ct.height,ct.depth),F)if(A.layerUpdates.size>0){let Q;switch(Pt){case n.UNSIGNED_BYTE:switch(st){case n.ALPHA:Q=1;break;case n.LUMINANCE:Q=1;break;case n.LUMINANCE_ALPHA:Q=2;break;case n.RGB:Q=3;break;case n.RGBA:Q=4;break;default:throw new Error(`Unknown texel size for format ${st}.`)}break;case n.UNSIGNED_SHORT_4_4_4_4:case n.UNSIGNED_SHORT_5_5_5_1:case n.UNSIGNED_SHORT_5_6_5:Q=1;break;default:throw new Error(`Unknown texel size for type ${Pt}.`)}const et=ct.width*ct.height*Q;for(const dt of A.layerUpdates)e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,dt,ct.width,ct.height,1,st,Pt,ct.data.slice(et*dt,et*(dt+1)));A.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ct.width,ct.height,ct.depth,st,Pt,ct.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,_t,ct.width,ct.height,ct.depth,0,st,Pt,ct.data);else if(A.isData3DTexture)jt?(he&&e.texStorage3D(n.TEXTURE_3D,vt,_t,ct.width,ct.height,ct.depth),F&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ct.width,ct.height,ct.depth,st,Pt,ct.data)):e.texImage3D(n.TEXTURE_3D,0,_t,ct.width,ct.height,ct.depth,0,st,Pt,ct.data);else if(A.isFramebufferTexture){if(he)if(jt)e.texStorage2D(n.TEXTURE_2D,vt,_t,ct.width,ct.height);else{let Q=ct.width,et=ct.height;for(let dt=0;dt<vt;dt++)e.texImage2D(n.TEXTURE_2D,dt,_t,Q,et,0,st,Pt,null),Q>>=1,et>>=1}}else if(Xt.length>0){if(jt&&he){const Q=_e(Xt[0]);e.texStorage2D(n.TEXTURE_2D,vt,_t,Q.width,Q.height)}for(let Q=0,et=Xt.length;Q<et;Q++)ut=Xt[Q],jt?F&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,st,Pt,ut):e.texImage2D(n.TEXTURE_2D,Q,_t,st,Pt,ut);A.generateMipmaps=!1}else if(jt){if(he){const Q=_e(ct);e.texStorage2D(n.TEXTURE_2D,vt,_t,Q.width,Q.height)}F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,st,Pt,ct)}else e.texImage2D(n.TEXTURE_2D,0,_t,st,Pt,ct);p(A)&&g(K),At.__version=it.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function X(I,A,W){if(A.image.length!==6)return;const K=mt(I,A),nt=A.source;e.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+W);const it=i.get(nt);if(nt.version!==it.__version||K===!0){e.activeTexture(n.TEXTURE0+W);const At=ve.getPrimaries(ve.workingColorSpace),gt=A.colorSpace===Ao?null:ve.getPrimaries(A.colorSpace),pt=A.colorSpace===Ao||At===gt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const kt=A.isCompressedTexture||A.image[0].isCompressedTexture,ct=A.image[0]&&A.image[0].isDataTexture,st=[];for(let et=0;et<6;et++)!kt&&!ct?st[et]=v(A.image[et],!0,o.maxCubemapSize):st[et]=ct?A.image[et].image:A.image[et],st[et]=zt(A,st[et]);const Pt=st[0],_t=s.convert(A.format,A.colorSpace),ut=s.convert(A.type),Xt=S(A.internalFormat,_t,ut,A.colorSpace),jt=A.isVideoTexture!==!0,he=it.__version===void 0||K===!0,F=nt.dataReady;let vt=w(A,Pt);$(n.TEXTURE_CUBE_MAP,A);let Q;if(kt){jt&&he&&e.texStorage2D(n.TEXTURE_CUBE_MAP,vt,Xt,Pt.width,Pt.height);for(let et=0;et<6;et++){Q=st[et].mipmaps;for(let dt=0;dt<Q.length;dt++){const Yt=Q[dt];A.format!==fi?_t!==null?jt?F&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,dt,0,0,Yt.width,Yt.height,_t,Yt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,dt,Xt,Yt.width,Yt.height,0,Yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):jt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,dt,0,0,Yt.width,Yt.height,_t,ut,Yt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,dt,Xt,Yt.width,Yt.height,0,_t,ut,Yt.data)}}}else{if(Q=A.mipmaps,jt&&he){Q.length>0&&vt++;const et=_e(st[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,vt,Xt,et.width,et.height)}for(let et=0;et<6;et++)if(ct){jt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,st[et].width,st[et].height,_t,ut,st[et].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Xt,st[et].width,st[et].height,0,_t,ut,st[et].data);for(let dt=0;dt<Q.length;dt++){const le=Q[dt].image[et].image;jt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,dt+1,0,0,le.width,le.height,_t,ut,le.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,dt+1,Xt,le.width,le.height,0,_t,ut,le.data)}}else{jt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,_t,ut,st[et]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Xt,_t,ut,st[et]);for(let dt=0;dt<Q.length;dt++){const Yt=Q[dt];jt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,dt+1,0,0,_t,ut,Yt.image[et]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,dt+1,Xt,_t,ut,Yt.image[et])}}}p(A)&&g(n.TEXTURE_CUBE_MAP),it.__version=nt.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function tt(I,A,W,K,nt,it){const At=s.convert(W.format,W.colorSpace),gt=s.convert(W.type),pt=S(W.internalFormat,At,gt,W.colorSpace);if(!i.get(A).__hasExternalTextures){const ct=Math.max(1,A.width>>it),st=Math.max(1,A.height>>it);nt===n.TEXTURE_3D||nt===n.TEXTURE_2D_ARRAY?e.texImage3D(nt,it,pt,ct,st,A.depth,0,At,gt,null):e.texImage2D(nt,it,pt,ct,st,0,At,gt,null)}e.bindFramebuffer(n.FRAMEBUFFER,I),Kt(A)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,K,nt,i.get(W).__webglTexture,0,bt(A)):(nt===n.TEXTURE_2D||nt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,K,nt,i.get(W).__webglTexture,it),e.bindFramebuffer(n.FRAMEBUFFER,null)}function ft(I,A,W){if(n.bindRenderbuffer(n.RENDERBUFFER,I),A.depthBuffer){const K=A.depthTexture,nt=K&&K.isDepthTexture?K.type:null,it=x(A.stencilBuffer,nt),At=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,gt=bt(A);Kt(A)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,gt,it,A.width,A.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,gt,it,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,it,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,At,n.RENDERBUFFER,I)}else{const K=A.textures;for(let nt=0;nt<K.length;nt++){const it=K[nt],At=s.convert(it.format,it.colorSpace),gt=s.convert(it.type),pt=S(it.internalFormat,At,gt,it.colorSpace),kt=bt(A);W&&Kt(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,kt,pt,A.width,A.height):Kt(A)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,kt,pt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,pt,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ot(I,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,I),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(A.depthTexture).__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),z(A.depthTexture,0);const K=i.get(A.depthTexture).__webglTexture,nt=bt(A);if(A.depthTexture.format===xr)Kt(A)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,K,0,nt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,K,0);else if(A.depthTexture.format===Ss)Kt(A)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,K,0,nt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function Nt(I){const A=i.get(I),W=I.isWebGLCubeRenderTarget===!0;if(I.depthTexture&&!A.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");ot(A.__webglFramebuffer,I)}else if(W){A.__webglDepthbuffer=[];for(let K=0;K<6;K++)e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[K]),A.__webglDepthbuffer[K]=n.createRenderbuffer(),ft(A.__webglDepthbuffer[K],I,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer=n.createRenderbuffer(),ft(A.__webglDepthbuffer,I,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function Et(I,A,W){const K=i.get(I);A!==void 0&&tt(K.__webglFramebuffer,I,I.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&Nt(I)}function Vt(I){const A=I.texture,W=i.get(I),K=i.get(A);I.addEventListener("dispose",b);const nt=I.textures,it=I.isWebGLCubeRenderTarget===!0,At=nt.length>1;if(At||(K.__webglTexture===void 0&&(K.__webglTexture=n.createTexture()),K.__version=A.version,r.memory.textures++),it){W.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(A.mipmaps&&A.mipmaps.length>0){W.__webglFramebuffer[gt]=[];for(let pt=0;pt<A.mipmaps.length;pt++)W.__webglFramebuffer[gt][pt]=n.createFramebuffer()}else W.__webglFramebuffer[gt]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){W.__webglFramebuffer=[];for(let gt=0;gt<A.mipmaps.length;gt++)W.__webglFramebuffer[gt]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(At)for(let gt=0,pt=nt.length;gt<pt;gt++){const kt=i.get(nt[gt]);kt.__webglTexture===void 0&&(kt.__webglTexture=n.createTexture(),r.memory.textures++)}if(I.samples>0&&Kt(I)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let gt=0;gt<nt.length;gt++){const pt=nt[gt];W.__webglColorRenderbuffer[gt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[gt]);const kt=s.convert(pt.format,pt.colorSpace),ct=s.convert(pt.type),st=S(pt.internalFormat,kt,ct,pt.colorSpace,I.isXRRenderTarget===!0),Pt=bt(I);n.renderbufferStorageMultisample(n.RENDERBUFFER,Pt,st,I.width,I.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.RENDERBUFFER,W.__webglColorRenderbuffer[gt])}n.bindRenderbuffer(n.RENDERBUFFER,null),I.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),ft(W.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(it){e.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture),$(n.TEXTURE_CUBE_MAP,A);for(let gt=0;gt<6;gt++)if(A.mipmaps&&A.mipmaps.length>0)for(let pt=0;pt<A.mipmaps.length;pt++)tt(W.__webglFramebuffer[gt][pt],I,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+gt,pt);else tt(W.__webglFramebuffer[gt],I,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);p(A)&&g(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(At){for(let gt=0,pt=nt.length;gt<pt;gt++){const kt=nt[gt],ct=i.get(kt);e.bindTexture(n.TEXTURE_2D,ct.__webglTexture),$(n.TEXTURE_2D,kt),tt(W.__webglFramebuffer,I,kt,n.COLOR_ATTACHMENT0+gt,n.TEXTURE_2D,0),p(kt)&&g(n.TEXTURE_2D)}e.unbindTexture()}else{let gt=n.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(gt=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(gt,K.__webglTexture),$(gt,A),A.mipmaps&&A.mipmaps.length>0)for(let pt=0;pt<A.mipmaps.length;pt++)tt(W.__webglFramebuffer[pt],I,A,n.COLOR_ATTACHMENT0,gt,pt);else tt(W.__webglFramebuffer,I,A,n.COLOR_ATTACHMENT0,gt,0);p(A)&&g(gt),e.unbindTexture()}I.depthBuffer&&Nt(I)}function O(I){const A=I.textures;for(let W=0,K=A.length;W<K;W++){const nt=A[W];if(p(nt)){const it=I.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,At=i.get(nt).__webglTexture;e.bindTexture(it,At),g(it),e.unbindTexture()}}}const Ut=[],Rt=[];function ie(I){if(I.samples>0){if(Kt(I)===!1){const A=I.textures,W=I.width,K=I.height;let nt=n.COLOR_BUFFER_BIT;const it=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,At=i.get(I),gt=A.length>1;if(gt)for(let pt=0;pt<A.length;pt++)e.bindFramebuffer(n.FRAMEBUFFER,At.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,At.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,At.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,At.__webglFramebuffer);for(let pt=0;pt<A.length;pt++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(nt|=n.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(nt|=n.STENCIL_BUFFER_BIT)),gt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,At.__webglColorRenderbuffer[pt]);const kt=i.get(A[pt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,kt,0)}n.blitFramebuffer(0,0,W,K,0,0,W,K,nt,n.NEAREST),c===!0&&(Ut.length=0,Rt.length=0,Ut.push(n.COLOR_ATTACHMENT0+pt),I.depthBuffer&&I.resolveDepthBuffer===!1&&(Ut.push(it),Rt.push(it),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Rt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ut))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),gt)for(let pt=0;pt<A.length;pt++){e.bindFramebuffer(n.FRAMEBUFFER,At.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.RENDERBUFFER,At.__webglColorRenderbuffer[pt]);const kt=i.get(A[pt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,At.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.TEXTURE_2D,kt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,At.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){const A=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function bt(I){return Math.min(o.maxSamples,I.samples)}function Kt(I){const A=i.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Ht(I){const A=r.render.frame;d.get(I)!==A&&(d.set(I,A),I.update())}function zt(I,A){const W=I.colorSpace,K=I.format,nt=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||W!==Fo&&W!==Ao&&(ve.getTransfer(W)===Ce?(K!==fi||nt!==to)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),A}function _e(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=R,this.setTexture2D=z,this.setTexture2DArray=B,this.setTexture3D=V,this.setTextureCube=j,this.rebindTextures=Et,this.setupRenderTarget=Vt,this.updateRenderTargetMipmap=O,this.updateMultisampleRenderTarget=ie,this.setupDepthRenderbuffer=Nt,this.setupFrameBufferTexture=tt,this.useMultisampledRTT=Kt}function my(n,t){function e(i,o=Ao){let s;const r=ve.getTransfer(o);if(i===to)return n.UNSIGNED_BYTE;if(i===Hg)return n.UNSIGNED_SHORT_4_4_4_4;if(i===kg)return n.UNSIGNED_SHORT_5_5_5_1;if(i===zx)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ux)return n.BYTE;if(i===Fx)return n.SHORT;if(i===Tl)return n.UNSIGNED_SHORT;if(i===Bg)return n.INT;if(i===Er)return n.UNSIGNED_INT;if(i===Ki)return n.FLOAT;if(i===Gn)return n.HALF_FLOAT;if(i===Bx)return n.ALPHA;if(i===Hx)return n.RGB;if(i===fi)return n.RGBA;if(i===kx)return n.LUMINANCE;if(i===Wx)return n.LUMINANCE_ALPHA;if(i===xr)return n.DEPTH_COMPONENT;if(i===Ss)return n.DEPTH_STENCIL;if(i===Wg)return n.RED;if(i===Gg)return n.RED_INTEGER;if(i===Gx)return n.RG;if(i===Vg)return n.RG_INTEGER;if(i===Xg)return n.RGBA_INTEGER;if(i===Cd||i===Rd||i===Pd||i===Ld)if(r===Ce)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Cd)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Rd)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Pd)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ld)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Cd)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Rd)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Pd)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ld)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Pf||i===Lf||i===Df||i===If)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Pf)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Lf)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Df)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===If)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Nf||i===Of||i===Uf)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Nf||i===Of)return r===Ce?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Uf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ff||i===zf||i===Bf||i===Hf||i===kf||i===Wf||i===Gf||i===Vf||i===Xf||i===Yf||i===qf||i===Zf||i===Kf||i===jf)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ff)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===zf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Bf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Hf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===kf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Wf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Gf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Vf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Xf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Yf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===qf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Zf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Kf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===jf)return r===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Dd||i===Jf||i===Qf)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Dd)return r===Ce?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Jf)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Qf)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Vx||i===$f||i===tp||i===ep)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Dd)return s.COMPRESSED_RED_RGTC1_EXT;if(i===$f)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===tp)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ep)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===xs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class gy extends Cn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Bt extends ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const vy={type:"move"};class iu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new M,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new M),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new M,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new M),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let o=null,s=null,r=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const v of t.hand.values()){const p=e.getJointPose(v,i),g=this._getHandJoint(l,v);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&h>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(o=e.getPose(t.targetRaySpace,i),o===null&&s!==null&&(o=s),o!==null&&(a.matrix.fromArray(o.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,o.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(o.linearVelocity)):a.hasLinearVelocity=!1,o.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(o.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(vy)))}return a!==null&&(a.visible=o!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Bt;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const xy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Sy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class _y{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const o=new un,s=t.properties.get(o);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=o}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new de({vertexShader:xy,fragmentShader:Sy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new L(new qt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class My extends ws{constructor(t,e){super();const i=this;let o=null,s=1,r=null,a="local-floor",c=1,l=null,d=null,u=null,h=null,f=null,m=null;const v=new _y,p=e.getContextAttributes();let g=null,S=null;const x=[],w=[],E=new rt;let b=null;const T=new Cn;T.layers.enable(1),T.viewport=new Ne;const C=new Cn;C.layers.enable(2),C.viewport=new Ne;const y=[T,C],_=new gy;_.layers.enable(1),_.layers.enable(2);let R=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let tt=x[X];return tt===void 0&&(tt=new iu,x[X]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(X){let tt=x[X];return tt===void 0&&(tt=new iu,x[X]=tt),tt.getGripSpace()},this.getHand=function(X){let tt=x[X];return tt===void 0&&(tt=new iu,x[X]=tt),tt.getHandSpace()};function N(X){const tt=w.indexOf(X.inputSource);if(tt===-1)return;const ft=x[tt];ft!==void 0&&(ft.update(X.inputSource,X.frame,l||r),ft.dispatchEvent({type:X.type,data:X.inputSource}))}function z(){o.removeEventListener("select",N),o.removeEventListener("selectstart",N),o.removeEventListener("selectend",N),o.removeEventListener("squeeze",N),o.removeEventListener("squeezestart",N),o.removeEventListener("squeezeend",N),o.removeEventListener("end",z),o.removeEventListener("inputsourceschange",B);for(let X=0;X<x.length;X++){const tt=w[X];tt!==null&&(w[X]=null,x[X].disconnect(tt))}R=null,D=null,v.reset(),t.setRenderTarget(g),f=null,h=null,u=null,o=null,S=null,at.stop(),i.isPresenting=!1,t.setPixelRatio(b),t.setSize(E.width,E.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return o},this.setSession=async function(X){if(o=X,o!==null){if(g=t.getRenderTarget(),o.addEventListener("select",N),o.addEventListener("selectstart",N),o.addEventListener("selectend",N),o.addEventListener("squeeze",N),o.addEventListener("squeezestart",N),o.addEventListener("squeezeend",N),o.addEventListener("end",z),o.addEventListener("inputsourceschange",B),p.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(E),o.renderState.layers===void 0){const tt={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(o,e,tt),o.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new wn(f.framebufferWidth,f.framebufferHeight,{format:fi,type:to,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil})}else{let tt=null,ft=null,ot=null;p.depth&&(ot=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=p.stencil?Ss:xr,ft=p.stencil?xs:Er);const Nt={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:s};u=new XRWebGLBinding(o,e),h=u.createProjectionLayer(Nt),o.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),S=new wn(h.textureWidth,h.textureHeight,{format:fi,type:to,depthTexture:new Kh(h.textureWidth,h.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await o.requestReferenceSpace(a),at.setContext(o),at.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode};function B(X){for(let tt=0;tt<X.removed.length;tt++){const ft=X.removed[tt],ot=w.indexOf(ft);ot>=0&&(w[ot]=null,x[ot].disconnect(ft))}for(let tt=0;tt<X.added.length;tt++){const ft=X.added[tt];let ot=w.indexOf(ft);if(ot===-1){for(let Et=0;Et<x.length;Et++)if(Et>=w.length){w.push(ft),ot=Et;break}else if(w[Et]===null){w[Et]=ft,ot=Et;break}if(ot===-1)break}const Nt=x[ot];Nt&&Nt.connect(ft)}}const V=new M,j=new M;function Y(X,tt,ft){V.setFromMatrixPosition(tt.matrixWorld),j.setFromMatrixPosition(ft.matrixWorld);const ot=V.distanceTo(j),Nt=tt.projectionMatrix.elements,Et=ft.projectionMatrix.elements,Vt=Nt[14]/(Nt[10]-1),O=Nt[14]/(Nt[10]+1),Ut=(Nt[9]+1)/Nt[5],Rt=(Nt[9]-1)/Nt[5],ie=(Nt[8]-1)/Nt[0],bt=(Et[8]+1)/Et[0],Kt=Vt*ie,Ht=Vt*bt,zt=ot/(-ie+bt),_e=zt*-ie;tt.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(_e),X.translateZ(zt),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const I=Vt+zt,A=O+zt,W=Kt-_e,K=Ht+(ot-_e),nt=Ut*O/A*I,it=Rt*O/A*I;X.projectionMatrix.makePerspective(W,K,nt,it,I,A),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function J(X,tt){tt===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(tt.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(o===null)return;v.texture!==null&&(X.near=v.depthNear,X.far=v.depthFar),_.near=C.near=T.near=X.near,_.far=C.far=T.far=X.far,(R!==_.near||D!==_.far)&&(o.updateRenderState({depthNear:_.near,depthFar:_.far}),R=_.near,D=_.far,T.near=R,T.far=D,C.near=R,C.far=D,T.updateProjectionMatrix(),C.updateProjectionMatrix(),X.updateProjectionMatrix());const tt=X.parent,ft=_.cameras;J(_,tt);for(let ot=0;ot<ft.length;ot++)J(ft[ot],tt);ft.length===2?Y(_,T,C):_.projectionMatrix.copy(T.projectionMatrix),k(X,_,tt)};function k(X,tt,ft){ft===null?X.matrix.copy(tt.matrixWorld):(X.matrix.copy(ft.matrixWorld),X.matrix.invert(),X.matrix.multiply(tt.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(tt.projectionMatrix),X.projectionMatrixInverse.copy(tt.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Ar*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function(X){c=X,h!==null&&(h.fixedFoveation=X),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=X)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(_)};let $=null;function mt(X,tt){if(d=tt.getViewerPose(l||r),m=tt,d!==null){const ft=d.views;f!==null&&(t.setRenderTargetFramebuffer(S,f.framebuffer),t.setRenderTarget(S));let ot=!1;ft.length!==_.cameras.length&&(_.cameras.length=0,ot=!0);for(let Et=0;Et<ft.length;Et++){const Vt=ft[Et];let O=null;if(f!==null)O=f.getViewport(Vt);else{const Rt=u.getViewSubImage(h,Vt);O=Rt.viewport,Et===0&&(t.setRenderTargetTextures(S,Rt.colorTexture,h.ignoreDepthValues?void 0:Rt.depthStencilTexture),t.setRenderTarget(S))}let Ut=y[Et];Ut===void 0&&(Ut=new Cn,Ut.layers.enable(Et),Ut.viewport=new Ne,y[Et]=Ut),Ut.matrix.fromArray(Vt.transform.matrix),Ut.matrix.decompose(Ut.position,Ut.quaternion,Ut.scale),Ut.projectionMatrix.fromArray(Vt.projectionMatrix),Ut.projectionMatrixInverse.copy(Ut.projectionMatrix).invert(),Ut.viewport.set(O.x,O.y,O.width,O.height),Et===0&&(_.matrix.copy(Ut.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ot===!0&&_.cameras.push(Ut)}const Nt=o.enabledFeatures;if(Nt&&Nt.includes("depth-sensing")){const Et=u.getDepthInformation(ft[0]);Et&&Et.isValid&&Et.texture&&v.init(t,Et,o.renderState)}}for(let ft=0;ft<x.length;ft++){const ot=w[ft],Nt=x[ft];ot!==null&&Nt!==void 0&&Nt.update(ot,tt,l||r)}$&&$(X,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),m=null}const at=new nv;at.setAnimationLoop(mt),this.setAnimationLoop=function(X){$=X},this.dispose=function(){}}}const $o=new Je,wy=new Lt;function yy(n,t){function e(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function i(p,g){g.color.getRGB(p.fogColor.value,$g(n)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function o(p,g,S,x,w){g.isMeshBasicMaterial||g.isMeshLambertMaterial?s(p,g):g.isMeshToonMaterial?(s(p,g),u(p,g)):g.isMeshPhongMaterial?(s(p,g),d(p,g)):g.isMeshStandardMaterial?(s(p,g),h(p,g),g.isMeshPhysicalMaterial&&f(p,g,w)):g.isMeshMatcapMaterial?(s(p,g),m(p,g)):g.isMeshDepthMaterial?s(p,g):g.isMeshDistanceMaterial?(s(p,g),v(p,g)):g.isMeshNormalMaterial?s(p,g):g.isLineBasicMaterial?(r(p,g),g.isLineDashedMaterial&&a(p,g)):g.isPointsMaterial?c(p,g,S,x):g.isSpriteMaterial?l(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,e(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,e(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===je&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,e(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===je&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,e(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,e(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);const S=t.get(g),x=S.envMap,w=S.envMapRotation;x&&(p.envMap.value=x,$o.copy(w),$o.x*=-1,$o.y*=-1,$o.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&($o.y*=-1,$o.z*=-1),p.envMapRotation.value.setFromMatrix4(wy.makeRotationFromEuler($o)),p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,p.aoMapTransform))}function r(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,e(g.map,p.mapTransform))}function a(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function c(p,g,S,x){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*S,p.scale.value=x*.5,g.map&&(p.map.value=g.map,e(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function l(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,e(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function d(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function u(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function h(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function f(p,g,S){p.ior.value=g.ior,g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===je&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function v(p,g){const S=t.get(g).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:o}}function by(n,t,e,i){let o={},s={},r=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,x){const w=x.program;i.uniformBlockBinding(S,w)}function l(S,x){let w=o[S.id];w===void 0&&(m(S),w=d(S),o[S.id]=w,S.addEventListener("dispose",p));const E=x.program;i.updateUBOMapping(S,E);const b=t.render.frame;s[S.id]!==b&&(h(S),s[S.id]=b)}function d(S){const x=u();S.__bindingPointIndex=x;const w=n.createBuffer(),E=S.__size,b=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,E,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,w),w}function u(){for(let S=0;S<a;S++)if(r.indexOf(S)===-1)return r.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){const x=o[S.id],w=S.uniforms,E=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let b=0,T=w.length;b<T;b++){const C=Array.isArray(w[b])?w[b]:[w[b]];for(let y=0,_=C.length;y<_;y++){const R=C[y];if(f(R,b,y,E)===!0){const D=R.__offset,N=Array.isArray(R.value)?R.value:[R.value];let z=0;for(let B=0;B<N.length;B++){const V=N[B],j=v(V);typeof V=="number"||typeof V=="boolean"?(R.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,D+z,R.__data)):V.isMatrix3?(R.__data[0]=V.elements[0],R.__data[1]=V.elements[1],R.__data[2]=V.elements[2],R.__data[3]=0,R.__data[4]=V.elements[3],R.__data[5]=V.elements[4],R.__data[6]=V.elements[5],R.__data[7]=0,R.__data[8]=V.elements[6],R.__data[9]=V.elements[7],R.__data[10]=V.elements[8],R.__data[11]=0):(V.toArray(R.__data,z),z+=j.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,D,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(S,x,w,E){const b=S.value,T=x+"_"+w;if(E[T]===void 0)return typeof b=="number"||typeof b=="boolean"?E[T]=b:E[T]=b.clone(),!0;{const C=E[T];if(typeof b=="number"||typeof b=="boolean"){if(C!==b)return E[T]=b,!0}else if(C.equals(b)===!1)return C.copy(b),!0}return!1}function m(S){const x=S.uniforms;let w=0;const E=16;for(let T=0,C=x.length;T<C;T++){const y=Array.isArray(x[T])?x[T]:[x[T]];for(let _=0,R=y.length;_<R;_++){const D=y[_],N=Array.isArray(D.value)?D.value:[D.value];for(let z=0,B=N.length;z<B;z++){const V=N[z],j=v(V),Y=w%E;Y!==0&&E-Y<j.boundary&&(w+=E-Y),D.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=w,w+=j.storage}}}const b=w%E;return b>0&&(w+=E-b),S.__size=w,S.__cache={},this}function v(S){const x={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(x.boundary=4,x.storage=4):S.isVector2?(x.boundary=8,x.storage=8):S.isVector3||S.isColor?(x.boundary=16,x.storage=12):S.isVector4?(x.boundary=16,x.storage=16):S.isMatrix3?(x.boundary=48,x.storage=48):S.isMatrix4?(x.boundary=64,x.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),x}function p(S){const x=S.target;x.removeEventListener("dispose",p);const w=r.indexOf(x.__bindingPointIndex);r.splice(w,1),n.deleteBuffer(o[x.id]),delete o[x.id],delete s[x.id]}function g(){for(const S in o)n.deleteBuffer(o[S]);r=[],o={},s={}}return{bind:c,update:l,dispose:g}}class Ty{constructor(t={}){const{canvas:e=x2(),context:i=null,depth:o=!0,stencil:s=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let h;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=i.getContextAttributes().alpha}else h=r;const f=new Uint32Array(4),m=new Int32Array(4);let v=null,p=null;const g=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ke,this.toneMapping=Do,this.toneMappingExposure=1;const x=this;let w=!1,E=0,b=0,T=null,C=-1,y=null;const _=new Ne,R=new Ne;let D=null;const N=new St(0);let z=0,B=e.width,V=e.height,j=1,Y=null,J=null;const k=new Ne(0,0,B,V),$=new Ne(0,0,B,V);let mt=!1;const at=new od;let X=!1,tt=!1;const ft=new Lt,ot=new M,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Et=!1;function Vt(){return T===null?j:1}let O=i;function Ut(P,H){return e.getContext(P,H)}try{const P={alpha:!0,depth:o,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Hh}`),e.addEventListener("webglcontextlost",vt,!1),e.addEventListener("webglcontextrestored",Q,!1),e.addEventListener("webglcontextcreationerror",et,!1),O===null){const H="webgl2";if(O=Ut(H,P),O===null)throw Ut(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let Rt,ie,bt,Kt,Ht,zt,_e,I,A,W,K,nt,it,At,gt,pt,kt,ct,st,Pt,_t,ut,Xt,jt;function he(){Rt=new IM(O),Rt.init(),ut=new my(O,Rt),ie=new AM(O,Rt,t,ut),bt=new fy(O),Kt=new UM(O),Ht=new $w,zt=new py(O,Rt,bt,Ht,ie,ut,Kt),_e=new RM(x),I=new DM(x),A=new G2(O),Xt=new TM(O,A),W=new NM(O,A,Kt,Xt),K=new zM(O,W,A,Kt),st=new FM(O,ie,zt),pt=new CM(Ht),nt=new Qw(x,_e,I,Rt,ie,Xt,pt),it=new yy(x,Ht),At=new ey,gt=new ay(Rt),ct=new bM(x,_e,I,bt,K,h,c),kt=new hy(x,K,ie),jt=new by(O,Kt,ie,bt),Pt=new EM(O,Rt,Kt),_t=new OM(O,Rt,Kt),Kt.programs=nt.programs,x.capabilities=ie,x.extensions=Rt,x.properties=Ht,x.renderLists=At,x.shadowMap=kt,x.state=bt,x.info=Kt}he();const F=new My(x,O);this.xr=F,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const P=Rt.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Rt.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(P){P!==void 0&&(j=P,this.setSize(B,V,!1))},this.getSize=function(P){return P.set(B,V)},this.setSize=function(P,H,q=!0){if(F.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=P,V=H,e.width=Math.floor(P*j),e.height=Math.floor(H*j),q===!0&&(e.style.width=P+"px",e.style.height=H+"px"),this.setViewport(0,0,P,H)},this.getDrawingBufferSize=function(P){return P.set(B*j,V*j).floor()},this.setDrawingBufferSize=function(P,H,q){B=P,V=H,j=q,e.width=Math.floor(P*q),e.height=Math.floor(H*q),this.setViewport(0,0,P,H)},this.getCurrentViewport=function(P){return P.copy(_)},this.getViewport=function(P){return P.copy(k)},this.setViewport=function(P,H,q,Z){P.isVector4?k.set(P.x,P.y,P.z,P.w):k.set(P,H,q,Z),bt.viewport(_.copy(k).multiplyScalar(j).round())},this.getScissor=function(P){return P.copy($)},this.setScissor=function(P,H,q,Z){P.isVector4?$.set(P.x,P.y,P.z,P.w):$.set(P,H,q,Z),bt.scissor(R.copy($).multiplyScalar(j).round())},this.getScissorTest=function(){return mt},this.setScissorTest=function(P){bt.setScissorTest(mt=P)},this.setOpaqueSort=function(P){Y=P},this.setTransparentSort=function(P){J=P},this.getClearColor=function(P){return P.copy(ct.getClearColor())},this.setClearColor=function(){ct.setClearColor.apply(ct,arguments)},this.getClearAlpha=function(){return ct.getClearAlpha()},this.setClearAlpha=function(){ct.setClearAlpha.apply(ct,arguments)},this.clear=function(P=!0,H=!0,q=!0){let Z=0;if(P){let G=!1;if(T!==null){const ht=T.texture.format;G=ht===Xg||ht===Vg||ht===Gg}if(G){const ht=T.texture.type,Mt=ht===to||ht===Er||ht===Tl||ht===xs||ht===Hg||ht===kg,Tt=ct.getClearColor(),Ct=ct.getClearAlpha(),Zt=Tt.r,Jt=Tt.g,Wt=Tt.b;Mt?(f[0]=Zt,f[1]=Jt,f[2]=Wt,f[3]=Ct,O.clearBufferuiv(O.COLOR,0,f)):(m[0]=Zt,m[1]=Jt,m[2]=Wt,m[3]=Ct,O.clearBufferiv(O.COLOR,0,m))}else Z|=O.COLOR_BUFFER_BIT}H&&(Z|=O.DEPTH_BUFFER_BIT),q&&(Z|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",vt,!1),e.removeEventListener("webglcontextrestored",Q,!1),e.removeEventListener("webglcontextcreationerror",et,!1),At.dispose(),gt.dispose(),Ht.dispose(),_e.dispose(),I.dispose(),K.dispose(),Xt.dispose(),jt.dispose(),nt.dispose(),F.dispose(),F.removeEventListener("sessionstart",Yn),F.removeEventListener("sessionend",qn),Yo.stop()};function vt(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Q(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const P=Kt.autoReset,H=kt.enabled,q=kt.autoUpdate,Z=kt.needsUpdate,G=kt.type;he(),Kt.autoReset=P,kt.enabled=H,kt.autoUpdate=q,kt.needsUpdate=Z,kt.type=G}function et(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function dt(P){const H=P.target;H.removeEventListener("dispose",dt),Yt(H)}function Yt(P){le(P),Ht.remove(P)}function le(P){const H=Ht.get(P).programs;H!==void 0&&(H.forEach(function(q){nt.releaseProgram(q)}),P.isShaderMaterial&&nt.releaseShaderCache(P))}this.renderBufferDirect=function(P,H,q,Z,G,ht){H===null&&(H=Nt);const Mt=G.isMesh&&G.matrixWorld.determinant()<0,Tt=sx(P,H,q,Z,G);bt.setMaterial(Z,Mt);let Ct=q.index,Zt=1;if(Z.wireframe===!0){if(Ct=W.getWireframeAttribute(q),Ct===void 0)return;Zt=2}const Jt=q.drawRange,Wt=q.attributes.position;let ge=Jt.start*Zt,Ue=(Jt.start+Jt.count)*Zt;ht!==null&&(ge=Math.max(ge,ht.start*Zt),Ue=Math.min(Ue,(ht.start+ht.count)*Zt)),Ct!==null?(ge=Math.max(ge,0),Ue=Math.min(Ue,Ct.count)):Wt!=null&&(ge=Math.max(ge,0),Ue=Math.min(Ue,Wt.count));const Fe=Ue-ge;if(Fe<0||Fe===1/0)return;Xt.setup(G,Z,Tt,q,Ct);let Un,Me=Pt;if(Ct!==null&&(Un=A.get(Ct),Me=_t,Me.setIndex(Un)),G.isMesh)Z.wireframe===!0?(bt.setLineWidth(Z.wireframeLinewidth*Vt()),Me.setMode(O.LINES)):Me.setMode(O.TRIANGLES);else if(G.isLine){let Ot=Z.linewidth;Ot===void 0&&(Ot=1),bt.setLineWidth(Ot*Vt()),G.isLineSegments?Me.setMode(O.LINES):G.isLineLoop?Me.setMode(O.LINE_LOOP):Me.setMode(O.LINE_STRIP)}else G.isPoints?Me.setMode(O.POINTS):G.isSprite&&Me.setMode(O.TRIANGLES);if(G.isBatchedMesh)G._multiDrawInstances!==null?Me.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances):Me.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else if(G.isInstancedMesh)Me.renderInstances(ge,Fe,G.count);else if(q.isInstancedBufferGeometry){const Ot=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,yn=Math.min(q.instanceCount,Ot);Me.renderInstances(ge,Fe,yn)}else Me.render(ge,Fe)};function Pe(P,H,q){P.transparent===!0&&P.side===me&&P.forceSinglePass===!1?(P.side=je,P.needsUpdate=!0,Qa(P,H,q),P.side=It,P.needsUpdate=!0,Qa(P,H,q),P.side=me):Qa(P,H,q)}this.compile=function(P,H,q=null){q===null&&(q=P),p=gt.get(q),p.init(H),S.push(p),q.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),P!==q&&P.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),p.setupLights();const Z=new Set;return P.traverse(function(G){const ht=G.material;if(ht)if(Array.isArray(ht))for(let Mt=0;Mt<ht.length;Mt++){const Tt=ht[Mt];Pe(Tt,q,G),Z.add(Tt)}else Pe(ht,q,G),Z.add(ht)}),S.pop(),p=null,Z},this.compileAsync=function(P,H,q=null){const Z=this.compile(P,H,q);return new Promise(G=>{function ht(){if(Z.forEach(function(Mt){Ht.get(Mt).currentProgram.isReady()&&Z.delete(Mt)}),Z.size===0){G(P);return}setTimeout(ht,10)}Rt.get("KHR_parallel_shader_compile")!==null?ht():setTimeout(ht,10)})};let Le=null;function fe(P){Le&&Le(P)}function Yn(){Yo.stop()}function qn(){Yo.start()}const Yo=new nv;Yo.setAnimationLoop(fe),typeof self<"u"&&Yo.setContext(self),this.setAnimationLoop=function(P){Le=P,F.setAnimationLoop(P),P===null?Yo.stop():Yo.start()},F.addEventListener("sessionstart",Yn),F.addEventListener("sessionend",qn),this.render=function(P,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),F.enabled===!0&&F.isPresenting===!0&&(F.cameraAutoUpdate===!0&&F.updateCamera(H),H=F.getCamera()),P.isScene===!0&&P.onBeforeRender(x,P,H,T),p=gt.get(P,S.length),p.init(H),S.push(p),ft.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),at.setFromProjectionMatrix(ft),tt=this.localClippingEnabled,X=pt.init(this.clippingPlanes,tt),v=At.get(P,g.length),v.init(),g.push(v),F.enabled===!0&&F.isPresenting===!0){const ht=x.xr.getDepthSensingMesh();ht!==null&&yd(ht,H,-1/0,x.sortObjects)}yd(P,H,0,x.sortObjects),v.finish(),x.sortObjects===!0&&v.sort(Y,J),Et=F.enabled===!1||F.isPresenting===!1||F.hasDepthSensing()===!1,Et&&ct.addToRenderList(v,P),this.info.render.frame++,X===!0&&pt.beginShadows();const q=p.state.shadowsArray;kt.render(q,P,H),X===!0&&pt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Z=v.opaque,G=v.transmissive;if(p.setupLights(),H.isArrayCamera){const ht=H.cameras;if(G.length>0)for(let Mt=0,Tt=ht.length;Mt<Tt;Mt++){const Ct=ht[Mt];wf(Z,G,P,Ct)}Et&&ct.render(P);for(let Mt=0,Tt=ht.length;Mt<Tt;Mt++){const Ct=ht[Mt];Mf(v,P,Ct,Ct.viewport)}}else G.length>0&&wf(Z,G,P,H),Et&&ct.render(P),Mf(v,P,H);T!==null&&(zt.updateMultisampleRenderTarget(T),zt.updateRenderTargetMipmap(T)),P.isScene===!0&&P.onAfterRender(x,P,H),Xt.resetDefaultState(),C=-1,y=null,S.pop(),S.length>0?(p=S[S.length-1],X===!0&&pt.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,g.pop(),g.length>0?v=g[g.length-1]:v=null};function yd(P,H,q,Z){if(P.visible===!1)return;if(P.layers.test(H.layers)){if(P.isGroup)q=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(H);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||at.intersectsSprite(P)){Z&&ot.setFromMatrixPosition(P.matrixWorld).applyMatrix4(ft);const Mt=K.update(P),Tt=P.material;Tt.visible&&v.push(P,Mt,Tt,q,ot.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||at.intersectsObject(P))){const Mt=K.update(P),Tt=P.material;if(Z&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),ot.copy(P.boundingSphere.center)):(Mt.boundingSphere===null&&Mt.computeBoundingSphere(),ot.copy(Mt.boundingSphere.center)),ot.applyMatrix4(P.matrixWorld).applyMatrix4(ft)),Array.isArray(Tt)){const Ct=Mt.groups;for(let Zt=0,Jt=Ct.length;Zt<Jt;Zt++){const Wt=Ct[Zt],ge=Tt[Wt.materialIndex];ge&&ge.visible&&v.push(P,Mt,ge,q,ot.z,Wt)}}else Tt.visible&&v.push(P,Mt,Tt,q,ot.z,null)}}const ht=P.children;for(let Mt=0,Tt=ht.length;Mt<Tt;Mt++)yd(ht[Mt],H,q,Z)}function Mf(P,H,q,Z){const G=P.opaque,ht=P.transmissive,Mt=P.transparent;p.setupLightsView(q),X===!0&&pt.setGlobalState(x.clippingPlanes,q),Z&&bt.viewport(_.copy(Z)),G.length>0&&Ja(G,H,q),ht.length>0&&Ja(ht,H,q),Mt.length>0&&Ja(Mt,H,q),bt.buffers.depth.setTest(!0),bt.buffers.depth.setMask(!0),bt.buffers.color.setMask(!0),bt.setPolygonOffset(!1)}function wf(P,H,q,Z){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Z.id]===void 0&&(p.state.transmissionRenderTarget[Z.id]=new wn(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float")?Gn:to,minFilter:hs,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ve.workingColorSpace}));const ht=p.state.transmissionRenderTarget[Z.id],Mt=Z.viewport||_;ht.setSize(Mt.z,Mt.w);const Tt=x.getRenderTarget();x.setRenderTarget(ht),x.getClearColor(N),z=x.getClearAlpha(),z<1&&x.setClearColor(16777215,.5),Et?ct.render(q):x.clear();const Ct=x.toneMapping;x.toneMapping=Do;const Zt=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),p.setupLightsView(Z),X===!0&&pt.setGlobalState(x.clippingPlanes,Z),Ja(P,q,Z),zt.updateMultisampleRenderTarget(ht),zt.updateRenderTargetMipmap(ht),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let Jt=!1;for(let Wt=0,ge=H.length;Wt<ge;Wt++){const Ue=H[Wt],Fe=Ue.object,Un=Ue.geometry,Me=Ue.material,Ot=Ue.group;if(Me.side===me&&Fe.layers.test(Z.layers)){const yn=Me.side;Me.side=je,Me.needsUpdate=!0,yf(Fe,q,Z,Un,Me,Ot),Me.side=yn,Me.needsUpdate=!0,Jt=!0}}Jt===!0&&(zt.updateMultisampleRenderTarget(ht),zt.updateRenderTargetMipmap(ht))}x.setRenderTarget(Tt),x.setClearColor(N,z),Zt!==void 0&&(Z.viewport=Zt),x.toneMapping=Ct}function Ja(P,H,q){const Z=H.isScene===!0?H.overrideMaterial:null;for(let G=0,ht=P.length;G<ht;G++){const Mt=P[G],Tt=Mt.object,Ct=Mt.geometry,Zt=Z===null?Mt.material:Z,Jt=Mt.group;Tt.layers.test(q.layers)&&yf(Tt,H,q,Ct,Zt,Jt)}}function yf(P,H,q,Z,G,ht){P.onBeforeRender(x,H,q,Z,G,ht),P.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),G.onBeforeRender(x,H,q,Z,P,ht),G.transparent===!0&&G.side===me&&G.forceSinglePass===!1?(G.side=je,G.needsUpdate=!0,x.renderBufferDirect(q,H,Z,G,P,ht),G.side=It,G.needsUpdate=!0,x.renderBufferDirect(q,H,Z,G,P,ht),G.side=me):x.renderBufferDirect(q,H,Z,G,P,ht),P.onAfterRender(x,H,q,Z,G,ht)}function Qa(P,H,q){H.isScene!==!0&&(H=Nt);const Z=Ht.get(P),G=p.state.lights,ht=p.state.shadowsArray,Mt=G.state.version,Tt=nt.getParameters(P,G.state,ht,H,q),Ct=nt.getProgramCacheKey(Tt);let Zt=Z.programs;Z.environment=P.isMeshStandardMaterial?H.environment:null,Z.fog=H.fog,Z.envMap=(P.isMeshStandardMaterial?I:_e).get(P.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&P.envMap===null?H.environmentRotation:P.envMapRotation,Zt===void 0&&(P.addEventListener("dispose",dt),Zt=new Map,Z.programs=Zt);let Jt=Zt.get(Ct);if(Jt!==void 0){if(Z.currentProgram===Jt&&Z.lightsStateVersion===Mt)return Tf(P,Tt),Jt}else Tt.uniforms=nt.getUniforms(P),P.onBuild(q,Tt,x),P.onBeforeCompile(Tt,x),Jt=nt.acquireProgram(Tt,Ct),Zt.set(Ct,Jt),Z.uniforms=Tt.uniforms;const Wt=Z.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Wt.clippingPlanes=pt.uniform),Tf(P,Tt),Z.needsLights=ax(P),Z.lightsStateVersion=Mt,Z.needsLights&&(Wt.ambientLightColor.value=G.state.ambient,Wt.lightProbe.value=G.state.probe,Wt.directionalLights.value=G.state.directional,Wt.directionalLightShadows.value=G.state.directionalShadow,Wt.spotLights.value=G.state.spot,Wt.spotLightShadows.value=G.state.spotShadow,Wt.rectAreaLights.value=G.state.rectArea,Wt.ltc_1.value=G.state.rectAreaLTC1,Wt.ltc_2.value=G.state.rectAreaLTC2,Wt.pointLights.value=G.state.point,Wt.pointLightShadows.value=G.state.pointShadow,Wt.hemisphereLights.value=G.state.hemi,Wt.directionalShadowMap.value=G.state.directionalShadowMap,Wt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Wt.spotShadowMap.value=G.state.spotShadowMap,Wt.spotLightMatrix.value=G.state.spotLightMatrix,Wt.spotLightMap.value=G.state.spotLightMap,Wt.pointShadowMap.value=G.state.pointShadowMap,Wt.pointShadowMatrix.value=G.state.pointShadowMatrix),Z.currentProgram=Jt,Z.uniformsList=null,Jt}function bf(P){if(P.uniformsList===null){const H=P.currentProgram.getUniforms();P.uniformsList=rl.seqWithValue(H.seq,P.uniforms)}return P.uniformsList}function Tf(P,H){const q=Ht.get(P);q.outputColorSpace=H.outputColorSpace,q.batching=H.batching,q.batchingColor=H.batchingColor,q.instancing=H.instancing,q.instancingColor=H.instancingColor,q.instancingMorph=H.instancingMorph,q.skinning=H.skinning,q.morphTargets=H.morphTargets,q.morphNormals=H.morphNormals,q.morphColors=H.morphColors,q.morphTargetsCount=H.morphTargetsCount,q.numClippingPlanes=H.numClippingPlanes,q.numIntersection=H.numClipIntersection,q.vertexAlphas=H.vertexAlphas,q.vertexTangents=H.vertexTangents,q.toneMapping=H.toneMapping}function sx(P,H,q,Z,G){H.isScene!==!0&&(H=Nt),zt.resetTextureUnits();const ht=H.fog,Mt=Z.isMeshStandardMaterial?H.environment:null,Tt=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Fo,Ct=(Z.isMeshStandardMaterial?I:_e).get(Z.envMap||Mt),Zt=Z.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Jt=!!q.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Wt=!!q.morphAttributes.position,ge=!!q.morphAttributes.normal,Ue=!!q.morphAttributes.color;let Fe=Do;Z.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Fe=x.toneMapping);const Un=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Me=Un!==void 0?Un.length:0,Ot=Ht.get(Z),yn=p.state.lights;if(X===!0&&(tt===!0||P!==y)){const Zn=P===y&&Z.id===C;pt.setState(Z,P,Zn)}let be=!1;Z.version===Ot.__version?(Ot.needsLights&&Ot.lightsStateVersion!==yn.state.version||Ot.outputColorSpace!==Tt||G.isBatchedMesh&&Ot.batching===!1||!G.isBatchedMesh&&Ot.batching===!0||G.isBatchedMesh&&Ot.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ot.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ot.instancing===!1||!G.isInstancedMesh&&Ot.instancing===!0||G.isSkinnedMesh&&Ot.skinning===!1||!G.isSkinnedMesh&&Ot.skinning===!0||G.isInstancedMesh&&Ot.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ot.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ot.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ot.instancingMorph===!1&&G.morphTexture!==null||Ot.envMap!==Ct||Z.fog===!0&&Ot.fog!==ht||Ot.numClippingPlanes!==void 0&&(Ot.numClippingPlanes!==pt.numPlanes||Ot.numIntersection!==pt.numIntersection)||Ot.vertexAlphas!==Zt||Ot.vertexTangents!==Jt||Ot.morphTargets!==Wt||Ot.morphNormals!==ge||Ot.morphColors!==Ue||Ot.toneMapping!==Fe||Ot.morphTargetsCount!==Me)&&(be=!0):(be=!0,Ot.__version=Z.version);let Ri=Ot.currentProgram;be===!0&&(Ri=Qa(Z,H,G));let $a=!1,qo=!1,bd=!1;const sn=Ri.getUniforms(),ao=Ot.uniforms;if(bt.useProgram(Ri.program)&&($a=!0,qo=!0,bd=!0),Z.id!==C&&(C=Z.id,qo=!0),$a||y!==P){sn.setValue(O,"projectionMatrix",P.projectionMatrix),sn.setValue(O,"viewMatrix",P.matrixWorldInverse);const Zn=sn.map.cameraPosition;Zn!==void 0&&Zn.setValue(O,ot.setFromMatrixPosition(P.matrixWorld)),ie.logarithmicDepthBuffer&&sn.setValue(O,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&sn.setValue(O,"isOrthographic",P.isOrthographicCamera===!0),y!==P&&(y=P,qo=!0,bd=!0)}if(G.isSkinnedMesh){sn.setOptional(O,G,"bindMatrix"),sn.setOptional(O,G,"bindMatrixInverse");const Zn=G.skeleton;Zn&&(Zn.boneTexture===null&&Zn.computeBoneTexture(),sn.setValue(O,"boneTexture",Zn.boneTexture,zt))}G.isBatchedMesh&&(sn.setOptional(O,G,"batchingTexture"),sn.setValue(O,"batchingTexture",G._matricesTexture,zt),sn.setOptional(O,G,"batchingColorTexture"),G._colorsTexture!==null&&sn.setValue(O,"batchingColorTexture",G._colorsTexture,zt));const Td=q.morphAttributes;if((Td.position!==void 0||Td.normal!==void 0||Td.color!==void 0)&&st.update(G,q,Ri),(qo||Ot.receiveShadow!==G.receiveShadow)&&(Ot.receiveShadow=G.receiveShadow,sn.setValue(O,"receiveShadow",G.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(ao.envMap.value=Ct,ao.flipEnvMap.value=Ct.isCubeTexture&&Ct.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&H.environment!==null&&(ao.envMapIntensity.value=H.environmentIntensity),qo&&(sn.setValue(O,"toneMappingExposure",x.toneMappingExposure),Ot.needsLights&&rx(ao,bd),ht&&Z.fog===!0&&it.refreshFogUniforms(ao,ht),it.refreshMaterialUniforms(ao,Z,j,V,p.state.transmissionRenderTarget[P.id]),rl.upload(O,bf(Ot),ao,zt)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(rl.upload(O,bf(Ot),ao,zt),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&sn.setValue(O,"center",G.center),sn.setValue(O,"modelViewMatrix",G.modelViewMatrix),sn.setValue(O,"normalMatrix",G.normalMatrix),sn.setValue(O,"modelMatrix",G.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){const Zn=Z.uniformsGroups;for(let Ed=0,cx=Zn.length;Ed<cx;Ed++){const Ef=Zn[Ed];jt.update(Ef,Ri),jt.bind(Ef,Ri)}}return Ri}function rx(P,H){P.ambientLightColor.needsUpdate=H,P.lightProbe.needsUpdate=H,P.directionalLights.needsUpdate=H,P.directionalLightShadows.needsUpdate=H,P.pointLights.needsUpdate=H,P.pointLightShadows.needsUpdate=H,P.spotLights.needsUpdate=H,P.spotLightShadows.needsUpdate=H,P.rectAreaLights.needsUpdate=H,P.hemisphereLights.needsUpdate=H}function ax(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(P,H,q){Ht.get(P.texture).__webglTexture=H,Ht.get(P.depthTexture).__webglTexture=q;const Z=Ht.get(P);Z.__hasExternalTextures=!0,Z.__autoAllocateDepthBuffer=q===void 0,Z.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,H){const q=Ht.get(P);q.__webglFramebuffer=H,q.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(P,H=0,q=0){T=P,E=H,b=q;let Z=!0,G=null,ht=!1,Mt=!1;if(P){const Ct=Ht.get(P);Ct.__useDefaultFramebuffer!==void 0?(bt.bindFramebuffer(O.FRAMEBUFFER,null),Z=!1):Ct.__webglFramebuffer===void 0?zt.setupRenderTarget(P):Ct.__hasExternalTextures&&zt.rebindTextures(P,Ht.get(P.texture).__webglTexture,Ht.get(P.depthTexture).__webglTexture);const Zt=P.texture;(Zt.isData3DTexture||Zt.isDataArrayTexture||Zt.isCompressedArrayTexture)&&(Mt=!0);const Jt=Ht.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(Jt[H])?G=Jt[H][q]:G=Jt[H],ht=!0):P.samples>0&&zt.useMultisampledRTT(P)===!1?G=Ht.get(P).__webglMultisampledFramebuffer:Array.isArray(Jt)?G=Jt[q]:G=Jt,_.copy(P.viewport),R.copy(P.scissor),D=P.scissorTest}else _.copy(k).multiplyScalar(j).floor(),R.copy($).multiplyScalar(j).floor(),D=mt;if(bt.bindFramebuffer(O.FRAMEBUFFER,G)&&Z&&bt.drawBuffers(P,G),bt.viewport(_),bt.scissor(R),bt.setScissorTest(D),ht){const Ct=Ht.get(P.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+H,Ct.__webglTexture,q)}else if(Mt){const Ct=Ht.get(P.texture),Zt=H||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ct.__webglTexture,q||0,Zt)}C=-1},this.readRenderTargetPixels=function(P,H,q,Z,G,ht,Mt){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=Ht.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Mt!==void 0&&(Tt=Tt[Mt]),Tt){bt.bindFramebuffer(O.FRAMEBUFFER,Tt);try{const Ct=P.texture,Zt=Ct.format,Jt=Ct.type;if(!ie.textureFormatReadable(Zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ie.textureTypeReadable(Jt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=P.width-Z&&q>=0&&q<=P.height-G&&O.readPixels(H,q,Z,G,ut.convert(Zt),ut.convert(Jt),ht)}finally{const Ct=T!==null?Ht.get(T).__webglFramebuffer:null;bt.bindFramebuffer(O.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(P,H,q,Z,G,ht,Mt){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=Ht.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Mt!==void 0&&(Tt=Tt[Mt]),Tt){bt.bindFramebuffer(O.FRAMEBUFFER,Tt);try{const Ct=P.texture,Zt=Ct.format,Jt=Ct.type;if(!ie.textureFormatReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ie.textureTypeReadable(Jt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(H>=0&&H<=P.width-Z&&q>=0&&q<=P.height-G){const Wt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Wt),O.bufferData(O.PIXEL_PACK_BUFFER,ht.byteLength,O.STREAM_READ),O.readPixels(H,q,Z,G,ut.convert(Zt),ut.convert(Jt),0),O.flush();const ge=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);await S2(O,ge,4);try{O.bindBuffer(O.PIXEL_PACK_BUFFER,Wt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,ht)}finally{O.deleteBuffer(Wt),O.deleteSync(ge)}return ht}}finally{const Ct=T!==null?Ht.get(T).__webglFramebuffer:null;bt.bindFramebuffer(O.FRAMEBUFFER,Ct)}}},this.copyFramebufferToTexture=function(P,H=null,q=0){P.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),H=arguments[0]||null,P=arguments[1]);const Z=Math.pow(2,-q),G=Math.floor(P.image.width*Z),ht=Math.floor(P.image.height*Z),Mt=H!==null?H.x:0,Tt=H!==null?H.y:0;zt.setTexture2D(P,0),O.copyTexSubImage2D(O.TEXTURE_2D,q,0,0,Mt,Tt,G,ht),bt.unbindTexture()},this.copyTextureToTexture=function(P,H,q=null,Z=null,G=0){P.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),Z=arguments[0]||null,P=arguments[1],H=arguments[2],G=arguments[3]||0,q=null);let ht,Mt,Tt,Ct,Zt,Jt;q!==null?(ht=q.max.x-q.min.x,Mt=q.max.y-q.min.y,Tt=q.min.x,Ct=q.min.y):(ht=P.image.width,Mt=P.image.height,Tt=0,Ct=0),Z!==null?(Zt=Z.x,Jt=Z.y):(Zt=0,Jt=0);const Wt=ut.convert(H.format),ge=ut.convert(H.type);zt.setTexture2D(H,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,H.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,H.unpackAlignment);const Ue=O.getParameter(O.UNPACK_ROW_LENGTH),Fe=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Un=O.getParameter(O.UNPACK_SKIP_PIXELS),Me=O.getParameter(O.UNPACK_SKIP_ROWS),Ot=O.getParameter(O.UNPACK_SKIP_IMAGES),yn=P.isCompressedTexture?P.mipmaps[G]:P.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,yn.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,yn.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Tt),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ct),P.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,G,Zt,Jt,ht,Mt,Wt,ge,yn.data):P.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,G,Zt,Jt,yn.width,yn.height,Wt,yn.data):O.texSubImage2D(O.TEXTURE_2D,G,Zt,Jt,Wt,ge,yn),O.pixelStorei(O.UNPACK_ROW_LENGTH,Ue),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Fe),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Un),O.pixelStorei(O.UNPACK_SKIP_ROWS,Me),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ot),G===0&&H.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),bt.unbindTexture()},this.copyTextureToTexture3D=function(P,H,q=null,Z=null,G=0){P.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,Z=arguments[1]||null,P=arguments[2],H=arguments[3],G=arguments[4]||0);let ht,Mt,Tt,Ct,Zt,Jt,Wt,ge,Ue;const Fe=P.isCompressedTexture?P.mipmaps[G]:P.image;q!==null?(ht=q.max.x-q.min.x,Mt=q.max.y-q.min.y,Tt=q.max.z-q.min.z,Ct=q.min.x,Zt=q.min.y,Jt=q.min.z):(ht=Fe.width,Mt=Fe.height,Tt=Fe.depth,Ct=0,Zt=0,Jt=0),Z!==null?(Wt=Z.x,ge=Z.y,Ue=Z.z):(Wt=0,ge=0,Ue=0);const Un=ut.convert(H.format),Me=ut.convert(H.type);let Ot;if(H.isData3DTexture)zt.setTexture3D(H,0),Ot=O.TEXTURE_3D;else if(H.isDataArrayTexture||H.isCompressedArrayTexture)zt.setTexture2DArray(H,0),Ot=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,H.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,H.unpackAlignment);const yn=O.getParameter(O.UNPACK_ROW_LENGTH),be=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Ri=O.getParameter(O.UNPACK_SKIP_PIXELS),$a=O.getParameter(O.UNPACK_SKIP_ROWS),qo=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,Fe.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Fe.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Ct),O.pixelStorei(O.UNPACK_SKIP_ROWS,Zt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Jt),P.isDataTexture||P.isData3DTexture?O.texSubImage3D(Ot,G,Wt,ge,Ue,ht,Mt,Tt,Un,Me,Fe.data):H.isCompressedArrayTexture?O.compressedTexSubImage3D(Ot,G,Wt,ge,Ue,ht,Mt,Tt,Un,Fe.data):O.texSubImage3D(Ot,G,Wt,ge,Ue,ht,Mt,Tt,Un,Me,Fe),O.pixelStorei(O.UNPACK_ROW_LENGTH,yn),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,be),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Ri),O.pixelStorei(O.UNPACK_SKIP_ROWS,$a),O.pixelStorei(O.UNPACK_SKIP_IMAGES,qo),G===0&&H.generateMipmaps&&O.generateMipmap(Ot),bt.unbindTexture()},this.initRenderTarget=function(P){Ht.get(P).__webglFramebuffer===void 0&&zt.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?zt.setTextureCube(P,0):P.isData3DTexture?zt.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?zt.setTexture2DArray(P,0):zt.setTexture2D(P,0),bt.unbindTexture()},this.resetState=function(){E=0,b=0,T=null,bt.reset(),Xt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Gh?"display-p3":"srgb",e.unpackColorSpace=ve.workingColorSpace===id?"display-p3":"srgb"}}class Ur{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new St(t),this.near=e,this.far=i}clone(){return new Ur(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Fr extends ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Je,this.environmentIntensity=1,this.environmentRotation=new Je,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Ey{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=oh,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=$i()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return Xh("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let o=0,s=this.stride;o<s;o++)this.array[t+o]=e.array[i+o];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=$i()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=$i()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const bn=new M;class Ll{constructor(t,e,i,o=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=o}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)bn.fromBufferAttribute(this,e),bn.applyMatrix4(t),this.setXYZ(e,bn.x,bn.y,bn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)bn.fromBufferAttribute(this,e),bn.applyNormalMatrix(t),this.setXYZ(e,bn.x,bn.y,bn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)bn.fromBufferAttribute(this,e),bn.transformDirection(t),this.setXYZ(e,bn.x,bn.y,bn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=ui(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=we(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=ui(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=ui(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=ui(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=ui(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=we(e,this.array),i=we(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,o){return t=t*this.data.stride+this.offset,this.normalized&&(e=we(e,this.array),i=we(i,this.array),o=we(o,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=o,this}setXYZW(t,e,i,o,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=we(e,this.array),i=we(i,this.array),o=we(o,this.array),s=we(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=o,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const o=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[o+s])}return new re(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ll(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const o=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[o+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class rd extends Ei{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Gs;const Xr=new M,Vs=new M,Xs=new M,Ys=new rt,Yr=new rt,lv=new Lt,wc=new M,qr=new M,yc=new M,Xp=new rt,ou=new rt,Yp=new rt;class jh extends ye{constructor(t=new rd){if(super(),this.isSprite=!0,this.type="Sprite",Gs===void 0){Gs=new ce;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Ey(e,5);Gs.setIndex([0,1,2,0,2,3]),Gs.setAttribute("position",new Ll(i,3,0,!1)),Gs.setAttribute("uv",new Ll(i,2,3,!1))}this.geometry=Gs,this.material=t,this.center=new rt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Vs.setFromMatrixScale(this.matrixWorld),lv.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Xs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Vs.multiplyScalar(-Xs.z);const i=this.material.rotation;let o,s;i!==0&&(s=Math.cos(i),o=Math.sin(i));const r=this.center;bc(wc.set(-.5,-.5,0),Xs,r,Vs,o,s),bc(qr.set(.5,-.5,0),Xs,r,Vs,o,s),bc(yc.set(.5,.5,0),Xs,r,Vs,o,s),Xp.set(0,0),ou.set(1,0),Yp.set(1,1);let a=t.ray.intersectTriangle(wc,qr,yc,!1,Xr);if(a===null&&(bc(qr.set(-.5,.5,0),Xs,r,Vs,o,s),ou.set(0,1),a=t.ray.intersectTriangle(wc,yc,qr,!1,Xr),a===null))return;const c=t.ray.origin.distanceTo(Xr);c<t.near||c>t.far||e.push({distance:c,point:Xr.clone(),uv:hi.getInterpolation(Xr,wc,qr,yc,Xp,ou,Yp,new rt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function bc(n,t,e,i,o,s){Ys.subVectors(n,e).addScalar(.5).multiply(i),o!==void 0?(Yr.x=s*Ys.x-o*Ys.y,Yr.y=o*Ys.x+s*Ys.y):Yr.copy(Ys),n.copy(t),n.x+=Yr.x,n.y+=Yr.y,n.applyMatrix4(lv)}class Jh extends un{constructor(t=null,e=1,i=1,o,s,r,a,c,l=dn,d=dn,u,h){super(null,r,a,c,l,d,o,s,u,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dr extends re{constructor(t,e,i,o=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=o}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const qs=new Lt,qp=new Lt,Tc=[],Zp=new ys,Ay=new Lt,Zr=new L,Kr=new bs;class tn extends L{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new dr(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let o=0;o<i;o++)this.setMatrixAt(o,Ay)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ys),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,qs),Zp.copy(t.boundingBox).applyMatrix4(qs),this.boundingBox.union(Zp)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new bs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,qs),Kr.copy(t.boundingSphere).applyMatrix4(qs),this.boundingSphere.union(Kr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,o=this.morphTexture.source.data.data,s=i.length+1,r=t*s+1;for(let a=0;a<i.length;a++)i[a]=o[r+a]}raycast(t,e){const i=this.matrixWorld,o=this.count;if(Zr.geometry=this.geometry,Zr.material=this.material,Zr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Kr.copy(this.boundingSphere),Kr.applyMatrix4(i),t.ray.intersectsSphere(Kr)!==!1))for(let s=0;s<o;s++){this.getMatrixAt(s,qs),qp.multiplyMatrices(i,qs),Zr.matrixWorld=qp,Zr.raycast(t,Tc);for(let r=0,a=Tc.length;r<a;r++){const c=Tc[r];c.instanceId=s,c.object=this,e.push(c)}Tc.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new dr(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,o=i.length+1;this.morphTexture===null&&(this.morphTexture=new Jh(new Float32Array(o*this.count),o,this.count,Wg,Ki));const s=this.morphTexture.source.data.data;let r=0;for(let l=0;l<i.length;l++)r+=i[l];const a=this.geometry.morphTargetsRelative?1:1-r,c=o*t;s[c]=a,s.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Ts extends Ei{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Kp=new Lt,ah=new Yh,Ec=new bs,Ac=new M;class io extends ye{constructor(t=new ce,e=new Ts){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,o=this.matrixWorld,s=t.params.Points.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ec.copy(i.boundingSphere),Ec.applyMatrix4(o),Ec.radius+=s,t.ray.intersectsSphere(Ec)===!1)return;Kp.copy(o).invert(),ah.copy(t.ray).applyMatrix4(Kp);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=i.index,u=i.attributes.position;if(l!==null){const h=Math.max(0,r.start),f=Math.min(l.count,r.start+r.count);for(let m=h,v=f;m<v;m++){const p=l.getX(m);Ac.fromBufferAttribute(u,p),jp(Ac,p,c,o,t,e,this)}}else{const h=Math.max(0,r.start),f=Math.min(u.count,r.start+r.count);for(let m=h,v=f;m<v;m++)Ac.fromBufferAttribute(u,m),jp(Ac,m,c,o,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const o=e[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=o.length;s<r;s++){const a=o[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function jp(n,t,e,i,o,s,r){const a=ah.distanceSqToPoint(n);if(a<e){const c=new M;ah.closestPointToPoint(n,c),c.applyMatrix4(i);const l=o.ray.origin.distanceTo(c);if(l<o.near||l>o.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:r})}}class yt extends un{constructor(t,e,i,o,s,r,a,c,l){super(t,e,i,o,s,r,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ai{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,o=this.getPoint(0),s=0;e.push(0);for(let r=1;r<=t;r++)i=this.getPoint(r/t),s+=i.distanceTo(o),e.push(s),o=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let o=0;const s=i.length;let r;e?r=e:r=t*i[s-1];let a=0,c=s-1,l;for(;a<=c;)if(o=Math.floor(a+(c-a)/2),l=i[o]-r,l<0)a=o+1;else if(l>0)c=o-1;else{c=o;break}if(o=c,i[o]===r)return o/(s-1);const d=i[o],h=i[o+1]-d,f=(r-d)/h;return(o+f)/(s-1)}getTangent(t,e){let o=t-1e-4,s=t+1e-4;o<0&&(o=0),s>1&&(s=1);const r=this.getPoint(o),a=this.getPoint(s),c=e||(r.isVector2?new rt:new M);return c.copy(a).sub(r).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new M,o=[],s=[],r=[],a=new M,c=new Lt;for(let f=0;f<=t;f++){const m=f/t;o[f]=this.getTangentAt(m,new M)}s[0]=new M,r[0]=new M;let l=Number.MAX_VALUE;const d=Math.abs(o[0].x),u=Math.abs(o[0].y),h=Math.abs(o[0].z);d<=l&&(l=d,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),h<=l&&i.set(0,0,1),a.crossVectors(o[0],i).normalize(),s[0].crossVectors(o[0],a),r[0].crossVectors(o[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),r[f]=r[f-1].clone(),a.crossVectors(o[f-1],o[f]),a.length()>Number.EPSILON){a.normalize();const m=Math.acos(ln(o[f-1].dot(o[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(a,m))}r[f].crossVectors(o[f],s[f])}if(e===!0){let f=Math.acos(ln(s[0].dot(s[t]),-1,1));f/=t,o[0].dot(a.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(o[m],f*m)),r[m].crossVectors(o[m],s[m])}return{tangents:o,normals:s,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Qh extends Ai{constructor(t=0,e=0,i=1,o=1,s=0,r=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=o,this.aStartAngle=s,this.aEndAngle=r,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new rt){const i=e,o=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const r=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=o;for(;s>o;)s-=o;s<Number.EPSILON&&(r?s=0:s=o),this.aClockwise===!0&&!r&&(s===o?s=-o:s=s-o);const a=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=c-this.aX,f=l-this.aY;c=h*d-f*u+this.aX,l=h*u+f*d+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Cy extends Qh{constructor(t,e,i,o,s,r){super(t,e,i,i,o,s,r),this.isArcCurve=!0,this.type="ArcCurve"}}function $h(){let n=0,t=0,e=0,i=0;function o(s,r,a,c){n=s,t=a,e=-3*s+3*r-2*a-c,i=2*s-2*r+a+c}return{initCatmullRom:function(s,r,a,c,l){o(r,a,l*(a-s),l*(c-r))},initNonuniformCatmullRom:function(s,r,a,c,l,d,u){let h=(r-s)/l-(a-s)/(l+d)+(a-r)/d,f=(a-r)/d-(c-r)/(d+u)+(c-a)/u;h*=d,f*=d,o(r,a,h,f)},calc:function(s){const r=s*s,a=r*s;return n+t*s+e*r+i*a}}}const Cc=new M,su=new $h,ru=new $h,au=new $h;class Ry extends Ai{constructor(t=[],e=!1,i="centripetal",o=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=o}getPoint(t,e=new M){const i=e,o=this.points,s=o.length,r=(s-(this.closed?0:1))*t;let a=Math.floor(r),c=r-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,d;this.closed||a>0?l=o[(a-1)%s]:(Cc.subVectors(o[0],o[1]).add(o[0]),l=Cc);const u=o[a%s],h=o[(a+1)%s];if(this.closed||a+2<s?d=o[(a+2)%s]:(Cc.subVectors(o[s-1],o[s-2]).add(o[s-1]),d=Cc),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(h),f),p=Math.pow(h.distanceToSquared(d),f);v<1e-4&&(v=1),m<1e-4&&(m=v),p<1e-4&&(p=v),su.initNonuniformCatmullRom(l.x,u.x,h.x,d.x,m,v,p),ru.initNonuniformCatmullRom(l.y,u.y,h.y,d.y,m,v,p),au.initNonuniformCatmullRom(l.z,u.z,h.z,d.z,m,v,p)}else this.curveType==="catmullrom"&&(su.initCatmullRom(l.x,u.x,h.x,d.x,this.tension),ru.initCatmullRom(l.y,u.y,h.y,d.y,this.tension),au.initCatmullRom(l.z,u.z,h.z,d.z,this.tension));return i.set(su.calc(c),ru.calc(c),au.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(o.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const o=this.points[e];t.points.push(o.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(new M().fromArray(o))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Jp(n,t,e,i,o){const s=(i-t)*.5,r=(o-e)*.5,a=n*n,c=n*a;return(2*e-2*i+s+r)*c+(-3*e+3*i-2*s-r)*a+s*n+e}function Py(n,t){const e=1-n;return e*e*t}function Ly(n,t){return 2*(1-n)*n*t}function Dy(n,t){return n*n*t}function xa(n,t,e,i){return Py(n,t)+Ly(n,e)+Dy(n,i)}function Iy(n,t){const e=1-n;return e*e*e*t}function Ny(n,t){const e=1-n;return 3*e*e*n*t}function Oy(n,t){return 3*(1-n)*n*n*t}function Uy(n,t){return n*n*n*t}function Sa(n,t,e,i,o){return Iy(n,t)+Ny(n,e)+Oy(n,i)+Uy(n,o)}class dv extends Ai{constructor(t=new rt,e=new rt,i=new rt,o=new rt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=o}getPoint(t,e=new rt){const i=e,o=this.v0,s=this.v1,r=this.v2,a=this.v3;return i.set(Sa(t,o.x,s.x,r.x,a.x),Sa(t,o.y,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Fy extends Ai{constructor(t=new M,e=new M,i=new M,o=new M){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=o}getPoint(t,e=new M){const i=e,o=this.v0,s=this.v1,r=this.v2,a=this.v3;return i.set(Sa(t,o.x,s.x,r.x,a.x),Sa(t,o.y,s.y,r.y,a.y),Sa(t,o.z,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class uv extends Ai{constructor(t=new rt,e=new rt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new rt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new rt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zy extends Ai{constructor(t=new M,e=new M){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new M){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new M){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hv extends Ai{constructor(t=new rt,e=new rt,i=new rt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new rt){const i=e,o=this.v0,s=this.v1,r=this.v2;return i.set(xa(t,o.x,s.x,r.x),xa(t,o.y,s.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class By extends Ai{constructor(t=new M,e=new M,i=new M){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new M){const i=e,o=this.v0,s=this.v1,r=this.v2;return i.set(xa(t,o.x,s.x,r.x),xa(t,o.y,s.y,r.y),xa(t,o.z,s.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class fv extends Ai{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new rt){const i=e,o=this.points,s=(o.length-1)*t,r=Math.floor(s),a=s-r,c=o[r===0?r:r-1],l=o[r],d=o[r>o.length-2?o.length-1:r+1],u=o[r>o.length-3?o.length-1:r+2];return i.set(Jp(a,c.x,l.x,d.x,u.x),Jp(a,c.y,l.y,d.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(o.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const o=this.points[e];t.points.push(o.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(new rt().fromArray(o))}return this}}var Qp=Object.freeze({__proto__:null,ArcCurve:Cy,CatmullRomCurve3:Ry,CubicBezierCurve:dv,CubicBezierCurve3:Fy,EllipseCurve:Qh,LineCurve:uv,LineCurve3:zy,QuadraticBezierCurve:hv,QuadraticBezierCurve3:By,SplineCurve:fv});class Hy extends Ai{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Qp[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),o=this.getCurveLengths();let s=0;for(;s<o.length;){if(o[s]>=i){const r=o[s]-i,a=this.curves[s],c=a.getLength(),l=c===0?0:1-r/c;return a.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,o=this.curves.length;i<o;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let o=0,s=this.curves;o<s.length;o++){const r=s[o],a=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,c=r.getPoints(a);for(let l=0;l<c.length;l++){const d=c[l];i&&i.equals(d)||(e.push(d),i=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const o=t.curves[e];this.curves.push(o.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const o=this.curves[e];t.curves.push(o.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const o=t.curves[e];this.curves.push(new Qp[o.type]().fromJSON(o))}return this}}class ky extends Hy{constructor(t){super(),this.type="Path",this.currentPoint=new rt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new uv(this.currentPoint.clone(),new rt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,o){const s=new hv(this.currentPoint.clone(),new rt(t,e),new rt(i,o));return this.curves.push(s),this.currentPoint.set(i,o),this}bezierCurveTo(t,e,i,o,s,r){const a=new dv(this.currentPoint.clone(),new rt(t,e),new rt(i,o),new rt(s,r));return this.curves.push(a),this.currentPoint.set(s,r),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new fv(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,o,s,r){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,i,o,s,r),this}absarc(t,e,i,o,s,r){return this.absellipse(t,e,i,i,o,s,r),this}ellipse(t,e,i,o,s,r,a,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,i,o,s,r,a,c),this}absellipse(t,e,i,o,s,r,a,c){const l=new Qh(t,e,i,o,s,r,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class tf extends ce{constructor(t=[new rt(0,-.5),new rt(.5,0),new rt(0,.5)],e=12,i=0,o=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:o},e=Math.floor(e),o=ln(o,0,Math.PI*2);const s=[],r=[],a=[],c=[],l=[],d=1/e,u=new M,h=new rt,f=new M,m=new M,v=new M;let p=0,g=0;for(let S=0;S<=t.length-1;S++)switch(S){case 0:p=t[S+1].x-t[S].x,g=t[S+1].y-t[S].y,f.x=g*1,f.y=-p,f.z=g*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:p=t[S+1].x-t[S].x,g=t[S+1].y-t[S].y,f.x=g*1,f.y=-p,f.z=g*0,m.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(m)}for(let S=0;S<=e;S++){const x=i+S*d*o,w=Math.sin(x),E=Math.cos(x);for(let b=0;b<=t.length-1;b++){u.x=t[b].x*w,u.y=t[b].y,u.z=t[b].x*E,r.push(u.x,u.y,u.z),h.x=S/e,h.y=b/(t.length-1),a.push(h.x,h.y);const T=c[3*b+0]*w,C=c[3*b+1],y=c[3*b+0]*E;l.push(T,C,y)}}for(let S=0;S<e;S++)for(let x=0;x<t.length-1;x++){const w=x+S*t.length,E=w,b=w+t.length,T=w+t.length+1,C=w+1;s.push(E,b,C),s.push(T,C,b)}this.setIndex(s),this.setAttribute("position",new oe(r,3)),this.setAttribute("uv",new oe(a,2)),this.setAttribute("normal",new oe(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new tf(t.points,t.segments,t.phiStart,t.phiLength)}}class ad extends tf{constructor(t=1,e=1,i=4,o=8){const s=new ky;s.absarc(0,-e/2,t,Math.PI*1.5,0),s.absarc(0,e/2,t,0,Math.PI*.5),super(s.getPoints(i),o),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:i,radialSegments:o}}static fromJSON(t){return new ad(t.radius,t.length,t.capSegments,t.radialSegments)}}class cd extends ce{constructor(t=1,e=32,i=0,o=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:o},e=Math.max(3,e);const s=[],r=[],a=[],c=[],l=new M,d=new rt;r.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,h=3;u<=e;u++,h+=3){const f=i+u/e*o;l.x=t*Math.cos(f),l.y=t*Math.sin(f),r.push(l.x,l.y,l.z),a.push(0,0,1),d.x=(r[h]/t+1)/2,d.y=(r[h+1]/t+1)/2,c.push(d.x,d.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new oe(r,3)),this.setAttribute("normal",new oe(a,3)),this.setAttribute("uv",new oe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cd(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class wt extends ce{constructor(t=1,e=1,i=1,o=32,s=1,r=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:o,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:c};const l=this;o=Math.floor(o),s=Math.floor(s);const d=[],u=[],h=[],f=[];let m=0;const v=[],p=i/2;let g=0;S(),r===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(d),this.setAttribute("position",new oe(u,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(f,2));function S(){const w=new M,E=new M;let b=0;const T=(e-t)/i;for(let C=0;C<=s;C++){const y=[],_=C/s,R=_*(e-t)+t;for(let D=0;D<=o;D++){const N=D/o,z=N*c+a,B=Math.sin(z),V=Math.cos(z);E.x=R*B,E.y=-_*i+p,E.z=R*V,u.push(E.x,E.y,E.z),w.set(B,T,V).normalize(),h.push(w.x,w.y,w.z),f.push(N,1-_),y.push(m++)}v.push(y)}for(let C=0;C<o;C++)for(let y=0;y<s;y++){const _=v[y][C],R=v[y+1][C],D=v[y+1][C+1],N=v[y][C+1];d.push(_,R,N),d.push(R,D,N),b+=6}l.addGroup(g,b,0),g+=b}function x(w){const E=m,b=new rt,T=new M;let C=0;const y=w===!0?t:e,_=w===!0?1:-1;for(let D=1;D<=o;D++)u.push(0,p*_,0),h.push(0,_,0),f.push(.5,.5),m++;const R=m;for(let D=0;D<=o;D++){const z=D/o*c+a,B=Math.cos(z),V=Math.sin(z);T.x=y*V,T.y=p*_,T.z=y*B,u.push(T.x,T.y,T.z),h.push(0,_,0),b.x=B*.5+.5,b.y=V*.5*_+.5,f.push(b.x,b.y),m++}for(let D=0;D<o;D++){const N=E+D,z=R+D;w===!0?d.push(z,z+1,N):d.push(z+1,z,N),C+=3}l.addGroup(g,C,w===!0?1:2),g+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class zo extends wt{constructor(t=1,e=1,i=32,o=1,s=!1,r=0,a=Math.PI*2){super(0,t,e,i,o,s,r,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:o,openEnded:s,thetaStart:r,thetaLength:a}}static fromJSON(t){return new zo(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ld extends ce{constructor(t=[],e=[],i=1,o=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:o};const s=[],r=[];a(o),l(i),d(),this.setAttribute("position",new oe(s,3)),this.setAttribute("normal",new oe(s.slice(),3)),this.setAttribute("uv",new oe(r,2)),o===0?this.computeVertexNormals():this.normalizeNormals();function a(S){const x=new M,w=new M,E=new M;for(let b=0;b<e.length;b+=3)f(e[b+0],x),f(e[b+1],w),f(e[b+2],E),c(x,w,E,S)}function c(S,x,w,E){const b=E+1,T=[];for(let C=0;C<=b;C++){T[C]=[];const y=S.clone().lerp(w,C/b),_=x.clone().lerp(w,C/b),R=b-C;for(let D=0;D<=R;D++)D===0&&C===b?T[C][D]=y:T[C][D]=y.clone().lerp(_,D/R)}for(let C=0;C<b;C++)for(let y=0;y<2*(b-C)-1;y++){const _=Math.floor(y/2);y%2===0?(h(T[C][_+1]),h(T[C+1][_]),h(T[C][_])):(h(T[C][_+1]),h(T[C+1][_+1]),h(T[C+1][_]))}}function l(S){const x=new M;for(let w=0;w<s.length;w+=3)x.x=s[w+0],x.y=s[w+1],x.z=s[w+2],x.normalize().multiplyScalar(S),s[w+0]=x.x,s[w+1]=x.y,s[w+2]=x.z}function d(){const S=new M;for(let x=0;x<s.length;x+=3){S.x=s[x+0],S.y=s[x+1],S.z=s[x+2];const w=p(S)/2/Math.PI+.5,E=g(S)/Math.PI+.5;r.push(w,1-E)}m(),u()}function u(){for(let S=0;S<r.length;S+=6){const x=r[S+0],w=r[S+2],E=r[S+4],b=Math.max(x,w,E),T=Math.min(x,w,E);b>.9&&T<.1&&(x<.2&&(r[S+0]+=1),w<.2&&(r[S+2]+=1),E<.2&&(r[S+4]+=1))}}function h(S){s.push(S.x,S.y,S.z)}function f(S,x){const w=S*3;x.x=t[w+0],x.y=t[w+1],x.z=t[w+2]}function m(){const S=new M,x=new M,w=new M,E=new M,b=new rt,T=new rt,C=new rt;for(let y=0,_=0;y<s.length;y+=9,_+=6){S.set(s[y+0],s[y+1],s[y+2]),x.set(s[y+3],s[y+4],s[y+5]),w.set(s[y+6],s[y+7],s[y+8]),b.set(r[_+0],r[_+1]),T.set(r[_+2],r[_+3]),C.set(r[_+4],r[_+5]),E.copy(S).add(x).add(w).divideScalar(3);const R=p(E);v(b,_+0,S,R),v(T,_+2,x,R),v(C,_+4,w,R)}}function v(S,x,w,E){E<0&&S.x===1&&(r[x]=S.x-1),w.x===0&&w.z===0&&(r[x]=E/2/Math.PI+.5)}function p(S){return Math.atan2(S.z,-S.x)}function g(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ld(t.vertices,t.indices,t.radius,t.details)}}class zr extends ld{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,o=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(o,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new zr(t.radius,t.detail)}}class Ba extends ld{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],o=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,o,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ba(t.radius,t.detail)}}class Xn extends ce{constructor(t=.5,e=1,i=32,o=1,s=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:o,thetaStart:s,thetaLength:r},i=Math.max(3,i),o=Math.max(1,o);const a=[],c=[],l=[],d=[];let u=t;const h=(e-t)/o,f=new M,m=new rt;for(let v=0;v<=o;v++){for(let p=0;p<=i;p++){const g=s+p/i*r;f.x=u*Math.cos(g),f.y=u*Math.sin(g),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,d.push(m.x,m.y)}u+=h}for(let v=0;v<o;v++){const p=v*(i+1);for(let g=0;g<i;g++){const S=g+p,x=S,w=S+i+1,E=S+i+2,b=S+1;a.push(x,w,b),a.push(w,E,b)}}this.setIndex(a),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(l,3)),this.setAttribute("uv",new oe(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xn(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Se extends ce{constructor(t=1,e=32,i=16,o=0,s=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:o,phiLength:s,thetaStart:r,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(r+a,Math.PI);let l=0;const d=[],u=new M,h=new M,f=[],m=[],v=[],p=[];for(let g=0;g<=i;g++){const S=[],x=g/i;let w=0;g===0&&r===0?w=.5/e:g===i&&c===Math.PI&&(w=-.5/e);for(let E=0;E<=e;E++){const b=E/e;u.x=-t*Math.cos(o+b*s)*Math.sin(r+x*a),u.y=t*Math.cos(r+x*a),u.z=t*Math.sin(o+b*s)*Math.sin(r+x*a),m.push(u.x,u.y,u.z),h.copy(u).normalize(),v.push(h.x,h.y,h.z),p.push(b+w,1-x),S.push(l++)}d.push(S)}for(let g=0;g<i;g++)for(let S=0;S<e;S++){const x=d[g][S+1],w=d[g][S],E=d[g+1][S],b=d[g+1][S+1];(g!==0||r>0)&&f.push(x,w,b),(g!==i-1||c<Math.PI)&&f.push(w,E,b)}this.setIndex(f),this.setAttribute("position",new oe(m,3)),this.setAttribute("normal",new oe(v,3)),this.setAttribute("uv",new oe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Se(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ln extends ce{constructor(t=1,e=.4,i=12,o=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:o,arc:s},i=Math.floor(i),o=Math.floor(o);const r=[],a=[],c=[],l=[],d=new M,u=new M,h=new M;for(let f=0;f<=i;f++)for(let m=0;m<=o;m++){const v=m/o*s,p=f/i*Math.PI*2;u.x=(t+e*Math.cos(p))*Math.cos(v),u.y=(t+e*Math.cos(p))*Math.sin(v),u.z=e*Math.sin(p),a.push(u.x,u.y,u.z),d.x=t*Math.cos(v),d.y=t*Math.sin(v),h.subVectors(u,d).normalize(),c.push(h.x,h.y,h.z),l.push(m/o),l.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=o;m++){const v=(o+1)*f+m-1,p=(o+1)*(f-1)+m-1,g=(o+1)*(f-1)+m,S=(o+1)*f+m;r.push(v,p,S),r.push(p,g,S)}this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("normal",new oe(c,3)),this.setAttribute("uv",new oe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ln(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Wy extends de{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ft extends Ei{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new St(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nd,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Je,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Gy extends Ei{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nd,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Gt extends Ei{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nd,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Je,this.combine=kh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class dd extends ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new St(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class Ha extends dd{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new St(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const cu=new Lt,$p=new M,t0=new M;class pv{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new rt(512,512),this.map=null,this.mapPass=null,this.matrix=new Lt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new od,this._frameExtents=new rt(1,1),this._viewportCount=1,this._viewports=[new Ne(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;$p.setFromMatrixPosition(t.matrixWorld),e.position.copy($p),t0.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(t0),e.updateMatrixWorld(),cu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(cu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(cu)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Vy extends pv{constructor(){super(new Cn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,i=Ar*2*t.angle*this.focus,o=this.mapSize.width/this.mapSize.height,s=t.distance||e.far;(i!==e.fov||o!==e.aspect||s!==e.far)&&(e.fov=i,e.aspect=o,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class e0 extends dd{constructor(t,e,i=0,o=Math.PI/3,s=0,r=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.target=new ye,this.distance=i,this.angle=o,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new Vy}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const n0=new Lt,jr=new M,lu=new M;class Xy extends pv{constructor(){super(new Cn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new rt(4,2),this._viewportCount=6,this._viewports=[new Ne(2,1,1,1),new Ne(0,1,1,1),new Ne(3,1,1,1),new Ne(1,1,1,1),new Ne(3,0,1,1),new Ne(1,0,1,1)],this._cubeDirections=[new M(1,0,0),new M(-1,0,0),new M(0,0,1),new M(0,0,-1),new M(0,1,0),new M(0,-1,0)],this._cubeUps=[new M(0,1,0),new M(0,1,0),new M(0,1,0),new M(0,1,0),new M(0,0,1),new M(0,0,-1)]}updateMatrices(t,e=0){const i=this.camera,o=this.matrix,s=t.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),jr.setFromMatrixPosition(t.matrixWorld),i.position.copy(jr),lu.copy(i.position),lu.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(lu),i.updateMatrixWorld(),o.makeTranslation(-jr.x,-jr.y,-jr.z),n0.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(n0)}}class De extends dd{constructor(t,e,i=0,o=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=o,this.shadow=new Xy}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Yy extends dd{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class qy{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=i0(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=i0();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function i0(){return(typeof performance>"u"?Date:performance).now()}const o0=new Lt;class Zy{constructor(t,e,i=0,o=1/0){this.ray=new Yh(t,e),this.near=i,this.far=o,this.camera=null,this.layers=new qh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return o0.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(o0),this}intersectObject(t,e=!0,i=[]){return ch(t,this,i,e),i.sort(s0),i}intersectObjects(t,e=!0,i=[]){for(let o=0,s=t.length;o<s;o++)ch(t[o],this,i,e);return i.sort(s0),i}}function s0(n,t){return n.distance-t.distance}function ch(n,t,e,i){let o=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(o=!1),o===!0&&i===!0){const s=n.children;for(let r=0,a=s.length;r<a;r++)ch(s[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Hh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Hh);class Ky extends Fr{constructor(t=null){super();const e=new U;e.deleteAttribute("uv");const i=new Ft({side:je}),o=new Ft,s=new De(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new L(e,i);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new L(e,o);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);const c=new L(e,o);c.position.set(-5.607,-.754,-.758),c.rotation.set(0,.994,0),c.scale.set(1.97,1.534,3.955),this.add(c);const l=new L(e,o);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);const d=new L(e,o);d.position.set(-2.017,.018,6.124),d.rotation.set(0,.333,0),d.scale.set(2.002,4.566,2.064),this.add(d);const u=new L(e,o);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);const h=new L(e,o);h.position.set(-2.193,-.369,-5.547),h.rotation.set(0,.516,0),h.scale.set(3.875,3.487,2.986),this.add(h);const f=new L(e,Zs(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);const m=new L(e,Zs(50));m.position.set(-16.109,18.021,-8.207),m.scale.set(.1,2.425,2.751),this.add(m);const v=new L(e,Zs(17));v.position.set(14.904,12.198,-1.832),v.scale.set(.15,4.265,6.331),this.add(v);const p=new L(e,Zs(43));p.position.set(-.462,8.89,14.52),p.scale.set(4.38,5.441,.088),this.add(p);const g=new L(e,Zs(20));g.position.set(3.235,11.486,-12.541),g.scale.set(2.5,2,.1),this.add(g);const S=new L(e,Zs(100));S.position.set(0,20,0),S.scale.set(1,.1,1),this.add(S)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Zs(n){const t=new lt;return t.color.setScalar(n),t}const ef=new URLSearchParams(typeof window<"u"?window.location.search:"");ef.get("quality");const Oa=ef.get("quality")==="low",mv=ef.get("shadows")==="0",ai={renderer:null,frameTimes:[],lastTimestamp:performance.now(),windowMs:2e3};function jy(n){ai.renderer=n}function Jy(n){const t=n-ai.lastTimestamp;if(ai.lastTimestamp=n,t>0&&t<1e3){ai.frameTimes.push(t);let e=0,i=ai.frameTimes.length-1;for(;i>=0&&e<ai.windowMs;)e+=ai.frameTimes[i],i--;i>=0&&ai.frameTimes.splice(0,i)}}function Qy(n){if(n.length===0)return 0;const t=[...n].sort((i,o)=>i-o),e=Math.floor(t.length*.95);return t[Math.min(e,t.length-1)]}function $y(n){const t=ai.frameTimes,e=t.length>0?t.reduce((r,a)=>r+a,0)/t.length:16.67,i=e>0?1e3/e:0,o=Qy(t),s=ai.renderer?.info;return{avgFps:Math.round(i*10)/10,p95FrameTime:Math.round(o*100)/100,drawCalls:s?.render.calls??0,triangles:s?.render.triangles??0,geometries:s?.memory.geometries??0,textures:s?.memory.textures??0,sampleDurationMs:n}}function tb(){window.__perf={sample(n){return new Promise(t=>{const e=performance.now();ai.frameTimes=[],setTimeout(()=>{const i=performance.now()-e;t($y(i))},n)})}}}const nf=new Map;let al=null,lh=null;function rs(n,t,e,i="ship"){nf.set(n,{name:n,position:new M(t.x,t.y,t.z),lookAt:new M(e.x,e.y,e.z),worldId:i})}function eb(n){al=n}function nb(){return Array.from(nf.keys())}function ib(n){lh=n}function gv(n){const t=nf.get(n);return!t||!al?!1:(lh&&lh(t.worldId),al.position.copy(t.position),al.lookAt(t.lookAt),!0)}function ob(){window.__setCam=n=>gv(n)}const sb=1,vv="starship-save",ne={shipMinutes:7*60,energy:80,hunger:70,seated:!1,anchorReturn:null,consoleMode:0,heading:0,questStep:0,questFlags:{panelRead:!1,breakerSet:!1,logged:!1},codexScans:[],relics:[]},rb=.1,ab=.07;function cb(n){ne.shipMinutes+=n*sb,ne.energy=Math.max(0,ne.energy-rb*n),ne.hunger=Math.max(0,ne.hunger-ab*n)}function Br(n){ne.shipMinutes+=n}function Xe(){return{...ne,anchorReturn:ne.anchorReturn}}function _s(n){ne.energy=Math.max(0,Math.min(100,n))}function ud(n){ne.hunger=Math.max(0,Math.min(100,n))}function xv(n,t){ne.seated=n,ne.anchorReturn=t??null}function r0(n){ne.consoleMode=n}function No(){return ne.questStep}function hd(){ne.questStep<3&&(ne.questStep=ne.questStep+1)}function fd(n){ne.questFlags[n]=!0}function pi(n){return ne.codexScans.includes(n)?!1:(ne.codexScans.push(n),Dl(),!0)}function of(n){return ne.relics.includes(n)?!1:(ne.relics.push(n),Dl(),!0)}function Bo(){return{scans:[...ne.codexScans],relics:[...ne.relics]}}function Rr(n){const t=Math.floor(n)%144e3,e=Math.floor(t/60)%24,i=t%60,o=String(e).padStart(2,"0"),s=String(i).padStart(2,"0");return`${o}:${s}`}function Dl(){try{const n={shipMinutes:ne.shipMinutes,energy:ne.energy,hunger:ne.hunger,questStep:ne.questStep,questFlags:{...ne.questFlags},codexScans:[...ne.codexScans],relics:[...ne.relics]};localStorage.setItem(vv,JSON.stringify(n))}catch{}}function lb(){try{const n=localStorage.getItem(vv);if(!n)return!1;const t=JSON.parse(n);if(typeof t.shipMinutes=="number"&&(ne.shipMinutes=t.shipMinutes),typeof t.energy=="number"&&(ne.energy=Math.max(0,Math.min(100,t.energy))),typeof t.hunger=="number"&&(ne.hunger=Math.max(0,Math.min(100,t.hunger))),(t.questStep===0||t.questStep===1||t.questStep===2||t.questStep===3)&&(ne.questStep=t.questStep),t.questFlags&&(typeof t.questFlags.panelRead=="boolean"&&(ne.questFlags.panelRead=t.questFlags.panelRead),typeof t.questFlags.breakerSet=="boolean"&&(ne.questFlags.breakerSet=t.questFlags.breakerSet),typeof t.questFlags.logged=="boolean"&&(ne.questFlags.logged=t.questFlags.logged)),Array.isArray(t.codexScans)&&(ne.codexScans=t.codexScans.filter(e=>typeof e=="string")),Array.isArray(t.relics)){const e=["ship","verdant","ashfall","rift"];ne.relics=t.relics.filter(i=>e.includes(i))}return!0}catch{return!1}}const We={visible:!1,overlay:null,renderer:null,camera:null,lastFpsSamples:[],lastTimestamp:performance.now()};function db(){const n=document.createElement("div");return n.id="debug-overlay",n.style.cssText=["position:fixed","top:8px","left:8px","background:rgba(0,0,0,0.65)","color:#46E0D8","font:13px/1.5 monospace","padding:6px 10px","border-radius:4px","pointer-events:none","z-index:9999","white-space:pre","display:none"].join(";"),document.body.appendChild(n),n}function ub(n,t){We.renderer=n,We.camera=t,We.overlay=db(),window.addEventListener("keydown",e=>{e.key==="`"&&(We.visible=!We.visible,We.overlay&&(We.overlay.style.display=We.visible?"block":"none"))})}function hb(n){if(!We.visible||!We.overlay)return;const t=n-We.lastTimestamp;We.lastTimestamp=n,t>0&&t<500&&(We.lastFpsSamples.push(t),We.lastFpsSamples.length>60&&We.lastFpsSamples.shift());const e=We.lastFpsSamples.length>0?We.lastFpsSamples.reduce((u,h)=>u+h,0)/We.lastFpsSamples.length:16.67,i=Math.round(1e3/e),o=We.renderer?.info,s=o?.render.calls??0,r=o?.render.triangles??0,a=We.camera?.position,c=a?a.x.toFixed(1):"?",l=a?a.y.toFixed(1):"?",d=a?a.z.toFixed(1):"?";We.overlay.textContent=[`FPS: ${i}`,`Draws: ${s}`,`Tris: ${r.toLocaleString()}`,`Pos: (${c}, ${l}, ${d})`].join(`
`)}const dh="#46E0D8",uh="#E8E2D4",fb="#1C1E22",Sv="rgba(28,30,34,0.82)",pb=typeof window>"u"?!0:new URLSearchParams(window.location.search).get("toasts")!=="0";function ur(n){const t=document.createElement("div");return t.style.cssText=n,t}let qi=null,Jr=null;function mb(){qi=ur(["position:fixed","top:18%","left:50%","transform:translateX(-50%)",`color:${uh}`,"font-family:monospace","font-size:18px","letter-spacing:0.15em",`background:${Sv}`,"padding:8px 20px","border-radius:4px","pointer-events:none","z-index:510","opacity:0","transition:opacity 0.2s ease","white-space:nowrap"].join(";")),document.body.appendChild(qi)}function en(n){!qi||!pb||(Jr!==null&&(clearTimeout(Jr),Jr=null),qi.textContent=n,qi.style.transition="opacity 0.2s ease",qi.style.opacity="1",Jr=setTimeout(()=>{qi&&(qi.style.transition="opacity 0.4s ease",qi.style.opacity="0",Jr=null)},2200))}let Si=null,Qr=null;function gb(){Si=ur(["position:fixed","bottom:80px","left:50%","transform:translateX(-50%)",`color:${dh}`,"font-family:monospace","font-size:12px","letter-spacing:0.15em",`background:${Sv}`,"padding:5px 14px","border-radius:4px","border:1px solid rgba(70,224,216,0.3)","pointer-events:none","z-index:510","opacity:0","transition:opacity 0.2s ease","white-space:nowrap"].join(";")),Si.textContent="-- SAVED --",document.body.appendChild(Si)}function a0(n="-- SAVED --"){Si&&(Qr!==null&&(clearTimeout(Qr),Qr=null),Si.textContent=n,Si.style.transition="opacity 0.15s ease",Si.style.opacity="1",Qr=setTimeout(()=>{Si&&(Si.style.transition="opacity 0.3s ease",Si.style.opacity="0",Qr=null)},1e3))}let ci=null,Il=null,us=null;function vb(){ci=ur(["position:fixed","top:50%","left:50%","transform:translate(-50%,-50%)",`background:${fb}`,"border:1px solid rgba(70,224,216,0.4)","border-radius:6px","padding:24px 28px","min-width:360px","max-width:600px","max-height:70vh","overflow-y:auto","z-index:600","display:none","font-family:monospace",`color:${uh}`,"box-shadow:0 0 24px rgba(70,224,216,0.15)"].join(";")),Il=ur([`color:${dh}`,"font-size:15px","letter-spacing:0.12em","margin-bottom:16px","border-bottom:1px solid rgba(70,224,216,0.25)","padding-bottom:8px"].join(";")),us=ur(["font-size:13px","line-height:1.65","letter-spacing:0.04em",`color:${uh}`,"opacity:0.9"].join(";"));const n=ur(["position:absolute","top:12px","right:14px",`color:${dh}`,"font-family:monospace","font-size:12px","letter-spacing:0.1em","cursor:pointer","opacity:0.7","pointer-events:auto"].join(";"));n.textContent="[ESC]",n.addEventListener("click",Nl),ci.appendChild(Il),ci.appendChild(us),ci.appendChild(n),document.body.appendChild(ci),window.addEventListener("keydown",t=>{t.code==="Escape"&&ci&&ci.style.display!=="none"&&Nl()})}function Qn(n,t){if(!(!ci||!Il||!us)){for(Il.textContent=n;us.firstChild;)us.removeChild(us.firstChild);for(const e of t){const i=document.createElement("p");i.style.cssText="margin:0 0 8px 0",i.textContent=e,us.appendChild(i)}ci.style.display="block"}}function Nl(){ci&&(ci.style.display="none")}let _a=null,hh=null,fh=null,gs=null,Io=null,To=null,Ma=null;const hr="#38B3AD",du="rgba(10,11,16,0.85)";function gi(n){const t=document.createElement("div");return t.style.cssText=n,t}function xb(){const n=gi(["position:fixed","top:14px","left:14px","display:flex","flex-direction:column","gap:6px","pointer-events:none","z-index:500","font-family:monospace","background:rgba(10,11,16,0.85)","padding:6px","border-radius:4px"].join(";"));_a=gi([`color:${hr}`,"font-size:15px","letter-spacing:0.08em","text-shadow:0 0 6px rgba(56,179,173,0.5)","width:fit-content"].join(";")),_a.textContent="07:00",n.appendChild(_a);function t(e){const i=gi("display:flex;align-items:center;gap:6px"),o=gi([`color:${hr}`,"font-size:10px","letter-spacing:0.1em","width:44px","text-align:right","opacity:0.7"].join(";"));o.textContent=e,i.appendChild(o);const s=gi([`background:${du}`,"border:1px solid rgba(70,224,216,0.25)","border-radius:2px","width:110px","height:6px","overflow:hidden"].join(";")),r=gi([`background:${hr}`,"height:100%","width:100%","border-radius:2px","transition:width 0.3s ease"].join(";"));return s.appendChild(r),i.appendChild(s),n.appendChild(i),r}hh=t("ENERGY"),fh=t("HUNGER"),document.body.appendChild(n),Ma=gi(["position:fixed","top:14px","left:50%","transform:translateX(-50%)","font-family:monospace","font-size:13px","letter-spacing:0.12em","color:#E8E2D4",`background:${du}`,"padding:3px 12px","border-radius:3px","border:1px solid rgba(232,226,212,0.15)","pointer-events:none","z-index:500","white-space:nowrap","text-shadow:0 0 6px rgba(232,226,212,0.3)"].join(";")),Ma.textContent="STREL-7 · T+07:00 · CRUISE",document.body.appendChild(Ma),Io=gi(["position:fixed","top:50%","left:50%","transform:translate(-50%,-50%)","width:6px","height:6px","border-radius:50%","border:1.5px solid rgba(255,255,255,0.4)","pointer-events:none","z-index:500","transition:border-color 0.15s ease, box-shadow 0.15s ease"].join(";")),document.body.appendChild(Io),gs=gi(["position:fixed","bottom:48px","left:50%","transform:translateX(-50%)",`color:${hr}`,"font-family:monospace","font-size:14px","letter-spacing:0.1em",`background:${du}`,"padding:5px 14px","border-radius:4px","border:1px solid rgba(70,224,216,0.3)","pointer-events:none","z-index:500","display:none","text-shadow:0 0 6px rgba(70,224,216,0.5)","white-space:nowrap"].join(";")),document.body.appendChild(gs),To=gi(["position:fixed","inset:0","background:black","opacity:0","pointer-events:none","z-index:1000","transition:opacity 0.35s ease"].join(";")),document.body.appendChild(To),mb(),gb(),vb()}function Sb(n,t,e,i){_a&&(_a.textContent=Rr(n)),hh&&(hh.style.width=`${Math.round(t)}%`),fh&&(fh.style.width=`${Math.round(e)}%`),Ma&&(Ma.textContent=i==="ship"?`STREL-7 · T+${Rr(n)} · CRUISE`:`STREL-7 ⟶ ${i.toUpperCase()}`)}function _b(n){gs&&(gs.textContent=n,gs.style.display="block",Io&&(Io.style.borderColor=hr,Io.style.boxShadow=`0 0 6px ${hr}, 0 0 12px rgba(70,224,216,0.4)`))}function Mb(){gs&&(gs.style.display="none",Io&&(Io.style.borderColor="rgba(255,255,255,0.4)",Io.style.boxShadow="none"))}function pd(n,t=350,e=250){return new Promise(i=>{if(!To){n(),i();return}To.style.transition=`opacity ${t}ms ease`,To.style.opacity="1",setTimeout(()=>{n(),setTimeout(()=>{To&&(To.style.transition=`opacity ${t}ms ease`,To.style.opacity="0"),setTimeout(i,t)},e)},t)})}const c0="#E8E2D4",wb="#46E0D8",yb="#C7641E",l0="start-overlay-style",d0=400;function bb(){if(document.getElementById(l0))return;const n=document.createElement("style");n.id=l0,n.textContent=`
    @keyframes start-overlay-pulse {
      0%, 100% { opacity: 0.4; }
      50%      { opacity: 1; }
    }
    .start-overlay-prompt {
      animation: start-overlay-pulse 1.8s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .start-overlay-prompt { animation: none; opacity: 1; }
    }
  `,document.head.appendChild(n)}function ts(n){const t=document.createElement("div");return t.style.cssText=n,t}function Tb(){if(navigator.webdriver)return;bb();const n=ts(["position:fixed","inset:0","background:radial-gradient(ellipse at center, rgba(4,6,10,0.42) 0%, rgba(4,6,10,0.75) 100%)","display:flex","align-items:center","justify-content:center","pointer-events:none","z-index:700","opacity:1",`transition:opacity ${d0}ms ease`].join(";")),t=ts(["display:flex","flex-direction:column","align-items:center","text-align:center","font-family:monospace","pointer-events:none","gap:14px","padding:32px 40px"].join(";")),e=ts([`color:${c0}`,"font-size:32px","letter-spacing:0.26em","font-weight:700","text-shadow:0 0 20px rgba(70,224,216,0.35)"].join(";"));e.textContent="STARSHIP EXPLORER";const i=ts([`color:${yb}`,"font-size:12px","letter-spacing:0.4em","opacity:0.85"].join(";"));i.textContent="— STREL-7 —";const o=ts(["width:240px","height:1px","background:rgba(70,224,216,0.35)","margin:4px 0"].join(";")),s=ts([`color:${wb}`,"font-size:12px","letter-spacing:0.06em","opacity:0.85"].join(";"));s.textContent="WASD — move  ·  MOUSE — look (click to capture)  ·  E — interact  ·  ` — debug";const r=ts([`color:${c0}`,"font-size:14px","letter-spacing:0.3em","margin-top:8px"].join(";"));r.className="start-overlay-prompt",r.textContent="CLICK TO BOARD",t.appendChild(e),t.appendChild(i),t.appendChild(o),t.appendChild(s),t.appendChild(r),n.appendChild(t),document.body.appendChild(n);const a=()=>{window.removeEventListener("pointerdown",a),window.removeEventListener("keydown",a),n.style.opacity="0",setTimeout(()=>n.remove(),d0)};window.addEventListener("pointerdown",a),window.addEventListener("keydown",a)}const Ol={orange:"#C7641E",teal:"#46E0D8",gunmetal:"#1C1E22",red:"#7A2C1F"};function Te(n){let t=n;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function oo(n,t,e,i,o=.18,s=1){const r=Te(i),a=Math.floor(t*e/1200*s);for(let h=0;h<a;h++){const f=r()*t,m=r()*e,v=4+r()*16,p=(.03+r()*.09)*o*6;n.beginPath(),n.ellipse(f,m,v*(.5+r()),v*(.3+r()*.4),r()*Math.PI,0,Math.PI*2),n.fillStyle=`rgba(0,0,0,${p.toFixed(3)})`,n.fill()}const c=Math.floor(t/60);for(let h=0;h<c;h++){const f=r()*t,m=r()*e,v=10+r()*60,p=r()*Math.PI;n.beginPath(),n.moveTo(f,m),n.lineTo(f+Math.cos(p)*v,m+Math.sin(p)*v),n.strokeStyle=`rgba(0,0,0,${(.04+r()*.06)*o*6})`,n.lineWidth=.5+r(),n.stroke()}const l=n.getImageData(0,0,t,e),d=l.data,u=3;for(let h=0;h<d.length;h+=4*u){const f=(r()-.5)*o*40;d[h]=Math.max(0,Math.min(255,d[h]+f)),d[h+1]=Math.max(0,Math.min(255,d[h+1]+f)),d[h+2]=Math.max(0,Math.min(255,d[h+2]+f))}n.putImageData(l,0,0)}function Eb(n,t,e,i,o,s="rgba(30,20,10,0.55)",r=2){n.strokeStyle=s,n.lineWidth=r;for(let a=i;a<t;a+=i)n.beginPath(),n.moveTo(a,0),n.lineTo(a,e),n.stroke();for(let a=o;a<e;a+=o)n.beginPath(),n.moveTo(0,a),n.lineTo(t,a),n.stroke()}const uu=new Map,_v=[];function $t(n,t,e=!1){if(!uu.has(n)){const i=t();e&&(i.colorSpace=Ke),_v.push(i),uu.set(n,i)}return uu.get(n)}function Ab(n){const t=n.capabilities.getMaxAnisotropy();for(const e of _v)e.anisotropy=t,e.needsUpdate=!0}const Ie=2048,Re=3072,Cb=2/Ie,Mv=3/Re,Rc=Math.round(.35/Mv),$e=20,Ul=12,cn=40,Eo=18,wv="#C7641E",Rb="#2A2D33";function sf(n){const t=[.8,1.2].map(l=>Math.round(l/Cb)),e=[1.1,.9,1].map(l=>Math.round(l/Mv));let i=0;const o=[];for(let l=0;i<Ie;l++){const d=Math.min(t[l%t.length],Ie-i);o.push(d),i+=d}let s=0;const r=[];for(let l=0;s<Re;l++){const d=Math.min(e[l%e.length],Re-s);r.push(d),s+=d}const a=[];let c=0;for(const l of r){let d=0;for(const u of o)a.push({x:d,y:c,w:u,h:l}),d+=u;c+=l}return a}function yv(n,t,e){const i=n.canvas.width,o=n.canvas.height,s=new Set,r=new Set;for(const a of t)a.x>0&&s.add(a.x),a.y>0&&r.add(a.y),s.add(a.x+a.w),r.add(a.y+a.h);s.delete(i),r.delete(o);for(const a of s){for(const c of r){if(e()>.55)continue;const l=60+e()*180,d=6+e()*12,u=.07+e()*.1,h=n.createLinearGradient(a,c,a,c+l);h.addColorStop(0,`rgba(8,6,4,${u.toFixed(3)})`),h.addColorStop(.6,`rgba(8,6,4,${(u*.4).toFixed(3)})`),h.addColorStop(1,"rgba(8,6,4,0)"),n.fillStyle=h,n.fillRect(a-d/2,c,d,l)}for(const c of t)if(!(c.x!==a&&c.x+c.w!==a))for(const l of[c.y+cn,c.y+c.h-cn]){if(e()>.4)continue;const d=40+e()*100,u=4+e()*8,h=.05+e()*.08,f=n.createLinearGradient(a,l,a,l+d);f.addColorStop(0,`rgba(8,6,4,${h.toFixed(3)})`),f.addColorStop(1,"rgba(8,6,4,0)"),n.fillStyle=f,n.fillRect(a-u/2,l,u,d)}}}function bv(n,t,e){for(const i of t){if(e()>.15)continue;const o=$e+20,s=i.x+o,r=i.y+o,a=i.w-o*2,c=i.h-o*2;a<40||c<40||(n.strokeStyle="rgba(0,0,0,0.40)",n.lineWidth=3,n.strokeRect(s,r,a,c),n.strokeStyle="rgba(255,255,255,0.18)",n.lineWidth=2,n.strokeRect(s+4,r+4,a-8,c-8))}}function u0(n,t,e){const i=Math.ceil($e/2)+2;n.fillStyle=e,n.fillRect(t.x+i,t.y+i,t.w-i*2,t.h-i*2)}function Tv(n,t,e){const i=5+Math.floor(e()*3),o=Math.ceil($e/2)+8,r=(t.h-o*2)/(i+1),a=8,c=Math.max(40,t.w-o*4),l=t.x+o+(t.w-o*2-c)/2;for(let d=1;d<=i;d++){const u=t.y+o+r*d-a/2;n.fillStyle="rgba(10,8,5,0.88)",n.fillRect(l,u,c,a),n.fillStyle="rgba(255,220,180,0.22)",n.fillRect(l,u,c,2)}}function Pb(n,t,e){const i=3+Math.floor(e()*4);for(let o=0;o<i;o++){const s=t.x+e()*t.w,r=t.y+e()*t.h,a=12+e()*40,c=(e()-.5)*.5;n.beginPath(),n.moveTo(s,r),n.lineTo(s+Math.cos(c)*a,r+Math.sin(c)*a),n.strokeStyle=`rgba(255,200,150,${(.15+e()*.15).toFixed(3)})`,n.lineWidth=1+e()*1,n.stroke()}}function Ev(n,t,e){for(const i of t){const o=e();o<.08?(u0(n,i,wv),Tv(n,i,e),Pb(n,i,e)):o<.12&&u0(n,i,Rb)}}function Av(n,t){const e=Re-Rc;n.fillStyle="rgba(0,0,0,0.18)",n.fillRect(0,e,Ie,Rc);for(let i=0;i<28;i++){const o=t()*Ie,s=e+t()*Rc;n.beginPath(),n.ellipse(o,s,20+t()*80,6+t()*24,0,0,Math.PI*2),n.fillStyle=`rgba(0,0,0,${(.06+t()*.1).toFixed(3)})`,n.fill()}for(let i=0;i<18;i++){const o=e+t()*Rc;n.beginPath(),n.moveTo(t()*Ie,o),n.lineTo(t()*Ie,o+(t()-.5)*8),n.strokeStyle=`rgba(0,0,0,${(.06+t()*.08).toFixed(3)})`,n.lineWidth=2+t()*4,n.stroke()}}function Lb(n){const t=document.createElement("canvas");t.width=Ie,t.height=Re;const e=t.getContext("2d");e.fillStyle="#808080",e.fillRect(0,0,Ie,Re);const i=Math.floor($e/2),o=new Set,s=new Set;for(const a of n)a.x>0&&o.add(a.x),a.y>0&&s.add(a.y),o.add(a.x+a.w),s.add(a.y+a.h);o.delete(Ie),s.delete(Re);const r=4;for(const a of o){const c=a-i;e.fillStyle="rgba(10,10,10,1)",e.fillRect(c+r,0,Ul,Re),e.fillStyle="rgba(60,60,60,1)",e.fillRect(c,0,r,Re),e.fillStyle="rgba(55,55,55,1)",e.fillRect(c+$e-r,0,r,Re)}for(const a of s){const c=a-i;e.fillStyle="rgba(10,10,10,1)",e.fillRect(0,c+r,Ie,Ul),e.fillStyle="rgba(60,60,60,1)",e.fillRect(0,c,Ie,r),e.fillStyle="rgba(55,55,55,1)",e.fillRect(0,c+$e-r,Ie,r)}for(const a of n)for(const[c,l]of[[a.x+cn,a.y+cn],[a.x+a.w-cn,a.y+cn],[a.x+cn,a.y+a.h-cn],[a.x+a.w-cn,a.y+a.h-cn]]){if(c<$e||c>Ie-$e||l<$e||l>Re-$e)continue;const d=e.createRadialGradient(c,l,0,c,l,Eo+8);d.addColorStop(0,"rgba(235,235,235,1)"),d.addColorStop(.5,"rgba(165,165,165,0.9)"),d.addColorStop(1,"rgba(128,128,128,0)"),e.beginPath(),e.arc(c,l,Eo+8,0,Math.PI*2),e.fillStyle=d,e.fill()}return t}function Db(n){const t=n.width,e=n.height,o=n.getContext("2d").getImageData(0,0,t,e).data,s=document.createElement("canvas");s.width=t,s.height=e;const r=s.getContext("2d"),a=r.createImageData(t,e),c=a.data;function l(u,h){const f=Math.max(0,Math.min(t-1,u)),m=Math.max(0,Math.min(e-1,h));return o[(m*t+f)*4]/255}const d=13;for(let u=0;u<e;u++)for(let h=0;h<t;h++){const f=-l(h-1,u-1)-2*l(h-1,u)-l(h-1,u+1)+l(h+1,u-1)+2*l(h+1,u)+l(h+1,u+1),m=-l(h-1,u-1)-2*l(h,u-1)-l(h+1,u-1)+l(h-1,u+1)+2*l(h,u+1)+l(h+1,u+1),v=-f*d,p=-m*d,g=1,S=Math.sqrt(v*v+p*p+g*g),x=(u*t+h)*4;c[x]=Math.round((v/S*.5+.5)*255),c[x+1]=Math.round((p/S*.5+.5)*255),c[x+2]=Math.round((g/S*.5+.5)*255),c[x+3]=255}return r.putImageData(a,0,0),s}function Cv(){return $t("wall-normal-map-v4",()=>{const n=sf(),t=Lb(n),e=Db(t),i=new yt(e);return i.wrapS=Dt,i.wrapT=Dt,i.repeat.set(1,1),i})}function Rv(n,t){const e=new Set,i=new Set;for(const r of t)r.x>0&&e.add(r.x),r.y>0&&i.add(r.y),e.add(r.x+r.w),i.add(r.y+r.h);e.delete(Ie),i.delete(Re);const o=Math.floor($e/2),s=4;for(const r of e){const a=r-o;n.fillStyle="rgba(4,3,2,0.95)",n.fillRect(a+s,0,Ul,Re),n.fillStyle="rgba(255,255,255,0.28)",n.fillRect(a,0,s,Re),n.fillStyle="rgba(0,0,0,0.55)",n.fillRect(a+$e-s,0,s,Re)}for(const r of i){const a=r-o;n.fillStyle="rgba(4,3,2,0.95)",n.fillRect(0,a+s,Ie,Ul),n.fillStyle="rgba(255,255,255,0.28)",n.fillRect(0,a,Ie,s),n.fillStyle="rgba(0,0,0,0.55)",n.fillRect(0,a+$e-s,Ie,s)}}function Pv(n,t){for(const e of t)for(const[i,o]of[[e.x+cn,e.y+cn],[e.x+e.w-cn,e.y+cn],[e.x+cn,e.y+e.h-cn],[e.x+e.w-cn,e.y+e.h-cn]]){if(i<$e||i>Ie-$e||o<$e||o>Re-$e)continue;const s=n.createRadialGradient(i+4,o+6,0,i+4,o+6,Eo+8);s.addColorStop(0,"rgba(0,0,0,0.55)"),s.addColorStop(.6,"rgba(0,0,0,0.25)"),s.addColorStop(1,"rgba(0,0,0,0)"),n.beginPath(),n.arc(i+4,o+6,Eo+8,0,Math.PI*2),n.fillStyle=s,n.fill();const r=n.createRadialGradient(i-4,o-4,0,i,o,Eo);r.addColorStop(0,"rgba(215,210,200,0.95)"),r.addColorStop(.4,"rgba(150,145,135,0.9)"),r.addColorStop(1,"rgba(55,50,45,0.85)"),n.beginPath(),n.arc(i,o,Eo,0,Math.PI*2),n.fillStyle=r,n.fill(),n.beginPath(),n.arc(i,o,Eo,0,Math.PI*2),n.strokeStyle="rgba(0,0,0,0.60)",n.lineWidth=3,n.stroke(),n.beginPath(),n.arc(i,o,Eo*.55,Math.PI*1.15,Math.PI*1.85),n.strokeStyle="rgba(255,250,240,0.80)",n.lineWidth=4,n.stroke()}}function Lv(n,t,e,i=198){n.fillStyle=`rgb(${i},${i-6},${i-17})`,n.fillRect(0,0,Ie,Re);const o=Math.ceil($e/2)+2;for(const s of t){const r=(e()-.5)*.18*255,a=Math.round(Math.max(145,Math.min(222,i+r))),c=a,l=Math.round(Math.max(135,Math.min(212,a-6))),d=Math.round(Math.max(120,Math.min(202,a-17))),u=s.x+o,h=s.y+o,f=s.w-o*2,m=s.h-o*2;if(f<=0||m<=0)continue;const v=n.createLinearGradient(u,h,u,h+m);v.addColorStop(0,`rgb(${Math.min(255,c+10)},${Math.min(255,l+10)},${Math.min(255,d+10)})`),v.addColorStop(1,`rgb(${c},${l},${d})`),n.fillStyle=v,n.fillRect(u,h,f,m)}}function h0(){return $t("cream-wall-v4",()=>{const n=document.createElement("canvas");n.width=Ie,n.height=Re;const t=n.getContext("2d"),e=Te(37),i=sf();Lv(t,i,e),Ev(t,i,Te(71)),Rv(t,i),yv(t,i,Te(131)),bv(t,i,Te(157)),Pv(t,i),oo(t,Ie,Re,7,.03,.25),Av(t,Te(199));const o=new yt(n);return o.wrapS=Dt,o.wrapT=Dt,o.repeat.set(1,1),o},!0)}function f0(){return $t("cream-orange-band-v4",()=>{const n=document.createElement("canvas");n.width=Ie,n.height=Re;const t=n.getContext("2d"),e=Te(53),i=sf();Lv(t,i,e);const o=Re-Math.round(1.1/3*Re),s=Re-Math.round(.7/3*Re),r=Math.ceil($e/2)+2;for(const c of i){const l=c.y+c.h/2;l>=o&&l<=s&&(t.fillStyle=wv,t.fillRect(c.x+r,c.y+r,c.w-r*2,c.h-r*2),Tv(t,c,Te(c.x+c.y)))}Ev(t,i,Te(83)),Rv(t,i),yv(t,i,Te(139)),bv(t,i,Te(163)),Pv(t,i),oo(t,Ie,Re,13,.03,.25),Av(t,Te(211));const a=new yt(n);return a.wrapS=Dt,a.wrapT=Dt,a.repeat.set(1,1),a},!0)}function p0(){return $t("gunmetal-floor-v3",()=>{const t=document.createElement("canvas");t.width=2048,t.height=2048;const e=t.getContext("2d");e.fillStyle="#1C1E22",e.fillRect(0,0,2048,2048);const i=1024,o=10,s=Math.floor(o/2);for(const d of[[i]])for(const u of d)e.fillStyle="rgba(8,7,6,0.9)",e.fillRect(u-s+1,0,o-2,2048),e.fillStyle="rgba(255,255,255,0.07)",e.fillRect(u-s,0,1,2048),e.fillStyle="rgba(0,0,0,0.4)",e.fillRect(u-s+o-1,0,1,2048),e.fillStyle="rgba(8,7,6,0.9)",e.fillRect(0,u-s+1,2048,o-2),e.fillStyle="rgba(255,255,255,0.07)",e.fillRect(0,u-s,2048,1),e.fillStyle="rgba(0,0,0,0.4)",e.fillRect(0,u-s+o-1,2048,1);const r=Te(88),a=[[0,0],[i,i]];for(const[d,u]of a)for(let f=0;f<6;f++){const m=d+80+r()*(i-160),v=u+80+r()*(i-160),p=24+r()*36,g=10+r()*16,S=r()*Math.PI;e.beginPath(),e.ellipse(m,v,p,g,S,0,Math.PI*2),e.strokeStyle="rgba(80,85,90,0.55)",e.lineWidth=3,e.stroke(),e.beginPath(),e.ellipse(m,v,p-6,g-3,S,0,Math.PI*2),e.fillStyle="rgba(255,255,255,0.04)",e.fill()}const c=Te(55);for(let d=0;d<22;d++){const u=c()*2048,h=6+c()*36,f=2048*(.3+c()*.7),m=c()*2048,v=40+Math.floor(c()*24),p=e.createLinearGradient(u-h,m,u+h,m);p.addColorStop(0,"#1C1E22"),p.addColorStop(.3,`rgb(${v},${v+1},${v+3})`),p.addColorStop(.5,`rgb(${v},${v+1},${v+3})`),p.addColorStop(.7,`rgb(${v},${v+1},${v+3})`),p.addColorStop(1,"#1C1E22"),e.fillStyle=p,e.fillRect(u-h,m,h*2,f)}oo(e,2048,2048,55,.1);const l=new yt(t);return l.wrapS=Dt,l.wrapT=Dt,l.repeat.set(1,1),l},!0)}function Ib(){return $t("floor-roughness-map-v3",()=>{const t=document.createElement("canvas");t.width=2048,t.height=2048;const e=t.getContext("2d");e.fillStyle="#808080",e.fillRect(0,0,2048,2048);const i=Te(42);for(let r=0;r<20;r++){const a=i()*2048,c=10+i()*48,l=2048*(.4+i()*.6),d=i()*2048,u=Math.floor(48+i()*24),h=e.createLinearGradient(a-c,d,a+c,d);h.addColorStop(0,"#808080"),h.addColorStop(.3,`rgb(${u},${u},${u})`),h.addColorStop(.5,`rgb(${u},${u},${u})`),h.addColorStop(.7,`rgb(${u},${u},${u})`),h.addColorStop(1,"#808080"),e.fillStyle=h,e.fillRect(a-c,d,c*2,l)}for(let r=0;r<30;r++){const a=i()*2048,c=i()*2048,l=6+i()*24,d=Math.floor(144+i()*40);e.beginPath(),e.ellipse(a,c,l,l*(.3+i()*.4),i()*Math.PI,0,Math.PI*2),e.fillStyle=`rgba(${d},${d},${d},0.6)`,e.fill()}const o=1024;e.strokeStyle="rgba(168,168,168,0.55)",e.lineWidth=10,e.beginPath(),e.moveTo(o,0),e.lineTo(o,2048),e.stroke(),e.beginPath(),e.moveTo(0,o),e.lineTo(2048,o),e.stroke();const s=new yt(t);return s.wrapS=Dt,s.wrapT=Dt,s.repeat.set(1,1),s})}function m0(){return $t("gunmetal-ceiling-v2",()=>{const t=document.createElement("canvas");t.width=1024,t.height=1024;const e=t.getContext("2d");e.fillStyle="#1a1c20",e.fillRect(0,0,1024,1024),e.strokeStyle="rgba(0,0,0,0.6)",e.lineWidth=4;for(let s=256;s<1024;s+=256)e.beginPath(),e.moveTo(s,0),e.lineTo(s,1024),e.stroke();for(let s=256;s<1024;s+=256)e.beginPath(),e.moveTo(0,s),e.lineTo(1024,s),e.stroke();const i=Te(77);for(let s=0;s<4;s++)for(let r=0;r<4;r++)if((r+s)%2===0){const a=(i()*.04+.02).toFixed(3);e.fillStyle=`rgba(255,255,255,${a})`,e.fillRect(r*256+8,s*256+8,240,240)}oo(e,1024,1024,33,.08);const o=new yt(t);return o.wrapS=Dt,o.wrapT=Dt,o},!0)}function Nb(){return $t("console-screen-v2",()=>{const t=document.createElement("canvas");t.width=512,t.height=512;const e=t.getContext("2d");e.fillStyle="#050810",e.fillRect(0,0,512,512),e.strokeStyle="rgba(70,224,216,0.15)",e.lineWidth=1;const i=32;for(let f=0;f<=512;f+=i)e.beginPath(),e.moveTo(f,0),e.lineTo(f,512),e.stroke();for(let f=0;f<=512;f+=i)e.beginPath(),e.moveTo(0,f),e.lineTo(512,f),e.stroke();const o=Te(303),s=[];for(let f=0;f<12;f++){const m=Math.floor(o()*(512/i))*i,v=Math.floor(o()*(512/i))*i,p=Math.floor(o()*(512/i))*i,g=Math.floor(o()*(512/i))*i;s.push([m,v,p,g])}e.strokeStyle="rgba(70,224,216,0.30)",e.lineWidth=4;for(const[f,m,v,p]of s)e.beginPath(),e.moveTo(f,m),e.lineTo(v,m),e.lineTo(v,p),e.stroke();e.strokeStyle="rgba(190,255,248,1.0)",e.lineWidth=1.5;for(const[f,m,v,p]of s)e.beginPath(),e.moveTo(f,m),e.lineTo(v,m),e.lineTo(v,p),e.stroke();const r=Te(404),a=512*.2,c=[];for(let f=0;f<=512;f+=4)c.push((r()-.5)*30);const l=(f,m)=>{e.strokeStyle=f,e.lineWidth=m,e.beginPath(),e.moveTo(0,a);let v=0;for(let p=0;p<=512;p+=4)e.lineTo(p,a+c[v]),v++;e.stroke()};l("rgba(70,224,216,0.25)",5),l("rgba(200,255,250,0.95)",2);const d=Te(505);for(let f=0;f<18;f++){const m=Math.floor(d()*(512/i))*i,v=Math.floor(d()*(512/i))*i;e.beginPath(),e.arc(m,v,4.5,0,Math.PI*2),e.fillStyle="rgba(70,224,216,0.35)",e.fill(),e.beginPath(),e.arc(m,v,2.2,0,Math.PI*2),e.fillStyle="rgba(220,255,250,1.0)",e.fill()}e.fillStyle="rgba(150,240,232,0.85)",e.font="13px monospace";const u=["PWR 94%","NAV OK","ENG 87%","HULL OK","ATM 100"];for(let f=0;f<u.length;f++)e.fillText(u[f],8+f*100,496);const h=new yt(t);return h.wrapS=Dt,h.wrapT=Dt,h},!0)}function Ob(){return $t("teal-strip-v2",()=>{const e=document.createElement("canvas");e.width=64,e.height=64;const i=e.getContext("2d");i.fillStyle=Ol.teal,i.fillRect(0,0,64,64);const o=64/2,s=10,r=i.createLinearGradient(0,o-s,0,o+s);r.addColorStop(0,"rgba(255,255,255,0.0)"),r.addColorStop(.4,"rgba(255,255,255,0.05)"),r.addColorStop(.5,"rgba(255,255,255,1.0)"),r.addColorStop(.6,"rgba(255,255,255,0.05)"),r.addColorStop(1,"rgba(255,255,255,0.0)"),i.fillStyle=r,i.fillRect(0,o-s,64,s*2);const a=new yt(e);return a.wrapS=Dt,a.wrapT=Dt,a},!0)}function Ub(){return $t("ceiling-light",()=>{const e=document.createElement("canvas");e.width=256,e.height=128;const i=e.getContext("2d");i.fillStyle="#C89850",i.fillRect(0,0,256,128);const o=i.createRadialGradient(256/2,128/2,0,256/2,128/2,Math.max(256,128)*.62);return o.addColorStop(0,"rgba(255,255,255,1.00)"),o.addColorStop(.06,"rgba(255,250,235,0.90)"),o.addColorStop(.18,"rgba(255,235,200,0.20)"),o.addColorStop(.45,"rgba(140,95,40,0.40)"),o.addColorStop(1,"rgba(60,35,10,0.80)"),i.fillStyle=o,i.fillRect(0,0,256,128),new yt(e)},!0)}function g0(){return $t("orange-frame",()=>{const e=document.createElement("canvas");e.width=256,e.height=256;const i=e.getContext("2d");i.fillStyle="#C7641E",i.fillRect(0,0,256,256);const o=Te(1127);for(let u=0;u<256;u++){const h=(o()-.5)*2*.08,f=.08+o()*.1;i.fillStyle=h>0?`rgba(255,255,255,${(f*h/.08).toFixed(3)})`:`rgba(0,0,0,${(f*-h/.08).toFixed(3)})`;const m=Math.floor(o()*4);i.fillRect(u,m,1,256-m-Math.floor(o()*4))}const s=Math.floor(256*.1),r=i.createLinearGradient(0,0,s,0);r.addColorStop(0,"rgba(255,210,160,0.50)"),r.addColorStop(.4,"rgba(255,190,130,0.22)"),r.addColorStop(1,"rgba(255,190,130,0.00)"),i.fillStyle=r,i.fillRect(0,0,s,256);const a=i.createLinearGradient(256,0,256-s,0);a.addColorStop(0,"rgba(255,210,160,0.50)"),a.addColorStop(.4,"rgba(255,190,130,0.22)"),a.addColorStop(1,"rgba(255,190,130,0.00)"),i.fillStyle=a,i.fillRect(256-s,0,s,256);const c=Te(2251);for(let u=0;u<18;u++){const h=Math.floor(c()*256),f=Math.floor(c()*256),m=Math.ceil(2+c()*5),v=Math.ceil(1+c()*3);i.fillStyle=`rgba(28,30,34,${(.55+c()*.35).toFixed(3)})`,i.fillRect(h,f,m,v),c()>.4&&(i.fillStyle="rgba(220,180,140,0.45)",i.fillRect(h,f-1,m,1))}const l=i.createLinearGradient(0,256*.55,0,256);l.addColorStop(0,"rgba(0,0,0,0.00)"),l.addColorStop(1,"rgba(18,10,6,0.16)"),i.fillStyle=l,i.fillRect(0,0,256,256),oo(i,256,256,88,.15);const d=new yt(e);return d.wrapS=Dt,d.wrapT=Dt,d},!0)}function Fb(){return $t("hazard-striping",()=>{const t=document.createElement("canvas");t.width=512,t.height=512;const e=t.getContext("2d");e.fillStyle=Ol.gunmetal,e.fillRect(0,0,512,512);const i=64;e.save(),e.rotate(Math.PI/4);for(let s=-512*2;s<512*3;s+=i*2)e.fillStyle=Ol.orange,e.fillRect(s,-512*2,i,512*5);e.restore(),oo(e,512,512,201,.15);const o=new yt(t);return o.wrapS=Dt,o.wrapT=Dt,o},!0)}function zb(){return $t("red-accent",()=>{const t=document.createElement("canvas");t.width=512,t.height=512;const e=t.getContext("2d");e.fillStyle=Ol.red,e.fillRect(0,0,512,512),Eb(e,512,512,256,256,"rgba(0,0,0,0.5)",2),oo(e,512,512,177,.18);const i=new yt(t);return i.wrapS=Dt,i.wrapT=Dt,i},!0)}const Bb=new URLSearchParams(typeof window<"u"?window.location.search:""),ka=Bb.get("materials")!=="flat";function mi(n,t,e){return n.repeat.set(t,e),n}const Fl=ka?(()=>{const n=h0();n.repeat.set(1,1);const t=new Ft({map:n,roughness:.8,metalness:.08,envMapIntensity:.2,side:It});{const e=Cv();e.repeat.set(1,1),t.normalMap=e,t.normalScale.set(.5,.5)}return t})():new Gt({map:mi(h0(),1,1),side:It});ka?(()=>{const n=f0();n.repeat.set(1,1);const t=new Ft({map:n,roughness:.8,metalness:.08,envMapIntensity:.2,side:It});{const e=Cv();e.repeat.set(1,1),t.normalMap=e,t.normalScale.set(.5,.5)}return t})():new Gt({map:mi(f0(),1,1),side:It});const Hb=ka?new Ft({map:mi(p0(),1,1),roughnessMap:mi(Ib(),1,1),roughness:.65,metalness:.4,envMapIntensity:.5,side:It}):new Gt({map:mi(p0(),1,1),side:It}),kb=ka?new Ft({map:mi(m0(),2,2),roughness:.55,metalness:.45,envMapIntensity:.5,side:It}):new Gt({map:mi(m0(),2,2),side:It}),ph=new Ft({map:mi(Fb(),2,2),roughness:.75,metalness:.1,envMapIntensity:.25,side:It}),Wb=new Ft({map:mi(zb(),2,2),roughness:.75,metalness:.1,envMapIntensity:.25,side:It}),Dv=new lt({map:Ob(),color:3055256,side:It,toneMapped:!1});new lt({map:Ub(),color:16178356,side:It,toneMapped:!1});const Co=ka?new Ft({map:mi(g0(),1,4),roughness:.4,metalness:.65,envMapIntensity:.55,side:It}):new Gt({map:mi(g0(),1,4),side:It}),Iv=new lt({map:Nb(),side:It,toneMapped:!1}),fn=Fl,Gb=Hb,Vb=kb;function md(n,t,e,i,o,s,r){const a=n.attributes.position,c=n.attributes.uv;if(!c||!a)return;const l=a.count;for(let d=0;d<l;d++){const u=a.getX(d),h=a.getY(d),f=(u+t/2+s)/i,m=(h+e/2+r)/o;c.setXY(d,f,m)}c.needsUpdate=!0}const Xb=2,Yb=3;function mo(n,t,e,i,o,s,r,a){const c=new qt(t,e);md(c,t,e,Xb,Yb,r,a);const l=new L(c,s);l.position.set(i.x,i.y,i.z),o!==0&&(l.rotation.y=o),n.add(l)}function qb(n,t,e,i,o,s=fn,r={x:0,y:0,z:0}){const c=[],l=t.offset??0,d=t.yBot,u=d+t.h,h=e/2,f=o/2,m=d,v=i-u,p=t.h;if(t.wall==="fore"||t.wall==="aft"){const g=t.wall==="fore"?-f:f,S=t.wall==="fore"?0:Math.PI,x=r.x-h,w=l-t.w/2,E=l+t.w/2,b=w+h,T=h-E;m>.01&&(mo(n,e,m,{x:0,y:m/2,z:g},S,s,x,0),c.push({minX:-h,minY:0,minZ:g-.05,maxX:h,maxY:m,maxZ:g+.05})),v>.01&&(mo(n,e,v,{x:0,y:u+v/2,z:g},S,s,x,u),c.push({minX:-h,minY:u,minZ:g-.05,maxX:h,maxY:i,maxZ:g+.05})),b>.01&&(mo(n,b,p,{x:-h+b/2,y:d+p/2,z:g},S,s,x,d),c.push({minX:-h,minY:d,minZ:g-.05,maxX:-h+b,maxY:u,maxZ:g+.05})),T>.01&&(mo(n,T,p,{x:h-T/2,y:d+p/2,z:g},S,s,x+b+t.w,d),c.push({minX:h-T,minY:d,minZ:g-.05,maxX:h,maxY:u,maxZ:g+.05})),c.push({minX:w,minY:d,minZ:g-.05,maxX:E,maxY:u,maxZ:g+.05})}else{const g=t.wall==="port"?-h:h,S=t.wall==="port"?Math.PI/2:-Math.PI/2,x=r.z-f,w=l-t.w/2,E=l+t.w/2,b=w+f,T=f-E;m>.01&&(mo(n,o,m,{x:g,y:m/2,z:0},S,s,x,0),c.push({minX:g-.05,minY:0,minZ:-f,maxX:g+.05,maxY:m,maxZ:f})),v>.01&&(mo(n,o,v,{x:g,y:u+v/2,z:0},S,s,x,u),c.push({minX:g-.05,minY:u,minZ:-f,maxX:g+.05,maxY:i,maxZ:f})),b>.01&&(mo(n,b,p,{x:g,y:d+p/2,z:-f+b/2},S,s,x,d),c.push({minX:g-.05,minY:d,minZ:-f,maxX:g+.05,maxY:u,maxZ:-f+b})),T>.01&&(mo(n,T,p,{x:g,y:d+p/2,z:f-T/2},S,s,x+b+t.w,d),c.push({minX:g-.05,minY:d,minZ:f-T,maxX:g+.05,maxY:u,maxZ:f})),c.push({minX:g-.05,minY:d,minZ:w,maxX:g+.05,maxY:u,maxZ:E})}return c}function Qt(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),o=new Set(Object.keys(n[0].morphAttributes)),s={},r={},a=n[0].morphTargetsRelative,c=new ce;let l=0;for(let d=0;d<n.length;++d){const u=n[d];let h=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),h++}if(h!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!o.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,d),l+=f}}if(e){let d=0;const u=[];for(let h=0;h<n.length;++h){const f=n[h].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+d);d+=n[h].attributes.position.count}c.setIndex(u)}for(const d in s){const u=v0(s[d]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,u)}for(const d in r){const u=r[d][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let h=0;h<u;++h){const f=[];for(let v=0;v<r[d].length;++v)f.push(r[d][v][h]);const m=v0(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(m)}}return c}function v0(n){let t,e,i,o=-1,s=0;for(let l=0;l<n.length;++l){const d=n[l];if(t===void 0&&(t=d.array.constructor),t!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=d.itemSize),e!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=d.normalized),i!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(o===-1&&(o=d.gpuType),o!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=d.count*e}const r=new t(s),a=new re(r,e,i);let c=0;for(let l=0;l<n.length;++l){const d=n[l];if(d.isInterleavedBufferAttribute){const u=c/e;for(let h=0,f=d.count;h<f;h++)for(let m=0;m<e;m++){const v=d.getComponent(h,m);a.setComponent(h+u,m,v)}}else r.set(d.array,c);c+=d.count*e}return o!==void 0&&(a.gpuType=o),a}function Zb(){return $t("fixture-diffuser",()=>{const e=document.createElement("canvas");e.width=128,e.height=64;const i=e.getContext("2d");i.fillStyle="#8B5A10",i.fillRect(0,0,128,64);const o=128/2,s=64/2,r=Math.max(128,64)*.55,a=i.createRadialGradient(o,s,0,o,s,r);a.addColorStop(0,"rgba(255,255,255,1.00)"),a.addColorStop(.08,"rgba(255,250,235,0.85)"),a.addColorStop(.2,"rgba(255,235,185,0.50)"),a.addColorStop(.35,"rgba(200,150,60,0.30)"),a.addColorStop(.65,"rgba(80,45,8,0.60)"),a.addColorStop(1,"rgba(20,10,2,0.85)"),i.fillStyle=a,i.fillRect(0,0,128,64);const c=new yt(e);return c.wrapS=ue,c.wrapT=ue,c},!0)}function Kb(){return $t("fixture-diffuser-cool",()=>{const e=document.createElement("canvas");e.width=128,e.height=64;const i=e.getContext("2d");i.fillStyle="#1B3038",i.fillRect(0,0,128,64);const o=128/2,s=64/2,r=Math.max(128,64)*.55,a=i.createRadialGradient(o,s,0,o,s,r);a.addColorStop(0,"rgba(255,255,255,1.00)"),a.addColorStop(.08,"rgba(238,246,252,0.85)"),a.addColorStop(.2,"rgba(200,224,240,0.50)"),a.addColorStop(.35,"rgba(120,168,196,0.30)"),a.addColorStop(.65,"rgba(30,60,76,0.60)"),a.addColorStop(1,"rgba(6,16,22,0.85)"),i.fillStyle=a,i.fillRect(0,0,128,64);const c=new yt(e);return c.wrapS=ue,c.wrapT=ue,c},!0)}function jb(){return $t("fixture-housing",()=>{const t=document.createElement("canvas");t.width=128,t.height=128;const e=t.getContext("2d");e.fillStyle="#1C1E22",e.fillRect(0,0,128,128),e.strokeStyle="rgba(50,55,65,0.35)",e.lineWidth=1;for(let o=0;o<12;o++){const s=o/12*128;e.beginPath(),e.moveTo(0,s),e.lineTo(128,s+Math.sin(o*2.3)*4),e.stroke()}e.strokeStyle="rgba(60,65,75,0.5)",e.lineWidth=2,e.strokeRect(1,1,126,126);const i=new yt(t);return i.wrapS=Dt,i.wrapT=Dt,i},!0)}const Jb=new lt({map:Zb(),color:15779960,side:It,toneMapped:!1}),Qb=new lt({map:Kb(),color:14215410,side:It,toneMapped:!1}),$b=new Gt({map:jb(),color:2237738,side:It}),tT=new URLSearchParams(typeof window<"u"?window.location.search:""),Wa=tT.get("glow")!=="0",xe={teal:4645080,orange:16752688,red:16726830,warm:16773328},eT=.0075,nT=.8,iT=1.5;function oT(){return $t("glow-halation",()=>{const t=document.createElement("canvas");t.width=128,t.height=128;const e=t.getContext("2d"),i=128/2,o=128/2,s=e.createRadialGradient(i,o,0,i,o,128/2);s.addColorStop(0,"rgba(255,236,190,0.35)"),s.addColorStop(.3,"rgba(255,214,150,0.20)"),s.addColorStop(.6,"rgba(255,196,120,0.08)"),s.addColorStop(1,"rgba(255,180,100,0.0)"),e.fillStyle=s,e.fillRect(0,0,128,128);const r=new yt(t);return r.wrapS=ue,r.wrapT=ue,r},!0)}const Nv=16769200,x0=new Map;function sT(n=Nv){let t=x0.get(n);return t||(t=new lt({map:oT(),color:n,transparent:!0,depthWrite:!1,blending:Ae,toneMapped:!1,side:me}),x0.set(n,t)),t}let hu=null;function rT(){if(hu)return hu;const n=new qt(1,1);return n.rotateX(Math.PI/2),hu=n,n}function aT(n,t,e,i=Nv){if(!Wa||t.length===0)return;const o=new tn(rT(),sT(i),t.length);o.name="fixture-halation";const s=e-eT,r=new Lt,a=new He,c=new M(nT,1,iT);for(let l=0;l<t.length;l++)r.compose(new M(t[l].x,s,t[l].z),a,c),o.setMatrixAt(l,r);o.instanceMatrix.needsUpdate=!0,n.add(o)}const fu=.022;let S0=null;function cT(){return S0??(S0=new U(fu,fu,fu*.6))}const _0=new Map;function lT(n){let t=_0.get(n);return t||(t=new lt({color:n,toneMapped:!1}),_0.set(n,t)),t}function Ci(n,t){if(!Wa||t.length===0)return;const e=new Map;for(const s of t){if(s.blink)continue;const r=e.get(s.color)??[];r.push(s.pos),e.set(s.color,r)}const i=cT(),o=new Lt;for(const[s,r]of e){const a=new tn(i,lT(s),r.length);a.name="led-cluster";for(let c=0;c<r.length;c++)o.setPosition(r[c]),a.setMatrixAt(c,o);a.instanceMatrix.needsUpdate=!0,n.add(a)}for(const s of t){if(!s.blink)continue;const r=new lt({color:s.color,toneMapped:!1,transparent:!0}),a=new L(i,r);a.position.copy(s.pos);const c=s.period??2,l=s.phase??0;a.onBeforeRender=()=>{const u=(performance.now()/1e3/c+l)%1;r.opacity=.35+.65*(.5+.5*Math.sin(u*Math.PI*2))},n.add(a)}}function Ua(n,t){if(!Wa)return null;const e=new lt({color:t.color??2808040,transparent:!0,opacity:t.opacity??.35,depthWrite:!1,blending:Ae,toneMapped:!1,side:me}),i=new L(new qt(t.width,t.length),e);return i.position.set(t.x,t.y,t.z),t.rotY&&(i.rotation.y=t.rotY),t.tiltX&&(i.rotation.x+=t.tiltX),n.add(i),i}function dT(){return $t("reactor-core-hot",()=>{const e=document.createElement("canvas");e.width=32,e.height=128;const i=e.getContext("2d");i.fillStyle="#0c2c2a",i.fillRect(0,0,32,128);const o=i.createLinearGradient(0,0,32,0);o.addColorStop(0,"rgba(10,40,38,0.9)"),o.addColorStop(.3,"rgba(120,230,220,0.55)"),o.addColorStop(.5,"rgba(255,255,255,1.0)"),o.addColorStop(.7,"rgba(120,230,220,0.55)"),o.addColorStop(1,"rgba(10,40,38,0.9)"),i.fillStyle=o,i.fillRect(0,0,32,128);const s=new yt(e);return s.wrapS=ue,s.wrapT=ue,s},!0)}const Mn=.005,ha=.55,cl=1.05,Hn=.07,ir=.07,rf=.055,uT=.005,zl=.015,af=ha-Hn*2-zl*2,wa=cl-Hn*2-zl*2,pu=4,hT=.02,fT=.05,Pc=.03,Lc=.06,pT=2;function mT(n){let t=n;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function gT(n,t){return n===3&&t===16?"corridor":n===6&&t===5?"cockpit":n===5&&t===5?"quarters":n===6&&t===6?"galley":n===6&&t===7?"engineering":n===8&&t===9?"cargo":n===8&&t===7?"portal-room":"quarters"}function vT(n,t){const e=[];switch(n){case"cockpit":e.push({x:-1.2,z:.8,grille:t()>.5}),e.push({x:1.2,z:.8,grille:t()>.5});break;case"corridor":e.push({x:0,z:-7,grille:t()>.5}),e.push({x:0,z:-4,grille:t()>.5}),e.push({x:0,z:.5,grille:t()>.5}),e.push({x:0,z:3.5,grille:t()>.5});break;case"quarters":e.push({x:0,z:0,grille:t()>.5});break;case"galley":e.push({x:1.5,z:-.8,grille:t()>.5}),e.push({x:1.5,z:1.2,grille:t()>.5});break;case"engineering":e.push({x:-2,z:-.5,grille:t()>.5}),e.push({x:2,z:-.5,grille:t()>.5});break;case"cargo":e.push({x:-2,z:-2,grille:t()>.5}),e.push({x:0,z:.5,grille:t()>.5}),e.push({x:2,z:2.5,grille:t()>.5});break;case"portal-room":e.push({x:0,z:-2.4,grille:t()>.5}),e.push({x:0,z:-.8,grille:t()>.5}),e.push({x:0,z:.8,grille:t()>.5}),e.push({x:0,z:2.4,grille:t()>.5});break}return e}function xT(n,t,e,i){const o=i-ir/2+Mn,s=cl-Hn*2,r=new U(Hn,ir,cl);r.translate(t-ha/2+Hn/2,o,e),n.push(r);const a=new U(Hn,ir,cl);a.translate(t+ha/2-Hn/2,o,e),n.push(a);const c=new U(ha-Hn*2,ir,Hn);c.translate(t,o,e-s/2-Hn/2),n.push(c);const l=new U(ha-Hn*2,ir,Hn);l.translate(t,o,e+s/2+Hn/2),n.push(l);const d=new U(af+zl,.008,wa+zl);d.translate(t,i-uT-.004,e),n.push(d)}function ST(n,t,e,i){const o=i-rf/2,s=e-wa/2+wa/(pu+1),r=wa/(pu+1);for(let a=0;a<pu;a++){const c=new U(af,hT,fT);c.translate(t,o,s+a*r),n.push(c)}}function _T(n,t,e){const i=new qt(af,wa);return i.rotateX(Math.PI/2),i.translate(n,e-rf,t),i}function M0(n,t,e,i,o){const s=e-Pc-.04,r=o-i,a=new wt(Pc,Pc,r,6);a.rotateX(Math.PI/2),a.translate(t,s,i+r/2),n.push(a);const c=Math.max(2,Math.ceil(r/pT)),l=r/(c-1);for(let d=0;d<c;d++){const u=new U(Lc,Lc,Lc);u.translate(t,s+Pc+Lc/2,i+d*l),n.push(u)}}function MT(n,t,e,i,o){if(t==="corridor")return;const s=e/2,r=o/2,a=.12;M0(n,-s+a,i,-r,r),M0(n,s-a,i,-r,r)}function wT(n,t,e,i,o){const s=o+ir,r=new wt(.015,.015,s,5);r.translate(t,i-s/2,e),n.push(r)}function yT(n,t,e,i){const o=gT(t,i),s=mT(t*1e3+i*100+e*10),r=vT(o,s);if(r.length===0)return;const a=o==="cargo",c=a?.15:0,l=a?Qb:Jb,d=a?13690098:void 0,u=[],h=[];for(const{x:m,z:v,grille:p}of r){const g=e-c;xT(u,m,v,g),p&&ST(u,m,v,g),a&&wT(u,m,v,e,c),h.push(_T(m,v,g))}if(MT(u,o,t,e,i),u.length>0){const m=Qt(u);for(const p of u)p.dispose();const v=new L(m,$b);v.name=`ceiling-housing-${o}`,n.add(v)}if(h.length>0){const m=Qt(h);for(const p of h)p.dispose();const v=new L(m,l);v.name=`ceiling-emissive-${o}`,n.add(v)}const f=e-c-rf;aT(n,r.map(({x:m,z:v})=>({x:m,z:v})),f,d)}const w0=1.4,ll=.3,ke=.12,fr=.1,y0=.07,go=.06,jn=.06;function b0(n,t,e,i,o,s,r){const a=e/2,c=i/2,l=ll,d=[];if(t==="fore"||t==="aft"){const h=t==="fore"?-c:c,f=new U(ke,s,l);f.translate(r-o/2-ke/2,s/2,h),d.push(f);const m=new U(ke,s,l);m.translate(r+o/2+ke/2,s/2,h),d.push(m);const v=new U(o+ke*2,fr,l);v.translate(r,s+fr/2,h),d.push(v);const p=l-y0*2;{const g=new U(go,s-jn,p);g.translate(r-o/2+ke-go/2,(s-jn)/2,h),d.push(g);const S=new U(go,s-jn,p);S.translate(r+o/2-ke+go/2,(s-jn)/2,h),d.push(S);const x=new U(o-ke*2,jn,p);x.translate(r,s-jn/2,h),d.push(x)}}else{const h=t==="port"?-a:a,f=new U(l,s,ke);f.translate(h,s/2,r-o/2-ke/2),d.push(f);const m=new U(l,s,ke);m.translate(h,s/2,r+o/2+ke/2),d.push(m);const v=new U(l,fr,o+ke*2);v.translate(h,s+fr/2,r),d.push(v);const p=l-y0*2;{const g=new U(p,s-jn,go);g.translate(h,(s-jn)/2,r-o/2+ke-go/2),d.push(g);const S=new U(p,s-jn,go);S.translate(h,(s-jn)/2,r+o/2-ke+go/2),d.push(S);const x=new U(p,jn,o-ke*2);x.translate(h,s-jn/2,r),d.push(x)}}const u=Qt(d);for(const h of d)h.dispose();n.add(new L(u,Co))}function bT(n,t,e,i){const r=t/2,a=e/2,c=.025,l=new Map(i.map(u=>[u.wall,u])),d=[];for(const u of["fore","aft"]){const h=l.get(u),f=u==="fore"?-a+c:a-c,m=h?h.gapW??w0:0,v=h?h.offset??0:0;if(h){const p=v-m/2+r,g=r-(v+m/2);if(p>.05){const S=new U(p,.06,.04);S.translate(-r+p/2,.06/2-Mn,f),d.push(S)}if(g>.05){const S=new U(g,.06,.04);S.translate(r-g/2,.06/2-Mn,f),d.push(S)}}else{const p=new U(t,.06,.04);p.translate(0,.06/2-Mn,f),d.push(p)}}for(const u of["port","starboard"]){const h=l.get(u),f=u==="port"?-r+c:r-c,m=h?h.gapW??w0:0,v=h?h.offset??0:0;if(h){const p=v-m/2+a,g=a-(v+m/2);if(p>.05){const S=new U(.04,.06,p);S.translate(f,.06/2-Mn,-a+p/2),d.push(S)}if(g>.05){const S=new U(.04,.06,g);S.translate(f,.06/2-Mn,a-g/2),d.push(S)}}else{const p=new U(.04,.06,e);p.translate(f,.06/2-Mn,0),d.push(p)}}if(d.length>0){const u=Qt(d);for(const h of d)h.dispose();n.add(new L(u,Dv))}}function TT(n,t,e,i){yT(n,t,e,i)}const Xi=2,ri=3,ET=2,AT=2,CT=1.4,RT=2.2;function PT(n,t,e,i,o,s){const r=new qt(n,t);return md(r,n,t,e,i,o,s),r}function vo(n,t,e,i,o,s=0,r=0,a=0,c=0,l=Xi,d=ri){const u=PT(t,e,l,d,a,c),h=new L(u,i);h.position.set(o.x,o.y,o.z),r!==0&&(h.rotation.x=r),s!==0&&(h.rotation.y=s),n.add(h)}function LT(n,t,e,i,o,s,r,a){const l=[],d=s?.gapW??CT,u=s?.gapH??RT,h=s?.offset??0,f=s?.framed??!1,m=e/2,v=o/2,p=Math.ceil(i/ri)*ri-i;if(t==="fore"||t==="aft"){const g=t==="fore"?-v:v,S=t==="fore"?0:Math.PI,x=a.x-m;if(s){const w=h-d/2+m,E=m-(h+d/2),b=i-u;w>.01&&(vo(n,w,i,r,{x:-m+w/2,y:i/2,z:g},S,0,x,p,Xi,ri),l.push({minX:-m,minY:0,minZ:g-.05,maxX:-m+w,maxY:i,maxZ:g+.05})),E>.01&&(vo(n,E,i,r,{x:m-E/2,y:i/2,z:g},S,0,x+w+d,p,Xi,ri),l.push({minX:m-E,minY:0,minZ:g-.05,maxX:m,maxY:i,maxZ:g+.05})),b>.01&&(vo(n,d,b,r,{x:h,y:u+b/2,z:g},S,0,x+w,p+u,Xi,ri),l.push({minX:h-d/2,minY:u,minZ:g-.05,maxX:h+d/2,maxY:i,maxZ:g+.05}))}else vo(n,e,i,r,{x:0,y:i/2,z:g},S,0,x,p,Xi,ri),l.push({minX:-m,minY:0,minZ:g-.05,maxX:m,maxY:i,maxZ:g+.05});f&&s&&b0(n,t,e,o,d,u,h)}else{const g=t==="port"?-m:m,S=t==="port"?Math.PI/2:-Math.PI/2,x=a.z-v;if(s){const w=h-d/2+v,E=v-(h+d/2),b=i-u;w>.01&&(vo(n,w,i,r,{x:g,y:i/2,z:-v+w/2},S,0,x,p,Xi,ri),l.push({minX:g-.05,minY:0,minZ:-v,maxX:g+.05,maxY:i,maxZ:-v+w})),E>.01&&(vo(n,E,i,r,{x:g,y:i/2,z:v-E/2},S,0,x+w+d,p,Xi,ri),l.push({minX:g-.05,minY:0,minZ:v-E,maxX:g+.05,maxY:i,maxZ:v})),b>.01&&(vo(n,d,b,r,{x:g,y:u+b/2,z:h},S,0,x+w,p+u,Xi,ri),l.push({minX:g-.05,minY:u,minZ:h-d/2,maxX:g+.05,maxY:i,maxZ:h+d/2}))}else vo(n,o,i,r,{x:g,y:i/2,z:0},S,0,x,p,Xi,ri),l.push({minX:g-.05,minY:0,minZ:-v,maxX:g+.05,maxY:i,maxZ:v});f&&s&&b0(n,t,e,o,d,u,h)}return l}function Ho(n){const{width:t,height:e,depth:i,doors:o,windows:s=[]}=n,r=n.wallMaterial??fn,a=n.worldOffset??{x:0,z:0},c=new Bt,l=[];{const h=new qt(t,i);md(h,t,i,ET,AT,a.x-t/2,a.z-i/2);const f=new L(h,Gb);f.rotation.x=-Math.PI/2,c.add(f)}{const h=new qt(t,i),f=new L(h,Vb);f.position.y=e,f.rotation.x=Math.PI/2,c.add(f)}TT(c,t,e,i);const d=new Map(o.map(h=>[h.wall,h])),u=new Map(s.map(h=>[h.wall,h]));for(const h of["fore","aft","port","starboard"])u.has(h)?l.push(...qb(c,u.get(h),t,e,i,r,a)):l.push(...LT(c,h,t,e,i,d.get(h)??null,r,a));return bT(c,t,i,o),{group:c,colliders:l}}const Ov=[];function Uv(n){let t=n;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function DT(n){const t=n.width,e=n.height,i=n.getContext("2d");i.fillStyle="#050810",i.fillRect(0,0,t,e),i.strokeStyle="rgba(70,224,216,0.15)",i.lineWidth=1;for(let o=0;o<=t;o+=16)i.beginPath(),i.moveTo(o,0),i.lineTo(o,e),i.stroke();for(let o=0;o<=e;o+=16)i.beginPath(),i.moveTo(0,o),i.lineTo(t,o),i.stroke();i.strokeStyle="rgba(70,224,216,0.8)",i.lineWidth=1.5,i.beginPath(),i.moveTo(0,e*.4);for(let o=0;o<=t;o+=2)i.lineTo(o,e*.4+(Math.random()-.5)*20);i.stroke()}function IT(n){const{canvas:t,ctx:e}=n,i=t.width,o=t.height,s=Math.floor(o*.55),r=Math.floor(o*.1);e.drawImage(t,-4,0),e.fillStyle="#050810",e.fillRect(i-4,r,4,s),e.strokeStyle="rgba(70,224,216,0.85)",e.lineWidth=1.5,e.beginPath();const a=r+s*.45;e.moveTo(i-4,a+(Math.random()-.5)*18),e.lineTo(i,a+(Math.random()-.5)*18),e.stroke();const c=o-20;e.fillStyle="#050810",e.fillRect(0,c,i,20),n.lastPwr=91+(n.lastPwr-91+1)%6;const l=n.cursor?"_":" ";n.cursor=!n.cursor,e.fillStyle="rgba(70,224,216,0.85)",e.font="10px monospace",e.fillText(`PWR ${n.lastPwr}%  NAV OK  ${l}`,4,o-5)}function NT(n,t){const e=n.width,i=n.height,o=n.getContext("2d");o.fillStyle="#020c0b",o.fillRect(0,0,e,i);const s=Uv(707);t.blips=[];for(let r=0;r<6;r++)t.blips.push({a:s()*Math.PI*2,r:.15+s()*.75,age:s()*60});t.sweepAngle=0}function Fv(n){const{canvas:t,ctx:e}=n,i=t.width,o=t.height,s=i*.5,r=o*.52,a=Math.min(i,o)*.42;e.fillStyle="rgba(2,12,11,0.18)",e.fillRect(0,0,i,o),e.strokeStyle="rgba(70,224,216,0.12)",e.lineWidth=.8;for(const l of[.33,.66,1])e.beginPath(),e.arc(s,r,a*l,0,Math.PI*2),e.stroke();e.beginPath(),e.moveTo(s-a,r),e.lineTo(s+a,r),e.moveTo(s,r-a),e.lineTo(s,r+a),e.stroke(),n.sweepAngle=(n.sweepAngle+.06)%(Math.PI*2);const c=e.createConicGradient?e.createConicGradient(n.sweepAngle-.5,s,r):null;c?(c.addColorStop(0,"rgba(70,224,216,0.0)"),c.addColorStop(1,"rgba(70,224,216,0.35)"),e.save(),e.beginPath(),e.moveTo(s,r),e.arc(s,r,a,n.sweepAngle-.5,n.sweepAngle,!1),e.closePath(),e.fillStyle=c,e.fill(),e.restore()):(e.save(),e.strokeStyle="rgba(70,224,216,0.7)",e.lineWidth=2,e.beginPath(),e.moveTo(s,r),e.lineTo(s+Math.cos(n.sweepAngle)*a,r+Math.sin(n.sweepAngle)*a),e.stroke(),e.restore()),e.save(),e.strokeStyle="rgba(70,224,216,0.9)",e.lineWidth=1.5,e.beginPath(),e.moveTo(s,r),e.lineTo(s+Math.cos(n.sweepAngle)*a,r+Math.sin(n.sweepAngle)*a),e.stroke(),e.restore();for(const l of n.blips){l.age++;const d=s+Math.cos(l.a)*a*l.r,u=r+Math.sin(l.a)*a*l.r;Math.abs(((n.sweepAngle-l.a)%(Math.PI*2)+Math.PI*2)%(Math.PI*2))<.12&&(l.age=0);const f=Math.max(0,1-l.age/50);f>.05&&(e.beginPath(),e.arc(d,u,2.5,0,Math.PI*2),e.fillStyle=`rgba(70,224,216,${(f*.9).toFixed(2)})`,e.fill())}e.fillStyle="#020c0b",e.fillRect(0,o-18,i,18),e.fillStyle="rgba(70,224,216,0.7)",e.font="9px monospace",e.fillText("RADAR — 500 km",4,o-4)}function OT(n,t){const e=n.getContext("2d"),i=n.width,o=n.height,s=Uv(808);t.bars=Array.from({length:7},()=>.55+s()*.4),e.fillStyle="#060a08",e.fillRect(0,0,i,o)}const UT=["HULL","ENG","NAV","ATM","PWR","SHLD","FUEL"],FT=["rgba(70,224,216,0.9)","rgba(255,160,60,0.85)","rgba(70,224,216,0.9)","rgba(70,224,216,0.9)","rgba(255,200,60,0.85)","rgba(70,224,216,0.9)","rgba(120,220,120,0.85)"];function zv(n){const{canvas:t,ctx:e}=n,i=t.width,o=t.height;e.fillStyle="#060a08",e.fillRect(0,0,i,o),e.strokeStyle="rgba(70,224,216,0.08)",e.lineWidth=.5;for(let f=o*.1;f<o*.85;f+=o*.75/4)e.beginPath(),e.moveTo(0,f),e.lineTo(i,f),e.stroke();const s=n.bars.length,r=6,a=i-r*2,c=Math.floor(a/s*.6),l=Math.floor(a/s*.4),d=o*.08,u=o*.82,h=u-d;for(let f=0;f<s;f++){n.bars[f]=Math.max(.1,Math.min(1,n.bars[f]+(Math.random()-.5)*.04));const m=r+f*(c+l),v=n.bars[f]*h,p=u-v;e.fillStyle="rgba(70,224,216,0.08)",e.fillRect(m,d,c,h);const g=e.createLinearGradient(0,u,0,p);g.addColorStop(0,FT[f]),g.addColorStop(1,"rgba(70,224,216,0.3)"),e.fillStyle=g,e.fillRect(m,p,c,v),e.fillStyle="rgba(255,255,255,0.5)",e.fillRect(m,p,c,2),e.fillStyle="rgba(70,224,216,0.65)",e.font="7px monospace",e.textAlign="center",e.fillText(UT[f],m+c/2,o-4),e.textAlign="left";const S=Math.round(n.bars[f]*100);e.fillStyle="rgba(255,255,255,0.5)",e.font="7px monospace",e.textAlign="center",e.fillText(`${S}`,m+c/2,p-2),e.textAlign="left"}e.fillStyle="rgba(70,224,216,0.5)",e.font="9px monospace",e.fillText("SYS STATUS",4,o*.06)}function zT(n){const i=document.createElement("canvas");i.width=256,i.height=128;const o=new yt(i),s={type:n,texture:o,canvas:i,ctx:i.getContext("2d"),lastPwr:94,cursor:!1,frame:0,sweepAngle:0,blips:[],bars:[]};return Ov.push(s),n==="waveform"&&DT(i),n==="radar"&&(NT(i,s),Fv(s)),n==="bargraph"&&(OT(i,s),zv(s)),o}function BT(n="waveform"){return new lt({map:zT(n),side:It})}function HT(n){const t=Math.floor(n/16.666666666666668);for(const e of Ov)t%8===e.frame%8&&(e.frame++,e.type==="waveform"&&IT(e),e.type==="radar"&&Fv(e),e.type==="bargraph"&&zv(e),e.texture.needsUpdate=!0)}const ae=512;function kT(n,t,e,i=.09){const o=Te(t);for(let s=0;s<ae;s++){const r=(o()-.5)*2*i,a=.1+o()*.16;n.fillStyle=r>0?`rgba(255,255,255,${(a*r/i).toFixed(3)})`:`rgba(0,0,0,${(a*-r/i).toFixed(3)})`,e?n.fillRect(s,0,1,ae):n.fillRect(0,s,ae,1)}}function cf(n,t,e=26){const i=Te(t);for(let o=0;o<e;o++){const s=i()*ae,r=i()*ae,a=8+i()*26;n.beginPath(),n.ellipse(s,r,a,a*(.3+i()*.4),i()*Math.PI,0,Math.PI*2),n.fillStyle=`rgba(0,0,0,${(.05+i()*.09).toFixed(3)})`,n.fill()}for(let o=0;o<e;o++){const s=i()*ae,r=i()*ae,a=14+i()*40,c=i()*Math.PI;n.beginPath(),n.moveTo(s,r),n.lineTo(s+Math.cos(c)*a,r+Math.sin(c)*a),n.strokeStyle=`rgba(255,255,255,${(.04+i()*.06).toFixed(3)})`,n.lineWidth=1+i(),n.stroke()}}function Hr(n,t,e,i){return $t(n,()=>{const o=document.createElement("canvas");o.width=ae,o.height=ae;const s=o.getContext("2d");s.fillStyle=t,s.fillRect(0,0,ae,ae),kT(s,e,i),cf(s,e+1);const r=new yt(o);return r.wrapS=Dt,r.wrapT=Dt,r},!0)}function WT(n,t,e){return $t(n,()=>{const i=document.createElement("canvas");i.width=ae,i.height=ae;const o=i.getContext("2d");o.fillStyle=t,o.fillRect(0,0,ae,ae);const s=Te(e),r=4;for(let c=0;c<ae;c+=r)for(let l=0;l<ae;l+=r){const d=(s()-.5)*.16;o.fillStyle=d>0?`rgba(126,74,66,${(d*1.6).toFixed(3)})`:`rgba(15,4,2,${(-d*2.5).toFixed(3)})`,o.fillRect(l,c,r,r*.5)}cf(o,e+1,18);const a=new yt(i);return a.wrapS=Dt,a.wrapT=Dt,a},!0)}function GT(n,t,e){return $t(n,()=>{const i=document.createElement("canvas");i.width=ae,i.height=ae;const o=i.getContext("2d");o.fillStyle=t,o.fillRect(0,0,ae,ae),cf(o,e,30);const s=Te(e+2),r=ae*.4,a=ae*.14;o.fillStyle="rgba(199,100,30,0.85)",o.fillRect(0,r,ae,a);for(let l=0;l<50;l++){const d=s()*ae,u=r+s()*a,h=3+s()*12;o.beginPath(),o.arc(d,u,h,0,Math.PI*2),o.fillStyle=`rgba(0,0,0,${(.15+s()*.3).toFixed(3)})`,o.fill()}o.fillStyle="rgba(20,18,16,0.55)";for(let l=0;l<5;l++)o.fillRect(ae*.08+l*ae*.1,r+a*.25,ae*.06,a*.5);const c=new yt(i);return c.wrapS=Dt,c.wrapT=Dt,c},!0)}function ko(n,t,e){return $t(n,()=>{const i=document.createElement("canvas");i.width=ae,i.height=ae;const o=i.getContext("2d");o.fillStyle=`rgb(${t},${t},${t})`,o.fillRect(0,0,ae,ae);const s=Te(e);for(let a=0;a<50;a++){const c=s()*ae,l=s()*ae,d=8+s()*34,u=Math.max(20,Math.min(235,Math.floor(t+(s()-.5)*90)));o.beginPath(),o.ellipse(c,l,d,d*(.4+s()*.5),s()*Math.PI,0,Math.PI*2),o.fillStyle=`rgba(${u},${u},${u},0.55)`,o.fill()}const r=new yt(i);return r.wrapS=Dt,r.wrapT=Dt,r})}const yi=new Ft({map:Hr("prop-locker","#33373E",401,!1),roughnessMap:ko("prop-locker-rough",145,402),roughness:.55,metalness:.35,envMapIntensity:.5,side:It});yi.map.repeat.set(.6,.6);yi.roughnessMap.repeat.set(.6,.6);const Oo=new Ft({map:Hr("prop-counter","#2E3238",411,!0),roughnessMap:ko("prop-counter-rough",110,412),roughness:.35,metalness:.55,envMapIntensity:.55,side:It}),VT=new Ft({map:WT("prop-seat","#452421",421),roughnessMap:ko("prop-seat-rough",210,422),roughness:.9,metalness:0,envMapIntensity:.25,side:It}),gd=new Ft({map:GT("prop-crate","#3C4130",431),roughnessMap:ko("prop-crate-rough",160,432),roughness:.7,metalness:.15,envMapIntensity:.45,side:It}),Bv=new Ft({map:Hr("prop-reactor-housing","#2F343B",441,!0),roughnessMap:ko("prop-reactor-rough",120,442),roughness:.4,metalness:.5,envMapIntensity:.55,side:It}),Hv=new Ft({map:Hr("prop-catwalk","#33373D",451,!1),roughnessMap:ko("prop-catwalk-rough",125,452),roughness:.45,metalness:.55,envMapIntensity:.5,side:It}),$n=new Ft({map:Hr("prop-pipe","#2A2E34",461,!0),roughnessMap:ko("prop-pipe-rough",130,462),roughness:.5,metalness:.45,envMapIntensity:.5,side:It}),Dn=new Ft({map:Hr("prop-console-housing","#2C3036",471,!1),roughnessMap:ko("prop-console-rough",140,472),roughness:.5,metalness:.3,envMapIntensity:.5,side:It});function XT(){const e=document.createElement("canvas");e.width=256,e.height=80;const i=e.getContext("2d"),o=i.createLinearGradient(0,0,0,80);o.addColorStop(0,"rgba(26,30,36,1)"),o.addColorStop(.5,"rgba(17,20,25,1)"),o.addColorStop(1,"rgba(10,12,16,1)"),i.fillStyle=o,i.fillRect(0,0,256,80),i.strokeStyle="rgba(60,66,74,0.30)",i.lineWidth=1;for(let s=6;s<80;s+=7)i.beginPath(),i.moveTo(6,s),i.lineTo(250,s),i.stroke();return i.strokeStyle="rgba(70,224,216,0.22)",i.lineWidth=1.5,i.beginPath(),i.moveTo(10,80/2),i.lineTo(246,80/2),i.stroke(),new yt(e)}const YT=new lt({map:XT(),toneMapped:!0}),kv=4645080,lf=13067294,qT=15262420,ya=Dn,dl=new Gt({color:lf}),ZT=new lt({color:kv}),KT=new Gt({color:qT}),mh=new lt({color:kv}),gh=new lt({color:lf});function jT(n,t){const{w:e,h:i,font:o="13px monospace",textColor:s="#C7641E",bgAlpha:r=0}=t,a=document.createElement("canvas");a.width=e,a.height=i;const c=a.getContext("2d");return r>0&&(c.fillStyle=`rgba(28,30,34,${r})`,c.fillRect(0,0,e,i)),c.fillStyle=s,c.font=o,c.textBaseline="middle",c.textAlign="center",c.fillText(n,e/2,i/2),new yt(a)}function _r(n,t,e,i,o,s=0,r=0,a){const c=a?.texW??256,l=a?.texH??64,d=jT(t,{w:c,h:l,font:a?.font,textColor:a?.textColor,bgAlpha:a?.bgAlpha??.6}),u=new lt({map:d,transparent:!0,depthWrite:!1,side:It}),h=new qt(e,i),f=new L(h,u);f.position.copy(o),f.rotation.y=s,f.rotation.x=r,n.add(f)}function JT(n){const a=new U(4.6,.75,.55);a.translate(0,.75/2,0);const c=new U(4.6,.22,.55);c.translate(0,.75+.22/2,0);const l=[a,c],d=new L(Qt(l),ya);for(const y of l)y.dispose();d.position.set(0,0,-2.205),n.add(d);const u=new L(new U(4.6,.03,.55+.01),dl);u.position.set(0,.75+.015,-2.205),n.add(u);const h=1.18,f=.34,m=-2.48+.55+.005,v=.75+.22*.5,p=["waveform","radar","bargraph"],g=[-1.45,0,1.45];for(let y=0;y<g.length;y++){const _=g[y],R=new L(new U(h+.06,f+.06,.025),ya);R.position.set(_,v,m),n.add(R);const D=BT(p[y]),N=new L(new qt(h,f),D);N.position.set(_,v,m+.014),n.add(N)}const S=new Se(.018,6,4),x=new lt({color:lf});for(let y=0;y<5;y++){const _=new L(S,x);_.position.set(-1.8+y*.9,.75+.22+.025,-2.48+.55-.04),n.add(_)}const w=new Se(.015,6,4),E=[mh,gh,mh,gh];for(let y=0;y<4;y++){const _=new L(w,E[y]);_.position.set(-.9+y*.6,.75*.5,-2.48+.01),n.add(_)}const b=new L(new U(4.6-.1,.03,.015),ZT);b.position.set(0,.08,-2.48+.55-.01),n.add(b);const T=new lt({color:4182232,transparent:!0,opacity:.28,depthWrite:!1,blending:Ae,toneMapped:!1,side:me});for(const y of[-1.45,0,1.45]){const _=new L(new qt(h*.9,.18),T);_.position.set(y,v-f/2-.06,m+.02),_.rotation.x=-Math.PI*.14,n.add(_)}Ci(n,[{pos:new M(-1.3,.75+.22+.06,m-.02),color:xe.teal},{pos:new M(-.4,.75+.22+.06,m-.02),color:xe.warm},{pos:new M(.4,.75+.22+.06,m-.02),color:xe.red,blink:!0,period:3.2,phase:.25},{pos:new M(1.3,.75+.22+.06,m-.02),color:xe.orange}]),_r(n,"COCKPIT",.7,.1,new M(0,.75+.22+.05,m+.02),0,0,{font:"11px monospace",bgAlpha:0});const C=new Bt;C.name="throttle-levers";for(const y of[-1,1]){const _=y*.095,R=new L(new wt(.025,.03,.06,8),ya);R.position.set(_,.595,-2.205+.1);const D=new L(new wt(.014,.014,.22,8),dl);D.position.set(_,.72,-2.205+.1),D.rotation.x=.18;const N=new L(new Se(.028,8,6),dl);N.position.set(_,.83,-2.205+.14);const z=new Bt;z.name=`lever-${y===-1?"port":"stbd"}`,z.add(R,D,N),C.add(z)}return n.add(C),{collider:{minX:-4.6/2,minY:0,minZ:-2.48,maxX:4.6/2,maxY:.75+.22+.06,maxZ:-2.48+.55},levers:C}}function T0(n,t){const s=t*2.55,r=.95,a=12*Math.PI/180,c=new U(.45,.9,1.8),l=new L(c,ya);l.position.set(s,r+.9/2,-1.1),l.rotation.z=t*a,n.add(l);const d=new U(.45+.02,.02,1.8+.02),u=new L(d,KT),h=r+.9+.01,f=s-t*Math.sin(a)*.9*.5;u.position.set(f,h,-1.1),u.rotation.z=t*a,n.add(u);const m=[],v=[],p=.02,g=1.8/9;for(let y=0;y<8;y++){const _=-2+g*(y+1),R=f+t*.01,D=h+.025,N=new Se(p,6,4);N.translate(R,D,_),y%2===0?m.push(N):v.push(N)}if(m.length>0){const y=Qt(m);for(const _ of m)_.dispose();n.add(new L(y,mh))}if(v.length>0){const y=Qt(v);for(const _ of v)_.dispose();n.add(new L(y,gh))}_r(n,t===-1?"NAV":"PWR",.3,.06,new M(f,h+.04,-1.1),t===-1?0:Math.PI,0,{font:"10px monospace",bgAlpha:0});const S=2.55,x=-1.1,w=new U(.06,.35,1.2),E=new L(w,ya);E.position.set(t*2.92,S,x),n.add(E);const b=new L(new qt(1.14,.31),YT);b.position.set(t*(2.92-.03-.003),S,x),b.rotation.y=t===-1?Math.PI/2:-Math.PI/2,n.add(b);const T=[];for(let y=0;y<6;y++){const _=x-.5+(y+.5)*.16666666666666666,R=new U(.03,.04,.025);R.translate(t*(2.92+.04),S+.05,_),T.push(R)}const C=Qt(T);for(const y of T)y.dispose();return n.add(new L(C,dl)),_r(n,"CAUTION — CANOPY SEAL",.55,.06,new M(t*(2.55+.45*.5+.002),r+.9*.55,-1.1),t===-1?Math.PI/2:-Math.PI/2,0,{font:"9px monospace",textColor:"#C7641E",bgAlpha:.5}),{minX:s-.45*.5,minY:r,minZ:-1.1-1.8/2,maxX:s+.45*.5,maxY:r+.9,maxZ:-1.1+1.8/2}}const QT=13067294,$T=15262420,vh=Dn,Wv=new Gt({color:QT});new Gt({color:$T});function E0(n,t,e,i){const s=new U(.18,.42,.18);s.translate(0,.21,0);const r=new L(s,vh);r.position.set(t,0,.3),r.rotation.y=e;const a=new U(.52,.08,.5);a.translate(0,.45,0);const c=new U(.52,.58,.09);c.translate(0,.75,-.21);const l=new U(.36,.22,.09);l.translate(0,1.3,-.21);const d=[a,c,l],u=new L(Qt(d),VT);for(const m of d)m.dispose();u.position.set(t,0,.3),u.rotation.y=e;const h=new Bt;h.name=i,h.add(r,u);const f=new L(new U(.48,.06,.1),Wv);f.position.set(t,.72,.3-.21),f.rotation.y=e,h.add(f);for(const m of[-1,1]){const v=new U(.06,.04,.38);v.translate(m*.29,.5,0);const p=new L(v,vh);p.position.set(t,0,.3),p.rotation.y=e,h.add(p)}return n.add(h),{minX:t-.35,minY:0,minZ:.3-.35,maxX:t+.35,maxY:1.55,maxZ:.3+.35}}function tE(n){const e=new L(new U(.28,.52,.28),vh);e.position.set(0,.26,.25),n.add(e);const i=new L(new U(.34,.035,.34),Wv);return i.position.set(0,.535,.25),n.add(i),{minX:-.2,minY:0,minZ:.25-.2,maxX:.2,maxY:.9,maxZ:.25+.2}}const ul=300;let xh=null,fa=null,Sh=null;function eE(n){const t=new Float32Array(ul*3),e=new Float32Array(ul*3);for(let r=0;r<ul;r++)t[r*3+0]=(Math.random()-.5)*4,t[r*3+1]=.5+Math.random()*2,t[r*3+2]=-2.5+Math.random()*2,e[r*3+0]=(Math.random()-.5)*.002,e[r*3+1]=(Math.random()-.5)*.002,e[r*3+2]=(Math.random()-.5)*.001;const i=new ce;i.setAttribute("position",new re(t,3));const o=new Ts({color:15262420,size:.012,sizeAttenuation:!0,transparent:!0,opacity:.06,depthWrite:!1}),s=new io(i,o);s.name="dust-motes",n.add(s),xh=t,fa=e,Sh=s}function nE(){if(!xh||!fa||!Sh)return;const n=xh;for(let e=0;e<ul;e++){const i=e*3;n[i]+=fa[i]+(Math.random()-.5)*4e-4,n[i+1]+=fa[i+1]+(Math.random()-.5)*4e-4,n[i+2]+=fa[i+2]+(Math.random()-.5)*2e-4,(n[i]<-2||n[i]>2)&&(n[i]=(Math.random()-.5)*3.5),(n[i+1]<.5||n[i+1]>2.5)&&(n[i+1]=.5+Math.random()*2),(n[i+2]<-2.5||n[i+2]>-.5)&&(n[i+2]=-2.5+Math.random()*1.8)}const t=Sh.geometry.attributes.position;t.needsUpdate=!0}function iE(n){_r(n,"COCKPIT",.8,.08,new M(0,2.78,-2.49),0,0,{font:"14px monospace",textColor:"#C7641E",bgAlpha:.6,texW:256,texH:48}),_r(n,"CAUTION — CANOPY SEAL",.6,.07,new M(-2.2,1.8,-2.49),0,0,{font:"9px monospace",textColor:"#C7641E",bgAlpha:.5,texW:256,texH:48}),_r(n,"CAUTION — CANOPY SEAL",.6,.07,new M(2.2,1.8,-2.49),0,0,{font:"9px monospace",textColor:"#C7641E",bgAlpha:.5,texW:256,texH:48})}function oE(n){const t=[],{collider:e,levers:i}=JT(n);t.push(e),t.push(E0(n,-.9,.07,"seat-port")),t.push(E0(n,.9,-.07,"seat-starboard"));const o=new Bt;return o.name="console-bank",n.add(o),t.push(tE(n)),t.push(T0(n,-1)),t.push(T0(n,1)),eE(n),iE(n),{colliders:t,throttleLevers:i}}function sE(n){return n.onBeforeRender!==ye.prototype.onBeforeRender}function rE(n){const t=Object.keys(n.attributes).sort();return`${n.index?"1":"0"}|${t.join(",")}`}const aE=new Set(["pegboard","light-switch-plate","utensil-0","utensil-1","utensil-2","utensil-3","utensil-4","utensil-5"]);function cE(n){return!(!(n instanceof L)||n instanceof tn||n.name&&!aE.has(n.name)||Array.isArray(n.material)||sE(n)||!(n.geometry instanceof ce))}function so(n){for(const e of n.children)e instanceof Bt&&so(e);const t=new Map;for(const e of n.children){if(!cE(e))continue;const o=`${e.material.uuid}|${rE(e.geometry)}`,s=t.get(o);s?s.push(e):t.set(o,[e])}for(const e of t.values()){if(e.length<2)continue;const i=[];for(const r of e){r.updateMatrix();const a=r.geometry.clone();a.applyMatrix4(r.matrix),i.push(a)}const o=Qt(i);for(const r of i)r.dispose();if(!o)continue;const s=new L(o,e[0].material);n.add(s);for(const r of e)n.remove(r)}}function lE(){const{group:i,colliders:o}=Ho({width:6,height:3,depth:5,doors:[{wall:"aft",gapW:1.4,gapH:2.2,offset:0}],windows:[{wall:"fore",w:4.6,h:1.9,yBot:.7,offset:0}]});i.name="cockpit";const s=oE(i);o.push(...s.colliders),so(i);let r=0;i.onBeforeRender=()=>{const u=performance.now();u-r>16&&(nE(),HT(u),r=u)};const a=new M(0,1.55,1.8),c=new M(0,1.1,-1.8),l=new M(0,1.55,0),d=new M(0,1.4,-2.5);return{group:i,colliders:o,interactables:[],cameras:[{name:"cockpit",position:a,lookAt:c},{name:"cockpit-canopy",position:l,lookAt:d}]}}function dE(n,t,e,i="#C7641E",o=.65,s="11px monospace"){const r=document.createElement("canvas");r.width=t,r.height=e;const a=r.getContext("2d");return o>0&&(a.fillStyle=`rgba(232,226,212,${o})`,a.fillRect(0,0,t,e),a.strokeStyle=i,a.lineWidth=2,a.strokeRect(1,1,t-2,e-2)),a.fillStyle=i,a.font=s,a.textBaseline="middle",a.textAlign="center",a.fillText(n,t/2,e/2),new yt(r)}function Ks(n,t,e,i,o,s=0,r="11px monospace",a="#C7641E",c=192,l=48){const d=dE(t,c,l,a,.7,r),u=new lt({map:d,transparent:!0,depthWrite:!1,side:It}),h=new L(new qt(e,i),u);h.position.copy(o),h.rotation.y=s,n.add(h)}function uE(n,t,e,i,o=0){const a=document.createElement("canvas");a.width=256,a.height=32;const c=a.getContext("2d");c.fillStyle="#1C1E22",c.fillRect(0,0,256,32);const l=18;c.save(),c.beginPath(),c.rect(0,0,256,32),c.clip();for(let f=-32;f<288;f+=l*2)c.fillStyle="#E8C020",c.save(),c.translate(f,0),c.rotate(Math.PI/4),c.fillRect(0,-32,l,32*4),c.restore();c.restore(),c.strokeStyle="#E8C020",c.lineWidth=2,c.strokeRect(1,1,254,30),c.fillStyle="#1C1E22",c.font="bold 10px monospace",c.textBaseline="middle",c.textAlign="center",c.fillText("CAUTION",256/2,32/2);const d=new yt(a),u=new lt({map:d,transparent:!0,depthWrite:!1,side:It}),h=new L(new qt(t,e),u);h.position.copy(i),h.rotation.y=o,n.add(h)}function hE(n,t,e,i,o,s,r){Ks(n,"CREW QTR A",.4,.08,new M(-t+.01,2,o-.3),Math.PI/2,"10px monospace","#C7641E",192,40),Ks(n,"CREW QTR B",.4,.08,new M(-t+.01,2,s+.3),Math.PI/2,"10px monospace","#C7641E",192,40),Ks(n,"GALLEY ▸",.4,.08,new M(t-.01,2,o-.3),-Math.PI/2,"10px monospace","#C7641E",192,40),Ks(n,"◂ COCKPIT",.45,.08,new M(0,2.1,-e+.01),0,"10px monospace","#C7641E",192,40),Ks(n,"→ MAIN ←",.45,.06,new M(0,i-.05,-2),0,"9px monospace","#46E0D8",192,32),uE(n,.6,.06,new M(0,1.5,e-1),0),Ks(n,"ENGINEERING ▸",.5,.08,new M(0,2.1,e-.01),Math.PI,"10px monospace","#C7641E",192,40);const a=-4,c=-1.44,l=1.55,d=new L(new U(.1,.8,.6),r);d.position.set(c,l,a),d.name="save-terminal-shell",n.add(d);const u=new L(new qt(.52,.68),Iv);u.position.set(c+.052,l,a),u.rotation.y=Math.PI/2,u.name="save-terminal-screen",n.add(u);const h=document.createElement("canvas");h.width=256,h.height=32;const f=h.getContext("2d");f.fillStyle="#050810",f.fillRect(0,0,256,32),f.fillStyle="rgba(70,224,216,0.9)",f.font="12px monospace",f.textBaseline="middle",f.fillText("SAVE TERMINAL  _",8,16);const m=new yt(h),v=new L(new qt(.5,.06),new lt({map:m,transparent:!0,depthWrite:!1,side:It}));v.position.set(c+.054,l-.28,a),v.rotation.y=Math.PI/2,n.add(v),Ua(n,{x:c+.03,y:l-.5,z:a,width:.5,length:.3,rotY:Math.PI/2,tiltX:-.4,color:2808038,opacity:.32}),Ci(n,[{pos:new M(c+.06,l+.36,a-.18),color:xe.teal},{pos:new M(c+.06,l+.36,a),color:xe.warm,blink:!0,period:3.6,phase:.5},{pos:new M(c+.06,l+.36,a+.18),color:xe.orange}])}const fE=[-.035,-.085,-.145],A0=[.046,.036,.033],C0=.015,R0=2,pE=$n,mE=$n;function gE(n,t,e,i){const o=e*2,s=Math.ceil(o/R0)+1;for(const r of[-1,1]){const a=r*(t-.04),c=[],l=[];for(let d=0;d<A0.length;d++){const u=A0[d],h=i+fE[d],f=new wt(u,u,o,6,1);f.rotateX(Math.PI/2),f.translate(a,h,0),c.push(f);for(let m=0;m<s;m++){const v=-e+m*R0,p=new Ln(u+C0,C0,5,8);p.rotateY(Math.PI/2),p.translate(a,h,v),l.push(p)}}if(c.length>0){const d=Qt(c);for(const h of c)h.dispose();const u=new L(d,pE);u.name=`corner-conduits-${r===-1?"port":"stbd"}`,n.add(u)}if(l.length>0){const d=Qt(l);for(const h of l)h.dispose();const u=new L(d,mE);u.name=`corner-clamps-${r===-1?"port":"stbd"}`,n.add(u)}}}const Dc=13067294,P0=4645080,vE={pipe:$n,clamp:$n,orangePipe:new Gt({color:Dc}),vent:$n,ventSlat:Dn,status:new lt({color:P0}),handle:new Gt({color:Dc}),conduit:$n,gunmetal:Dn,orange:new Gt({color:Dc}),tealBasic:new lt({color:P0}),orangeBasic:new lt({color:Dc})};function L0(n,t,e=6){const i=new wt(n,n,t,e);return i.rotateX(Math.PI/2),i}function xE(n){const t=vE,e=3,i=3,o=16,s=e/2,r=o/2,a=-4,c=1.4,l=a-c/2,d=a+c/2,u=i-.25,h=s-.08,f=.065,m=.04,v=i-.13,p=L0(f,o,7),g=L0(m,o,6),S=new tn(p,t.pipe,2);S.name="pipes-main";const x=new Lt;x.setPosition(-h,u,0),S.setMatrixAt(0,x),x.setPosition(h,u,0),S.setMatrixAt(1,x),S.instanceMatrix.needsUpdate=!0,n.add(S);const w=new tn(g,t.orangePipe,2);w.name="pipes-orange",x.setPosition(-h+.08,v,0),w.setMatrixAt(0,x),x.setPosition(h-.08,v,0),w.setMatrixAt(1,x),w.instanceMatrix.needsUpdate=!0,n.add(w);const E=2,b=Math.floor(o/E),T=new Ln(f+.025,.018,5,8);T.rotateY(Math.PI/2);const C=b*2,y=new tn(T,t.clamp,C);y.name="pipe-clamps";let _=0;for(let st=0;st<b;st++){const Pt=-r+E*(st+.5);for(const _t of[-h,h])x.setPosition(_t,u,Pt),y.setMatrixAt(_++,x)}y.instanceMatrix.needsUpdate=!0,n.add(y);const R=.45,D=.25,N=.06,z=2,B=s,V=[-6,1],j=V.length*2,Y=new U(N,D,R),J=new tn(Y,t.vent,j);J.name="wall-vents";let k=0;for(const st of V)for(const Pt of[-1,1]){const _t=Pt*(B-N*.5+.005);x.setPosition(_t,z,st),J.setMatrixAt(k++,x)}J.instanceMatrix.needsUpdate=!0,n.add(J);const $=5,mt=.02,at=.05,X=R-.04,tt=new U(at,mt,X),ft=$*j,ot=new tn(tt,t.ventSlat,ft);ot.name="vent-slats";let Nt=0;for(const st of V)for(const Pt of[-1,1]){const _t=Pt*(B-N*.5+.005),ut=z+D/2-mt,Xt=(D-mt*2)/($-1);for(let jt=0;jt<$;jt++){const he=ut-jt*Xt;x.setPosition(_t+Pt*.005,he,st),ot.setMatrixAt(Nt++,x)}}ot.instanceMatrix.needsUpdate=!0,n.add(ot);const Et=.04,Vt=.08,O=.04,Ut=2.05,Rt=1.4/2+.12,ie=new U(Et,Vt,O),bt=new tn(ie,t.status,8);bt.name="door-status-lights";const Kt=[[-Rt-Et,Ut,-r+.06],[Rt+Et,Ut,-r+.06],[-Rt-Et,Ut,r-.06],[Rt+Et,Ut,r-.06],[-s+.06,Ut,a-Rt-O],[-s+.06,Ut,a+Rt+O],[s-.06,Ut,a-Rt-O],[s-.06,Ut,a+Rt+O]];for(let st=0;st<Kt.length;st++){const[Pt,_t,ut]=Kt[st];x.setPosition(Pt,_t,ut),bt.setMatrixAt(st,x)}bt.instanceMatrix.needsUpdate=!0,n.add(bt);const Ht=.1,zt=.022,_e=5.5,I=1.4,A=new Ln(Ht,zt,7,12);A.rotateX(Math.PI/2);for(const st of[-1,1]){const Pt=st*(B-.025),_t=new L(A,t.handle);_t.position.set(Pt,I,_e),_t.name=`wall-handle-${st===-1?"port":"stbd"}`,n.add(_t)}const W=.04,K=.05,nt=.06+W/2,it=s-.025,At=l- -r;{const st=new L(new U(K,W,At),t.conduit);st.position.set(it,nt,-r+At/2),st.name="cable-conduit-fore",n.add(st)}const gt=r-d;{const st=new L(new U(K,W,gt),t.conduit);st.position.set(it,nt,d+gt/2),st.name="cable-conduit-aft",n.add(st)}for(const st of[-1,1]){const Pt=st*(s-.06),_t=new L(new U(.1,.06,o),t.gunmetal);_t.position.set(Pt,2.7,0),_t.name=`cable-tray-${st===-1?"port":"stbd"}`,n.add(_t)}gE(n,s,r,i);const pt=[-5,0,5],kt=1.7,ct=u;for(const st of[-1,1]){const Pt=st*(s-.07),_t=[];for(const ut of pt){const Xt=new U(.22,.3,.12),jt=new L(Xt,t.gunmetal);jt.position.set(Pt,kt,ut),n.add(jt);const he=new qt(.16,.22),F=new L(he,t.orangeBasic);F.position.set(Pt-st*.062,kt,ut),F.rotation.y=st===-1?0:Math.PI,n.add(F);const vt=[];for(let Le=0;Le<3;Le++){const fe=new Se(.018,5,4),Yn=ut-.04+Le*.04,qn=Pt-st*.065;fe.translate(qn,kt+.08,Yn),vt.push(fe)}const Q=Qt(vt);for(const Le of vt)Le.dispose();n.add(new L(Q,t.tealBasic));const et=ct,dt=kt+.15,Yt=et-dt,le=st*.04,Pe=new wt(.04,.04,Yt,5);Pe.translate(Pt+le,dt+Yt/2,ut),_t.push(Pe)}if(_t.length>0){const ut=Qt(_t);for(const jt of _t)jt.dispose();const Xt=new L(ut,t.conduit);Xt.name=`wall-conduits-${st===-1?"port":"stbd"}`,n.add(Xt)}}hE(n,s,r,i,l,d,t.gunmetal)}const Ic=.18,Nc=.04,Oc=.12,Uc=.06,D0=2.6,SE=.22,I0=.11,_E=[-7,-4.2,0,4.6,7.2],_h=$n,Fc=-3,zc=-1,$r=.65,mu=.05;function ME(n,t,e,i){const o=t/2,s=i/2;for(const r of["port","starboard"]){const a=r==="port"?-1:1,c=a*(o+Nc/2-Mn),l=new U(Nc,Ic,i);l.translate(c,Ic/2-Mn,0);const d=new U(Uc,Oc,i);d.translate(a*(o+Uc/2-Mn),e-Oc/2,0);const u=[l,d],h=Qt(u);for(const m of u)m.dispose();const f=new L(h,_h);n.add(f)}for(const[r,a]of[[-s,-1],[s,1]]){const c=new U(t,Ic,Nc);c.translate(0,Ic/2-Mn,r+a*(Nc/2-Mn));const l=new U(t,Oc,Uc);l.translate(0,e-Oc/2,r+a*(Uc/2-Mn));const d=[c,l],u=Qt(d);for(const f of d)f.dispose();const h=new L(u,_h);n.add(h)}}function wE(n,t){const e=t/2;for(const i of["port","starboard"]){const s=(i==="port"?-1:1)*(e+I0/2-Mn),r=[];for(const c of _E){const l=new U(I0,D0,SE);l.translate(s,D0/2,c),r.push(l)}const a=new L(Qt(r),_h);for(const c of r)c.dispose();n.add(a)}}function yE(n,t,e){const i=t/2,o=zc-Fc,s=[];for(const r of["port","starboard"]){const a=r==="port"?-1:1,c=a*i,l=a*(i+$r),d=r==="port"?Math.PI/2:-Math.PI/2,u=new L(new qt(o,e),fn);u.position.set(l,e/2,(Fc+zc)/2),u.rotation.y=d,n.add(u);const h=r==="port"?c-$r/2:c+$r/2,f=new L(new qt($r,e),fn);f.position.set(h,e/2,Fc),f.rotation.y=Math.PI,n.add(f);const m=new L(new qt($r,e),fn);m.position.set(h,e/2,zc),m.rotation.y=0,n.add(m);const v=r==="port"?l-mu:c,p=r==="port"?c+mu:l+mu;s.push({minX:v,minY:0,minZ:Fc,maxX:p,maxY:e,maxZ:zc})}return s}const bE=new Ft({color:3817028,roughness:.22,metalness:.75,envMapIntensity:1.6}),TE=new Ft({color:1711136,roughness:.7,metalness:.15,envMapIntensity:.15,side:je}),EE=new Ft({color:4870232,roughness:.35,metalness:.85,envMapIntensity:1}),AE=new Ft({color:855569,roughness:.9,metalness:.1,side:me}),CE=new Ft({color:10133672,metalness:.9,roughness:.15});function RE(){return $t("porthole-star-overlay",()=>{const t=document.createElement("canvas");t.width=256,t.height=256;const e=t.getContext("2d"),i=e.createRadialGradient(256/2,256/2,0,256/2,256/2,256/2);i.addColorStop(0,"rgba(10, 14, 24, 0.26)"),i.addColorStop(.6,"rgba(10, 14, 24, 0.14)"),i.addColorStop(1,"rgba(10, 14, 24, 0.00)"),e.fillStyle=i,e.beginPath(),e.arc(256/2,256/2,256/2,0,Math.PI*2),e.fill();const o=65;let s=3735928559;const r=()=>(s=s*1664525+1013904223>>>0,s/4294967296);for(let c=0;c<o;c++){const l=r()*122,d=r()*Math.PI*2,u=256/2+Math.cos(d)*l,h=256/2+Math.sin(d)*l,f=.6+r()*1.4,m=.24+r()*.3,p=r()<.15?`rgba(100,220,210,${m.toFixed(2)})`:`rgba(255,255,255,${m.toFixed(2)})`;e.beginPath(),e.arc(u,h,f,0,Math.PI*2),e.fillStyle=p,e.fill()}const a=new yt(t);return a.colorSpace=Ke,a})}function Gv(n,t,e,i,o){const s=new cd(n,40),r=new lt({map:RE(),transparent:!0,opacity:1,blending:Ae,depthWrite:!1,toneMapped:!0,side:me}),a=new L(s,r);return a.rotation.y=Math.PI/2,a.position.set(t+o*.085,e,i),a}function PE(n,t,e,i,o,s){n.add(Gv(t,e,o,s,i))}function N0(n,t,e,i,o,s){const r=t<0?-1:1,a=t+r*.005,c=Math.min(o,s)/2*.88,l=.05,d=Math.sqrt(o*o+s*s)/2,u=Math.min(d+.06,o>.7?.53:.4),h=d+.02,f=new Xn(c,h,48),m=new L(f,AE);m.name="porthole-bezel-corner",m.rotation.y=Math.PI/2,m.position.set(a,i,e),n.add(m);const v=new wt(c,c,.08,28,1,!0),p=new L(v,TE);p.name="porthole-bezel-tube",p.rotation.z=Math.PI/2,p.position.set(a+r*.04,i,e),n.add(p);const g=new Ln(u,l,10,40),S=new L(g,bE);S.name="porthole-bezel-ring",S.rotation.y=Math.PI/2,S.position.set(a+r*.001,i,e),n.add(S);const x=u-.03,w=new Ln(x,.012,8,40),E=new L(w,CE);E.name="porthole-bezel-catchring",E.rotation.y=Math.PI/2,E.position.set(a+r*.008,i,e),n.add(E);const b=new wt(.012,.012,.032,7);for(let T=0;T<8;T++){const C=T/8*Math.PI*2,y=new L(b,EE);y.name="porthole-bezel-bolt",y.rotation.z=Math.PI/2,y.position.set(a+r*.028,i+Math.sin(C)*u,e+Math.cos(C)*u),n.add(y)}n.add(Gv(c,a,i,e,r))}function LE(n,t,e,i){return new de({uniforms:{uColor:{value:new St(n)},uPeak:{value:t},uTime:{value:0},uHalfH:{value:e},uInvert:{value:i?1:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Ae,side:It,toneMapped:!1,vertexShader:`
      varying vec3 vPos;
      varying vec3 vNormalW;
      varying vec3 vWorldPos;
      void main() {
        vPos = position;
        vNormalW = normalize(normalMatrix * normal);
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 uColor;
      uniform float uPeak;
      uniform float uTime;
      uniform float uHalfH;
      uniform float uInvert;
      varying vec3 vPos;
      varying vec3 vNormalW;
      varying vec3 vWorldPos;

      void main() {
        float axialFrac = clamp((vPos.y + uHalfH) / (2.0 * uHalfH), 0.0, 1.0); // 0 bottom .. 1 top
        float axial = mix(axialFrac, 1.0 - axialFrac, uInvert); // bright end selector
        float axialFall = pow(axial, 1.5);

        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - abs(dot(normalize(vNormalW), viewDir)), 1.4);

        float n = sin(vPos.y * 6.0 + uTime * 0.8) * 0.5 + 0.5;
        float wobble = mix(0.88, 1.0, n);

        float alpha = uPeak * axialFall * fresnel * wobble;
        gl_FragColor = vec4(uColor, alpha);
      }
    `})}function DE(n){let t=n;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function IE(){return $t("dust-mote-sprite",()=>{const t=document.createElement("canvas");t.width=32,t.height=32;const e=t.getContext("2d"),i=32/2,o=32/2,s=e.createRadialGradient(i,o,0,i,o,32/2);s.addColorStop(0,"rgba(255,255,255,0.9)"),s.addColorStop(.35,"rgba(255,255,255,0.45)"),s.addColorStop(1,"rgba(255,255,255,0.0)"),e.fillStyle=s,e.fillRect(0,0,32,32);const r=new yt(t);return r.wrapS=ue,r.wrapT=ue,r})}function NE(n,t,e,i,o,s){const r=DE(s),a=new Float32Array(i*3),c=new Float32Array(i*3),l=new Float32Array(i);for(let m=0;m<i;m++){const v=r(),p=-n+v*(2*n),g=e+(t-e)*v,S=Math.sqrt(r())*g*.65,x=r()*Math.PI*2,w=Math.cos(x)*S,E=Math.sin(x)*S;a[m*3+0]=w,a[m*3+1]=p,a[m*3+2]=E,c[m*3+0]=w,c[m*3+1]=p,c[m*3+2]=E,l[m]=r()*Math.PI*2}const d=new ce;d.setAttribute("position",new re(a,3));const u=new Ts({color:o,map:IE(),size:.006,sizeAttenuation:!0,transparent:!0,opacity:.15,depthWrite:!1,blending:Ae,toneMapped:!1}),h=new io(d,u),f=d.getAttribute("position");return h.onBeforeRender=()=>{const m=performance.now()/1e3;for(let v=0;v<i;v++){const p=l[v],g=Math.sin(m*.5+p)*.02,S=m*.25+p,x=Math.cos(S)*.015,w=Math.sin(S)*.015;f.setXYZ(v,c[v*3+0]+x,c[v*3+1]+g,c[v*3+2]+w)}f.needsUpdate=!0},h}function Fa(n,t){if(!Wa)return;const e=t.topY-t.bottomY;if(e<=.05)return;const i=e/2,o=(t.topY+t.bottomY)/2,s=t.sourceAtTop?t.radiusSource:t.radiusFar,r=t.sourceAtTop?t.radiusFar:t.radiusSource,a=new wt(s,r,e,16,1,!0),c=LE(t.color,t.peakOpacity,i,!t.sourceAtTop),l=new L(a,c);l.name="light-shaft",l.position.set(t.x,o,t.z),l.renderOrder=5,l.onBeforeRender=()=>{const u=performance.now()/1e3;c.uniforms.uTime.value=u,t.onTick?.(u)},n.add(l);const d=NE(i,s,r,t.moteCount??65,t.color,t.seed??1);d.name="light-shaft-motes",d.position.set(t.x,o,t.z),n.add(d)}const OE=2,gu=3;function Oi(n,t,e,i){const o=new qt(n,t),s=Math.ceil(3/gu)*gu-3;return md(o,n,t,OE,gu,e,i+s),o}function UE(){const{group:l,colliders:d}=Ho({width:3,height:3,depth:16,wallMaterial:fn,doors:[{wall:"fore",gapW:1.4,gapH:2.2,offset:0,framed:!0},{wall:"aft",gapW:1.4,gapH:2.2,offset:0,framed:!0},{wall:"port",gapW:17,gapH:4,offset:0},{wall:"starboard",gapW:17,gapH:4,offset:0}]});l.name="corridor";const u=[...d],h=3,f=.8,m=.7,v=1.1,p=-6,g=.6,S=.5,x=1.15,w=-4-1.4/2,E=-4+1.4/2,b=3-2.2,T=h-f/2,C=h+f/2,y=v+m,_=p-g/2,R=p+g/2,D=x+S,N=[],z=[];for(const mt of["port","starboard"]){const at=mt==="port"?-1.5:1.5,X=mt==="port"?Math.PI/2:-Math.PI/2,tt=_- -8,ft=w-R;{const W=Oi(tt,3,-8,0),K=new L(W,fn);K.position.set(at,3/2,-8+tt/2),K.rotation.y=X,l.add(K),u.push({minX:at-.05,minY:0,minZ:-8,maxX:at+.05,maxY:3,maxZ:_})}{const W=Oi(ft,3,R,0),K=new L(W,fn);K.position.set(at,3/2,R+ft/2),K.rotation.y=X,l.add(K),u.push({minX:at-.05,minY:0,minZ:R,maxX:at+.05,maxY:3,maxZ:w})}{const W=Oi(g,x,_,0),K=new L(W,fn);K.position.set(at,x/2,p),K.rotation.y=X,l.add(K),u.push({minX:at-.05,minY:0,minZ:_,maxX:at+.05,maxY:x,maxZ:R})}const ot=3-D;{const W=Oi(g,ot,_,D),K=new L(W,fn);K.position.set(at,D+ot/2,p),K.rotation.y=X,l.add(K),u.push({minX:at-.05,minY:D,minZ:_,maxX:at+.05,maxY:3,maxZ:R})}{const W=Oi(1.4,b,w,2.2),K=new L(W,fn);K.position.set(at,2.2+b/2,-4),K.rotation.y=X,l.add(K),u.push({minX:at-.05,minY:2.2,minZ:w,maxX:at+.05,maxY:3,maxZ:E})}const Nt=-4-1.4/2-ke/2,Et=new U(ll,2.2,ke);Et.translate(at,2.2/2,Nt),N.push(Et);const Vt=-4+1.4/2+ke/2,O=new U(ll,2.2,ke);O.translate(at,2.2/2,Vt),N.push(O);const Ut=new U(ll,fr,1.4+ke*2);Ut.translate(at,2.2+fr/2,-4),N.push(Ut);const Rt=T-E,ie=8-C;{const W=Oi(Rt,3,E,0),K=new L(W,fn);K.position.set(at,3/2,E+Rt/2),K.rotation.y=X,l.add(K),u.push({minX:at-.05,minY:0,minZ:E,maxX:at+.05,maxY:3,maxZ:T})}{const W=Oi(ie,3,C,0),K=new L(W,fn);K.position.set(at,3/2,C+ie/2),K.rotation.y=X,l.add(K),u.push({minX:at-.05,minY:0,minZ:C,maxX:at+.05,maxY:3,maxZ:8})}{const W=Oi(f,v,T,0),K=new L(W,fn);K.position.set(at,v/2,h),K.rotation.y=X,l.add(K),u.push({minX:at-.05,minY:0,minZ:T,maxX:at+.05,maxY:v,maxZ:C})}const bt=3-y;{const W=Oi(f,bt,T,v+m),K=new L(W,fn);K.position.set(at,y+bt/2,h),K.rotation.y=X,l.add(K),u.push({minX:at-.05,minY:v+m,minZ:T,maxX:at+.05,maxY:3,maxZ:C})}const Kt=.06,Ht=.04,zt=.025,_e=mt==="port"?-1.5+zt:1.5-zt,I=w- -8,A=8-E;{const W=new U(Ht,Kt,I);W.translate(_e,Kt/2-Mn,-8+I/2),z.push(W)}{const W=new U(Ht,Kt,A);W.translate(_e,Kt/2-Mn,E+A/2),z.push(W)}}for(const mt of[-1.5,1.5])N0(l,mt,h,v+m/2,f,m),N0(l,mt,p,x+S/2,g,S);if(N.length>0){const mt=Qt(N);for(const at of N)at.dispose();l.add(new L(mt,Co))}if(z.length>0){const mt=Qt(z);for(const at of z)at.dispose();l.add(new L(mt,Dv))}const B=.2,V=.9+B/2,j=.025,Y=.03;for(const[mt]of[[-8+Y],[8-Y]]){const X=new L(new U(.8,B,j),Co);X.position.set(-1.5+.8/2,V,mt),l.add(X);const tt=new L(new U(.8,B,j),Co);tt.position.set(1.5-.8/2,V,mt),l.add(tt)}for(const mt of["port","starboard"]){const at=mt==="port"?-1.5+Y:1.5-Y,X=w- -8,tt=8-E,ft=new L(new U(j,B,X),Co);ft.position.set(at,V,-8+X/2),l.add(ft);const ot=new L(new U(j,B,tt),Co);ot.position.set(at,V,E+tt/2),l.add(ot)}ME(l,3,3,16),wE(l,3);const J=yE(l,3,3);u.push(...J),xE(l),Fa(l,{x:0,z:-4,topY:2.5,bottomY:.4,sourceAtTop:!0,radiusSource:.14,radiusFar:.45,color:16769728,peakOpacity:.035,moteCount:60,seed:11}),Fa(l,{x:0,z:3.5,topY:2.4,bottomY:.4,sourceAtTop:!0,radiusSource:.12,radiusFar:.4,color:16769728,peakOpacity:.03,moteCount:60,seed:12}),so(l);const k=new M(0,1.95,5),$=new M(0,2.1,-8);return{group:l,colliders:u,interactables:[],cameras:[{name:"corridor",position:k,lookAt:$}]}}function vu(n){return n<.5?2*n*n:-1+(4-2*n)*n}function df(n,t){let e=0,i=0,o=0,s=0,r=0;const a=n/1e3;function c(){if(s===0)return vu(o);const d=(performance.now()-r)/1e3,u=Math.min(d/a,1);o=e+(i-e)*u,u>=1&&(s=0);const h=vu(o);return t(h),h}return{start(l,d){e=l,i=d,o=l,s=d>l?1:-1,r=performance.now()},tick:c,value(){return vu(o)},idle(){return s===0}}}const Pn=$n,FE=new Gt({color:3027e3}),zE=new Gt({color:8006687}),BE=new Gt({color:13067294}),HE=new Gt({color:14209732}),Vv=yi,Xv=new Gt({color:13067294}),Yv=Oo,qv=new Gt({color:3816773}),Zv=Dn,kE=new lt({color:1998960}),Kv=new lt({color:4645080}),vd=new Gt({color:15262420}),pr=new Gt({color:13067294}),WE=new Gt({color:8006687}),GE=new Gt({color:2796182}),VE=new U(.07,.76,.07),O0=new U(2,.05,.05),U0=new U(.05,.05,1),XE=new U(1.9,.16,.98),YE=new U(1.9,.18,.28),qE=new U(.82,.1,.28),ZE=new U(.5,1.86,.35),KE=new U(.007,1.86,.01),jE=new U(.1,.7,.06),JE=new U(.44,.54,.38),QE=new U(.09,.14,.09),$E=new U(.3,.026,.22),tA=new U(.24,.029,.16);function ze(n,t){return new L(n,t)}function jv(n){const t=new Bt;t.name="bunk";const e=[[-.93,-.46],[.93,-.46],[-.93,.46],[.93,.46]];for(const[h,f]of e){const m=ze(VE,Pn);m.position.set(h,.38,f),t.add(m)}const i=.74,o=ze(O0,Pn);o.position.set(0,i,-.46),t.add(o);const s=ze(O0,Pn);s.position.set(0,i,.46),t.add(s);const r=ze(U0,Pn);r.position.set(-.93,i,0),t.add(r);const a=ze(U0,Pn);a.position.set(.93,i,0),t.add(a);const c=ze(XE,FE);c.position.set(0,.84,0),t.add(c);const l=ze(YE,n);l.position.set(0,.94,.35),t.add(l);const d=ze(qE,HE);return d.position.set(0,.945,-.32),t.add(d),{group:t,collider:{minX:-1,maxX:1,minY:0,maxY:1.02,minZ:-.53,maxZ:.53}}}function Jv(n,t=0,e="lockers"){const i=new Bt;i.name=e;const o=[],s=.54;for(let r=0;r<n;r++){const a=t+(-.27+r*s),c=ze(ZE,Vv);c.position.set(a,.93,-.175),i.add(c);const l=ze(KE,Pn);l.position.set(a,.93,-.352),i.add(l);const d=ze(jE,Xv);d.position.set(a,.93,-.375),i.add(d),o.push({minX:a-.25,maxX:a+.25,minY:0,maxY:1.88,minZ:-.38,maxZ:.02})}return{group:i,colliders:o}}function Qv(n,t,e){const a=new Bt;a.name=t;const c=Vv,l=[[n+.5/2-.03/2,1.86/2,-.35/2,.03,1.86,.35],[n,1.86-.03/2,-.35/2,.5,.03,.35],[n,.03/2,-.35/2,.5,.03,.35],[n-.5/2+.03/2,1.86/2,-.35+.03/2,.03,1.86-.03*2,.03],[n+.5/2-.03/2,1.86/2,-.35+.03/2,.03,1.86-.03*2,.03]];for(const[w,E,b,T,C,y]of l){const _=ze(new U(T,C,y),c);_.position.set(w,E,b),a.add(_)}const d=ze(new U(.04,.38,.24),new Gt({color:2759178}));d.position.set(n,1.86*.6,-.35/2),a.add(d);const u=ze(new U(.5-.03*3,.03,.35-.03*2),c);if(u.position.set(n,1.86*.38,-.35/2),a.add(u),e==="A"){const w=ze(new U(.18,.12,.15),Pn);w.position.set(n,1.86*.38+.03+.06,-.35/2),a.add(w)}else{const w=ze(new U(.01,.18,.14),new Gt({color:2759178}));w.position.set(n+.5/2-.03,1.86*.55,-.35/2),a.add(w)}const h=new Bt;h.name=`${t}-hinge`,h.position.set(n-.5/2,0,-.35+.03);const f=.5-.03,m=1.86-.03*2,v=ze(new U(f,m,.03),c);v.position.set(f/2,1.86/2,0),h.add(v);const p=ze(new U(.022,m*.8,.03+.005),Xv);p.position.set(f-.04,1.86/2,0),h.add(p),a.add(h);const g=df(400,w=>{h.rotation.y=-w*(Math.PI/2)}),S=g;v.onBeforeRender=()=>{S.tick()};const x={minX:n-.5/2,maxX:n+.5/2,minY:0,maxY:1.86,minZ:-.35,maxZ:0};return{group:a,collider:x,tween:g,id:t}}function $v(){const n=new Bt,t=ze(JE,Yv);t.position.set(0,.27,0),n.add(t);const e=ze(QE,qv);e.position.set(-.13,.61,.06),n.add(e);const i=ze($E,Zv);i.position.set(.05,.553,-.03),n.add(i);const o=ze(tA,kE);return o.position.set(.05,.568,-.03),n.add(o),{group:n,collider:{minX:-.22,maxX:.22,minY:0,maxY:.7,minZ:-.19,maxZ:.19}}}function eA(){return $t("qtr-toolboard",()=>{const t=document.createElement("canvas");t.width=256,t.height=256;const e=t.getContext("2d");e.fillStyle="#1A1C20",e.fillRect(0,0,256,256),e.fillStyle="rgba(80,85,95,0.5)";for(let o=32;o<256;o+=32)for(let s=32;s<256;s+=32)e.beginPath(),e.arc(s,o,3,0,Math.PI*2),e.fill();const i=new yt(t);return i.wrapS=i.wrapT=Dt,i})}function nA(){return $t("qtr-picture",()=>{const t=document.createElement("canvas");t.width=128,t.height=128;const e=t.getContext("2d");e.fillStyle="#2a1a0a",e.fillRect(0,0,128,128);const i=e.createRadialGradient(128/2,128/2,0,128/2,128/2,128*.55);return i.addColorStop(0,"rgba(200,160,100,0.9)"),i.addColorStop(1,"rgba(60,40,20,0.7)"),e.fillStyle=i,e.fillRect(6,6,116,116),e.fillStyle="rgba(30,60,80,0.6)",e.fillRect(6,128/2,116,128/2-6),new yt(t)})}function Pr(n,t,e){const i=new L(n,t);return e&&(i.name=e),i}function iA(n,t,e){const o=t+-.03,s=Pr(new U(.03,.7,1),new Gt({map:eA()}));s.position.set(o,1.7,e),n.add(s);const r=[-.38,-.19,0,.19,.38],a=[.3,.22,.35,.2,.28];for(let c=0;c<5;c++){const l=Pr(new U(.025,a[c],.04),WE);l.position.set(o+-1*.025,1.72,e+r[c]),n.add(l)}}function oA(n,t,e){const o=Pr(new U(.03,.3,.26),new Gt({color:2759178}));o.position.set(t+1*.015,1.72,e),n.add(o);const s=Pr(new U(.005,.22,.18),new lt({map:nA()}));s.position.set(t+1*.032,1.72,e),n.add(s)}function sA(n,t,e){const i=new L(new wt(.065,.05,.12,10),GE);i.position.set(t,.06,e),n.add(i);const o=new L(new wt(.06,.06,.01,10),new Gt({color:1708040}));o.position.set(t,.125,e),n.add(o);const s=new L(new Se(.085,8,6),new Gt({color:1727024}));s.position.set(t,.26,e),n.add(s)}function t1(n,t,e){const i=t<0?1:-1,o=Pr(new U(.02,.12,.08),new Gt({color:2895928}),"light-switch-plate");o.position.set(t+i*.01,1.2,e),n.add(o);const s=Pr(new U(.008,.02,.02),Kv);s.position.set(t+i*.025,1.2,e),n.add(s)}function rA(){return $t("qtr-tablet-scr",()=>{const e=document.createElement("canvas");e.width=128,e.height=96;const i=e.getContext("2d");i.fillStyle="#071816",i.fillRect(0,0,128,96),i.strokeStyle="rgba(70,224,216,0.3)",i.lineWidth=1;for(let o=16;o<96;o+=16)i.beginPath(),i.moveTo(0,o),i.lineTo(128,o),i.stroke();for(let o=16;o<128;o+=16)i.beginPath(),i.moveTo(o,0),i.lineTo(o,96),i.stroke();return i.fillStyle="rgba(70,224,216,0.85)",i.font="9px monospace",i.fillText("STATUS OK",6,14),i.fillText("BRG 247°",6,26),i.fillText("ALT 3.2k",6,38),new yt(e)})}function Ve(n,t,e){const i=new L(n,t);return e&&(i.name=e),i}function e1(n,t,e){const m=Ve(new U(.12,1.08,.08),Pn);m.position.set(t-2/2-.12/2,1.08/2,-2.46),n.add(m);const v=Ve(new U(.12,1.08,.08),Pn);v.position.set(t+2/2+.12/2,1.08/2,-2.46),n.add(v);const p=Ve(new U(2+.12*2,.12,.08),Pn);p.position.set(t,1.08+.12/2,-2.46),n.add(p);const g=Ve(new U(2,.05,.12),vd);g.position.set(t,.76+.05/2,-2.42+.12/2),n.add(g);const S=Ve(new U(.6,.03,.02),Kv);S.position.set(t,1.08-.04,-2.42-.01),n.add(S)}const aA=new Ft({color:3817028,roughness:.22,metalness:.75,envMapIntensity:1.6});function cA(n,t){const s=t<0?1:-1,r=t+s*.001,a=new Ft({color:855569,roughness:.9,metalness:.1,side:me}),c=new Xn(.38,.68,48),l=new L(c,a);l.rotation.y=Math.PI/2,l.position.set(r+s*.005,1.6,0),n.add(l);const d=new wt(.38,.38,.08,32,1,!0),u=new Ft({color:1711136,roughness:.7,metalness:.15,envMapIntensity:.15,side:je}),h=new L(d,u);h.rotation.z=Math.PI/2,h.position.set(r+s*.04,1.6,0),n.add(h);const f=new Ln(.38,.058,12,48),m=new L(f,aA);m.rotation.y=Math.PI/2,m.position.set(r+s*.002,1.6,0),n.add(m);const v=new Ft({color:10133672,metalness:.9,roughness:.15}),p=new Ln(.38-.03,.012,8,48),g=new L(p,v);g.rotation.y=Math.PI/2,g.position.set(r+s*.009,1.6,0),n.add(g);const S=9,x=.38+.058,w=new Ft({color:4870232,roughness:.35,metalness:.85,envMapIntensity:1}),E=new wt(.014,.014,.04,8);for(let b=0;b<S;b++){const T=b/S*Math.PI*2,C=1.6+Math.sin(T)*x,y=0+Math.cos(T)*x,_=new L(E,w);_.rotation.z=Math.PI/2,_.position.set(r+s*.035,C,y),n.add(_)}}function n1(n,t){const c=.9600000000000001,l=t<0?1:-1,d=t+l*.08/2,u=.06,h=Ve(new U(.08+.04,u,1),Pn);h.position.set(d,1.6+.8/2+u/2,0),n.add(h);const f=Ve(new U(.08+.04,u,1),Pn);f.position.set(d,1.6-.8/2-u/2,0),n.add(f);const m=Ve(new U(.08+.04,c,u),Pn);m.position.set(d,1.6,0-1/2-u/2),n.add(m);const v=Ve(new U(.08+.04,c,u),Pn);v.position.set(d,1.6,0+1/2+u/2),n.add(v);const p=.025,g=t+l*(.08+.04+p/2),S=Ve(new U(p,p,1+p*2+.05),pr);S.position.set(g,1.6+.8/2+p/2,0),n.add(S);const x=Ve(new U(p,p,1+p*2+.05),pr);x.position.set(g,1.6-.8/2-p/2,0),n.add(x);const w=Ve(new U(p,.8+p*2,p),pr);w.position.set(g,1.6,0-1/2-p/2),n.add(w);const E=Ve(new U(p,.8+p*2,p),pr);E.position.set(g,1.6,0+1/2+p/2),n.add(E);const b=Ve(new U(.08,.05,.7),vd);b.position.set(d,1.6-.8/2-.025+.03,0),n.add(b),cA(n,t);const T=t+l*.001;PE(n,.38,T,l,1.6,0)}function i1(n,t,e){const a=t<0?1:-1,c=t+a*.35/2,l=Ve(new U(.35,.45,2),Dn);l.position.set(c,2.3+.45/2,e),n.add(l);const d=Ve(new U(.01,.45-.04,2-.04),vd);d.position.set(t+a*(.35+.005),2.3+.45/2,e),n.add(d);for(const u of[-.65,0,.65]){const h=Ve(new U(.03,.06,.12),pr);h.position.set(t+a*(.35+.015),2.3+.45/2,e+u),n.add(h)}}function o1(n,t,e,i){const o=t<0?1:-1,s=.03,r=.3,a=.22,c=Ve(new U(s,a,r),Dn,i);c.position.set(t+o*s/2,1.4,e),n.add(c);const l=Ve(new U(.005,a-.02,r-.02),vd);l.position.set(t+o*(s+.003),1.4,e),n.add(l);const d=new lt({map:rA(),color:4645080}),u=Ve(new U(.004,a-.04,r-.06),d);u.position.set(t+o*(s+.006),1.4,e),n.add(u)}function s1(n,t,e){const i=t<0?1:-1,o=t+i*.05;for(let r=0;r<3;r++){const a=new L(new Ln(.04,.012,6,12),Pn);a.position.set(o,1.85,e+(r-1)*.22),a.rotation.y=Math.PI/2,n.add(a)}const s=Ve(new U(.04,.32,.28),new Gt({color:3811866}));s.position.set(o+i*.025,1.55,e),n.add(s)}const lA=new lt({color:4645080});function dA(){const e=document.createElement("canvas");e.width=64,e.height=80;const i=e.getContext("2d");i.fillStyle="#E8E2D4",i.fillRect(0,0,64,80),i.fillStyle="rgba(28,30,34,0.55)",i.font="7px monospace";for(let o=0;o<6;o++)i.fillRect(8,12+o*11,48,1);return i.fillStyle="#C7641E",i.fillRect(6,6,4,68),new yt(e)}function uA(){const e=document.createElement("canvas");e.width=128,e.height=80;const i=e.getContext("2d");i.fillStyle="#1A1C20",i.fillRect(0,0,128,80),i.fillStyle="rgba(90,88,80,0.4)";for(let s=10;s<80;s+=12)for(let r=10;r<128;r+=12)i.beginPath(),i.arc(r,s,1,0,Math.PI*2),i.fill();const o=[{x:14,y:10,w:32,h:22,angle:-.06,col:"#E8E2D4"},{x:58,y:8,w:28,h:20,angle:.04,col:"#C7641E"},{x:90,y:16,w:26,h:18,angle:-.03,col:"#E8E2D4"}];for(const s of o){if(i.save(),i.translate(s.x+s.w/2,s.y+s.h/2),i.rotate(s.angle),i.fillStyle=s.col,i.fillRect(-s.w/2,-s.h/2,s.w,s.h),s.col!=="#C7641E"){i.fillStyle="rgba(28,30,34,0.35)";for(let r=0;r<3;r++)i.fillRect(-s.w/2+3,-s.h/2+5+r*5,s.w-6,1)}i.fillStyle="#C7641E",i.beginPath(),i.arc(0,-s.h/2+3,2,0,Math.PI*2),i.fill(),i.restore()}return new yt(e)}function hA(n,t,e){const c=t+-.35,l=new U(.35,.04,.8);l.translate(t+-1*.35/2,.78,e);const d=.78,u=new U(.045,d,.045);u.translate(c- -1*.01,.78-d/2,e-.8/2+.04);const h=new U(.045,d,.045);h.translate(c- -1*.01,.78-d/2,e+.8/2-.04);const f=[l,u,h],m=Qt(f);for(const w of f)w.dispose();n.add(new L(m,Oo));const v=new L(new U(.22,.018,.16),Zv);v.position.set(t+-1*(.35/2+.02),.78+.04+.009,e-.04),n.add(v);const p=new L(new U(.18,.02,.12),lA);p.position.set(t+-1*(.35/2+.02),.78+.04+.02,e-.04),n.add(p);const g=new lt({map:dA(),transparent:!0,opacity:.9,depthWrite:!1}),S=new L(new qt(.14,.18),g);return S.rotation.x=-Math.PI/2,S.position.set(c- -1*.1,.78+.04+.002,e+.22),n.add(S),{minX:Math.min(t,c)-.01,maxX:Math.max(t,c)+.01,minY:0,maxY:.78+.04+.05,minZ:e-.8/2-.02,maxZ:e+.8/2+.02}}function fA(n,t,e){const o=t+-.015,s=.75,r=.45,a=1.25,c=new L(new U(.015,r,s),Dn);c.position.set(o,a+r/2,e),n.add(c);const l=new lt({map:uA(),transparent:!1}),d=new L(new qt(s,r),l);d.rotation.y=0,d.position.set(o+-1*.009,a+r/2,e),n.add(d);const u=.2,h=.025,f=a+r+.04,m=new L(new U(u,h,s),Yv);m.position.set(t+-1*u/2,f,e),n.add(m);const v=new wt(.03,.025,.08,8);v.translate(t+-1*(u*.55),f+h/2+.04,e-.2);const p=new U(.08,.06,.06);p.translate(t+-1*(u*.45),f+h/2+.03,e+.18);const g=new L(v,qv);n.add(g);const S=new L(p,pr);n.add(S)}const pA=.035,mA=.06,gA=58,vA=140,xA=1.2,SA=90,_A=4,MA=.08,wA=.018,yA=.65,bA=.04,xu=.055,F0=.42,TA=.54,EA=80,z0=800;function ba(n,t){const e=n.sampleRate,i=Math.ceil(e*t),o=n.createBuffer(1,i,e),s=o.getChannelData(0);for(let r=0;r<i;r++)s[r]=Math.random()*2-1;return o}function AA(n,t){const e=ba(n,4),i=n.createBufferSource();i.buffer=e,i.loop=!0;const o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=vA,o.Q.value=xA;const s=n.createBiquadFilter();s.type="bandpass",s.frequency.value=SA,s.Q.value=_A;const r=n.createGain();r.gain.value=pA,i.connect(o),o.connect(s),s.connect(r),r.connect(t),i.start(0);const a=n.createOscillator();a.type="sine",a.frequency.value=gA;const c=n.createGain();c.gain.value=mA,a.connect(c),c.connect(t),a.start(0);const l=n.createOscillator();l.type="sine",l.frequency.value=MA;const d=n.createGain();return d.gain.value=wA,l.connect(d),d.connect(t.gain),l.start(0),i}function CA(n,t){const e=n.createGain();e.gain.value=0,e.connect(t);function i(o){const s=n.createOscillator();s.type="sine",s.frequency.value=2200+Math.random()*800;const r=n.createGain();r.gain.setValueAtTime(0,o),r.gain.linearRampToValueAtTime(.02,o+.01),r.gain.exponentialRampToValueAtTime(1e-4,o+.08),s.connect(r),r.connect(e),s.start(o),s.stop(o+.09);const a=o+.8+Math.random()*1.7;setTimeout(()=>i(a),(a-n.currentTime)*1e3-50)}return i(n.currentTime+.2),{gainNode:e,sources:[e]}}function RA(n,t){const e=n.createGain();e.gain.value=0,e.connect(t);const i=n.createOscillator();i.type="sawtooth",i.frequency.value=45;const o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=200,o.Q.value=2;const s=n.createGain();s.gain.value=.1,i.connect(o),o.connect(s),s.connect(e),i.start(0);const r=n.createOscillator();r.type="sine",r.frequency.value=.4;const a=n.createGain();return a.gain.value=.04,r.connect(a),a.connect(s.gain),r.start(0),{gainNode:e,sources:[i,r]}}function PA(n,t){const e=n.createGain();e.gain.value=0,e.connect(t);const i=n.createOscillator();i.type="square",i.frequency.value=120;const o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=280,o.Q.value=1.5;const s=n.createGain();return s.gain.value=.05,i.connect(o),o.connect(s),s.connect(e),i.start(0),{gainNode:e,sources:[i]}}function Su(n,t){const e=n.createGain();e.gain.value=0,e.connect(t);const i=n.createOscillator();i.type="sine",i.frequency.value=58;const o=n.createGain();return o.gain.value=.04,i.connect(o),o.connect(e),i.start(0),{gainNode:e,sources:[i]}}function LA(n,t,e,i){const o=n.createBufferSource();o.buffer=ba(n,xu+.01),o.playbackRate.value=.85+Math.random()*.3;const r={soft:450,tile:650,metal:2200}[i]+(Math.random()*2-1)*EA,a=n.createBiquadFilter();a.type="lowpass",a.frequency.value=r,a.Q.value=.8;const c=n.createGain();if(c.gain.setValueAtTime(bA,e),c.gain.exponentialRampToValueAtTime(1e-4,e+xu),o.connect(a),a.connect(c),c.connect(t),o.start(e),o.stop(e+xu+.01),i==="metal"){const l=n.createOscillator();l.type="sine",l.frequency.value=800;const d=n.createGain();d.gain.setValueAtTime(.04,e),d.gain.exponentialRampToValueAtTime(1e-4,e+.12),l.connect(d),d.connect(t),l.start(e),l.stop(e+.13)}}function DA(n,t,e){const i=n.currentTime;if(e==="ui"){const o=n.createOscillator();o.type="sine",o.frequency.value=1200;const s=n.createGain();s.gain.setValueAtTime(.12,i),s.gain.exponentialRampToValueAtTime(1e-4,i+.06),o.connect(s),s.connect(t),o.start(i),o.stop(i+.07)}else if(e==="door"){const o=n.createOscillator();o.type="sine",o.frequency.setValueAtTime(200,i),o.frequency.exponentialRampToValueAtTime(50,i+.08);const s=n.createGain();s.gain.setValueAtTime(.18,i),s.gain.exponentialRampToValueAtTime(1e-4,i+.08),o.connect(s),s.connect(t),o.start(i),o.stop(i+.09);const r=n.createBufferSource();r.buffer=ba(n,.15);const a=n.createBiquadFilter();a.type="highpass",a.frequency.value=3e3;const c=n.createGain();c.gain.setValueAtTime(.06,i),c.gain.exponentialRampToValueAtTime(1e-4,i+.15),r.connect(a),a.connect(c),c.connect(t),r.start(i),r.stop(i+.16)}else if(e==="eat")[220,277,330].forEach((o,s)=>{const r=n.createOscillator();r.type="sine",r.frequency.value=o;const a=n.createGain();a.gain.setValueAtTime(0,i+s*.04),a.gain.linearRampToValueAtTime(.07,i+s*.04+.02),a.gain.exponentialRampToValueAtTime(1e-4,i+s*.04+.35),r.connect(a),a.connect(t),r.start(i),r.stop(i+s*.04+.36)});else if(e==="sip"){const o=n.createOscillator();o.type="sine",o.frequency.setValueAtTime(440,i),o.frequency.exponentialRampToValueAtTime(280,i+.08);const s=n.createBiquadFilter();s.type="lowpass",s.frequency.value=600;const r=n.createGain();r.gain.setValueAtTime(.08,i),r.gain.exponentialRampToValueAtTime(1e-4,i+.09),o.connect(s),s.connect(r),r.connect(t),o.start(i),o.stop(i+.1)}else if(e==="vent"){const o=n.createBufferSource();o.buffer=ba(n,.35);const s=n.createBiquadFilter();s.type="bandpass",s.Q.value=3,s.frequency.setValueAtTime(4e3,i),s.frequency.exponentialRampToValueAtTime(200,i+.3);const r=n.createGain();r.gain.setValueAtTime(.1,i),r.gain.exponentialRampToValueAtTime(1e-4,i+.32),o.connect(s),s.connect(r),r.connect(t),o.start(i),o.stop(i+.35)}else if(e==="save")[880,1100].forEach((o,s)=>{const r=n.createOscillator();r.type="sine",r.frequency.value=o;const a=n.createGain();a.gain.setValueAtTime(.1,i+s*.09),a.gain.exponentialRampToValueAtTime(1e-4,i+s*.09+.08),r.connect(a),a.connect(t),r.start(i+s*.09),r.stop(i+s*.09+.09)});else if(e==="door-auto"){const o=n.createOscillator();o.type="sine",o.frequency.setValueAtTime(120,i),o.frequency.exponentialRampToValueAtTime(40,i+.12);const s=n.createGain();s.gain.setValueAtTime(.1,i),s.gain.exponentialRampToValueAtTime(1e-4,i+.12),o.connect(s),s.connect(t),o.start(i),o.stop(i+.13);const r=n.createBufferSource();r.buffer=ba(n,.18);const a=n.createBiquadFilter();a.type="highpass",a.frequency.value=1800;const c=n.createGain();c.gain.setValueAtTime(.03,i),c.gain.exponentialRampToValueAtTime(1e-4,i+.18),r.connect(a),a.connect(c),c.connect(t),r.start(i),r.stop(i+.19)}else if(e==="quest-start")[260,340].forEach((o,s)=>{const r=n.createOscillator();r.type="sine",r.frequency.setValueAtTime(o*.8,i+s*.18),r.frequency.linearRampToValueAtTime(o,i+s*.18+.22);const a=n.createGain();a.gain.setValueAtTime(.09,i+s*.18),a.gain.exponentialRampToValueAtTime(1e-4,i+s*.18+.38),r.connect(a),a.connect(t),r.start(i+s*.18),r.stop(i+s*.18+.4)});else if(e==="quest-step"){const o=n.createOscillator();o.type="sine",o.frequency.value=660;const s=n.createGain();s.gain.setValueAtTime(.11,i),s.gain.exponentialRampToValueAtTime(1e-4,i+.1),o.connect(s),s.connect(t),o.start(i),o.stop(i+.11)}else e==="quest-complete"&&[523,659,784].forEach((o,s)=>{const r=n.createOscillator();r.type="sine",r.frequency.value=o;const a=n.createGain();a.gain.setValueAtTime(.13,i+s*.12),a.gain.linearRampToValueAtTime(.1,i+s*.12+.08),a.gain.exponentialRampToValueAtTime(1e-4,i+s*.12+.45),r.connect(a),a.connect(t),r.start(i+s*.12),r.stop(i+s*.12+.46)})}function IA(n,t){const e=n.createPanner();e.setPosition(-4,1.7,-16),e.refDistance=3,e.maxDistance=12,e.rolloffFactor=1.5,e.connect(t);function i(c){const l=n.createOscillator();l.type="sine",l.frequency.value=800+Math.random()*400;const d=n.createGain();d.gain.setValueAtTime(.008,c),d.gain.exponentialRampToValueAtTime(1e-4,c+.05),l.connect(d),d.connect(e),l.start(c),l.stop(c+.06);const u=c+1.2+Math.random()*2;setTimeout(()=>i(u),(u-n.currentTime)*1e3-50)}i(n.currentTime+.5);const o=n.createPanner();o.setPosition(4,1.7,-16),o.refDistance=3,o.maxDistance=12,o.rolloffFactor=1.5,o.connect(t);const s=n.createOscillator();s.type="sine",s.frequency.value=220;const r=n.createBiquadFilter();r.type="lowpass",r.frequency.value=400;const a=n.createGain();a.gain.value=.008,s.connect(r),r.connect(a),a.connect(o),s.start(0)}function NA(n,t){const e=n.createGain();e.gain.value=0,e.connect(t);const i=n.createBiquadFilter();i.type="lowpass",i.frequency.value=900,i.Q.value=.7,i.connect(e);const o=n.createOscillator();o.type="sine",o.frequency.value=196;const s=n.createGain();s.gain.value=.05,o.connect(s),s.connect(i),o.start(0);const r=n.createOscillator();r.type="sine",r.frequency.value=293.7;const a=n.createGain();a.gain.value=.035,r.connect(a),a.connect(i),r.start(0);const c=n.createOscillator();c.type="sine",c.frequency.value=.12;const l=n.createGain();return l.gain.value=.02,c.connect(l),l.connect(s.gain),c.start(0),{gainNode:e,sources:[o,r,c]}}function OA(n,t){const e=n.createGain();e.gain.value=0,e.connect(t);const i=n.createOscillator();i.type="sawtooth",i.frequency.value=38;const o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=160,o.Q.value=1.4;const s=n.createGain();s.gain.value=.09,i.connect(o),o.connect(s),s.connect(e),i.start(0);const r=n.createOscillator();r.type="sine",r.frequency.value=.06;const a=n.createGain();return a.gain.value=.03,r.connect(a),a.connect(s.gain),r.start(0),{gainNode:e,sources:[i,r]}}function UA(n,t){const e=n.createGain();e.gain.value=0,e.connect(t);const i=[1760,2093,2637];function o(s){const r=i[Math.floor(Math.random()*i.length)],a=n.createOscillator();a.type="sine",a.frequency.value=r;const c=n.createGain();c.gain.setValueAtTime(0,s),c.gain.linearRampToValueAtTime(.03,s+.03),c.gain.exponentialRampToValueAtTime(1e-4,s+1.4),a.connect(c),c.connect(e),a.start(s),a.stop(s+1.5);const l=s+2.2+Math.random()*3.5;setTimeout(()=>o(l),(l-n.currentTime)*1e3-50)}return o(n.currentTime+.3),{gainNode:e,sources:[e]}}function FA(n,t){return t<-20?"cockpit":Math.abs(n)>1.5&&t>=-18.5&&t<=-13.5?"quarters":t<-4?"corridor":t<2?"galley":t<=9?"engineering":"cargo"}function zA(n){return n==="engineering"||n==="cargo"?"metal":n==="galley"?"tile":"soft"}let pe=null,Qe=null,hl=null,_u=0,B0="soft";const li={};let ta="corridor";const Ta={};let Bc=null,fl=null;function Ee(n){fl?.(n)}function BA(){pe?.state==="suspended"&&pe.resume()}function HA(){if(pe)return;try{pe=new AudioContext}catch{return}Qe=pe.createGain(),Qe.gain.value=yA,Qe.connect(pe.destination),hl=AA(pe,Qe),li.cockpit=CA(pe,Qe),li.engineering=RA(pe,Qe),li.galley=PA(pe,Qe),li.corridor=Su(pe,Qe),li.quarters=Su(pe,Qe),li.cargo=Su(pe,Qe);const n=li.corridor;n&&(n.gainNode.gain.value=1),IA(pe,Qe),Ta.verdant=NA(pe,Qe),Ta.ashfall=OA(pe,Qe),Ta.rift=UA(pe,Qe)}function kA(){const n=()=>{HA(),BA()};window.addEventListener("click",n,{once:!0}),window.addEventListener("keydown",n,{once:!0});function t(r){if(!pe||r===ta)return;const a=pe.currentTime,c=z0/1e3,l=li[ta];l&&(l.gainNode.gain.cancelScheduledValues(a),l.gainNode.gain.setValueAtTime(l.gainNode.gain.value,a),l.gainNode.gain.linearRampToValueAtTime(0,a+c));const d=li[r];d&&(d.gainNode.gain.cancelScheduledValues(a),d.gainNode.gain.setValueAtTime(0,a),d.gainNode.gain.linearRampToValueAtTime(1,a+c)),ta=r,B0=zA(r)}fl=r=>{!pe||!Qe||pe.state!=="running"||DA(pe,Qe,r)};function e(r){if(!pe||r===Bc)return;const a=pe.currentTime,c=z0/1e3,l=u=>{u&&(u.gainNode.gain.cancelScheduledValues(a),u.gainNode.gain.setValueAtTime(u.gainNode.gain.value,a),u.gainNode.gain.linearRampToValueAtTime(0,a+c))},d=u=>{u&&(u.gainNode.gain.cancelScheduledValues(a),u.gainNode.gain.setValueAtTime(0,a),u.gainNode.gain.linearRampToValueAtTime(1,a+c))};l(Bc?Ta[Bc]:li[ta]),d(r?Ta[r]:li[ta]),Bc=r}function i(r){if(!pe||!Qe||pe.state!=="running")return;const a=pe.currentTime;r?a>=_u&&(LA(pe,Qe,a+.005,B0),_u=a+F0+Math.random()*(TA-F0)):_u=0}function o(){if(hl){try{hl.stop()}catch{}hl=null}pe&&(pe.close(),pe=null,Qe=null),fl=null,window.removeEventListener("click",n),window.removeEventListener("keydown",n)}return{tick:i,playOneShot:r=>{fl?.(r)},setRoom:t,setWorldBed:e,dispose:o}}const WA=13067294,GA=4645080,VA=13144863,XA=8006687,Ga=n=>new Gt({color:n,side:It}),YA=n=>new lt({color:n,side:It}),Mu=yi,qA=Ga(WA),Mh=Oo,r1=YA(GA),ZA=Ga(VA),Bl=Ga(3816771),KA=Ga(3816773),a1=Ga(XA),H0=new Ft({map:Oo.map,roughnessMap:Oo.roughnessMap,roughness:.55,metalness:.4,envMapIntensity:.85,side:It});function _i(n,t,e,i,o,s,r,a,c){const l=new L(new U(t,e,i),a);return l.position.set(o,s,r),c&&(l.name=c),n.add(l),l}function Ea(n,t,e,i,o,s,r,a){const c=new L(new wt(t,t,e,12,1),r);return c.position.set(i,o,s),a&&(c.name=a),n.add(c),c}function uf(n){return $t(`galley-cab-face-${n}`,()=>{const i=document.createElement("canvas");i.width=256,i.height=256;const o=i.getContext("2d"),s=n==="cream"?"#C8C1AF":n==="gunmetal"?"#2E3238":"#C7641E";o.fillStyle=s,o.fillRect(0,0,256,256);const r=[256/2],a=[256*.38,256*.72];o.fillStyle="rgba(4,3,2,0.90)";for(const m of r)o.fillRect(m-3,0,6,256);for(const m of a)o.fillRect(0,m-3,256,6);o.fillStyle="rgba(255,255,255,0.22)";for(const m of r)o.fillRect(m-5,0,2,256);for(const m of a)o.fillRect(0,m-5,256,2);o.fillStyle="rgba(0,0,0,0.40)";for(const m of r)o.fillRect(m+3,0,2,256);for(const m of a)o.fillRect(0,m+3,256,2);if(n==="cream"){const p=(a[0]-14)/6;for(let g=1;g<=5;g++){const S=8+p*g;o.fillStyle="rgba(10,8,5,0.80)",o.fillRect(16,S-2,224,4),o.fillStyle="rgba(255,220,180,0.18)",o.fillRect(16,S-2,224,1)}}const c=12,l=c,d=a[1]+c,u=256-c*2,h=256-a[1]-c*2;h>10&&(o.strokeStyle="rgba(0,0,0,0.35)",o.lineWidth=1.5,o.strokeRect(l,d,u,h),o.strokeStyle="rgba(255,255,255,0.14)",o.lineWidth=1,o.strokeRect(l+2,d+2,u-4,h-4));for(let m=0;m<6;m++){const v=20+Math.random()*216;o.fillStyle=`rgba(0,0,0,${(.04+Math.random()*.06).toFixed(3)})`,o.fillRect(v,0,2+Math.random()*3,256)}const f=new yt(i);return f.wrapS=f.wrapT=Dt,f})}const jA=new Gt({map:uf("cream"),side:It}),JA=new Gt({map:uf("gunmetal"),side:It}),QA=new Gt({map:uf("orange"),side:It}),c1=new lt({color:16756832,side:It,toneMapped:!1});function $A(){return $t("galley-pegboard",()=>{const t=document.createElement("canvas");t.width=256,t.height=256;const e=t.getContext("2d");e.fillStyle="#1A1C20",e.fillRect(0,0,256,256),e.fillStyle="rgba(80,85,95,0.6)";for(let o=24;o<256;o+=24)for(let s=24;s<256;s+=24)e.beginPath(),e.arc(s,o,3,0,Math.PI*2),e.fill();const i=new yt(t);return i.wrapS=i.wrapT=Dt,i})}function tC(){return $t("galley-mess-deck",()=>{const e=document.createElement("canvas");e.width=256,e.height=128;const i=e.getContext("2d");return i.fillStyle="#050a0f",i.fillRect(0,0,256,128),i.strokeStyle="rgba(70,224,216,0.3)",i.lineWidth=1,i.strokeRect(4,4,248,120),i.fillStyle="rgba(70,224,216,0.85)",i.font="bold 22px monospace",i.textAlign="center",i.fillText("MESS DECK",256/2,128/2-6),i.font="12px monospace",i.fillStyle="rgba(70,224,216,0.5)",i.fillText("DECK B · FWD",256/2,128/2+14),new yt(e)})}function eC(){return $t("galley-galley-sign",()=>{const e=document.createElement("canvas");e.width=256,e.height=128;const i=e.getContext("2d");return i.fillStyle="#050a0f",i.fillRect(0,0,256,128),i.strokeStyle="rgba(70,224,216,0.3)",i.lineWidth=1,i.strokeRect(4,4,248,120),i.fillStyle="rgba(70,224,216,0.85)",i.font="bold 26px monospace",i.textAlign="center",i.fillText("GALLEY",256/2,128/2-4),i.font="12px monospace",i.fillStyle="rgba(70,224,216,0.5)",i.fillText("CAUTION · HOT SURFACES",256/2,128/2+16),new yt(e)})}function nC(n){const r=new Gt({map:$A(),side:It}),a=new L(new U(.04,.9,1.4),r);a.name="pegboard",a.position.set(-3+.02,1.4,-.2),n.add(a);const c=[[-.48,.18,.04,.03],[-.22,.14,.04,.03],[.02,.22,.04,.03],[.22,.16,.04,.03],[-.35,.08,.025,.025],[.38,.1,.025,.025]];for(let l=0;l<c.length;l++){const[d,u,h]=c[l];if(l<4){const f=new L(new U(.02,u,h),Mu);f.name=`utensil-${l}`,f.position.set(-3+.055,1.4,-.2+d),n.add(f)}else{const f=new L(new wt(.016,.012,u,6),Mu);f.name=`utensil-${l}`,f.position.set(-3+.055,1.4,-.2+d),n.add(f)}}for(const l of[-.32,.32]){const d=new L(new U(.4,.8,.5),Mu);d.position.set(-3+.2,.4,-.2+l),n.add(d);const u=new L(new U(.02,.06,.16),qA);u.position.set(-3+.405,.55,-.2+l),n.add(u)}}function iC(n,t){const r=new L(new U(.8,.4,.06),Dn);r.position.set(1.5,2.6,-t/2+.06/2+.01),n.add(r);const a=new L(new qt(.8-.04,.4-.04),new lt({map:tC()}));a.position.set(1.5,2.6,-t/2+.06+.012),n.add(a);const c=new L(new U(.8,.4,.06),Dn);c.position.set(1.5,2.6,t/2-.06/2-.01),n.add(c);const l=new L(new qt(.8-.04,.4-.04),new lt({map:eC()}));l.rotation.y=Math.PI,l.position.set(1.5,2.6,t/2-.06-.012),n.add(l),Ua(n,{x:1.5,y:2.6-.4/2-.05,z:-t/2+.06+.02,width:.8*.8,length:.2,rotY:0,tiltX:-.35,color:2808038,opacity:.3}),Ua(n,{x:1.5,y:2.6-.4/2-.05,z:t/2-.06-.02,width:.8*.8,length:.2,rotY:Math.PI,tiltX:-.35,color:2808038,opacity:.3})}function oC(n,t,e,i,o){_i(n,.28,.025,.16,t,e+.012,-1.8,Bl),Ea(n,.055,.13,t-.05,e+.065,-1.9,r1),Ea(n,.05,.12,t+.08,e+.06,-1.62,ZA),_i(n,.14,.1,.08,t,e+.05,i-.15,a1),_i(n,.22,.018,.14,t-.05,e+.009,o+.3,Bl),Ea(n,.042,.16,t+.1,e+.08,o-.2,Mh)}function sC(n){_i(n,1.7,.05,.85,-1.1,.78,-.4,Mh);for(const l of[-1.1-1.7/2+.08,-1.1+1.7/2-.08])for(const d of[-.4-.85/2+.08,-.4+.85/2+.08])_i(n,.05,.73,.05,l,.73/2,d,H0);const a=.44,c=.85/2+.26;for(const[l,d]of[[0,-.4-c],[1,-.4+c]]){const u=l===0?"bench-fore":"bench-aft";_i(n,1.7*.86,.05,.3,-1.1,a,d,Mh,u),_i(n,1.7*.78,a-.025,.06,-1.1,(a-.025)/2,d,H0)}return _i(n,.28,.02,.2,-1.1-.35,.78+.01,-.4-.1,Bl),_i(n,.28,.02,.2,-1.1+.3,.78+.01,-.4+.15,Bl),Ea(n,.038,.09,-1.1-.42,.78+.045,-.4+.18,r1,"coffee-cup"),Ea(n,.036,.085,-1.1+.42,.78+.042,-.4-.2,KA),_i(n,.14,.1,.08,-1.1,.78+.05,-.4,a1),[{minX:-1.1-1.7/2,minY:0,minZ:-.4-.85/2-c-.18,maxX:-1.1+1.7/2,maxY:.78,maxZ:-.4+.85/2+c+.18}]}const rC=15262420,aC=13067294,cC=4645080,lC=8006687,dC=13382434,uC=13144863,xd=n=>new Gt({color:n,side:It}),hf=n=>new lt({color:n,side:It}),fs=Oo,wh=xd(rC),Hl=xd(aC),hC=Oo,fC=xd(lC),l1=hf(cC),pC=hf(dC),mC=xd(uC),gC=hf(3451042);function mn(n,t,e,i,o,s,r,a,c){const l=new L(new U(t,e,i),a);return l.position.set(o,s,r),c&&(l.name=c),n.add(l),l}const Ms=3,An=.55,kn=.9,Ye=Ms-An/2,Ro=Ms-An,ti=-2.2,d1=1.4,Rn=.7,Aa=d1,Ca=(Rn+Aa)/2,Ze=2.1,Zi=-1.2,Va=0,yh=(Zi+Va)/2,vC=Va-Zi,wu=Zi-ti,bh=(ti+Zi)/2,yu=Rn-Va,Th=(Va+Rn)/2,bu=Rn-ti,Tu=(ti+Rn)/2,as=1.5,xo=1.05,Ra=.38,ea=Ms-Ra/2,Eu=Ms-Ra,or=Rn-ti,pl=(ti+Rn)/2;function xC(n){const t=kn-.06;mn(n,An,.06,bu,Ye,kn-.03,Tu,fs),mn(n,An-.02,.04,vC,Ye,kn+.01,yh,fC,"stove"),mn(n,An,t,wu,Ye,t/2,bh,wh),mn(n,An,t,yu,Ye,t/2,Th,wh);const e=new L(new qt(wu,t),jA);e.rotation.y=Math.PI/2,e.position.set(Ro-.001,t/2,bh),n.add(e);const i=new L(new qt(yu,t),JA);i.rotation.y=Math.PI/2,i.position.set(Ro-.001,t/2,Th),n.add(i);const o=new L(new U(.015,.025,bu),c1);o.position.set(Ro+.008,.035,Tu),n.add(o);const s=Ro-.015;for(let a=0;a<2;a++)mn(n,.03,.5,.06,s,t/2,ti+wu/3*(a+1),Hl);mn(n,.03,.5,.06,s,t/2,Va+yu/2,Hl),mn(n,An,.1,bu,Ye,.05,Tu,hC);const r=as-kn;return mn(n,.025,r,or,Ms-.012,kn+r/2,pl,Fl),[{minX:Ro,minY:0,minZ:ti,maxX:Ms,maxY:kn+.1,maxZ:d1}]}function SC(n){mn(n,Ra,xo,or,ea,as+xo/2,pl,wh);const t=new L(new qt(or,xo),QA);t.rotation.y=Math.PI/2,t.position.set(Eu-.001,as+xo/2,pl),n.add(t);for(let c=1;c<3;c++)mn(n,Ra+.006,xo+.008,.028,ea,as+xo/2,ti+or/3*c,fs);const e=Eu-.015;for(let c=0;c<3;c++)mn(n,.03,.38,.06,e,as+xo/2,ti+or/4*(c+1),Hl);const i=new L(new U(.1,.04,or),c1);i.position.set(Eu+.05,as-.02,pl),n.add(i);const o=as+xo+.04,s=1.1;mn(n,Ra-.05,.04,s,ea,o+.02,ti+s/2+.1,fs);const r=[mC,l1,fs],a=ti+.2;for(let c=0;c<3;c++){const l=new L(new wt(.055,.055,.18,10),r[c]);l.position.set(ea,o+.04+.09,a+c*.3),n.add(l);const d=new L(new wt(.058,.058,.025,10),fs);d.position.set(ea,o+.04+.18+.012,a+c*.3),n.add(d)}}function _C(n){for(const o of[Zi+.28,Zi+.82])for(const s of[Ye-.12,Ye+.12]){const r=new L(new Ln(.075,.02,6,14),pC);r.position.set(s,kn+.035,o),r.rotation.x=Math.PI/2,n.add(r)}const t=new L(new wt(.18,.15,.14,14),fs);t.position.set(Ye,kn+.07+.01,Zi+.82),n.add(t);const e=new L(new Ln(.18,.015,6,16),fs);e.position.set(Ye,kn+.07+.13,Zi+.82),e.rotation.x=Math.PI/2,n.add(e);const i=new L(new wt(.015,.015,.01,8),l1);i.position.set(Ye,kn+.07+.145,Zi+.82),n.add(i),Ci(n,[{pos:new M(Ye-.18,kn+.04,yh),color:xe.red},{pos:new M(Ye+.18,kn+.04,yh),color:xe.warm,blink:!0,period:3,phase:.7}])}let Yi=null,Eh=[],Ah=null;new M(Ro-.3,Ze*.55,Ca);function u1(){return Yi}function Pa(){return Eh}function MC(){return Ah}function wC(n,t,e){const i=t-.04,o=Ca,s=Ye-e/2,r=Aa-Rn-e*2-.04,a=$n,c=Oo,l=new L(new U(.01,Ze-e*2-.04,r),a);l.position.set(s-i/2,Ze/2,o),n.add(l);for(const u of[Ze*.35,Ze*.62]){const h=new L(new U(i-.02,.018,r-.02),c);h.position.set(s,u,o),n.add(h)}Eh=[];const d=new Gt({color:6957592});for(let u=0;u<3;u++){const h=new L(new U(.1,.07,.08),d);h.name=`fridge-ration-${u}`,h.position.set(s,Ze*.35+.053,Rn+e+.06+u*.12),h.visible=!1,n.add(h),Eh.push(h)}}function yC(n){const t=Aa-Rn,e=new Bt;e.name="fridge";const i=.045,o=An-i;mn(e,o,Ze,t,Ye-i/2,Ze/2,Ca,yi),mn(e,An,i,t,Ye,Ze-i/2,Ca,yi),mn(e,An,i,t,Ye,i/2,Ca,yi),mn(e,An,Ze-i*2,i,Ye,Ze/2,Rn+i/2,yi),mn(e,An,Ze-i*2,i,Ye,Ze/2,Aa-i/2,yi),wC(e,o,i);const s=An-i,r=Ze-i*2-.008,a=t-i*2;Yi=new Bt,Yi.name="fridge-hinge",Yi.position.set(Ro+s/2,0,Rn+i);const c=new L(new U(s,r,a),yi);c.position.set(-s/2,Ze/2,a/2),Yi.add(c);const l=new L(new U(.022,r*.88,.06),gC);l.position.set(-s-.012,Ze/2,a/2),Yi.add(l);const d=new L(new U(.022,.045,.2),Hl);d.position.set(-s-.018,Ze*.72,a/2),Yi.add(d),e.add(Yi);const u=Yi;Ah=df(400,f=>{u.rotation.y=f*(Math.PI/2)});const h=Ah;return c.onBeforeRender=()=>{h.tick()},Ci(e,[{pos:new M(Ye-An*.3,Ze-i-.05,Rn+t*.15),color:xe.teal},{pos:new M(Ye-An*.3,Ze-i-.05,Rn+t*.85),color:xe.orange,blink:!0,period:2.2,phase:.9}]),n.add(e),[{minX:Ro,minY:0,minZ:Rn,maxX:Ms,maxY:Ze,maxZ:Aa}]}function bC(n){const t=[];return t.push(...xC(n)),SC(n),_C(n),t.push(...yC(n)),oC(n,Ye,kn,Th,bh),t.push(...sC(n)),nC(n),iC(n,6),{colliders:t}}const js=1.34,Hc=2.08,Js=.07,k0=.04,W0=2,G0=.075,TC=.025,V0=.55,X0=.95,Y0=.04,h1=2.15,EC=.48,AC=1842722,CC=13067294,RC=4645080;let q0=null;const PC=()=>q0??(q0=new Gt({color:AC}));let Z0=null;const LC=()=>Z0??(Z0=new Gt({color:CC}));let K0=null;const DC=()=>K0??(K0=new lt({color:RC})),Wo=[];let za=new M(0,1.7,-19);function IC(n){za.copy(n)}function NC(n){const t=Wo.find(e=>e.id===n);t&&(t.autoCloseArmed=!0)}function f1(n){return n<.5?2*n*n:-1+(4-2*n)*n}function ff(n,t){const e=Wo.find(i=>i.id===n);e&&e.open!==t&&(e.open=t,e.animDir=t?1:-1)}function kl(n){const t=Wo.find(e=>e.id===n);return t?t.open:!1}function OC(n){const t=performance.now();for(const e of Wo){if(e.animDir!==0){e.animT+=e.animDir*(n/EC),e.animT=Math.max(0,Math.min(1,e.animT)),e.animT>=1?(e.animDir=0,e.open&&(e.openedAt=performance.now())):e.animT<=0&&(e.animDir=0);const i=f1(e.animT);e.mesh.position.y=e.pivotY+i*h1}if(e.autoCloseArmed&&e.open&&e.animDir===0&&e.animT>=1&&t-e.openedAt>8e3){const o=za.x-e.worldX,s=za.z-e.worldZ;o*o+s*s>9&&(ff(e.id,!1),Ee("door-auto"))}}}function UC(){const n=[];for(const t of Wo){if(!(t.autoCloseArmed&&t.open&&t.animT>=1))continue;const e=za.x-t.worldX,i=za.z-t.worldZ;e*e+i*i>9&&(ff(t.id,!1),Ee("door-auto"),n.push(t.id))}return n}function FC(n,t){for(const e of t){const i=e.position.y,o=new Bt;o.name=`door-${e.id}`;const s=new L(new U(e.facing==="Z"?js:Js,Hc,e.facing==="Z"?Js:js),PC());s.position.y=Hc/2,o.add(s);const r=new L(new U(e.facing==="Z"?k0:G0,W0,e.facing==="Z"?G0:k0),LC());r.position.y=W0/2,o.add(r);const a=new L(new Se(TC,8,6),DC());e.facing==="Z"?a.position.set(V0,X0,Y0):a.position.set(Y0,X0,V0),o.add(a),o.position.set(e.position.x,i,e.position.z);const c=e.facing==="Z"?{minX:e.position.x-js/2,minY:e.position.y,minZ:e.position.z-Js/2,maxX:e.position.x+js/2,maxY:e.position.y+Hc,maxZ:e.position.z+Js/2}:{minX:e.position.x-Js/2,minY:e.position.y,minZ:e.position.z-js/2,maxX:e.position.x+Js/2,maxY:e.position.y+Hc,maxZ:e.position.z+js/2},l=1;o.position.y=i+f1(l)*h1;const d={id:e.id,mesh:o,pivotY:i,collider:c,open:!0,animT:l,animDir:0,openedAt:0,autoCloseArmed:!1,worldX:e.position.x,worldZ:e.position.z};Wo.push(d),n.add(o)}}function zC(n,t,e){return new M(n,t,e)}let Ch=null;function BC(n){Ch=n}function HC(n){return`${Math.round(n).toLocaleString("en-US")} km`}function kC(){const n=Ch?Ch():null;return n?[`${n.name} — ${n.class}`,"",`Composition: ${n.composition}`,`Range:       ${HC(n.distanceKm)}`,"","Storm bands / surface visible from canopy.","No landing capability. Maintain safe orbit.","","Press [E] or [ESC] to close."]:["PLANETARY SCAN","","NO CONTACT — DEEP FIELD","","No bodies within scan range. Maintain heading.","","Press [E] or [ESC] to close."]}const WC={0:"none",1:"investigate reactor breaker",2:"file report at crew log terminal",3:"complete"};function GC(){const n=Xe(),t=No(),e=`MISSION: ${WC[t]}`,i=t===3?"ANOMALY CLOSED — STREL-7 incident resolved.":"";return[`ENERGY:  ${Math.round(n.energy)}%`,`HUNGER:  ${Math.round(n.hunger)}%`,"","DOOR STATUS:",...Wo.map(o=>`  ${o.id}: ${kl(o.id)?"OPEN":"CLOSED"}`),"",e,...i?[i]:[],"","Press [E] or [ESC] to close."]}function VC(){const n=Xe();return[`HEADING:  ${`${Math.round(n.heading).toString().padStart(3,"0")}°`}`,`SHIP TIME: ${Rr(n.shipMinutes)}`,"","Press [E] or [ESC] to close."]}function XC(){return{id:"save-terminal-shell",prompt:"Save Log",radius:2,position:zC(-1.44,1.55,-16),onInteract(n){No()===2?(fd("logged"),_s(100),ud(100),Br(5),hd(),Dl(),a0("-- ANOMALY RESOLVED --"),Ee("quest-complete"),Qn("FIELD REPORT FILED — STREL-7 ANOMALY",["STREL-7 ANOMALY — INCIDENT CLOSED","","Investigator: crew (you)","Action taken: reactor signature stabilized via breaker boost.","Deck plate 7-C status: monitored, no further movement.","","Outstanding recommendation: do not move the crate.","",">> Systems nominal. Energy and hunger restored.",">> Log archived at ship time "+Rr(Xe().shipMinutes)+"."])):(Dl(),a0(),Ee("save"))}}}function Mr(n,t,e){return new M(n,t,e)}function YC(){const n=[];return n.push({id:"datapad-a",prompt:"Read",radius:1.8,position:Mr(-6.485,1.4,-16.8),onInteract(t){Ee("ui"),Qn("CREW LOG — ENGINEER VASQUEZ",["Day 214. Starboard thruster seal replaced again.","Third time this cycle. Parts are holding but","I am not confident about the gasket tolerances.","","Filed requisition for spares at last port. Nothing.","We keep flying on wire and hope, same as always.","","— V"])}}),n.push({id:"datapad-b",prompt:"Read",radius:1.8,position:Mr(6.485,1.4,-16.8),onInteract(t){Ee("ui"),Qn("CREW LOG — NAVIGATOR CHEN",["Day 211. Plotted deviation around the debris field","at marker 7-Foxtrot. Added 3.2 ship-days.","Captain was not pleased. Neither was I.","","The gas giant is closer than the charts show.","Storm season peaking. Keep the canopy shutters","ready — just in case.","","— C"])}}),n.push({id:"crate-a",prompt:"Inspect Cargo",radius:2,position:Mr(-2.35,.55,5),onInteract(t){Ee("ui"),Qn("CARGO MANIFEST — CRATE A",["ITEM: Reactor coolant compound (type-4)","QTY:  12 units","DEST: Waystation Kira-9","","ITEM: Replacement gasket set (thruster)","QTY:  4 sets","DEST: Internal use","","ITEM: Medical supplies (sealed)","QTY:  1 case","DEST: Colony Outrider-B"])}}),n}let es=null;function qC(){const n=Xe();return _s(n.energy+30),Br(15),No()===1&&(fd("breakerSet"),hd(),Ee("quest-step")),No()}function ZC(){return{id:"breaker-cabinet",prompt:"Access Panel",radius:2,position:Mr(-2.89,1.35,3.8),onInteract(n){Ee("ui"),Qn("BREAKER PANEL",["System status: NOMINAL","","[1]  Vent Coolant   — energy -20","[2]  Boost Reactor  — energy +30, clock +15 min","","Press [ESC] to close."]),es&&window.removeEventListener("keydown",es),es=t=>{if(t.code==="Digit1"){const e=Xe();_s(e.energy-20),Ee("vent"),Qn("BREAKER PANEL",["COOLANT VENT — EXECUTED","",`Energy now: ${Math.round(Xe().energy)}%`,"","[1]  Vent Coolant   — energy -20","[2]  Boost Reactor  — energy +30, clock +15 min","","Press [ESC] to close."])}else if(t.code==="Digit2"){const e=Xe();_s(e.energy+30),Br(15),No()===1?(fd("breakerSet"),hd(),Ee("quest-step"),Qn("BREAKER PANEL",["REACTOR BOOST — EXECUTED","",`Energy now: ${Math.round(Xe().energy)}%`,`Ship time:  ${Rr(Xe().shipMinutes)}`,"","[ANOMALY] Reactor signature stabilized.","Record findings at the crew log terminal.","","[1]  Vent Coolant   — energy -20","[2]  Boost Reactor  — energy +30, clock +15 min","","Press [ESC] to close."])):(Ee("ui"),Qn("BREAKER PANEL",["REACTOR BOOST — EXECUTED","",`Energy now: ${Math.round(Xe().energy)}%`,`Ship time:  ${Rr(Xe().shipMinutes)}`,"","[1]  Vent Coolant   — energy -20","[2]  Boost Reactor  — energy +30, clock +15 min","","Press [ESC] to close."]))}else t.code==="Escape"&&(Nl(),es&&(window.removeEventListener("keydown",es),es=null))},window.addEventListener("keydown",es)}}}let ps="closed",Mi=3;function KC(){return{state:ps,stock:Mi}}function jC(){ps="closed",Mi=3;const n=u1();n&&(n.rotation.y=0),Pa().forEach(t=>{t.visible=!1})}function p1(){Mi=3,Pa().forEach((n,t)=>{n.visible=ps==="open"&&t<3})}function JC(){return{id:"fridge",prompt:"Open Fridge",radius:2,position:Mr(2.45,1.05,.05),getPrompt(){return ps==="closed"?"Open Fridge":Mi>0?`Take Ration (${Mi})`:"Close Fridge"},onInteract(t){const e=MC(),i=u1();if(ps==="closed"){ps="open",Ee("door"),e?.start(0,1),i&&(i.rotation.y=0);const o=Pa();for(let s=0;s<o.length;s++)o[s].visible=s<Mi}else if(Mi>0){const o=Xe();ud(Math.min(100,o.hunger+30)),Ee("eat"),Mi--;const s=Pa();s[Mi]&&(s[Mi].visible=!1)}else{ps="closed",Ee("door"),e?.start(1,0);const o=Pa();for(const s of o)s.visible=!1}}}}function QC(){return{id:"coffee-cup",prompt:"Drink Coffee",radius:1.5,position:Mr(2.675,.945,-2.9),onInteract(n){const t=Xe();_s(Math.min(100,t.energy+15)),Br(5),Ee("sip")}}}const m1=5,g1=3,v1=5;function Lo(n,t,e,i){return{minX:n.minX+t,maxX:n.maxX+t,minY:n.minY+e,maxY:n.maxY+e,minZ:n.minZ+i,maxZ:n.maxZ+i}}function $C(){const{group:n,colliders:t}=Ho({width:m1,height:g1,depth:v1,doors:[{wall:"starboard",gapW:1.4,gapH:2.2,offset:0}],windows:[{wall:"port",w:1,h:.8,yBot:1.2,offset:0}]});n.name="quarters-a";const e=[],i=jv(zE);i.group.position.set(0,0,-1.98),n.add(i.group),e.push(Lo(i.collider,0,0,-1.98)),e1(n,0),n1(n,-2.5),i1(n,-2.5,-1.98),o1(n,-2.5,-.8,"datapad-a");const o=Jv(2,.27,"lockers-a-deco");o.group.position.set(0,0,2.5),n.add(o.group);for(const f of o.colliders)e.push(Lo(f,0,0,2.5));const s=Qv(-.27,"locker-a","A");s.group.position.set(0,0,2.5),n.add(s.group),e.push(Lo(s.collider,0,0,2.5));const r=$v();r.group.position.set(1.3,0,-2),n.add(r.group),e.push(Lo(r.collider,1.3,0,-2)),s1(n,2.5,1.5),iA(n,2.5,-.8),t1(n,2.5,.9);const a={id:"bunk-a",prompt:"Sleep",radius:2.5,position:new M(0,.84,-1.98),onInteract:()=>{pd(()=>{Br(480),_s(100),p1()})}};let c=!1;const l=s.tween,d={id:"locker-a",prompt:"Open Locker",radius:1.8,position:new M(-.27,.93,2.5),getPrompt(){return c?"Close Locker":"Open Locker"},onInteract(f){c=!c,Ee("door"),l.start(c?0:1,c?1:0)}},u=new M(2.1,1.65,0),h=new M(-2.1,1.45,0);return so(n),{group:n,colliders:[...t,...e],interactables:[a,d],cameras:[{name:"quarters-a",position:u,lookAt:h}]}}function tR(){const{group:n,colliders:t}=Ho({width:m1,height:g1,depth:v1,doors:[{wall:"port",gapW:1.4,gapH:2.2,offset:0}],windows:[{wall:"starboard",w:1,h:.8,yBot:1.2,offset:0}]});n.name="quarters-b";const e=[],i=jv(BE);i.group.position.set(0,0,-1.98),n.add(i.group),e.push(Lo(i.collider,0,0,-1.98)),e1(n,0),n1(n,2.5),i1(n,2.5,-1.98),o1(n,2.5,-.8,"datapad-b");const o=Jv(2,.54,"lockers-b-deco");o.group.position.set(0,0,2.5),n.add(o.group);for(const p of o.colliders)e.push(Lo(p,0,0,2.5));const s=Qv(-.54,"locker-b","B");s.group.position.set(0,0,2.5),n.add(s.group),e.push(Lo(s.collider,0,0,2.5));const r=$v();r.group.position.set(-1.3,0,-2),n.add(r.group),e.push(Lo(r.collider,-1.3,0,-2));const a=new U(.44,.38,.38),c=new L(a,gd);c.position.set(1.3,.19,-2),n.add(c),e.push({minX:1.08,maxX:1.52,minY:0,maxY:.4,minZ:-2.19,maxZ:-1.81}),s1(n,-2.5,1.5),oA(n,-2.5,-.5),sA(n,-1.65,-1.5);const l=hA(n,2.5,1.5);e.push(l),fA(n,2.5,1.5),t1(n,-2.5,.9);const d={id:"bunk-b",prompt:"Sleep",radius:2.5,position:new M(0,.84,-1.98),onInteract:()=>{pd(()=>{Br(480),_s(100),p1()})}};let u=!1;const h=s.tween,f={id:"locker-b",prompt:"Open Locker",radius:1.8,position:new M(-.54,.93,2.5),getPrompt(){return u?"Close Locker":"Open Locker"},onInteract(p){u=!u,Ee("door"),h.start(u?0:1,u?1:0)}},m=new M(-2.1,1.65,0),v=new M(2.1,1.45,0);return so(n),{group:n,colliders:[...t,...e],interactables:[d,f],cameras:[{name:"quarters-b",position:m,lookAt:v}]}}function eR(){const{group:i,colliders:o}=Ho({width:6,height:3,depth:6,doors:[{wall:"fore",gapW:1.4,gapH:2.2,offset:0},{wall:"aft",gapW:1.4,gapH:2.2,offset:0,framed:!0}]});i.name="galley";const{colliders:s}=bC(i);o.push(...s),Fa(i,{x:2,z:-.4,topY:2.6,bottomY:.5,sourceAtTop:!0,radiusSource:.14,radiusFar:.42,color:16769728,peakOpacity:.028,moteCount:60,seed:13});const r={id:"stove",prompt:"Eat",radius:2.5,position:new M(2.725,.91,-.6),onInteract:()=>{pd(()=>{ud(100)},280,150)}};so(i);const a=new M(-1.8,1.55,-.4),c=new M(2.5,1.2,-.4);return{group:i,colliders:o,interactables:[r],cameras:[{name:"galley",position:a,lookAt:c}]}}function nR(){return $t("eng-conduit",()=>{const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d");e.fillStyle="#1F232A",e.fillRect(0,0,512,512);const o=(r=>{let a=r;return()=>(a=a*1664525+1013904223>>>0,a/4294967296)})(991);for(let r=40;r<512;r+=60+Math.floor(o()*20)){const a=12+Math.floor(o()*10);e.fillStyle=`rgba(10,10,14,${(.22+o()*.15).toFixed(2)})`,e.fillRect(0,r,512,a),e.fillStyle="rgba(80,90,100,0.08)",e.fillRect(0,r,512,2)}e.strokeStyle="rgba(0,0,0,0.6)",e.lineWidth=2;for(let r=128;r<512;r+=128)e.beginPath(),e.moveTo(r,0),e.lineTo(r,512),e.stroke();oo(e,512,512,443,.22);const s=new yt(t);return s.wrapS=s.wrapT=Dt,s})}function iR(){return $t("eng-hazard-stencil",()=>{const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d");e.fillStyle="#1C1E22",e.fillRect(0,0,512,512);const i=48;e.save(),e.rotate(Math.PI/4);for(let s=-512*2;s<512*3;s+=i*2)e.fillStyle="#C7641E",e.fillRect(s,-512*2,i,512*5);e.restore(),e.fillStyle="rgba(255,220,0,0.9)",e.font="bold 38px monospace",e.textAlign="center",e.fillText("REACTOR HAZARD",512/2,512*.55),e.font="22px monospace",e.fillStyle="rgba(255,255,255,0.8)",e.fillText("KEEP CLEAR 1.5M",512/2,512*.72);const o=new yt(t);return o.wrapS=o.wrapT=Dt,o})}let j0=null;function Wl(){return j0??(j0=new Gt({map:nR()}))}function Au(){return $n}function oR(n,t,e,i){const o=t/2,s=.06;for(let r=0;r<2;r++){const a=e*.38,c=i*.4,l=new L(new U(s,a,c),Wl());l.position.set(-o+s/2,a/2+r*(a+.14),-3.5*.1-r*.1),n.add(l)}for(let r=0;r<2;r++){const a=e*.36,c=i*.38,l=new L(new U(s,a,c),Wl());l.position.set(o-s/2,a/2+r*(a+.14),-3.5*.1-r*.1),n.add(l)}}function sR(n,t,e,i){const r=i/2-.06/2,a=[1,1.6,2.2];for(const u of a){const h=new L(new wt(.05,.05,t*.85,10),Au());h.rotation.z=Math.PI/2,h.position.set(0,u,r),n.add(h);for(const f of[-t*.42,t*.42]){const m=new L(new wt(.06,.06,.04,8),Au());m.rotation.z=Math.PI/2,m.position.set(f,u,r),n.add(m)}}const c=[-t*.35,-t*.12,t*.12,t*.35];for(const u of c){const h=new L(new wt(.035,.035,1.02,8),Au());h.position.set(u,.5,r),n.add(h)}const l=new lt({map:iR(),transparent:!0,opacity:.85}),d=new L(new Xn(1.1,1.55,32),l);d.rotation.x=-Math.PI/2,d.position.set(0,.003,1),n.add(d)}function rR(n,t,e,i){const o=t/2,s=i/2,r=.06;for(let f=0;f<2;f++){const m=e*.4,v=i*.55,p=new L(new U(r,m,v),Wl());p.position.set(-o+r/2,m/2+f*(m+.12),s*.1),n.add(p)}for(let f=0;f<2;f++){const m=e*.4,v=i*.45,p=new L(new U(r,m,v),Wl());p.position.set(o-r/2,m/2+f*(m+.12),s*.2),n.add(p)}const a=new L(new U(r,e*.55,i*.35),Wb);a.position.set(o-r/2,e*.72,-s*.5),n.add(a);const c=new L(new U(t*.55,.003,.22),ph);c.position.set(0,.002,-.25),n.add(c);const l=new L(new U(r*.5,.18,i*.3),ph);l.position.set(-o+.02,.09,0),n.add(l);const d=s-r/2+.005,u=new L(new U(1.2,e*.45,r),Fl);u.position.set(-1.6,e*.55,d),n.add(u);const h=new L(new U(1.2,e*.45,r),Fl);h.position.set(1.6,e*.55,d),n.add(h),Ci(n,[{pos:new M(-o+r+.005,e*.3,s*.1),color:xe.teal},{pos:new M(-o+r+.005,e*.68,s*.1),color:xe.orange},{pos:new M(o-r-.005,e*.3,s*.2),color:xe.teal},{pos:new M(o-r-.005,e*.68,s*.2),color:xe.warm,blink:!0,period:2.8,phase:.15}])}const x1=4645080,S1=13067294,J0=2284936,aR=14518306;function cR(){return $t("eng-gun",()=>{const t=document.createElement("canvas");t.width=t.height=256;const e=t.getContext("2d");e.fillStyle="#1C1E22",e.fillRect(0,0,256,256),e.strokeStyle="rgba(0,0,0,0.7)",e.lineWidth=2;for(let o=64;o<256;o+=64)e.beginPath(),e.moveTo(o,0),e.lineTo(o,256),e.stroke();for(let o=64;o<256;o+=64)e.beginPath(),e.moveTo(0,o),e.lineTo(256,o),e.stroke();oo(e,256,256,17,.18);const i=new yt(t);return i.wrapS=i.wrapT=Dt,i})}let Q0=null;const $0=()=>Q0??(Q0=new Gt({map:cR()}));let tm=null;const lR=()=>tm??(tm=new lt({color:S1}));let em=null;const dR=()=>em??(em=new Gt({color:658448,side:It}));let nm=null;const uR=()=>nm??(nm=new lt({color:4645080,side:It})),hR=()=>Bv,fR=()=>new lt({map:dT(),color:new St(x1),transparent:!0,opacity:1,toneMapped:!1}),pR=()=>new lt({color:new St(S1),transparent:!0,opacity:.85});function im(n,t,e,i,o){n.onBeforeRender=()=>{const s=.5+.5*Math.sin(Math.PI*performance.now()*.001+o);t.opacity=e+s*(i-e)}}function mR(n){const t=new Bt;t.name="reactor";const e=.45,i=0,o=1,s=n/2,r=new L(new wt(e,e,n,16),hR());r.position.set(i,s,o),t.add(r);const a=new Ln(e+.04,.04,6,20),c=new tn(a,Bv,7),l=new ye;for(let m=0;m<7;m++)l.position.set(i,(m+1)*n/8,o),l.rotation.set(Math.PI/2,0,0),l.updateMatrix(),c.setMatrixAt(m,l.matrix);c.instanceMatrix.needsUpdate=!0,t.add(c),[0,Math.PI/2,Math.PI,3*Math.PI/2].forEach((m,v)=>{const p=fR(),g=new L(new qt(.08,n*.7),p);g.position.set(i+Math.sin(m)*(e+.01),s,o+Math.cos(m)*(e+.01)),g.rotation.y=-m,im(g,p,.35,1,v*Math.PI/2),t.add(g)});const d=pR(),u=new L(new wt(e+.01,e+.01,.12,16),d);u.position.set(i,.3,o),im(u,d,.5,1,Math.PI),t.add(u),[0,Math.PI/2,Math.PI,3*Math.PI/2].forEach((m,v)=>{const p=new Gt({color:4645080,emissive:new St(4645080),emissiveIntensity:.65}),g=new L(new U(.04,n*.65,.02),p);g.position.set(i+Math.sin(m)*(e+.02),s,o+Math.cos(m)*(e+.02)),g.rotation.y=-m;const S=v;g.onBeforeRender=()=>{p.emissiveIntensity=.65+Math.sin(performance.now()*.0021+.3+S*.15)*.16},t.add(g)});const h=new L(new wt(.06,.06,.35,8),$0());h.position.set(i,n-.175,o),t.add(h);const f=new L(new wt(.11,.11,.08,8),$0());if(f.position.set(i,n-.04,o),t.add(f),Wa){const p=new De(4645080,1.8,4,2);p.position.set(i,s,o),t.add(p),Fa(t,{x:i,z:o,topY:n-.05,bottomY:Math.max(n-1.1,s-.3),sourceAtTop:!1,radiusSource:.12,radiusFar:.35,color:4645080,peakOpacity:.045,moteCount:55,seed:55,onTick:g=>{p.intensity=1.8+Math.sin(g*2.1)*.6}})}return{group:t,collider:{minX:i-e-.08,minY:0,minZ:o-e-.08,maxX:i+e+.08,maxY:n,maxZ:o+e+.08}}}function gR(n){const t=new Bt;t.name="reactor-rail";const e=.85,i=.9,o=0,s=1,r=[-130,-90,-45,0,45,90,130].map(u=>u*Math.PI/180),a=$n,c=new tn(new wt(.035,.035,i,6),a,r.length),l=new ye;r.forEach((u,h)=>{l.position.set(o+Math.sin(u)*e,i/2,s+Math.cos(u)*e),l.rotation.set(0,0,0),l.updateMatrix(),c.setMatrixAt(h,l.matrix)}),c.instanceMatrix.needsUpdate=!0,t.add(c),[.85,.5].forEach(u=>{const h=r[0],f=r[r.length-1]-h;for(let m=0;m<14;m++){const v=h+m/14*f,p=h+(m+1)/14*f,g=o+Math.sin(v)*e,S=s+Math.cos(v)*e,x=o+Math.sin(p)*e,w=s+Math.cos(p)*e,E=x-g,b=w-S,T=Math.sqrt(E*E+b*b),C=new L(new wt(.02,.02,T,5),a);C.position.set((g+x)/2,u,(S+w)/2),C.rotation.y=-Math.atan2(b,E)+Math.PI/2,t.add(C)}});const d=new L(new Xn(.8,1.05,32),ph);return d.rotation.x=-Math.PI/2,d.position.set(o,.002,s),t.add(d),{group:t,collider:{minX:o-e-.1,minY:0,minZ:s-e-.1,maxX:o+e+.1,maxY:i+.05,maxZ:s+e+.1}}}function vR(n,t,e,i){rR(n,t,e,i),oR(n,t,e,i),sR(n,t,e,i)}function xR(n,t,e){const i=new Bt;i.name="breaker-cabinet";const o=1.2,s=.8,r=.22,a=-3+r/2,c=n*.3+s/2,l=-7/2+1.8,d=new L(new U(r,s,o),Dn);d.position.set(a,c,l),i.add(d);const u=new L(new qt(o*.7,s*.55),Iv);u.position.set(a-r/2-.001,c+s*.05,l),u.rotation.y=Math.PI/2,i.add(u);const h=new U(.03,.03,.01),f=new ye,m=[J0,J0,aR,x1];for(let v=0;v<4;v++){const p=new tn(h,new lt({color:m[v]}),3);for(let g=0;g<3;g++)f.position.set(a-r/2-.003,c-s*.28+g*.08,l-o*.35+v*.1),f.rotation.set(0,Math.PI/2,0),f.updateMatrix(),p.setMatrixAt(g,f.matrix);p.instanceMatrix.needsUpdate=!0,i.add(p)}return Ci(i,[{pos:new M(a-r/2-.01,c+s/2-.03,l-o*.25),color:xe.teal},{pos:new M(a-r/2-.01,c+s/2-.03,l+o*.25),color:xe.red,blink:!0,period:2,phase:.6}]),{group:i,collider:{minX:a-r/2,minY:c-s/2,minZ:l-o/2,maxX:a+r/2,maxY:c+s/2,maxZ:l+o/2}}}let _1=null;function M1(){return _1}function om(n,t,e,i,o,s){const r=new Bt;r.name=s;const a=.04,c=lR(),l=new L(new U(e,i,o),gd);return l.position.set(n,i/2,t),r.add(l),[[n,i-a/2,t-o/2+a/2,e,a,a],[n,i-a/2,t+o/2-a/2,e,a,a],[n-e/2+a/2,i-a/2,t,a,a,o],[n+e/2-a/2,i-a/2,t,a,a,o]].forEach(([d,u,h,f,m,v])=>{const p=new L(new U(f,m,v),c);p.position.set(d,u,h),r.add(p)}),{group:r,collider:{minX:n-e/2,minY:0,minZ:t-o/2,maxX:n+e/2,maxY:i,maxZ:t+o/2}}}function SR(n,t,e,i,o){const s=new L(new qt(i-.04,o-.04),dR());s.name="hidden-floor-panel",s.rotation.x=-Math.PI/2,s.position.set(t,.001,e),n.add(s);const r=uR(),a=.012;[[t,e-o/2+a/2,i-.04,a],[t,e+o/2-a/2,i-.04,a],[t-i/2+a/2,e,a,o-.04],[t+i/2-a/2,e,a,o-.04]].forEach(([c,l,d,u])=>{const h=new L(new qt(d,u),r);h.rotation.x=-Math.PI/2,h.position.set(c,.002,l),n.add(h)})}function _R(n,t){const o=om(-2.35,-.5,.7,.55,.55,"crate-a"),s=om(-1.45,-.3,.55,.42,.55,"crate-b");return SR(s.group,-1.45,-.3,.55,.55),_1=s.group,[o,s]}function MR(){const{group:s,colliders:r}=Ho({width:6,height:3,depth:7,doors:[{wall:"fore",gapW:1.4,gapH:2.2,offset:0},{wall:"aft",gapW:1.34,gapH:2.08,offset:0}]});s.name="engineering";const{group:a,collider:c}=mR(3);s.add(a),r.push(c);const{group:l,collider:d}=gR();s.add(l),r.push(d),vR(s,6,3,7);const{group:u,collider:h}=xR(3);s.add(u),r.push(h);const f=_R();for(const{group:g,collider:S}of f)s.add(g),r.push(S);const m=new De(16733465,3,5.5,2);m.position.set(0,1.2,1),s.add(m),so(s);const v=new M(.4,1.55,-2.2),p=new M(0,1.4,1);return{group:s,colliders:r,interactables:[],cameras:[{name:"engineering",position:v,lookAt:p}]}}const wR=13067294,yR=4645080,bR="#E8E2D4",Gl=()=>Hv;let sm=null;const w1=()=>sm??(sm=new Gt({color:wR}));function TR(n){const o=new Gt({color:8006687}),s=new L(new U(.82,.82,.82),o);s.position.set(-1.8,.82/2,-1.2),n.add(s);const r=new L(new U(.82,.82*.88,.82),gd);r.rotation.y=Math.PI/6,r.position.set(-1.8+.85,.82*.44,-1.2+.1),n.add(r);const a=new L(new U(.82,.82*1.1,.82*.9),o);a.position.set(-1.8-.05,.82*.55,-1.2+.86),n.add(a);const c=new L(new U(.82+.01,.04,.82*.9+.01),w1());return c.position.set(-1.8-.05,.82*.55+.18,-1.2+.86),n.add(c),[{minX:-1.8-.5,maxX:-1.8+.5,minY:0,maxY:.82+.05,minZ:-1.2-.5,maxZ:-1.2+.5},{minX:-1.8+.38,maxX:-1.8+1.32,minY:0,maxY:.82*.88,minZ:-1.2-.38,maxZ:-1.2+.55},{minX:-1.8-.52,maxX:-1.8+.42,minY:0,maxY:.82*1.1,minZ:-1.2+.42,maxZ:-1.2+1.32}]}function ER(){const n=document.createElement("canvas");n.width=128,n.height=64;const t=n.getContext("2d");for(let e=0;e<9;e++)t.fillStyle=e%2===0?"#C7641E":"#1C1E22",t.fillRect(e*16,0,16,64);return new yt(n)}function AR(n,t,e){const i=t/2,o=.025,s=1.6,r=.28,a=.22,c=.08,l=[],d=-i+.04;for(const E of[-1.8,.8]){const b=new U(.08,.12,.12);b.translate(d,1.7,E);const T=new wt(o,o,s,6);T.translate(d,1.7-s/2,E),l.push(b,T)}const u=i-.04;for(const E of[-1.2,1.2]){const b=new U(.08,.12,.12);b.translate(u,1.7,E);const T=new wt(o,o,s,6);T.translate(u,1.7-s/2,E),l.push(b,T)}const h=Qt(l);for(const E of l)E.dispose();n.add(new L(h,Gl()));const f=new lt({map:ER(),side:It}),m=new L(new qt(.6,.4),f);m.position.set(-1.2,.2,-4.5+.01),n.add(m);const v=[],p=new U(c,a,r);p.translate(u,1.55,1.8),v.push(p);const g=Qt(v);for(const E of v)E.dispose();n.add(new L(g,Gl()));const S=new L(new U(c+.002,.025,r+.002),w1());S.position.set(u,1.55+a/2-.0125,1.8),n.add(S);const x=new L(new Se(.018,5,4),new lt({color:yR}));x.position.set(u+.042,1.6,1.72),n.add(x);const w=new L(new Se(.018,5,4),new lt({color:14714912}));return w.position.set(u+.042,1.52,1.88),n.add(w),[{minX:u-.01,maxX:u+c+.01,minY:1.55-a/2,maxY:1.55+a/2,minZ:1.8-r/2,maxZ:1.8+r/2}]}function CR(n){const i=[];for(let a=0;a<4;a++){const c=new wt(.018,.018,.1,6);c.translate(.5,2.5-.06-a*(.1+.01),-.8),i.push(c)}const o=Qt(i);for(const a of i)a.dispose();n.add(new L(o,Gl()));const s=2.5-.06-4*(.1+.01)-.06,r=new L(new Ln(.06,.018,6,12),Gl());r.rotation.x=Math.PI/2,r.position.set(.5,s,-.8),n.add(r)}function RR(n){const o=document.createElement("canvas");o.width=256,o.height=128;const s=o.getContext("2d");for(let r=0;r<256/18+1;r++)s.fillStyle=r%2===0?"#C7641E":"#1C1E22",s.fillRect(r*18,0,18,18),s.fillRect(r*18,110,18,18);for(let r=0;r<128/18+1;r++)s.fillStyle=r%2===0?"#C7641E":"#1C1E22",s.fillRect(0,r*18,18,18),s.fillRect(238,r*18,18,18);return s.fillStyle="#1A1C20",s.fillRect(18,18,256-18*2,128-18*2),s.fillStyle=bR,s.font="bold 22px monospace",s.textAlign="center",s.fillText(n,256/2,128/2-4),s.fillStyle="#C7641E",s.beginPath(),s.moveTo(256/2-20,128/2+12),s.lineTo(256/2,128/2+28),s.lineTo(256/2+20,128/2+12),s.closePath(),s.fill(),new yt(o)}function PR(n){const t=[{label:"BAY 01",x:0,z:.5,ry:0,pw:1.6,pd:.8},{label:"LOAD ZONE",x:-1.8,z:1.8,ry:Math.PI/4,pw:1.2,pd:.6},{label:"CAUTION",x:1.5,z:-2.2,ry:0,pw:1,pd:.5}];for(const e of t){const i=new lt({map:RR(e.label),transparent:!0,opacity:.82,depthWrite:!1}),o=new L(new qt(e.pw,e.pd),i);o.rotation.x=-Math.PI/2,o.rotation.z=e.ry,o.position.set(e.x,.003,e.z),n.add(o)}}function LR(n,t,e){const i=[];return i.push(...TR(n)),i.push(...AR(n,t)),CR(n),PR(n),{colliders:i}}const DR=1842722,IR=13067294,NR=4645080,ml=8006687,gl=()=>Hv;let rm=null;const vl=()=>rm??(rm=new Gt({color:IR}));let am=null;const OR=()=>am??(am=new Gt({color:ml}));let cm=null;const UR=()=>cm??(cm=new lt({color:NR}));function FR(n,t){const s=t-.4,r=.5,a=.02,c=.025,l=new U(s,.08,1.2);l.translate(0,2.5+.08/2,0);const d=[l],u=6;for(let T=0;T<u;T++){const C=T/(u-1)-.5,y=new U(s,.08+.005,.04);y.translate(0,2.5+.08/2,C*(1.2-.04)),d.push(y)}const h=Qt(d);for(const T of d)T.dispose();const f=new L(h,gl());n.add(f);for(const T of[-1,1]){const C=T*(.6+a),y=new U(s,a*2,a*2);y.translate(0,2.5+.08+r,C);const _=new wt(c,c,r,6);_.translate(-s/2+.04,2.5+.08+r/2,C);const R=new wt(c,c,r,6);R.translate(s/2-.04,2.5+.08+r/2,C);const D=[y,_,R],N=Qt(D);for(const B of D)B.dispose();const z=new L(N,gl());n.add(z)}const m=s/2+.06,v=.32,p=.06,g=.04,S=[];for(let T=0;T<5;T++){const C=new U(v,g,p);C.translate(m,.45+T*(2.5/5),0),S.push(C)}const x=new U(.03,2.5+.08,.03);x.translate(m,(2.5+.08)/2,-v/2+.02);const w=new U(.03,2.5+.08,.03);w.translate(m,(2.5+.08)/2,v/2-.02),S.push(x,w);const E=Qt(S);for(const T of S)T.dispose();const b=new L(E,gl());n.add(b)}function zR(n){const o=[-1.8,1.8],s=[-2.5,0,2.5],r=[];for(const d of o)for(const u of s){const h=new U(.5,.06,.5);h.translate(d,.06/2,u),r.push(h)}const a=Qt(r);for(const d of r)d.dispose();const c=new L(a,vl());n.add(c);const l=new Se(.04,6,4);for(const d of o)for(const u of s){const h=new L(l,UR());h.position.set(d,.06+.04,u),n.add(h)}}function BR(n,t){const e=t/2,i=[[-2.8,e-.5],[2.8,e-.5]],o=[{h:0,color:ml},{h:.9,color:DR},{h:1.8,color:ml}];for(const[s,r]of i){const a=[],c=[];for(const{h:S,color:x}of o){const w=new U(.9,.9,.9);w.translate(s,S+.9/2,r),x===ml?a.push(w):c.push(w)}if(a.length>0){const S=new L(Qt(a),OR());for(const x of a)x.dispose();n.add(S)}if(c.length>0){const S=new L(Qt(c),gd);for(const x of c)x.dispose();n.add(S)}const d=[];for(const{h:S}of o)for(const[E,b,T,C,y,_]of[[s,S+.9-.04/2,r-.9/2+.04/2,.9,.04,.04],[s,S+.9-.04/2,r+.9/2-.04/2,.9,.04,.04],[s-.9/2+.04/2,S+.9-.04/2,r,.04,.04,.9],[s+.9/2-.04/2,S+.9-.04/2,r,.04,.04,.9]]){const R=new U(C,y,_);R.translate(E,b,T),d.push(R)}if(d.length>0){const S=new L(Qt(d),vl());for(const x of d)x.dispose();n.add(S)}const u=o[1].h,h=r-.9/2,f=[];for(const S of[s-.9*.22,s+.9*.22]){const x=new U(.16,.04,.02);x.translate(S,u+.9*.55,h-.005),f.push(x)}const m=new L(Qt(f),vl());for(const S of f)S.dispose();n.add(m);const v=new U(.26,.16,.012);v.translate(s,u+.9*.28,h-.006),n.add(new L(v,gl()));const p=new U(.28,.02,.014);p.translate(s,u+.9*.28-.09,h-.007),n.add(new L(p,vl()));const g=o[2].h+.9;Ci(n,[{pos:new M(s-.9*.2,g-.1,r-.9/2-.005),color:xe.teal},{pos:new M(s+.9*.2,g-.1,r-.9/2-.005),color:xe.orange,blink:s<0,period:2.4,phase:.4}])}}function HR(n,t){const o=document.createElement("canvas");o.width=256,o.height=64;const s=o.getContext("2d");return s.fillStyle="#E8E2D4",s.fillRect(0,0,256,64),s.strokeStyle="#C7641E",s.lineWidth=3,s.strokeRect(2,2,252,60),s.fillStyle="#C7641E",s.font="bold 18px monospace",s.textAlign="center",s.fillText(n,256/2,24),s.font="13px monospace",s.fillText(t,256/2,48),new yt(o)}function kR(n,t){const e=t/2,i=.9,o=.22,s=e-.01,r=[{x:-2,line1:"CARGO BAY 01",line2:"CAPACITY: 4200 kg"},{x:2,line1:"MAG-LOCK ACTIVE",line2:"SECURE ZONE"}];for(const a of r){const c=HR(a.line1,a.line2),l=new lt({map:c,side:It}),d=new L(new qt(i,o),l);d.position.set(a.x,1.8,s),d.rotation.y=Math.PI,n.add(d)}}function WR(n,t,e,i){FR(n,t),zR(n),BR(n,i),kR(n,i);const{colliders:o}=LR(n,t);return o}const kc=.5,na=.2,Cu=.14,xl=1.34,cs=2.08;function GR(n,t,e){const o=[],s=new U(na,cs,kc);s.translate(-xl/2-na/2,cs/2,-4.5),o.push(s);const r=new U(na,cs,kc);r.translate(xl/2+na/2,cs/2,-4.5),o.push(r);const a=new U(xl+na*2,Cu,kc);a.translate(0,cs+Cu/2,-4.5),o.push(a);const c=Qt(o);for(const h of o)h.dispose();n.add(new L(c,Co));const l=new L(new U(1.7,.05,.5),new Gt({color:13067294}));l.position.set(0,.025,-4.5),n.add(l);const d=cs+Cu/2,u=-4.5+kc/2+.01;Ci(n,[{pos:new M(-.4,d,u),color:xe.teal},{pos:new M(0,d,u),color:xe.red,blink:!0,period:1.6,phase:.1},{pos:new M(.4,d,u),color:xe.teal}])}function VR(){const{group:i,colliders:o}=Ho({width:8,height:5,depth:9,wallMaterial:fn,doors:[{wall:"fore",gapW:xl,gapH:cs,offset:0,framed:!1},{wall:"aft",gapW:1.4,gapH:2.2,offset:0,framed:!1}]});i.name="cargo-bay",GR(i);const s=WR(i,8,5,9);for(const c of s)o.push(c);Fa(i,{x:0,z:0,topY:4.2,bottomY:.4,sourceAtTop:!0,radiusSource:.15,radiusFar:.45,color:15265522,peakOpacity:.03,moteCount:50,seed:14}),so(i);const r=new M(.5,1.7,-3.5),a=new M(0,2.5,0);return{group:i,colliders:o,interactables:[],cameras:[{name:"cargo-bay",position:r,lookAt:a}]}}const XR=`
uniform mat4 uCapturedVP;
uniform mat4 uPortalXform;
varying vec2 vUv;
varying vec4 vClipCap;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vClipCap = uCapturedVP * (uPortalXform * wp); // divide in the fragment (perspective-correct)
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,YR=`
precision highp float;
uniform float uTime;
uniform vec3  uTint;
uniform vec3  uTint2;
uniform float uBurst;
uniform float uState;
uniform sampler2D uLive;
uniform float uUseLive;
uniform float uSeed;
varying vec2 vUv;
varying vec4 vClipCap;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 43758.5453);
}

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv) * 1.42;              // 0 center .. ~1 corner
  float ang = atan(uv.y, uv.x);

  // T1 — propagating waves (spiral phase + radial inflow both travel in uTime)
  float waveA = 0.5 + 0.5 * sin(uTime * 2.6 - (ang * 3.0 + r * 9.0));
  float waveR = 0.5 + 0.5 * sin(uTime * 1.7 - r * 12.0);
  float band  = mix(waveA, waveR, 0.5);
  float sw    = 0.5 + 0.5 * sin(ang * 5.0 + uTime * 0.8 + sin(r * 8.0 - uTime));
  band = mix(band, sw, 0.25);

  float edge = max(abs(uv.x), abs(uv.y)) * 2.0; // 0 center .. 1 edge
  // F3 (Stage E): thinner + cooler rim — was reading as a solid glow slab
  // instead of a swirl with a frame around it.
  float rim  = smoothstep(0.86, 0.99, edge);

  float state = 0.35 + 0.65 * uState;           // T2 ramp
  vec3 col = uTint * (0.22 + 0.9 * band) * state;
  col += uTint * rim * 0.9 * state;

  // live preview — captured-VP projected UVs (research §2)
  if (uUseLive > 0.001) {
    vec2 puv = (vClipCap.xy / vClipCap.w) * 0.5 + 0.5;
    vec3 live = texture2D(uLive, puv).rgb;      // RAW linear HalfFloat sample
    float interior = 1.0 - rim;
    col = mix(col, live, clamp(uUseLive, 0.0, 1.0) * interior);
    col += uTint * rim * 0.45;
  }

  // T3 — discharge burst
  if (uBurst > 0.001) {
    float b = clamp(uBurst, 0.0, 1.0);
    vec3 hot = mix(uTint, uTint2, 0.5 + 0.5 * sin(uTime * 38.0));
    float arcs = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float bucket = floor(uTime * 26.0) + fi * 19.0;
      float a0 = hash(vec2(uSeed + fi * 3.7, bucket)) * 6.2831853;
      float dA = abs(mod(ang - a0 + 3.14159265, 6.2831853) - 3.14159265);
      arcs += smoothstep(0.16, 0.0, dA) * (0.6 + 0.4 * sin(r * 46.0 - uTime * 34.0));
    }
    col = mix(col, hot * 2.6, b * 0.85);
    col += vec3(1.0, 0.95, 0.82) * arcs * b;
  }

  float mask = smoothstep(1.02, 0.86, edge); // soft rectangular edge
  gl_FragColor = vec4(col, mask);
}`;function qR(n){const t={uTime:{value:0},uTint:{value:new St(n)},uTint2:{value:new St("#FFF2D8")},uBurst:{value:0},uState:{value:0},uLive:{value:null},uUseLive:{value:0},uSeed:{value:0},uCapturedVP:{value:new Lt},uPortalXform:{value:new Lt}};return{material:new de({uniforms:t,vertexShader:XR,fragmentShader:YR,transparent:!0,depthWrite:!1,side:me,toneMapped:!1}),uniforms:t}}let Ji=null;function ZR(n){Ji=n}const Ru=typeof window>"u"||new URLSearchParams(window.location.search).get("portals")!=="0";let Rh=!1;function y1(){Rh=!1}const lm=600,b1=8,KR=2,wr=[];let Po=null,Sn=null,dm=0;const Ph=new M,Pu=new M,um=new M,hm=new He,fm=new od,pm=new Lt,mm=new bs,Lu=new rt,jR=new Lt().makeRotationY(Math.PI),gm=new Lt,Wc=new Lt,vm=new Lt,xm=new bo,Sm=new M,_m=new M,JR=[];function QR(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function Mm(n){let t=n;for(;t;){if(t.isScene)return t;t=t.parent}return null}class T1{mesh;interactable;uniforms;w;h;lastSign=0;burstRemain=0;targetId;boundingRadius;constructor(t,e,i,o,s,r){this.targetId=t,this.w=i,this.h=o,this.boundingRadius=Math.hypot(i,o)*.5;const{material:a,uniforms:c}=qR(e);this.uniforms=c,c.uSeed.value=QR(s),this.mesh=new L(new qt(i,o),a),this.mesh.name=s,this.interactable={id:s,prompt:r,radius:2.6,position:new M,onInteract:()=>this.trigger()},wr.push(this)}discharge(){this.burstRemain=lm,this.uniforms.uBurst.value=1}trigger(){Rh||!Ji||(Rh=!0,this.discharge(),Ji.requestSwitch(this.targetId))}update(t,e,i){this.uniforms.uTime.value+=t,this.mesh.getWorldPosition(this.interactable.position),this.burstRemain>0&&(this.burstRemain-=t*1e3,this.uniforms.uBurst.value=Math.max(0,this.burstRemain/lm));const o=e.distanceTo(this.interactable.position),s=Math.max(0,Math.min(1,1-(o-1)/b1)),r=this.uniforms.uState;r.value+=(s-r.value)*Math.min(1,t*4),this.mesh.getWorldQuaternion(hm),um.set(0,0,1).applyQuaternion(hm).normalize(),Ph.copy(e).sub(this.interactable.position);const c=Ph.dot(um)>=0?1:-1;this.lastSign!==0&&c!==this.lastSign&&o<KR&&this.withinRect(e)&&this.trigger(),this.lastSign=c}withinRect(t){return this.mesh.worldToLocal(Pu.copy(t)),Math.abs(Pu.x)<this.w*.5&&Math.abs(Pu.y)<this.h*.5}setLive(t){this.uniforms.uUseLive.value=t,t<=0&&(this.uniforms.uLive.value=null)}rampLive(t){const e=this.uniforms.uUseLive;e.value+=(1-e.value)*Math.min(1,t*6)}setCaptured(t,e,i){this.uniforms.uCapturedVP.value.copy(t),this.uniforms.uPortalXform.value.copy(e),this.uniforms.uLive.value=i}dispose(){const t=wr.indexOf(this);t>=0&&wr.splice(t,1),this.mesh.geometry.dispose(),this.mesh.material.dispose()}}function $R(n,t,e,i){return new T1(n,t,e,i,`portal-${n}`,`Enter ${n.toUpperCase()}`)}function Sd(n=2,t=2.6){return new T1("ship","#46E0D8",n,t,"portal-ship","Return to Ship")}function t3(n,t,e,i){if(wr.length===0)return;Ru&&(pm.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),fm.setFromProjectionMatrix(pm));let o=null,s=1/0;for(const r of wr){if(Mm(r.mesh)!==i){r.setLive(0);continue}if(r.update(n,t,e),!Ru){r.setLive(0);continue}const a=r.mesh.getWorldPosition(Ph),c=t.distanceTo(a);mm.set(a,r.boundingRadius),c<=b1&&fm.intersectsSphere(mm)&&c<s&&(o=r,s=c)}if(Ru){for(const r of wr)r!==o&&Mm(r.mesh)===i&&r.setLive(0);if(o&&Ji){const r=Ji.getScene(o.targetId);r?(n3(o,e,r),o.rampLive(n)):o.setLive(0)}}}function e3(n){n.getDrawingBufferSize(Lu);const t=Math.max(1,Math.floor(Lu.x/2)),e=Math.max(1,Math.floor(Lu.y/2));Po?(Po.width!==t||Po.height!==e)&&Po.setSize(t,e):Po=new wn(t,e,{type:Gn,samples:4,minFilter:On,magFilter:On,generateMipmaps:!1,depthBuffer:!0}),Sn||(Sn=new Cn,Sn.matrixAutoUpdate=!1,Sn.matrixWorldAutoUpdate=!1)}function n3(n,t,e){if(!Ji||(e3(Ji.renderer),!Po||!Sn))return;const i=performance.now();if(i-dm<33)return;dm=i;const o=Ji.getDestination(n.targetId);gm.copy(n.mesh.matrixWorld).invert(),o?Wc.copy(o).multiply(jR).multiply(gm):Wc.identity(),Sn.matrixWorld.multiplyMatrices(Wc,t.matrixWorld),Sn.matrixWorld.decompose(Sn.position,Sn.quaternion,Sn.scale),Sn.matrixWorldInverse.copy(Sn.matrixWorld).invert(),Sn.projectionMatrix.copy(t.projectionMatrix),vm.multiplyMatrices(Sn.projectionMatrix,Sn.matrixWorldInverse);const s=Ji.renderer;o&&(Sm.setFromMatrixPosition(o),_m.set(0,0,1).transformDirection(o).normalize(),xm.setFromNormalAndCoplanarPoint(_m,Sm),s.clippingPlanes=[xm]);const r=s.getRenderTarget();s.setRenderTarget(Po),s.render(e,Sn),s.setRenderTarget(r),o&&(s.clippingPlanes=JR),n.setCaptured(vm,Wc,Po.texture)}const Ui=128;function i3(n){return $t(`portal-relic-socket-lit-${n}`,()=>{const t=document.createElement("canvas");t.width=Ui,t.height=Ui;const e=t.getContext("2d"),i=Ui/2;e.clearRect(0,0,Ui,Ui);const o=e.createRadialGradient(i,i,2,i,i,Ui*.46);o.addColorStop(0,"rgba(255,255,255,0.95)"),o.addColorStop(.35,`${n}E6`),o.addColorStop(.8,`${n}66`),o.addColorStop(1,`${n}00`),e.fillStyle=o,e.fillRect(0,0,Ui,Ui),e.strokeStyle="#FFFFFF",e.globalAlpha=.9,e.lineWidth=4,e.beginPath(),e.arc(i,i,Ui*.4,0,Math.PI*2),e.stroke(),e.globalAlpha=1;const s=new yt(t);return s.wrapS=ue,s.wrapT=ue,s},!0)}function o3(n,t,e,i,o){const s=t.map,r=i3(i),a=new St(o).multiplyScalar(3.3);let c=!1;n.onBeforeRender=()=>{const l=Bo().relics.includes(e);l!==c&&(c=l,t.map=l?r:s,t.color.set(l?a:new St(16777215)))}}const Fi=256,ns=192;function s3(){return $t("portal-survey-screen",()=>{const n=document.createElement("canvas");n.width=Fi,n.height=ns;const t=n.getContext("2d");t.fillStyle="#0A1A1A",t.fillRect(0,0,Fi,ns);const e=t.createRadialGradient(Fi/2,ns/2,10,Fi/2,ns/2,Fi*.6);e.addColorStop(0,"rgba(70,224,216,0.22)"),e.addColorStop(1,"rgba(70,224,216,0.0)"),t.fillStyle=e,t.fillRect(0,0,Fi,ns),t.strokeStyle="rgba(70,224,216,0.12)",t.lineWidth=1;for(let s=8;s<ns;s+=8)t.beginPath(),t.moveTo(0,s),t.lineTo(Fi,s),t.stroke();t.strokeStyle="rgba(70,224,216,0.9)",t.lineWidth=3,t.strokeRect(3,3,Fi-6,ns-6),t.textAlign="left",t.fillStyle="#7FF4EC",t.font="bold 17px monospace",t.fillText("DIMENSIONAL SURVEY",12,28),t.strokeStyle="rgba(70,224,216,0.6)",t.lineWidth=1.5,t.beginPath(),t.moveTo(12,36),t.lineTo(Fi-12,36),t.stroke(),["VERDANT","ASHFALL","RIFT"].forEach((s,r)=>{const a=64+r*36;t.fillStyle="rgba(140,240,232,0.95)",t.font="bold 14px monospace",t.fillText(s,16,a),t.fillStyle="rgba(240,150,70,0.95)",t.font="11px monospace",t.fillText("· CALIBRATING ·",16,a+15)});const o=new yt(n);return o.wrapS=ue,o.wrapT=ue,o},!0)}const vi=128;function r3(n,t){return $t(`portal-relic-socket-${n}`,()=>{const e=document.createElement("canvas");e.width=vi,e.height=vi;const i=e.getContext("2d"),o=vi/2,s=vi/2;i.clearRect(0,0,vi,vi),i.strokeStyle=n,i.globalAlpha=.22,i.lineWidth=3,i.beginPath(),i.arc(o,s,vi*.42,0,Math.PI*2),i.stroke(),i.lineWidth=1.5,i.beginPath(),i.arc(o,s,vi*.3,0,Math.PI*2),i.stroke();const r=Te(t);i.globalAlpha=.16;for(let c=0;c<10;c++){const l=r()*Math.PI*2,d=vi*.34,u=vi*.4;i.beginPath(),i.moveTo(o+Math.cos(l)*d,s+Math.sin(l)*d),i.lineTo(o+Math.cos(l)*u,s+Math.sin(l)*u),i.stroke()}i.globalAlpha=1;const a=new yt(e);return a.wrapS=ue,a.wrapT=ue,a},!0)}const an=2.2,Jn=2.8,In=.2,si=.22,zi=.16,ia=.16,oa=.035,a3=[{worldId:"verdant",tint:"#3FD9C0",pulseHex:4184512,pos:new M(0,0,3.5),rotY:0,speed:.55,phaseStep:.16,segCount:7,wobble:!1,seed:31249},{worldId:"ashfall",tint:"#E0552A",pulseHex:16734766,pos:new M(-4,0,.9),rotY:-Math.PI/2,speed:1.05,phaseStep:.2,segCount:6,wobble:!1,seed:31266},{worldId:"rift",tint:"#9B5CFF",pulseHex:10510591,pos:new M(4,0,.9),rotY:Math.PI/2,speed:.8,phaseStep:.12,segCount:8,wobble:!0,seed:31283}];function c3(n,t,e,i){let o=n.minX,s=n.maxX,r=n.minZ,a=n.maxZ;return Math.abs(i-Math.PI/2)<.01?(o=n.minZ,s=n.maxZ,r=-n.maxX,a=-n.minX):Math.abs(i+Math.PI/2)<.01&&(o=-n.maxZ,s=-n.minZ,r=n.minX,a=n.maxX),{minX:o+t,maxX:s+t,minY:n.minY,maxY:n.maxY,minZ:r+e,maxZ:a+e}}function l3(n,t,e,i,o,s){n.onBeforeRender=()=>{const r=performance.now()/1e3;let a=.5+.5*Math.sin((r*i.speed-e*i.phaseStep)*Math.PI*2);i.wobble&&(a*=.8+.2*Math.sin(r*3.3+e*.7)),a=Math.max(0,Math.min(1,a)),t.opacity=.28+.72*a,t.color.copy(o).lerp(s,a)}}function d3(n){const t=new Bt;t.name=`gate-${n.worldId}`;const e=[],i=Te(n.seed),o=new U(an+1,.1,1.15);o.translate(0,.05,-.575);const s=new U(an+.3,.1,.6);s.translate(0,.15,-.28);const r=Qt([o,s]);o.dispose(),s.dispose(),t.add(new L(r,Dn)),e.push({minX:-3.2/2,minY:0,minZ:-1.15,maxX:(an+1)/2,maxY:.2,maxZ:.02});const a=[],c=new U(zi,Jn,si);c.translate(-1.1800000000000002,In+Jn/2,-si/2),a.push(c);const l=new U(zi,Jn,si);l.translate(an/2+zi/2,In+Jn/2,-si/2),a.push(l);const d=new U(an+zi*2,ia,si);d.translate(0,In+Jn+ia/2,-si/2),a.push(d);for(const y of[-1,1]){const _=new U(.16,.16,si*.9);_.rotateZ(y*Math.PI/4),_.translate(y*(an/2+zi*.3),In+Jn+.02,-si/2),a.push(_)}const u=Qt(a);for(const y of a)y.dispose();t.add(new L(u,Co)),e.push({minX:-1.26,minY:In,minZ:-si,maxX:-1.08,maxY:In+Jn+ia,maxZ:.02}),e.push({minX:an/2-.02,minY:In,minZ:-si,maxX:an/2+zi,maxY:In+Jn+ia,maxZ:.02});const h=$R(n.worldId,n.tint,an-.18,Jn-.18);h.mesh.rotation.y=Math.PI,h.mesh.position.set(0,In+Jn/2,-si*.4),t.add(h.mesh);const f=[],m=In+Jn*.72;for(const y of[-1,1]){const _=y*(an/2+zi+.1),R=new wt(oa,oa,m,7);R.translate(_,m/2,-.05),f.push(R);const D=new wt(oa,oa,.18,7);D.rotateZ(Math.PI/2),D.translate(_-y*.09,m,-.05),f.push(D)}const v=Qt(f);for(const y of f)y.dispose();t.add(new L(v,$n)),Ua(t,{x:0,y:In+.02,z:-.55,width:an+.8,length:1.05,tiltX:-Math.PI/2,color:n.pulseHex,opacity:.11});const p=new St(n.pulseHex).multiplyScalar(.22),g=new St(n.pulseHex),S=an/2+zi+.1+oa+.025,x=new U(.045,m/n.segCount*.72,.045);for(let y=0;y<n.segCount;y++){const _=(y+.5)/n.segCount,R=new lt({color:g.clone(),toneMapped:!1,transparent:!0}),D=new L(x,R);D.position.set(S,_*m,-.05),l3(D,R,y,n,p,g),t.add(D)}const w=In+Jn+ia/2;Ci(t,[{pos:new M(-an/2,w,.02),color:xe.teal},{pos:new M(an/2,w,.02),color:xe.teal,blink:!0,period:1.6+i()*1.2,phase:i()},{pos:new M(-1.24,In+.3,.02),color:xe.teal},{pos:new M(an/2+zi-.02,In+.3,.02),color:xe.teal},{pos:new M(-an*.35,.11,-1),color:xe.teal},{pos:new M(an*.35,.11,-1),color:xe.teal}]);const E=an/2+.55,b=new L(new wt(.13,.15,.3,10),Dn);b.position.set(E,.15,-.55),t.add(b);const T=new lt({map:r3(n.tint,n.seed),transparent:!0,toneMapped:!1,side:me}),C=new L(new qt(.26,.26),T);return C.rotation.x=-Math.PI/2,C.position.set(E,.305,-.55),C.name=`relic-socket-${n.worldId}`,o3(C,T,n.worldId,n.tint,n.pulseHex),t.add(C),e.push({minX:E-.16,minY:0,minZ:-.71,maxX:E+.16,maxY:.3,maxZ:-.39}),{group:t,portal:h,colliders:e}}function u3(n,t,e){const s=new L(new wt(.5,.54,.9,8),Dn);s.position.set(t,.9/2,e),n.add(s);const r=new L(new zo(.2,.45,8,1,!0),new lt({color:4645080,transparent:!0,opacity:.05,toneMapped:!1,side:me,blending:Ae,depthWrite:!1}));r.name="holotable-standby-cone",r.position.set(t,.9+.225,e),r.rotation.x=Math.PI,r.visible=Bo().relics.length>0,n.add(r);const a=new Bt;return a.name="holotable-projection",a.position.set(t,.9+.05,e),n.add(a),{minX:t-.5,minY:0,minZ:e-.5,maxX:t+.5,maxY:.9,maxZ:e+.5}}function h3(n,t,e){const i=new L(new U(.6,1.3,.3),Dn);i.position.set(t,.65,e),i.name="survey-console",n.add(i);const o=new L(new qt(.46,.36),new lt({map:s3(),toneMapped:!1}));return o.position.set(t,.98,e+.155),o.rotation.x=-.12,n.add(o),Ua(n,{x:t,y:.72,z:e+.2,width:.5,length:.3,tiltX:-Math.PI/2,color:2808040,opacity:.22}),Ci(n,[{pos:new M(t-.18,1.24,e+.16),color:xe.teal,blink:!0,period:2.2,phase:.3},{pos:new M(t+.18,1.24,e+.16),color:xe.orange}]),{minX:t-.3,minY:0,minZ:e-.15,maxX:t+.3,maxY:1.3,maxZ:e+.15}}const Gc=new M(-2.6,0,-3.25),wm=new M(0,0,-.6);function f3(n){const t=[],e=[];for(const i of a3){const o=d3(i);o.group.position.set(i.pos.x,i.pos.y,i.pos.z),o.group.rotation.y=i.rotY,n.add(o.group);for(const s of o.colliders)t.push(c3(s,i.pos.x,i.pos.z,i.rotY));e.push({worldId:i.worldId,portal:o.portal})}return t.push(u3(n,wm.x,wm.z)),t.push(h3(n,Gc.x,Gc.z)),{colliders:t,gates:e,consoleAnchor:new M(Gc.x,1,Gc.z+.35)}}const Qs=new Je(0,0,0,"YXZ"),$s=new M,p3={type:"change"},m3={type:"lock"},g3={type:"unlock"},ym=Math.PI/2;class v3 extends ws{constructor(t,e){super(),this.camera=t,this.domElement=e,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=x3.bind(this),this._onPointerlockChange=S3.bind(this),this._onPointerlockError=_3.bind(this),this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return this.camera}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.camera.quaternion)}moveForward(t){const e=this.camera;$s.setFromMatrixColumn(e.matrix,0),$s.crossVectors(e.up,$s),e.position.addScaledVector($s,t)}moveRight(t){const e=this.camera;$s.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector($s,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function x3(n){if(this.isLocked===!1)return;const t=n.movementX||n.mozMovementX||n.webkitMovementX||0,e=n.movementY||n.mozMovementY||n.webkitMovementY||0,i=this.camera;Qs.setFromQuaternion(i.quaternion),Qs.y-=t*.002*this.pointerSpeed,Qs.x-=e*.002*this.pointerSpeed,Qs.x=Math.max(ym-this.maxPolarAngle,Math.min(ym-this.minPolarAngle,Qs.x)),i.quaternion.setFromEuler(Qs),this.dispatchEvent(p3)}function S3(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(m3),this.isLocked=!0):(this.dispatchEvent(g3),this.isLocked=!1)}function _3(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const pf=1.7,M3=3.5,bm=.3,w3=pf,ei={forward:!1,backward:!1,left:!1,right:!1};let Ti=null,La=[],Lh=performance.now(),mf=()=>0;function y3(n){mf=n}function b3(n){La=n}let sr=0,is=-1,sa=-1;function T3(n,t,e){is<0&&(is=n.fov,sa=n.fov),e?sr=Math.sin(t*5.5)*.022:(sr*=Math.max(0,1-6*.016),Math.abs(sr)<1e-4&&(sr=0)),n.position.y=mf(n.position.x,n.position.z)+pf+sr;const i=Xe(),s=(!e||i.seated?is:is+2)-sa;Math.abs(s)>.01?(sa+=s*Math.min(1,8*.016),n.fov=sa,n.updateProjectionMatrix()):n.fov!==is&&!e&&(sa=is,n.fov=is,n.updateProjectionMatrix())}let Vl=!1,Da=null,Ia=null,Dh=0;const E3=350;function A3(n,t,e=1.1){if(!Ti)return;const i=Ti.camera,o={position:i.position.clone(),quaternion:i.quaternion.clone()};xv(!0,o);const s=n.clone();s.y+=e;const r=new He,a=new ye;a.position.copy(s),a.lookAt(t),r.copy(a.quaternion),Da=s,Ia=r,Vl=!0,Dh=0}function C3(){if(!Ti)return;const n=Xe();if(!n.seated||!n.anchorReturn)return;const t=Ti.camera;t.position.copy(n.anchorReturn.position),t.quaternion.copy(n.anchorReturn.quaternion),sr=0,xv(!1),Vl=!1,Da=null,Ia=null}function R3(n){switch(n.code){case"KeyW":case"ArrowUp":ei.forward=!0;break;case"KeyS":case"ArrowDown":ei.backward=!0;break;case"KeyA":case"ArrowLeft":ei.left=!0;break;case"KeyD":case"ArrowRight":ei.right=!0;break}}function P3(n){switch(n.code){case"KeyW":case"ArrowUp":ei.forward=!1;break;case"KeyS":case"ArrowDown":ei.backward=!1;break;case"KeyA":case"ArrowLeft":ei.left=!1;break;case"KeyD":case"ArrowRight":ei.right=!1;break}}function Du(n,t,e){if(.1>e.maxY||1.9<e.minY)return!1;const s=Math.max(e.minX,Math.min(n,e.maxX)),r=Math.max(e.minZ,Math.min(t,e.maxZ)),a=n-s,c=t-r;return a*a+c*c<bm*bm}function L3(n,t,e){const i=n.x+t,o=n.z+e;let s=!1;for(const c of La)if(Du(i,o,c)){s=!0;break}if(!s){n.x=i,n.z=o;return}let r=!1;for(const c of La)if(Du(i,n.z,c)){r=!0;break}if(!r){n.x=i;return}let a=!1;for(const c of La)if(Du(n.x,o,c)){a=!0;break}a||(n.z=o)}function D3(n,t,e){return La=e,Ti=new v3(n,t.domElement),n.position.set(0,w3,-19),t.domElement.addEventListener("click",()=>{Ti?.lock()}),window.addEventListener("keydown",R3),window.addEventListener("keyup",P3),Lh=performance.now(),Ti}let rr=!1;function Tm(){return rr}function I3(n){if(!Ti)return;const t=Math.min((n-Lh)/1e3,.05);Lh=n;const e=Ti.camera,i=Xe();if(Vl&&Da&&Ia){Dh+=t*1e3;const s=Math.min(Dh/E3,1),r=s*s*(3-2*s);e.position.lerp(Da,r),e.quaternion.slerp(Ia,r),s>=1&&(Vl=!1,Da=null,Ia=null),rr=!1;return}if(i.seated){rr=!1;return}if(!Ti.isLocked){rr=!1;return}const o=new M;ei.forward&&(o.z-=1),ei.backward&&(o.z+=1),ei.left&&(o.x-=1),ei.right&&(o.x+=1),rr=o.lengthSq()>0,rr&&(o.normalize().multiplyScalar(M3*t),o.applyEuler(new Je(0,e.rotation.y,0,"YXZ")),L3(e.position,o.x,o.z)),e.position.y=mf(e.position.x,e.position.z)+pf}const N3=2.5,Be={camera:null,scene:null,raycaster:new Zy,allInteractables:[],current:null};let E1=null,A1=null;function Em(n){E1=n,Be.current=null}function Am(n){A1=n,Be.current=null}function O3(){return E1??Be.scene}function gf(){return A1??Be.allInteractables}function U3(n,t){Be.camera=n,Be.scene=t,window.addEventListener("keydown",F3)}function C1(n){Be.allInteractables.push(...n)}function F3(n){if(n.code!=="KeyE")return;if(Xe().seated){C3();return}Be.current&&R1()}function R1(){!Be.current||!Be.camera||Be.current.onInteract({playerPos:Be.camera.position.clone()})}function z3(){if(!Be.camera||!Be.scene)return;IC(Be.camera.position);const n=O3();if(!n)return;Be.raycaster.setFromCamera(new rt(0,0),Be.camera);const t=Be.raycaster.intersectObjects(n.children,!0);let e=null;for(const i of t){if(i.distance>N3)break;if(i.object.visible===!1)continue;const o=B3(i.object);if(o){e=o;break}}if(Be.current=e,e){const i=e.getPrompt?e.getPrompt():e.prompt;_b(`[E]  ${i}`)}else Mb()}function B3(n){const t=gf();let e=n;for(;e;){const i=e.name;if(i){const o=t.find(s=>s.id===i);if(o)return o}e=e.parent}return null}function H3(){if(!Be.camera)return!1;const n=Be.camera.position;if(Be.current)return R1(),!0;let t=null,e=1/0;for(const i of gf()){const o=n.distanceTo(i.position);o<=i.radius&&o<e&&(t=i,e=o)}return t?(t.onInteract({playerPos:n.clone()}),!0):!1}function k3(){return gf().map(n=>({id:n.id,x:n.position.x,y:n.position.y,z:n.position.z}))}const Go=new Map;let Lr="ship",Sl=null,Ih=null,Iu=!1;function W3(n,t){Sl=n,Ih=t,ib(e=>Y3(e))}function ra(n){Go.set(n.id,n);for(const t of n.cameras)rs(t.name,t.position,t.lookAt,n.id)}function P1(){return Lr}function G3(){const n=Go.get(Lr);if(!n)throw new Error(`No active world '${Lr}' registered`);return n}function vs(n){return Go.has(n)}function V3(n){return Go.get(n)?.scene??null}function X3(n){return Go.get(n)?.spawn??null}function Nh(n,t){const e=Go.get(n);!e||!Sl||!Ih||(Ih.setScene(e.scene),b3(e.colliders),y3(e.groundHeight),n==="ship"?(Em(null),Am(null)):(Em(e.scene),Am(e.interactables)),Lr=n,y1(),t&&(Sl.position.copy(e.spawn.position),Sl.lookAt(e.spawn.lookAt)))}function Y3(n){n===Lr||!Go.has(n)||Nh(n,!1)}function Oh(n,t={}){if(!Go.has(n))return Promise.resolve();const e=t.teleport!==!1;return t.instant||n===Lr?(Nh(n,e),Promise.resolve()):Iu?Promise.resolve():(Iu=!0,pd(()=>Nh(n,e)).then(()=>{Iu=!1}))}const Cm=.6,q3=.35,L1=.25;function Z3(n){return function(){let t=n+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function Vc(n,t,e,i,o,s,r,a,c){n.push(i.x,i.y,i.z,o.x,o.y,o.z,s.x,s.y,s.z);const l=new M().subVectors(o,i).cross(new M().subVectors(s,i)).normalize();t.push(l.x,l.y,l.z,l.x,l.y,l.z,l.x,l.y,l.z),e.push(r[0],r[1],a[0],a[1],c[0],c[1])}function D1(n,t){const e=t.slices;let i=e[0],o=e[e.length-1];if(n<=i.x)o=e[1]??i;else if(n>=o.x)i=e[e.length-2]??o;else for(let l=0;l<e.length-1;l++)if(n>=e[l].x&&n<=e[l+1].x){i=e[l],o=e[l+1];break}const s=o.x!==i.x?(n-i.x)/(o.x-i.x):0,r=gn.lerp(i.halfW,o.halfW,s)+Cm,a=gn.lerp(i.halfH,o.halfH,s)+Cm,c=gn.lerp(i.yCenter,o.yCenter,s);return{halfW:r,halfH:a,yCenter:c,chamfer:q3*a}}function K3(n,t){const{halfW:e,halfH:i,yCenter:o,chamfer:s}=D1(n,t);return[[-e,-i+s],[-e+s,-i],[e-s,-i],[e,-i+s],[e,i-s],[e-s,i],[-e+s,i],[-e,i-s]].map(([a,c])=>new M(a,c+o,n))}function j3(n,t){const[e,i,o]=n.position,[s,,r]=n.normal;if(Math.abs(s)>=Math.abs(r))return new M(Math.sign(s)*D1(o,t).halfW,i,o);const a=t.slices[0].x-L1,c=t.slices[t.slices.length-1].x;return new M(e,i,r<0?a:c)}function J3(n,t){return Math.abs(n-t)<3.5?.1:n>=2?1:n<=-18.5?.2:.5}function Bi(n,t,e,i,o,s){const r=new U(n,t,e);return r.translate(i,o,s),r}function Q3(){const n=Qt([new U(.35,.14,.45),Bi(.3,.04,.05,0,.09,-.15),Bi(.3,.04,.05,0,.09,0),Bi(.3,.04,.05,0,.09,.15)]),t=new wt(.16,.16,.55,10),e=new wt(.025,.025,.8,6),i=Qt([new U(.22,.22,.22),Bi(.14,.06,.14,0,.14,0)]),o=new wt(.07,.07,.5,8),s=Qt([new U(.45,.06,.4),Bi(.3,.03,.06,0,.045,.15)]),r=new Se(.2,8,4,0,Math.PI*2,0,Math.PI/2),a=Qt([new U(.09,.35,.32),Bi(.24,.09,.06,0,0,.13)]),c=Qt([Bi(.4,.05,.06,0,0,-.1),Bi(.4,.05,.06,0,0,0),Bi(.4,.05,.06,0,0,.1)]),l=new wt(.05,.1,.35,8);return[n,t,e,i,o,s,r,a,c,l]}function $3(n,t){const e=Z3(n),i=[],o=[],s=[],r=[],a=t.slices[0].x,c=t.slices[t.slices.length-1].x,l=new Set(t.slices.map(k=>k.x));for(let k=a;k<=c;k+=1.5)l.add(k);l.add(c);const d=Array.from(l).sort((k,$)=>k-$),u=d.map(k=>K3(k,t)),h=c-a;for(let k=0;k<d.length-1;k++){const $=u[k],mt=u[k+1],at=(d[k]-a)/h,X=(d[k+1]-a)/h;for(let tt=0;tt<8;tt++){const ft=tt/8,ot=(tt+1)/8;Vc(o,s,r,$[tt],$[(tt+1)%8],mt[(tt+1)%8],[ft,at],[ot,at],[ot,X]),Vc(o,s,r,$[tt],mt[(tt+1)%8],mt[tt],[ft,at],[ot,X],[ft,X])}}const f=a-L1,m=new M(0,t.slices[0].yCenter,f);for(let k=0;k<8;k++)Vc(o,s,r,m,u[0][k],u[0][(k+1)%8],[.5,0],[k/8,0],[(k+1)/8,0]);const v=new M(0,t.slices[t.slices.length-1].yCenter,c),p=u[u.length-1];for(let k=0;k<8;k++)Vc(o,s,r,v,p[(k+1)%8],p[k],[.5,1],[(k+1)/8,1],[k/8,1]);const g=new ce;g.setAttribute("position",new oe(o,3)),g.setAttribute("normal",new oe(s,3)),g.setAttribute("uv",new oe(r,2)),i.push(g);const S=t.engineAxis.position,x=new U(4.2,2.8,2);x.translate(S[0],S[1],S[2]-1),i.push(x);for(const k of[-1,1]){const $=new wt(.7,.9,1.2,12);$.rotateX(Math.PI/2),$.translate(S[0]+k*1.2,S[1],S[2]+.6),i.push($)}const w=t.cargoDoor.position,E=new U(.15,3.4,4.8);E.translate(w[0]-.08,w[1],w[2]);const b=new U(.25,.2,5.8);b.translate(w[0]-.1,w[1]+1.8,w[2]);const T=new U(.25,.2,5.8);T.translate(w[0]-.1,w[1]-1.8,w[2]),i.push(E,b,T);const C=t.canopy.position,y=new U(.2,2.1,.3);y.translate(C[0]-2.3,C[1],C[2]);const _=new U(.2,2.1,.3);_.translate(C[0]+2.3,C[1],C[2]);const R=new U(4.8,.2,.3);R.translate(C[0],C[1]+1.05,C[2]);const D=new U(4.8,.2,.3);D.translate(C[0],C[1]-1.05,C[2]),i.push(y,_,R,D);for(const k of t.portholes){const $=j3(k,t),mt=k.normal[0],at=new Ln(.44,.08,8,20);at.rotateY(Math.PI/2),at.translate($.x+mt*.05,$.y,$.z),i.push(at);const X=new wt(.38,.38,.1,16);X.rotateZ(Math.PI/2),X.translate($.x-mt*.1,$.y,$.z),i.push(X)}const N=Q3(),z=[],B=new M(...C),V=new M(...w),j=t.portholes.map(k=>new M(...k.position)),Y=2;for(let k=1;k<d.length-1;k++){const $=d[k],mt=J3($,w[2]),at=u[k];for(let X=0;X<8;X++){const tt=mt*Y;let ft=Math.floor(tt)+(e()<tt%1?1:0);const ot=at[X],Nt=at[(X+1)%8];for(;ft-- >0;){const Et=e()<.5?0:1,Vt=gn.clamp(Et+(e()-.5)*.4,.06,.94),O=new M().lerpVectors(ot,Nt,Vt);if(O.z+=(e()-.5)*1.2,O.distanceTo(B)<2.6||O.distanceTo(V)<3||j.some(zt=>O.distanceTo(zt)<1.2))continue;const Ut=new M().subVectors(Nt,ot).normalize(),Rt=new M().crossVectors(Ut,new M(0,0,1)).normalize(),ie=N[Math.floor(e()*N.length)].clone(),bt=Math.floor(e()*4)*(Math.PI/2),Kt=new He().setFromUnitVectors(new M(0,1,0),Rt).multiply(new He().setFromAxisAngle(Rt,bt)),Ht=.8+e()*.4;ie.scale(Ht,Ht,Ht),ie.applyQuaternion(Kt),ie.translate(O.x+Rt.x*.02,O.y+Rt.y*.02,O.z+Rt.z*.02),z.push(ie)}}}if(z.length,z.length>0){i.push(Qt(z));for(const k of z)k.dispose()}for(const k of N)k.dispose();const J=Qt(i.map(k=>k.toNonIndexed()));for(const k of i)k.dispose();return J.computeVertexNormals(),{geometry:J,tris:J.attributes.position.count/3}}const tP={slices:[{x:-25,halfW:3,halfH:1.5,yCenter:1.5},{x:-20,halfW:3,halfH:1.5,yCenter:1.5},{x:-18.5,halfW:6.5,halfH:1.5,yCenter:1.5},{x:-13.5,halfW:6.5,halfH:1.5,yCenter:1.5},{x:-4,halfW:3,halfH:1.5,yCenter:1.5},{x:2,halfW:3,halfH:1.5,yCenter:1.5},{x:9,halfW:4,halfH:2.5,yCenter:2.5},{x:18,halfW:4,halfH:2.5,yCenter:2.5},{x:25,halfW:4,halfH:1.8,yCenter:1.8}],canopy:{position:[0,1.65,-25],normal:[0,0,-1]},engineAxis:{position:[0,1.8,25],normal:[0,0,1]},cargoDoor:{position:[-4,2.5,13.5],normal:[-1,0,0]},portholes:[{position:[-1.5,1.4,-18],normal:[-1,0,0]},{position:[-6.5,1.6,-16],normal:[-1,0,0]},{position:[-1.5,1.45,-9],normal:[-1,0,0]},{position:[1.5,1.4,-18],normal:[1,0,0]},{position:[6.5,1.6,-16],normal:[1,0,0]},{position:[1.5,1.45,-9],normal:[1,0,0]}]};function eP(n){const t=n.attributes.position;if(!t)return;const e=t.count,i=new Float32Array(e*3);for(let o=0;o<e;o+=3)i[o*3]=1,i[(o+1)*3+1]=1,i[(o+2)*3+2]=1;n.setAttribute("aBary",new re(i,3))}const nP=`
  attribute vec3 aBary;
  varying vec3 vBary;
  varying vec3 vNormalV;
  varying vec3 vLocalPos;

  void main() {
    vBary = aBary;
    vNormalV = normalMatrix * normal;
    vLocalPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,iP=`
  varying vec3 vBary;
  varying vec3 vNormalV;
  varying vec3 vLocalPos;

  uniform vec3 uColor;
  uniform float uTime;
  uniform float uLineDensity;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    // Edge-glow
    float minB = min(vBary.x, min(vBary.y, vBary.z));
    float wire = 1.0 - smoothstep(0.0, fwidth(minB) * 1.5, minB);

    // Fresnel
    vec3 normalV = normalize(vNormalV);
    float fres = pow(1.0 - clamp(dot(normalV, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.5);

    // Local-space scanlines (Z is the long axis, but scanlines on Y look best vertically)
    float scan = smoothstep(0.35, 0.0, abs(fract(vLocalPos.y * uLineDensity - uTime * 1.5) - 0.5));

    // Slow sweep band
    float sweep = smoothstep(0.12, 0.0, abs(fract(vLocalPos.y * 0.25 - uTime * 0.07) - 0.5));

    // Flicker
    float flick = 0.92 + 0.08 * hash(floor(uTime * 24.0));
    float dropoutHash = hash(floor(uTime * 3.0) + 7.0);
    flick *= mix(1.0, 0.35, step(0.985, dropoutHash));

    vec3 col = uColor * (0.10 + 0.85 * fres + 0.20 * scan + 0.55 * sweep + 0.90 * wire) * flick;

    if (!gl_FrontFacing) {
      col *= 0.3; // volume feel
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;function oP(n=5888511){const t=new St(n);return new de({vertexShader:nP,fragmentShader:iP,uniforms:{uColor:{value:new M(t.r,t.g,t.b)},uTime:{value:0},uLineDensity:{value:60}},transparent:!0,blending:Ae,depthWrite:!1,side:me})}const sP=8,rP=3.6,aP=7,cP=1.4,lP=2.2,Rm={ship:"SHIP",verdant:"VERDANT",ashfall:"ASHFALL",rift:"RIFT"},dP=6,Uh=new M(0,0,-2.75);function uP(n,t){return{id:t.id,prompt:t.prompt,radius:t.radius,position:t.position,getPrompt(){return vs(n)?t.getPrompt?t.getPrompt():t.prompt:"Dimensional Lock"},onInteract(e){if(vs(n)){t.onInteract(e);return}Ee("ui"),en("DIMENSIONAL LOCK — CALIBRATING")}}}const hP=5892;function fP(){for(let t=0;t<2;t++)try{const e=$3(hP,tP);eP(e.geometry);const i=oP(5888511);i.uniforms.uColor.value.multiplyScalar(.35);const o=new L(e.geometry,i);return o.name="ship-hologram",o.scale.setScalar(1/45),o.visible=!1,{mesh:o,timeUniform:i.uniforms.uTime}}catch(e){console.error(`[portalRoom] hull hologram build attempt ${t+1} failed`,e)}console.error("[portalRoom] hull import unavailable after retry — shipping additive-teal cone placeholder (deviation, see report)");const n=new L(new zo(.16,.5,10,1,!0),new lt({color:4645080,transparent:!0,opacity:.6,toneMapped:!1,side:me,blending:Ae,depthWrite:!1}));return n.name="ship-hologram",n.visible=!1,{mesh:n,timeUniform:null}}function pP(n){const t=["verdant","ashfall","rift"];return{id:"dimensional-survey-console",prompt:"Access Survey Console",radius:2.3,position:n.clone(),onInteract(){Ee("ui");const e=Bo(),i=t.map(o=>{if(!vs(o))return`${Rm[o]} — CALIBRATING`;const s=e.scans.filter(a=>a.startsWith(`${o}-`)).length,r=e.relics.includes(o)?"RELIC SECURED":"RELIC UNCONFIRMED";return`${Rm[o]} — ${s}/${dP} CATALOGUED — ${r}`});Qn("DIMENSIONAL SURVEY",i)}}}function mP(){const{group:n,colliders:t}=Ho({width:sP,height:rP,depth:aP,wallMaterial:fn,doors:[{wall:"fore",gapW:cP,gapH:lP,offset:0,framed:!0}]});n.name="portal-room";const e=f3(n);for(const h of e.colliders)t.push(h);const i=new L(new Xn(.5,.72,40),new lt({color:4645080,transparent:!0,opacity:.45,side:me,toneMapped:!1}));i.rotation.x=-Math.PI/2,i.position.set(Uh.x,.03,Uh.z),n.add(i);const o=[pP(e.consoleAnchor)];for(const h of e.gates)o.push(uP(h.worldId,h.portal.interactable));const s=new L(new qt(.001,.001),new lt({visible:!1}));s.position.set(0,1.6,0),s.onBeforeRender=()=>{!vs("verdant")&&!vs("ashfall")&&!vs("rift")&&y1()},n.add(s);const r=n.getObjectByName("holotable-projection"),a=n.getObjectByName("holotable-standby-cone");if(r){const h=fP();h.mesh.position.set(0,.38,0),r.rotation.z=.45,r.add(h.mesh);const f=new L(new qt(.001,.001),new lt({transparent:!0,opacity:.001,depthWrite:!1}));f.frustumCulled=!1,f.position.set(0,1.6,-.6),f.onBeforeRender=()=>{const m=Bo().relics,v=m.includes("verdant")&&m.includes("ashfall")&&m.includes("rift");if(h.mesh.visible=v,a&&(a.visible=m.length>0),v){const p=performance.now()/1e3;h.mesh.rotation.y=p*.3,h.timeUniform&&(h.timeUniform.value=p)}},n.add(f)}so(n);const c=new M(0,1.9,-3.1),l=new M(0,1.5,3.5),d=new M(2.6,1.7,1.6),u=new M(2.6,1.05,-3.4);return{group:n,colliders:t,interactables:o,cameras:[{name:"portal-room",position:c,lookAt:l},{name:"portal-room-qa",position:d,lookAt:u}]}}const Pm=new M(0,0,21.5);function gP(){return{position:Uh.clone().add(Pm).setY(1.7),lookAt:new M(0,1.4,1.8).add(Pm)}}const Fh=[{r:1,g:1,b:1,weight:.62},{r:.804,g:.847,b:1,weight:.16},{r:1,g:.851,b:.69,weight:.14},{r:1,g:.702,b:.627,weight:.08}],zh=[];{let n=0;for(const t of Fh)n+=t.weight,zh.push(n)}function vP(n){for(let t=0;t<zh.length;t++)if(n<zh[t])return Fh[t];return Fh[0]}const xP=`
  attribute float size;
  attribute float phase;
  attribute vec3 color;
  attribute float brightness;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uScroll;
  uniform float uSpan;
  uniform float uZMin;
  void main() {
    vColor = color;
    float twinkle = 1.0 + sin(uTime + phase) * 0.15;
    vAlpha = clamp(twinkle * brightness, 0.0, 1.0);

    // Wrap z into [uZMin, uZMin + uSpan) so the field streams toward +Z.
    vec3 p = position;
    p.z = mod(position.z - uScroll - uZMin, uSpan) + uZMin;

    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = size * twinkle * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`,SP=`
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float alpha = (1.0 - dist * 2.0) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;function vf(n){const t=n.rand??Math.random,e=n.count,i=new Float32Array(e*3),o=new Float32Array(e),s=new Float32Array(e),r=new Float32Array(e*3),a=new Float32Array(e),c=n.zMin+n.span/2,l=n.span/2;for(let f=0;f<e;f++){if(n.spherical){const p=t()*Math.PI*2,g=Math.acos(2*t()-1);i[f*3]=l*Math.sin(g)*Math.cos(p),i[f*3+1]=l*Math.sin(g)*Math.sin(p)*(n.yHalf/l),i[f*3+2]=c+l*Math.cos(g)}else i[f*3]=(t()*2-1)*n.xHalf,i[f*3+1]=(t()*2-1)*n.yHalf,i[f*3+2]=n.zMin+t()*n.span;const m=Math.pow(t(),3);o[f]=n.sizeMin+m*(n.sizeMax-n.sizeMin),a[f]=.32+m*.8,s[f]=t()*Math.PI*2;const v=vP(t());r[f*3]=v.r,r[f*3+1]=v.g,r[f*3+2]=v.b}const d=new ce;d.setAttribute("position",new re(i,3)),d.setAttribute("size",new re(o,1)),d.setAttribute("phase",new re(s,1)),d.setAttribute("color",new re(r,3)),d.setAttribute("brightness",new re(a,1));const u=new de({uniforms:{uTime:{value:0},uScroll:{value:0},uSpan:{value:n.span},uZMin:{value:n.zMin}},vertexShader:xP,fragmentShader:SP,transparent:!0,depthWrite:!1}),h=new io(d,u);return h.renderOrder=-1,h.frustumCulled=!1,h}function xf(n,t,e){const i=n.material;i instanceof de&&(i.uniforms.uTime.value=t,i.uniforms.uScroll.value=e)}function I1(n){n.geometry.dispose(),n.material instanceof Ei&&n.material.dispose()}const _P=1800,MP=-1400,wP=14;let Xc=-1,Lm=0;function yP(){const n=vf({count:3800,xHalf:900,yHalf:500,zMin:MP,span:_P,sizeMin:.6,sizeMax:3.4});return n.name="starfield-near",n}function bP(n,t){Xc<0&&(Xc=t);const e=Math.min(Math.max(t-Xc,0),.1);Xc=t,Lm+=wP*e,xf(n,t,Lm)}function TP(n){return{mesh:n.group,tick:t=>n.tick(t),dispose:()=>n.dispose(),getScanData:()=>n.getScanData()}}function Oe(n){let t=n>>>0;const e=()=>{t|=0,t=t+1831565813|0;let o=Math.imul(t^t>>>15,1|t);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296},i=e;return i.range=(o,s)=>o+e()*(s-o),i.int=(o,s)=>Math.floor(o+e()*(s-o+1)),i.signed=o=>(e()*2-1)*o,i.pick=o=>{let s=0;for(const c of o)s+=c;const r=e()*s;let a=0;for(let c=0;c<o.length;c++)if(a+=o[c],r<a)return c;return o.length-1},i.choice=o=>o[Math.floor(e()*o.length)],i}function EP(n){const e=document.createElement("canvas");e.width=512,e.height=512;const i=e.getContext("2d");if(!i)throw new Error("2d context unavailable");for(const[o,s,r,a,c]of[[512*.45,512*.5,512*.46,n[0],.85],[512*.58,512*.45,512*.38,n[1],.7]]){const l=i.createRadialGradient(o,s,0,o,s,r);l.addColorStop(0,a),l.addColorStop(1,"rgba(0,0,0,0)"),i.globalAlpha=c,i.fillStyle=l,i.beginPath(),i.arc(o,s,r,0,Math.PI*2),i.fill()}return i.globalAlpha=1,e}const AP=[{name:"nebula-persistent-a",colors:["rgba(0,90,110,1)","rgba(30,180,200,1)"],position:new M(-420,90,-1150),scale:[1900,1500],opacity:.16},{name:"nebula-persistent-b",colors:["rgba(100,30,10,1)","rgba(180,70,20,1)"],position:new M(1100,-100,-1550),scale:[1600,1200],opacity:.09},{name:"nebula-persistent-porthole",colors:["rgba(90,20,60,1)","rgba(190,60,90,1)"],position:new M(1450,140,-70),scale:[1500,1150],opacity:.08}];function N1(n,t=AP){const e=[],i=[],o=[];for(const a of t){const c=EP(a.colors),l=new yt(c);l.colorSpace=Ke;const d=new rd({map:l,transparent:!0,opacity:a.opacity,depthWrite:!1,blending:Ae,toneMapped:!1}),u=new jh(d);u.scale.set(a.scale[0],a.scale[1],1),u.position.copy(a.position),u.name=a.name,u.renderOrder=-1,n.add(u),e.push(u),i.push(d),o.push(l)}function s(a){for(const c of e)c.position.z+=a,c.position.z>500&&(c.position.z-=3500)}function r(){for(const a of e)n.remove(a);for(const a of i)a.dispose();for(const a of o)a.dispose()}return{sprites:e,tick:s,dispose:r}}function CP(n){const e=document.createElement("canvas");e.width=512,e.height=512;const i=e.getContext("2d");if(!i)throw new Error("2d context unavailable");const o=512/2,s=512/2,r=i.createRadialGradient(o,s,0,o,s,512*.5);r.addColorStop(0,"rgba(255,255,255,1)"),r.addColorStop(.07,"rgba(255,246,222,0.95)"),r.addColorStop(.18,"rgba(200,220,255,0.22)"),r.addColorStop(.42,"rgba(140,180,255,0)"),i.fillStyle=r,i.fillRect(0,0,512,512),i.globalCompositeOperation="lighter";const a=n.range(.55,.6);i.filter="blur(4px)";for(const d of[0,Math.PI/2]){i.save(),i.translate(o,s),i.rotate(d);const u=512*a,h=512*.022,f=i.createLinearGradient(-u/2,0,u/2,0);f.addColorStop(0,"rgba(255,255,255,0)"),f.addColorStop(.5,"rgba(255,250,235,0.80)"),f.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=f,i.fillRect(-u/2,-h/2,u,h),i.restore()}i.filter="none",i.globalCompositeOperation="source-over";const c=i.createRadialGradient(o,s,0,o,s,512*.06);c.addColorStop(0,"rgba(255,255,255,1)"),c.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=c,i.beginPath(),i.arc(o,s,512*.06,0,Math.PI*2),i.fill();const l=new yt(e);return l.colorSpace=Ke,l}function RP(n,t,e=460){const i=CP(n),o=new rd({map:i,transparent:!0,depthWrite:!1,blending:Ae,toneMapped:!1}),s=new jh(o);s.scale.set(e,e,1),s.position.copy(t),s.name="hero-sun",s.renderOrder=-2;function r(c){o.opacity=.92+.08*Math.sin(c*.5)}function a(){i.dispose(),o.dispose()}return{sprite:s,tick:r,dispose:a}}const PP=["KEPLER","STREL","OORT","VANTH","CYGNI","HELION","ERIDU","TYCHO","ABYSSAL","MERIDIAN","HALLOW","DRACO"],LP=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"],DP=["b","c","d"],IP=["MAJORIS","DRIFT","REACH","EXPANSE","PRIME"];function NP(n){const t=n.choice(PP),e=n.int(1,999);let i=`${t}-${e}`;const o=n();return o<.4?i+=` ${n.choice(LP)}`:o<.65&&(i+=` / ${n.choice(DP)}`),n()<.3&&(i+=` ${n.choice(IP)}`),i}const OP=12576498,Dm=[{bands:["#C8894A","#D4A052","#b87040","#7A2C1F","#e8b870"],base:["#7A2C1F","#C8894A","#D4A052"],accent:13067294},{bands:["#27567f","#3c79ab","#5f9fd6","#46E0D8","#3c79ab"],base:["#27567f","#3c79ab","#5f9fd6"],accent:4645080},{bands:["#7a4f92","#a85d88","#C7641E","#7A2C1F","#a85d88"],base:["#532f63","#7a4f92","#a85d88"],accent:13067294},{bands:["#E8E2D4","#d4a052","#b87040","#c89a5a","#E8E2D4"],base:["#b87040","#d4a052","#E8E2D4"],accent:15262420}];function Dr(n,t){const e=new Float32Array(t*t);for(let i=0;i<t*t;i++)e[i]=n()*2-1;return e}function Im(n){return n*n*(3-2*n)}function UP(n,t,e,i){const o=Math.floor(e),s=Math.floor(i),r=Im(e-o),a=Im(i-s),c=(o%t+t)%t,l=(c+1)%t,d=(s%t+t)%t,u=(d+1)%t,h=n[d*t+c],f=n[d*t+l],m=n[u*t+c],v=n[u*t+l],p=h+(f-h)*r,g=m+(v-m)*r;return p+(g-p)*a}function Ir(n,t,e,i,o,s,r){let a=.5,c=1,l=0,d=0;for(let u=0;u<r;u++){const h=e*o*c*t,f=i*s*c*t;l+=UP(n,t,h,f)*a,d+=a,a*=.5,c*=2}return d>0?l/d:0}function Vn(n){const t=n.replace("#","");return{r:parseInt(t.slice(0,2),16),g:parseInt(t.slice(2,4),16),b:parseInt(t.slice(4,6),16)}}function Nu(n,t,e){return n+(t-n)*e}function eo(n,t,e){return{r:Nu(n.r,t.r,e),g:Nu(n.g,t.g,e),b:Nu(n.b,t.b,e)}}function Yc(n){return n<0?0:n>255?255:n}function Xa(n,t,e,i,o){const s=n.width,r=Dr(e,40),a=6,c=t.getImageData(0,0,s,s),l=c.data;for(let d=0;d<s;d++){const u=d/s;for(let h=0;h<s;h++){const f=(d*s+h)*4;if(o!==void 0&&l[f+3]===0)continue;const m=h/s,v=Ir(r,40,m,u,a,a,2),p=1+v*i;l[f]=Yc(l[f]*p),l[f+1]=Yc(l[f+1]*p),l[f+2]=Yc(l[f+2]*p),o!==void 0&&(l[f+3]=Yc(l[f+3]*(1+v*o)))}}t.putImageData(c,0,0)}function ro(n){const t=document.createElement("canvas");t.width=n,t.height=n;const e=t.getContext("2d");if(!e)throw new Error("2d context unavailable");return{canvas:t,ctx:e}}function Vo(n){const t=new yt(n);return t.wrapS=Dt,t.colorSpace=Ke,t}const Nm=.3;function Ya(n,t,e){const i=n.width,o=t.globalCompositeOperation;t.globalCompositeOperation="multiply",t.globalAlpha=1;for(let s=0;s<i;s++){let r=s/i-e;r>.5&&(r-=1),r<-.5&&(r+=1);const a=(Math.cos(r*Math.PI*2)+1)*.5,c=Nm+(1-Nm)*Math.pow(a,2.2),l=Math.round(c*255);t.fillStyle=`rgb(${l},${l},${l})`,t.fillRect(s,0,1,i)}t.globalCompositeOperation=o}function qa(n){return n()}function Za(n,t,e=.45){const i=n.height,o=t.globalCompositeOperation;t.globalCompositeOperation="multiply";for(let s=0;s<i;s++){const r=s/i,a=Math.abs(r-.5)*2,c=1-(1-e)*Math.pow(a,1.8),l=Math.round(c*255);t.fillStyle=`rgb(${l},${l},${l})`,t.fillRect(0,s,i,1)}t.globalCompositeOperation=o}function O1(n,t,e,i,o,s,r){for(let a=0;a<i;a++){const c=t()*e,l=t()*e,d=t.range(o[0],o[1])*e,u=t.range(s[0],s[1]),h=n.createRadialGradient(c,l,0,c,l,d);for(const f of r)h.addColorStop(f.stop,`rgba(${f.rgb},${u*f.alphaMul})`);h.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=h,n.beginPath(),n.arc(c,l,d,0,Math.PI*2),n.fill()}}function FP(n,t){const{canvas:e,ctx:i}=ro(t),o=qa(n),s=t>=512,r=["#6a5a4a","#776657","#8a7a66","#5e5042"],a=i.createLinearGradient(0,0,t,t);a.addColorStop(0,n.choice(r)),a.addColorStop(1,n.choice(r)),i.fillStyle=a,i.fillRect(0,0,t,t);const c=s?n.int(5,8):n.int(3,6);for(let d=0;d<c;d++){const u=n()*t,h=n()*t,f=n.range(.08,.18)*t,m=i.createRadialGradient(u,h,0,u,h,f);m.addColorStop(0,"rgba(40,34,28,0.5)"),m.addColorStop(1,"rgba(40,34,28,0)"),i.fillStyle=m,i.beginPath(),i.arc(u,h,f,0,Math.PI*2),i.fill()}const l=s?n.int(32,48):n.int(18,30);return O1(i,n,t,l,[.015,.06],[.2,.45],[{stop:0,rgb:"30,24,20",alphaMul:1},{stop:.6,rgb:"60,52,44",alphaMul:.5},{stop:.85,rgb:"160,150,138",alphaMul:.5}]),Xa(e,i,n,s?.09:.06),Za(e,i),Ya(e,i,o),Vo(e)}function zP(n,t){const{canvas:e,ctx:i}=ro(t),o=qa(n),s=t>=512,r=i.createLinearGradient(0,0,0,t);r.addColorStop(0,"#cfe6f2"),r.addColorStop(.5,"#a9cfe0"),r.addColorStop(1,"#cfe6f2"),i.fillStyle=r,i.fillRect(0,0,t,t);const a=s?n.int(16,26):n.int(10,18);i.lineCap="round";for(let c=0;c<a;c++){let l=n()*t,d=n()*t;const u=n.int(3,7);i.strokeStyle=n()<.5?"rgba(70,224,216,0.5)":"rgba(255,255,255,0.6)",i.lineWidth=n.range(.8,2.2),i.beginPath(),i.moveTo(l,d);for(let h=0;h<u;h++)l+=n.signed(t*.12),d+=n.signed(t*.12),i.lineTo(l,d);i.stroke()}return Xa(e,i,n,s?.07:.05),Za(e,i,.5),Ya(e,i,o),Vo(e)}function BP(n,t){const{canvas:e,ctx:i}=ro(t),o=qa(n),s=t>=512;i.fillStyle="#1C1E22",i.fillRect(0,0,t,t);const r=s?n.int(10,16):n.int(6,12);for(let a=0;a<r;a++){const c=n()*t,l=n()*t,d=n.range(.05,.15)*t,u=i.createRadialGradient(c,l,0,c,l,d);u.addColorStop(0,"rgba(8,8,10,0.6)"),u.addColorStop(1,"rgba(8,8,10,0)"),i.fillStyle=u,i.beginPath(),i.arc(c,l,d,0,Math.PI*2),i.fill()}return Xa(e,i,n,s?.12:.08),Za(e,i,.4),Ya(e,i,o),Vo(e)}function U1(n,t){const{canvas:e,ctx:i}=ro(t);i.clearRect(0,0,t,t),i.lineCap="round";const s=t>=512?n.int(12,20):n.int(8,14);for(let r=0;r<s;r++){let a=n()*t,c=n()*t;const l=n.int(6,12);i.strokeStyle=n()<.5?"#C7641E":"#ff7a2a",i.lineWidth=n.range(1.2,3.5),i.beginPath(),i.moveTo(a,c);for(let d=0;d<l;d++)a+=n.signed(t*.1),c+=n.signed(t*.1),i.lineTo(a,c),n()<.3&&(i.lineTo(a+n.signed(t*.06),c+n.signed(t*.06)),i.moveTo(a,c));i.stroke()}return Vo(e)}function HP(n,t){const{canvas:e,ctx:i}=ro(t);i.clearRect(0,0,t,t);const o=t/2,s=t/2,r=t/2,a=n.int(16,26);for(let c=0;c<a;c++){const l=c/a*r,d=(c+1)/a*r;if(n()<.35)continue;const h=n.choice(["#C8894A","#D4A052","#E8E2D4","#b87040"]);i.globalAlpha=n.range(.25,.7),i.strokeStyle=h,i.lineWidth=(d-l)*.9,i.beginPath(),i.arc(o,s,(l+d)/2,0,Math.PI*2),i.stroke()}return i.globalAlpha=1,Xa(e,i,n,.22,.4),Vo(e)}function kP(n,t){const{canvas:e,ctx:i}=ro(t),o=qa(n),s=t>=512;i.fillStyle="#9a9ca2",i.fillRect(0,0,t,t);const r=s?n.int(10,18):n.int(6,12);return O1(i,n,t,r,[.05,.14],[.25,.42],[{stop:0,rgb:"40,42,46",alphaMul:1},{stop:.6,rgb:"60,62,66",alphaMul:.5}]),Xa(e,i,n,s?.06:.04),Za(e,i),Ya(e,i,o),Vo(e)}function WP(n,t){return t<.5?eo(n[0],n[1],t/.5):eo(n[1],n[2],(t-.5)/.5)}function Ou(n){return n<0?0:n>255?255:n}function GP(n,t,e,i){const{canvas:o,ctx:s}=ro(e),r=i!==void 0?i:qa(n),a=e>=512,c=t.base.map(Vn),l=t.bands.map(Vn),d=n.int(7,10),u=20,h=a?56:40,f=Dr(n,u),m=Dr(n,h),v=n.int(2,3),p=n.int(10,16),g=n.range(.015,.03),S=1.3,x=.72,w=.32,E=s.createImageData(e,e),b=E.data;for(let T=0;T<e;T++){const C=T/e;for(let y=0;y<e;y++){const _=y/e,R=Ir(f,u,_,C,v,S,2),D=Math.min(.999,Math.max(0,C+R*g)),N=D*d,z=Math.floor(N),B=N-z,V=Math.min(1,Math.max(0,(B-(1-w))/w)),j=V*V*(3-2*V),Y=l[(z%l.length+l.length)%l.length],J=l[((z+1)%l.length+l.length)%l.length],k=eo(Y,J,j),$=WP(c,D),at=1+Ir(m,h,_,C,p,p*1.6,3)*.14,X=(T*e+y)*4;b[X]=Ou(($.r+(k.r-$.r)*x)*at),b[X+1]=Ou(($.g+(k.g-$.g)*x)*at),b[X+2]=Ou(($.b+(k.b-$.b)*x)*at),b[X+3]=255}}if(s.putImageData(E,0,0),n()<.4){const T=n.range(.35,.75)*e,C=n.range(.35,.65)*e,y=n.range(.05,.09)*e,_=`#${t.accent.toString(16).padStart(6,"0")}`,R=s.createRadialGradient(T,C,0,T,C,y);R.addColorStop(0,_),R.addColorStop(.55,_),R.addColorStop(1,"rgba(0,0,0,0)"),s.globalAlpha=.55,s.fillStyle=R,s.beginPath(),s.ellipse(T,C,y,y*.62,0,0,Math.PI*2),s.fill(),s.globalAlpha=1}return Za(o,s,.4),Ya(o,s,r),Vo(o)}function Om(n,t){return t?new Se(n,32,24):new Se(n,24,16)}function Mo(n,t,e,i){n.geos.push(t),n.mats.push(e),i&&n.texs.push(i)}function VP(n){for(const t of n.geos)t.dispose();for(const t of n.mats)t.dispose();for(const t of n.texs)t.dispose()}const XP=`
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`,YP=`
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float ndotv = dot(normalize(vNormal), normalize(vViewDir));
    // Symmetric rim: 1 at the grazing silhouette (ndotv≈0) on EITHER
    // hemisphere, falling to 0 at both the direct-facing near pole (ndotv=1,
    // dead centre of the visible disc) and the hidden far pole (ndotv=-1).
    float rim = clamp(1.0 - abs(ndotv), 0.0, 1.0);
    // Steep power => the glow is only appreciable in a thin band right at
    // the tangent and has already decayed to ~0 a modest way inward (over
    // the core's own limb-darkened edge) and outward (before the shell's own
    // silhouette), so neither side hard-cuts.
    float fresnel = pow(rim, uPower);
    float alpha = fresnel * uIntensity;
    // Desaturate toward white at peak brightness so the line reads as a
    // glow, not a saturated painted stroke.
    vec3 color = mix(uColor, vec3(1.0), fresnel * 0.6);
    gl_FragColor = vec4(color, alpha);
  }
`;function Um(n,t,e,i,o){const s=t*(1+o.range(.1,.14)),r=new Se(s,28,20),a=new de({uniforms:{uColor:{value:new St(e)},uIntensity:{value:o.range(.35,.5)},uPower:{value:o.range(3,4)}},vertexShader:XP,fragmentShader:YP,transparent:!0,side:me,depthWrite:!1,blending:Ae,toneMapped:!1}),c=new L(r,a);c.name="atmosphere",n.add(c),Mo(i,r,a)}function F1(n,t,e,i,o){const s=new Bt;s.name=`body-${t}`;const r={geos:[],mats:[],texs:[]},a=e>=50,c=a?1024:256;let l="Unknown",d="unclassified";const u=n.range(.01,.04),h=Om(e,a);if(t==="GAS_GIANT"||t==="RINGED"){const g=i??n.int(0,Dm.length-1),S=Dm[g],x=GP(n,S,c,o),w=new lt({map:x}),E=new L(h,w);if(E.name="body-core",s.add(E),Mo(r,h,w,x),Um(s,e,S.accent,r,n),l=t==="RINGED"?"Ringed Giant":"Gas Giant — Class III",d="hydrogen, helium, ammonia",t==="RINGED"){const b=HP(n,256),T=new Xn(e*1.4,e*2.3,64),C=new lt({map:b,transparent:!0,depthWrite:!1,side:me,opacity:.85}),y=new L(T,C);y.rotation.x=-Math.PI/2+n.range(.2,.5),y.name="ring",s.add(y),Mo(r,T,C,b)}}else if(t==="ROCKY"){const g=FP(n,c),S=new lt({map:g}),x=new L(h,S);x.name="body-core",s.add(x),Mo(r,h,S,g),l="Rocky / Terrestrial",d="silicate, iron oxide"}else if(t==="ICE"){const g=zP(n,c),S=new lt({map:g}),x=new L(h,S);x.name="body-core",s.add(x),Mo(r,h,S,g),a&&Um(s,e,OP,r,n),l="Ice World",d="water ice, ammonia"}else if(t==="LAVA"){const g=BP(n,c),S=new lt({map:g}),x=new L(h,S);x.name="body-core",s.add(x),Mo(r,h,S,g);const w=U1(n,c),E=Om(e*1.001,a),b=new lt({map:w,transparent:!0,depthWrite:!1,blending:Ae,toneMapped:!1}),T=new L(E,b);T.name="lava-cracks",s.add(T),Mo(r,E,b,w),l="Volcanic",d="basalt, sulfur"}else{const g=kP(n,c),S=new lt({map:g}),x=new L(h,S);x.name="body-core",s.add(x),Mo(r,h,S,g),l="Moon",d="silicate, regolith"}const f={name:NP(n),class:l,composition:d},m=s.children.filter(g=>g.name==="body-core"||g.name==="lava-cracks");function v(g){for(const S of m)S.rotation.y+=u*g}function p(){VP(r)}return{group:s,tick:v,dispose:p,scan:f}}const Fm=new Lt,zm=new He,Bm=new M,Hm=new M,Hi=new M,km=new He;function qP(n){const t=new zr(1,0),e=t.attributes.position;for(let i=0;i<e.count;i++){const o=1+n.signed(.28);e.setXYZ(i,e.getX(i)*o,e.getY(i)*o,e.getZ(i)*o)}return t.computeVertexNormals(),t}function ZP(n){const t=n.int(60,140),e=qP(n),i=new lt({color:16777215}),o=new tn(e,i,t);o.name="asteroid-field";const s=new St;for(let v=0;v<t;v++){const p=n.range(.45,.95);s.setRGB(p*.62,p*.55,p*.48),o.setColorAt(v,s)}o.instanceColor&&(o.instanceColor.needsUpdate=!0);const r=n.range(11,18),a=new Float32Array(t*3),c=new Float32Array(t),l=new Float32Array(t*3),d=new Float32Array(t),u=new Float32Array(t);for(let v=0;v<t;v++){const p=n.signed(400),g=n.signed(200),S=-700+n.signed(300);a[v*3]=p,a[v*3+1]=g,a[v*3+2]=S,c[v]=n.range(1.5,6),Hi.set(n.signed(1),n.signed(1),n.signed(1)),Hi.lengthSq()<1e-4&&Hi.set(0,1,0),Hi.normalize(),l[v*3]=Hi.x,l[v*3+1]=Hi.y,l[v*3+2]=Hi.z,d[v]=n.range(.2,1.2),u[v]=n.range(0,Math.PI*2)}function h(){for(let v=0;v<t;v++){Bm.set(a[v*3],a[v*3+1],a[v*3+2]),Hi.set(l[v*3],l[v*3+1],l[v*3+2]),km.setFromAxisAngle(Hi,u[v]),zm.copy(km);const p=c[v];Hm.set(p,p,p),Fm.compose(Bm,zm,Hm),o.setMatrixAt(v,Fm)}o.instanceMatrix.needsUpdate=!0}h();function f(v){for(let p=0;p<t;p++)a[p*3+2]+=r*v,u[p]+=d[p]*v;h()}function m(){e.dispose(),i.dispose(),o.dispose()}return{mesh:o,tick:f,dispose:m}}const Wm=[["#5b3a6e","#8a4a6e"],["#1a3a5c","#46e0d8"],["#7A2C1F","#C7641E"]];function KP(n,t){const i=document.createElement("canvas");i.width=256,i.height=256;const o=i.getContext("2d");if(!o)throw new Error("2d context unavailable");o.clearRect(0,0,256,256);const s=n.int(4,7);for(let a=0;a<s;a++){const c=n.range(.3,.7)*256,l=n.range(.3,.7)*256,d=n.range(.25,.5)*256,u=o.createRadialGradient(c,l,0,c,l,d),h=t[a%t.length];u.addColorStop(0,h),u.addColorStop(1,"rgba(0,0,0,0)"),o.globalAlpha=n.range(.5,.9),o.fillStyle=u,o.beginPath(),o.arc(c,l,d,0,Math.PI*2),o.fill()}o.globalAlpha=1;const r=new yt(i);return r.colorSpace=Ke,r}function jP(n){const t=new Bt;t.name="event-comet";const e=n.range(4,8),i=new Se(e,16,12),o=new lt({color:13625074,toneMapped:!1}),s=new L(i,o);t.add(s);const r=n.int(90,150),a=new Float32Array(r*3),c=new Float32Array(r);for(let m=0;m<r;m++){const v=m/r;a[m*3]=n.signed(e*.6+v*e*2),a[m*3+1]=n.signed(e*.6+v*e*2),a[m*3+2]=e+v*e*14,c[m]=(1-v)*n.range(3,7)+1}const l=new ce;l.setAttribute("position",new re(a,3)),l.setAttribute("size",new re(c,1));const d=new Ts({color:13625074,size:4,transparent:!0,opacity:.5,depthWrite:!1,blending:Ae,sizeAttenuation:!0,toneMapped:!1}),u=new io(l,d);t.add(u),t.rotation.z=n.signed(.5);function h(m){}function f(){i.dispose(),o.dispose(),l.dispose(),d.dispose()}return{group:t,driftSpeed:n.range(30,45),tick:h,dispose:f}}function JP(n){const t=new Bt;t.name="event-nebula";const e=Wm[n.int(0,Wm.length-1)],i=n.int(2,3),o=[],s=[];for(let c=0;c<i;c++){const l=KP(n,e),d=new rd({map:l,transparent:!0,opacity:n.range(.1,.18),depthWrite:!1,blending:Ae,toneMapped:!1}),u=new jh(d),h=n.range(600,1100);u.scale.set(h,h,1),u.position.set(n.signed(400),n.signed(250),n.signed(150)),t.add(u),o.push(l),s.push(d)}function r(c){}function a(){for(const c of o)c.dispose();for(const c of s)c.dispose()}return{group:t,driftSpeed:n.range(2,5),tick:r,dispose:a}}function QP(n){const t=new Bt;t.name="event-derelict";const e=new Gt({color:1842722}),i=[],o=new U(n.range(3,5),n.range(3,5),n.range(5,8));t.add(new L(o,e)),i.push(o);for(const v of[-1,1]){const p=new U(n.range(6,9),.2,n.range(2.5,4)),g=new L(p,e);g.position.set(v*n.range(5,7),0,0),t.add(g),i.push(p)}const s=new wt(.15,.15,n.range(3,5),6),r=new L(s,e);r.position.set(0,n.range(2.5,4),0),t.add(r),i.push(s);const a=new Se(.5,8,6),c=new lt({color:13067294,transparent:!0,opacity:1,toneMapped:!1}),l=new L(a,c);l.position.set(0,2.2,-3.5),t.add(l),i.push(a);const d=new M(n.signed(1),n.signed(1),n.signed(1)).normalize(),u=n.range(.1,.4);let h=n.range(0,10);function f(v){h+=v,t.rotateOnAxis(d,u*v),c.opacity=.35+.65*(.5+.5*Math.sin(h*3))}function m(){for(const v of i)v.dispose();e.dispose(),c.dispose()}return{group:t,driftSpeed:n.range(9,14),tick:f,dispose:m}}function $P(n,t){return t==="COMET"?jP(n):t==="NEBULA"?JP(n):QP(n)}const Uu=500,t5=-1500,e5=200,n5=["GAS_GIANT","ROCKY","ICE","LAVA","RINGED","MOON"],i5=[34,22,14,10,14,6],o5=["MOON","ROCKY","ICE"],s5=[55,30,15];function r5(n,t){const i=24-(n-60)/80*15;return Math.max(9,Math.min(24,i+t.signed(2)))}function a5(n,t){n.position.set(t.range(-700,700),t.range(-260,320),t.range(-1900,-1600))}function Bh(n,t={}){const e=t.kind??n5[n.pick(i5)],i=t.radius??n.range(60,140),o=F1(n,e,i,t.familyIndex,t.lightU);return t.at?o.group.position.copy(t.at):a5(o.group,n),{kind:"body",role:"HERO",body:o,vx:t.vx??n.signed(1.4),vy:t.vy??n.signed(1),driftSpeed:t.driftSpeed??r5(i,n),radius:i}}function c5(n){const t=Bh(n,{kind:"GAS_GIANT",radius:120,familyIndex:1,at:new M(-165,30,-710),driftSpeed:6,vx:0,vy:0,lightU:.25}),e=Bh(n,{kind:"RINGED",radius:80,at:new M(640,30,-120),driftSpeed:4,vx:0,vy:0,lightU:.25});return[t,e]}function l5(n){const t=o5[n.pick(s5)],e=t==="MOON"?n.range(8,18):n.range(10,40),i=F1(n,t,e),o=(n()<.5?-1:1)*n.range(380,700),s=n.range(-260,320)+(n()<.5?-1:1)*120;return i.group.position.set(o,s,n.range(-1900,-1600)),{kind:"body",role:"AMBIENT",body:i,vx:n.signed(2),vy:n.signed(1.6),driftSpeed:n.range(14,24),radius:e}}function d5(n){return{kind:"field",field:ZP(n)}}function u5(n,t){const e=$P(n,t),i=t==="NEBULA"?n.range(-1900,-1700):t==="DERELICT"?-1200:n.range(-1700,-1500);return e.group.position.set(n.range(-500,500),n.range(-200,300),i),{kind:"event",event:e}}const Gm=new M;function h5(n,t){if(n.kind==="body"){const i=n.body.group;return i.position.z+=n.driftSpeed*t,i.position.x+=n.vx*t,i.position.y+=n.vy*t,n.body.tick(t),i.position.z>Uu}if(n.kind==="field")return n.field.tick(t),n.field.mesh.computeBoundingBox(),n.field.mesh.boundingBox?(n.field.mesh.boundingBox.getCenter(Gm),Gm.z>Uu):!1;const e=n.event.group;return e.position.z+=n.event.driftSpeed*t,n.event.tick(t),e.position.z>Uu+200}function f5(n){n.kind==="body"?n.body.dispose():n.kind==="field"?n.field.dispose():n.event.dispose()}function Vm(n){return n.kind==="body"?n.body.group:n.kind==="field"?n.field.mesh:n.event.group}function p5(n){return n.body.group.position.z}const m5=3e3,g5=-1500,Xm=.25,Ym=14,qm=7,v5=1,x5=2,S5=4,_5=new M(0,1.5,-22.5),M5=new M(280,150,-1700),w5=["COMET","NEBULA","DERELICT"],y5=[40,30,30];function b5(n,t){const e=Oe(t?.seed),i=new Bt;i.name="space-director",n.add(i);const o=vf({count:4500,xHalf:1500,yHalf:900,zMin:g5,span:m5,sizeMin:.48,sizeMax:2.3,spherical:!0,rand:e});o.name="starfield-far",n.add(o);const s=N1(n),r=RP(e,M5);n.add(r.sprite);const a=[];let c=!1;const l={nextHeroSpawnAt:0,nextAmbientSpawnAt:0,nextAsteroidAt:e.range(180,320),nextEventAt:e.range(220,400)};let d=-1,u=0;function h(_){a.push(_),i.add(Vm(_))}function f(_){const R=a[_];i.remove(Vm(R)),f5(R),a.splice(_,1)}function m(_){let R=0;for(const D of a)D.kind==="body"&&D.role===_&&R++;return R}function v(){let _=0;for(const R of a)R.kind==="body"&&_++;return _}function p(){return a.some(_=>_.kind==="field")}function g(){return a.some(_=>_.kind==="event")}function S(){for(const _ of c5(e))h(_);c=!0}function x(_){if(v()>=qm)return;if(!c){S(),l.nextHeroSpawnAt=_+e.range(60,110);return}(m("HERO")<v5||_>=l.nextHeroSpawnAt)&&(h(Bh(e)),l.nextHeroSpawnAt=_+e.range(60,110))}function w(_){if(v()>=qm)return;const R=m("AMBIENT");R>=S5||!(R<x5||_>=l.nextAmbientSpawnAt)||(h(l5(e)),l.nextAmbientSpawnAt=_+e.range(25,45))}function E(_){p()||_<l.nextAsteroidAt||(h(d5(e)),l.nextAsteroidAt=_+e.range(180,320))}function b(_){if(g()||_<l.nextEventAt)return;const R=w5[e.pick(y5)];h(u5(e,R)),l.nextEventAt=_+e.range(220,400)}function T(_){d<0&&(d=_);const R=Math.min(Math.max(_-d,0),.1);d=_,u+=Ym*Xm*R,xf(o,_,u),s.tick(Ym*Xm*R),r.tick(_);for(let D=a.length-1;D>=0;D--)h5(a[D],R)&&f(D);x(_),w(_),E(_),b(_)}function C(){let _=null,R=1/0;for(const D of a){if(D.kind!=="body"||D.role!=="HERO")continue;const N=p5(D);if(N<t5||N>e5)continue;const z=D.body.group.position.distanceTo(_5);z<R&&(R=z,_=D)}return _?{name:_.body.scan.name,class:_.body.scan.class,composition:_.body.scan.composition,distanceKm:Math.round(R)}:null}function y(){for(let _=a.length-1;_>=0;_--)f(_);n.remove(i),n.remove(o),I1(o),s.dispose(),n.remove(r.sprite),r.dispose()}return{tick:T,getScanData:C,dispose:y,group:i}}const aa=16769728;function Zm(n){Oa||mv||(n.castShadow=!0,n.shadow.mapSize.set(2048,2048),n.shadow.camera.near=.5,n.shadow.camera.far=8,n.shadow.bias=-3e-4,n.shadow.normalBias=.02)}function T5(n){const t=new Ha(16771536,1514016,.05);n.add(t);const e=new Yy(16773344,.03);n.add(e);const i=new De(4645080,3,1.5,2);i.position.set(0,1.15,-24.38),n.add(i);const o=new De(aa,7,8,2);o.position.set(0,1.9,-24.1),n.add(o);const s=new e0(aa,4.8,8,1.1,.4,2);s.position.set(0,2.5,-16),s.target.position.set(0,0,-16),n.add(s),n.add(s.target),Zm(s);const r=new De(16767408,2.6,5,2);r.position.set(-4,2.2,-16),n.add(r);const a=new De(16767408,2.6,5,2);a.position.set(4,2.2,-16),n.add(a);const c=new De(aa,3.2,5,2);c.position.set(0,2.4,-8.5),n.add(c);const l=new e0(aa,5.2,7,.7,.45,2);l.position.set(2,2.75,-1.4),l.target.position.set(2.6,1.15,-1.4),n.add(l),n.add(l.target),Zm(l);const d=new De(16734754,3.4,10,2);d.position.set(0,1.85,5.5),n.add(d);const u=new L(new qt(.001,.001),new lt({visible:!1}));u.position.set(0,2.4,5.5),u.onBeforeRender=()=>{const m=performance.now()/1e3;d.intensity=3.4+Math.sin(m*2.1)*1},n.add(u);const h=new De(aa,2,5,2);h.position.set(0,2.4,-19),n.add(h);const f=new De(15265522,5.6,8.5,2);return f.position.set(0,4.2,13.5),n.add(f),{hemi:t,ambient:e,cockpitPt:i,cockpitWarmPt:o,junctionSpot:s,qPortPt:r,qStbdPt:a,corridorPt:c,galleySpot:l,reactorSpot:d,thresholdPt:h,cargoPt:f}}function E5(n){let t=n;for(;t;){const e=t.name.toLowerCase();if(e.includes("seat")||e.includes("console")||e.includes("reactor")||e.includes("crate")||e.includes("table")||e.includes("bench")||e.includes("bunk")||e.includes("locker")||e.includes("catwalk")||e.includes("lever")||e.includes("rail")||e.includes("pillar")||e.includes("cabinet")||e.includes("nightstand"))return!0;t=t.parent}return!1}function A5(n,t){return{minX:n.minX+t.x,minY:n.minY+t.y,minZ:n.minZ+t.z,maxX:n.maxX+t.x,maxY:n.maxY+t.y,maxZ:n.maxZ+t.z}}function C5(n){if(!Oa)for(const t of n)t.traverse(e=>{e instanceof L&&(e.receiveShadow=!0,e.castShadow=E5(e))})}function R5(n){const t=[{module:lE(),worldPos:new M(0,0,-22.5)},{module:UE(),worldPos:new M(0,0,-12)},{module:$C(),worldPos:new M(-4,0,-16)},{module:tR(),worldPos:new M(4,0,-16)},{module:eR(),worldPos:new M(0,0,-1)},{module:MR(),worldPos:new M(0,0,5.5)},{module:VR(),worldPos:new M(0,0,13.5)},{module:mP(),worldPos:new M(0,0,21.5)}],e=[],i=[],o=[];for(const{module:u,worldPos:h}of t){u.group.position.copy(h),n.add(u.group),o.push(u.group);for(const f of u.colliders)e.push(A5(f,h));for(const f of u.cameras){const m=f.position.clone().add(h),v=f.lookAt.clone().add(h);rs(f.name,m,v)}for(const f of u.interactables)f.position.add(h),i.push(f)}const s=[{id:"cockpit-aft",position:new M(0,0,-20),facing:"Z"},{id:"corridor-quarters-a",position:new M(-1.5,0,-16),facing:"X"},{id:"corridor-quarters-b",position:new M(1.5,0,-16),facing:"X"},{id:"corridor-galley",position:new M(0,0,-7),facing:"Z"},{id:"galley-engineering",position:new M(0,0,-1),facing:"Z"},{id:"engineering-cargo",position:new M(0,0,9),facing:"Z"},{id:"cargo-annex",position:new M(0,0,18),facing:"Z"}];FC(n,s);const r=yP();n.add(r);const a=b5(n,{seed:22343}),c=TP(a);n.add(c.mesh),rs("porthole-space",new M(5.8,1.6,-16),new M(20,1.6,-16)),rs("qa-doorway",new M(0,1.7,-10),new M(0,2.6,-7)),rs("qa-porthole-oblique",new M(.8,1.5,-10.8),new M(-1.5,1.45,-9)),rs("qa-jitter-a",new M(0,1.6,-11),new M(0,1.9,-7)),rs("qa-jitter-b",new M(.02,1.6,-11),new M(0,1.9,-7)),T5(n);let l=performance.now();const d=new L(new qt(.001,.001),new lt({visible:!1}));return d.position.set(0,0,0),d.onBeforeRender=()=>{const u=performance.now(),h=Math.min((u-l)/1e3,.05);l=u,OC(h)},n.add(d),C5(o),{groups:o,colliders:e,interactables:i,planet:c,starfield:r}}let Km=0;function P5(n,t){const e=.2*Math.PI/180,i=Math.sin(t*.23)*e+Math.sin(t*.11+.7)*e*.4;n.rotateZ(i-Km),Km=i}function Ge(n,t,e){return new M(n,t,e)}const L5={"cockpit-aft":Ge(0,1.1,-20),"corridor-quarters-a":Ge(-2.5,1.1,-16),"corridor-quarters-b":Ge(2.5,1.1,-16),"corridor-galley":Ge(0,1.1,-7),"galley-engineering":Ge(0,1.1,-.3),"engineering-cargo":Ge(0,1.1,9),"cargo-annex":Ge(0,1.1,18)};function D5(){return Wo.map(n=>{const t=L5[n.id]??Ge(0,1.1,0);return{id:n.id,prompt:"Open Door",radius:1.5,position:t.clone(),getPrompt(){return kl(n.id)?"Close Door":"Open Door"},onInteract(e){const i=kl(n.id);ff(n.id,!i),Ee("door"),NC(n.id)}}})}function I5(){return[{id:"seat-port",interactPos:Ge(-.9,1,-22.2),anchorPos:Ge(-.9,.53,-22.2),lookAt:Ge(0,1.55,-25),eyeH:1.15},{id:"seat-starboard",interactPos:Ge(.9,1,-22.2),anchorPos:Ge(.9,.53,-22.2),lookAt:Ge(0,1.55,-25),eyeH:1.15},{id:"bench-fore",interactPos:Ge(-1.1,.8,-2.085),anchorPos:Ge(-1.1,.44,-2.085),lookAt:Ge(-1.1,.78,-1.4),eyeH:1.1},{id:"bench-aft",interactPos:Ge(-1.1,.8,-.715),anchorPos:Ge(-1.1,.44,-.715),lookAt:Ge(-1.1,.78,-1.4),eyeH:1.1}].map(({id:t,interactPos:e,anchorPos:i,lookAt:o,eyeH:s})=>({id:t,prompt:"Sit",radius:1.8,position:e.clone(),onInteract(r){Xe().seated||(Ee("ui"),A3(i,o,s))}}))}const N5=["NAV","SYSTEMS","PLANET SCAN"];function O5(n){return n===0?VC():n===1?GC():kC()}let os=null;function U5(){return{id:"console-bank",prompt:"Access Console",radius:2.2,position:Ge(0,1,-24.98),onInteract(n){Ee("ui");const e=(Xe().consoleMode+1)%3;r0(e),Qn(`CONSOLE — ${N5[e]}`,O5(e)),os&&window.removeEventListener("keydown",os),os=i=>{i.code==="Escape"&&(Nl(),r0(0),os&&(window.removeEventListener("keydown",os),os=null))},window.addEventListener("keydown",os)}}}const z1=.8;let ls=!1,Xl=!1;function B1(){if(!Xl)return;Ee("ui");const n=["Cycle 1887. Deck plate 7-C replaced (stress fracture).","Previous patch: tape and hope. Not crew-rated.","",'Note from prior shift: "If you are reading this,','the crate worked. Do not move the crate."',"","— J. Okafor, Chief Engineer, STREL-7"];No()===0?(fd("panelRead"),hd(),Ee("quest-start"),Qn("MAINTENANCE LOG — STREL-7",[...n,"","[SYSTEM] Anomaly logged. Investigate reactor breaker — engineering."]),en("ANOMALY DETECTED")):Qn("MAINTENANCE LOG — STREL-7",n)}function F5(){ls=!0,Xl=!0;const n=M1();return n&&(n.position.x=z1),B1(),No()}function z5(){let n=null;function t(){if(!n){const o=M1();n=df(400,s=>{o&&(o.position.x=s*z1)})}return n}const e={id:"crate-b",prompt:"Slide Crate",radius:2,position:new M(-1.45,.21,5.2),getPrompt(){return ls?"Slide Crate Back":"Slide Crate"},onInteract(o){Ee("ui"),ls=!ls,t().start(ls?0:1,ls?1:0),ls&&(Xl=!0)}},i={id:"hidden-floor-panel",prompt:"Inspect Panel",radius:1.5,position:new M(-1.45,.01,5.2),getPrompt(){return Xl?"Inspect Panel":""},onInteract(o){B1()}};return[e,i]}function B5(){return[...D5(),...I5(),U5(),...YC(),ZC(),JC(),QC(),XC(),...z5()]}const Na={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Xo{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const H5=new iv(-1,1,1,-1,0,1);class k5 extends ce{constructor(){super(),this.setAttribute("position",new oe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new oe([0,2,0,0,2,0],2))}}const W5=new k5;class Ka{constructor(t){this._mesh=new L(W5,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,H5)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class H1 extends Xo{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof de?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Wn.clone(t.uniforms),this.material=new de({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Ka(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class jm extends Xo{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const o=t.getContext(),s=t.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let r,a;this.inverse?(r=0,a=1):(r=1,a=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(o.REPLACE,o.REPLACE,o.REPLACE),s.buffers.stencil.setFunc(o.ALWAYS,r,4294967295),s.buffers.stencil.setClear(a),s.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(o.EQUAL,1,4294967295),s.buffers.stencil.setOp(o.KEEP,o.KEEP,o.KEEP),s.buffers.stencil.setLocked(!0)}}class G5 extends Xo{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class V5{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new rt);this._width=i.width,this._height=i.height,e=new wn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Gn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new H1(Na),this.copyPass.material.blending=pn,this.clock=new qy}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let o=0,s=this.passes.length;o<s;o++){const r=this.passes[o];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(o),r.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),r.needsSwap){if(i){const a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}jm!==void 0&&(r instanceof jm?i=!0:r instanceof G5&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new rt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,o=this._height*this._pixelRatio;this.renderTarget1.setSize(i,o),this.renderTarget2.setSize(i,o);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,o)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class X5 extends Xo{constructor(t,e,i=null,o=null,s=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=o,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new St}render(t,e,i){const o=t.autoClear;t.autoClear=!1;let s,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(s=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),t.autoClear=o}}const Y5={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new St(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Nr extends Xo{constructor(t,e,i,o){super(),this.strength=e!==void 0?e:1,this.radius=i,this.threshold=o,this.resolution=t!==void 0?new rt(t.x,t.y):new rt(256,256),this.clearColor=new St(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new wn(s,r,{type:Gn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const h=new wn(s,r,{type:Gn});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const f=new wn(s,r,{type:Gn});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),r=Math.round(r/2)}const a=Y5;this.highPassUniforms=Wn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=o,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new de({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];s=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new rt(1/s,1/r),s=Math.round(s/2),r=Math.round(r/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new M(1,1,1),new M(1,1,1),new M(1,1,1),new M(1,1,1),new M(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const d=Na;this.copyUniforms=Wn.clone(d.uniforms),this.blendMaterial=new de({uniforms:this.copyUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,blending:Ae,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new St,this.oldClearAlpha=1,this.basic=new lt,this.fsQuad=new Ka(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),o=Math.round(e/2);this.renderTargetBright.setSize(i,o);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,o),this.renderTargetsVertical[s].setSize(i,o),this.separableBlurMaterials[s].uniforms.invSize.value=new rt(1/i,1/o),i=Math.round(i/2),o=Math.round(o/2)}render(t,e,i,o,s){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const r=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),s&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let a=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[c].uniforms.direction.value=Nr.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Nr.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this.fsQuad.render(t),a=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(i),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=r}getSeperableBlurMaterial(t){const e=[];for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(t*t))/t);return new de({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new rt(.5,.5)},direction:{value:new rt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new de({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Nr.BlurDirectionX=new rt(1,0);Nr.BlurDirectionY=new rt(0,1);const q5={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = OptimizedCineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Z5 extends Xo{constructor(){super();const t=q5;this.uniforms=Wn.clone(t.uniforms),this.material=new Wy({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Ka(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ve.getTransfer(this._outputColorSpace)===Ce&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ig?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ng?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Og?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Wh?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ug?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Fg&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const qc={defines:{SMAA_THRESHOLD:"0.1"},uniforms:{tDiffuse:{value:null},resolution:{value:new rt(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		void SMAAEdgeDetectionVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAAEdgeDetectionVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

			// Calculate color deltas:
			vec4 delta;
			vec3 C = texture2D( colorTex, texcoord ).rgb;

			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
			vec3 t = abs( C - Cleft );
			delta.x = max( max( t.r, t.g ), t.b );

			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
			t = abs( C - Ctop );
			delta.y = max( max( t.r, t.g ), t.b );

			// We do the usual threshold:
			vec2 edges = step( threshold, delta.xy );

			// Then discard if there is no edge:
			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
				discard;

			// Calculate right and bottom deltas:
			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
			t = abs( C - Cright );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
			t = abs( C - Cbottom );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the maximum delta in the direct neighborhood:
			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

			// Calculate left-left and top-top deltas:
			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
			t = abs( C - Cleftleft );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
			t = abs( C - Ctoptop );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the final maximum delta:
			maxDelta = max( max( maxDelta, delta.z ), delta.w );

			// Local contrast adaptation in action:
			edges.xy *= step( 0.5 * maxDelta, delta.xy );

			return vec4( edges, 0.0, 0.0 );
		}

		void main() {

			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

		}`},Zc={defines:{SMAA_MAX_SEARCH_STEPS:"8",SMAA_AREATEX_MAX_DISTANCE:"16",SMAA_AREATEX_PIXEL_SIZE:"( 1.0 / vec2( 160.0, 560.0 ) )",SMAA_AREATEX_SUBTEX_SIZE:"( 1.0 / 7.0 )"},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new rt(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];
		varying vec2 vPixcoord;

		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
			vPixcoord = texcoord / resolution;

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

		}

		void main() {

			vUv = uv;

			SMAABlendingWeightCalculationVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

		uniform sampler2D tDiffuse;
		uniform sampler2D tArea;
		uniform sampler2D tSearch;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[3];
		varying vec2 vPixcoord;

		#if __VERSION__ == 100
		vec2 round( vec2 x ) {
			return sign( x ) * floor( abs( x ) + 0.5 );
		}
		#endif

		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			e.r = bias + e.r * scale;
			return 255.0 * texture2D( searchTex, e, 0.0 ).r;
		}

		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			/**
				* @PSEUDO_GATHER4
				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
				* sample between edge, thus fetching four edges in a row.
				* Sampling with different offsets in each direction allows to disambiguate
				* which edges are active from the four fetched ones.
				*/
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			// We correct the previous (-0.25, -0.125) offset we applied:
			texcoord.x += 0.25 * resolution.x;

			// The searches are bias by 1, so adjust the coords accordingly:
			texcoord.x += resolution.x;

			// Disambiguate the length added by the last step:
			texcoord.x += 2.0 * resolution.x; // Undo last step
			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

			return texcoord.x;
		}

		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			texcoord.x -= 0.25 * resolution.x;
			texcoord.x -= resolution.x;
			texcoord.x -= 2.0 * resolution.x;
			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

			return texcoord.x;
		}

		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y; // WebGL port note: Changed sign
			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y; // WebGL port note: Changed sign
			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
			// Rounding prevents precision errors of bilinear filtering:
			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

			// We do a scale and bias for mapping to texel space:
			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

			// Move to proper place, according to the subpixel offset:
			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

			return texture2D( areaTex, texcoord, 0.0 ).rg;
		}

		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

			vec2 e = texture2D( edgesTex, texcoord ).rg;

			if ( e.g > 0.0 ) { // Edge at north
				vec2 d;

				// Find the distance to the left:
				vec2 coords;
				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				d.x = coords.x;

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				float e1 = texture2D( edgesTex, coords, 0.0 ).r;

				// Find the distance to the right:
				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
				d.y = coords.x;

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				d = d / resolution.x - pixcoord.x;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the right crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
			}

			if ( e.r > 0.0 ) { // Edge at west
				vec2 d;

				// Find the distance to the top:
				vec2 coords;

				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
				d.x = coords.y;

				// Fetch the top crossing edges:
				float e1 = texture2D( edgesTex, coords, 0.0 ).g;

				// Find the distance to the bottom:
				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
				d.y = coords.y;

				// We want the distances to be in pixel units:
				d = d / resolution.y - pixcoord.y;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the bottom crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

				// Get the area for this direction:
				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
			}

			return weights;
		}

		void main() {

			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

		}`},Fu={uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new rt(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAANeighborhoodBlendingVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform sampler2D tColor;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
			// Fetch the blending weights for current pixel:
			vec4 a;
			a.xz = texture2D( blendTex, texcoord ).xz;
			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

			// Is there any blending weight with a value greater than 0.0?
			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
				return texture2D( colorTex, texcoord, 0.0 );
			} else {
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				vec2 offset;
				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
					offset.y = 0.0;
				} else {
					offset.x = 0.0;
				}

				// Fetch the opposite color and lerp by hand:
				vec4 C = texture2D( colorTex, texcoord, 0.0 );
				texcoord += sign( offset ) * resolution;
				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

				// WebGL port note: Added gamma correction
				C.xyz = pow(C.xyz, vec3(2.2));
				Cop.xyz = pow(Cop.xyz, vec3(2.2));
				vec4 mixed = mix(C, Cop, s);
				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

				return mixed;
			}
		}

		void main() {

			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

		}`};class K5 extends Xo{constructor(t,e){super(),this.edgesRT=new wn(t,e,{depthBuffer:!1,type:Gn}),this.edgesRT.texture.name="SMAAPass.edges",this.weightsRT=new wn(t,e,{depthBuffer:!1,type:Gn}),this.weightsRT.texture.name="SMAAPass.weights";const i=this,o=new Image;o.src=this.getAreaTexture(),o.onload=function(){i.areaTexture.needsUpdate=!0},this.areaTexture=new un,this.areaTexture.name="SMAAPass.area",this.areaTexture.image=o,this.areaTexture.minFilter=On,this.areaTexture.generateMipmaps=!1,this.areaTexture.flipY=!1;const s=new Image;s.src=this.getSearchTexture(),s.onload=function(){i.searchTexture.needsUpdate=!0},this.searchTexture=new un,this.searchTexture.name="SMAAPass.search",this.searchTexture.image=s,this.searchTexture.magFilter=dn,this.searchTexture.minFilter=dn,this.searchTexture.generateMipmaps=!1,this.searchTexture.flipY=!1,this.uniformsEdges=Wn.clone(qc.uniforms),this.uniformsEdges.resolution.value.set(1/t,1/e),this.materialEdges=new de({defines:Object.assign({},qc.defines),uniforms:this.uniformsEdges,vertexShader:qc.vertexShader,fragmentShader:qc.fragmentShader}),this.uniformsWeights=Wn.clone(Zc.uniforms),this.uniformsWeights.resolution.value.set(1/t,1/e),this.uniformsWeights.tDiffuse.value=this.edgesRT.texture,this.uniformsWeights.tArea.value=this.areaTexture,this.uniformsWeights.tSearch.value=this.searchTexture,this.materialWeights=new de({defines:Object.assign({},Zc.defines),uniforms:this.uniformsWeights,vertexShader:Zc.vertexShader,fragmentShader:Zc.fragmentShader}),this.uniformsBlend=Wn.clone(Fu.uniforms),this.uniformsBlend.resolution.value.set(1/t,1/e),this.uniformsBlend.tDiffuse.value=this.weightsRT.texture,this.materialBlend=new de({uniforms:this.uniformsBlend,vertexShader:Fu.vertexShader,fragmentShader:Fu.fragmentShader}),this.fsQuad=new Ka(null)}render(t,e,i){this.uniformsEdges.tDiffuse.value=i.texture,this.fsQuad.material=this.materialEdges,t.setRenderTarget(this.edgesRT),this.clear&&t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.materialWeights,t.setRenderTarget(this.weightsRT),this.clear&&t.clear(),this.fsQuad.render(t),this.uniformsBlend.tColor.value=i.texture,this.fsQuad.material=this.materialBlend,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}setSize(t,e){this.edgesRT.setSize(t,e),this.weightsRT.setSize(t,e),this.materialEdges.uniforms.resolution.value.set(1/t,1/e),this.materialWeights.uniforms.resolution.value.set(1/t,1/e),this.materialBlend.uniforms.resolution.value.set(1/t,1/e)}getAreaTexture(){return"data:image/png;base64,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"}getSearchTexture(){return"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII="}dispose(){this.edgesRT.dispose(),this.weightsRT.dispose(),this.areaTexture.dispose(),this.searchTexture.dispose(),this.materialEdges.dispose(),this.materialWeights.dispose(),this.materialBlend.dispose(),this.fsQuad.dispose()}}const Kc={defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new rt},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new Lt},cameraProjectionMatrixInverse:{value:new Lt},cameraWorldMatrix:{value:new Lt},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new M(-1,-1,-1)},sceneBoxMax:{value:new M(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;		
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif
		
		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {  
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {   
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}
		
		void main() {
			float depth = getDepth(vUv.xy);
			if (depth >= 1.0) {
				discard;
				return;
			}
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif
			
			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0, totalWeight = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {
				
				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w); 
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));
				
				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));
				
				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);	

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}		

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);		
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},jc={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},zu={uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function j5(n=5){const t=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),e=J5(t),i=e.length,o=new Uint8Array(i*4);for(let r=0;r<i;++r){const a=e[r],c=2*Math.PI*a/i,l=new M(Math.cos(c),Math.sin(c),0).normalize();o[r*4]=(l.x*.5+.5)*255,o[r*4+1]=(l.y*.5+.5)*255,o[r*4+2]=127,o[r*4+3]=255}const s=new Jh(o,t,t);return s.wrapS=Dt,s.wrapT=Dt,s.needsUpdate=!0,s}function J5(n){const t=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),e=t*t,i=Array(e).fill(0);let o=Math.floor(t/2),s=t-1;for(let r=1;r<=e;){if(o===-1&&s===t?(s=t-2,o=0):(s===t&&(s=0),o<0&&(o=t-1)),i[o*t+s]!==0){s-=2,o++;continue}else i[o*t+s]=r++;s++,o--}return i}const Jc={defines:{SAMPLES:16,SAMPLE_VECTORS:k1(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new rt},cameraProjectionMatrixInverse:{value:new Lt},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;
		
		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}
		
		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1    
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1    
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);
			
			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;
		
			denoised += w * neighborColor;
			totalWeight += w;
		}
		
		void main() {
			float depth = getDepth(vUv.xy);	
			vec3 viewNormal = getViewNormal(vUv);	
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);
		
			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}
		
			if (totalWeight > 0.) { 
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function k1(n,t,e){const i=Q5(n,t,e);let o="vec3[SAMPLES](";for(let s=0;s<n;s++){const r=i[s];o+=`vec3(${r.x}, ${r.y}, ${r.z})${s<n-1?",":")"}`}return o}function Q5(n,t,e){const i=[];for(let o=0;o<n;o++){const s=2*Math.PI*t*o/n,r=Math.pow(o/(n-1),e);i.push(new M(Math.cos(s),Math.sin(s),r))}return i}class $5{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(t,e,i){return t[0]*e+t[1]*i}dot3(t,e,i,o){return t[0]*e+t[1]*i+t[2]*o}dot4(t,e,i,o,s){return t[0]*e+t[1]*i+t[2]*o+t[3]*s}noise(t,e){let i,o,s;const r=.5*(Math.sqrt(3)-1),a=(t+e)*r,c=Math.floor(t+a),l=Math.floor(e+a),d=(3-Math.sqrt(3))/6,u=(c+l)*d,h=c-u,f=l-u,m=t-h,v=e-f;let p,g;m>v?(p=1,g=0):(p=0,g=1);const S=m-p+d,x=v-g+d,w=m-1+2*d,E=v-1+2*d,b=c&255,T=l&255,C=this.perm[b+this.perm[T]]%12,y=this.perm[b+p+this.perm[T+g]]%12,_=this.perm[b+1+this.perm[T+1]]%12;let R=.5-m*m-v*v;R<0?i=0:(R*=R,i=R*R*this.dot(this.grad3[C],m,v));let D=.5-S*S-x*x;D<0?o=0:(D*=D,o=D*D*this.dot(this.grad3[y],S,x));let N=.5-w*w-E*E;return N<0?s=0:(N*=N,s=N*N*this.dot(this.grad3[_],w,E)),70*(i+o+s)}noise3d(t,e,i){let o,s,r,a;const l=(t+e+i)*.3333333333333333,d=Math.floor(t+l),u=Math.floor(e+l),h=Math.floor(i+l),f=1/6,m=(d+u+h)*f,v=d-m,p=u-m,g=h-m,S=t-v,x=e-p,w=i-g;let E,b,T,C,y,_;S>=x?x>=w?(E=1,b=0,T=0,C=1,y=1,_=0):S>=w?(E=1,b=0,T=0,C=1,y=0,_=1):(E=0,b=0,T=1,C=1,y=0,_=1):x<w?(E=0,b=0,T=1,C=0,y=1,_=1):S<w?(E=0,b=1,T=0,C=0,y=1,_=1):(E=0,b=1,T=0,C=1,y=1,_=0);const R=S-E+f,D=x-b+f,N=w-T+f,z=S-C+2*f,B=x-y+2*f,V=w-_+2*f,j=S-1+3*f,Y=x-1+3*f,J=w-1+3*f,k=d&255,$=u&255,mt=h&255,at=this.perm[k+this.perm[$+this.perm[mt]]]%12,X=this.perm[k+E+this.perm[$+b+this.perm[mt+T]]]%12,tt=this.perm[k+C+this.perm[$+y+this.perm[mt+_]]]%12,ft=this.perm[k+1+this.perm[$+1+this.perm[mt+1]]]%12;let ot=.6-S*S-x*x-w*w;ot<0?o=0:(ot*=ot,o=ot*ot*this.dot3(this.grad3[at],S,x,w));let Nt=.6-R*R-D*D-N*N;Nt<0?s=0:(Nt*=Nt,s=Nt*Nt*this.dot3(this.grad3[X],R,D,N));let Et=.6-z*z-B*B-V*V;Et<0?r=0:(Et*=Et,r=Et*Et*this.dot3(this.grad3[tt],z,B,V));let Vt=.6-j*j-Y*Y-J*J;return Vt<0?a=0:(Vt*=Vt,a=Vt*Vt*this.dot3(this.grad3[ft],j,Y,J)),32*(o+s+r+a)}noise4d(t,e,i,o){const s=this.grad4,r=this.simplex,a=this.perm,c=(Math.sqrt(5)-1)/4,l=(5-Math.sqrt(5))/20;let d,u,h,f,m;const v=(t+e+i+o)*c,p=Math.floor(t+v),g=Math.floor(e+v),S=Math.floor(i+v),x=Math.floor(o+v),w=(p+g+S+x)*l,E=p-w,b=g-w,T=S-w,C=x-w,y=t-E,_=e-b,R=i-T,D=o-C,N=y>_?32:0,z=y>R?16:0,B=_>R?8:0,V=y>D?4:0,j=_>D?2:0,Y=R>D?1:0,J=N+z+B+V+j+Y,k=r[J][0]>=3?1:0,$=r[J][1]>=3?1:0,mt=r[J][2]>=3?1:0,at=r[J][3]>=3?1:0,X=r[J][0]>=2?1:0,tt=r[J][1]>=2?1:0,ft=r[J][2]>=2?1:0,ot=r[J][3]>=2?1:0,Nt=r[J][0]>=1?1:0,Et=r[J][1]>=1?1:0,Vt=r[J][2]>=1?1:0,O=r[J][3]>=1?1:0,Ut=y-k+l,Rt=_-$+l,ie=R-mt+l,bt=D-at+l,Kt=y-X+2*l,Ht=_-tt+2*l,zt=R-ft+2*l,_e=D-ot+2*l,I=y-Nt+3*l,A=_-Et+3*l,W=R-Vt+3*l,K=D-O+3*l,nt=y-1+4*l,it=_-1+4*l,At=R-1+4*l,gt=D-1+4*l,pt=p&255,kt=g&255,ct=S&255,st=x&255,Pt=a[pt+a[kt+a[ct+a[st]]]]%32,_t=a[pt+k+a[kt+$+a[ct+mt+a[st+at]]]]%32,ut=a[pt+X+a[kt+tt+a[ct+ft+a[st+ot]]]]%32,Xt=a[pt+Nt+a[kt+Et+a[ct+Vt+a[st+O]]]]%32,jt=a[pt+1+a[kt+1+a[ct+1+a[st+1]]]]%32;let he=.6-y*y-_*_-R*R-D*D;he<0?d=0:(he*=he,d=he*he*this.dot4(s[Pt],y,_,R,D));let F=.6-Ut*Ut-Rt*Rt-ie*ie-bt*bt;F<0?u=0:(F*=F,u=F*F*this.dot4(s[_t],Ut,Rt,ie,bt));let vt=.6-Kt*Kt-Ht*Ht-zt*zt-_e*_e;vt<0?h=0:(vt*=vt,h=vt*vt*this.dot4(s[ut],Kt,Ht,zt,_e));let Q=.6-I*I-A*A-W*W-K*K;Q<0?f=0:(Q*=Q,f=Q*Q*this.dot4(s[Xt],I,A,W,K));let et=.6-nt*nt-it*it-At*At-gt*gt;return et<0?m=0:(et*=et,m=et*et*this.dot4(s[jt],nt,it,At,gt)),27*(d+u+h+f+m)}}class Nn extends Xo{constructor(t,e,i,o,s,r,a){super(),this.width=i!==void 0?i:512,this.height=o!==void 0?o:512,this.clear=!0,this.camera=e,this.scene=t,this.output=0,this._renderGBuffer=!0,this._visibilityCache=new Map,this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=j5(),this.pdNoiseTexture=this.generateNoise(),this.gtaoRenderTarget=new wn(this.width,this.height,{type:Gn}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new de({defines:Object.assign({},Kc.defines),uniforms:Wn.clone(Kc.uniforms),vertexShader:Kc.vertexShader,fragmentShader:Kc.fragmentShader,blending:pn,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Gy,this.normalMaterial.blending=pn,this.pdMaterial=new de({defines:Object.assign({},Jc.defines),uniforms:Wn.clone(Jc.uniforms),vertexShader:Jc.vertexShader,fragmentShader:Jc.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new de({defines:Object.assign({},jc.defines),uniforms:Wn.clone(jc.uniforms),vertexShader:jc.vertexShader,fragmentShader:jc.fragmentShader,blending:pn}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new de({uniforms:Wn.clone(Na.uniforms),vertexShader:Na.vertexShader,fragmentShader:Na.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:th,blendDst:da,blendEquation:di,blendSrcAlpha:$u,blendDstAlpha:da,blendEquationAlpha:di}),this.blendMaterial=new de({uniforms:Wn.clone(zu.uniforms),vertexShader:zu.vertexShader,fragmentShader:zu.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Dg,blendSrc:th,blendDst:da,blendEquation:di,blendSrcAlpha:$u,blendDstAlpha:da,blendEquationAlpha:di}),this.fsQuad=new Ka(null),this.originalClearColor=new St,this.setGBuffer(s?s.depthTexture:void 0,s?s.normalTexture:void 0),r!==void 0&&this.updateGtaoMaterial(r),a!==void 0&&this.updatePdMaterial(a)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(t,e){t!==void 0?(this.depthTexture=t,this.normalTexture=e,this._renderGBuffer=!1):(this.depthTexture=new Kh,this.depthTexture.format=Ss,this.depthTexture.type=xs,this.normalRenderTarget=new wn(this.width,this.height,{minFilter:dn,magFilter:dn,type:Gn,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);const i=this.normalTexture?1:0,o=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=i,this.gtaoMaterial.defines.DEPTH_SWIZZLING=o,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=i,this.pdMaterial.defines.DEPTH_SWIZZLING=o,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(t){t?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(t.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(t.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(t){t.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=t.radius),t.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=t.distanceExponent),t.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=t.thickness),t.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=t.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),t.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=t.scale),t.samples!==void 0&&t.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=t.samples,this.gtaoMaterial.needsUpdate=!0),t.screenSpaceRadius!==void 0&&(t.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=t.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(t){let e=!1;t.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=t.lumaPhi),t.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=t.depthPhi),t.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=t.normalPhi),t.radius!==void 0&&t.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=t.radius),t.radiusExponent!==void 0&&t.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=t.radiusExponent,e=!0),t.rings!==void 0&&t.rings!==this.pdRings&&(this.pdRings=t.rings,e=!0),t.samples!==void 0&&t.samples!==this.pdSamples&&(this.pdSamples=t.samples,e=!0),e&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=k1(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,e,i){switch(this._renderGBuffer&&(this.overrideVisibility(),this.renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this.restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this.renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case Nn.OUTPUT.Off:break;case Nn.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=pn,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case Nn.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=pn,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case Nn.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=pn,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case Nn.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:e);break;case Nn.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=pn,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case Nn.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=pn,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:e),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.renderPass(t,this.blendMaterial,this.renderToScreen?null:e);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}renderPass(t,e,i,o,s){t.getClearColor(this.originalClearColor);const r=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(i),t.autoClear=!1,o!=null&&(t.setClearColor(o),t.setClearAlpha(s||0),t.clear()),this.fsQuad.material=e,this.fsQuad.render(t),t.autoClear=a,t.setClearColor(this.originalClearColor),t.setClearAlpha(r)}renderOverride(t,e,i,o,s){t.getClearColor(this.originalClearColor);const r=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(i),t.autoClear=!1,o=e.clearColor||o,s=e.clearAlpha||s,o!=null&&(t.setClearColor(o),t.setClearAlpha(s||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=a,t.setClearColor(this.originalClearColor),t.setClearAlpha(r)}setSize(t,e){this.width=t,this.height=e,this.gtaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.pdRenderTarget.setSize(t,e),this.gtaoMaterial.uniforms.resolution.value.set(t,e),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(t,e),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}overrideVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(i){e.set(i,i.visible),(i.isPoints||i.isLine)&&(i.visible=!1)})}restoreVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(i){const o=e.get(i);i.visible=o}),e.clear()}generateNoise(t=64){const e=new $5,i=t*t*4,o=new Uint8Array(i);for(let r=0;r<t;r++)for(let a=0;a<t;a++){const c=r,l=a;o[(r*t+a)*4]=(e.noise(c,l)*.5+.5)*255,o[(r*t+a)*4+1]=(e.noise(c+t,l)*.5+.5)*255,o[(r*t+a)*4+2]=(e.noise(c,l+t)*.5+.5)*255,o[(r*t+a)*4+3]=(e.noise(c+t,l+t)*.5+.5)*255}const s=new Jh(o,t,t,fi,to);return s.wrapS=Dt,s.wrapT=Dt,s.needsUpdate=!0,s}}Nn.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};const tL=.3,eL=1.5,nL=.8,iL=1,oL=1,sL=16,rL=.75;function aL(n,t,e,i,o){const s=new Nn(n,t,e,i);return s.updateGtaoMaterial({radius:tL,distanceExponent:eL,thickness:nL,distanceFallOff:iL,scale:oL,samples:sL}),s.blendIntensity=rL,s.output=o?Nn.OUTPUT.Denoise:Nn.OUTPUT.Default,{pass:s,setOnlyView(r){s.output=r?Nn.OUTPUT.Denoise:Nn.OUTPUT.Default}}}const cL=2,lL=.12,dL=.018,uL={name:"VignetteGrainShader",uniforms:{tDiffuse:{value:null},uFalloff:{value:cL},uStrength:{value:lL},uTime:{value:0},uGrainAmount:{value:dL}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uFalloff;
    uniform float uStrength;
    uniform float uTime;
    uniform float uGrainAmount;
    varying vec2 vUv;

    // Cheap hash-based pseudo-random value — no noise texture needed.
    float grainHash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      // Vignette — distance from centre in UV space, corner = 1.0.
      vec2 cuv = vUv - 0.5;
      float dist = length(cuv) * 1.4142;
      float vignette = 1.0 - uStrength * pow(dist, uFalloff);
      vec3 shaded = color.rgb * vignette;

      // Animated film grain — luminance-weighted (stronger in shadow,
      // fades out toward highlights so it never reads on bright walls/HUD-
      // adjacent glass). Screen-space hash + time offset so the pattern
      // changes every frame instead of looking like a printed static overlay.
      float luma = dot(shaded, vec3(0.299, 0.587, 0.114));
      float shadowWeight = 1.0 - smoothstep(0.0, 0.6, luma);
      float n = grainHash(gl_FragCoord.xy + vec2(uTime * 131.7, uTime * 71.3)) * 2.0 - 1.0;
      shaded += n * uGrainAmount * shadowWeight;

      gl_FragColor = vec4(shaded, color.a);
    }
  `},hL=.84,fL=.6,pL=.65;function mL(n,t,e){const i=new URLSearchParams(window.location.search),o=i.get("bloom")!=="0",s=i.get("ssao"),r=i.get("ao"),a=s==="0"||r==="0",c=s==="only"||r==="only",l=!Oa&&!a,d=!Oa&&i.get("aa")!=="0",u=i.get("grain")!=="0";if(!(o||l)){let x=t;return{render(){n.render(x,e)},resize(w,E){},setScene(w){x=w},dispose(){},enabled:!1}}const f=new V5(n),m=new X5(t,e);f.addPass(m);let v=null;if(l){const x=window.innerWidth,w=window.innerHeight;v=aL(t,e,x,w,c),f.addPass(v.pass)}let p=null;if(o){const x=new rt(window.innerWidth,window.innerHeight);p=new Nr(x,fL,pL,hL),f.addPass(p)}f.addPass(new Z5);let g=null;d&&(g=new K5(window.innerWidth,window.innerHeight),f.addPass(g));const S=new H1(uL);return u||(S.material.uniforms.uGrainAmount.value=0),f.addPass(S),{render(){S.material.uniforms.uTime.value=performance.now()/1e3,f.render()},resize(x,w){f.setSize(x,w),p&&p.resolution.set(x,w)},setScene(x){m.scene=x,v&&(v.pass.scene=x)},dispose(){for(const x of f.passes)x.dispose();f.dispose()},enabled:o}}const Jm=64,Qm=3,gL=4,Bu=24;function yr(n){const t=n.segments??96,e=Oe(n.seed),i=Dr(e,Jm),o=n.radius*2,s=n.maxHeight>1e-6?n.maxHeight:1,r=(v,p)=>{const g=v/o+.5,S=p/o+.5;return(Ir(i,Jm,g,S,Qm,Qm,gL)*.5+.5)*n.maxHeight},a=new qt(o,o,t,t);a.rotateX(-Math.PI/2);const c=a.attributes.position,l=new Float32Array(c.count*3),d=Vn(n.colorRamp.low),u=Vn(n.colorRamp.mid),h=Vn(n.colorRamp.high);for(let v=0;v<c.count;v++){const p=c.getX(v),g=c.getZ(v),S=r(p,g);c.setY(v,S);const x=Math.max(0,Math.min(1,S/s)),w=x<.5?eo(d,u,x*2):eo(u,h,(x-.5)*2);l[v*3]=w.r/255,l[v*3+1]=w.g/255,l[v*3+2]=w.b/255}c.needsUpdate=!0,a.setAttribute("color",new re(l,3)),a.computeVertexNormals();const f=new Ft({vertexColors:!0,roughness:.95,metalness:0,map:n.texture??null}),m=new L(a,f);return m.name="terrain",m.receiveShadow=!0,{mesh:m,groundHeight:r,boundaryColliders:vL(n.radius)}}function vL(n){const t=[],i=2*n*Math.sin(Math.PI/Bu)*.9;for(let o=0;o<Bu;o++){const s=o/Bu*Math.PI*2,r=Math.cos(s)*n,a=Math.sin(s)*n;t.push({minX:r-i,maxX:r+i,minY:-2,maxY:6,minZ:a-i,maxZ:a+i})}return t}const $m=new Lt,tg=new M;class Qi{mesh;used=0;nodes=[];constructor(t,e,i){this.mesh=new tn(t,e,i),this.mesh.instanceMatrix.setUsage(e2),this.mesh.frustumCulled=!1,this.mesh.castShadow=!0}allocNode(t,e,i,o){const s=new ye;return s.position.copy(e),s.scale.copy(i),o&&s.rotation.copy(o),t.add(s),this.nodes[this.used]=s,this.used++,s}allocFree(){return this.nodes[this.used]=null,this.used++}setPose(t,e,i,o,s,r){tg.set(o,s,r),$m.compose(e,i,tg),this.mesh.setMatrixAt(t,$m)}finalize(){this.mesh.count=this.used}sync(){for(let t=0;t<this.used;t++){const e=this.nodes[t];e&&this.mesh.setMatrixAt(t,e.matrixWorld)}this.mesh.instanceMatrix.needsUpdate=!0}dispose(){this.mesh.dispose()}}function wo(n,t,e,i){return t+(n-t)*Math.exp(-e*i)}function xL(n,t,e,i,o){const s=1+2*o*i,r=i*i,a=o*r,c=o*a,l=1/(s+c);return[(s*n+o*t+c*e)*l,(t+a*(e-n))*l]}function eg(n,t){return n.lengthSq()>t*t?n.setLength(t):n}function ng(n){let t=n|0;return t=Math.imul(t^t>>>15,2246822519)>>>0,t=Math.imul(t^t>>>13,3266489917)>>>0,t=(t^t>>>16)>>>0,t/4294967296}function bi(n){const t=Math.floor(n),e=n-t,i=e*e*(3-2*e),o=ng(t),s=ng(t+1);return(o+(s-o)*i)*2-1}class SL{constructor(t,e,i,o){this.segLen=t,this.omega0=e,this.pos=Array.from({length:i},()=>o.clone()),this.vel=Array.from({length:i},()=>new M)}pos;vel;update(t,e){let i=t;const o=["x","y","z"];for(let s=0;s<this.pos.length;s++){const r=this.omega0*(1-.5*s/this.pos.length);for(const c of o){const[l,d]=xL(this.pos[s][c],this.vel[s][c],i[c],r,e);this.pos[s][c]=l,this.vel[s][c]=d}const a=this.pos[s].clone().sub(i);a.lengthSq()>1e-8&&this.pos[s].copy(i).add(a.setLength(this.segLen)),i=this.pos[s]}}}const _L=new M(0,1,0),So=new M,ig=new M,Hu=new M,og=new He;class ML{constructor(t,e,i,o,s){this.anchor=t,this.baseLocal=e,this.segs=i,this.anchor.localToWorld(So.copy(e)),this.chain=new SL(i.segLen,o,i.slots.length,So),this.noiseSeed=s}chain;noiseSeed;update(t,e,i){this.anchor.localToWorld(So.copy(this.baseLocal)),So.x+=bi(t*3.1+this.noiseSeed)*i,So.y+=bi(t*2.7+this.noiseSeed+50)*i,So.z+=bi(t*3.4+this.noiseSeed+100)*i,this.chain.update(So,e);let o=So;for(let s=0;s<this.segs.slots.length;s++){const r=this.chain.pos[s];ig.copy(o).add(r).multiplyScalar(.5),Hu.copy(r).sub(o);const a=Hu.length();a>1e-5&&og.setFromUnitVectors(_L,Hu.multiplyScalar(1/a));const c=this.segs.radii[s];this.segs.pool.setPose(this.segs.slots[s],ig,og,c,this.segs.segLen,c),o=r}}}function W1(n,t){let e=(t-n)%(Math.PI*2);return e>Math.PI&&(e-=Math.PI*2),e<-Math.PI&&(e+=Math.PI*2),e}function G1(n,t,e,i){return n+W1(n,t)*(1-Math.exp(-e*i))}function ku(n,t=.05){const e=new St(n);return e.r=Math.max(t,e.r),e.g=Math.max(t,e.g),e.b=Math.max(t,e.b),e}function _d(n,t){const e=ku(n.palette.emissive,.02),i=new Ft({color:ku(n.palette.primary),roughness:.58,metalness:.05,emissive:e,emissiveIntensity:.12}),o=new Ft({color:ku(n.palette.secondary),roughness:.5,metalness:.08,emissive:e,emissiveIntensity:.1}),s=new lt({color:16777215,toneMapped:!1}),r=new lt({color:e.clone(),toneMapped:!1});return t.mats.push(i,o,s,r),{body:i,accent:o,mark:s,core:r}}function Md(n){const t=new wt(1,1,1,5,1,!0),e=new Se(1,5,3),i=new Se(1,4,3),o=new wt(1,.7,1,5,1,!0),s=new zo(1,1,6,1,!1);return n.geos.push(t,e,i,o,s),{limb:t,foot:e,mark:i,whip:o,cone:s}}function V1(n,t,e,i,o,s,r,a){const c=new ye;c.position.set(t.x,0,t.z),n.add(c),r.allocNode(c,new M(0,-e*.5,0),new M(s,e,s));const l=new ye;return l.position.y=-e,c.add(l),r.allocNode(l,new M(0,-i*.5,0),new M(s*.82,i,s*.82)),a.allocNode(l,new M(0,-i,0),new M(s*1.15,s*1.15,s*1.15)),{hip:c,knee:l,upper:e,lower:i,reach:o,phase:t.phase,kneeSign:t.kneeSign}}function wd(n,t,e,i,o,s,r,a){const c=i/e,l=[],d=[];for(let u=0;u<e;u++)l.push(a.allocFree()),d.push(o*(1-.65*u/e));return new ML(n,t,{pool:a,slots:l,radii:d,segLen:c},s,r)}const Yl=new Lt,ql=new He,Zl=new M;function Sf(n,t,e,i,o,s,r){const a=new tn(s.mark,r,t),c=[];ql.identity(),Zl.setScalar(o);const l=new M;for(let d=0;d<t;d++){const u=t>1?d/(t-1):.5;l.lerpVectors(e,i,u),Yl.compose(l,ql,Zl),a.setMatrixAt(d,Yl),a.setColorAt(d,r.color),c.push(u)}return a.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),n.add(a),{mesh:a,phases:c,count:t}}function wL(n,t,e,i,o,s,r){const a=new tn(s.mark,r,t),c=[];ql.identity(),Zl.setScalar(o);const l=new M;for(let d=0;d<t;d++){const u=d/t*Math.PI*2;l.set(Math.cos(u)*e,i,Math.sin(u)*e),Yl.compose(l,ql,Zl),a.setMatrixAt(d,Yl),a.setColorAt(d,r.color),c.push(d/t)}return a.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),n.add(a),{mesh:a,phases:c,count:t}}const X1={strideMin:1,strideMax:1,strideGain:0,stepHeight:0,duty:.5};function yL(n,t){const e=n.sizeM,i=_d(n,t),o=Md(t),s=e*.5,r=new Se(s,10,5,0,Math.PI*2,0,Math.PI*.62);t.geos.push(r);const a=new Se(s*.34,6,4);t.geos.push(a);const c=new Ft({color:i.body.color.clone(),emissive:i.body.emissive.clone(),emissiveIntensity:.25,roughness:.35,metalness:0,transparent:!0,opacity:.82,side:me});t.mats.push(c);const l=new Qi(o.whip,i.accent,n.count*7*5);return{pools:[l],assemble(d){const u=Oe((n.seed^61706)+d*71),h=new Bt,f=new Bt;h.add(f);const m=new Bt;f.add(m);const v=new L(r,c);v.castShadow=!0,m.add(v);const p=new L(a,i.core);p.position.y=s*.12,m.add(p);const g=5+u.int(0,2),S=-s*.28,x=s*.85,w=[];for(let T=0;T<g;T++){const C=T/g*Math.PI*2+u.signed(.2);w.push(wd(m,new M(Math.cos(C)*x,S,Math.sin(C)*x),5,e*(.85+u()*.3),s*.09,7,n.seed+d*29+T*3&65535,l))}const E=wL(m,8,x*.98,S*.7,e*.05,o,i.mark),b={plan:"floater",body:f,standH:0,legs:[],head:null,whips:w,bell:m,wings:null,markings:E,emissive:i.core.color,gait:X1};return{root:h,rig:b}}}}function bL(n,t){const e=n.sizeM,i=_d(n,t),o=Md(t),s=new ad(e*.14,e*.5,3,7);s.rotateX(Math.PI/2),s.scale(1.15,.45,1),t.geos.push(s);const r=new U(1,1,1);t.geos.push(r);const a=e*.62,c=a*.55,l=a*.45,d=new Qi(o.whip,i.accent,n.count*4);return{pools:[d],assemble(u){const h=new Bt,f=new Bt;h.add(f);const m=new L(s,i.body);m.castShadow=!0,f.add(m);const v=new L(o.cone,i.accent);v.scale.set(e*.09,e*.18,e*.05),v.rotation.x=Math.PI/2,v.position.set(0,0,e*.42),f.add(v);const p=b=>{const T=new ye;T.position.set(b*e*.12,0,e*.02),f.add(T);const C=new L(r,i.body);C.scale.set(c,e*.035,e*.46),C.position.set(b*c*.5,0,-e*.04),C.castShadow=!0,T.add(C);const y=new ye;y.position.set(b*c,0,-e*.04),T.add(y);const _=new L(r,i.accent);return _.scale.set(l,e*.028,e*.3),_.position.set(b*l*.5,0,-e*.03),_.castShadow=!0,y.add(_),{rootP:T,outP:y}},g=p(-1),S=p(1),x=wd(f,new M(0,0,-e*.42),4,e*.7,e*.045,8,n.seed+u*17&65535,d),w=Sf(f,5,new M(0,e*.05,e*.34),new M(0,e*.05,-e*.38),e*.035,o,i.mark),E={plan:"glider",body:f,standH:0,legs:[],head:null,whips:[x],bell:null,wings:{l:g.rootP,r:S.rootP,lOut:g.outP,rOut:S.outP},markings:w,emissive:i.core.color,gait:X1};return{root:h,rig:E}}}}function TL(n,t,e){const i=new ad(n,t,3,7);return i.rotateX(Math.PI/2),e.geos.push(i),i}function EL(n,t){const e=n.sizeM,i=n.count,o=_d(n,t),s=Md(t),r=e*.16,a=e*.5,c=TL(r,a,t),l=new Se(e*.13,7,6);t.geos.push(l);const d=e*.21,u=e*.21,h=(d+u)*.8,f=h,m=gn.clamp(1.2/Math.max(n.gaitHz,.2),.35,2),v={strideMin:e*.28*m,strideMax:e*.62*m,strideGain:.55*m,stepHeight:e*.13,duty:.55},p=a*.5+r,g=r*.95,S=[{x:-g,z:p*.62,phase:0,kneeSign:1},{x:g,z:p*.62,phase:.5,kneeSign:1},{x:-g,z:-p*.62,phase:.5,kneeSign:-1},{x:g,z:-p*.62,phase:0,kneeSign:-1}],x=new Qi(s.limb,o.body,i*8),w=new Qi(s.foot,o.accent,i*4),E=new Qi(s.cone,o.accent,i*3),b=new Qi(s.whip,o.body,i*5);return{pools:[x,w,E,b],assemble(T){const C=Oe((n.seed^40503)+T*101),y=new Bt,_=new Bt;_.position.y=f,y.add(_);const R=new L(c,o.body);R.castShadow=!0,_.add(R);const D=new Bt;D.position.set(0,r*.5+e*.14,p-r*.2);const N=new L(l,o.body);N.castShadow=!0,D.add(N),E.allocNode(D,new M(0,-e*.02,e*.12),new M(e*.06,e*.16,e*.06),new Je(Math.PI/2,0,0));const z=C()<.5;for(const J of[-1,1])z?E.allocNode(D,new M(J*e*.05,e*.11,e*.02),new M(e*.03,e*.11,e*.03),new Je(0,0,-J*.3)):E.allocNode(D,new M(J*e*.07,e*.08,-e*.02),new M(e*.025,e*.09,e*.05),new Je(-.5,0,-J*.5));_.add(D);const B=S.map(J=>V1(_,J,d,u,h,r*.36,x,w)),V=wd(_,new M(0,r*.4,-p+r*.2),5,e*.5,r*.5,9,n.seed+T*7&65535,b),j=Sf(_,5,new M(0,r*.9,p*.5),new M(0,r*.9,-p*.75),e*.045,s,o.mark),Y={plan:"quadruped",body:_,standH:f,legs:B,head:D,whips:[V],bell:null,wings:null,markings:j,emissive:o.core.color,gait:v};return{root:y,rig:Y}}}}function AL(n,t){const e=n.sizeM,i=n.count,o=_d(n,t),s=Md(t),r=e*.28,a=new Se(1,9,6);t.geos.push(a);const c=e*.2,l=e*.2,d=(c+l)*.62,u=d,h=gn.clamp(1.2/Math.max(n.gaitHz,.2),.35,2),f={strideMin:e*.2*h,strideMax:e*.5*h,strideGain:.6*h,stepHeight:e*.1,duty:.6},m=r*1.05,v=[{x:-m,z:r*1.1,phase:0,kneeSign:1},{x:m,z:r*1.1,phase:.5,kneeSign:1},{x:-m,z:0,phase:.5,kneeSign:1},{x:m,z:0,phase:0,kneeSign:1},{x:-m,z:-r*1.1,phase:0,kneeSign:-1},{x:m,z:-r*1.1,phase:.5,kneeSign:-1}],p=new Qi(s.limb,o.body,i*12),g=new Qi(s.foot,o.accent,i*6),S=new Qi(s.whip,o.accent,i*8);return{pools:[p,g,S],assemble(x){const w=new Bt,E=new Bt;E.position.y=u,w.add(E);const b=new L(a,o.body);b.scale.set(r*1.15,r*.6,r*1.45),b.castShadow=!0,E.add(b);const T=new Bt;T.position.set(0,r*.2,r*1.4);const C=new L(s.foot,o.accent);C.scale.setScalar(r*.4),T.add(C),E.add(T);const y=v.map(N=>V1(E,N,c,l,d,r*.16,p,g)),_=[];for(const N of[-1,1])_.push(wd(T,new M(N*r*.25,r*.3,r*.2),4,e*.34,r*.12,16,(n.seed+x*13^(N>0?7:3))&65535,S));const R=Sf(E,4,new M(0,r*.5,r*1.1),new M(0,r*.5,-r*1.2),e*.05,s,o.mark),D={plan:"skitterer",body:E,standH:u,legs:y,head:T,whips:_,bell:null,wings:null,markings:R,emissive:o.core.color,gait:f};return{root:w,rig:D}}}}function CL(n,t){switch(n.plan){case"quadruped":return EL(n,t);case"skitterer":return AL(n,t);case"floater":return yL(n,t);case"glider":return bL(n,t)}}const sg=6,RL=10.5,PL=8,rg=3,LL=2.1,DL=10.5,IL=1.7,NL=.6;function OL(n){const t=n.sizeM;let e,i;switch(n.plan){case"quadruped":e=.9*t,i=.13;break;case"skitterer":e=1.5*t,i=.3;break;case"floater":e=.35,i=.08;break;case"glider":e=2.4,i=.1;break}const o=e*.55;return{maxSpeed:e,maxForce:o,wanderFreq:i,wanderStrength:o*.85,neighborR:Math.max(4,t*4),wCohesion:.25,wAlign:.5,wSeparation:1.3,fleeRange:4,drag:.9,deadZone:.015}}const Tn=new M,xi=new M,ag=new M,yo=new M,pa=new M,_l=new M;function UL(n,t){return Math.hypot(t.x-n.pos.x,t.z-n.pos.z)}function Qc(n,t,e,i){return e+(.5+.5*bi(n.seed*.37+t*.7))*(i-e)}function cg(n){n.fsm!=="FLEE"&&(n.startle=NL),n.fsm="FLEE"}function FL(n,t,e){const i=n.temperament;switch(n.fsm){case"IDLE":case"WANDER":if(i==="skittish"&&t<sg){cg(n);return}if(i==="curious"&&t<PL){n.fsm="CURIOUS";return}n.fsmTimer<=0&&(n.fsm==="IDLE"?(n.fsm="WANDER",n.fsmTimer=Qc(n,e,7,16)):(n.fsm="IDLE",n.fsmTimer=Qc(n,e,2.5,5.5)));return;case"FLEE":t>RL&&(n.fsm="WANDER",n.fsmTimer=Qc(n,e,7,16));return;case"CURIOUS":if(i==="skittish"&&t<sg){cg(n);return}t>DL&&(n.fsm="WANDER",n.fsmTimer=Qc(n,e,7,16));return}}function zL(n,t,e){yo.set(0,0,0),pa.set(0,0,0),_l.set(0,0,0);let i=0;for(const o of t){if(o===n)continue;const s=Math.hypot(o.pos.x-n.pos.x,o.pos.z-n.pos.z);s>e||s<1e-5||(yo.x+=o.pos.x,yo.z+=o.pos.z,pa.x+=o.vel.x,pa.z+=o.vel.z,_l.x+=(n.pos.x-o.pos.x)/(s*s),_l.z+=(n.pos.z-o.pos.z)/(s*s),i++)}i>0&&(yo.multiplyScalar(1/i),yo.x-=n.pos.x,yo.z-=n.pos.z,yo.y=0,pa.multiplyScalar(1/i))}function BL(n,t,e,i,o){n.startle=Math.max(0,n.startle-o);const s=n.root.position.y+n.rig.standH+n.spec.sizeM*.25;if(n.rig.plan==="glider"){n.lookTarget.set(n.pos.x+n.vel.x,n.pos.y+n.vel.y,n.pos.z+n.vel.z);return}const r=UL(n,e);n.fsmTimer-=o,FL(n,r,i);const a=n.cfg,c=n.fsm==="FLEE"?IL:1;if(Tn.set(0,0,0),n.fsm==="WANDER"||n.fsm==="FLEE"){const u=a.wanderFreq*(n.fsm==="FLEE"?2:1);Tn.x+=bi(i*u+n.seed)*a.wanderStrength,Tn.z+=bi(i*u+n.seed+100)*a.wanderStrength}if(t.length>1&&(zL(n,t,a.neighborR),(n.fsm==="WANDER"||n.fsm==="FLEE")&&(Tn.addScaledVector(yo,a.wCohesion),Tn.addScaledVector(pa,a.wAlign)),Tn.addScaledVector(_l,a.wSeparation)),n.fsm==="FLEE"){const u=Math.exp(-r/a.fleeRange);xi.set(n.pos.x-e.x,0,n.pos.z-e.z).setLength(a.maxSpeed*c).sub(ag.set(n.vel.x,0,n.vel.z)),Tn.addScaledVector(xi,2.5*Math.max(u,.25))}if(n.fsm==="CURIOUS"){const u=r<LL?rg+1.5:rg,h=r-u,f=(e.x-n.pos.x)/Math.max(r,1e-4),m=(e.z-n.pos.z)/Math.max(r,1e-4),v=gn.clamp(h*.8,-a.maxSpeed,a.maxSpeed);xi.set(f*v-n.vel.x,0,m*v-n.vel.z),Tn.addScaledVector(xi,1.2)}const l=Math.hypot(n.pos.x-n.center.x,n.pos.z-n.center.z);if(l>n.roamRadius){const u=(l-n.roamRadius)/n.roamRadius;xi.set(n.center.x-n.pos.x,0,n.center.z-n.pos.z).setLength(a.maxSpeed).sub(ag.set(n.vel.x,0,n.vel.z)),Tn.addScaledVector(xi,Math.min(2,u*2.5))}Tn.y=0,eg(Tn,a.maxForce*c),Tn.lengthSq()<a.deadZone*a.deadZone&&Tn.set(0,0,0),n.vel.x+=Tn.x*o,n.vel.z+=Tn.z*o;const d=Math.exp(-a.drag*o);if(n.vel.x*=d,n.vel.z*=d,xi.set(n.vel.x,0,n.vel.z),eg(xi,a.maxSpeed*c),n.vel.x=xi.x,n.vel.z=xi.z,n.pos.x+=n.vel.x*o,n.pos.z+=n.vel.z*o,n.fsm==="CURIOUS"||n.fsm==="IDLE"&&r<7)n.lookTarget.set(e.x,e.y,e.z);else if(n.fsm==="IDLE"){const u=n.yaw+bi(i*.23+n.seed*1.7)*1.2;n.lookTarget.set(n.pos.x+Math.sin(u)*3,s+bi(i*.17+n.seed)*.5,n.pos.z+Math.cos(u)*3)}else{const u=Math.max(Math.hypot(n.vel.x,n.vel.z),.2);n.lookTarget.set(n.pos.x+n.vel.x/u*3,s,n.pos.z+n.vel.z/u*3)}}const tr=.15,ki=new M,ca=new M,ma=new M,Wu=new M,HL=new Lt;function Y1(n,t){return Math.min(t.strideMax,t.strideMin+t.strideGain*n)}function kL(n,t,e,i){return(n+t*e/Y1(t,i))%1}function WL(n,t,e){const i=(n%1+1)%1;if(i<e.duty){const s=i/e.duty;return[t*(.5-s),0]}const o=(i-e.duty)/(1-e.duty);return[t*(-.5+o),e.stepHeight*Math.sin(Math.PI*o)]}const lg=n=>Math.min(1,Math.max(-1,n));function GL(n,t,e){const i=n.upper,o=n.lower,s=Math.min(Math.hypot(t,e),i+o-.001),r=Math.atan2(t,-e),a=Math.acos(lg((i*i+s*s-o*o)/(2*i*s))),c=Math.acos(lg((i*i+o*o-s*s)/(2*i*o)));n.hip.rotation.x=-(r+n.kneeSign*a),n.knee.rotation.x=n.kneeSign*(Math.PI-c)}function VL(n,t,e,i){const o=(n(t+tr,e)-n(t-tr,e))/(2*tr),s=(n(t,e+tr)-n(t,e-tr))/(2*tr);return i.set(-o,1,-s).normalize()}function XL(n,t,e,i){const o=n.rig,s=Math.hypot(n.vel.x,n.vel.z),r=n.spec.sizeM;n.phase=kL(n.phase,s,e,o.gait),n.legBlend=wo(n.legBlend,s>.1?1:0,6,e),s>.05&&(n.yaw=G1(n.yaw,Math.atan2(n.vel.x,n.vel.z),4,e)),n.root.rotation.y=n.yaw;const a=Math.sin(n.yaw),c=Math.cos(n.yaw);let l=0;ki.set(0,0,0);const d=[];for(const S of o.legs){const x=S.hip.position,w=n.pos.x+x.x*c+x.z*a,E=n.pos.z-x.x*a+x.z*c,b=i(w,E);d.push(b),l+=b,ki.add(VL(i,w,E,ma))}l/=o.legs.length,ki.normalize(),n.baseY=wo(n.baseY,l,8,e),n.root.position.set(n.pos.x,n.baseY,n.pos.z);const u=ki.x*c-ki.z*a,h=ki.x*a+ki.z*c;n.pitch=wo(n.pitch,Math.atan2(h,ki.y),5,e),n.roll=wo(n.roll,-Math.atan2(u,ki.y),5,e);const f=n.phase*Math.PI*2,m=o.gait.stepHeight*.16*n.legBlend,v=o.gait.stepHeight*.1*n.legBlend,p=r*.008*(1-n.legBlend)*Math.sin(t*1.7+n.bobPhase);o.body.position.y=o.standH+m*Math.sin(2*f)+p,o.body.position.x=.5*v*Math.cos(f),o.body.rotation.set(n.pitch,0,n.roll+v*2*Math.sin(f));const g=Y1(s,o.gait);for(let S=0;S<o.legs.length;S++){const x=o.legs[S],[w,E]=WL(n.phase+x.phase,g,o.gait),b=d[S]-l,T=w*n.legBlend,C=-(x.reach-E*n.legBlend)+b;GL(x,T,Math.min(C,-.15*x.reach))}o.head&&(n.headLook.x=wo(n.headLook.x,n.lookTarget.x,3,e),n.headLook.y=wo(n.headLook.y,n.lookTarget.y,3,e),n.headLook.z=wo(n.headLook.z,n.lookTarget.z,3,e),o.head.lookAt(n.headLook),o.head.rotation.y=gn.clamp(o.head.rotation.y,-1,1),o.head.rotation.x=gn.clamp(o.head.rotation.x,-.5,.5),o.head.rotation.z=0)}function YL(n){const t=(n%1+1)%1,e=o=>o*o*(3-2*o),i=.3;return t<i?e(t/i):1-e((t-i)/(1-i))}function qL(n,t,e,i){const o=n.rig;n.phase=(n.phase+n.spec.gaitHz*e)%1;const s=YL(n.phase),r=(s-n.jellyCPrev)/Math.max(e,1e-4);n.jellyCPrev=s;const a=i(n.pos.x,n.pos.z),c=a+n.baseY+.4*bi(t*.11+n.seed),l=1.1*n.spec.sizeM;n.jellyVelY+=(Math.max(0,r)*l+(c-n.pos.y)*.35)*e,n.jellyVelY*=Math.exp(-.8*e),n.pos.y=gn.clamp(n.pos.y+n.jellyVelY*e,a+1.2,a+6.5),n.root.position.copy(n.pos),n.yaw=G1(n.yaw,bi(t*.05+n.seed+31)*Math.PI,.5,e),n.root.rotation.y=n.yaw,o.bell&&o.bell.scale.set(1-.35*s,1+.6*.35*s,1-.35*s)}const Gu=2.4,dg=.6;function ZL(n,t,e,i){const o=n.rig,s=n.roamRadius*.85,r=n.roamRadius*.8,a=i(n.center.x,n.center.z)+6,c=1.6,l=n.glideT,d=s*Math.cos(l),u=2*c*Math.cos(2*l),h=r*Math.cos(2*l),f=Math.max(.3,Math.hypot(d,u,h));n.glideT=l+Gu/f*e,n.pos.set(n.center.x+s*Math.sin(l),a+c*Math.sin(2*l),n.center.z+r/2*Math.sin(2*l)),n.vel.set(d,u,h).multiplyScalar(Gu/f),n.root.position.copy(n.pos);const m=Math.atan2(n.vel.x,n.vel.z),v=W1(n.glidePrevYaw,m)/Math.max(e,.001);n.glideTurn=wo(n.glideTurn,v,4,e),n.glidePrevYaw=m,ca.copy(n.vel).normalize();const p=gn.clamp(-.2*n.glideTurn*Gu,-dg,dg);if(ma.set(0,1,0).applyAxisAngle(ca,p),Wu.crossVectors(ca,ma).normalize(),ma.crossVectors(Wu,ca).normalize(),n.root.quaternion.setFromRotationMatrix(HL.makeBasis(Wu,ma,ca.clone().negate())),n.root.rotateY(Math.PI),o.wings){const g=t*Math.PI*2*n.spec.gaitHz+n.bobPhase,S=Math.sin(g)*.26,x=Math.sin(g-.9)*.2;o.wings.l.rotation.z=-S,o.wings.r.rotation.z=S,o.wings.lOut.rotation.z=-x,o.wings.rOut.rotation.z=x}}const $c=new St,KL=new St(1,1,1);function jL(n,t){const e=n.rig.markings,i=n.rig.emissive,o=t*.7+n.seed*.13,s=Math.max(0,Math.min(1,n.startle/.6));for(let r=0;r<e.count;r++){const a=Math.sin((o-e.phases[r])*Math.PI*2),c=.35+1.5*Math.max(0,a)*Math.max(0,a);if($c.copy(i).multiplyScalar(c),s>0){const l=.5+.5*Math.sin(t*42+r*1.7);$c.lerp(KL,s*l),$c.multiplyScalar(1+2.5*s)}e.mesh.setColorAt(r,$c)}e.mesh.instanceColor&&(e.mesh.instanceColor.needsUpdate=!0)}const JL=2.75,QL=.012;function ms(n,t,e){const i=new Bt;i.name="creatures";const o=[],s={geos:[],mats:[]},r=[],a=[];for(const l of n){const d=CL(l,s),u=OL(l),h=[];for(let f=0;f<l.count;f++){const m=Oe(l.seed+f*7919),v=d.assemble(f),p=`${l.id}-${f}`;v.root.name=p,i.add(v.root);let g=0,S=0;for(let _=0;_<6;_++){const R=m()*Math.PI*2,D=Math.sqrt(m())*l.roamRadius*.7;g=e.x+Math.cos(R)*D,S=e.z+Math.sin(R)*D;const N=l.sizeM*1.6;if(h.every(z=>Math.hypot(z.pos.x-g,z.pos.z-S)>N))break}const x=t(g,S),w=2.2+m()*2.3,E=m()*Math.PI*2,b=m()*Math.PI*2,T=l.plan==="quadruped"||l.plan==="skitterer",C={spec:l,root:v.root,rig:v.rig,ia:null,temperament:l.temperament,pos:new M(g,l.plan==="floater"?x+w:x,S),vel:new M,seed:m()*1e3,center:e.clone(),roamRadius:l.roamRadius,cfg:u,phase:m(),legBlend:0,headLook:new M(g,x+v.rig.standH,S+2),lookTarget:new M(g,x+v.rig.standH,S+2),yaw:b,pitch:0,roll:0,fsm:"WANDER",fsmTimer:9+m()*8,startle:0,jellyVelY:0,jellyCPrev:0,bobPhase:m()*Math.PI*2,glideT:E,glideTurn:0,glidePrevYaw:Math.atan2(Math.cos(E),Math.cos(2*E)),baseY:l.plan==="floater"?w:x};C.root.position.set(g,T?x:C.pos.y,S),C.root.rotation.y=b;const y={id:p,prompt:`Scan ${l.scanName}`,radius:JL,position:new M(g,C.root.position.y+v.rig.standH,S),onInteract:()=>{const _=pi(l.id);en(_?`CATALOGUED · ${l.scanName}`:"ALREADY CATALOGUED")}};C.ia=y,o.push(y),h.push(C)}for(const f of d.pools)f.finalize(),i.add(f.mesh);a.push(d.pools),r.push(h)}let c=0;return{group:i,interactables:o,update(l,d){const u=Math.min(l,.03333333333333333);c+=u;for(let h=0;h<r.length;h++){const f=r[h];for(const m of f){switch(BL(m,f,d,c,u),m.rig.plan){case"quadruped":case"skitterer":XL(m,c,u,t);break;case"floater":qL(m,c,u,t);break;case"glider":ZL(m,c,u,t);break}m.root.updateMatrixWorld(!0);const v=QL*m.spec.sizeM;for(const g of m.rig.whips)g.update(c,u,v);jL(m,c);const p=m.rig.plan==="floater"||m.rig.plan==="glider"?0:m.rig.standH;m.ia.position.set(m.root.position.x,m.root.position.y+p,m.root.position.z)}for(const m of a[h])m.sync()}},dispose(){i.traverse(l=>{l.isInstancedMesh&&l.dispose()});for(const l of s.geos)l.dispose();for(const l of s.mats)l.dispose()}}}function $L(){const n=new Fr;n.background=new St(724250),n.fog=new Ur(724250,16,52);const t=yr({seed:3391,radius:30,maxHeight:.12,segments:72,colorRamp:{low:"#12303a",mid:"#1c4a52",high:"#2f6b6b"}});n.add(t.mesh);const e=t.groundHeight,i=new Ha(8378623,657938,.55);n.add(i);const o=new De(4645080,45,90,2);o.position.set(0,9,0),n.add(o);const s=new Xn(29.4,30,96),r=new lt({color:4645080,transparent:!0,opacity:.5,side:me,toneMapped:!1}),a=new L(s,r);a.rotation.x=-Math.PI/2,a.position.y=e(0,0)+.05,n.add(a);const c=new Xn(.85,1.25,40),l=new lt({color:4645080,transparent:!0,opacity:.6,side:me,toneMapped:!1}),d=new L(c,l);d.rotation.x=-Math.PI/2,d.position.set(0,e(0,8)+.03,8),n.add(d);const u=Sd(2.2,2.8);u.mesh.position.set(0,e(0,-6)+1.5,-6),n.add(u.mesh);const h=new U(.6,2.4,.6),f=new Ft({color:2241084,emissive:4645080,emissiveIntensity:.5,roughness:.4,metalness:.1}),m=new L(h,f);m.name="dev-monolith",m.position.set(4,e(4,0)+1.2,0),m.castShadow=!0,n.add(m);const v={id:"dev-monolith",prompt:"Scan MONOLITH",radius:2.6,position:m.position.clone(),onInteract:()=>{const S=pi("dev-monolith");en(S?"CATALOGUED · MONOLITH":"KNOWN · MONOLITH")}},p=[ms([{id:"dev-grazer",scanName:"DUNEGRAZER",lore:"A placid herd-walker of the between.",plan:"quadruped",sizeM:1.4,palette:{primary:"#7a5c3e",secondary:"#d9a066",emissive:"#ffb84d"},gaitHz:1.2,temperament:"placid",count:3,seed:20817,roamRadius:6}],e,new M(-9,0,4)),ms([{id:"dev-skitter",scanName:"GLASSMITE",lore:"Six legs, zero trust.",plan:"skitterer",sizeM:.55,palette:{primary:"#3e4a52",secondary:"#9fd0c8",emissive:"#46e0d8"},gaitHz:2.5,temperament:"skittish",count:3,seed:42919,roamRadius:4.5}],e,new M(10,0,2)),ms([{id:"dev-jelly",scanName:"VOIDMEDUSA",lore:"It breathes the dark and exhales light.",plan:"floater",sizeM:.9,palette:{primary:"#3a6ea5",secondary:"#9fd0ff",emissive:"#7fd8ff"},gaitHz:.45,temperament:"placid",count:2,seed:15420,roamRadius:4}],e,new M(-11,0,-4)),ms([{id:"dev-ray",scanName:"ASHWING",lore:"It writes figure-eights on the sky.",plan:"glider",sizeM:1.6,palette:{primary:"#5c3a66",secondary:"#c9a0dd",emissive:"#d98cff"},gaitHz:.4,temperament:"curious",count:1,seed:57825,roamRadius:8}],e,new M(6,0,-6))];for(const S of p)n.add(S.group);const g=[{name:"dev-void",position:new M(7,1.7,10),lookAt:new M(0,1.3,-3)},{name:"dev-void-qa",position:new M(0,1.7,-2),lookAt:new M(0,1.5,-6)},{name:"dev-void-herd",position:new M(-9,1.2,11),lookAt:new M(-9,.7,4)},{name:"dev-void-menagerie",position:new M(14,4.5,6),lookAt:new M(2,1.5,-5)}];return{id:"dev",scene:n,colliders:[...t.boundaryColliders],interactables:[u.interactable,v,...p.flatMap(S=>S.interactables)],cameras:g,spawn:{position:new M(0,0,8),lookAt:new M(0,1.4,-6)},groundHeight:e,update(S,x){for(const w of p)w.update(S,x)},dispose(){t.mesh.geometry.dispose(),t.mesh.material.dispose(),s.dispose(),r.dispose(),c.dispose(),l.dispose(),h.dispose(),f.dispose(),u.dispose();for(const S of p)S.dispose();n.remove(i,o)}}}const ug=340,tD="#221648",eD="#1c4a46";function nD(){const n=new Se(ug,28,18),t=n.attributes.position,e=new Float32Array(t.count*3),i=Vn(tD),o=Vn(eD);for(let a=0;a<t.count;a++){const c=t.getY(a)/ug,l=Math.max(0,Math.min(1,c*.5+.5)),d=Math.pow(l,1.4),u=eo(o,i,d);e[a*3]=u.r/255,e[a*3+1]=u.g/255,e[a*3+2]=u.b/255}n.setAttribute("color",new re(e,3));const s=new lt({vertexColors:!0,side:je,toneMapped:!0,fog:!1,depthWrite:!1}),r=new L(n,s);return r.name="verdant-sky-dome",r.renderOrder=-10,r}function iD(n,t,e){const o=document.createElement("canvas");o.width=256,o.height=256;const s=o.getContext("2d");s.fillStyle=t,s.fillRect(0,0,256,256);const r=n.int(10,16);for(let h=0;h<r;h++){const f=n()*256,m=n()*256,v=n.range(.04,.12)*256,p=n.range(.18,.34),g=s.createRadialGradient(f,m,0,f,m,v);g.addColorStop(0,`rgba(20,22,30,${p})`),g.addColorStop(.7,`rgba(20,22,30,${p*.4})`),g.addColorStop(.88,`rgba(255,255,255,${p*.35})`),g.addColorStop(1,"rgba(0,0,0,0)"),s.fillStyle=g,s.beginPath(),s.arc(f,m,v,0,Math.PI*2),s.fill()}const a=Vn(e),c=n.int(5,8);for(let h=0;h<c;h++){const f=n()*256,m=n()*256,v=n.range(.1,.22)*256,p=s.createRadialGradient(f,m,0,f,m,v);p.addColorStop(0,`rgba(${a.r},${a.g},${a.b},0.5)`),p.addColorStop(1,`rgba(${a.r},${a.g},${a.b},0)`),s.fillStyle=p,s.beginPath(),s.arc(f,m,v,0,Math.PI*2),s.fill()}const l=n.int(4,6);for(let h=0;h<l;h++){const f=n()*256,m=n.range(.02,.05)*256;s.fillStyle=`rgba(${a.r},${a.g},${a.b},${n.range(.08,.16).toFixed(3)})`,s.fillRect(0,f,256,m)}const d=s.globalCompositeOperation;s.globalCompositeOperation="multiply";for(let h=0;h<256;h++){const f=Math.abs(h/256-.5)*2,m=Math.round((1-.35*Math.pow(f,2))*255);s.fillStyle=`rgb(${m},${m},${m})`,s.fillRect(0,h,256,1)}s.globalCompositeOperation=d;const u=new yt(o);return u.wrapS=Dt,u.colorSpace=Ke,u}const oD=[{seed:31317,radius:13,position:new M(140,95,-210),spinSpeed:.006,base:"#9a9dc0",shade:"#6f6a9c"},{seed:31334,radius:8,position:new M(-60,78,-255),spinSpeed:-.009,base:"#7ea89e",shade:"#4a6f68"}];function sD(n){const t=Oe(n.seed),e=iD(t,n.base,n.shade),i=new Se(n.radius,22,16),o=new lt({map:e,color:13421772,fog:!1}),s=new L(i,o);return s.name="verdant-moon",s.position.copy(n.position),s.userData.spinSpeed=n.spinSpeed,s}function rD(){const n=new Bt;n.name="verdant-sky";const t=nD();n.add(t);const e=oD.map(sD);for(const i of e)n.add(i);return{group:n,update(i){for(const o of e)o.rotation.y+=o.userData.spinSpeed*i},dispose(){t.geometry.dispose(),t.material.dispose();for(const i of e)i.geometry.dispose(),i.material.map?.dispose(),i.material.dispose()}}}const aD=31489,cD=31490,lD=13624534,dD=10473656,q1=6746850,Z1=11041023;function ja(n,t,e,i=1.5,o=.38,s=1.7){const r=new St(t),a=new lt({color:r.clone(),toneMapped:!1}),c=new L(n,a),l=new St;return c.onBeforeRender=()=>{const d=performance.now()/1e3,u=.5+.5*Math.sin(d*i-e),h=o+(s-o)*Math.pow(u,2);l.copy(r).multiplyScalar(h),a.color.copy(l)},c}function K1(n,t){const e=t.map(o=>{const s=n.clone();return s.applyMatrix4(o),s}),i=Qt(e);for(const o of e)o.dispose();return i??n.clone()}const uD=[{x:6,z:10},{x:-18,z:6},{x:16,z:-22},{x:-11,z:-4.5}];function hD(n){const t=Oe(aD),e=new Bt;e.name="verdant-mushrooms";const i=new wt(.06,.09,1,6),o=new Se(1,8,6,0,Math.PI*2,0,Math.PI*.6),s=[],r=[],a=[];let c=null,l=new M;for(const f of uD){r.push(new M(f.x,n(f.x,f.z),f.z));const m=t.int(4,7);for(let v=0;v<m;v++){const p=t()*Math.PI*2,g=t.range(.4,2.4),S=f.x+Math.cos(p)*g,x=f.z+Math.sin(p)*g,w=n(S,x),E=t.range(.55,1.25),b=t.range(.7,1.15)*E,T=.55*E,C=new Lt().compose(new M(S,w+T*.5,x),new He().setFromEuler(new Je(0,t()*Math.PI*2,0)),new M(b,T,b));s.push(C);const y=.24*b,_=o.clone();_.scale(y,y*.85,y);const R=g*1.6+t.range(0,.5),D=t()<.6?q1:Z1,N=ja(_,D,R);N.position.set(S,w+T,x),e.add(N),a.push(N),c||(c=N,l=N.position.clone())}}o.dispose();const d=K1(i,s);i.dispose();const u=new Ft({color:lD,roughness:.85,metalness:0}),h=new L(d,u);return h.castShadow=!0,e.add(h),{group:e,heroMesh:c,heroPosition:l,fireflyCenters:r,dispose(){d.dispose(),u.dispose();for(const f of a)f.geometry.dispose(),f.material.dispose()}}}const fD=[{x:-20,z:16},{x:12,z:-6}];function pD(n){const t=Oe(cD),e=new Bt;e.name="verdant-fronds";const i=new wt(.015,.05,1,5),o=new Ba(1,0),s=[],r=[],a=[];let c=null,l=new M;for(const f of fD){r.push(new M(f.x,n(f.x,f.z),f.z));const m=t.int(5,8);for(let v=0;v<m;v++){const p=t()*Math.PI*2,g=t.range(.3,3),S=f.x+Math.cos(p)*g,x=f.z+Math.sin(p)*g,w=n(S,x),E=t.int(2,4);for(let b=0;b<E;b++){const T=t.range(-.28,.28),C=t()*Math.PI*2,y=t.range(1.1,2.3),_=t.range(.85,1.1),R=new He().setFromEuler(new Je(T,C,T*.6)),D=new M(S,w,x),N=new Lt().compose(D.clone().add(new M(0,y*.5,0)),R,new M(_,y,_));if(s.push(N),b===0){const z=new M(0,y,0).applyQuaternion(R),B=D.clone().add(z),V=.11*_,j=o.clone();j.scale(V,V*1.6,V);const Y=g*1.4+t.range(0,.6),J=t()<.5?Z1:q1,k=ja(j,J,Y,1.1);k.position.copy(B),e.add(k),a.push(k),c||(c=k,l=k.position.clone())}}}}o.dispose();const d=K1(i,s);i.dispose();const u=new Ft({color:dD,roughness:.8,metalness:0}),h=new L(d,u);return h.castShadow=!0,e.add(h),{group:e,heroMesh:c,heroPosition:l,fireflyCenters:r,dispose(){d.dispose(),u.dispose();for(const f of a)f.geometry.dispose(),f.material.dispose()}}}const mD=31402,gD=31385;function vD(){return $t("verdant-bark",()=>{const t=document.createElement("canvas");t.width=512,t.height=512;const e=t.getContext("2d"),i=Oe(mD);e.fillStyle="#332920",e.fillRect(0,0,512,512);const o=i.int(22,30);for(let d=0;d<o;d++){const u=d/o*512+i.signed(6),h=i.range(3,9),f=i()<.5;e.strokeStyle=f?"rgba(120,96,72,0.22)":"rgba(10,8,6,0.28)",e.lineWidth=h,e.beginPath();let m=u;e.moveTo(m,0);for(let v=24;v<=512;v+=24)m+=i.signed(5),e.lineTo(m,v);e.stroke()}const s=i.int(14,22);for(let d=0;d<s;d++){const u=i()*512,h=i()*512,f=i.range(.02,.07)*512,m=i()<.6?"70,220,210":"150,110,230",v=e.createRadialGradient(u,h,0,u,h,f);v.addColorStop(0,`rgba(${m},0.35)`),v.addColorStop(1,`rgba(${m},0)`),e.fillStyle=v,e.beginPath(),e.arc(u,h,f,0,Math.PI*2),e.fill()}const r=Dr(i,48),a=e.getImageData(0,0,512,512),c=a.data;for(let d=0;d<512;d+=2)for(let u=0;u<512;u+=2){const f=1+Ir(r,48,u/512,d/512,6,6,3)*.12,m=(d*512+u)*4;c[m]=Math.max(0,Math.min(255,c[m]*f)),c[m+1]=Math.max(0,Math.min(255,c[m+1]*f)),c[m+2]=Math.max(0,Math.min(255,c[m+2]*f))}e.putImageData(a,0,0);const l=new yt(t);return l.wrapS=Dt,l.wrapT=Dt,l.repeat.set(1,2),l},!0)}function xD(){return $t("verdant-ground-detail",()=>{const t=document.createElement("canvas");t.width=512,t.height=512;const e=t.getContext("2d"),i=Oe(gD);e.fillStyle="#d8dccc",e.fillRect(0,0,512,512);const o=Dr(i,56),s=Vn("#8fa088"),r=Vn("#e8ecd8"),a=e.getImageData(0,0,512,512),c=a.data;for(let u=0;u<512;u++)for(let h=0;h<512;h++){const f=Ir(o,56,h/512,u/512,8,8,4),m=Math.max(0,Math.min(1,f*.5+.5)),v=eo(s,r,m),p=(u*512+h)*4;c[p]=v.r,c[p+1]=v.g,c[p+2]=v.b}e.putImageData(a,0,0);const l=i.int(60,90);for(let u=0;u<l;u++){const h=i()*512,f=i()*512,m=i.range(.01,.035)*512,v=e.createRadialGradient(h,f,0,h,f,m);v.addColorStop(0,"rgba(40,60,44,0.30)"),v.addColorStop(1,"rgba(40,60,44,0)"),e.fillStyle=v,e.beginPath(),e.arc(h,f,m,0,Math.PI*2),e.fill()}const d=new yt(t);return d.wrapS=Dt,d.wrapT=Dt,d.repeat.set(6,6),d},!0)}function SD(){return $t("verdant-rim-gradient",()=>{const e=document.createElement("canvas");e.width=16,e.height=64;const i=e.getContext("2d"),o=i.createLinearGradient(0,0,0,64);o.addColorStop(0,"rgba(255,255,255,0.0)"),o.addColorStop(.5,"rgba(255,255,255,0.55)"),o.addColorStop(1,"rgba(255,255,255,0.15)"),i.fillStyle=o,i.fillRect(0,0,16,64);const s=new yt(e);return s.wrapS=Dt,s.wrapT=ue,s})}function _D(){return $t("verdant-firefly-sprite",()=>{const t=document.createElement("canvas");t.width=32,t.height=32;const e=t.getContext("2d"),i=32/2,o=32/2,s=e.createRadialGradient(i,o,0,i,o,32/2);s.addColorStop(0,"rgba(255,255,255,1.0)"),s.addColorStop(.3,"rgba(255,255,255,0.55)"),s.addColorStop(1,"rgba(255,255,255,0.0)"),e.fillStyle=s,e.fillRect(0,0,32,32);const r=new yt(t);return r.wrapS=ue,r.wrapT=ue,r})}const MD=31492,j1=6746850,wD=11041023;function yD(n,t,e){const i=e(n,t),o=new Bt;o.name="verdant-spring";const s=new wt(1.6,1.8,.22,16),r=new Ft({color:5598046,roughness:.9,metalness:.05}),a=new L(s,r);a.position.set(n,i+.08,t),a.castShadow=!0,o.add(a);const c=new wt(1.4,1.4,.02,20),l=ja(c,j1,0,.6,.55,1.3);return l.position.set(n,i+.2,t),o.add(l),{group:o,glowMesh:l,position:new M(n,i+.2,t),dispose(){s.dispose(),r.dispose(),c.dispose(),l.material.dispose()}}}function bD(n){const t=Oe(MD),e=9,i=n.length*e,o=new Float32Array(i*3),s=new Float32Array(i*3),r=new Float32Array(i),a=new Float32Array(i*3),c=new St(j1),l=new St(wD);let d=0;for(const g of n)for(let S=0;S<e;S++){const x=t()*Math.PI*2,w=Math.sqrt(t())*2.6,E=g.x+Math.cos(x)*w,b=g.z+Math.sin(x)*w,T=g.y+t.range(.4,1.9);o[d*3]=E,o[d*3+1]=T,o[d*3+2]=b,s[d*3]=E,s[d*3+1]=T,s[d*3+2]=b,r[d]=t()*Math.PI*2;const C=t()<.65?c:l;a[d*3]=C.r,a[d*3+1]=C.g,a[d*3+2]=C.b,d++}const u=new ce;u.setAttribute("position",new re(o,3)),u.setAttribute("color",new re(a,3));const h=new Ts({size:.22,sizeAttenuation:!0,map:_D(),vertexColors:!0,transparent:!0,depthWrite:!1,blending:Ae,toneMapped:!1,fog:!1}),f=new io(u,h);f.name="verdant-fireflies";const m=u.getAttribute("position"),v=u.getAttribute("color");let p=0;return{points:f,update(g){p+=g;for(let S=0;S<i;S++){const x=r[S],w=Math.sin(p*.4+x)*.3,E=p*.2+x,b=Math.cos(E)*.35,T=Math.sin(E)*.35;m.setXYZ(S,s[S*3]+b,s[S*3+1]+w,s[S*3+2]+T);const C=.55+.45*Math.sin(p*2.2+x*3);v.setXYZ(S,a[S*3]*C,a[S*3+1]*C,a[S*3+2]*C)}m.needsUpdate=!0,v.needsUpdate=!0},dispose(){u.dispose(),h.map?.dispose(),h.dispose()}}}const TD=31493,ED=11041023,J1=6746850,AD=4025170,hg=10,CD=[{x:8,z:-16,trunkR:.85,height:6.2},{x:-24,z:-20,trunkR:.95,height:6.8}],la={x:-14,z:-8,trunkR:1.45,height:7.4,doorAngle:-Math.PI*.18};function fg(n,t,e,i,o,s,r,a){const c=s.int(4,6);for(let l=0;l<c;l++){const d=s()*Math.PI*2,u=s.range(.2,o*.85),h=t+Math.cos(d)*u,f=e+Math.sin(d)*u,m=s.range(1.4,3),v=new Lt().compose(new M(h,i-m*.5,f),new He,new M(.05,m,.05));r.push(v);const p=new Se(.13,6,5),g=u*1.5+s.range(0,.7),S=s()<.5?ED:J1,x=ja(p,S,g,1.3);x.position.set(h,i-m,f),n.add(x),a.push(x)}}function RD(n){const t=Oe(TD),e=new Bt;e.name="verdant-trees";const i=vD(),o=new Ft({map:i,color:14208440,roughness:.95,metalness:0,emissive:2760728,emissiveIntensity:.7}),s=new Ft({color:AD,roughness:.85,metalness:0,emissive:1987128,emissiveIntensity:1}),r=new wt(1,1.2,1,9),a=new zr(1,1),c=[],l=[],d=[],u=new wt(1,1,1,3),h=[],f=[],m=[];for(const k of CD){const $=n(k.x,k.z);m.push(new M(k.x,$+k.height*.6,k.z)),c.push(new Lt().compose(new M(k.x,$+k.height*.5,k.z),new He,new M(k.trunkR,k.height,k.trunkR)));const mt=k.trunkR*2.6;l.push(new Lt().compose(new M(k.x,$+k.height+mt*.4,k.z),new He,new M(mt,mt*.7,mt))),fg(e,k.x,k.z,$+k.height+.4,mt,t,d,h),f.push({minX:k.x-k.trunkR,maxX:k.x+k.trunkR,minY:$-1,maxY:$+k.height+1,minZ:k.z-k.trunkR,maxZ:k.z+k.trunkR})}const v=la.x,p=la.z,g=la.trunkR,S=la.height,x=n(v,p),w=Math.PI*.6,E=la.doorAngle,b=new wt(g,g*1.15,S,14,1,!0,E+w,Math.PI*2-w),T=new L(b,o);T.position.set(v,x+S/2,p),T.name="verdant-heartwood",T.castShadow=!0,e.add(T);const C=new wt(g*.92,g*.92,.1,14),y=new L(C,s);y.position.set(v,x+.05,p),e.add(y);const _=g*2.8;l.push(new Lt().compose(new M(v,x+S+_*.4,p),new He,new M(_,_*.7,_))),fg(e,v,p,x+S+.4,_,t,d,h),m.push(new M(v,x+S*.5,p));for(let k=0;k<hg;k++){const $=k/hg*Math.PI*2;if((($-E)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)<w)continue;const at=v+Math.sin($)*g,X=p+Math.cos($)*g,tt=.45;f.push({minX:at-tt,maxX:at+tt,minY:x-1,maxY:x+S,minZ:X-tt,maxZ:X+tt})}const R=new Se(.28,12,10),D=ja(R,J1,0,1,.6,1.6);D.name="verdant-relic-seedpod",D.position.set(v,x+.55,p),e.add(D);const N=Qt(c.map(k=>{const $=r.clone();return $.applyMatrix4(k),$}));r.dispose();const z=new L(N??new ce,o);z.castShadow=!0,e.add(z);const B=Qt(l.map(k=>{const $=a.clone();return $.applyMatrix4(k),$}));a.dispose();const V=new L(B??new ce,s);V.castShadow=!0,e.add(V);const j=Qt(d.map(k=>{const $=u.clone();return $.applyMatrix4(k),$}));u.dispose();const Y=new Ft({color:6983544,roughness:.8}),J=new L(j??new ce,Y);return e.add(J),{group:e,colliders:f,heartwoodMesh:T,heartwoodPosition:new M(v,x+1.6,p),relicMesh:D,relicPosition:D.position.clone(),fireflyCenters:m,dispose(){N?.dispose(),o.dispose(),B?.dispose(),s.dispose(),j?.dispose(),Y.dispose(),b.dispose(),C.dispose(),R.dispose(),D.material.dispose(),i.dispose();for(const k of h)k.geometry.dispose(),k.material.dispose()}}}const PD=32333,Vu=60;function tl(n,t,e){return{id:n,prompt:`Scan ${t}`,radius:3,position:e.clone(),onInteract:()=>{const i=pi(n);en(i?`CATALOGUED · ${t}`:`KNOWN · ${t}`)}}}function LD(){const n=new Fr;n.background=new St(1709104),n.fog=new Ur(1854022,20,80);const t=yr({seed:PD,radius:Vu,maxHeight:3,segments:96,colorRamp:{low:"#234a3c",mid:"#37684f",high:"#5e8f74"},texture:xD()});n.add(t.mesh);const e=t.groundHeight,i=rD();n.add(i.group);const o=new Ha(8087736,2776144,.8);n.add(o);const s=[new De(4645080,30,24,2),new De(11041023,26,18,2),new De(6746850,32,26,2),new De(10125288,26,24,2)];s[0].position.set(0,e(0,26)+3,26),s[1].position.set(-14,e(-14,-8)+2.4,-8),s[2].position.set(6,e(6,10)+2.2,10),s[3].position.set(-20,e(-20,16)+2.6,16);for(const R of s)n.add(R);const r=new wt(Vu-.5,Vu-.5,5,96,1,!0),a=new lt({map:SD(),color:4645080,transparent:!0,opacity:.28,side:je,toneMapped:!1,fog:!1,blending:Ae,depthWrite:!1}),c=new L(r,a);c.position.y=2.5,n.add(c);const l=new Xn(.9,1.3,40),d=new lt({color:4645080,transparent:!0,opacity:.6,side:me,toneMapped:!1}),u=new L(l,d);u.rotation.x=-Math.PI/2,u.position.set(0,e(0,26)+.03,26),n.add(u);const h=Sd(2.2,2.8),f=e(5,30)+1.5;h.mesh.position.set(5,f,30),h.mesh.lookAt(0,f,26),n.add(h.mesh);const m=hD(e);n.add(m.group);const v=pD(e);n.add(v.group);const p=RD(e);n.add(p.group);const g=yD(22,8,e);n.add(g.group);const S=bD([...m.fireflyCenters,...v.fireflyCenters,...p.fireflyCenters]);n.add(S.points),m.heroMesh.name="verdant-flora-1";const x=tl("verdant-flora-1","LUMEN CAP",m.heroPosition);v.heroMesh.name="verdant-flora-2";const w=tl("verdant-flora-2","WHISPER FROND",v.heroPosition);p.heartwoodMesh.name="verdant-flora-3";const E=tl("verdant-flora-3","HEARTWOOD SENTINEL",p.heartwoodPosition);g.group.name="verdant-flora-4";const b=tl("verdant-flora-4","GLIMMER SPRING",g.position);p.relicMesh.name="verdant-relic";const T=Bo().relics.includes("verdant");T&&(p.relicMesh.visible=!1);const C={id:"verdant-relic",prompt:"Take VERDANT SEED-POD",radius:2.4,position:p.relicPosition.clone(),state:{collected:!1},onInteract:()=>{const R=of("verdant");p.relicMesh.visible=!1,C.state.collected=!0,en(R?"RELIC ACQUIRED · VERDANT SEED-POD":"RELIC ALREADY HELD")}},y=ms([{id:"verdant-grazer",scanName:"LOAMSTRIDER",lore:"A placid herd-walker that combs the moss for mineral dew.",plan:"quadruped",sizeM:1.6,palette:{primary:"#7a8b85",secondary:"#4a5d57",emissive:"#a878ff"},gaitHz:.9,temperament:"placid",count:5,seed:31745,roamRadius:35},{id:"verdant-skitterer",scanName:"SPRIG SKITTERER",lore:"A twig-legged mite that bolts between glow-caps when startled.",plan:"skitterer",sizeM:.35,palette:{primary:"#5a7a4e",secondary:"#8fae6f",emissive:"#66f2e2"},gaitHz:2.6,temperament:"skittish",count:6,seed:31746,roamRadius:25}],e,new M(0,0,0));n.add(y.group);const _=[{name:"verdant",position:new M(0,1.7,26),lookAt:new M(-10,3.2,-18)},{name:"verdant-qa",position:new M(-9.5,1.7,.5),lookAt:new M(-14,1.3,-8)}];return{id:"verdant",scene:n,colliders:[...t.boundaryColliders,...p.colliders],interactables:[h.interactable,...T?[]:[C],x,w,E,b,...y.interactables],cameras:_,spawn:{position:new M(0,0,26),lookAt:new M(-10,1.6,-8)},groundHeight:e,update(R,D){y.update(R,D),S.update(R),i.update(R)},dispose(){t.mesh.geometry.dispose(),t.mesh.material.dispose(),r.dispose(),a.dispose(),l.dispose(),d.dispose(),h.dispose(),m.dispose(),v.dispose(),p.dispose(),g.dispose(),S.dispose(),y.dispose(),i.dispose(),n.remove(o,...s)}}}const pg=2037522;function DD(){const e=document.createElement("canvas");e.width=4,e.height=256;const i=e.getContext("2d");if(!i)throw new Error("2d context unavailable");const o=i.createLinearGradient(0,0,0,256);o.addColorStop(0,"#14100d"),o.addColorStop(.3,"#33241b"),o.addColorStop(.44,"#61402a"),o.addColorStop(.5,"#96582f"),o.addColorStop(.58,"#5c3c28"),o.addColorStop(1,"#33241b"),i.fillStyle=o,i.fillRect(0,0,4,256);const s=new yt(e);return s.colorSpace=Ke,s}function ID(){const t=document.createElement("canvas");t.width=512,t.height=512;const e=t.getContext("2d");if(!e)throw new Error("2d context unavailable");const i=512/2,o=512/2,s=e.createRadialGradient(i,o,0,i,o,512*.5);s.addColorStop(0,"rgba(255,150,70,0.95)"),s.addColorStop(.1,"rgba(235,100,45,0.65)"),s.addColorStop(.3,"rgba(160,55,28,0.25)"),s.addColorStop(.6,"rgba(110,35,18,0.08)"),s.addColorStop(1,"rgba(90,20,10,0)"),e.fillStyle=s,e.fillRect(0,0,512,512),e.filter="blur(10px)",e.globalCompositeOperation="lighter";const r=e.createRadialGradient(i,o,0,i,o,512*.11);r.addColorStop(0,"rgba(255,190,120,0.9)"),r.addColorStop(1,"rgba(255,190,120,0)"),e.fillStyle=r,e.beginPath(),e.arc(i,o,512*.11,0,Math.PI*2),e.fill(),e.filter="none",e.globalCompositeOperation="source-over";const a=new yt(t);return a.colorSpace=Ke,a}function ND(){const t=document.createElement("canvas");t.width=128,t.height=128;const e=t.getContext("2d");if(!e)throw new Error("2d context unavailable");const i=e.createLinearGradient(0,0,0,128);return i.addColorStop(0,"rgba(255,110,40,0)"),i.addColorStop(.5,"rgba(255,110,40,0.6)"),i.addColorStop(1,"rgba(255,110,40,0)"),e.fillStyle=i,e.fillRect(0,0,128,128),new yt(t)}function OD(n,t){const e=DD(),i=new Se(480,24,16),o=new lt({map:e,side:je,fog:!1}),s=new L(i,o);s.name="ashfall-sky-dome";const r=ID(),a=new lt({map:r,transparent:!0,depthWrite:!1,blending:Ae,toneMapped:!1,opacity:.85,fog:!1}),c=new qt(300,300),l=new L(c,a);l.position.set(-70,t+48,-420),l.lookAt(0,t+4,0),l.name="ashfall-sun";const d=ND(),u=new Xn(n-1.4,n+2.6,96),h=new lt({map:d,color:16739880,transparent:!0,opacity:.38,side:me,toneMapped:!1,blending:Ae,depthWrite:!1,fog:!1}),f=new L(u,h);f.rotation.x=-Math.PI/2,f.position.y=t+.08,f.name="ashfall-rim";function m(p){h.opacity=.32+.1*Math.sin(p*1.3)+.06*Math.sin(p*3.1+1.7),a.opacity=.78+.08*Math.sin(p*.35)}function v(){i.dispose(),o.dispose(),e.dispose(),c.dispose(),a.dispose(),r.dispose(),u.dispose(),h.dispose(),d.dispose()}return{dome:s,sun:l,rim:f,update:m,dispose:v}}const UD=10877457,FD=10877491,zD=10877525;function BD(){return $t("ashfall-crack-tex",()=>{const n=U1(Oe(UD),1024);return n.wrapT=Dt,n})}function HD(){return $t("ashfall-basalt-mottle",()=>{const n=Oe(FD),t=512,{canvas:e,ctx:i}=ro(t);i.fillStyle="#d0c4b8",i.fillRect(0,0,t,t);for(let s=0;s<46;s++){const r=n()*t,a=n()*t,c=n.range(.03,.12)*t,l=n()<.55,d=i.createRadialGradient(r,a,0,r,a,c);d.addColorStop(0,l?"rgba(6,5,5,0.55)":"rgba(90,72,56,0.35)"),d.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=d,i.beginPath(),i.arc(r,a,c,0,Math.PI*2),i.fill()}const o=Vo(e);return o.wrapT=Dt,o.repeat.set(5,5),o})}function kD(){return $t("ashfall-ember-sprite",()=>{const t=document.createElement("canvas");t.width=32,t.height=32;const e=t.getContext("2d");if(!e)throw new Error("2d context unavailable");const i=32/2,o=32/2,s=e.createRadialGradient(i,o,0,i,o,32/2);s.addColorStop(0,"rgba(255,225,170,1)"),s.addColorStop(.35,"rgba(255,140,50,0.85)"),s.addColorStop(1,"rgba(255,80,20,0)"),e.fillStyle=s,e.fillRect(0,0,32,32);const r=new yt(t);return r.wrapS=ue,r.wrapT=ue,r})}function WD(){return $t("ashfall-smoke-sprite",()=>{const n=Oe(zD),t=256,{canvas:e,ctx:i}=ro(t);i.clearRect(0,0,t,t);for(let s=0;s<4;s++){const r=t*.5+n.signed(t*.1),a=t*.5+n.signed(t*.1),c=t*n.range(.22,.34),l=i.createRadialGradient(r,a,0,r,a,c);l.addColorStop(0,"rgba(122,104,90,0.4)"),l.addColorStop(.6,"rgba(122,104,90,0.18)"),l.addColorStop(1,"rgba(122,104,90,0)"),i.fillStyle=l,i.beginPath(),i.arc(r,a,c,0,Math.PI*2),i.fill()}const o=new yt(e);return o.wrapS=ue,o.wrapT=ue,o})}const GD=10877537,VD=10877553,Xu=[{x:-14,z:30,radius:5,count:14},{x:-24,z:-4,radius:6,count:12},{x:20,z:-26,radius:5,count:10}],XD={x:-30,z:20,radius:4.2,count:9},Kl=new Lt,jl=new M,Jl=new He,Ql=new M,$l=new Je;function Q1(n){const t=n.toNonIndexed();return t.computeVertexNormals(),t}function YD(n){const t=Oe(GD),e=Q1(new zo(1,1,5,1)),i=new Ft({color:789008,roughness:.28,metalness:.2,emissive:3804933,emissiveIntensity:.2}),o=Xu.reduce((u,h)=>u+h.count,0),s=new tn(e,i,o);s.name="ashfall-obsidian-choir";let r=0;const a=[];for(const u of Xu){for(let h=0;h<u.count;h++){const f=t()*Math.PI*2,m=Math.sqrt(t())*u.radius,v=u.x+Math.cos(f)*m,p=u.z+Math.sin(f)*m,g=n(v,p),S=t.range(1.4,4.4),x=t.range(.35,.9);jl.set(v,g+S*.5,p),$l.set(t.signed(.12),t()*Math.PI*2,t.signed(.12)),Jl.setFromEuler($l),Ql.set(x,S,x),Kl.compose(jl,Jl,Ql),s.setMatrixAt(r,Kl),r++}a.push({minX:u.x-u.radius-.6,maxX:u.x+u.radius+.6,minY:-2,maxY:6,minZ:u.z-u.radius-.6,maxZ:u.z+u.radius+.6})}s.instanceMatrix.needsUpdate=!0,s.castShadow=!0;const c=Xu[0],l=n(c.x,c.z),d={id:"ashfall-obsidian-choir",prompt:"Scan OBSIDIAN CHOIR",radius:3.2,position:new M(c.x,l+1.6,c.z),onInteract:()=>{const u=pi("ashfall-obsidian-choir");en(u?"CATALOGUED · OBSIDIAN CHOIR":"KNOWN · OBSIDIAN CHOIR")}};return{mesh:s,colliders:a,interactable:d,dispose(){e.dispose(),i.dispose(),s.dispose()}}}function qD(n){const t=Oe(VD),e=Q1(new wt(1,1,1,6,1)),i=new Ft({color:1314836,roughness:.85,metalness:.05,emissive:2755844,emissiveIntensity:.12}),{x:o,z:s,radius:r,count:a}=XD,c=new tn(e,i,a);c.name="ashfall-basalt-columns";for(let u=0;u<a;u++){const h=u/a*Math.PI*2+t.signed(.4),f=r*t.range(.3,1),m=o+Math.cos(h)*f,v=s+Math.sin(h)*f,p=n(m,v),g=t.range(2.2,4.6),S=t.range(.55,.95);jl.set(m,p+g*.5,v),$l.set(t.signed(.05),t()*Math.PI*2,t.signed(.05)),Jl.setFromEuler($l),Ql.set(S,g,S),Kl.compose(jl,Jl,Ql),c.setMatrixAt(u,Kl)}c.instanceMatrix.needsUpdate=!0,c.castShadow=!0;const l=n(o,s),d={id:"ashfall-basalt-columns",prompt:"Scan BASALT COLONNADE",radius:3,position:new M(o,l+1.8,s),onInteract:()=>{const u=pi("ashfall-basalt-columns");en(u?"CATALOGUED · BASALT COLONNADE":"KNOWN · BASALT COLONNADE")}};return{mesh:c,colliders:[{minX:o-r-.6,maxX:o+r+.6,minY:-2,maxY:6,minZ:s-r-.6,maxZ:s+r+.6}],interactable:d,dispose(){e.dispose(),i.dispose(),c.dispose()}}}function ZD(n,t,e){const i=new Xn(1.1,1.6,40),o=new lt({color:16738856,transparent:!0,opacity:.5,side:me,toneMapped:!1}),s=new L(i,o);return s.rotation.x=-Math.PI/2,s.position.set(n,e+.03,t),s.name="ashfall-spawn-pad",{mesh:s,dispose(){i.dispose(),o.dispose()}}}const Ml=[{x:17,z:22},{x:-20,z:8},{x:6,z:-18}],Wi={x:3,z:20,radius:3.2},Gi={x:13,z:20,radius:3.2},el=new M(8,0,19.5),Yu=10877569;function mg(n,t){const e=Oe(n),i=new zr(1,t),o=i.attributes.position;for(let s=0;s<o.count;s++){const r=1+e.signed(.22);o.setXYZ(s,o.getX(s)*r,o.getY(s)*r,o.getZ(s)*r)}return i.computeVertexNormals(),i}function KD(n){const t=new Bt;t.name="ashfall-cooled-flow";const e=new Ft({color:1512208,roughness:.92,metalness:.04,emissive:2230786,emissiveIntensity:.1}),i=[];for(const[p,g,S]of[[Wi,Yu,2.6],[Gi,Yu^9,2.9]]){const x=mg(g,1);i.push(x);const w=new L(x,e),E=n(p.x,p.z);w.position.set(p.x,E+S*.55,p.z),w.scale.set(p.radius,S,p.radius*.9),w.castShadow=!0,t.add(w)}const o=mg(Yu^3,1);i.push(o);const s=n(8,22.5),r=new L(o,e);r.position.set(8,s+.9,22.5),r.scale.set(2.6,1.5,2),r.castShadow=!0,t.add(r);const a=n(el.x,el.z);el.y=a+.5;const c=new zr(.24,1);i.push(c);const l=new Ft({color:656648,roughness:.15,metalness:.3,emissive:16734751,emissiveIntensity:1.3,toneMapped:!1}),d=new L(c,l);d.position.copy(el),d.name="ashfall-relic-core",d.onBeforeRender=()=>{const p=performance.now()/1e3;l.emissiveIntensity=1.1+.3*Math.sin(p*2.4)},t.add(d);const u=Bo().relics.includes("ashfall");u&&(d.visible=!1);const h={id:"ashfall-relic-core",prompt:"Take the Ember Core",radius:2.2,position:d.position.clone(),onInteract:()=>{of("ashfall")?(d.visible=!1,en("RELIC RECOVERED · EMBER CORE")):en("KNOWN · EMBER CORE")}},f=n(8,22.5),m={id:"ashfall-cooled-flow",prompt:"Scan COOLED FLOW",radius:2.8,position:new M(8,f+1.6,22.5),onInteract:()=>{const p=pi("ashfall-cooled-flow");en(p?"CATALOGUED · COOLED FLOW":"KNOWN · COOLED FLOW")}},v=[{minX:Wi.x-Wi.radius,maxX:Wi.x+Wi.radius,minY:-2,maxY:6,minZ:Wi.z-Wi.radius,maxZ:Wi.z+Wi.radius},{minX:Gi.x-Gi.radius,maxX:Gi.x+Gi.radius,minY:-2,maxY:6,minZ:Gi.z-Gi.radius,maxZ:Gi.z+Gi.radius}];return{group:t,colliders:v,relicInteractable:u?null:h,scanInteractable:m,dispose(){for(const p of i)p.dispose();e.dispose(),l.dispose()}}}function jD(n){const t=new Bt;t.name="ashfall-fumaroles";const e=new wt(.55,1.3,1.7,8,1),i=new Ft({color:1840914,roughness:.95,metalness:.03}),o=new cd(.42,20),s=new Ft({color:2099716,emissive:16742954,emissiveIntensity:1.2,toneMapped:!1,side:me});let r=null;if(Ml.forEach((c,l)=>{const d=n(c.x,c.z),u=new L(e,i);u.position.set(c.x,d+.85,c.z),u.castShadow=!0,t.add(u);const h=new L(o,s);h.rotation.x=-Math.PI/2,h.position.set(c.x,d+1.72,c.z);const f=l*2.1;h.onBeforeRender=()=>{const m=performance.now()/1e3;s.emissiveIntensity=1+.45*Math.sin(m*2.2+f)},t.add(h),l===0&&(r={id:"ashfall-fumarole",prompt:"Scan FUMAROLE",radius:2.6,position:new M(c.x,d+1.2,c.z),onInteract:()=>{const m=pi("ashfall-fumarole");en(m?"CATALOGUED · FUMAROLE":"KNOWN · FUMAROLE")}})}),!r)throw new Error("ashfall: no fumarole positions configured");return{group:t,interactable:r,dispose(){e.dispose(),i.dispose(),o.dispose(),s.dispose()}}}function JD(n,t,e,i){const o=t*2,s=96,r=new qt(o,o,s,s);r.rotateX(-Math.PI/2);const a=r.attributes.position;for(let h=0;h<a.count;h++){const f=a.getX(h),m=a.getZ(h);a.setY(h,n.groundHeight(f,m)+.03)}a.needsUpdate=!0,r.computeVertexNormals();const c=new Array(3);for(let h=0;h<3;h++){const f=i[h]??i[0];c[h]=new rt(f.x,f.z)}const l={uTex:{value:BD()},uTime:{value:0},uRepeat:{value:6},uMaxHeight:{value:Math.max(.01,e)},uOrigins:{value:c}},d=new de({uniforms:l,transparent:!0,depthWrite:!1,depthTest:!0,blending:Ae,toneMapped:!1,vertexShader:`
      uniform float uMaxHeight;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying float vHeight;
      void main() {
        vUv = uv;
        vHeight = clamp(position.y / uMaxHeight, 0.0, 1.0);
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      precision highp float;
      uniform sampler2D uTex;
      uniform float uTime;
      uniform float uRepeat;
      uniform vec2 uOrigins[3];
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying float vHeight;
      void main() {
        vec4 crack = texture2D(uTex, vUv * uRepeat);
        float wave = 0.0;
        for (int i = 0; i < 3; i++) {
          float d = length(vWorldPos.xz - uOrigins[i]);
          wave += 0.5 + 0.5 * sin(uTime * 1.6 - d * 0.34);
        }
        wave /= 3.0;
        float pulse = mix(0.30, 1.0, clamp(wave, 0.0, 1.0));
        // Cracks read strongest in low terrain (crevices), fade on ridge tops.
        float lowMask = mix(0.35, 1.0, 1.0 - smoothstep(0.4, 0.9, vHeight));
        vec3 col = crack.rgb * (0.7 + 0.9 * pulse);
        gl_FragColor = vec4(col, crack.a * pulse * lowMask);
      }
    `}),u=new L(r,d);return u.name="ashfall-crack-overlay",u.onBeforeRender=()=>{l.uTime.value=performance.now()/1e3},{mesh:u,dispose(){r.dispose(),d.dispose()}}}const QD=10877585,_o=140,$D=15;function tI(n,t,e){const i=Oe(QD),o=new Float32Array(_o*3),s=new Float32Array(_o*2),r=new Float32Array(_o),a=new Float32Array(_o),c=new Float32Array(_o),l=new Float32Array(_o);for(let v=0;v<_o;v++){let p,g;if(e.length>0&&i()<.55){const x=e[i.int(0,e.length-1)],w=i()*Math.PI*2,E=i.range(0,3.2);p=x.x+Math.cos(w)*E,g=x.z+Math.sin(w)*E}else{const x=i()*Math.PI*2,w=Math.sqrt(i())*t*.9;p=Math.cos(x)*w,g=Math.sin(x)*w}const S=n(p,g);s[v*2]=p,s[v*2+1]=g,r[v]=S+i.range(.2,1.5),a[v]=i.range(.6,1.6),c[v]=i()*Math.PI*2,l[v]=i.range(.4,1.4),o[v*3]=p,o[v*3+1]=r[v],o[v*3+2]=g}const d=new ce;d.setAttribute("position",new re(o,3));const u=new Ts({color:16751178,map:kD(),size:.34,sizeAttenuation:!0,transparent:!0,opacity:.62,depthWrite:!1,blending:Ae,toneMapped:!1}),h=new io(d,u);h.name="ashfall-embers";const f=d.getAttribute("position"),m=performance.now();return h.onBeforeRender=()=>{const v=(performance.now()-m)/1e3;for(let p=0;p<_o;p++){const g=(v*a[p]*1.4+c[p])%$D,S=Math.sin(v*.5+c[p])*l[p]*.4,x=Math.cos(v*.4+c[p])*l[p]*.4;f.setXYZ(p,s[p*2]+S,r[p]+g,s[p*2+1]+x)}f.needsUpdate=!0},{points:h,dispose(){d.dispose(),u.dispose()}}}const nl=[{x:17,z:22,y:18},{x:-20,z:8,y:16},{x:6,z:-18,y:20},{x:10,z:20,y:14}];function eI(n){const t=new Float32Array(nl.length*3),e=new Float32Array(nl.length*3);nl.forEach((a,c)=>{const l=n(a.x,a.z);e[c*3]=a.x,e[c*3+1]=l+a.y,e[c*3+2]=a.z,t[c*3]=a.x,t[c*3+1]=l+a.y,t[c*3+2]=a.z});const i=new ce;i.setAttribute("position",new re(t,3));const o=new Ts({map:WD(),color:6965812,size:12,transparent:!0,opacity:.35,blending:Ae,depthWrite:!1,toneMapped:!1,fog:!1}),s=new io(i,o);s.name="ashfall-smoke";const r=i.getAttribute("position");return s.onBeforeRender=()=>{const a=performance.now()/1e3;for(let c=0;c<nl.length;c++){const l=c*1.7;r.setXYZ(c,e[c*3]+Math.sin(a*.08+l)*3.5,e[c*3+1]+Math.sin(a*.11+l)*.8,e[c*3+2]+Math.cos(a*.07+l)*3.5)}r.needsUpdate=!0,o.opacity=.3+.1*Math.sin(a*.15)},{points:s,dispose(){i.dispose(),o.dispose()}}}const nI=10877441,il=60,gg=4.2,qu=1.7,er=0,nr=40,vg=4.5,xg=35,iI=new M(0,0,0),oI=[{id:"ashfall-beetle",scanName:"EMBERBACK BEETLE",lore:"An armored scavenger that grazes on cooling slag, seams glowing where heat still bleeds through its shell.",plan:"skitterer",sizeM:.8,palette:{primary:"#3a3d42",secondary:"#5a5f66",emissive:"#ff5a1f"},gaitHz:3.2,temperament:"curious",count:4,seed:10862103,roamRadius:30},{id:"ashfall-ray",scanName:"ASH-RAY",lore:"A membrane-winged glider that rides thermal columns above the cracks, wingtips tracing faint ember light.",plan:"glider",sizeM:2.2,palette:{primary:"#1b1712",secondary:"#3a2e26",emissive:"#ff7a2a"},gaitHz:.5,temperament:"placid",count:2,seed:10877458,roamRadius:45}];function sI(){const n=new Fr;n.background=new St(pg),n.fog=new Ur(pg,22,76);const t=yr({seed:nI,radius:il,maxHeight:gg,colorRamp:{low:"#302219",mid:"#4c392b",high:"#7e5e40"},texture:HD()});n.add(t.mesh);const e=t.groundHeight,i=OD(il,e(0,0));n.add(i.dome,i.sun,i.rim);const o=new Ha(7031348,3153946,1);n.add(o);const s=[];Ml.forEach(w=>{const E=new De(16734751,20,26,2);E.position.set(w.x,e(w.x,w.z)+3,w.z),n.add(E),s.push(E)});const r=new De(16757626,14,30,2);r.position.set(er,e(er,nr)+4,nr),n.add(r);const a=new De(16734751,9,12,2);a.position.set(8,e(8,19.5)+2.5,19.5),n.add(a),s.push(r,a);const c=JD(t,il,gg,Ml);n.add(c.mesh);const l=jD(e);n.add(l.group);const d=KD(e);n.add(d.group);const u=YD(e);n.add(u.mesh);const h=qD(e);n.add(h.mesh);const f=ZD(er,nr,e(er,nr));n.add(f.mesh);const m=tI(e,il,Ml);n.add(m.points);const v=eI(e);n.add(v.points);const p=Sd(2.2,2.8);p.mesh.position.set(vg,e(vg,xg)+1.5,xg),n.add(p.mesh);const g=ms(oI,e,iI);n.add(g.group);const S=[{name:"ashfall",position:new M(16,e(16,44)+qu,44),lookAt:new M(-8,e(-8,8)+2.5,8)},{name:"ashfall-qa",position:new M(17,e(17,12)+qu,12),lookAt:new M(8,e(8,19.5)+1,19.7)}];let x=0;return{id:"ashfall",scene:n,colliders:[...t.boundaryColliders,...u.colliders,...h.colliders,...d.colliders],interactables:[p.interactable,...d.relicInteractable?[d.relicInteractable]:[],d.scanInteractable,l.interactable,u.interactable,h.interactable,...g.interactables],cameras:S,spawn:{position:new M(er,e(er,nr)+qu,nr),lookAt:new M(-6,e(-6,10)+3,10)},groundHeight:e,update(w,E){x+=w,g.update(w,E),i.update(x)},dispose(){t.mesh.geometry.dispose(),t.mesh.material.dispose(),i.dispose(),c.dispose(),l.dispose(),d.dispose(),u.dispose(),h.dispose(),f.dispose(),m.dispose(),v.dispose(),p.dispose(),g.dispose(),n.remove(o,...s)}}}const Sg=[[.72,.55,1,.34],[1,.48,.92,.28],[.5,.92,1,.24],[1,1,1,.14]];function rI(n,t){const e=Oe(t),i=n.geometry.attributes.color;if(!i)return;const o=i.array,s=i.count;for(let r=0;r<s;r++){const a=e();let c=0,l=Sg[0];for(const d of Sg)if(c+=d[3],a<c){l=d;break}o[r*3]=l[0],o[r*3+1]=l[1],o[r*3+2]=l[2]}i.needsUpdate=!0}function $1(){return $t("rift-spark-sprite",()=>{const t=document.createElement("canvas");t.width=64,t.height=64;const e=t.getContext("2d"),i=e.createRadialGradient(64/2,64/2,0,64/2,64/2,64/2);i.addColorStop(0,"rgba(255,255,255,1.0)"),i.addColorStop(.35,"rgba(220,200,255,0.75)"),i.addColorStop(1,"rgba(180,120,255,0.0)"),e.fillStyle=i,e.beginPath(),e.arc(64/2,64/2,64/2,0,Math.PI*2),e.fill();const o=new yt(t);return o.wrapS=ue,o.wrapT=ue,o})}function tx(n){return $t(`rift-rock-veins-${n}`,()=>{const e=document.createElement("canvas");e.width=512,e.height=512;const i=e.getContext("2d");i.fillStyle="#3f2a5e",i.fillRect(0,0,512,512);const o=Oe(n);for(let a=0;a<40;a++){const c=o()*512,l=o()*512,d=30+o()*90,u=.6+o()*.5,h=i.createRadialGradient(c,l,0,c,l,d);h.addColorStop(0,`rgba(${Math.floor(64*u)},${Math.floor(38*u)},${Math.floor(92*u)},0.5)`),h.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=h,i.beginPath(),i.arc(c,l,d,0,Math.PI*2),i.fill()}const s=9;for(let a=0;a<s;a++){const c=a%2===0;i.strokeStyle=c?"rgba(90,230,255,0.5)":"rgba(255,90,220,0.48)",i.lineWidth=1.2+o()*1.8,i.beginPath();let l=o()*512,d=o()*512;i.moveTo(l,d);const u=5+Math.floor(o()*6);for(let h=0;h<u;h++)l+=(o()-.5)*120,d+=(o()-.5)*120,i.lineTo(l,d);i.stroke(),i.strokeStyle=c?"rgba(90,230,255,0.11)":"rgba(255,90,220,0.1)",i.lineWidth=6+o()*4,i.stroke()}const r=new yt(e);return r.wrapS=Dt,r.wrapT=Dt,r},!0)}const _g=28932,ol=420,aI=[{name:"rift-nebula-magenta",colors:["rgba(160,20,140,1)","rgba(255,80,220,1)"],position:new M(140,60,60),scale:[170,130],opacity:.22},{name:"rift-nebula-teal",colors:["rgba(10,90,110,1)","rgba(60,220,210,1)"],position:new M(-160,50,-20),scale:[190,145],opacity:.19},{name:"rift-nebula-violet",colors:["rgba(60,10,120,1)","rgba(140,80,255,1)"],position:new M(30,90,160),scale:[160,120],opacity:.16}];function cI(n){n.background=new St("#07030f"),n.fog=new Ur(722200,40,160);const t=Oe(_g),e=vf({count:3400,xHalf:ol/2,yHalf:ol/2,zMin:-ol/2,span:ol,sizeMin:1.1,sizeMax:3.4,spherical:!0,rand:t});rI(e,_g+1),n.add(e);const i=N1(n,aI);for(const s of i.sprites)s.material.fog=!1,s.material.needsUpdate=!0;let o=0;return{stars:e,nebulae:i,update(s){o+=s,xf(e,o,0),i.tick(s*.6)},dispose(){I1(e),i.dispose()}}}const lI=31665,ar=22.5,Mg=2.4,cr=6,Bn={x:37.5,z:0},wg=1.1,mr=ar,wl=Bn.x-cr,yl=1.2,yg={low:Vn("#2a1a42"),mid:Vn("#553875"),high:Vn("#bda6e6")},td=n=>Math.max(0,Math.min(1,n));function bg(n,t){const e=t<.5?eo(n.low,n.mid,t*2):eo(n.mid,n.high,(t-.5)*2);return[e.r/255,e.g/255,e.b/255]}function Zu(n,t,e,i,o){const s=[],r=[],a=[],c=i(0,0);s.push(0,c,0),r.push(...bg(yg,td(c/o)));for(let h=1;h<=t;h++){const f=h/t*n;for(let m=0;m<e;m++){const v=m/e*Math.PI*2,p=Math.cos(v)*f,g=Math.sin(v)*f,S=i(p,g);s.push(p,S,g),r.push(...bg(yg,td(S/o)))}}for(let h=0;h<e;h++)a.push(0,1+h,1+(h+1)%e);for(let h=1;h<t;h++){const f=1+(h-1)*e,m=1+h*e;for(let v=0;v<e;v++){const p=f+v,g=f+(v+1)%e,S=m+v,x=m+(v+1)%e;a.push(p,S,g,g,S,x)}}const l=new ce;l.setAttribute("position",new oe(s,3)),l.setAttribute("color",new oe(r,3)),l.setIndex(a),l.computeVertexNormals();const d=new Ft({vertexColors:!0,roughness:.88,metalness:.04,emissive:new St("#1c1030"),emissiveIntensity:1}),u=new L(l,d);return u.receiveShadow=!0,u}function Ku(n,t,e,i){const o=new zo(n,t,9,3,!1);o.rotateX(Math.PI);const s=Oe(e),r=o.attributes.position;for(let d=0;d<r.count;d++){const u=r.getY(d),h=td((t/2-u)/t),f=1+s.signed(.2+h*.3);r.setX(d,r.getX(d)*f),r.setZ(d,r.getZ(d)*f)}o.computeVertexNormals();const a=tx(e),c=new Ft({map:a,emissiveMap:a,emissive:new St("#a06ad4"),emissiveIntensity:.68,color:new St("#6a5584"),roughness:.92,metalness:.05}),l=new L(o,c);return l.position.y=i-t/2,l}function dI(n,t,e){return{minX:n.minX+t,maxX:n.maxX+t,minY:n.minY,maxY:n.maxY,minZ:n.minZ+e,maxZ:n.maxZ+e}}function Tg(n,t,e,i,o){return n.filter(s=>{const r=(s.minX+s.maxX)/2-t,a=(s.minZ+s.maxZ)/2-e,c=Math.atan2(Math.sin(Math.atan2(a,r)-i),Math.cos(Math.atan2(a,r)-i));return Math.abs(c)>o})}function uI(){const e=(wl-mr)/6,i=[];for(const o of[-1,1]){const s=o*(yl+.15);for(let r=0;r<6;r++){const a=mr+r*e;i.push({minX:a-.1,maxX:a+e*1.15,minY:-2,maxY:6,minZ:s-.35,maxZ:s+.35})}}return i}function hI(){const n=new Bt;n.name="rift-islands";const t=[],e=z=>{z.mesh.geometry.dispose(),z.mesh.material.dispose()},i={low:"#2a1a42",mid:"#553875",high:"#bda6e6"},o=yr({seed:28929,radius:ar,maxHeight:Mg,segments:48,colorRamp:i}),s=yr({seed:28930,radius:cr,maxHeight:wg,segments:32,colorRamp:i});e(o),e(s);const r=Zu(ar,16,48,o.groundHeight,Mg);r.name="rift-main-island",n.add(r);const a=Ku(ar*.94,15,28945,.5);n.add(a),t.push(()=>{r.geometry.dispose(),r.material.dispose(),a.geometry.dispose(),a.material.dispose()});const c=Zu(cr,10,32,s.groundHeight,wg);c.name="rift-side-island",c.position.set(Bn.x,0,Bn.z),n.add(c);const l=Ku(cr*.9,7,28946,.4);l.position.set(Bn.x,0,Bn.z),n.add(l),t.push(()=>{c.geometry.dispose(),c.material.dispose(),l.geometry.dispose(),l.material.dispose()});const d=o.groundHeight(ar,0),u=s.groundHeight(-cr,0),h=10,f=[],m=[],v=[];for(let z=0;z<=h;z++){const B=z/h,V=gn.lerp(mr,wl,B),j=gn.lerp(d,u,B)+Math.sin(Math.PI*B)*.35;f.push(V,j,-yl,V,j,yl),m.push(B,0,B,1)}for(let z=0;z<h;z++){const B=z*2,V=B+1,j=B+2,Y=B+3;v.push(B,j,V,V,j,Y)}const p=new ce;p.setAttribute("position",new oe(f,3)),p.setAttribute("uv",new oe(m,2)),p.setIndex(v),p.computeVertexNormals();const g=tx(lI);g.repeat.set(4,1);const S=new Ft({map:g,emissiveMap:g,color:"#4a3468",emissive:"#57e6ff",emissiveIntensity:.55,roughness:.32,metalness:.18,transparent:!0,opacity:.95,side:me}),x=new L(p,S);x.name="rift-bridge",n.add(x),t.push(()=>{p.dispose(),S.dispose()});const w=Tg(o.boundaryColliders,0,0,0,gn.degToRad(14)),E=s.boundaryColliders.map(z=>dI(z,Bn.x,Bn.z)),b=Tg(E,Bn.x,Bn.z,Math.PI,gn.degToRad(16)),T=[...w,...b,...uI()],C=[],y=[{seed:28961,radius:4.2,base:new M(12,11,22),amp:new M(1.4,.6,1.1),speed:.09,phase:0},{seed:28962,radius:3.1,base:new M(32,13,-16),amp:new M(1,.8,1.3),speed:.07,phase:2.1},{seed:28963,radius:3.6,base:new M(-24,5,12),amp:new M(1.2,.5,.9),speed:.11,phase:4.3}];for(const z of y){const B=yr({seed:z.seed,radius:z.radius,maxHeight:.6,segments:20,colorRamp:i});e(B);const V=Zu(z.radius,6,18,B.groundHeight,.6),j=Ku(z.radius*.85,z.radius*1.3,z.seed+1,.25),Y=new Bt;Y.add(V,j),Y.position.copy(z.base),n.add(Y),t.push(()=>{V.geometry.dispose(),V.material.dispose(),j.geometry.dispose(),j.material.dispose()}),C.push({grp:Y,base:z.base.clone(),amp:z.amp,speed:z.speed,phase:z.phase})}let _=0;const R=o.groundHeight(0,0),D=s.groundHeight(0,0);function N(z,B){if(Math.hypot(z,B)<=ar+.5)return o.groundHeight(z,B);if(z>=mr-.5&&z<=wl+.5&&Math.abs(B)<=yl+.6){const Y=td((z-mr)/(wl-mr));return gn.lerp(d,u,Y)+Math.sin(Math.PI*Y)*.35}return Math.hypot(z-Bn.x,B-Bn.z)<=cr+.5?s.groundHeight(z-Bn.x,B-Bn.z):o.groundHeight(z,B)}return{group:n,groundHeight:N,boundaryColliders:T,mainCenterTop:R,sideCenterTop:D,update(z){_+=z;for(const B of C)B.grp.position.set(B.base.x+Math.sin(_*B.speed+B.phase)*B.amp.x,B.base.y+Math.sin(_*B.speed*1.3+B.phase*1.7)*B.amp.y,B.base.z+Math.cos(_*B.speed+B.phase)*B.amp.z)},dispose(){for(const z of t)z()}}}const gr=[[.62,.35,1],[1,.32,.86],[.35,.95,1]],fI=1.6,pI=1.15,mI=.16,gI=.1,vI=`
attribute float aPhase;
attribute float aClusterDist;
attribute vec3 aColor;
attribute float aBase;
uniform float uTime;
varying vec3 vColor;
varying float vWave;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
void main() {
  vColor = aColor;
  vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vWorldNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  float localWave = sin(uTime * ${fI.toFixed(2)} - aPhase * ${pI.toFixed(2)});
  float globalPulse = pow(max(0.0, cos(uTime * ${mI.toFixed(2)} - aClusterDist * ${gI.toFixed(2)})), 10.0);
  vWave = aBase * (0.5 + 0.5 * localWave) * 0.7 + globalPulse * 1.7;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}`,xI=`
precision highp float;
varying vec3 vColor;
varying float vWave;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
void main() {
  float fresnel = pow(1.0 - clamp(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0, 1.0), 2.2);
  vec3 core = vColor * (0.5 + vWave);
  vec3 rim = vColor * fresnel * 1.5;
  // F13 (Stage E): cap the peak (never touches the wave math above) — when a
  // cluster sits close to camera, many overlapping crystals each hitting the
  // old uncapped peak bloomed into one solid mass. Capping keeps individual
  // diamond silhouettes readable through bloom at any distance.
  vec3 litColor = min(core + rim, vec3(2.0));
  gl_FragColor = vec4(litColor, 1.0);
}`,SI=`
attribute vec3 aSeed; // x:freq, y:phase, z:amp
attribute vec3 aColor;
uniform float uTime;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vColor = aColor;
  float f = aSeed.x, p = aSeed.y, amp = aSeed.z;
  vec3 pos = position + vec3(
    sin(uTime * f + p) * amp,
    sin(uTime * f * 1.3 + p * 1.7) * amp * 0.6,
    cos(uTime * f * 0.8 + p * 2.1) * amp
  );
  vAlpha = 0.45 + 0.45 * sin(uTime * f * 2.0 + p);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 6.0 * (40.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`,_I=`
precision highp float;
uniform sampler2D map;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 tex = texture2D(map, gl_PointCoord);
  gl_FragColor = vec4(vColor * 1.3, tex.a * vAlpha * 0.85);
}`,MI=[{kind:"radial",id:"rift-prism-chorus",center:[2,5],count:10,sizeMin:1.1,sizeMax:2.8,spread:3.6},{kind:"radial",id:"rift-cluster-b",center:[12,-8],count:6,sizeMin:.7,sizeMax:1.8,spread:2.4},{kind:"radial",id:"rift-cluster-c",center:[-10,10],count:5,sizeMin:.6,sizeMax:1.6,spread:2},{kind:"radial",id:"rift-cluster-d",center:[-13,-11],count:5,sizeMin:.6,sizeMax:1.5,spread:2},{kind:"radial",id:"rift-cluster-e",center:[-6,-9],count:4,sizeMin:.5,sizeMax:1.3,spread:1.6},{kind:"radial",id:"rift-cluster-relic",center:[38.5,-2.2],count:4,sizeMin:.5,sizeMax:1.2,spread:1.6},{kind:"radial",id:"rift-cluster-relic-b",center:[36.5,2.6],count:3,sizeMin:.4,sizeMax:.9,spread:1},{kind:"ring",id:"rift-main-rail",centerX:0,centerZ:0,radius:21.6,count:22,excludeAngle:0,excludeHalfWindow:.28,size:.55},{kind:"ring",id:"rift-side-rail",centerX:37.5,centerZ:0,radius:5.4,count:12,excludeAngle:Math.PI,excludeHalfWindow:.32,size:.4},{kind:"line",id:"rift-bridge-rail-a",x0:23.2,x1:31.8,z:-1.35,count:6,size:.4},{kind:"line",id:"rift-bridge-rail-b",x0:23.2,x1:31.8,z:1.35,count:6,size:.4}];function wI(n,t){const e=Oe(n),i=new Ba(1,0).toNonIndexed();i.computeVertexNormals();const o=[],s=[];function r(x,w,E,b,T){const C=Math.hypot(x,w),y=gr[e.int(0,gr.length-1)];for(const _ of E)o.push({x:_.x,y:t(_.x,_.z),z:_.z,size:_.size,rotY:e.range(0,Math.PI*2),phase:_.localR,clusterDist:C,hue:e.pick([.6,.25,.15])===0?y:gr[e.int(0,gr.length-1)],base:e.range(.75,1.15)});s.push({id:b,position:new M(x,t(x,w),w),radius:T})}for(const x of MI)if(x.kind==="radial"){const w=[];for(let E=0;E<x.count;E++){const b=e.range(0,Math.PI*2),T=Math.sqrt(e())*x.spread,C=x.center[0]+Math.cos(b)*T,y=x.center[1]+Math.sin(b)*T;w.push({x:C,z:y,size:e.range(x.sizeMin,x.sizeMax),localR:T})}r(x.center[0],x.center[1],w,x.id,x.spread)}else if(x.kind==="ring"){const w=[];for(let E=0;E<x.count;E++){const b=E/x.count*Math.PI*2,T=Math.atan2(Math.sin(b-x.excludeAngle),Math.cos(b-x.excludeAngle));if(Math.abs(T)<x.excludeHalfWindow)continue;const C=x.centerX+Math.cos(b)*x.radius,y=x.centerZ+Math.sin(b)*x.radius;w.push({x:C,z:y,size:x.size*e.range(.8,1.2),localR:b*x.radius})}r(x.centerX,x.centerZ,w,x.id,x.radius)}else{const w=[];for(let E=0;E<x.count;E++){const b=E/Math.max(1,x.count-1),T=gn.lerp(x.x0,x.x1,b);w.push({x:T,z:x.z,size:x.size*e.range(.85,1.15),localR:b*(x.x1-x.x0)})}r((x.x0+x.x1)/2,x.z,w,x.id,(x.x1-x.x0)/2)}const a=new tn(i,yI(),o.length);a.name="rift-crystals";const c=new Float32Array(o.length),l=new Float32Array(o.length),d=new Float32Array(o.length*3),u=new Float32Array(o.length),h=new Lt,f=new He,m=new Je;o.forEach((x,w)=>{m.set(e.signed(.12),x.rotY,e.signed(.12)),f.setFromEuler(m),h.compose(new M(x.x,x.y+x.size,x.z),f,new M(x.size*.42,x.size*1.05,x.size*.42)),a.setMatrixAt(w,h),c[w]=x.phase,l[w]=x.clusterDist,u[w]=x.base,d[w*3]=x.hue[0],d[w*3+1]=x.hue[1],d[w*3+2]=x.hue[2]}),a.instanceMatrix.needsUpdate=!0,i.setAttribute("aPhase",new dr(c,1)),i.setAttribute("aClusterDist",new dr(l,1)),i.setAttribute("aColor",new dr(d,3)),i.setAttribute("aBase",new dr(u,1));const v=s.find(x=>x.id==="rift-prism-chorus")??s[0];s.forEach(x=>{x.id===v.id&&(x.biggest=!0)});const p=bI(s.filter(x=>x.radius<=4),e),g=[a.material,p.material];let S=0;return{mesh:a,motes:p,clusters:s,biggest:v,update(x){S+=x,a.material.uniforms.uTime.value=S,p.material.uniforms.uTime.value=S},dispose(){i.dispose(),p.geometry.dispose();for(const x of g)x.dispose()}}}function yI(){return new de({uniforms:{uTime:{value:0}},vertexShader:vI,fragmentShader:xI})}function bI(n,t){const i=Math.max(1,n.length)*10,o=new Float32Array(i*3),s=new Float32Array(i*3),r=new Float32Array(i*3);let a=0;for(const u of n.length?n:[{position:new M(0,1,0),radius:3,id:"x"}])for(let h=0;h<10;h++,a++){const f=t.range(0,Math.PI*2),m=t.range(.4,u.radius*.9+1);o[a*3]=u.position.x+Math.cos(f)*m,o[a*3+1]=u.position.y+t.range(.4,2.4),o[a*3+2]=u.position.z+Math.sin(f)*m,s[a*3]=t.range(.15,.5),s[a*3+1]=t.range(0,Math.PI*2),s[a*3+2]=t.range(.3,.9);const v=gr[t.int(0,gr.length-1)];r[a*3]=v[0],r[a*3+1]=v[1],r[a*3+2]=v[2]}const c=new ce;c.setAttribute("position",new re(o,3)),c.setAttribute("aSeed",new re(s,3)),c.setAttribute("aColor",new re(r,3));const l=new de({uniforms:{uTime:{value:0},map:{value:$1()}},vertexShader:SI,fragmentShader:_I,transparent:!0,depthWrite:!1,blending:Ae}),d=new io(c,l);return d.name="rift-motes",d.frustumCulled=!1,d}const se={spawn:{x:-13,z:-2},portal:{x:-17,z:-4},waterfall:{x:17,z:8},undersideView:{x:0,z:-20.5},relic:{x:39.5,z:1}},ex=7.2,sl=90,TI=`
attribute float aY0;
attribute vec2 aJitter;
uniform float uTime;
varying float vAlpha;
void main() {
  float H = ${ex.toFixed(1)};
  float y = mod(aY0 - uTime * 1.6, H);
  vec3 pos = position + vec3(aJitter.x, y, aJitter.y);
  vAlpha = smoothstep(0.0, 0.9, y) * smoothstep(H, H - 1.4, y);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 5.0 * (36.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`,EI=`
precision highp float;
uniform sampler2D map;
uniform vec3 uColorLo;
uniform vec3 uColorHi;
varying float vAlpha;
void main() {
  vec4 tex = texture2D(map, gl_PointCoord);
  vec3 col = mix(uColorLo, uColorHi, vAlpha);
  gl_FragColor = vec4(col * 1.4, tex.a * vAlpha * 0.9);
}`;function AI(n,t,e){const i=new Bt;i.name="rift-features";const o=[],s=[],r=n(se.spawn.x,se.spawn.z),a=new wt(1.55,1.75,.14,6),c=new Ft({color:"#241338",emissive:"#6a4fd0",emissiveIntensity:.22,roughness:.3,metalness:.2}),l=new L(a,c);l.position.set(se.spawn.x,r+.08,se.spawn.z),i.add(l),o.push(()=>{a.dispose(),c.dispose()}),s.push({id:"rift-prism-chorus",prompt:"Scan PRISM CHORUS",radius:3.4,position:e.position.clone().add(new M(0,1,0)),onInteract:()=>{const J=pi("rift-prism-chorus");en(J?"CATALOGUED · PRISM CHORUS":"KNOWN · PRISM CHORUS")}});const d=new M(27,n(27,0)+1,0);s.push({id:"rift-bridge",prompt:"Scan THE THRESHOLD SPAN",radius:3.2,position:d,onInteract:()=>{const J=pi("rift-bridge");en(J?"CATALOGUED · THE THRESHOLD SPAN":"KNOWN · THE THRESHOLD SPAN")}});const u=n(se.undersideView.x,se.undersideView.z),h=new zo(.35,1.1,6),f=new Ft({color:"#2a1840",emissive:"#5ae6ff",emissiveIntensity:.6,roughness:.4}),m=new L(h,f);m.position.set(se.undersideView.x,u+.55,se.undersideView.z),i.add(m),o.push(()=>{h.dispose(),f.dispose()}),s.push({id:"rift-underside",prompt:"Scan THE HOLLOW ROOT",radius:3,position:m.position.clone(),onInteract:()=>{const J=pi("rift-underside");en(J?"CATALOGUED · THE HOLLOW ROOT":"KNOWN · THE HOLLOW ROOT")}});const v=n(se.waterfall.x,se.waterfall.z),p=new Float32Array(sl*3),g=new Float32Array(sl),S=new Float32Array(sl*2),x=(()=>{let J=29173;return()=>(J=J*1664525+1013904223>>>0,J/4294967296)})();for(let J=0;J<sl;J++){p[J*3]=se.waterfall.x,p[J*3+1]=v-2.2,p[J*3+2]=se.waterfall.z,g[J]=x()*ex;const k=x()*Math.PI*2,$=x()*.55;S[J*2]=Math.cos(k)*$,S[J*2+1]=Math.sin(k)*$}const w=new ce;w.setAttribute("position",new re(p,3)),w.setAttribute("aY0",new re(g,1)),w.setAttribute("aJitter",new re(S,2));const E=new de({uniforms:{uTime:{value:0},map:{value:t},uColorLo:{value:new St("#7a3fff")},uColorHi:{value:new St("#5ae6ff")}},vertexShader:TI,fragmentShader:EI,transparent:!0,depthWrite:!1,blending:Ae}),b=new io(w,E);b.name="rift-light-falls",b.frustumCulled=!1,i.add(b),o.push(()=>{w.dispose(),E.dispose()}),s.push({id:"rift-light-falls",prompt:"Scan the LIGHTFALL",radius:3.6,position:new M(se.waterfall.x,v+1.5,se.waterfall.z),onInteract:()=>{const J=pi("rift-light-falls");en(J?"CATALOGUED · LIGHTFALL":"KNOWN · LIGHTFALL")}});const T=n(se.relic.x,se.relic.z),C=new wt(.55,.7,.9,8),y=new Ft({color:"#241338",emissive:"#4a2d63",emissiveIntensity:.25,roughness:.6}),_=new L(C,y);_.position.set(se.relic.x,T+.45,se.relic.z),i.add(_),o.push(()=>{C.dispose(),y.dispose()});const R=new Ba(.42,0).toNonIndexed();R.computeVertexNormals();const D=new Ft({color:"#e6d8ff",emissive:"#c060ff",emissiveIntensity:1.5,roughness:.15,metalness:.1,toneMapped:!1}),N=new L(R,D),z=T+1.6;N.position.set(se.relic.x,z,se.relic.z),N.scale.set(.9,1.8,.9),i.add(N),o.push(()=>{R.dispose(),D.dispose()});const B=N.position.clone(),V={id:"rift-relic",prompt:"Take the RIFT SHARD",radius:2.6,position:B,onInteract:()=>{of("rift")?(N.visible=!1,en("RELIC RECOVERED · RIFT SHARD")):en("RIFT SHARD ALREADY HELD")}};Bo().relics.includes("rift")?N.visible=!1:s.push(V);let Y=0;return{group:i,interactables:s,relicPosition:B,update(J){Y+=J,E.uniforms.uTime.value=Y,N.visible&&(N.rotation.y=Y*.8,N.position.y=z+Math.sin(Y*1.1)*.18,B.y=N.position.y)},dispose(){for(const J of o)J()}}}const CI=29127;function RI(){const n=new Fr,t=cI(n),e=hI();n.add(e.group);const i=e.groundHeight,o=wI(CI,i);n.add(o.mesh,o.motes);const s=AI(i,$1(),o.biggest);n.add(s.group);const r=new Ha(9072600,2364726,.7),a=new De(11563263,50,30,2);a.position.set(2,i(2,5)+2.2,5);const c=new De(5957375,30,25,2);c.position.set(se.spawn.x,i(se.spawn.x,se.spawn.z)+3,se.spawn.z);const l=new De(13660415,55,22,2);l.position.set(se.relic.x,i(se.relic.x,se.relic.z)+2.5,se.relic.z);const d=new De(16734940,30,24,2);d.position.set(12,i(12,-8)+1.8,-8);const u=new De(8015824,70,55,2);u.position.set(25,-8,5),n.add(r,a,c,l,d,u);const h=Sd(2.2,2.8),f=se.portal;h.mesh.position.set(f.x,i(f.x,f.z)+1.55,f.z),h.mesh.rotation.y=Math.atan2(se.spawn.x-f.x,se.spawn.z-f.z),n.add(h.mesh);const m=ms([{id:"rift-jelly",scanName:"VOIDBELL",lore:"A placid jelly that mistakes starlight for water.",plan:"floater",sizeM:1.2,palette:{primary:"#8a6fe8",secondary:"#c8b8ff",emissive:"#5ae6ff"},gaitHz:.45,temperament:"placid",count:3,seed:29089,roamRadius:30},{id:"rift-mite",scanName:"SHARDLING",lore:"A skittish gem-bodied mite that grazes on crystal resonance.",plan:"skitterer",sizeM:.25,palette:{primary:"#b040d8",secondary:"#5ae6ff",emissive:"#ff5adc"},gaitHz:2.2,temperament:"skittish",count:6,seed:29090,roamRadius:20}],i,new M(0,0,0));n.add(m.group);const v=i(-19.5,-9.5)+1.7,p=i(26.5,0)+1.7,g=[{name:"rift",position:new M(-19.5,v,-9.5),lookAt:new M(6,v+1.4,2)},{name:"rift-qa",position:new M(26.5,p,0),lookAt:new M(39.5,p-.4,1)}];return{id:"rift",scene:n,colliders:[...e.boundaryColliders],interactables:[h.interactable,...s.interactables,...m.interactables],cameras:g,spawn:{position:new M(se.spawn.x,i(se.spawn.x,se.spawn.z)+1.7,se.spawn.z),lookAt:new M(8,i(8,1)+1.2,1)},groundHeight:i,update(S,x){m.update(S,x),e.update(S),o.update(S),s.update(S),t.update(S)},dispose(){h.dispose(),m.dispose(),s.dispose(),o.dispose(),e.dispose(),t.dispose(),n.remove(r,a,c,l,d)}}}function PI(n){const t={id:"ship",scene:n.scene,colliders:n.shipColliders,interactables:n.shipInteractables,cameras:[],spawn:gP(),groundHeight:()=>0,update:()=>{},dispose:()=>{}};W3(n.camera,n.bloom);const e=new M(0,1,0),i=new Lt;ZR({renderer:n.renderer,getScene:r=>V3(r),getDestination:r=>{const a=X3(r);return a?(i.lookAt(a.position,a.lookAt,e),i.setPosition(a.position),i):null},requestSwitch:r=>{Oh(r)}}),ra(t);const o=new URLSearchParams(window.location.search).get("world");o==="dev"&&ra($L()),ra(LD()),ra(sI()),ra(RI());const s=nb();if(window.__camNames=s,o&&vs(o))Oh(o,{instant:!0});else{const r=s.includes("corridor")?"corridor":s[0];r&&gv(r)}}const Eg=1.7;function LI(n){const{camera:t,scene:e}=n,i={teleport(o,s,r){t.position.set(o,Eg,r),Math.abs(s-Eg)>.5&&(t.position.y=s),t.lookAt(o,t.position.y-5,r+.01)},interact(){return H3()},getState(){const o=Xe();return{clock:o.shipMinutes,energy:o.energy,hunger:o.hunger,clockString:`${String(Math.floor(o.shipMinutes/60)%24).padStart(2,"0")}:${String(Math.floor(o.shipMinutes)%60).padStart(2,"0")}`,questStep:No()}},getDoorOpen(o){return kl(o)},getFridgeState(){return KC()},resetFridge(){jC()},setHunger(o){ud(o)},getScan(){return n.getScanData()},forceDoorAutoCloseCheck(){return UC()},questRevealAndReadPanel(){return F5()},questAdvanceViaBreaker(){return qC()},getActiveWorld(){return P1()},switchWorld(o){return Oh(o,{instant:!0})},getCodex(){return Bo()},getPlayerPos(){return{x:t.position.x,y:t.position.y,z:t.position.z}},getActiveInteractables(){return k3()},getRelicSocketColor(o){const s=e.getObjectByName(`relic-socket-${o}`);if(!s)return null;const r=s.material;return{r:r.color.r,g:r.color.g,b:r.color.b}}};window.__test=i}const hn=new Ty({antialias:!0});hn.setPixelRatio(Math.min(devicePixelRatio,1.5));hn.setSize(window.innerWidth,window.innerHeight);Ab(hn);hn.toneMapping=Wh;hn.toneMappingExposure=1;hn.outputColorSpace=Ke;!Oa&&!mv&&(hn.shadowMap.enabled=!0,hn.shadowMap.type=Lg);document.body.appendChild(hn.domElement);const Uo=new Fr;Uo.background=new St(658192);{const n=new sh(hn);n.compileEquirectangularShader();const t=n.fromScene(new Ky).texture;Uo.environment=t,Uo.environmentIntensity=.18,n.dispose()}const _n=new Cn(75,window.innerWidth/window.innerHeight,.1,2e3);tb();ob();eb(_n);jy(hn);ub(hn,_n);xb();Tb();lb();const ju=kA(),no=R5(Uo);BC(()=>no.planet.getScanData?.()??null);const _f=mL(hn,Uo,_n);D3(_n,hn,no.colliders);U3(_n,Uo);for(const n of no.interactables){const t=n.onInteract.bind(n);n.id==="stove"?n.onInteract=e=>{Ee("eat"),t(e)}:(n.id==="bunk-a"||n.id==="bunk-b")&&(n.onInteract=e=>{Ee("ui"),t(e)})}C1(no.interactables);const nx=B5();C1(nx);PI({scene:Uo,camera:_n,renderer:hn,bloom:_f,shipColliders:no.colliders,shipInteractables:[...no.interactables,...nx]});window.addEventListener("resize",()=>{_n.aspect=window.innerWidth/window.innerHeight,_n.updateProjectionMatrix(),hn.setSize(window.innerWidth,window.innerHeight),_f.resize(window.innerWidth,window.innerHeight)});let ix;const DI=new Promise(n=>{ix=n});window.__ready=DI;const II=performance.now();LI({camera:_n,scene:Uo,getScanData:()=>no.planet.getScanData?.()??null});let Ag="corridor";const NI={cockpit:"COCKPIT",corridor:"CORRIDOR",quarters:"CREW QUARTERS",galley:"GALLEY",engineering:"ENGINEERING",cargo:"CARGO"};let Cg=!0,Rg=performance.now();hn.info.autoReset=!1;function ox(n){requestAnimationFrame(ox),hn.info.reset(),Jy(n);const t=Math.min((n-Rg)/1e3,.05);Rg=n;const e=(n-II)/1e3;I3(n),T3(_n,e,Tm()),cb(t),z3(),P5(_n,e);const i=P1(),o=G3();if(i==="ship"?(no.planet.tick(e),bP(no.starfield,e)):o.update(t,_n.position),ju.setWorldBed(i==="verdant"||i==="ashfall"||i==="rift"?i:null),t3(t,_n.position,_n,o.scene),hb(n),ju.tick(Tm()),i==="ship"){const r=FA(_n.position.x,_n.position.z);r!==Ag&&(ju.setRoom(r),en(NI[r]),Ag=r)}const s=Xe();Sb(s.shipMinutes,s.energy,s.hunger,i),_f.render(),Cg&&(Cg=!1,ix())}requestAnimationFrame(ox);
