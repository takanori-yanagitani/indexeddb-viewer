(function(w, r, rd, crc){

const dsl2array = function(domStringList){
  const ret = [];
  const length = (domStringList || []).length;
  for(let i = 0; i < length; i++) ret.push(domStringList.item(i));
  return ret;
};

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
              "div", { key: key }, storeName
            );
          }),
        ),
      ]
    );
  },
});

})(window, window.React, window.ReactDOM, window.createReactClass);
