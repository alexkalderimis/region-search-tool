var chan = Channel.build({
  window: window.document.getElementById('child').contentWindow,
  origin: '*',
  scope: 'CurrentStep'
});

chan.call({
  method: 'init',
  params: {
    request: {
      regions: [
        '2L:14615455..14619002',
        '2R:5866646..5868384',
        '3R:2578486..2580016'
      ],
      types: ['Gene', 'Intron', 'Exon', 'CDS'],
      organism: 'D. melanogaster'
    },
    service: {
      root: "http://www.flymine.org/query"
    }
  },
  success: function () {
    console.log("Tool initialised");
  },
  error: function (e) {
    console.log("initialisation failed because: " + e);
  }
});

var head = document.getElementsByTagName("head")[0];
var links = document.getElementsByTagName("link");
var i, l, styles = [];
for (i = 0, l = links.length; i < l; i++) {
  chan.call({
    method: 'style',
    params: { stylesheet: links[i].href },
    success: function () {
      console.log("Applied stylesheet");
    },
    error: function (e) {
      console.log(e);
    }
  });
}

chan.bind('has-list', function (trans, data) {
  console.log("Woot - list exists");
});

chan.bind('wants', function (trans, params) {
  console.log('TRANSGRESSIVE WANT', params.what, params.data);
});

