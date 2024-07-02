var E=Object.defineProperty;var V=Object.getOwnPropertySymbols;var W=Object.prototype.hasOwnProperty,J=Object.prototype.propertyIsEnumerable;var j=(r,e,t)=>e in r?E(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,L=(r,e)=>{for(var t in e||(e={}))W.call(e,t)&&j(r,t,e[t]);if(V)for(var t of V(e))J.call(e,t)&&j(r,t,e[t]);return r};var $=(r,e)=>{for(var t in e)E(r,t,{get:e[t],enumerable:!0})};var a=(r,e,t)=>new Promise((s,n)=>{var i=l=>{try{f(t.next(l))}catch(p){n(p)}},o=l=>{try{f(t.throw(l))}catch(p){n(p)}},f=l=>l.done?s(l.value):Promise.resolve(l.value).then(i,o);f((t=t.apply(r,e)).next())});var z={};$(z,{Audio:()=>S,CSV:()=>P,Image:()=>x,PDF:()=>b,Text:()=>B,Video:()=>F});var U={};$(U,{FilterFile:()=>m,TmpFile:()=>y,input2buffer:()=>Pe,isArrayOfBuffer:()=>ve,isArrayOfString:()=>Se,isUrl:()=>R});import{Mutex as T}from"async-mutex";import h from"@ryn-bsd/is-file";import{Readable as G}from"stream";import{isAnyArrayBuffer as K,isUint8Array as Q}from"util/types";import{readFile as X,writeFile as Y}from"fs/promises";import Z from"path";import{any2buffer as _,array2buffer as ee,buffer2readable as te,isReadable as N,isReadableStream as re,isStream as se,readable2buffer as ae,readablestream2buffer as ne,stream2buffer as ie,string2buffer as oe,uint8array2buffer as fe,url2buffer as ce}from"@ryn-bsd/from-buffer-to";import H from"is-base64";import le from"puppeteer";var c=class r{constructor(){}static stream(e,t){return e.pipe(t)}static initBrowser(e){return le.launch(e)}static loadFile(e){return a(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.loadFile(t))):X(e)})}static loadUrl(e){return a(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.loadUrl(t))):ce(e)})}static toBuffer(e){return a(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.toBuffer(t))):Buffer.isBuffer(e)?e:R(e)?r.loadUrl(e):Q(e)?fe(e):K(e)?ee(e):se(e)?ie(e):re(e)?ne(e):N(e)&&G.isReadable(e)?ae(e):typeof e=="string"?R(e)?r.loadUrl(e):Z.isAbsolute(e)?r.loadFile(e):H(e,{allowEmpty:!1})?Buffer.from(e,"base64"):oe(e,!1):_(e)})}static toReadable(e){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(s=>r.toReadable(s)));if(N(e)&&G.isReadable(e))return e;let t=yield r.toBuffer(e);return te(t)})}static toBase64(e,t="base64"){return a(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(n=>r.toBase64(n))):typeof e=="string"&&H(e)?e:(yield r.toBuffer(e)).toString(t)})}static toFile(e){return a(this,null,function*(){return Promise.all(e.map(t=>a(this,null,function*(){let s=yield r.toBuffer(t.input);return Y(t.path,s)})))})}};var m=class r{constructor(...e){this.input=e}application(){return a(this,null,function*(){let{applications:e}=yield r.filter(...this.input);return e})}audio(){return a(this,null,function*(){let{audios:e}=yield r.filter(...this.input);return e})}font(){return a(this,null,function*(){let{fonts:e}=yield r.filter(...this.input);return e})}image(){return a(this,null,function*(){let{images:e}=yield r.filter(...this.input);return e})}model(){return a(this,null,function*(){let{models:e}=yield r.filter(...this.input);return e})}text(){return a(this,null,function*(){let{texts:e}=yield r.filter(...this.input);return e})}video(){return a(this,null,function*(){let{videos:e}=yield r.filter(...this.input);return e})}custom(e){return a(this,null,function*(){let t=yield c.toBuffer(this.input);return(yield h.isCustom(t,e)).filter(n=>n.valid).map(n=>n.value)})}static filter(...e){return a(this,null,function*(){let t=yield c.toBuffer(e),s={applications:new T,audios:new T,fonts:new T,images:new T,models:new T,texts:new T,videos:new T},n={applications:[],audios:[],fonts:[],images:[],models:[],texts:[],videos:[]};return yield Promise.all(t.map(i=>a(this,null,function*(){if(yield h.isApplication(i)){let o=yield s.applications.acquire();n.applications.push(i),o()}else if(yield h.isAudio(i)){let o=yield s.audios.acquire();n.audios.push(i),o()}else if(yield h.isFont(i)){let o=yield s.fonts.acquire();n.fonts.push(i),o()}else if(yield h.isImage(i)){let o=yield s.images.acquire();n.images.push(i),o()}else if(yield h.isModel(i)){let o=yield s.models.acquire();n.models.push(i),o()}else if(yield h.isText(i)){let o=yield s.texts.acquire();n.texts.push(i),o()}else if(yield h.isVideo(i)){let o=yield s.videos.acquire();n.videos.push(i),o()}}))),n})}};import{writeFile as ue}from"fs/promises";import{randomUUID as me}from"crypto";import pe from"path";import{dir as de}from"tmp-promise";import{Node as ye}from"@ryn-bsd/is-file";var y=class r{constructor(...e){this.paths=[];this.files=e}createFn(e){return a(this,null,function*(){var i,o;let t=(o=(i=yield ye.type(e))==null?void 0:i.ext)!=null?o:"";if(t.length===0)throw new Error(`${r.name}: Unknown file when create`);let s=r.generateFileName(t),n=pe.join(this.tmp.path,s);yield ue(n,e),this.paths.push(n)})}create(){return a(this,null,function*(){yield Promise.all(this.files.map(this.createFn.bind(this)))})}init(e){return a(this,null,function*(){return this.tmp=yield de(L({unsafeCleanup:!0},e)),yield this.create(),this})}clean(){return a(this,null,function*(){yield this.tmp.cleanup(),this.paths.splice(0,this.paths.length)})}static generateFileName(e){return`${me()}_${Date.now()}.${e}`}};import{readFile as he}from"fs/promises";import{isReadable as ge,isStream as we,stream2buffer as Te}from"@ryn-bsd/from-buffer-to";import{isArrayBuffer as xe,isSharedArrayBuffer as Be,isUint8Array as be}from"util/types";function Pe(r){return a(this,null,function*(){return Buffer.isBuffer(r)?r:typeof r=="string"?he(r):ge(r)||we(r)?Te(r):be(r)||xe(r)||Be(r)?Buffer.from(r):null})}function ve(r){if(!Array.isArray(r))return!1;for(let e of r)if(!Buffer.isBuffer(e))return!1;return!0}function Se(r){if(!Array.isArray(r))return!1;for(let e of r)if(typeof e!="string")return!1;return!0}function R(r){if(typeof r!="string")return!1;try{return new URL(r),!0}catch(e){return!1}}import Fe from"sharp";var x=class r extends c{constructor(...e){super(),this.images=e}get length(){return this.images.length}getImages(){return[...this.images]}setImages(e){return a(this,null,function*(){let s=(yield Promise.all(this.images.map((i,o)=>a(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...s);return this.images=n,this.length})}append(...e){return a(this,null,function*(){let t=yield r.filter(...e);return this.images.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.images.push(...t.getImages())}),this.length}clone(){return new r(...this.images)}filter(){return a(this,null,function*(){return this.images=yield r.filter(...this.images),this.length})}metadata(){return a(this,null,function*(){return Promise.all(this.images.map(e=>a(this,null,function*(){return r.newSharp(e).metadata()})))})}watermark(e,t){return a(this,null,function*(){let{resize:s,gravity:n="center",alpha:i=.5,tile:o=!1,blend:f="over",premultiplied:l}=t,p=yield c.toBuffer(e),A=yield r.newSharp(p).resize(s).ensureAlpha(i).composite([{input:Buffer.from([0,0,0,Math.round(255*i)]),raw:{width:1,height:1,channels:4},tile:!0,blend:"dest-in"}]).toBuffer();return Promise.all(this.images.map(C=>a(this,null,function*(){return r.newSharp(C).composite([{input:A,gravity:n,blend:f,tile:o,premultiplied:l}]).toBuffer({resolveWithObject:!0})})))})}convert(e,t){return a(this,null,function*(){return Promise.all(this.images.map(s=>a(this,null,function*(){return r.newSharp(s).toFormat(e,t).toBuffer({resolveWithObject:!0})})))})}custom(e){return a(this,null,function*(){return Promise.all(this.images.map((t,s)=>a(this,null,function*(){return e(r.newSharp(t),s)})))})}static filter(...e){return a(this,null,function*(){return new m(...e).image()})}static justBuffer(e){return Array.isArray(e)?e.map(t=>r.justBuffer(t)):e.data}static screenshot(e,t){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(f=>a(this,null,function*(){return r.screenshot(f,t)})));let s=yield c.initBrowser(),n=yield s.newPage(),i=yield n.goto(e,{waitUntil:"networkidle2"});if(i===null||!i.ok())throw new Error(`${r.name}: Can't fetch (${e})`);let o=yield n.screenshot(t);return yield s.close(),o})}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e),s=yield r.filter(...t);return new r(...s)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e),s=yield r.filter(...t);return new r(...s)})}static newSharp(e,t){return Fe(e,t).clone()}static new(e){return a(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid image`);return new r(...t)})}};import u from"zlib";var B=class r extends c{constructor(...e){super(),this.texts=e}get length(){return this.texts.length}getTexts(){return[...this.texts]}setTexts(e){return a(this,null,function*(){let s=(yield Promise.all(this.texts.map((n,i)=>a(this,null,function*(){return e(n,i)})))).filter(n=>Buffer.isBuffer(n)&&n.length>0);return this.texts=s,this.length})}append(...e){return a(this,null,function*(){return this.texts.push(...e),this.length})}extend(...e){return e.forEach(t=>{this.texts.push(...t.getTexts())}),this.length}clone(){return new r(...this.texts)}filter(){return a(this,null,function*(){return this.texts=yield r.filter(...this.texts),this.length})}charactersMap(e){let t=new Map,s=e.toString();for(let n of s){let i=n.charCodeAt(0);t.has(i)?t.set(i,t.get(i)+1):t.set(i,1)}return t}metadata(){return a(this,null,function*(){return Promise.all(this.texts.map(e=>a(this,null,function*(){return{size:e.length,charactersMap:this.charactersMap(e)}})))})}compressAsync(e,t){return a(this,null,function*(){return Promise.all(r.compress(this.texts,e,r.gzipAsync,r.deflateAsync,r.deflateRawAsync,r.brotliCompressAsync,t))})}decompressAsync(e,t){return a(this,null,function*(){return Promise.all(r.decompress(this.texts,e,r.gunzipAsync,r.inflateAsync,r.inflateRawAsync,r.brotliDecompressAsync,r.unzipAsync,t))})}compressStream(e,t){return a(this,null,function*(){let s=yield c.toReadable(this.texts);return r.compress(s,e,r.gzipStream,r.deflateStream,r.deflateRawStream,r.brotliCompressStream,t)})}decompressStream(e,t){return a(this,null,function*(){let s=yield c.toReadable(this.texts);return r.decompress(s,e,r.gunzipStream,r.inflateStream,r.inflateRawStream,r.brotliDecompressStream,r.unzipStream,t)})}compressSync(e,t){return r.compress(this.texts,e,r.gzipSync,r.deflateSync,r.deflateRawSync,r.brotliCompressSync,t)}decompressSync(e,t){return r.decompress(this.texts,e,r.gunzipSync,r.inflateSync,r.inflateRawSync,r.brotliDecompressSync,r.unzipSync,t)}custom(e){return a(this,null,function*(){return Promise.all(this.texts.map((t,s)=>a(this,null,function*(){return e(t,s)})))})}static compress(e,t,s,n,i,o,f){return e.map(l=>{switch(t){case"gzip":return s(l,f);case"deflate":return n(l,f);case"deflate-raw":return i(l,f);case"brotli-compress":return o(l,f);default:throw new TypeError(`${r.name}: Invalid compression method (${t})`)}})}static decompress(e,t,s,n,i,o,f,l){return e.map(p=>{switch(t){case"gunzip":return s(p,l);case"inflate":return n(p,l);case"inflate-raw":return i(p,l);case"brotli-decompress":return o(p,l);case"unzip":return f(p,l);default:throw new TypeError(`${r.name}: Invalid decompression method (${t})`)}})}static filter(...e){return a(this,null,function*(){return new m(...e).text()})}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e);return new r(...t)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e);return new r(...t)})}static new(e){let t=e.filter(s=>s.length>0);if(t.length===0)throw new Error(`${r.name}: Non valid text`);return new r(...t)}static gzipAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.gzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static deflateAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.deflate(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static deflateRawAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.deflateRaw(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static brotliCompressAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.brotliCompress(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static gunzipAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.gunzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static inflateAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.inflate(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static inflateRawAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.inflateRaw(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static brotliDecompressAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.brotliDecompress(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static unzipAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{u.unzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static gzipStream(e,t={}){let s=u.createGzip(t);return c.stream(e,s)}static deflateStream(e,t={}){let s=u.createDeflate(t);return c.stream(e,s)}static deflateRawStream(e,t={}){let s=u.createDeflateRaw(t);return c.stream(e,s)}static brotliCompressStream(e,t={}){let s=u.createBrotliCompress(t);return c.stream(e,s)}static gunzipStream(e,t={}){let s=u.createGunzip(t);return c.stream(e,s)}static inflateStream(e,t={}){let s=u.createInflate(t);return c.stream(e,s)}static inflateRawStream(e,t={}){let s=u.createInflateRaw(t);return c.stream(e,s)}static brotliDecompressStream(e,t={}){let s=u.createBrotliDecompress(t);return c.stream(e,s)}static unzipStream(e,t={}){let s=u.createUnzip(t);return c.stream(e,s)}static gzipSync(e,t={}){return u.gzipSync(e,t)}static deflateSync(e,t={}){return u.deflateSync(e,t)}static deflateRawSync(e,t={}){return u.deflateRawSync(e,t)}static brotliCompressSync(e,t={}){return u.brotliCompressSync(e,t)}static gunzipSync(e,t={}){return u.gunzipSync(e,t)}static inflateSync(e,t={}){return u.inflateSync(e,t)}static inflateRawSync(e,t={}){return u.inflateRawSync(e,t)}static brotliDecompressSync(e,t={}){return u.brotliDecompressSync(e,t)}static unzipSync(e,t={}){return u.unzipSync(e,t)}};import{PageSizes as Oe,PDFDocument as D}from"pdf-lib";var b=class r extends c{constructor(...e){super(),this.pdfs=e}get length(){return this.pdfs.length}getPdfs(){return[...this.pdfs]}setPdfs(e){return a(this,null,function*(){let s=(yield Promise.all(this.pdfs.map((i,o)=>a(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...s);return this.pdfs=n,this.length})}append(...e){return a(this,null,function*(){let t=yield r.filter(...e);return this.pdfs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.pdfs.push(...t.getPdfs())}),this.length}clone(){return new r(...this.pdfs)}filter(){return a(this,null,function*(){return this.pdfs=yield r.filter(...this.pdfs),this.length})}getDocuments(e){return a(this,null,function*(){return Promise.all(this.pdfs.map(t=>a(this,null,function*(){return r.load(t.buffer,e)})))})}metadata(e){return a(this,null,function*(){let t=yield this.getDocuments(e);return Promise.all(t.map(s=>a(this,null,function*(){return{title:s.getTitle(),author:s.getAuthor(),subject:s.getSubject(),creator:s.getCreator(),keywords:s.getKeywords(),producer:s.getProducer(),pageCount:s.getPageCount(),pageIndices:s.getPageIndices(),creationDate:s.getCreationDate(),modificationDate:s.getModificationDate()}})))})}getPages(e){return a(this,null,function*(){let t=yield this.getDocuments(e);return Promise.all(t.map(s=>a(this,null,function*(){return s.getPages()})))})}getForm(e){return a(this,null,function*(){let t=yield this.getDocuments(e);return Promise.all(t.map(s=>a(this,null,function*(){return s.getForm()})))})}merge(e){return a(this,null,function*(){let t=yield r.create(e==null?void 0:e.create);return(yield Promise.all(this.pdfs.map(n=>a(this,null,function*(){let i=yield r.load(n.buffer,e==null?void 0:e.load);return t.copyPages(i,i.getPageIndices())})))).forEach(n=>n.forEach(i=>t.addPage(i))),t})}custom(e,t){return a(this,null,function*(){let s=yield this.getDocuments(t);return Promise.all(s.map((n,i)=>a(this,null,function*(){return e(n,i)})))})}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e),s=yield r.filter(...t);return new r(...s)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e),s=yield r.filter(...t);return new r(...s)})}static fromImage(s){return a(this,arguments,function*(e,t={}){var k,M;if(Array.isArray(e))return Promise.all(e.map(q=>r.fromImage(q,t)));let[n,i]=yield Promise.all([new m(e).custom("png"),new m(e).custom("jpg")]);if(i.length===0&&n.length===0)throw new Error(`${r.name}: Invalid images to convert to pdf`);let{pageSize:o=Oe.A4,scaleImage:f,position:l}=t,p=yield D.create(t.create),A=p.addPage(o),C=A.getSize(),w;n.length>0?w=yield p.embedPng(e.buffer):w=yield p.embedJpg(e.buffer);let O=w.size();return typeof f=="number"?O=w.scale(f):Array.isArray(f)?O=w.scaleToFit(f[0],f[1]):O=w.scaleToFit(C.width,C.height),A.drawImage(w,{x:(k=l==null?void 0:l[0])!=null?k:0,y:(M=l==null?void 0:l[1])!=null?M:0,width:O.width,height:O.height}),p})}static generate(e,t){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(f=>r.generate(f,t)));let s=yield c.initBrowser(),n=yield s.newPage(),i=yield n.goto(e,{waitUntil:"networkidle2"});if(i===null||!i.ok())throw new Error(`${r.name}: Can't fetch (${e})`);let o=yield n.pdf(t);return yield s.close(),o})}static filter(...e){return new m(...e).custom("pdf")}static save(e,t){return a(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(s=>r.save(s,t))):e.save(t)})}static load(e,t){return a(this,null,function*(){return D.load(e,t)})}static create(e){return a(this,null,function*(){return D.create(e)})}static document(){return D}static new(e){return a(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid pdf`);return new r(...t)})}};import*as d from"csv";import*as g from"csv/sync";var P=class r extends c{constructor(...e){super(),this.csvs=e}get length(){return this.csvs.length}getCsvs(){return[...this.csvs]}setCsvs(e){return a(this,null,function*(){let s=(yield Promise.all(this.csvs.map((n,i)=>a(this,null,function*(){return e(n,i)})))).filter(n=>Buffer.isBuffer(n)&&n.length>0);return this.csvs=s,this.length})}append(...e){return a(this,null,function*(){return this.csvs.push(...e),this.length})}extend(...e){return e.forEach(t=>{this.csvs.push(...t.getCsvs())}),this.length}clone(){return new r(...this.csvs)}filter(){return a(this,null,function*(){return this.csvs=yield r.filter(...this.csvs),this.length})}metadata(){return a(this,null,function*(){return Promise.all(this.csvs.map(e=>a(this,null,function*(){var s,n;let t=yield r.parseAsync(e);return{size:e.length,rows:t.length,columns:(n=(s=t==null?void 0:t[0])==null?void 0:s.length)!=null?n:0}})))})}parseAsync(e){return a(this,null,function*(){return Promise.all(this.csvs.map(t=>a(this,null,function*(){return r.parseAsync(t,e)})))})}transformAsync(e,t,s){return a(this,null,function*(){return Promise.all(e.map(n=>a(this,null,function*(){return r.transformAsync(n,t,s)})))})}stringifyAsync(e,t){return a(this,null,function*(){return Promise.all(e.map(s=>a(this,null,function*(){return r.stringifyAsync(s,t)})))})}parseStream(e){return a(this,null,function*(){return(yield c.toReadable(this.csvs)).map(s=>r.parseStream(s,e))})}transformStream(e,t,s){return a(this,null,function*(){return(yield c.toReadable(e)).map(i=>r.transformStream(i,t,s))})}stringifyStream(e,t){return a(this,null,function*(){return(yield c.toReadable(e)).map(n=>r.stringifyStream(n,t))})}parseSync(e){return this.csvs.map(t=>r.parseSync(t,e))}transformSync(e,t,s){return e.map(n=>r.transformSync(n,t,s))}stringifySync(e,t){return e.map(s=>r.stringifySync(s,t))}custom(e){return a(this,null,function*(){return Promise.all(this.csvs.map((t,s)=>a(this,null,function*(){return e(t,s)})))})}static filter(...e){return a(this,null,function*(){return new m(...e).custom("csv")})}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e);return new r(...t)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e);return new r(...t)})}static new(e){let t=e.filter(s=>s.length>0);if(t.length===0)throw new Error(`${r.name}: Non valid csv`);return new r(...t)}static generateAsync(){return a(this,arguments,function*(e={}){return new Promise((t,s)=>{d.generate(e,(n,i)=>{if(n)return s(n);t(i)})})})}static parseAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{d.parse(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static transformAsync(n,i){return a(this,arguments,function*(e,t,s={}){return new Promise((o,f)=>{d.transform(e,s,t,(l,p)=>{if(l)return f(l);o(p)})})})}static stringifyAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{d.stringify(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static generateStream(e={}){return d.generate(e)}static parseStream(e,t={}){return c.stream(e,d.parse(t))}static transformStream(e,t,s={}){return c.stream(e,d.transform(s,t))}static stringifyStream(e,t={}){return c.stream(e,d.stringify(t))}static generateSync(e={}){return g.generate(e)}static parseSync(e,t={}){return g.parse(e,t)}static transformSync(e,t,s={}){return g.transform(e,s,t)}static stringifySync(e,t={}){return g.stringify(e,t)}};import Ae from"fluent-ffmpeg";import{path as Ce}from"@ffmpeg-installer/ffmpeg";import{path as Re}from"@ffprobe-installer/ffprobe";import De from"path";var v=class r extends c{constructor(...e){super(),this.avs=e}get length(){return this.avs.length}metadata(){return a(this,null,function*(){let e=yield new y(...this.avs).init(),t=yield Promise.all(e.paths.map(s=>a(this,null,function*(){return new Promise((n,i)=>{r.newFfmpeg(s).ffprobe((o,f)=>{if(o)return i(o);n(f)})})})));return yield e.clean(),t})}convert(e,t){return a(this,null,function*(){let s=yield new y(...this.avs).init(),n=yield Promise.all(s.paths.map(i=>a(this,null,function*(){return new Promise((o,f)=>{let l=De.join(s.tmp.path,y.generateFileName(e));r.newFfmpeg(i,t).on("end",()=>{c.loadFile(l).then(o).catch(f)}).on("error",f).output(l,{end:!0}).run()})})));return yield s.clean(),n})}custom(e){return a(this,null,function*(){let t=yield new y(...this.avs).init(),s=yield Promise.all(t.paths.map((n,i)=>a(this,null,function*(){return e(r.newFfmpeg(n),i)})));return yield t.clean(),s})}static newFfmpeg(e,t){return Ae(t).clone().setFfmpegPath(Ce).setFfprobePath(Re).input(e)}};var S=class r extends v{constructor(...e){super(...e)}getAudios(){return[...this.avs]}setAudios(e){return a(this,null,function*(){let s=(yield Promise.all(this.avs.map((i,o)=>a(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...s);return this.avs=n,this.length})}append(...e){return a(this,null,function*(){let t=yield r.filter(...e);return this.avs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.avs.push(...t.getAudios())}),this.length}clone(){return new r(...this.avs)}filter(){return a(this,null,function*(){return this.avs=yield r.filter(...this.avs),this.length})}static filter(...e){return new m(...e).audio()}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e),s=yield r.filter(...t);return new r(...s)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e),s=yield r.filter(...t);return new r(...s)})}static new(e){return a(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid audio`);return new r(...t)})}};var F=class r extends v{constructor(...e){super(...e)}getVideos(){return[...this.avs]}setVideos(e){return a(this,null,function*(){let s=(yield Promise.all(this.avs.map((i,o)=>a(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...s);return this.avs=n,this.length})}append(...e){return a(this,null,function*(){let t=yield r.filter(...e);return this.avs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.avs.push(...t.getVideos())}),this.length}clone(){return new r(...this.avs)}filter(){return a(this,null,function*(){return this.avs=yield r.filter(...this.avs),this.length})}static filter(...e){return a(this,null,function*(){return new m(...e).video()})}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e),s=yield r.filter(...t);return new r(...s)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e),s=yield r.filter(...t);return new r(...s)})}static new(e){return a(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid video`);return new r(...t)})}};var I=class{constructor(...e){this.files=e}image(){return new x(...this.files)}pdf(){return new b(...this.files)}csv(){return new P(...this.files)}text(){return new B(...this.files)}video(){return new F(...this.files)}audio(){return new S(...this.files)}};export{I as Processor,z as core,U as helper};
