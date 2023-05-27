'use strict';
const b2Domain = 'i.your.domain';
const b2Bucket = 'files-pub';
const b2dir = '';

const b2UrlPath = `/file/${b2Bucket}/${b2dir}`;
addEventListener('fetch', event => {
	return event.respondWith(fileReq(event));
});
const corsFileTypes = ['png', 'jpg', 'gif', 'jpeg', 'webp', 'txt', 'pub','mp3','mp4','rar','webm','wav'];
const removeHeaders = [
	'x-bz-content-sha1',
	'x-bz-file-id',
	'x-bz-file-name',
	'x-bz-info-src_last_modified_millis',
	'X-Bz-Upload-Timestamp',
	'Expires'
];
const expiration = 31536000;
const fixHeaders = function(url, status, headers){
	let newHdrs = new Headers(headers);
	if(corsFileTypes.includes(url.pathname.split('.').pop())){
		newHdrs.set('Access-Control-Allow-Origin', '*');
	}
	if(status === 200){
		newHdrs.set('Cache-Control', "public, max-age=" + expiration);
	}else{
		newHdrs.set('Cache-Control', 'public, max-age=300');
	}
	const ETag = newHdrs.get('x-bz-content-sha1') || newHdrs.get('x-bz-info-src_last_modified_millis') || newHdrs.get('x-bz-file-id');
	if(ETag){
		newHdrs.set('ETag', ETag);
	}
	removeHeaders.forEach(header => {
		newHdrs.delete(header);
	});
	return newHdrs;
};
async function fileReq(event){
	const cache = caches.default;
	const url = new URL(event.request.url);
	if(url.host === b2Domain && !url.pathname.startsWith(b2UrlPath)){
		url.pathname = b2UrlPath + url.pathname;
	}
	let response = await cache.match(url);
	if(response){
		let newHdrs = fixHeaders(url, response.status, response.headers);
		newHdrs.set('X-Worker-Cache', "true");
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHdrs
		});
	}
	response = await fetch(url, {cf: {polish: "lossless"}});
	let newHdrs = fixHeaders(url, response.status, response.headers);
	response = new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: newHdrs
	});
  event.waitUntil(cache.put(url, response.clone()));
	return response;
}
