(function(IndexedDBViewer){

const dbname = "log";

(function(onOpen, onUpgrade){
  const request = indexedDB.open(dbname, 0x120a050);
  request.onsuccess = onOpen;
  request.onerror   = onOpen;
  request.onupgradeneeded = onUpgrade;
})(function(event){
  const target = (event || {}).target || {};
  const result = target.result || {};
  const transaction = result.transaction([
    "info",
    "warning",
    "error",
  ], "readwrite");
  transaction.objectStore("info"   ).put({timestamp: Date.now(), jsdate: new Date(), iso: new Date().toISOString(), message: "populating sample message..."});
  transaction.objectStore("warning").put({timestamp: Date.now(), jsdate: new Date(), iso: new Date().toISOString(), message: "populating sample message..."});
  transaction.objectStore("error"  ).put({timestamp: Date.now(), jsdate: new Date(), iso: new Date().toISOString(), message: "populating sample message..."});
}, function(versionChange){
  const target = (versionChange || {}).target || {};
  const transaction = target.transaction || {};
  const result = target.result || {};
  const objectStoreNames = result.objectStoreNames;
  [
    "info",
    "warning",
    "error",
  ].forEach(function(logType){
    const exists = objectStoreNames.contains(logType);
    const store = exists ? transaction.objectStore(logType) : result.createObjectStore(logType, { keyPath: "timestamp" });
    const indexNames = store.indexNames;
    const pki = indexNames.contains("timestamp") ? store.index("timestamp") : store.createIndex("timestamp", "timestamp", { unique: true });
  });
});

ReactDOM.render(
  React.createElement(IndexedDBViewer, { dbname: dbname }),
  document.getElementById("react")
);

})(window.IndexedDBViewer);
