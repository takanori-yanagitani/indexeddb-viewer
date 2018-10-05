(function(w, r, rd, crc, rb){

const dsl2array = function(domStringList){
  const ret = [];
  const length = (domStringList || []).length;
  for(let i = 0; i < length; i++) ret.push(domStringList.item(i));
  return ret;
};

const Panel        = rb.Panel;
const Grid         = rb.Grid;
const Row          = rb.Row;
const Col          = rb.Col;
const FormGroup    = rb.FormGroup;
const ControlLabel = rb.ControlLabel;

const Select2 = crc({
  render: function(){
    const data = this.props.data;
    const onSelect = this.props.onSelect;
    const ref = function(e){
      if(!e) return;
      const select = $(e);
      select.select2({
        width: "100%",
        data: data.map(function(text){
          return {
            id: text,
            text: text,
          };
        }),
      });
      select.on("select2:select", function(e){
        const target = (e || {}).target;
        const value = target.value || "";
        onSelect(value);
      });
    };
    return r.createElement(Row, {}, r.createElement(Col, { xs: 12 }, r.createElement("select", { ref: ref })));
  },
});

const IDBObjectStoreForm = crc({
  render: function(){
    const indexNameArray = this.props.indexNameArray;
    const onIndexSelect  = this.props.onIndexSelect;
    return r.createElement(
      "form", {}, r.createElement(
        FormGroup, {}, [
          r.createElement(ControlLabel, { key: 0 }, "Select Index"),
          r.createElement(Select2,      { key: 1, data: indexNameArray, onSelect: onIndexSelect }),
        ]
      )
    );
  },
});

const IDBObjectStoreViewer = crc({
  componentDidMount: function(){
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

    const indexNames    = (this.state || {}).indexNames;

    const indexNameArray = dsl2array(indexNames) || [];

    const selectedIndex = (this.state || {}).selectedIndex || indexNameArray[0] || "";

    const me = this;
    const onIndexSelect = function(value){ me.setState({selectedIndex: value}); };
    return r.createElement(Col, { xs: 12 }, r.createElement(
      Panel,
      { defaultExpanded: false },
      [
        r.createElement(Panel.Heading, { key: 0 }, r.createElement(
          Panel.Title, { toggle: true }, storeName
        )),
        r.createElement(Panel.Collapse, { key: 1 }, r.createElement(
          Panel.Body, {}, r.createElement(
            IDBObjectStoreForm,
            {
              indexNameArray: indexNameArray,
              onIndexSelect:  onIndexSelect,
            }
          )
        )),
      ]
    ));
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
    const props = this.props || {};
    const dbname = props.dbname || "";
    return r.createElement(
      Grid, {}, [
        r.createElement("h1", {}, dbname),
        r.createElement(
          "Row", {}, storeNames.map(function(storeName, key){
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
