var E=Object.defineProperty;var j=Object.getOwnPropertySymbols;var K=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var V=(r,e,t)=>e in r?E(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,G=(r,e)=>{for(var t in e||(e={}))K.call(e,t)&&V(r,t,e[t]);if(j)for(var t of j(e))Q.call(e,t)&&V(r,t,e[t]);return r};var L=(r,e)=>{for(var t in e)E(r,t,{get:e[t],enumerable:!0})};var s=(r,e,t)=>new Promise((a,n)=>{var i=l=>{try{f(t.next(l))}catch(m){n(m)}},o=l=>{try{f(t.throw(l))}catch(m){n(m)}},f=l=>l.done?a(l.value):Promise.resolve(l.value).then(i,o);f((t=t.apply(r,e)).next())});var z={};L(z,{Audio:()=>S,CSV:()=>P,Image:()=>x,PDF:()=>b,Text:()=>B,Video:()=>F});var U={};L(U,{FilterFile:()=>p,TmpFile:()=>y,input2buffer:()=>Fe,isArrayOfBuffer:()=>Oe,isArrayOfString:()=>De,isUrl:()=>C});import{Mutex as T}from"async-mutex";import h from"@ryn-bsd/is-file";import{Readable as $}from"stream";import{isAnyArrayBuffer as X,isUint8Array as Y}from"util/types";import{readFile as Z,writeFile as _,stat as N,readdir as ee}from"fs/promises";import H from"path";import{any2buffer as te,array2buffer as re,buffer2readable as se,isReadable as q,isReadableStream as ae,isStream as ne,readable2buffer as ie,readablestream2buffer as oe,stream2buffer as fe,string2buffer as ce,uint8array2buffer as le,url2buffer as ue}from"@ryn-bsd/from-buffer-to";import W from"is-base64";import{default as me}from"fast-glob";import pe from"puppeteer";var c=class r{constructor(){}static stream(e,t){return e.pipe(t)}static initBrowser(e){return pe.launch(e)}static loadFile(e){return s(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.loadFile(t))):Z(e)})}static loadDir(e){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(a=>r.loadDir(a)));let t=yield ee(e);return r.loadFile(t.map(a=>H.join(e,a)))})}static loadGlob(e,t){return s(this,null,function*(){var o;let a=yield me(e,t),n=(o=t==null?void 0:t.cwd)!=null?o:process.cwd();return(yield Promise.all(a.map(f=>s(this,null,function*(){let l=H.join(n,f),m=yield N(l);return m.isFile()?r.loadFile(l):m.isDirectory()?r.loadDir(l):null})))).filter(f=>f!==null)})}static loadUrl(e){return s(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.loadUrl(t))):ue(e)})}static toBuffer(e){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(t=>r.toBuffer(t)));if(Buffer.isBuffer(e))return e;if(C(e))return r.loadUrl(e);if(Y(e))return le(e);if(X(e))return re(e);if(ne(e))return fe(e);if(ae(e))return oe(e);if(q(e)&&$.isReadable(e))return ie(e);if(typeof e=="string"){let t=yield N(e);return t.isFile()?r.loadFile(e):t.isDirectory()?r.loadDir(e):C(e)?r.loadUrl(e):W(e,{allowEmpty:!1})?Buffer.from(e,"base64"):ce(e,!1)}return te(e)})}static toReadable(e){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(a=>r.toReadable(a)));if(q(e)&&$.isReadable(e))return e;let t=yield r.toBuffer(e);return se(t)})}static toBase64(e,t="base64"){return s(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(n=>r.toBase64(n))):typeof e=="string"&&W(e)?e:(yield r.toBuffer(e)).toString(t)})}static toFile(e){return s(this,null,function*(){yield Promise.all(e.map(t=>s(this,null,function*(){let a=yield r.toBuffer(t.input);return _(t.path,a)})))})}};var p=class r{constructor(...e){this.input=e}application(){return s(this,null,function*(){let{applications:e}=yield r.filter(...this.input);return e})}audio(){return s(this,null,function*(){let{audios:e}=yield r.filter(...this.input);return e})}font(){return s(this,null,function*(){let{fonts:e}=yield r.filter(...this.input);return e})}image(){return s(this,null,function*(){let{images:e}=yield r.filter(...this.input);return e})}model(){return s(this,null,function*(){let{models:e}=yield r.filter(...this.input);return e})}text(){return s(this,null,function*(){let{texts:e}=yield r.filter(...this.input);return e})}video(){return s(this,null,function*(){let{videos:e}=yield r.filter(...this.input);return e})}custom(e){return s(this,null,function*(){let t=yield c.toBuffer(this.input);return(yield h.isCustom(t,e)).filter(n=>n.valid).map(n=>n.value)})}static filter(...e){return s(this,null,function*(){let t=yield c.toBuffer(e),a={applications:new T,audios:new T,fonts:new T,images:new T,models:new T,texts:new T,videos:new T},n={applications:[],audios:[],fonts:[],images:[],models:[],texts:[],videos:[]};return yield Promise.all(t.map(i=>s(this,null,function*(){if(yield h.isApplication(i)){let o=yield a.applications.acquire();n.applications.push(i),o()}else if(yield h.isAudio(i)){let o=yield a.audios.acquire();n.audios.push(i),o()}else if(yield h.isFont(i)){let o=yield a.fonts.acquire();n.fonts.push(i),o()}else if(yield h.isImage(i)){let o=yield a.images.acquire();n.images.push(i),o()}else if(yield h.isModel(i)){let o=yield a.models.acquire();n.models.push(i),o()}else if(yield h.isText(i)){let o=yield a.texts.acquire();n.texts.push(i),o()}else if(yield h.isVideo(i)){let o=yield a.videos.acquire();n.videos.push(i),o()}}))),n})}};import{writeFile as de}from"fs/promises";import{randomUUID as ye}from"crypto";import he from"path";import{dir as ge}from"tmp-promise";import{Node as we}from"@ryn-bsd/is-file";var y=class r{constructor(...e){this.paths=[];this.files=e}createFn(e){return s(this,null,function*(){var i,o;let t=(o=(i=yield we.type(e))==null?void 0:i.ext)!=null?o:"";if(t.length===0)throw new Error(`${r.name}: Unknown file when create`);let a=r.generateFileName(t),n=he.join(this.tmp.path,a);yield de(n,e),this.paths.push(n)})}create(){return s(this,null,function*(){yield Promise.all(this.files.map(this.createFn.bind(this)))})}init(e){return s(this,null,function*(){return this.tmp=yield ge(G({unsafeCleanup:!0},e)),yield this.create(),this})}clean(){return s(this,null,function*(){yield this.tmp.cleanup(),this.paths.splice(0,this.paths.length)})}static generateFileName(e){return`${ye()}_${Date.now()}.${e}`}};import{readFile as Te}from"fs/promises";import{isReadable as xe,isStream as Be,stream2buffer as be}from"@ryn-bsd/from-buffer-to";import{isArrayBuffer as Pe,isSharedArrayBuffer as ve,isUint8Array as Se}from"util/types";function Fe(r){return s(this,null,function*(){return Buffer.isBuffer(r)?r:typeof r=="string"?Te(r):xe(r)||Be(r)?be(r):Se(r)||Pe(r)||ve(r)?Buffer.from(r):null})}function Oe(r){if(!Array.isArray(r))return!1;for(let e of r)if(!Buffer.isBuffer(e))return!1;return!0}function De(r){if(!Array.isArray(r))return!1;for(let e of r)if(typeof e!="string")return!1;return!0}function C(r){if(typeof r!="string")return!1;try{return new URL(r),!0}catch(e){return!1}}import Ae from"sharp";var x=class r extends c{constructor(...e){super(),this.images=e}get length(){return this.images.length}getImages(){return[...this.images]}setImages(e){return s(this,null,function*(){let a=(yield Promise.all(this.images.map((i,o)=>s(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...a);return this.images=n,this.length})}append(...e){return s(this,null,function*(){let t=yield r.filter(...e);return this.images.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.images.push(...t.getImages())}),this.length}clone(){return new r(...this.images)}filter(){return s(this,null,function*(){return this.images=yield r.filter(...this.images),this.length})}metadata(){return s(this,null,function*(){return Promise.all(this.images.map(e=>s(this,null,function*(){return r.newSharp(e).metadata()})))})}watermark(e,t){return s(this,null,function*(){let{resize:a,gravity:n="center",alpha:i=.5,tile:o=!1,blend:f="over",premultiplied:l}=t,m=yield c.toBuffer(e),D=yield r.newSharp(m).resize(a).ensureAlpha(i).composite([{input:Buffer.from([0,0,0,Math.round(255*i)]),raw:{width:1,height:1,channels:4},tile:!0,blend:"dest-in"}]).toBuffer();return Promise.all(this.images.map(A=>s(this,null,function*(){return r.newSharp(A).composite([{input:D,gravity:n,blend:f,tile:o,premultiplied:l}]).toBuffer({resolveWithObject:!0})})))})}convert(e,t){return s(this,null,function*(){return Promise.all(this.images.map(a=>s(this,null,function*(){return r.newSharp(a).toFormat(e,t).toBuffer({resolveWithObject:!0})})))})}custom(e){return s(this,null,function*(){return Promise.all(this.images.map((t,a)=>s(this,null,function*(){return e(r.newSharp(t),a)})))})}static filter(...e){return s(this,null,function*(){return new p(...e).image()})}static justBuffer(e){return Array.isArray(e)?e.map(t=>r.justBuffer(t)):e.data}static screenshot(e,t){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(f=>s(this,null,function*(){return r.screenshot(f,t)})));let a=yield c.initBrowser(),n=yield a.newPage(),i=yield n.goto(e,{waitUntil:"networkidle2"});if(i===null||!i.ok())throw new Error(`${r.name}: Can't fetch (${e})`);let o=yield n.screenshot(t);return yield a.close(),o})}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static newSharp(e,t){return Ae(e,t).clone()}static new(e){return s(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid image`);return new r(...t)})}};import u from"zlib";var B=class r extends c{constructor(...e){super(),this.texts=e}get length(){return this.texts.length}getTexts(){return[...this.texts]}setTexts(e){return s(this,null,function*(){let a=(yield Promise.all(this.texts.map((n,i)=>s(this,null,function*(){return e(n,i)})))).filter(n=>Buffer.isBuffer(n)&&n.length>0);return this.texts=a,this.length})}append(...e){return s(this,null,function*(){let t=e.filter(a=>Buffer.isBuffer(a)&&a.length>0);return this.texts.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.texts.push(...t.getTexts())}),this.length}clone(){return new r(...this.texts)}filter(){return s(this,null,function*(){return this.texts=yield r.filter(...this.texts),this.length})}charactersMap(e){let t=new Map,a=e.toString();for(let n of a){let i=n.charCodeAt(0);t.has(i)?t.set(i,t.get(i)+1):t.set(i,1)}return t}metadata(){return s(this,null,function*(){return Promise.all(this.texts.map(e=>s(this,null,function*(){return{size:e.length,charactersMap:this.charactersMap(e)}})))})}compressAsync(e,t){return s(this,null,function*(){return Promise.all(r.compress(this.texts,e,r.gzipAsync,r.deflateAsync,r.deflateRawAsync,r.brotliCompressAsync,t))})}decompressAsync(e,t){return s(this,null,function*(){return Promise.all(r.decompress(this.texts,e,r.gunzipAsync,r.inflateAsync,r.inflateRawAsync,r.brotliDecompressAsync,r.unzipAsync,t))})}compressStream(e,t){return s(this,null,function*(){let a=yield c.toReadable(this.texts);return r.compress(a,e,r.gzipStream,r.deflateStream,r.deflateRawStream,r.brotliCompressStream,t)})}decompressStream(e,t){return s(this,null,function*(){let a=yield c.toReadable(this.texts);return r.decompress(a,e,r.gunzipStream,r.inflateStream,r.inflateRawStream,r.brotliDecompressStream,r.unzipStream,t)})}compressSync(e,t){return r.compress(this.texts,e,r.gzipSync,r.deflateSync,r.deflateRawSync,r.brotliCompressSync,t)}decompressSync(e,t){return r.decompress(this.texts,e,r.gunzipSync,r.inflateSync,r.inflateRawSync,r.brotliDecompressSync,r.unzipSync,t)}custom(e){return s(this,null,function*(){return Promise.all(this.texts.map((t,a)=>s(this,null,function*(){return e(t,a)})))})}static compress(e,t,a,n,i,o,f){return e.map(l=>{switch(t){case"gzip":return a(l,f);case"deflate":return n(l,f);case"deflate-raw":return i(l,f);case"brotli-compress":return o(l,f);default:throw new TypeError(`${r.name}: Invalid compression method (${t})`)}})}static decompress(e,t,a,n,i,o,f,l){return e.map(m=>{switch(t){case"gunzip":return a(m,l);case"inflate":return n(m,l);case"inflate-raw":return i(m,l);case"brotli-decompress":return o(m,l);case"unzip":return f(m,l);default:throw new TypeError(`${r.name}: Invalid decompression method (${t})`)}})}static filter(...e){return s(this,null,function*(){return new p(...e).text()})}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static new(e){let t=e.filter(a=>a.length>0);if(t.length===0)throw new Error(`${r.name}: Non valid text`);return new r(...t)}static gzipAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.gzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static deflateAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.deflate(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static deflateRawAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.deflateRaw(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static brotliCompressAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.brotliCompress(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static gunzipAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.gunzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static inflateAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.inflate(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static inflateRawAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.inflateRaw(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static brotliDecompressAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.brotliDecompress(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static unzipAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.unzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static gzipStream(e,t={}){let a=u.createGzip(t);return c.stream(e,a)}static deflateStream(e,t={}){let a=u.createDeflate(t);return c.stream(e,a)}static deflateRawStream(e,t={}){let a=u.createDeflateRaw(t);return c.stream(e,a)}static brotliCompressStream(e,t={}){let a=u.createBrotliCompress(t);return c.stream(e,a)}static gunzipStream(e,t={}){let a=u.createGunzip(t);return c.stream(e,a)}static inflateStream(e,t={}){let a=u.createInflate(t);return c.stream(e,a)}static inflateRawStream(e,t={}){let a=u.createInflateRaw(t);return c.stream(e,a)}static brotliDecompressStream(e,t={}){let a=u.createBrotliDecompress(t);return c.stream(e,a)}static unzipStream(e,t={}){let a=u.createUnzip(t);return c.stream(e,a)}static gzipSync(e,t={}){return u.gzipSync(e,t)}static deflateSync(e,t={}){return u.deflateSync(e,t)}static deflateRawSync(e,t={}){return u.deflateRawSync(e,t)}static brotliCompressSync(e,t={}){return u.brotliCompressSync(e,t)}static gunzipSync(e,t={}){return u.gunzipSync(e,t)}static inflateSync(e,t={}){return u.inflateSync(e,t)}static inflateRawSync(e,t={}){return u.inflateRawSync(e,t)}static brotliDecompressSync(e,t={}){return u.brotliDecompressSync(e,t)}static unzipSync(e,t={}){return u.unzipSync(e,t)}};import{PageSizes as Ce,PDFDocument as R}from"pdf-lib";var b=class r extends c{constructor(...e){super(),this.pdfs=e}get length(){return this.pdfs.length}getPdfs(){return[...this.pdfs]}setPdfs(e){return s(this,null,function*(){let a=(yield Promise.all(this.pdfs.map((i,o)=>s(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...a);return this.pdfs=n,this.length})}append(...e){return s(this,null,function*(){let t=yield r.filter(...e);return this.pdfs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.pdfs.push(...t.getPdfs())}),this.length}clone(){return new r(...this.pdfs)}filter(){return s(this,null,function*(){return this.pdfs=yield r.filter(...this.pdfs),this.length})}getDocuments(e){return s(this,null,function*(){return Promise.all(this.pdfs.map(t=>s(this,null,function*(){return r.load(t.buffer,e)})))})}metadata(e){return s(this,null,function*(){let t=yield this.getDocuments(e);return Promise.all(t.map(a=>s(this,null,function*(){return{title:a.getTitle(),author:a.getAuthor(),subject:a.getSubject(),creator:a.getCreator(),keywords:a.getKeywords(),producer:a.getProducer(),pageCount:a.getPageCount(),pageIndices:a.getPageIndices(),creationDate:a.getCreationDate(),modificationDate:a.getModificationDate()}})))})}getPages(e){return s(this,null,function*(){let t=yield this.getDocuments(e);return Promise.all(t.map(a=>s(this,null,function*(){return a.getPages()})))})}getForm(e){return s(this,null,function*(){let t=yield this.getDocuments(e);return Promise.all(t.map(a=>s(this,null,function*(){return a.getForm()})))})}merge(e){return s(this,null,function*(){let t=yield r.create(e==null?void 0:e.create);return(yield Promise.all(this.pdfs.map(n=>s(this,null,function*(){let i=yield r.load(n.buffer,e==null?void 0:e.load);return t.copyPages(i,i.getPageIndices())})))).forEach(n=>n.forEach(i=>t.addPage(i))),t})}custom(e,t){return s(this,null,function*(){let a=yield this.getDocuments(t);return Promise.all(a.map((n,i)=>s(this,null,function*(){return e(n,i)})))})}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static fromImage(a){return s(this,arguments,function*(e,t={}){var k,M;if(Array.isArray(e))return Promise.all(e.map(J=>r.fromImage(J,t)));let[n,i]=yield Promise.all([new p(e).custom("png"),new p(e).custom("jpg")]);if(i.length===0&&n.length===0)throw new Error(`${r.name}: Invalid images to convert to pdf`);let{pageSize:o=Ce.A4,scaleImage:f,position:l}=t,m=yield R.create(t.create),D=m.addPage(o),A=D.getSize(),w;n.length>0?w=yield m.embedPng(e.buffer):w=yield m.embedJpg(e.buffer);let O=w.size();return typeof f=="number"?O=w.scale(f):Array.isArray(f)?O=w.scaleToFit(f[0],f[1]):O=w.scaleToFit(A.width,A.height),D.drawImage(w,{x:(k=l==null?void 0:l[0])!=null?k:0,y:(M=l==null?void 0:l[1])!=null?M:0,width:O.width,height:O.height}),m})}static generate(e,t){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(f=>r.generate(f,t)));let a=yield c.initBrowser(),n=yield a.newPage(),i=yield n.goto(e,{waitUntil:"networkidle2"});if(i===null||!i.ok())throw new Error(`${r.name}: Can't fetch (${e})`);let o=yield n.pdf(t);return yield a.close(),o})}static filter(...e){return new p(...e).custom("pdf")}static save(e,t){return s(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(a=>r.save(a,t))):e.save(t)})}static load(e,t){return s(this,null,function*(){return R.load(e,t)})}static create(e){return s(this,null,function*(){return R.create(e)})}static document(){return R}static new(e){return s(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid pdf`);return new r(...t)})}};import*as d from"csv";import*as g from"csv/sync";var P=class r extends c{constructor(...e){super(),this.csvs=e}get length(){return this.csvs.length}getCsvs(){return[...this.csvs]}setCsvs(e){return s(this,null,function*(){let a=(yield Promise.all(this.csvs.map((n,i)=>s(this,null,function*(){return e(n,i)})))).filter(n=>Buffer.isBuffer(n)&&n.length>0);return this.csvs=a,this.length})}append(...e){return s(this,null,function*(){let t=e.filter(a=>Buffer.isBuffer(a)&&a.length>0);return this.csvs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.csvs.push(...t.getCsvs())}),this.length}clone(){return new r(...this.csvs)}filter(){return s(this,null,function*(){return this.csvs=yield r.filter(...this.csvs),this.length})}metadata(){return s(this,null,function*(){return Promise.all(this.csvs.map(e=>s(this,null,function*(){var a,n;let t=yield r.parseAsync(e);return{size:e.length,rows:t.length,columns:(n=(a=t==null?void 0:t[0])==null?void 0:a.length)!=null?n:0}})))})}parseAsync(e){return s(this,null,function*(){return Promise.all(this.csvs.map(t=>s(this,null,function*(){return r.parseAsync(t,e)})))})}transformAsync(e,t,a){return s(this,null,function*(){return Promise.all(e.map(n=>s(this,null,function*(){return r.transformAsync(n,t,a)})))})}stringifyAsync(e,t){return s(this,null,function*(){return Promise.all(e.map(a=>s(this,null,function*(){return r.stringifyAsync(a,t)})))})}parseStream(e){return s(this,null,function*(){return(yield c.toReadable(this.csvs)).map(a=>r.parseStream(a,e))})}transformStream(e,t,a){return s(this,null,function*(){return(yield c.toReadable(e)).map(i=>r.transformStream(i,t,a))})}stringifyStream(e,t){return s(this,null,function*(){return(yield c.toReadable(e)).map(n=>r.stringifyStream(n,t))})}parseSync(e){return this.csvs.map(t=>r.parseSync(t,e))}transformSync(e,t,a){return e.map(n=>r.transformSync(n,t,a))}stringifySync(e,t){return e.map(a=>r.stringifySync(a,t))}custom(e){return s(this,null,function*(){return Promise.all(this.csvs.map((t,a)=>s(this,null,function*(){return e(t,a)})))})}static filter(...e){return s(this,null,function*(){return new p(...e).custom("csv")})}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static new(e){let t=e.filter(a=>a.length>0);if(t.length===0)throw new Error(`${r.name}: Non valid csv`);return new r(...t)}static generateAsync(){return s(this,arguments,function*(e={}){return new Promise((t,a)=>{d.generate(e,(n,i)=>{if(n)return a(n);t(i)})})})}static parseAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{d.parse(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static transformAsync(n,i){return s(this,arguments,function*(e,t,a={}){return new Promise((o,f)=>{d.transform(e,a,t,(l,m)=>{if(l)return f(l);o(m)})})})}static stringifyAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{d.stringify(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static generateStream(e={}){return d.generate(e)}static parseStream(e,t={}){return c.stream(e,d.parse(t))}static transformStream(e,t,a={}){return c.stream(e,d.transform(a,t))}static stringifyStream(e,t={}){return c.stream(e,d.stringify(t))}static generateSync(e={}){return g.generate(e)}static parseSync(e,t={}){return g.parse(e,t)}static transformSync(e,t,a={}){return g.transform(e,a,t)}static stringifySync(e,t={}){return g.stringify(e,t)}};import Re from"fluent-ffmpeg";import{path as Ie}from"@ffmpeg-installer/ffmpeg";import{path as Ue}from"@ffprobe-installer/ffprobe";import ze from"path";var v=class r extends c{constructor(...e){super(),this.avs=e}get length(){return this.avs.length}metadata(){return s(this,null,function*(){let e=yield new y(...this.avs).init(),t=yield Promise.all(e.paths.map(a=>s(this,null,function*(){return new Promise((n,i)=>{r.newFfmpeg(a).ffprobe((o,f)=>{if(o)return i(o);n(f)})})})));return yield e.clean(),t})}convert(e,t){return s(this,null,function*(){let a=yield new y(...this.avs).init(),n=yield Promise.all(a.paths.map(i=>s(this,null,function*(){return new Promise((o,f)=>{let l=ze.join(a.tmp.path,y.generateFileName(e));r.newFfmpeg(i,t).on("end",()=>{c.loadFile(l).then(o,f)}).on("error",f).output(l,{end:!0}).run()})})));return yield a.clean(),n})}custom(e){return s(this,null,function*(){let t=yield new y(...this.avs).init(),a=yield Promise.all(t.paths.map((n,i)=>s(this,null,function*(){return e(r.newFfmpeg(n),i)})));return yield t.clean(),a})}static newFfmpeg(e,t){return Re(t).clone().setFfmpegPath(Ie).setFfprobePath(Ue).input(e)}};var S=class r extends v{constructor(...e){super(...e)}getAudios(){return[...this.avs]}setAudios(e){return s(this,null,function*(){let a=(yield Promise.all(this.avs.map((i,o)=>s(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...a);return this.avs=n,this.length})}append(...e){return s(this,null,function*(){let t=yield r.filter(...e);return this.avs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.avs.push(...t.getAudios())}),this.length}clone(){return new r(...this.avs)}filter(){return s(this,null,function*(){return this.avs=yield r.filter(...this.avs),this.length})}static filter(...e){return new p(...e).audio()}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static new(e){return s(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid audio`);return new r(...t)})}};var F=class r extends v{constructor(...e){super(...e)}getVideos(){return[...this.avs]}setVideos(e){return s(this,null,function*(){let a=(yield Promise.all(this.avs.map((i,o)=>s(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...a);return this.avs=n,this.length})}append(...e){return s(this,null,function*(){let t=yield r.filter(...e);return this.avs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.avs.push(...t.getVideos())}),this.length}clone(){return new r(...this.avs)}filter(){return s(this,null,function*(){return this.avs=yield r.filter(...this.avs),this.length})}static filter(...e){return s(this,null,function*(){return new p(...e).video()})}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static new(e){return s(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid video`);return new r(...t)})}};var I=class{constructor(...e){this.files=e}image(){return new x(...this.files)}pdf(){return new b(...this.files)}csv(){return new P(...this.files)}text(){return new B(...this.files)}video(){return new F(...this.files)}audio(){return new S(...this.files)}};export{I as Processor,z as core,U as helper};
