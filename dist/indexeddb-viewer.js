(function(w, r, rd, crc, rb){

const dsl2array = function(domStringList){
  const ret = [];
  const length = (domStringList || []).length;
  for(let i = 0; i < length; i++) ret.push(domStringList.item(i));
  return ret;
};

const Panel = rb.Panel;

const IDBObjectStoreViewer = crc({
  componentDidMount(){
    const dbname = this.props.dbname;
    const storeName = this.props.storeName;
    const me = this;
    (function(onOpen){
      const request = indexedDB.open(dbname);
      request.onsuccess = onOpen;
      request.onerror   = onOpen;
    })(function(event){
      const target = (event || {}).target;
      const result = target.result || {};
      const store = result.transaction(storeName, "readonly").objectStore(storeName);
      const indexNames = store.indexNames;
      me.setState({indexNames: indexNames});
    });
  },

  render: function(){
    const storeName = this.props.storeName;
    const indexNames = (this.state || {}).indexNames;
    const indexNameArray = dsl2array(indexNames) || [];
    return r.createElement(
      Panel,
      { defaultExpanded: false },
      [
        r.createElement(Panel.Heading, { key: 0 }, r.createElement(
          Panel.Title, { toggle: true }, storeName
        )),
        r.createElement(Panel.Collapse, { key: 1 }, r.createElement(
          Panel.Body, {}, indexNameArray.map(function(indexName){
            return r.createElement("div", {}, "indexName: " + indexName);
          })
        )),
      ]
    );
  },
});

w.IndexedDBViewer = crc({
  componentDidMount: function(){
    const props = this.props || {};
    const dbname = props.dbname || "";
    if(! dbname) return console.log("IDBDatabase name must be specified.");
    const me = this;
    return (function(onOpen){
      const request = indexedDB.open(dbname);
      request.onsuccess = onOpen;
      request.onerror   = onOpen;
    })(function(event){
      const target = (event || {}).target || {};
      const result = target.result || {};
      const objectStoreNames = result.objectStoreNames;
      me.setState({
        storeNames: dsl2array(objectStoreNames),
      });
    });
  },

  render: function(){
    const storeNames = (this.state || {}).storeNames || [];
    console.log({
      IndexedDBViewer: "rendering...",
    });
    const props = this.props || {};
    const dbname = props.dbname || "";
    return r.createElement(
      "div", {}, [
        r.createElement("h1", {}, dbname),
        r.createElement(
          "div", {}, storeNames.map(function(storeName, key){
            return r.createElement(
              IDBObjectStoreViewer, { storeName: storeName, key: key, dbname: dbname }
            );
          })
        ),
      ]
    );
  },
});

})(window, window.React, window.ReactDOM, window.createReactClass, window.ReactBootstrap);
