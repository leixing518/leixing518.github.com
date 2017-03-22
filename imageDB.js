!function(){function e(t,o){return n?void(n.transaction("s").objectStore("s").get(t).onsuccess=function(e){var t=e.target.result&&e.target.result.v||null;o(t)}):void setTimeout(function(){e(t,o)},100)}var t=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(!t)return void console.error("indexDB not supported");var n,o={k:"",v:""},r=t.open("d2",1);r.onsuccess=function(e){n=this.result},r.onerror=function(e){console.error("indexedDB request error"),console.log(e)},r.onupgradeneeded=function(e){n=null;var t=e.target.result.createObjectStore("s",{keyPath:"k"});t.transaction.oncomplete=function(e){n=e.target.db}},window.ldb={get:e,set:function(e,t){o.k=e,o.v=t,n.transaction("s","readwrite").objectStore("s").put(o)}}}();
function loadnewimage(url, tag, itm) {
	var xhr = new XMLHttpRequest();
	
	xhr.open("GET", url);
	xhr.responseType = "blob";
	xhr.onreadystatechange = function() {
		if (this.readyState ===4 && this.status === 200) {
			var reader = new FileReader();
			reader.onload = function() {
				try {
					tag.src = this.result;
					//localStorage.setItem(itm, this.result);
					ldb.set(itm, this.result);
					console.log("localstorage image(" + itm + ") not exited, load new image");
				} catch (e) {
					tag.src = url;
					console.log("localstorage image(" + itm + ") not exited, but load new image failed, set tag src to url");
				}
			}
			reader.readAsDataURL(this.response);
		}
	}
	xhr.ontimeout = function() {
		tag.src = url;
		console.log("localstorage image(" + itm + ") not exited, but load new image timeout, set tag src to url");
	}
	xhr.send();
};
function loadoldimage(url, tag, itm, dat) {
	try {
		tag.src = dat;
		console.log("localstorage image(" + itm + ") exited, use old image");
	} catch (e) {
		//ldb.del(itm);
		//localStorage.removeItem(itm);
		tag.src = url;
		console.log("localstorage image (" + itm + ") exited, but set to old image failed, set tag src to url");
	}		
};
function loadimage(url, itm) {
	//var dat = localStorage.getItem(itm);
	ldb.get(itm, function(dat) {
		var tag = document.getElementById(itm);
		
		if (!(typeof tag === "undefined" || tag === null)) {
			if (typeof dat === "undefined" || dat === null) {
				loadnewimage(url, tag, itm);
			} else {
				loadoldimage(url, tag, itm, dat);
			}
		}
	});
};
function removestore(itm) {
	ldb.get(itm, function(dat) {
		if (!(typeof dat === "undefined" || dat === null)) {
			ldb.set(itm, null);
		}
	});
};