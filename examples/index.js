(function(IndexedDBViewer){

const dbname = "browser";

(function(onOpen, onUpgrade){
  const request = indexedDB.open(dbname, 1810050848);
  request.onsuccess = onOpen;
  request.onerror   = onOpen;
  request.onupgradeneeded = onUpgrade;
})(function(event){
  const target = (event || {}).target || {};
  const result = target.result || {};
  const transaction = result.transaction([
    "ie11",
    "chrome",
    "firefox",
    "safari",
    "opera",
  ], "readwrite");
  transaction.objectStore("ie11"   ).put({version: "11.0.85",      release: "2018-09-11"});
  transaction.objectStore("chrome" ).put({version: "69.0.3497.92", release: "2018-09-17"});
  transaction.objectStore("firefox").put({version: "62.0.3",       release: "2018-10-02"});
  transaction.objectStore("safari" ).put({version: "12.0",         release: "2018-09-17"});
  transaction.objectStore("opera"  ).put({version: "56.0.3051.36", release: "2018-10-02"});
}, function(versionChange){
  const target = (versionChange || {}).target || {};
  const transaction = target.transaction || {};
  const result = target.result || {};
  const objectStoreNames = result.objectStoreNames;
  [
    "ie11",
    "chrome",
    "firefox",
    "opera",
    "safari",
  ].forEach(function(browserName){
    const exists = objectStoreNames.contains(browserName);
    const store = exists ? transaction.objectStore(browserName) : result.createObjectStore(browserName, { keyPath: "version" });
    const indexNames = store.indexNames;
    const vIndex = indexNames.contains("version") ? store.index("version") : store.createIndex("version", "version", { unique: true });
    const rIndex = indexNames.contains("release") ? store.index("release") : store.createIndex("release", "release", { unique: true });
  });
});

ReactDOM.render(
  React.createElement(IndexedDBViewer, { dbname: dbname }),
  document.getElementById("react")
);

})(window.IndexedDBViewer);
