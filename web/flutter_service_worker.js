'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "8a95bcf3044c72392273d21238be76f5",
"index.html": "570150734e22604b33d35a2048a4e9ec",
"/": "570150734e22604b33d35a2048a4e9ec",
"main.dart.js": "e9f7ad1d528e3d6b9502e41bf9df2bab",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "c3e30a93df8f20ced2e5a29124d6a75c",
"assets/images/home/xunrenxunwu.png": "ebb3471a49e67305860313949df4d72a",
"assets/images/home/ershougouwu.png": "1b4e40bfe9213a53a8a4739793197cc0",
"assets/images/home/chongwushijie.png": "2d5bc9dd47233976158405b527c3d910",
"assets/images/home/bianmindianhua.png": "e7851eefb6a0b89d0b3a9800a99ba624",
"assets/images/home/shenghuofuwu.png": "65805ea144eb9d77e475fc7fb78c1d55",
"assets/images/home/qiuzhuwenda.png": "a2753f311b0d6cd62567bafc26c92aab",
"assets/images/home/zhaopinzhaogong.png": "412ced7a511c21899fc0e3d164d06320",
"assets/images/home/fangwuzufang.png": "67288baeb173075085ccbd3bbe790ab7",
"assets/images/home/qichezhijia.png": "69c136962d9408784a526a7f72e2e683",
"assets/images/home/zhaopinyuangong.png": "0a4745491575c7dbaa07e2549576a93d",
"assets/images/home/ershoucheliang.png": "1c02d9150a3b27c3d9b6343a57b14fe7",
"assets/images/home/shichangzhuanhuan.png": "ad143421b97c87fd75f3f94bb1738dfb",
"assets/images/home/xuanchuantuiguang.png": "68e57cabfbfbe3c86272e37142c9e6be",
"assets/images/home/maifangshoufang.png": "4c1c332bcea58b315152c0696537cce0",
"assets/images/home/shengyizhuanrang.png": "17098e47a90f8d2a15531f19d277eb04",
"assets/images/home/chongwuzhijia.png": "c612acf60353b702907a9b56603766e2",
"assets/images/home/xiuxianxiawucha.png": "7937be05feb4a4b6b1a70127f6fb327c",
"assets/images/home/qiuzhijianli.png": "ec3d7a877af66d4054ce4115126bf9e5",
"assets/images/home/ershoushichang.png": "309857441aefc7063be05999bb1e6785",
"assets/images/home/xitongtongzhi.png": "004dde1eaf22744e9ec93eb76991b409",
"assets/images/home/zijianfang.png": "08e2ee37fec785cd8cb90c0e62cb739c",
"assets/images/home/linggongshichang.png": "5106863bc2511f90fb76204d43363156",
"assets/AssetManifest.json": "c098d0f919d7e2c6e0b4010c5280141a",
"assets/NOTICES": "fb9e9695eff13a72ecc9316559bef51f",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "4ccd9c95c945454e22f2043336abf3a0",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
