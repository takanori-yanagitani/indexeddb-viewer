(function(w, r, rd, crc, rb, rbt2p, rbt2){

const dsl2array = function(domStringList){
  const ret = [];
  const length = (domStringList || []).length;
  for(let i = 0; i < length; i++) ret.push(domStringList.item(i));
  return ret;
};

const Panel         = rb.Panel;
const Grid          = rb.Grid;
const Row           = rb.Row;
const Col           = rb.Col;
const FormGroup     = rb.FormGroup;
const ControlLabel  = rb.ControlLabel;
const Pager         = rb.Pager;
const Pagination    = rb.Pagination;
const ListGroup     = rb.ListGroup;
const ListGroupItem = rb.ListGroupItem;

const reactBootstrapTable2PageFatory = rbt2p;
const BootstrapTable = rbt2;

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
    return r.createElement(Col, { xs: 12 }, r.createElement(
      "form", {}, r.createElement(
        FormGroup, {}, [
          r.createElement(ControlLabel, { key: 0 }, "Select Index"),
          r.createElement(Select2,      { key: 1, data: indexNameArray, onSelect: onIndexSelect }),
        ]
      )
    ));
  },
});

const IDBObjectStoreRowView = crc({
  render: function(){
    const data = this.props.data || [];
    return r.createElement(ListGroup, {}, data.map(function(row, key){
      const header = (row || {}).header;
      const children = (row || {}).children;
      return r.createElement(
        ListGroupItem,
        { header: header },
        children
      );
    }));
  },
});

const IDBObjectStoreContent = crc({
  render: function(){
    const selectedIndex = this.props.selectedIndex || "";
    const firstData = this.props.firstData || [];
    const data = firstData.map(function(row, index){
      const key = (row || {}).key;
      const primaryKey = (row || {}).primaryKey;
      const value = (row || {}).value;
      return {
        header: key,
        children: value ? JSON.stringify(value) : "",
      };
    });

    const onPrevious = function(e){ console.log(e); };
    const onNext     = function(e){ console.log(e); };
    console.log(selectedIndex);
    return r.createElement(
      Col, { xs: 12 }, r.createElement(
        Row, {}, [
          r.createElement(
            IDBObjectStoreRowView,
            { data: data }
          ),
          r.createElement(Col, { key: 0, xs: 12, xsHidden: true, smHidden: true, mdHidden: true, lgHidden: true }, r.createElement(Pager, {}, [
            r.createElement(Pager.Item, { key: 0, previous: true, href: "#", onClick: onPrevious }, "Previous"),
            r.createElement(Pager.Item, { key: 1, next    : true, href: "#", onClick: onNext     }, "Next"),
          ])),
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
      const firstIndexName = indexNames && indexNames.item && indexNames.item(0);
      const firstData = [];
      const enough = function(){ return 9 < firstData.length; };
      const stop = function(cursor){ return enough() || !cursor.continue; };
      const firstIndex = store && store.index && store.index(firstIndexName);
      if(! firstIndex) return;
      if(! firstIndex.openCursor) return;
      firstIndex.openCursor().onsuccess = function(event){
        const target = (event || {}).target || {};
        const cursor = target.result || {};
        const primaryKey = cursor.primaryKey;
        const key = cursor.key;
        const value = cursor.value;
        if(stop(cursor)) return me.setState({
          indexNames: indexNames,
          firstData: firstData,
        });
        firstData.push({
          primaryKey: primaryKey,
          key: key,
          value: value,
        });
        cursor.continue();
      };
    });
  },

  render: function(){
    const dbname    = this.props.dbname;
    const storeName = this.props.storeName;

    const indexNames     = (this.state || {}).indexNames;
    const firstData      = (this.state || {}).firstData;

    const indexNameArray = dsl2array(indexNames) || [];

    const selectedIndex  = (this.state || {}).selectedIndex || indexNameArray[0] || "";

    const me = this;

    const onIndexSelect = function(value){
      (function(onOpen){
        console.log(dbname, storeName, value);
      })(function(event){
      });
      me.setState({selectedIndex: value});
    };

    return r.createElement(Col, { xs: 12 }, r.createElement(
      Panel,
      { defaultExpanded: false },
      [
        r.createElement(Panel.Heading, { key: 0 }, r.createElement(
          Panel.Title, { toggle: true }, storeName
        )),
        r.createElement(Panel.Collapse, { key: 1 }, r.createElement(
          Panel.Body, {}, r.createElement(Row, {}, [
            r.createElement(IDBObjectStoreForm, {
              key: 0,
              indexNameArray: indexNameArray,
              onIndexSelect:  onIndexSelect,
            }),
            r.createElement(IDBObjectStoreContent, {
              key: 1,
              selectedIndex: selectedIndex,
              firstData: firstData,
            }),
          ])
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

})(window, window.React, window.ReactDOM, window.createReactClass, window.ReactBootstrap, window.ReactBootstrapTable2Paginator, window.ReactBootstrapTable2);
