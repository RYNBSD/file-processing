var ae=Object.defineProperty;var se=Object.getOwnPropertySymbols;var le=Object.prototype.hasOwnProperty,de=Object.prototype.propertyIsEnumerable;var ne=(r,e,t)=>e in r?ae(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,ie=(r,e)=>{for(var t in e||(e={}))le.call(e,t)&&ne(r,t,e[t]);if(se)for(var t of se(e))de.call(e,t)&&ne(r,t,e[t]);return r};var L=(r,e)=>{for(var t in e)ae(r,t,{get:e[t],enumerable:!0})};var n=(r,e,t)=>new Promise((s,a)=>{var i=c=>{try{f(t.next(c))}catch(u){a(u)}},o=c=>{try{f(t.throw(c))}catch(u){a(u)}},f=c=>c.done?s(c.value):Promise.resolve(c.value).then(i,o);f((t=t.apply(r,e)).next())});var te={};L(te,{Audio:()=>E,CSV:()=>k,Image:()=>I,PDF:()=>M,PDF_experimental:()=>H,Text:()=>C,Video:()=>z});var _={};L(_,{FilterFile:()=>d,TmpFile:()=>y,isArrayOfBuffer:()=>he,isArrayOfString:()=>ge,isUrl:()=>Y,loader:()=>p,parser:()=>g});import{Mutex as R}from"async-mutex";import v,{Node as ke}from"@ryn-bsd/is-file";var g={};L(g,{toBase64:()=>me,toBuffer:()=>F,toFile:()=>Ce,toReadable:()=>pe});import{isAnyArrayBuffer as xe,isUint8Array as Pe}from"util/types";import{Readable as fe}from"stream";import ce from"fs";function he(r){if(!Array.isArray(r))return!1;for(let e of r)if(!Buffer.isBuffer(e))return!1;return!0}function ge(r){if(!Array.isArray(r))return!1;for(let e of r)if(typeof e!="string")return!1;return!0}function Y(r){if(typeof r!="string")return!1;try{return new URL(r),!0}catch(e){return!1}}import{any2buffer as be,array2buffer as Be,buffer2readable as Fe,isReadable as ue,isReadableStream as ve,isStream as Se,readable2buffer as Oe,readablestream2buffer as De,stream2buffer as Ae,string2buffer as Re,uint8array2buffer as Ie}from"@ryn-bsd/from-buffer-to";import Z from"is-base64";var p={};L(p,{loadDir:()=>X,loadFile:()=>N,loadGlob:()=>Te,loadUrl:()=>G});import Q from"fs";import oe from"path";import ye from"fast-glob";import{url2buffer as we}from"@ryn-bsd/from-buffer-to";function N(r){return n(this,null,function*(){return Array.isArray(r)?Promise.all(r.map(e=>N(e))):Q.promises.readFile(r)})}function X(r){return n(this,null,function*(){if(Array.isArray(r))return Promise.all(r.map(t=>X(t)));let e=yield Q.promises.readdir(r);return N(e.map(t=>oe.join(r,t)))})}function Te(r,e){return n(this,null,function*(){var i;let t=(i=e==null?void 0:e.cwd)!=null?i:process.cwd(),s=yield ye(r,e);return(yield Promise.all(s.map(o=>n(this,null,function*(){let f=oe.join(t,o),c=yield Q.promises.stat(f);return c.isFile()?N(f):c.isDirectory()?X(f):null})))).filter(o=>o!==null)})}function G(r){return n(this,null,function*(){return Array.isArray(r)?Promise.all(r.map(e=>G(e))):we(r)})}function F(r){return n(this,null,function*(){return Array.isArray(r)?Promise.all(r.map(e=>F(e))):Buffer.isBuffer(r)?r:Pe(r)?Ie(r):xe(r)?Be(r):Se(r)?Ae(r):ve(r)?De(r):ue(r)&&fe.isReadable(r)?Oe(r):typeof r=="string"?Z(r,{allowMime:!0,mimeRequired:!0})?Buffer.from(r,"base64url"):Z(r,{allowMime:!1})?Buffer.from(r,"base64"):(yield ce.promises.stat(r)).isFile()?N(r):Re(r,!1):Y(r)?G(r):be(r)})}function pe(r){return n(this,null,function*(){if(Array.isArray(r))return Promise.all(r.map(t=>pe(t)));if(ue(r)&&fe.isReadable(r))return r;let e=yield F(r);return Fe(e)})}function me(r,e="base64"){return n(this,null,function*(){return Array.isArray(r)?Promise.all(r.map(s=>me(s))):typeof r=="string"&&Z(r)?r:(yield F(r)).toString(e)})}function Ce(r){return n(this,null,function*(){yield Promise.all(r.map(e=>n(this,null,function*(){let t=yield F(e.input);return ce.promises.writeFile(e.path,t)})))})}var d=class r{constructor(...e){this.input=e}application(){return n(this,null,function*(){let{applications:e}=yield r.filter(...this.input);return e})}audio(){return n(this,null,function*(){let{audios:e}=yield r.filter(...this.input);return e})}font(){return n(this,null,function*(){let{fonts:e}=yield r.filter(...this.input);return e})}image(){return n(this,null,function*(){let{images:e}=yield r.filter(...this.input);return e})}model(){return n(this,null,function*(){let{models:e}=yield r.filter(...this.input);return e})}text(){return n(this,null,function*(){let{texts:e}=yield r.filter(...this.input);return e})}video(){return n(this,null,function*(){let{videos:e}=yield r.filter(...this.input);return e})}custom(e){return n(this,null,function*(){let t=yield F(this.input);return(yield v.isCustom(t,e)).filter(a=>a.valid).map(a=>a.value)})}static filter(...e){return n(this,null,function*(){let t=yield F(e),s={applications:new R,audios:new R,fonts:new R,images:new R,models:new R,texts:new R,videos:new R},a={applications:[],audios:[],fonts:[],images:[],models:[],texts:[],videos:[]};return yield Promise.all(t.map(i=>n(this,null,function*(){if(yield v.isApplication(i)){let o=yield s.applications.acquire();a.applications.push(i),o()}else if(yield v.isAudio(i)){let o=yield s.audios.acquire();a.audios.push(i),o()}else if(yield v.isFont(i)){let o=yield s.fonts.acquire();a.fonts.push(i),o()}else if(yield v.isImage(i)){let o=yield s.images.acquire();a.images.push(i),o()}else if(yield v.isModel(i)){let o=yield s.models.acquire();a.models.push(i),o()}else if(yield v.isText(i)){let o=yield s.texts.acquire();a.texts.push(i),o()}else if(yield v.isVideo(i)){let o=yield s.videos.acquire();a.videos.push(i),o()}}))),a})}static type(e){return n(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(s=>r.type(s)));let t=yield F(e);return ke.type(t)})}static mime(e){return n(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(s=>r.mime(s)));let t=yield r.type(e);return t==null?void 0:t.mime})}static extension(e){return n(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(s=>r.extension(s)));let t=yield r.type(e);return t==null?void 0:t.ext})}};import{writeFile as Ee}from"fs/promises";import{randomUUID as ze}from"crypto";import Ve from"path";import{dir as Ne}from"tmp-promise";var j=class extends Error{constructor(e){super(e),Object.setPrototypeOf(this,new.target.prototype),Error.captureStackTrace(this)}};var Me=["Image","Text","Video","Audio","AV","PDF","CSV"],h=class r extends j{constructor(e,t){super(`${e} Processor: ${t}`)}static image(e){return new r("Image",e)}static video(e){return new r("Video",e)}static audio(e){return new r("Audio",e)}static av(e){return new r("AV",e)}static text(e){return new r("Text",e)}static pdf(e){return new r("PDF",e)}static csv(e){return new r("CSV",e)}static isProcessorError(e){return e instanceof r||typeof e!="undefined"&&typeof e=="object"&&e!==null&&"name"in e&&typeof e.name=="string"&&e.name===r.name&&"message"in e&&typeof e.message=="string"&&"processor"in e&&typeof e.processor=="string"&&Me.includes(e.processor)}};var Ue=["Filter","Tmp","Loader","Parser"],$=class r extends j{constructor(e,t){super(`${e} Processor Helper: ${t}`)}static filter(e){return new r("Filter",e)}static tmp(e){return new r("Tmp",e)}static loader(e){return new r("Loader",e)}static parser(e){return new r("Parser",e)}static isProcessorHelperError(e){return e instanceof r||typeof e!="undefined"&&typeof e=="object"&&e!==null&&"name"in e&&typeof e.name=="string"&&e.name===r.name&&"message"in e&&typeof e.message=="string"&&"helper"in e&&typeof e.helper=="string"&&Ue.includes(e.helper)}};var y=class r{constructor(...e){this.paths=[];this.files=e}createFn(e){return n(this,null,function*(){var i;let t=(i=yield d.extension(e))!=null?i:"";if(t.length===0)throw $.tmp("Unknown file when create");let s=r.generateFileName(t),a=Ve.join(this.tmp.path,s);yield Ee(a,e),this.paths.push(a)})}create(){return n(this,null,function*(){yield Promise.all(this.files.map(this.createFn.bind(this)))})}init(e){return n(this,null,function*(){return this.tmp=yield Ne(ie({unsafeCleanup:!0},e)),yield this.create(),this})}clean(){return n(this,null,function*(){yield this.tmp.cleanup(),this.paths.splice(0,this.paths.length)})}static generateFileName(e){return`${ze()}_${Date.now()}.${e}`}};import je from"fs";import He from"path";import Le from"fast-glob";import{createWorker as Ge}from"tesseract.js";import $e from"sharp";var m=class{constructor(){}static stream(e,t){return e.pipe(t)}};var I=class r extends m{constructor(...e){super(),this.images=e}get length(){return this.images.length}getImages(){return[...this.images]}setImages(e){return n(this,null,function*(){let s=(yield Promise.all(this.images.map((i,o)=>n(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),a=yield r.filter(...s);return this.images=a,this.length})}append(...e){return n(this,null,function*(){let t=yield r.filter(...e);return this.images.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.images.push(...t.getImages())}),this.length}clone(){return new r(...this.images)}clean(){this.images=[]}filter(){return n(this,null,function*(){return this.images=yield r.filter(...this.images),this.length})}metadata(){return n(this,null,function*(){return this.custom(e=>e.metadata())})}watermark(s){return n(this,arguments,function*(e,t={}){let{resize:a,gravity:i="center",alpha:o=.5,tile:f=!1,blend:c="over",premultiplied:u}=t,w=yield g.toBuffer(e),b=yield r.newSharp(w).resize(a).ensureAlpha(o).composite([{input:Buffer.from([0,0,0,Math.round(255*o)]),raw:{width:1,height:1,channels:4},tile:!0,blend:"dest-in"}]).toBuffer();return this.custom(T=>T.composite([{input:b,gravity:i,blend:c,tile:f,premultiplied:u}]).toBuffer({resolveWithObject:!0}))})}convert(e,t){return n(this,null,function*(){return this.custom(s=>s.toFormat(e,t).toBuffer({resolveWithObject:!0}))})}ocr(e){return n(this,null,function*(){let t=yield Ge(e),s=yield Promise.all(this.images.map(a=>t.recognize(a)));if(yield t.terminate(),process.env.NODE_ENV==="development"||process.env.NODE_ENV==="test"){let a=process.cwd(),i=yield Le("*.traineddata",{cwd:a});yield Promise.all(i.map(o=>je.promises.unlink(He.join(a,o))))}return s.map(a=>a.data)})}custom(e){return n(this,null,function*(){return Promise.all(this.images.map((t,s)=>n(this,null,function*(){return e(r.newSharp(t),s)})))})}static filter(...e){return n(this,null,function*(){return new d(...e).image()})}static justBuffer(e){return Array.isArray(e)?e.map(t=>r.justBuffer(t)):e.data}static fromFile(...e){return n(this,null,function*(){let t=yield p.loadFile(e);return r.new(t)})}static fromUrl(...e){return n(this,null,function*(){let t=yield p.loadUrl(e);return r.new(t)})}static newSharp(e,t){return $e(e,t).clone()}static new(e){return n(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw h.image("Non valid image");return new r(...t)})}static isImage(e){return e instanceof r}};import l from"zlib";import S from"crypto";var C=class r extends m{constructor(...e){super(),this.texts=e}get length(){return this.texts.length}get supportedHashes(){return S.getHashes()}get supportedCiphers(){return S.getCiphers()}getTexts(){return[...this.texts]}setTexts(e){return n(this,null,function*(){let s=(yield Promise.all(this.texts.map((a,i)=>n(this,null,function*(){return e(a,i)})))).filter(a=>Buffer.isBuffer(a)&&a.length>0);return this.texts=s,this.length})}append(...e){return n(this,null,function*(){let t=e.filter(s=>Buffer.isBuffer(s)&&s.length>0);return this.texts.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.texts.push(...t.getTexts())}),this.length}clone(){return new r(...this.texts)}clean(){this.texts=[]}filter(){return n(this,null,function*(){return this.texts=yield r.filter(...this.texts),this.length})}_charactersMap(e){let t=new Map,s=e.toString();for(let a of s){let i=a.charCodeAt(0);t.has(i)?t.set(i,t.get(i)+1):t.set(i,1)}return t}metadata(){return n(this,null,function*(){return this.custom(e=>({size:e.length,charactersMap:this._charactersMap(e)}))})}compressAsync(e,t){return n(this,null,function*(){return Promise.all(r.compress(this.texts,e,r.gzipAsync,r.deflateAsync,r.deflateRawAsync,r.brotliCompressAsync,t))})}decompressAsync(e,t){return n(this,null,function*(){return Promise.all(r.decompress(this.texts,e,r.gunzipAsync,r.inflateAsync,r.inflateRawAsync,r.brotliDecompressAsync,r.unzipAsync,t))})}compressStream(e,t){return n(this,null,function*(){let s=yield g.toReadable(this.texts);return r.compress(s,e,r.gzipStream,r.deflateStream,r.deflateRawStream,r.brotliCompressStream,t)})}decompressStream(e,t){return n(this,null,function*(){let s=yield g.toReadable(this.texts);return r.decompress(s,e,r.gunzipStream,r.inflateStream,r.inflateRawStream,r.brotliDecompressStream,r.unzipStream,t)})}compressSync(e,t){return r.compress(this.texts,e,r.gzipSync,r.deflateSync,r.deflateRawSync,r.brotliCompressSync,t)}decompressSync(e,t){return r.decompress(this.texts,e,r.gunzipSync,r.inflateSync,r.inflateRawSync,r.brotliDecompressSync,r.unzipSync,t)}isHashSupported(e){return this.supportedHashes.includes(e)}hash(e,t){return n(this,null,function*(){return this.custom(s=>S.createHash(e,t).update(s).digest())})}hmac(e,t,s){return n(this,null,function*(){return this.custom(a=>{switch(Buffer.isBuffer(t)){case!0:return S.createHmac(e,t,s).update(a).digest();default:{let i=S.randomBytes(32);return{key:i,hash:S.createHmac(e,i,s).update(a).digest()}}}})})}isCipherSupported(e){return this.supportedCiphers.includes(e)}cipher(i,o){return n(this,arguments,function*(e,t,s=null,a={}){return this.custom(f=>{let c=S.createCipheriv(e,t,s,a);return Buffer.concat([c.update(f),c.final()])})})}isDecipherSupported(e){return this.isCipherSupported(e)}decipher(i,o){return n(this,arguments,function*(e,t,s=null,a={}){return this.custom(f=>{let c=S.createDecipheriv(e,t,s,a);return Buffer.concat([c.update(f),c.final()])})})}custom(e){return n(this,null,function*(){return Promise.all(this.texts.map((t,s)=>n(this,null,function*(){return e(t,s)})))})}static compress(e,t,s,a,i,o,f){return e.map(c=>{switch(t){case"gzip":return s(c,f);case"deflate":return a(c,f);case"deflate-raw":return i(c,f);case"brotli-compress":return o(c,f);default:throw h.text(`Invalid compression method (${t})`)}})}static decompress(e,t,s,a,i,o,f,c){return e.map(u=>{switch(t){case"gunzip":return s(u,c);case"inflate":return a(u,c);case"inflate-raw":return i(u,c);case"brotli-decompress":return o(u,c);case"unzip":return f(u,c);default:throw h.text(`Invalid decompression method (${t})`)}})}static filter(...e){return n(this,null,function*(){return new d(...e).text()})}static fromFile(...e){return n(this,null,function*(){let t=yield p.loadFile(e);return r.new(t)})}static fromUrl(...e){return n(this,null,function*(){let t=yield p.loadUrl(e);return r.new(t)})}static new(e){let t=e.filter(s=>s.length>0);if(t.length===0)throw h.text("Non valid text");return new r(...t)}static isText(e){return e instanceof r}static gzipAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{l.gzip(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static deflateAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{l.deflate(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static deflateRawAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{l.deflateRaw(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static brotliCompressAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{l.brotliCompress(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static gunzipAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{l.gunzip(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static inflateAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{l.inflate(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static inflateRawAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{l.inflateRaw(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static brotliDecompressAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{l.brotliDecompress(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static unzipAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{l.unzip(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static gzipStream(e,t={}){let s=l.createGzip(t);return m.stream(e,s)}static deflateStream(e,t={}){let s=l.createDeflate(t);return m.stream(e,s)}static deflateRawStream(e,t={}){let s=l.createDeflateRaw(t);return m.stream(e,s)}static brotliCompressStream(e,t={}){let s=l.createBrotliCompress(t);return m.stream(e,s)}static gunzipStream(e,t={}){let s=l.createGunzip(t);return m.stream(e,s)}static inflateStream(e,t={}){let s=l.createInflate(t);return m.stream(e,s)}static inflateRawStream(e,t={}){let s=l.createInflateRaw(t);return m.stream(e,s)}static brotliDecompressStream(e,t={}){let s=l.createBrotliDecompress(t);return m.stream(e,s)}static unzipStream(e,t={}){let s=l.createUnzip(t);return m.stream(e,s)}static gzipSync(e,t={}){return l.gzipSync(e,t)}static deflateSync(e,t={}){return l.deflateSync(e,t)}static deflateRawSync(e,t={}){return l.deflateRawSync(e,t)}static brotliCompressSync(e,t={}){return l.brotliCompressSync(e,t)}static gunzipSync(e,t={}){return l.gunzipSync(e,t)}static inflateSync(e,t={}){return l.inflateSync(e,t)}static inflateRawSync(e,t={}){return l.inflateRawSync(e,t)}static brotliDecompressSync(e,t={}){return l.brotliDecompressSync(e,t)}static unzipSync(e,t={}){return l.unzipSync(e,t)}};import*as P from"csv";import*as O from"csv/sync";var k=class r extends m{constructor(...e){super(),this.csvs=e}get length(){return this.csvs.length}getCsvs(){return[...this.csvs]}setCsvs(e){return n(this,null,function*(){let s=(yield Promise.all(this.csvs.map((a,i)=>n(this,null,function*(){return e(a,i)})))).filter(a=>Buffer.isBuffer(a)&&a.length>0);return this.csvs=s,this.length})}append(...e){return n(this,null,function*(){let t=e.filter(s=>Buffer.isBuffer(s)&&s.length>0);return this.csvs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.csvs.push(...t.getCsvs())}),this.length}clone(){return new r(...this.csvs)}clean(){this.csvs=[]}filter(){return n(this,null,function*(){return this.csvs=yield r.filter(...this.csvs),this.length})}metadata(e){return n(this,null,function*(){return this.custom(t=>n(this,null,function*(){var a,i;let s=yield r.parseAsync(t,e);return{size:t.length,rows:s.length,columns:(i=(a=s==null?void 0:s[0])==null?void 0:a.length)!=null?i:0}}))})}parseAsync(e){return n(this,null,function*(){return this.custom(t=>r.parseAsync(t,e))})}transformAsync(e,t,s){return n(this,null,function*(){return Promise.all(e.map(a=>r.transformAsync(a,t,s)))})}stringifyAsync(e,t){return n(this,null,function*(){return Promise.all(e.map(s=>r.stringifyAsync(s,t)))})}parseStream(e){return n(this,null,function*(){return(yield g.toReadable(this.csvs)).map(s=>r.parseStream(s,e))})}transformStream(e,t,s){return n(this,null,function*(){return(yield g.toReadable(e)).map(i=>r.transformStream(i,t,s))})}stringifyStream(e,t){return n(this,null,function*(){return(yield g.toReadable(e)).map(a=>r.stringifyStream(a,t))})}parseSync(e){return this.csvs.map(t=>r.parseSync(t,e))}transformSync(e,t,s){return e.map(a=>r.transformSync(a,t,s))}stringifySync(e,t){return e.map(s=>r.stringifySync(s,t))}custom(e){return n(this,null,function*(){return Promise.all(this.csvs.map((t,s)=>n(this,null,function*(){return e(t,s)})))})}static filter(...e){return n(this,null,function*(){return new d(...e).custom("csv")})}static fromFile(...e){return n(this,null,function*(){let t=yield p.loadFile(e);return r.new(t)})}static fromUrl(...e){return n(this,null,function*(){let t=yield p.loadUrl(e);return r.new(t)})}static new(e){let t=e.filter(s=>s.length>0);if(t.length===0)throw h.csv("Non valid csv");return new r(...t)}static isCSV(e){return e instanceof r}static generateAsync(){return n(this,arguments,function*(e={}){return new Promise((t,s)=>{P.generate(e,(a,i)=>{if(a)return s(a);t(i)})})})}static parseAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{P.parse(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static transformAsync(a,i){return n(this,arguments,function*(e,t,s={}){return new Promise((o,f)=>{P.transform(e,s,t,(c,u)=>{if(c)return f(c);o(u)})})})}static stringifyAsync(s){return n(this,arguments,function*(e,t={}){return new Promise((a,i)=>{P.stringify(e,t,(o,f)=>{if(o)return i(o);a(f)})})})}static generateStream(e={}){return P.generate(e)}static parseStream(e,t={}){return m.stream(e,P.parse(t))}static transformStream(e,t,s={}){return m.stream(e,P.transform(s,t))}static stringifyStream(e,t={}){return m.stream(e,P.stringify(t))}static generateSync(e={}){return O.generate(e)}static parseSync(e,t={}){return O.parse(e,t)}static transformSync(e,t,s={}){return O.transform(e,s,t)}static stringifySync(e,t={}){return O.stringify(e,t)}};import{PageSizes as qe,PDFDocument as q}from"pdf-lib";var M=class r extends m{constructor(...e){super(),this.pdfs=e}get length(){return this.pdfs.length}getPdfs(){return[...this.pdfs]}setPdfs(e){return n(this,null,function*(){let s=(yield Promise.all(this.pdfs.map((i,o)=>n(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),a=yield r.filter(...s);return this.pdfs=a,this.length})}append(...e){return n(this,null,function*(){let t=yield r.filter(...e);return this.pdfs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.pdfs.push(...t.getPdfs())}),this.length}clone(){return new r(...this.pdfs)}clean(){this.pdfs=[]}filter(){return n(this,null,function*(){return this.pdfs=yield r.filter(...this.pdfs),this.length})}getDocuments(e){return n(this,null,function*(){return Promise.all(this.pdfs.map(t=>r.load(t.buffer,e)))})}metadata(e){return n(this,null,function*(){return this.custom(t=>({title:t.getTitle(),author:t.getAuthor(),subject:t.getSubject(),creator:t.getCreator(),keywords:t.getKeywords(),producer:t.getProducer(),pageCount:t.getPageCount(),pageIndices:t.getPageIndices(),creationDate:t.getCreationDate(),modificationDate:t.getModificationDate()}),e)})}getPages(e){return n(this,null,function*(){return this.custom(t=>t.getPages(),e)})}getForm(e){return n(this,null,function*(){return this.custom(t=>t.getForm(),e)})}merge(e){return n(this,null,function*(){let t=yield r.create(e==null?void 0:e.create);return(yield this.custom(a=>t.copyPages(a,a.getPageIndices()),e==null?void 0:e.load)).forEach(a=>a.forEach(i=>t.addPage(i))),r.save(t)})}custom(e,t){return n(this,null,function*(){let s=yield this.getDocuments(t);return Promise.all(s.map((a,i)=>n(this,null,function*(){return e(a,i)})))})}static fromFile(...e){return n(this,null,function*(){let t=yield p.loadFile(e);return r.new(t)})}static fromUrl(...e){return n(this,null,function*(){let t=yield p.loadUrl(e);return r.new(t)})}static fromImage(s){return n(this,arguments,function*(e,t={}){var D,A;if(Array.isArray(e))return Promise.all(e.map(V=>r.fromImage(V,t)));let[a,i]=yield Promise.all([new d(e).custom("png"),new d(e).custom("jpg")]);if(i.length===0&&a.length===0)throw h.pdf("Invalid images to convert to pdf");let{pageSize:o=qe.A4,scaleImage:f,position:c}=t,u=yield q.create(t.create),w=u.addPage(o),b=w.getSize(),T;a.length>0?T=yield u.embedPng(e.buffer):T=yield u.embedJpg(e.buffer);let B=T.size();return typeof f=="number"?B=T.scale(f):Array.isArray(f)?B=T.scaleToFit(f[0],f[1]):B=T.scaleToFit(b.width,b.height),w.drawImage(T,{x:(D=c==null?void 0:c[0])!=null?D:0,y:(A=c==null?void 0:c[1])!=null?A:0,width:B.width,height:B.height}),u})}static filter(...e){return n(this,null,function*(){return new d(...e).custom("pdf")})}static save(e,t){return n(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(a=>r.save(a,t)));let s=yield e.save(t);return g.toBuffer(s)})}static load(e,t){return n(this,null,function*(){return q.load(e,t)})}static create(e){return n(this,null,function*(){return q.create(e)})}static document(){return q}static new(e){return n(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid pdf`);return new r(...t)})}static isPDF(e){return e instanceof r}};import*as x from"mupdf";var H=class r{constructor(...e){this.pdfs=[];this.pdfs=e}metadata(){return n(this,null,function*(){return this.custom(e=>({format:e.getMetaData(x.Document.META_FORMAT),encryption:e.getMetaData(x.Document.META_ENCRYPTION),author:e.getMetaData(x.Document.META_INFO_AUTHOR),title:e.getMetaData(x.Document.META_INFO_TITLE),subject:e.getMetaData(x.Document.META_INFO_SUBJECT),keywords:e.getMetaData(x.Document.META_INFO_KEYWORDS),creator:e.getMetaData(x.Document.META_INFO_CREATOR),producer:e.getMetaData(x.Document.META_INFO_PRODUCER),countUnsavedVersions:e.countUnsavedVersions(),countVersions:e.countVersions(),countObjects:e.countObjects(),countPages:e.countPages(),wasRepaired:e.wasRepaired(),language:e.getLanguage(),version:e.getVersion(),creationDate:e.getMetaData(x.Document.META_INFO_CREATIONDATE),modificationDate:e.getMetaData(x.Document.META_INFO_MODIFICATIONDATE)}))})}getTexts(){return n(this,null,function*(){return this.custom(e=>{let t=[],s=e.countPages();for(let a=0;a<s;a++){let i=e.loadPage(a);t.push(i.toStructuredText("preserve-whitespace").asJSON())}return t})})}getImages(){return n(this,null,function*(){return this.custom(e=>{let t=[],s=e.countPages();for(let a=0;a<s;a++){let f,i=e.loadPage(a),o=[];i.toStructuredText("preserve-images").walk({onImageBlock(c,u,w){return n(this,null,function*(){let T=w.toPixmap().asPNG(),B=yield m.toBuffer(T);o.push(B)})}}),t.push(o)}return t})})}annotations(){return n(this,null,function*(){return this.custom(e=>{let t=[],s=e.countPages();for(let a=0;a<s;a++){let i=e.loadPage(a);t.push(i.getAnnotations())}return t})})}links(){return n(this,null,function*(){return this.custom(e=>{let t=[],s=e.countPages();for(let a=0;a<s;a++){let o=e.loadPage(a).getLinks().map(f=>({bounds:f.getBounds(),link:f.getURI(),isExternal:f.isExternal()}));t.push(o)}return t})})}bake(e,t){return n(this,null,function*(){return this.custom(s=>{s.bake(e,t)})})}search(e){return n(this,null,function*(){return this.custom(t=>{})})}custom(e){return n(this,null,function*(){return Promise.all(this.pdfs.map((t,s)=>n(this,null,function*(){let a=r.open(t);return e(a,s)})))})}static open(e){return new x.PDFDocument(e)}static needsPassword(e){return r.open(e).needsPassword()}};import ee from"path";import We from"fluent-ffmpeg";import{path as Je}from"@ffmpeg-installer/ffmpeg";import{path as Ke}from"@ffprobe-installer/ffprobe";var U=class r extends m{constructor(...e){super(),this.avs=e}get length(){return this.avs.length}clean(){this.avs=[]}metadata(){return n(this,null,function*(){return this.custom(e=>new Promise((t,s)=>{e.ffprobe((a,i)=>{if(a)return s(a);t(i)})}))})}convert(e){return n(this,null,function*(){return this.custom((t,s)=>new Promise((a,i)=>{let o=ee.join(s.tmp.path,y.generateFileName(e));t.toFormat(e).on("end",()=>{p.loadFile(o).then(a,i)}).on("error",i).output(o).run()}))})}spilt(e,t=0){return n(this,null,function*(){return this.custom((s,a,i)=>n(this,null,function*(){var T,B;let f=(T=(yield new Promise((D,A)=>{s.ffprobe((V,K)=>{if(V)return A(V);D(K)})})).format.duration)!=null?T:0;if(f===0)throw h.av("Empty av duration");if(t>=f)throw h.av("start time is bigger then the av duration");let c=(B=yield d.extension(this.avs[i]))!=null?B:"";if(c.length===0)throw h.av("Unknown av format");let u=a.paths[i],w=[],b=t;for(;b<f;){let D=Math.min(e,f-b),A=ee.join(a.tmp.path,y.generateFileName(c)),V=yield new Promise((K,re)=>{r.newFfmpeg(u).setStartTime(b).setDuration(D).on("end",()=>{p.loadFile(A).then(K,re)}).on("error",re).output(A).run()});w.push(V),b+=D}return w}))})}merge(e){return n(this,null,function*(){let t=yield this.convert(e),s=yield new y(...t).init(),a=ee.join(s.tmp.path,y.generateFileName(e)),i=yield new Promise((o,f)=>{let c=r.newFfmpeg(s.paths[0]);s.paths.forEach((u,w)=>{w!==0&&c.input(u)}),c.on("start",u=>{}).on("end",()=>{p.loadFile(a).then(o,f)}).on("error",f).mergeToFile(a,s.tmp.path)});return yield s.clean(),i})}custom(e){return n(this,null,function*(){let t=yield new y(...this.avs).init(),s=yield Promise.all(t.paths.map((a,i)=>n(this,null,function*(){return e(r.newFfmpeg(a),t,i)})));return yield t.clean(),s})}static newFfmpeg(e,t){return We(t).clone().setFfmpegPath(Je).setFfprobePath(Ke).input(e)}};var E=class r extends U{constructor(...e){super(...e)}getAudios(){return[...this.avs]}setAudios(e){return n(this,null,function*(){let s=(yield Promise.all(this.avs.map((i,o)=>n(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),a=yield r.filter(...s);return this.avs=a,this.length})}append(...e){return n(this,null,function*(){let t=yield r.filter(...e);return this.avs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.avs.push(...t.getAudios())}),this.length}clone(){return new r(...this.avs)}filter(){return n(this,null,function*(){return this.avs=yield r.filter(...this.avs),this.length})}static filter(...e){return new d(...e).audio()}static fromFile(...e){return n(this,null,function*(){let t=yield p.loadFile(e);return r.new(t)})}static fromUrl(...e){return n(this,null,function*(){let t=yield p.loadUrl(e);return r.new(t)})}static new(e){return n(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw h.audio("Non valid audio");return new r(...t)})}static isAudio(e){return e instanceof r}};import W from"path";var z=class r extends U{constructor(...e){super(...e)}getVideos(){return[...this.avs]}setVideos(e){return n(this,null,function*(){let s=(yield Promise.all(this.avs.map((i,o)=>n(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),a=yield r.filter(...s);return this.avs=a,this.length})}append(...e){return n(this,null,function*(){let t=yield r.filter(...e);return this.avs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.avs.push(...t.getVideos())}),this.length}clone(){return new r(...this.avs)}filter(){return n(this,null,function*(){return this.avs=yield r.filter(...this.avs),this.length})}only(){return n(this,null,function*(){return this.custom((e,t,s)=>n(this,null,function*(){var o;let a=(o=yield d.extension(this.avs[s]))!=null?o:"";if(a.length===0)throw h.video("Unknown video format");let i=W.join(t.tmp.path,y.generateFileName(a));return new Promise((f,c)=>{e.noAudio().on("end",()=>{p.loadFile(i).then(f,c)}).on("error",c).output(i).run()})}))})}audio(e){return n(this,null,function*(){let t=yield this.metadata();return this.custom((s,a,i)=>n(this,null,function*(){if(typeof t[i].streams.find(u=>u.codec_type==="audio")=="undefined")return null;let c=W.join(a.tmp.path,y.generateFileName(e));return new Promise((u,w)=>{s.noVideo().toFormat(e).on("end",()=>{p.loadFile(c).then(u,w)}).on("error",w).output(c).run()})}))})}screenshot(e){return n(this,null,function*(){return this.custom((t,s)=>n(this,null,function*(){let a=[];return new Promise((i,o)=>{t.screenshot({filename:"frame.png",timemarks:e},s.tmp.path).on("filenames",f=>{a=f.map(c=>W.join(s.tmp.path,c))}).on("end",()=>{p.loadFile(a).then(i,o)}).on("error",o)})}))})}drawText(e){return n(this,null,function*(){return this.custom((t,s,a)=>n(this,null,function*(){let i=yield d.extension(s.paths[a]);if(typeof i=="undefined")throw h.video("ERROR: undefined video (Video.drawText)");let o=W.join(s.tmp.path,y.generateFileName(i));return new Promise((f,c)=>{t.videoFilter(e.map(u=>({filter:"drawtext",options:u}))).output(o).on("end",()=>{p.loadFile(o).then(f,c)}).on("error",c).run()})}))})}static filter(...e){return n(this,null,function*(){return new d(...e).video()})}static fromFile(...e){return n(this,null,function*(){let t=yield p.loadFile(e);return r.new(t)})}static fromUrl(...e){return n(this,null,function*(){let t=yield p.loadUrl(e);return r.new(t)})}static generateTimemarks(e,t=1){return n(this,null,function*(){var i;if(Array.isArray(e))return Promise.all(e.map(o=>r.generateTimemarks(o,t)));let s=[],a=(i=e.format.duration)!=null?i:0;for(let o=0;o<a;o+=t)s.push(o);return s})}static new(e){return n(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw h.video("Non valid video");return new r(...t)})}static isVideo(e){return e instanceof r}};var J=class{constructor(...e){this.files=e}image(){return I.new(this.files)}pdf(){return M.new(this.files)}csv(){return k.new(this.files)}text(){return C.new(this.files)}video(){return z.new(this.files)}audio(){return E.new(this.files)}};export{J as Processor,te as core,_ as helper};
