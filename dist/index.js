var J=Object.defineProperty;var W=Object.getOwnPropertySymbols;var ee=Object.prototype.hasOwnProperty,te=Object.prototype.propertyIsEnumerable;var q=(r,e,t)=>e in r?J(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,K=(r,e)=>{for(var t in e||(e={}))ee.call(e,t)&&q(r,t,e[t]);if(W)for(var t of W(e))te.call(e,t)&&q(r,t,e[t]);return r};var Y=(r,e)=>{for(var t in e)J(r,t,{get:e[t],enumerable:!0})};var a=(r,e,t)=>new Promise((s,n)=>{var i=u=>{try{f(t.next(u))}catch(l){n(l)}},o=u=>{try{f(t.throw(u))}catch(l){n(l)}},f=u=>u.done?s(u.value):Promise.resolve(u.value).then(i,o);f((t=t.apply(r,e)).next())});var $={};Y($,{Audio:()=>R,CSV:()=>A,Image:()=>O,PDF:()=>I,PDF_experimental:()=>M,Text:()=>D,Video:()=>C});var j={};Y(j,{FilterFile:()=>p,TmpFile:()=>h,input2buffer:()=>Ae,isArrayOfBuffer:()=>Ie,isArrayOfString:()=>Re,isUrl:()=>V});import{Mutex as S}from"async-mutex";import P,{Node as he}from"@ryn-bsd/is-file";import{Readable as Q}from"stream";import{isAnyArrayBuffer as re,isUint8Array as se}from"util/types";import k from"fs";import X from"path";import{any2buffer as ae,array2buffer as ne,buffer2readable as ie,isReadable as Z,isReadableStream as oe,isStream as fe,readable2buffer as ce,readablestream2buffer as ue,stream2buffer as le,string2buffer as me,uint8array2buffer as pe,url2buffer as de}from"@ryn-bsd/from-buffer-to";import _ from"is-base64";import ye from"fast-glob";import ge from"puppeteer";var c=class r{constructor(){}static stream(e,t){return e.pipe(t)}static initBrowser(e){return ge.launch(e)}static loadFile(e){return a(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.loadFile(t))):k.promises.readFile(e)})}static loadDir(e){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(s=>r.loadDir(s)));let t=yield k.promises.readdir(e);return r.loadFile(t.map(s=>X.join(e,s)))})}static loadGlob(e,t){return a(this,null,function*(){var o;let s=yield ye(e,t),n=(o=t==null?void 0:t.cwd)!=null?o:process.cwd();return(yield Promise.all(s.map(f=>a(this,null,function*(){let u=X.join(n,f),l=yield k.promises.stat(u);return l.isFile()?r.loadFile(u):l.isDirectory()?r.loadDir(u):null})))).filter(f=>f!==null)})}static loadUrl(e){return a(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.loadUrl(t))):de(e)})}static toBuffer(e){return a(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(t=>r.toBuffer(t))):Buffer.isBuffer(e)?e:V(e)?r.loadUrl(e):se(e)?pe(e):re(e)?ne(e):fe(e)?le(e):oe(e)?ue(e):Z(e)&&Q.isReadable(e)?ce(e):typeof e=="string"?(yield k.promises.stat(e)).isFile()?r.loadFile(e):_(e,{allowEmpty:!1})?Buffer.from(e,"base64"):me(e,!1):ae(e)})}static toReadable(e){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(s=>r.toReadable(s)));if(Z(e)&&Q.isReadable(e))return e;let t=yield r.toBuffer(e);return ie(t)})}static toBase64(e,t="base64"){return a(this,null,function*(){return Array.isArray(e)?Promise.all(e.map(n=>r.toBase64(n))):typeof e=="string"&&_(e)?e:(yield r.toBuffer(e)).toString(t)})}static toFile(e){return a(this,null,function*(){yield Promise.all(e.map(t=>a(this,null,function*(){let s=yield r.toBuffer(t.input);return k.promises.writeFile(t.path,s)})))})}};var p=class r{constructor(...e){this.input=e}application(){return a(this,null,function*(){let{applications:e}=yield r.filter(...this.input);return e})}audio(){return a(this,null,function*(){let{audios:e}=yield r.filter(...this.input);return e})}font(){return a(this,null,function*(){let{fonts:e}=yield r.filter(...this.input);return e})}image(){return a(this,null,function*(){let{images:e}=yield r.filter(...this.input);return e})}model(){return a(this,null,function*(){let{models:e}=yield r.filter(...this.input);return e})}text(){return a(this,null,function*(){let{texts:e}=yield r.filter(...this.input);return e})}video(){return a(this,null,function*(){let{videos:e}=yield r.filter(...this.input);return e})}custom(e){return a(this,null,function*(){let t=yield c.toBuffer(this.input);return(yield P.isCustom(t,e)).filter(n=>n.valid).map(n=>n.value)})}static filter(...e){return a(this,null,function*(){let t=yield c.toBuffer(e),s={applications:new S,audios:new S,fonts:new S,images:new S,models:new S,texts:new S,videos:new S},n={applications:[],audios:[],fonts:[],images:[],models:[],texts:[],videos:[]};return yield Promise.all(t.map(i=>a(this,null,function*(){if(yield P.isApplication(i)){let o=yield s.applications.acquire();n.applications.push(i),o()}else if(yield P.isAudio(i)){let o=yield s.audios.acquire();n.audios.push(i),o()}else if(yield P.isFont(i)){let o=yield s.fonts.acquire();n.fonts.push(i),o()}else if(yield P.isImage(i)){let o=yield s.images.acquire();n.images.push(i),o()}else if(yield P.isModel(i)){let o=yield s.models.acquire();n.models.push(i),o()}else if(yield P.isText(i)){let o=yield s.texts.acquire();n.texts.push(i),o()}else if(yield P.isVideo(i)){let o=yield s.videos.acquire();n.videos.push(i),o()}}))),n})}static type(e){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(s=>r.type(s)));let t=yield c.toBuffer(e);return he.type(t)})}static mime(e){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(s=>r.mime(s)));let t=yield r.type(e);return t==null?void 0:t.mime})}static extension(e){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(s=>r.extension(s)));let t=yield r.type(e);return t==null?void 0:t.ext})}};import{writeFile as we}from"fs/promises";import{randomUUID as Te}from"crypto";import xe from"path";import{dir as be}from"tmp-promise";var h=class r{constructor(...e){this.paths=[];this.files=e}createFn(e){return a(this,null,function*(){var i;let t=(i=yield p.extension(e))!=null?i:"";if(t.length===0)throw new Error(`${r.name}: Unknown file when create`);let s=r.generateFileName(t),n=xe.join(this.tmp.path,s);yield we(n,e),this.paths.push(n)})}create(){return a(this,null,function*(){yield Promise.all(this.files.map(this.createFn.bind(this)))})}init(e){return a(this,null,function*(){return this.tmp=yield be(K({unsafeCleanup:!0},e)),yield this.create(),this})}clean(){return a(this,null,function*(){yield this.tmp.cleanup(),this.paths.splice(0,this.paths.length)})}static generateFileName(e){return`${Te()}_${Date.now()}.${e}`}};import{readFile as Pe}from"fs/promises";import{isReadable as Be,isStream as Fe,stream2buffer as ve}from"@ryn-bsd/from-buffer-to";import{isArrayBuffer as Se,isSharedArrayBuffer as Oe,isUint8Array as De}from"util/types";function Ae(r){return a(this,null,function*(){return Buffer.isBuffer(r)?r:typeof r=="string"?Pe(r):Be(r)||Fe(r)?ve(r):De(r)||Se(r)||Oe(r)?Buffer.from(r):null})}function Ie(r){if(!Array.isArray(r))return!1;for(let e of r)if(!Buffer.isBuffer(e))return!1;return!0}function Re(r){if(!Array.isArray(r))return!1;for(let e of r)if(typeof e!="string")return!1;return!0}function V(r){if(typeof r!="string")return!1;try{return new URL(r),!0}catch(e){return!1}}import Ce from"fs";import Ue from"path";import ke from"fast-glob";import{createWorker as Me}from"tesseract.js";import ze from"sharp";var O=class r extends c{constructor(...e){super(),this.images=e}get length(){return this.images.length}getImages(){return[...this.images]}setImages(e){return a(this,null,function*(){let s=(yield Promise.all(this.images.map((i,o)=>a(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...s);return this.images=n,this.length})}append(...e){return a(this,null,function*(){let t=yield r.filter(...e);return this.images.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.images.push(...t.getImages())}),this.length}clone(){return new r(...this.images)}clean(){this.images=[]}filter(){return a(this,null,function*(){return this.images=yield r.filter(...this.images),this.length})}metadata(){return a(this,null,function*(){return this.custom(e=>e.metadata())})}watermark(s){return a(this,arguments,function*(e,t={}){let{resize:n,gravity:i="center",alpha:o=.5,tile:f=!1,blend:u="over",premultiplied:l}=t,d=yield c.toBuffer(e),y=yield r.newSharp(d).resize(n).ensureAlpha(o).composite([{input:Buffer.from([0,0,0,Math.round(255*o)]),raw:{width:1,height:1,channels:4},tile:!0,blend:"dest-in"}]).toBuffer();return this.custom(g=>g.composite([{input:y,gravity:i,blend:u,tile:f,premultiplied:l}]).toBuffer({resolveWithObject:!0}))})}convert(e,t){return a(this,null,function*(){return this.custom(s=>s.toFormat(e,t).toBuffer({resolveWithObject:!0}))})}ocr(e){return a(this,null,function*(){let t=yield Me(e),s=yield Promise.all(this.images.map(n=>t.recognize(n)));if(yield t.terminate(),process.env.NODE_ENV==="development"||process.env.NODE_ENV==="test"){let n=process.cwd(),i=yield ke("*.traineddata",{cwd:n});yield Promise.all(i.map(o=>Ce.promises.unlink(Ue.join(n,o))))}return s.map(n=>n.data)})}custom(e){return a(this,null,function*(){return Promise.all(this.images.map((t,s)=>a(this,null,function*(){return e(r.newSharp(t),s)})))})}static filter(...e){return a(this,null,function*(){return new p(...e).image()})}static justBuffer(e){return Array.isArray(e)?e.map(t=>r.justBuffer(t)):e.data}static screenshot(e,t){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(f=>a(this,null,function*(){return r.screenshot(f,t)})));let s=yield c.initBrowser(),n=yield s.newPage(),i=yield n.goto(e,{waitUntil:"networkidle2"});if(i===null||!i.ok())throw new Error(`${r.name}: Can't fetch (${e})`);let o=yield n.screenshot(t);return yield s.close(),o})}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static newSharp(e,t){return ze(e,t).clone()}static new(e){return a(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid image`);return new r(...t)})}static isImage(e){return e instanceof r}};import m from"zlib";var D=class r extends c{constructor(...e){super(),this.texts=e}get length(){return this.texts.length}getTexts(){return[...this.texts]}setTexts(e){return a(this,null,function*(){let s=(yield Promise.all(this.texts.map((n,i)=>a(this,null,function*(){return e(n,i)})))).filter(n=>Buffer.isBuffer(n)&&n.length>0);return this.texts=s,this.length})}append(...e){return a(this,null,function*(){let t=e.filter(s=>Buffer.isBuffer(s)&&s.length>0);return this.texts.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.texts.push(...t.getTexts())}),this.length}clone(){return new r(...this.texts)}clean(){this.texts=[]}filter(){return a(this,null,function*(){return this.texts=yield r.filter(...this.texts),this.length})}charactersMap(e){let t=new Map,s=e.toString();for(let n of s){let i=n.charCodeAt(0);t.has(i)?t.set(i,t.get(i)+1):t.set(i,1)}return t}metadata(){return a(this,null,function*(){return this.custom(e=>({size:e.length,charactersMap:this.charactersMap(e)}))})}compressAsync(e,t){return a(this,null,function*(){return Promise.all(r.compress(this.texts,e,r.gzipAsync,r.deflateAsync,r.deflateRawAsync,r.brotliCompressAsync,t))})}decompressAsync(e,t){return a(this,null,function*(){return Promise.all(r.decompress(this.texts,e,r.gunzipAsync,r.inflateAsync,r.inflateRawAsync,r.brotliDecompressAsync,r.unzipAsync,t))})}compressStream(e,t){return a(this,null,function*(){let s=yield c.toReadable(this.texts);return r.compress(s,e,r.gzipStream,r.deflateStream,r.deflateRawStream,r.brotliCompressStream,t)})}decompressStream(e,t){return a(this,null,function*(){let s=yield c.toReadable(this.texts);return r.decompress(s,e,r.gunzipStream,r.inflateStream,r.inflateRawStream,r.brotliDecompressStream,r.unzipStream,t)})}compressSync(e,t){return r.compress(this.texts,e,r.gzipSync,r.deflateSync,r.deflateRawSync,r.brotliCompressSync,t)}decompressSync(e,t){return r.decompress(this.texts,e,r.gunzipSync,r.inflateSync,r.inflateRawSync,r.brotliDecompressSync,r.unzipSync,t)}custom(e){return a(this,null,function*(){return Promise.all(this.texts.map((t,s)=>a(this,null,function*(){return e(t,s)})))})}static compress(e,t,s,n,i,o,f){return e.map(u=>{switch(t){case"gzip":return s(u,f);case"deflate":return n(u,f);case"deflate-raw":return i(u,f);case"brotli-compress":return o(u,f);default:throw new TypeError(`${r.name}: Invalid compression method (${t})`)}})}static decompress(e,t,s,n,i,o,f,u){return e.map(l=>{switch(t){case"gunzip":return s(l,u);case"inflate":return n(l,u);case"inflate-raw":return i(l,u);case"brotli-decompress":return o(l,u);case"unzip":return f(l,u);default:throw new TypeError(`${r.name}: Invalid decompression method (${t})`)}})}static filter(...e){return a(this,null,function*(){return new p(...e).text()})}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static new(e){let t=e.filter(s=>s.length>0);if(t.length===0)throw new Error(`${r.name}: Non valid text`);return new r(...t)}static isText(e){return e instanceof r}static gzipAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{m.gzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static deflateAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{m.deflate(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static deflateRawAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{m.deflateRaw(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static brotliCompressAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{m.brotliCompress(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static gunzipAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{m.gunzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static inflateAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{m.inflate(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static inflateRawAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{m.inflateRaw(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static brotliDecompressAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{m.brotliDecompress(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static unzipAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{m.unzip(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static gzipStream(e,t={}){let s=m.createGzip(t);return c.stream(e,s)}static deflateStream(e,t={}){let s=m.createDeflate(t);return c.stream(e,s)}static deflateRawStream(e,t={}){let s=m.createDeflateRaw(t);return c.stream(e,s)}static brotliCompressStream(e,t={}){let s=m.createBrotliCompress(t);return c.stream(e,s)}static gunzipStream(e,t={}){let s=m.createGunzip(t);return c.stream(e,s)}static inflateStream(e,t={}){let s=m.createInflate(t);return c.stream(e,s)}static inflateRawStream(e,t={}){let s=m.createInflateRaw(t);return c.stream(e,s)}static brotliDecompressStream(e,t={}){let s=m.createBrotliDecompress(t);return c.stream(e,s)}static unzipStream(e,t={}){let s=m.createUnzip(t);return c.stream(e,s)}static gzipSync(e,t={}){return m.gzipSync(e,t)}static deflateSync(e,t={}){return m.deflateSync(e,t)}static deflateRawSync(e,t={}){return m.deflateRawSync(e,t)}static brotliCompressSync(e,t={}){return m.brotliCompressSync(e,t)}static gunzipSync(e,t={}){return m.gunzipSync(e,t)}static inflateSync(e,t={}){return m.inflateSync(e,t)}static inflateRawSync(e,t={}){return m.inflateRawSync(e,t)}static brotliDecompressSync(e,t={}){return m.brotliDecompressSync(e,t)}static unzipSync(e,t={}){return m.unzipSync(e,t)}};import*as T from"csv";import*as B from"csv/sync";var A=class r extends c{constructor(...e){super(),this.csvs=e}get length(){return this.csvs.length}getCsvs(){return[...this.csvs]}setCsvs(e){return a(this,null,function*(){let s=(yield Promise.all(this.csvs.map((n,i)=>a(this,null,function*(){return e(n,i)})))).filter(n=>Buffer.isBuffer(n)&&n.length>0);return this.csvs=s,this.length})}append(...e){return a(this,null,function*(){let t=e.filter(s=>Buffer.isBuffer(s)&&s.length>0);return this.csvs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.csvs.push(...t.getCsvs())}),this.length}clone(){return new r(...this.csvs)}clean(){this.csvs=[]}filter(){return a(this,null,function*(){return this.csvs=yield r.filter(...this.csvs),this.length})}metadata(e){return a(this,null,function*(){return this.custom(t=>a(this,null,function*(){var n,i;let s=yield r.parseAsync(t,e);return{size:t.length,rows:s.length,columns:(i=(n=s==null?void 0:s[0])==null?void 0:n.length)!=null?i:0}}))})}parseAsync(e){return a(this,null,function*(){return this.custom(t=>r.parseAsync(t,e))})}transformAsync(e,t,s){return a(this,null,function*(){return Promise.all(e.map(n=>r.transformAsync(n,t,s)))})}stringifyAsync(e,t){return a(this,null,function*(){return Promise.all(e.map(s=>r.stringifyAsync(s,t)))})}parseStream(e){return a(this,null,function*(){return(yield c.toReadable(this.csvs)).map(s=>r.parseStream(s,e))})}transformStream(e,t,s){return a(this,null,function*(){return(yield c.toReadable(e)).map(i=>r.transformStream(i,t,s))})}stringifyStream(e,t){return a(this,null,function*(){return(yield c.toReadable(e)).map(n=>r.stringifyStream(n,t))})}parseSync(e){return this.csvs.map(t=>r.parseSync(t,e))}transformSync(e,t,s){return e.map(n=>r.transformSync(n,t,s))}stringifySync(e,t){return e.map(s=>r.stringifySync(s,t))}custom(e){return a(this,null,function*(){return Promise.all(this.csvs.map((t,s)=>a(this,null,function*(){return e(t,s)})))})}static filter(...e){return a(this,null,function*(){return new p(...e).custom("csv")})}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static new(e){let t=e.filter(s=>s.length>0);if(t.length===0)throw new Error(`${r.name}: Non valid csv`);return new r(...t)}static isCSV(e){return e instanceof r}static generateAsync(){return a(this,arguments,function*(e={}){return new Promise((t,s)=>{T.generate(e,(n,i)=>{if(n)return s(n);t(i)})})})}static parseAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{T.parse(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static transformAsync(n,i){return a(this,arguments,function*(e,t,s={}){return new Promise((o,f)=>{T.transform(e,s,t,(u,l)=>{if(u)return f(u);o(l)})})})}static stringifyAsync(s){return a(this,arguments,function*(e,t={}){return new Promise((n,i)=>{T.stringify(e,t,(o,f)=>{if(o)return i(o);n(f)})})})}static generateStream(e={}){return T.generate(e)}static parseStream(e,t={}){return c.stream(e,T.parse(t))}static transformStream(e,t,s={}){return c.stream(e,T.transform(s,t))}static stringifyStream(e,t={}){return c.stream(e,T.stringify(t))}static generateSync(e={}){return B.generate(e)}static parseSync(e,t={}){return B.parse(e,t)}static transformSync(e,t,s={}){return B.transform(e,s,t)}static stringifySync(e,t={}){return B.stringify(e,t)}};import{PageSizes as Ee,PDFDocument as z}from"pdf-lib";var I=class r extends c{constructor(...e){super(),this.pdfs=e}get length(){return this.pdfs.length}getPdfs(){return[...this.pdfs]}setPdfs(e){return a(this,null,function*(){let s=(yield Promise.all(this.pdfs.map((i,o)=>a(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...s);return this.pdfs=n,this.length})}append(...e){return a(this,null,function*(){let t=yield r.filter(...e);return this.pdfs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.pdfs.push(...t.getPdfs())}),this.length}clone(){return new r(...this.pdfs)}clean(){this.pdfs=[]}filter(){return a(this,null,function*(){return this.pdfs=yield r.filter(...this.pdfs),this.length})}getDocuments(e){return a(this,null,function*(){return Promise.all(this.pdfs.map(t=>r.load(t.buffer,e)))})}metadata(e){return a(this,null,function*(){return this.custom(t=>({title:t.getTitle(),author:t.getAuthor(),subject:t.getSubject(),creator:t.getCreator(),keywords:t.getKeywords(),producer:t.getProducer(),pageCount:t.getPageCount(),pageIndices:t.getPageIndices(),creationDate:t.getCreationDate(),modificationDate:t.getModificationDate()}),e)})}getPages(e){return a(this,null,function*(){return this.custom(t=>t.getPages(),e)})}getForm(e){return a(this,null,function*(){return this.custom(t=>t.getForm(),e)})}merge(e){return a(this,null,function*(){let t=yield r.create(e==null?void 0:e.create);return(yield this.custom(n=>t.copyPages(n,n.getPageIndices()),e==null?void 0:e.load)).forEach(n=>n.forEach(i=>t.addPage(i))),t})}custom(e,t){return a(this,null,function*(){let s=yield this.getDocuments(t);return Promise.all(s.map((n,i)=>a(this,null,function*(){return e(n,i)})))})}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static fromImage(s){return a(this,arguments,function*(e,t={}){var F,v;if(Array.isArray(e))return Promise.all(e.map(U=>r.fromImage(U,t)));let[n,i]=yield Promise.all([new p(e).custom("png"),new p(e).custom("jpg")]);if(i.length===0&&n.length===0)throw new Error(`${r.name}: Invalid images to convert to pdf`);let{pageSize:o=Ee.A4,scaleImage:f,position:u}=t,l=yield z.create(t.create),d=l.addPage(o),y=d.getSize(),g;n.length>0?g=yield l.embedPng(e.buffer):g=yield l.embedJpg(e.buffer);let b=g.size();return typeof f=="number"?b=g.scale(f):Array.isArray(f)?b=g.scaleToFit(f[0],f[1]):b=g.scaleToFit(y.width,y.height),d.drawImage(g,{x:(F=u==null?void 0:u[0])!=null?F:0,y:(v=u==null?void 0:u[1])!=null?v:0,width:b.width,height:b.height}),l})}static generate(e,t){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(f=>r.generate(f,t)));let s=yield c.initBrowser(),n=yield s.newPage(),i=yield n.goto(e,{waitUntil:"networkidle2"});if(i===null||!i.ok())throw new Error(`${r.name}: Can't fetch (${e})`);let o=yield n.pdf(t);return yield s.close(),o})}static filter(...e){return new p(...e).custom("pdf")}static save(e,t){return a(this,null,function*(){if(Array.isArray(e))return Promise.all(e.map(n=>r.save(n,t)));let s=yield e.save(t);return c.toBuffer(s)})}static load(e,t){return a(this,null,function*(){return z.load(e,t)})}static create(e){return a(this,null,function*(){return z.create(e)})}static document(){return z}static new(e){return a(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid pdf`);return new r(...t)})}static isPDF(e){return e instanceof r}};import*as w from"mupdf";var M=class r{constructor(...e){this.pdfs=[];this.pdfs=e}metadata(){return a(this,null,function*(){return this.custom(e=>({format:e.getMetaData(w.Document.META_FORMAT),encryption:e.getMetaData(w.Document.META_ENCRYPTION),author:e.getMetaData(w.Document.META_INFO_AUTHOR),title:e.getMetaData(w.Document.META_INFO_TITLE),subject:e.getMetaData(w.Document.META_INFO_SUBJECT),keywords:e.getMetaData(w.Document.META_INFO_KEYWORDS),creator:e.getMetaData(w.Document.META_INFO_CREATOR),producer:e.getMetaData(w.Document.META_INFO_PRODUCER),countUnsavedVersions:e.countUnsavedVersions(),countVersions:e.countVersions(),countObjects:e.countObjects(),countPages:e.countPages(),wasRepaired:e.wasRepaired(),language:e.getLanguage(),version:e.getVersion(),creationDate:e.getMetaData(w.Document.META_INFO_CREATIONDATE),modificationDate:e.getMetaData(w.Document.META_INFO_MODIFICATIONDATE)}))})}getTexts(){return a(this,null,function*(){return this.custom(e=>{let t=[],s=e.countPages();for(let n=0;n<s;n++){let i=e.loadPage(n);t.push(i.toStructuredText("preserve-whitespace").asJSON())}return t})})}getImages(){return a(this,null,function*(){return this.custom(e=>{let t=[],s=e.countPages();for(let n=0;n<s;n++){let f,i=e.loadPage(n),o=[];i.toStructuredText("preserve-images").walk({onImageBlock(u,l,d){return a(this,null,function*(){let g=d.toPixmap().asPNG(),b=yield c.toBuffer(g);o.push(b)})}}),t.push(o)}return t})})}annotations(){return a(this,null,function*(){return this.custom(e=>{let t=[],s=e.countPages();for(let n=0;n<s;n++){let i=e.loadPage(n);t.push(i.getAnnotations())}return t})})}links(){return a(this,null,function*(){return this.custom(e=>{let t=[],s=e.countPages();for(let n=0;n<s;n++){let o=e.loadPage(n).getLinks().map(f=>({bounds:f.getBounds(),link:f.getURI(),isExternal:f.isExternal()}));t.push(o)}return t})})}bake(e,t){return a(this,null,function*(){return this.custom(s=>{s.bake(e,t)})})}search(e){return a(this,null,function*(){return this.custom(t=>{})})}custom(e){return a(this,null,function*(){return Promise.all(this.pdfs.map((t,s)=>a(this,null,function*(){let n=r.open(t);return e(n,s)})))})}static open(e){return new w.PDFDocument(e)}static needsPassword(e){return r.open(e).needsPassword()}};import Ne from"fluent-ffmpeg";import{path as Ve}from"@ffmpeg-installer/ffmpeg";import{path as je}from"@ffprobe-installer/ffprobe";import L from"path";var x=class r extends c{constructor(...e){super(),this.avs=e}get length(){return this.avs.length}clean(){this.avs=[]}metadata(){return a(this,null,function*(){return this.custom(e=>new Promise((t,s)=>{e.ffprobe((n,i)=>{if(n)return s(n);t(i)})}))})}convert(e){return a(this,null,function*(){return this.custom((t,s)=>new Promise((n,i)=>{let o=L.join(s.tmp.path,h.generateFileName(e));t.toFormat(e).on("end",()=>{c.loadFile(o).then(n,i)}).on("error",i).output(o).run()}))})}spilt(e,t=0){return a(this,null,function*(){return this.custom((s,n,i)=>a(this,null,function*(){var g,b;let f=(g=(yield new Promise((F,v)=>{s.ffprobe((U,N)=>{if(U)return v(U);F(N)})})).format.duration)!=null?g:0;if(f===0)throw new Error(`${r.name}: Empty av duration`);if(t>=f)throw new Error(`${r.name}: start time is bigger then the av duration`);let u=(b=yield p.extension(this.avs[i]))!=null?b:"";if(u.length===0)throw new Error(`${r.name}: Unknown av format`);let l=n.paths[i],d=[],y=t;for(;y<f;){let F=Math.min(e,f-y),v=L.join(n.tmp.path,h.generateFileName(u)),U=yield new Promise((N,H)=>{r.newFfmpeg(l).setStartTime(y).setDuration(F).on("end",()=>{c.loadFile(v).then(N,H)}).on("error",H).output(v).run()});d.push(U),y+=F}return d}))})}merge(e,t=30){return a(this,null,function*(){let s=yield this.convert(e),n=yield new h(...s).init(),i=L.join(n.tmp.path,h.generateFileName(e)),o=yield new Promise((f,u)=>{let l=r.newFfmpeg(n.paths[0]);n.paths.forEach((d,y)=>{y!==0&&l.input(d)}),l.fps(t).on("start",d=>{}).on("end",()=>{c.loadFile(i).then(f,u)}).on("error",u).mergeToFile(i,n.tmp.path)});return yield n.clean(),o})}custom(e){return a(this,null,function*(){let t=yield new h(...this.avs).init(),s=yield Promise.all(t.paths.map((n,i)=>a(this,null,function*(){return e(r.newFfmpeg(n),t,i)})));return yield t.clean(),s})}static generateTimemarks(e,t=1){return a(this,null,function*(){var i;if(Array.isArray(e))return Promise.all(e.map(o=>r.generateTimemarks(o,t)));let s=[],n=(i=e.format.duration)!=null?i:0;for(let o=0;o<n;o+=t)s.push(o);return s})}static newFfmpeg(e,t){return Ne(t).clone().setFfmpegPath(Ve).setFfprobePath(je).input(e)}};var R=class r extends x{constructor(...e){super(...e)}getAudios(){return[...this.avs]}setAudios(e){return a(this,null,function*(){let s=(yield Promise.all(this.avs.map((i,o)=>a(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...s);return this.avs=n,this.length})}append(...e){return a(this,null,function*(){let t=yield r.filter(...e);return this.avs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.avs.push(...t.getAudios())}),this.length}clone(){return new r(...this.avs)}filter(){return a(this,null,function*(){return this.avs=yield r.filter(...this.avs),this.length})}static filter(...e){return new p(...e).audio()}static fromFile(...e){return a(this,null,function*(){let t=yield c.loadFile(e);return r.new(t)})}static fromUrl(...e){return a(this,null,function*(){let t=yield c.loadUrl(e);return r.new(t)})}static new(e){return a(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid audio`);return new r(...t)})}static isAudio(e){return e instanceof r}};import G from"path";var C=class r extends x{constructor(...e){super(...e)}getVideos(){return[...this.avs]}setVideos(e){return a(this,null,function*(){let s=(yield Promise.all(this.avs.map((i,o)=>a(this,null,function*(){return e(i,o)})))).filter(i=>Buffer.isBuffer(i)&&i.length>0),n=yield r.filter(...s);return this.avs=n,this.length})}append(...e){return a(this,null,function*(){let t=yield r.filter(...e);return this.avs.push(...t),this.length})}extend(...e){return e.forEach(t=>{this.avs.push(...t.getVideos())}),this.length}clone(){return new r(...this.avs)}filter(){return a(this,null,function*(){return this.avs=yield r.filter(...this.avs),this.length})}only(){return a(this,null,function*(){return this.custom((e,t,s)=>a(this,null,function*(){var o;let n=(o=yield p.extension(this.avs[s]))!=null?o:"";if(n.length===0)throw new Error(`${r.name}: Unknown video format`);let i=G.join(t.tmp.path,h.generateFileName(n));return new Promise((f,u)=>{e.noAudio().on("end",()=>{x.loadFile(i).then(f,u)}).on("error",u).output(i).run()})}))})}audio(e){return a(this,null,function*(){let t=yield this.metadata();return this.custom((s,n,i)=>a(this,null,function*(){var l;if(((l=t[i].streams.find(d=>d.codec_type==="audio"))!=null?l:null)===null)return null;let u=G.join(n.tmp.path,h.generateFileName(e));return new Promise((d,y)=>{s.noVideo().toFormat(e).on("end",()=>{x.loadFile(u).then(d,y)}).on("error",y).output(u).run()})}))})}screenshot(e){return a(this,null,function*(){return this.custom((t,s)=>a(this,null,function*(){let n=[];return new Promise((i,o)=>{t.screenshot({filename:"frame.png",timemarks:e},s.tmp.path).on("filenames",f=>{n=f.map(u=>G.join(s.tmp.path,u))}).on("end",()=>{x.loadFile(n).then(i,o)}).on("error",o)})}))})}static filter(...e){return a(this,null,function*(){return new p(...e).video()})}static fromFile(...e){return a(this,null,function*(){let t=yield x.loadFile(e);return r.new(t)})}static fromUrl(...e){return a(this,null,function*(){let t=yield x.loadUrl(e);return r.new(t)})}static new(e){return a(this,null,function*(){let t=yield r.filter(...e);if(t.length===0)throw new Error(`${r.name}: Non valid video`);return new r(...t)})}static isVideo(e){return e instanceof r}};var E=class{constructor(...e){this.files=e}image(){return O.new(this.files)}pdf(){return I.new(this.files)}csv(){return A.new(this.files)}text(){return D.new(this.files)}video(){return C.new(this.files)}audio(){return R.new(this.files)}};export{E as Processor,$ as core,j as helper};
