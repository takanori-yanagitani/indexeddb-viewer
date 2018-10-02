(function(IndexedDBViewer){

ReactDOM.render(
  React.createElement(IndexedDBViewer, { dbname: "browser" }),
  document.getElementById("react")
);

})(window.IndexedDBViewer);
