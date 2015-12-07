var bootstrap = {
  todo: null,
  permissions: null,
  initialView: null,
  user: null,
  theme: null,
  run: function() {
    switch (bootstrap.todo) {
      case 'site':
        (function() {
          app_.site(bootstrap.landing);
        })();
        break;
      default:
        console.debug('No match for', bootstrap.todo);
    }
  },
  addApp: function(name) {
    bootstrap.todo = name;
  },
  setDefaults: function(var_args) {
    bootstrap.landing = arguments[0];
  },
  loadScript: function(src, callback) {
    var head = document.getElementsByTagName('head')[0],
      script = document.createElement('script');
    var done = false;
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'utf-8');
    script.onload = script.onreadstatechange = function() {
      if (!done && (!this.readyState ||
        this.readyState === 'loaded' ||
        this.readyState === 'complete')) {
        done = true;
        script.onload = script.onreadystatechange = null;
        callback && callback();
      }
    };
    head.insertBefore(script, head.firstChild);
  }
};

function initScriptLoad() {
  bootstrap.run();
}

window.onload = initScriptLoad;
