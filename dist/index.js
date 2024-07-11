var H=Object.defineProperty;var G=Object.getOwnPropertySymbols;var Z=Object.prototype.hasOwnProperty,_=Object.prototype.propertyIsEnumerable;var $=(r,e,t)=>e in r?H(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,W=(r,e)=>{for(var t in e||(e={}))Z.call(e,t)&&$(r,t,e[t]);if(G)for(var t of G(e))_.call(e,t)&&$(r,t,e[t]);return r};var q=(r,e)=>{for(var t in e)H(r,t,{get:e[t],enumerable:!0})};var s=(r,e,t)=>new Promise((a,n)=>{var i=u=>{try{f(t.next(u))}catch(m){n(m)}},o=u=>{try{f(t.throw(u))}catch(m){n(m)}},f=u=>u.done?a(u.value):Promise.resolve(u.value).then(i,o);f((t=t.apply(r,e)).next())});var L={};q(L,{Audio:()=>A,CSV:()=>S,Image:()=>v,PDF:()=>D,PDF_experimental:()=>U,Text:()=>O,Video:()=>I});var N={};q(N,{FilterFile:()=>p,TmpFile:()=>h,input2buffer:()=>Se,isArrayOfBuffer:()=>De,isArrayOfString:()=>Ae,isUrl:()=>j});import{Mutex as F}from"async-mutex";import P,{Node as ye}from"@ryn-bsd/is-file";import{Readable as J}from"stream";import{isAnyArrayBuffer as ee,isUint8Array as te}from"util/types";import C from"fs";import K from"path";import{any2buffer as re,array2buffer as se,buffer2readable as ae,isReadable as Y,isReadableStream as ne,isStream as ie,readable2buffer as oe,readablestream2buffer as fe,stream2buffer as ce,string2buffer as ue,uint8array2buffer as le,url2buffer as me}from"@ryn-bsd/from-buffer-to";import Q from"is-base64";import pe from"fast-glob";import de from"puppeteer";var c=class r{constructor(){}static stream(e,t){return e.pipe(t)}static initBrowser(e){return de.launch(e)}static loadFile(e){return s(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.loadFile(t))):C.promises.readFile(e)})}static loadDir(e){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(a=>r.loadDir(a)));let t=yield C.promises.readdir(e);return r.loadFile(t.map(a=>K.join(e,a)))})}static loadGlob(e,t){return s(this,null,function*(){var o;let a=yield pe(e,t),n=(o=t==null?void 0:t.cwd)!=null?o:process.cwd();return(yield Promise.all(a.map(f=>s(this,null,function*(){let u=K.join(n,f),m=yield C.promises.stat(u);return m.isFile()?r.loadFile(u):m.isDirectory()?r.loadDir(u):null})))).filter(f=>f!==null)})}static loadUrl(e){return s(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.loadUrl(t))):me(e)})}static toBuffer(e){return s(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.toBuffer(t))):Buffer.isBuffer(e)?e:j(e)?r.loadUrl(e):te(e)?le(e):ee(e)?se(e):ie(e)?ce(e):ne(e)?fe(e):Y(e)&&J.isReadable(e)?oe(e):typeof e=="string"?(yield C.promises.stat(e)).isFile()?r.loadFile(e):Q(e,{allowEmpty:!1})?Buffer.from(e,"base64"):ue(e,!1):re(e)})}static toReadable(e){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(a=>r.toReadable(a)));if(Y(e)&&J.isReadable(e))return e;let t=yield r.toBuffer(e);return ae(t)})}static toBase64(e,t="base64"){return s(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(n=>r.toBase64(n))):typeof e=="string"&&Q(e)?e:(yield r.toBuffer(e)).toString(t)})}static toFile(e){return s(this,null,function*(){yield Promise.all(e.map(t=>s(this,null,function*(){let a=yield r.toBuffer(t.input);return C.promises.writeFile(t.path,a)})))})}};var p=class r{constructor(...e){this.input=e}application(){return s(this,null,function*(){let{applications:e}=yield r.filter(...this.input);return e})}audio(){return s(this,null,function*(){let{audios:e}=yield r.filter(...this.input);return e})}font(){return s(this,null,function*(){let{fonts:e}=yield r.filter(...this.input);return e})}image(){return s(this,null,function*(){let{images:e}=yield r.filter(...this.input);return e})}model(){return s(this,null,function*(){let{models:e}=yield r.filter(...this.input);return e})}text(){return s(this,null,function*(){let{texts:e}=yield r.filter(...this.input);return e})}video(){return s(this,null,function*(){let{videos:e}=yield r.filter(...this.input);return e})}custom(e){return s(this,null,function*(){let t=yield c.toBuffer(this.input);return(yield P.isCustom(t,e)).filter(n=>n.valid).map(n=>n.value)})}static filter(...e){return s(this,null,function*(){let t=yield c.toBuffer(e),a={applications:new F,audios:new F,fonts:new F,images:new F,models:new F,texts:new F,videos:new F},n={applications:[],audios:[],fonts:[],images:[],models:[],texts:[],videos:[]};return yield Promise.all(t.map(i=>s(this,null,function*(){if(yield P.isApplication(i)){let o=yield a.applications.acquire();n.applications.push(i),o()}else if(yield P.isAudio(i)){let o=yield a.audios.acquire();n.audios.push(i),o()}else if(yield P.isFont(i)){let o=yield a.fonts.acquire();n.fonts.push(i),o()}else if(yield P.isImage(i)){let o=yield a.images.acquire();n.images.push(i),o()}else if(yield P.isModel(i)){let o=yield a.models.acquire();n.models.push(i),o()}else if(yield P.isText(i)){let o=yield a.texts.acquire();n.texts.push(i),o()}else if(yield P.isVideo(i)){let o=yield a.videos.acquire();n.videos.push(i),o()}}))),n})}static type(e){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(a=>r.type(a)));let t=yield c.toBuffer(e);return ye.type(t)})}static mime(e){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(a=>r.mime(a)));let t=yield r.type(e);return t==null?void 0:t.mime})}static extension(e){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(a=>r.extension(a)));let t=yield r.type(e);return t==null?void 0:t.ext})}};import{writeFile as ge}from"fs/promises";import{randomUUID as he}from"crypto";import we from"path";import{dir as Te}from"tmp-promise";var h=class r{constructor(...e){this.paths=[];this.files=e}createFn(e){return s(this,null,function*(){var i;let t=(i=yield p.extension(e))!=null?i:"";if(t.length===0)throw new Error(`${r.name}: Unknown file when create`);let a=r.generateFileName(t),n=we.join(this.tmp.path,a);yield ge(n,e),this.paths.push(n)})}create(){return s(this,null,function*(){yield Promise.all(this.files.map(this.createFn.bind(this)))})}init(e){return s(this,null,function*(){return this.tmp=yield Te(W({unsafeCleanup:!0},e)),yield this.create(),this})}clean(){return s(this,null,function*(){yield this.tmp.cleanup(),this.paths.splice(0,this.paths.length)})}static generateFileName(e){return`${he()}_${Date.now()}.${e}`}};import{readFile as xe}from"fs/promises";import{isReadable as be,isStream as Pe,stream2buffer as Be}from"@ryn-bsd/from-buffer-to";import{isArrayBuffer as Fe,isSharedArrayBuffer as ve,isUint8Array as Oe}from"util/types";function Se(r){return s(this,null,function*(){return Buffer.isBuffer(r)?r:typeof r=="string"?xe(r):be(r)||Pe(r)?Be(r):Oe(r)||Fe(r)||ve(r)?Buffer.from(r):null})}function De(r){if(!Array.isArray(r))return!1;for(let e of r)if(!Buffer.isBuffer(e))return!1;return!0}function Ae(r){if(!Array.isArray(r))return!1;for(let e of r)if(typeof e!="string")return!1;return!0}function j(r){if(typeof r!="string")return!1;try{return new URL(r),!0}catch(e){return!1}}import Ie from"fs";import Re from"path";import Ce from"fast-glob";import{createWorker as Ue}from"tesseract.js";import ke from"sharp";var v=class r extends c{constructor(...e){super(),this.images=e}get length(){return this.images.length}getImages(){return[...this.images]}setImages(e){return s(this,null,function*(){let a=(yield Promise.all(this.images.map((i,o)=>s(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...a);return this.images=n,this.length})}append(...e){return s(this,null,function*(){let t=yield r.filter(...e);return this.images.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.images.push(...t.getImages())}),this.length}clone(){return new r(...this.images)}filter(){return s(this,null,function*(){return this.images=yield r.filter(...this.images),this.length})}metadata(){return s(this,null,function*(){return this.custom(e=>e.metadata())})}watermark(a){return s(this,arguments,function*(e,t={}){let{resize:n,gravity:i="center",alpha:o=.5,tile:f=!1,blend:u="over",premultiplied:m}=t,b=yield c.toBuffer(e),x=yield r.newSharp(b).resize(n).ensureAlpha(o).composite([{input:Buffer.from([0,0,0,Math.round(255*o)]),raw:{width:1,height:1,channels:4},tile:!0,blend:"dest-in"}]).toBuffer();return this.custom(d=>d.composite([{input:x,gravity:i,blend:u,tile:f,premultiplied:m}]).toBuffer({resolveWithObject:!0}))})}convert(e,t){return s(this,null,function*(){return this.custom(a=>a.toFormat(e,t).toBuffer({resolveWithObject:!0}))})}ocr(e){return s(this,null,function*(){let t=yield Ue(e),a=yield Promise.all(this.images.map(n=>t.recognize(n)));if(yield t.terminate(),process.env.NODE_ENV==="development"||process.env.NODE_ENV==="test"){let n=process.cwd(),i=yield Ce("*.traineddata",{cwd:n});yield Promise.all(i.map(o=>Ie.promises.unlink(Re.join(n,o))))}return a.map(n=>n.data)})}custom(e){return s(this,null,function*(){return Promise.all(this.images.map((t,a)=>s(this,null,function*(){return e(r.newSharp(t),a)})))})}static filter(...e){return s(this,null,function*(){return new p(...e).image()})}static justBuffer(e){return Array.isArray(e)?e.map(t=>r.justBuffer(t)):e.data}static screenshot(e,t){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(f=>s(this,null,function*(){return r.screenshot(f,t)})));let a=yield c.initBrowser(),n=yield a.newPage(),i=yield n.goto(e,{waitUntil:"networkidle2"});if(i===null||!i.ok())throw new Error(`${r.name}: Can't fetch (${e})`);let o=yield n.screenshot(t);return yield a.close(),o})}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static newSharp(e,t){return ke(e,t).clone()}static new(e){return s(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid image`);return new r(...t)})}static isImage(e){return e instanceof r}};import l from"zlib";var O=class r extends c{constructor(...e){super(),this.texts=e}get length(){return this.texts.length}getTexts(){return[...this.texts]}setTexts(e){return s(this,null,function*(){let a=(yield Promise.all(this.texts.map((n,i)=>s(this,null,function*(){return e(n,i)})))).filter(n=>Buffer.isBuffer(n)&&n.length>0);return this.texts=a,this.length})}append(...e){return s(this,null,function*(){let t=e.filter(a=>Buffer.isBuffer(a)&&a.length>0);return this.texts.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.texts.push(...t.getTexts())}),this.length}clone(){return new r(...this.texts)}filter(){return s(this,null,function*(){return this.texts=yield r.filter(...this.texts),this.length})}charactersMap(e){let t=new Map,a=e.toString();for(let n of a){let i=n.charCodeAt(0);t.has(i)?t.set(i,t.get(i)+1):t.set(i,1)}return t}metadata(){return s(this,null,function*(){return this.custom(e=>({size:e.length,charactersMap:this.charactersMap(e)}))})}compressAsync(e,t){return s(this,null,function*(){return Promise.all(r.compress(this.texts,e,r.gzipAsync,r.deflateAsync,r.deflateRawAsync,r.brotliCompressAsync,t))})}decompressAsync(e,t){return s(this,null,function*(){return Promise.all(r.decompress(this.texts,e,r.gunzipAsync,r.inflateAsync,r.inflateRawAsync,r.brotliDecompressAsync,r.unzipAsync,t))})}compressStream(e,t){return s(this,null,function*(){let a=yield c.toReadable(this.texts);return r.compress(a,e,r.gzipStream,r.deflateStream,r.deflateRawStream,r.brotliCompressStream,t)})}decompressStream(e,t){return s(this,null,function*(){let a=yield c.toReadable(this.texts);return r.decompress(a,e,r.gunzipStream,r.inflateStream,r.inflateRawStream,r.brotliDecompressStream,r.unzipStream,t)})}compressSync(e,t){return r.compress(this.texts,e,r.gzipSync,r.deflateSync,r.deflateRawSync,r.brotliCompressSync,t)}decompressSync(e,t){return r.decompress(this.texts,e,r.gunzipSync,r.inflateSync,r.inflateRawSync,r.brotliDecompressSync,r.unzipSync,t)}custom(e){return s(this,null,function*(){return Promise.all(this.texts.map((t,a)=>s(this,null,function*(){return e(t,a)})))})}static compress(e,t,a,n,i,o,f){return e.map(u=>{switch(t){case"gzip":return a(u,f);case"deflate":return n(u,f);case"deflate-raw":return i(u,f);case"brotli-compress":return o(u,f);default:throw new TypeError(`${r.name}: Invalid compression method (${t})`)}})}static decompress(e,t,a,n,i,o,f,u){return e.map(m=>{switch(t){case"gunzip":return a(m,u);case"inflate":return n(m,u);case"inflate-raw":return i(m,u);case"brotli-decompress":return o(m,u);case"unzip":return f(m,u);default:throw new TypeError(`${r.name}: Invalid decompression method (${t})`)}})}static filter(...e){return s(this,null,function*(){return new p(...e).text()})}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static new(e){let t=e.filter(a=>a.length>0);if(t.length===0)throw new Error(`${r.name}: Non valid text`);return new r(...t)}static isText(e){return e instanceof r}static gzipAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{l.gzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static deflateAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{l.deflate(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static deflateRawAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{l.deflateRaw(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static brotliCompressAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{l.brotliCompress(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static gunzipAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{l.gunzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static inflateAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{l.inflate(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static inflateRawAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{l.inflateRaw(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static brotliDecompressAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{l.brotliDecompress(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static unzipAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{l.unzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static gzipStream(e,t={}){let a=l.createGzip(t);return c.stream(e,a)}static deflateStream(e,t={}){let a=l.createDeflate(t);return c.stream(e,a)}static deflateRawStream(e,t={}){let a=l.createDeflateRaw(t);return c.stream(e,a)}static brotliCompressStream(e,t={}){let a=l.createBrotliCompress(t);return c.stream(e,a)}static gunzipStream(e,t={}){let a=l.createGunzip(t);return c.stream(e,a)}static inflateStream(e,t={}){let a=l.createInflate(t);return c.stream(e,a)}static inflateRawStream(e,t={}){let a=l.createInflateRaw(t);return c.stream(e,a)}static brotliDecompressStream(e,t={}){let a=l.createBrotliDecompress(t);return c.stream(e,a)}static unzipStream(e,t={}){let a=l.createUnzip(t);return c.stream(e,a)}static gzipSync(e,t={}){return l.gzipSync(e,t)}static deflateSync(e,t={}){return l.deflateSync(e,t)}static deflateRawSync(e,t={}){return l.deflateRawSync(e,t)}static brotliCompressSync(e,t={}){return l.brotliCompressSync(e,t)}static gunzipSync(e,t={}){return l.gunzipSync(e,t)}static inflateSync(e,t={}){return l.inflateSync(e,t)}static inflateRawSync(e,t={}){return l.inflateRawSync(e,t)}static brotliDecompressSync(e,t={}){return l.brotliDecompressSync(e,t)}static unzipSync(e,t={}){return l.unzipSync(e,t)}};import*as w from"csv";import*as B from"csv/sync";var S=class r extends c{constructor(...e){super(),this.csvs=e}get length(){return this.csvs.length}getCsvs(){return[...this.csvs]}setCsvs(e){return s(this,null,function*(){let a=(yield Promise.all(this.csvs.map((n,i)=>s(this,null,function*(){return e(n,i)})))).filter(n=>Buffer.isBuffer(n)&&n.length>0);return this.csvs=a,this.length})}append(...e){return s(this,null,function*(){let t=e.filter(a=>Buffer.isBuffer(a)&&a.length>0);return this.csvs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.csvs.push(...t.getCsvs())}),this.length}clone(){return new r(...this.csvs)}filter(){return s(this,null,function*(){return this.csvs=yield r.filter(...this.csvs),this.length})}metadata(e){return s(this,null,function*(){return this.custom(t=>s(this,null,function*(){var n,i;let a=yield r.parseAsync(t,e);return{size:t.length,rows:a.length,columns:(i=(n=a==null?void 0:a[0])==null?void 0:n.length)!=null?i:0}}))})}parseAsync(e){return s(this,null,function*(){return this.custom(t=>r.parseAsync(t,e))})}transformAsync(e,t,a){return s(this,null,function*(){return Promise.all(e.map(n=>r.transformAsync(n,t,a)))})}stringifyAsync(e,t){return s(this,null,function*(){return Promise.all(e.map(a=>r.stringifyAsync(a,t)))})}parseStream(e){return s(this,null,function*(){return(yield c.toReadable(this.csvs)).map(a=>r.parseStream(a,e))})}transformStream(e,t,a){return s(this,null,function*(){return(yield c.toReadable(e)).map(i=>r.transformStream(i,t,a))})}stringifyStream(e,t){return s(this,null,function*(){return(yield c.toReadable(e)).map(n=>r.stringifyStream(n,t))})}parseSync(e){return this.csvs.map(t=>r.parseSync(t,e))}transformSync(e,t,a){return e.map(n=>r.transformSync(n,t,a))}stringifySync(e,t){return e.map(a=>r.stringifySync(a,t))}custom(e){return s(this,null,function*(){return Promise.all(this.csvs.map((t,a)=>s(this,null,function*(){return e(t,a)})))})}static filter(...e){return s(this,null,function*(){return new p(...e).custom("csv")})}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static new(e){let t=e.filter(a=>a.length>0);if(t.length===0)throw new Error(`${r.name}: Non valid csv`);return new r(...t)}static isCSV(e){return e instanceof r}static generateAsync(){return s(this,arguments,function*(e={}){return new Promise((t,a)=>{w.generate(e,(n,i)=>{if(n)return a(n);t(i)})})})}static parseAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{w.parse(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static transformAsync(n,i){return s(this,arguments,function*(e,t,a={}){return new Promise((o,f)=>{w.transform(e,a,t,(u,m)=>{if(u)return f(u);o(m)})})})}static stringifyAsync(a){return s(this,arguments,function*(e,t={}){return new Promise((n,i)=>{w.stringify(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static generateStream(e={}){return w.generate(e)}static parseStream(e,t={}){return c.stream(e,w.parse(t))}static transformStream(e,t,a={}){return c.stream(e,w.transform(a,t))}static stringifyStream(e,t={}){return c.stream(e,w.stringify(t))}static generateSync(e={}){return B.generate(e)}static parseSync(e,t={}){return B.parse(e,t)}static transformSync(e,t,a={}){return B.transform(e,a,t)}static stringifySync(e,t={}){return B.stringify(e,t)}};import{PageSizes as Me,PDFDocument as z}from"pdf-lib";var D=class r extends c{constructor(...e){super(),this.pdfs=e}get length(){return this.pdfs.length}getPdfs(){return[...this.pdfs]}setPdfs(e){return s(this,null,function*(){let a=(yield Promise.all(this.pdfs.map((i,o)=>s(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...a);return this.pdfs=n,this.length})}append(...e){return s(this,null,function*(){let t=yield r.filter(...e);return this.pdfs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.pdfs.push(...t.getPdfs())}),this.length}clone(){return new r(...this.pdfs)}filter(){return s(this,null,function*(){return this.pdfs=yield r.filter(...this.pdfs),this.length})}getDocuments(e){return s(this,null,function*(){return Promise.all(this.pdfs.map(t=>r.load(t.buffer,e)))})}metadata(e){return s(this,null,function*(){return this.custom(t=>({title:t.getTitle(),author:t.getAuthor(),subject:t.getSubject(),creator:t.getCreator(),keywords:t.getKeywords(),producer:t.getProducer(),pageCount:t.getPageCount(),pageIndices:t.getPageIndices(),creationDate:t.getCreationDate(),modificationDate:t.getModificationDate()}),e)})}getPages(e){return s(this,null,function*(){return this.custom(t=>t.getPages(),e)})}getForm(e){return s(this,null,function*(){return this.custom(t=>t.getForm(),e)})}merge(e){return s(this,null,function*(){let t=yield r.create(e==null?void 0:e.create);return(yield this.custom(n=>t.copyPages(n,n.getPageIndices()),e==null?void 0:e.load)).forEach(n=>n.forEach(i=>t.addPage(i))),t})}custom(e,t){return s(this,null,function*(){let a=yield this.getDocuments(t);return Promise.all(a.map((n,i)=>s(this,null,function*(){return e(n,i)})))})}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static fromImage(a){return s(this,arguments,function*(e,t={}){var R,k;if(Array.isArray(e))return Promise.all(e.map(M=>r.fromImage(M,t)));let[n,i]=yield Promise.all([new p(e).custom("png"),new p(e).custom("jpg")]);if(i.length===0&&n.length===0)throw new Error(`${r.name}: Invalid images to convert to pdf`);let{pageSize:o=Me.A4,scaleImage:f,position:u}=t,m=yield z.create(t.create),b=m.addPage(o),x=b.getSize(),d;n.length>0?d=yield m.embedPng(e.buffer):d=yield m.embedJpg(e.buffer);let y=d.size();return typeof f=="number"?y=d.scale(f):Array.isArray(f)?y=d.scaleToFit(f[0],f[1]):y=d.scaleToFit(x.width,x.height),b.drawImage(d,{x:(R=u==null?void 0:u[0])!=null?R:0,y:(k=u==null?void 0:u[1])!=null?k:0,width:y.width,height:y.height}),m})}static generate(e,t){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(f=>r.generate(f,t)));let a=yield c.initBrowser(),n=yield a.newPage(),i=yield n.goto(e,{waitUntil:"networkidle2"});if(i===null||!i.ok())throw new Error(`${r.name}: Can't fetch (${e})`);let o=yield n.pdf(t);return yield a.close(),o})}static filter(...e){return new p(...e).custom("pdf")}static save(e,t){return s(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(n=>r.save(n,t)));let a=yield e.save(t);return c.toBuffer(a)})}static load(e,t){return s(this,null,function*(){return z.load(e,t)})}static create(e){return s(this,null,function*(){return z.create(e)})}static document(){return z}static new(e){return s(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid pdf`);return new r(...t)})}static isPDF(e){return e instanceof r}};import*as g from"mupdf";var U=class r{constructor(...e){this.pdfs=[];this.pdfs=e}metadata(){return s(this,null,function*(){return this.custom(e=>({format:e.getMetaData(g.Document.META_FORMAT),encryption:e.getMetaData(g.Document.META_ENCRYPTION),author:e.getMetaData(g.Document.META_INFO_AUTHOR),title:e.getMetaData(g.Document.META_INFO_TITLE),subject:e.getMetaData(g.Document.META_INFO_SUBJECT),keywords:e.getMetaData(g.Document.META_INFO_KEYWORDS),creator:e.getMetaData(g.Document.META_INFO_CREATOR),producer:e.getMetaData(g.Document.META_INFO_PRODUCER),countUnsavedVersions:e.countUnsavedVersions(),countVersions:e.countVersions(),countObjects:e.countObjects(),countPages:e.countPages(),wasRepaired:e.wasRepaired(),language:e.getLanguage(),version:e.getVersion(),creationDate:e.getMetaData(g.Document.META_INFO_CREATIONDATE),modificationDate:e.getMetaData(g.Document.META_INFO_MODIFICATIONDATE)}))})}getTexts(){return s(this,null,function*(){return this.custom(e=>{let t=[],a=e.countPages();for(let n=0;n<a;n++){let i=e.loadPage(n);t.push(i.toStructuredText("preserve-whitespace").asJSON())}return t})})}getImages(){return s(this,null,function*(){return this.custom(e=>{let t=[],a=e.countPages();for(let n=0;n<a;n++){let f,i=e.loadPage(n),o=[];i.toStructuredText("preserve-images").walk({onImageBlock(u,m,b){return s(this,null,function*(){let d=b.toPixmap().asPNG(),y=yield c.toBuffer(d);o.push(y)})}}),t.push(o)}return t})})}annotations(){return s(this,null,function*(){return this.custom(e=>{let t=[],a=e.countPages();for(let n=0;n<a;n++){let i=e.loadPage(n);t.push(i.getAnnotations())}return t})})}links(){return s(this,null,function*(){return this.custom(e=>{let t=[],a=e.countPages();for(let n=0;n<a;n++){let o=e.loadPage(n).getLinks().map(f=>({bounds:f.getBounds(),link:f.getURI(),isExternal:f.isExternal()}));t.push(o)}return t})})}bake(e,t){return s(this,null,function*(){return this.custom(a=>{a.bake(e,t)})})}search(e){return s(this,null,function*(){return this.custom(t=>{})})}custom(e){return s(this,null,function*(){return Promise.all(this.pdfs.map((t,a)=>s(this,null,function*(){let n=r.open(t);return e(n,a)})))})}static open(e){return new g.PDFDocument(e)}static needsPassword(e){return r.open(e).needsPassword()}};import ze from"fluent-ffmpeg";import{path as Ee}from"@ffmpeg-installer/ffmpeg";import{path as je}from"@ffprobe-installer/ffprobe";import X from"path";var T=class r extends c{constructor(...e){super(),this.avs=e}get length(){return this.avs.length}metadata(){return s(this,null,function*(){return this.custom(e=>s(this,null,function*(){return new Promise((t,a)=>{e.ffprobe((n,i)=>{if(n)return a(n);t(i)})})}))})}convert(e){return s(this,null,function*(){return this.custom((t,a)=>s(this,null,function*(){return new Promise((n,i)=>{let o=X.join(a.tmp.path,h.generateFileName(e));t.on("end",()=>{c.loadFile(o).then(n,i)}).on("error",i).output(o).run()})}))})}spilt(e){return s(this,null,function*(){return this.custom((t,a,n)=>s(this,null,function*(){var m,b;let o=(m=(yield new Promise((x,d)=>{t.ffprobe((y,R)=>{if(y)return d(y);x(R)})})).format.duration)!=null?m:0;if(o===0)throw new Error(`${r.name}: Empty av duration`);let f=(b=yield p.extension(this.avs[n]))!=null?b:"";if(f.length===0)throw new Error(`${r.name}: Unknown av format`);function u(x=0){return s(this,null,function*(){let d=Math.min(e,o-x);if(d<=0)return[];let y=X.join(a.tmp.path,h.generateFileName(f));return[yield new Promise((k,M)=>{t.setStartTime(x).setDuration(d).on("end",()=>{c.loadFile(y).then(k,M)}).on("error",M).output(y).run()})].concat(yield u(x+d))})}return u()}))})}custom(e){return s(this,null,function*(){let t=yield new h(...this.avs).init(),a=yield Promise.all(t.paths.map((n,i)=>s(this,null,function*(){return e(r.newFfmpeg(n),t,i)})));return yield t.clean(),a})}static generateTimemarks(e,t=1){return s(this,null,function*(){var i;if(Array.isArray(e))return Promise.all(e.map(o=>r.generateTimemarks(o,t)));let a=[],n=(i=e.format.duration)!=null?i:0;for(let o=0;o<n;o+=t)a.push(o);return a})}static newFfmpeg(e,t){return ze(t).clone().setFfmpegPath(Ee).setFfprobePath(je).input(e)}};var A=class r extends T{constructor(...e){super(...e)}getAudios(){return[...this.avs]}setAudios(e){return s(this,null,function*(){let a=(yield Promise.all(this.avs.map((i,o)=>s(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...a);return this.avs=n,this.length})}append(...e){return s(this,null,function*(){let t=yield r.filter(...e);return this.avs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.avs.push(...t.getAudios())}),this.length}clone(){return new r(...this.avs)}filter(){return s(this,null,function*(){return this.avs=yield r.filter(...this.avs),this.length})}static filter(...e){return new p(...e).audio()}static fromFile(...e){return s(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static new(e){return s(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid audio`);return new r(...t)})}static isAudio(e){return e instanceof r}};import V from"path";var I=class r extends T{constructor(...e){super(...e)}getVideos(){return[...this.avs]}setVideos(e){return s(this,null,function*(){let a=(yield Promise.all(this.avs.map((i,o)=>s(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...a);return this.avs=n,this.length})}append(...e){return s(this,null,function*(){let t=yield r.filter(...e);return this.avs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.avs.push(...t.getVideos())}),this.length}clone(){return new r(...this.avs)}filter(){return s(this,null,function*(){return this.avs=yield r.filter(...this.avs),this.length})}only(e){return s(this,null,function*(){return this.custom((t,a)=>s(this,null,function*(){let n=V.join(a.tmp.path,h.generateFileName(e));return new Promise((i,o)=>{t.noAudio().toFormat(e).on("done",()=>{T.loadFile(n).then(i,o)}).on("error",o).output(n).run()})}))})}audio(e){return s(this,null,function*(){return this.custom((t,a)=>s(this,null,function*(){let n=V.join(a.tmp.path,h.generateFileName(e));return new Promise((i,o)=>{t.noVideo().toFormat(e).on("done",()=>{T.loadFile(n).then(i,o)}).on("error",o).output(n).run()})}))})}frame(e){return s(this,null,function*(){return this.custom((t,a)=>s(this,null,function*(){return new Promise((n,i)=>{t.takeScreenshots({filename:"frame.jpg",timemarks:e},a.tmp.path).on("filenames",o=>{let f=o.map(u=>V.join(a.tmp.path,u));T.loadFile(f).then(n,i)}).on("error",i).run()})}))})}static filter(...e){return s(this,null,function*(){return new p(...e).video()})}static fromFile(...e){return s(this,null,function*(){let t=yield T.loadFile(e);return r.new(t)})}static fromUrl(...e){return s(this,null,function*(){let t=yield T.loadUrl(e);return r.new(t)})}static new(e){return s(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid video`);return new r(...t)})}static isVideo(e){return e instanceof r}};var E=class{constructor(...e){this.files=e}image(){return v.new(this.files)}pdf(){return D.new(this.files)}csv(){return S.new(this.files)}text(){return O.new(this.files)}video(){return I.new(this.files)}audio(){return A.new(this.files)}};export{E as Processor,L as core,N as helper};
