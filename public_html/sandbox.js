import { html, render } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import CodeMirror from 'codemirror';
import util from 'util';
import { Buffer } from 'buffer';
import 'codemirror/mode/javascript/javascript.js';
import zlib from 'zlib';

// Disabled: No dynamic import() support in jshint!?
// import jshint from 'jshint';
// import 'codemirror/addon/lint/lint.js';
// import 'codemirror/addon/lint/javascript-lint.js';
// window.JSHINT = jshint.JSHINT;

const examples = {
  Babel: '#H4sIAAAAAAAAA4VSXWvCMBR976+4k4GbzOZxoFWEIexhA0HfxsA0uWqkTUKSdhbpf18+OmEv20Pg3nNyzj25LZlkMIGz1TVsqeSluvg+QLuTsGATBHhB1ji0sN5CrXhT+bIVdBYuhlPcccVcpxFOrq6WEbLMCO0goItREo0iA5DnuQv2yIVTBpji6KGoIkmWLErFu0FScNGC4IsRU9JRIdGMlgXx4A/PqGypTVdiGfhUJTNycwtnfUbmw53w9sayAytqXXXQWCGPEBN+Gao1mpCNZJmnlXFQ0hIrOBhVw/jknLYzQsIGc44tWUWWMGVw9Tye/9JsquYo5MYorSytXipqbWjQOOEX+rehjtqpHsRTFtSxTfI4LPPbsQ6ucaXQwyLNzZ2h0h6UqR/2GUCUwgauvh66IUbnFeOWVg2OPddn+6d4Kc22M/j4/xmfWf/og/j/oalRujxsPRfSf7DX3fub998X2uDy/hoi9gUJzX6efQP1ZXyTiAIAAA==',
  Babylon: '#H4sIAAAAAAAAA4VSWY/TMBB+z68Y+hJ3FZyWFYu021bQqrBI5RBdIcGbGw+Nq8SObCfd8Ovx0WMpIKREcb5rZmznVwlcwc40NayZ5Bv16P499FAKAyZCgI9YtBYNLNdQK95WbtkJduuF/p0846qwfYNQ2rqaBcgUWjQWPDodRNMgMACUUuvjkQurNBSKo4OCK4+2GLFRvD9YJlx0IPh0UChpmZCoB7NJ7sAjXzDZMRMlYen5uIph+SnNv8sdFq65Ek8zbnpojZBbCK3tNWsa1L6pPElE3ShtYf5m/m316SP80KqGtLS2Mbd57jePcuzyDdv0lZI78/o6vUsS16mxcOhrCm6H2hqlpVu0ywr9ct6/5ySNinR4d3Cg3Lr5nEPi/liSLgNIojYDq1scnmqYAv8wrD1GYtbwSTc1avZZGWGFkheWr25LlL4mowxeZvB8PDq1FG0X8rcacREIP4P/jtPsokIWe/NBAacG7QPTbgvIRVX6HbUiw7OSWcuKcuGOW6vqH4NXYlva/08zzuA8S/BcaO+xFqYpUYti5WmSBpWf57cS53ECTIW0KB3Vu7wRfXU+EJ/lT+RY4AOaki40MovrwJE0anyJ8U0GL87RkaDNoSb14eNj91utWsn/nvwucCSNGp98E54n2Um8EFS38gtKjnqlVEPIEKazqKE6wOEg9kJytaeM82XnbutKGDet41KNRvxElx+Nx8yAOt8vIPs6/VQEAAA=',
  'lit-html': '#H4sIAAAAAAAAA0VRy27CMBC85yu2USUeovEdkpyK1HPhAzD20hjFD9mbQIT498ZxSQ+W1jO745k1W2ewhmtwGg7cyLO9j/cIHRsVICQI8I6iIwywP4C2smvHsld8GxvjKd+kFTQ4hIZ0W09QEF45gohWeRrKJwagKAqK8igVWQ/CShyhaYqlsSRxtnL4Gyml6kHJKhfWEFcGfV6XbARfvOCm5yG1TGXkU5XE2KwWz/6KYjTX4JzxPEAXlPmBydrNc+fQR1Msy5R21hM8YroNeDQS/RMu3mpYNEQubBmLOywk9qxV9BEbF7ssYww+8TLaBQ6E2rWcEC6dEaSsycYsgUAPxxdTwdJwjSuo6mmTp9LVX9i2Ft4fkXiWzNWnpPs9uZgizMo3RQ0EqxEkJ54lo8v/B5aL2dxqA+OfdRoNFXEzq132C68p/rMMAgAA',
  'Material UI': '#H4sIAAAAAAAAA5VTsW7bMBDd9RVXL7IDW0o7dHBsI03ioUPaIPZWZKDFi8VEFAnypFoo+u89io6NBHXQDoTId+/dvTtS+VkCZ/DkrYaVqOXG7PgcoHWpPPgIAe6waAg9LFegjWwq3rZKTAMxrNkHaQrqLEJJulr0kC+csgQBnQ+iaNBHALIso5AepSLjoDASGepVeZTFFBsju71kJlULSs4HhalJqBrdYDHLGXyJF6JuhY+UfhvicReT5YdsYS2fsGBzJR563HTQeFVvobf20wlr0QVTeZIobY0juEfBokdnNKQlkfXTPA+jyyS2uQvBy4+f04tX9Jvvt+8qJtLoV6rbRq1L1HjnTKskulNqLQidEtWkUZfn2afz3FPH95K/1R8zf7H2Svx7vkg/ym+YcKeK5/+wdJRwmoSvzvcuYA7DEcwX8COBOKWs4GEQLis2XtMwluacj6KpaAy/mAfwjN0UUlJU4YaNjXuwPzK8Dt89prjSdSW8/yY03qttSUzQjeJH6ichOKlFq7aCFG9xZ/kFTLRxmLL692h8wtSxmb8bkxy3sdloo1Q1rXEXil9XHAAysMIqPDzRTzPWSx54Ni9vJXNY86UNT3h4e7lHJ3VTVbHsiYFGyogpfYc8iyaEsi3SnnXVfZXD9PCDpaNkdPEH6RTwLSAEAAA=',
  Tensorflow: '#H4sIAAAAAAAAA21TTU/cMBC951dM97JZFCUsBVUKLOKC2kOrVlp6Qhy88YQ1SmzjmSybIv57xzHQReohkTMfz++9mVRHGRzBA/ke1srqjdvLdwzdbA0BpRDgHpuBkeB6Db3TQyfHnVF1LIzPxSftGh49wpb77nIKUROMZ4jR1Sw1zaYMQFmWHOFRG3YBGqdRQlNXldoSxMbp8bXlQpsdGL2aNc6yMhbD7PKikuBbvlF2pyiVTMeYT6cEVr2jxef6ARsht8V3jZsRBjL2HiZqT0F5jyGSqrLM9N4FKW+hDa6H+ZbZU11V0bdS4666YrTkQtu5p4rbB7o6LpfH5fH8PMuEMHF0DTtYCURJ+DigZaO6fHGeTYlSaZ1LqlMjBhJES5g/D9Yw1bAswFg/8HqrPNZwu7x7WUhjVlXwK6BXAScd6YZW/OQgBomSGtYeG9OOU75zRCBapw/n2fTmTxSYCDSu96aTS2NZDfMelV0/DgKur0NwYV7865E03ev5yyuJryjTUCxOul5eo5UL2DSgFasPfMpXL/aUjEienej8ViSeFPC5gNO7Am5PC1jeCXiqHv9XLaVnBXw5rI5UbuJNB268DRQnMm9aW8P5ngpBXsgeos3zBawu4TkDEIzfdOgnO9BO/G8xoG3EOAsqKfPOWD6o3CqycwZCtLBB0Y11AvzpMXHaBPdEGEAWhp3rKIJLeRrIwDJiaZAfaehlPcq4rqWx4u23mx/fxYNE3stETMP5B0fOohHLyQiR5NYcRHfcLpnRX23AipniAwAA',
  'Vue.js': '#H4sIAAAAAAAAAz1QsW7DIBTc+YoXd3AbVWZ3HG+RMrRTos4h8BoT2YAAO7Es/3vBNB4eOu7enQ7olsAW7s50cGJKXPUz3CN1bqQDlyjAJ/Leo4PDCTot+jbAQbIyLsapNkJzPxqExndtvVCOW2k8RHafJVO2KABFUfgYj0J6bYFrgYFaXDTZUsRVi/HfUgk5gBT7jGvlmVRos7qigXzpnKmBubSywKgnlMLomhbncEceyjW4vvE6Qu+kusFS7WGZMWhjKUqI7Iy2Hn56hF+rO8gb740rKY0fVwgc6NBjaON8BPmOkLVmIVU4j+fvL9jDpTL1NEGHzrEbwjxX1NSXsK7wEdPfJwKAbQn52xqQfwZOMM9KiCq83GHpiG2ro6+4u00exJnMH7s/PwfC8dMBAAA='
};

const sandboxTpl = () => html`
<style>
  .editor {
    position: absolute;
    top: 3.5em;
    left: 0;
    width: 50%;
    height: calc(100% - 3.5em);
  }
  .codemirror {
    height: 100%;
  }
  .CodeMirror {
    background: transparent;
    height: 100%;
  }
  .editor-bar {
    width: 0;
    height: 3em;
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 12;
  }
  .editor-bar .inner {
    width: 12em;
    margin-left: -6em;
    margin-top: 1.2em;
  }
  .editor-bar select {
    float: left;
    width: 8em;
  }
  .editor-bar button {
    float: right;
    padding-left: 1em;
    margin-top: 0.05em;
    z-index: 13;
    cursor: pointer;
    color: #666;
    text-shadow: 1px 1px #efefef;
    background: transparent;
    border: none;
    outline: none;
  }
  .editor-bar button:hover {
    color: #222;
    text-shadow-color: #fff;
  }
  .editor-bar button[disabled] {
    cursor: wait;
    color: #aaa;
  }
  .output {
    position: absolute;
    top: 3.5em;
    right: 0;
    width: 50%;
    height: calc(100% - 3.5em);
    border-left: 1px solid #eee;
  }
  .output .log {
    font-size: 1em;
    background-color: #444;
    color: #eee;
    overflow-y: scroll;
    height: 30%;
  }
  .output .log .item {
    border-bottom: 1px solid #777;
    padding-bottom: 0.5em;
    padding: 0.5em 2em;
    margin: 0;
    white-space: pre-wrap;
  }
  @media screen and (max-width: 850px), screen and (max-device-width: 850px) {
    .editor {
      width: 100%;
    }
    .output {
      left: 0;
      top: calc(3.5em + 50%);
      height: calc(50% - 3.5em);
      width: 100%;
    }
    .topbar ul.toplinks {
      display: none;
    }
    .editor-bar {
      left: 70%;
    }
  }
</style>
<div class="editor-bar">
  <div class="inner">
    <select class="examples">
      <option value="">Examples</option>
      ${unsafeHTML(Object.entries(examples).map(([name, url]) => `<option value="${url}">${name}</option>`).join(''))}
    </select>
    <button class="run">&#9654;&nbsp;Run</button>
  </div>
</div>
<div class="editor">
  <div style="width: 100%; height: 100%;">
    <div class="codemirror"></div>
  </div>
</div>
<div class="output">
  <div style="position: absolute; width: 100%; height: 100%; z-index: 11;">
    <div class="browser-wrapper" style="width:100%; height: 70%; background-color:#fff"></div>
    <div class="log"></div>
  </div>
</div>
`;

let editor, sandbox, curHash, curJs;
function initSandbox (contents) {
  if (!contents) {
    const hash = location.hash.slice(1);
    if (hash) {
      curHash = hash;
      try {
        contents = hashToSource(hash);
      }
      catch (e) {
        console.error(e);
        contents = hashToSource(examples.Babel);
      }
    }
    else {
      contents = hashToSource(examples.Babel);
    }
  }
  sandbox = document.createElement('div');
  sandbox.className = 'sandbox';
  render(sandboxTpl(), sandbox);
  
  const container = document.body.querySelector('.container');
  container.appendChild(sandbox);

  editor = CodeMirror(sandbox.querySelector('.codemirror'), {
    lineNumbers: true,
    value: contents,
    mode: "javascript",
    // gutters: ["CodeMirror-lint-markers"],
    // lint: {
    //  esversion: '8'
    // }
    scrollbarStyle: 'null',
    tabSize: 2,
  });

  const browserWrapper = sandbox.querySelector('.browser-wrapper');
  const logWrapper = sandbox.querySelector('.log');

  window.addEventListener('popstate', function () {
    const hash = location.hash.slice(1);
    if (hash && hash !== curHash) {
      editor.setValue(curJs = hashToSource(hash));
      curHash = hash;
    }
  });

  let selectChange = false;
  editor.on('change', () => {
    if (!selectChange)
      select.value = '';
  });

  function run () {
    let loading = true;
    button.disabled = true;

    const script = document.createElement('script');
    script.type = 'module';
    const js = editor.getValue();

    if (curJs !== js) {
      curHash = '#' + zlib.gzipSync(new Buffer(js)).toString('base64');
      if (location.hash !== curHash) {
        window.history.pushState(null, document.title, curHash);
      }
    }
    curJs = js;

    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      margin: '0',
      padding: '0',
      borderStyle: 'none',
      height: '100%',
      width: '100%',
      marginBottom: '-5px', // no idea, but it works
      overflow: 'scroll'
    });
    const blobUrl = URL.createObjectURL(new Blob([
`<!doctype html><style>body{cursor:wait}</style><script type="module">window.parent.jspmSandboxStarted();${js.replace(/<\/script>/g, '&lt;\/script>')/*UNSAFE!!*/}
</script>
<script type="module">
window.parent.jspmSandboxFinished();
</script>
<script>
window.onerror = function (msg, source, line, col, err) {
  window.parent.jspmSandboxError(msg, source, line, col, err);
};
window.console = window.parent.jspmConsole;
</script>
<body style="margin: 0; padding: 0; height: 100%; background-color: #fff">
  <canvas id="canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" touch-action="none"></canvas>
  <div id="container"></div>
</body>
`], { type: 'text/html' }));
    iframe.src = blobUrl;
    browserWrapper.innerHTML = '';
    browserWrapper.appendChild(iframe);

    let started = false;
    window.jspmSandboxStarted = function () {
      started = true;
    };
    window.jspmSandboxFinished = function () {
      if (!started) {
        if (loading) {
          jspmLog('Network error loading modules. Check the browser network panel.');
          loading = false;
          button.disabled = false;
          iframe.contentDocument.body.style.cursor = 'default';
        }
      }
      else {
        loading = false;
        button.disabled = false;
        iframe.contentDocument.body.style.cursor = 'default';
      }
    };
    window.jspmSandboxError = function (msg, source, line, col, err) {
      if (loading) {
        loading = false;
        button.disabled = false;
        iframe.contentDocument.body.style.cursor = 'default';
      }
      let parts = err.stack.split(blobUrl);
      if (parts.length === 1) {
        if (line === 1) col = col - 72;
        parts = [`${msg} sandbox:${line}:${col}`];
      }
      jspmLog(parts.join('sandbox'), { color: 'red' });
    };
    // TODO: support the rest of the console API
    window.jspmConsole = Object.assign(Object.create(null), logWrapper, {
      log (arg) {
        let content = '';
        for (let i = 0; i < arguments.length; i++) {
          content += util.inspect(arguments[i], { depth: 0 }) + (i < arguments.length - 1 ? ' ' : '');
        }
        jspmLog(content.replace(/\\n/g, '\n'));
        window.console.log.apply(logWrapper, arguments);
      },
      error (err) {
        let parts = (err && err.stack || err.toString()).split(blobUrl);
        jspmLog(parts.join('sandbox'), { color: 'red' });
      }
    });
    function jspmLog (content, style) {
      const newItem = document.createElement('pre');
      if (style)
        Object.assign(newItem.style, style);
      newItem.className = 'item';
      newItem.innerHTML = content;
      logWrapper.appendChild(newItem);
      logWrapper.scrollTop = logWrapper.scrollHeight;
    }
  }

  const button = sandbox.querySelector('button.run');
  button.addEventListener('click', run);
  window.jspmLog = function (content) {
    logWrapper.innerHTML += '<pre class="item">' + content.replace(/</g, '&lt;') + '</pre>';
  };

  const select = document.body.querySelector('select.examples');
  select.addEventListener('change', () => {
    selectChange = true;
    editor.setValue(hashToSource(select.value.slice(1)));
    selectChange = false;
  });

  if (curHash)
    run();
}

function hashToSource (hash) {
  return zlib.gunzipSync(new Buffer(hash, 'base64')).toString('utf8');
}

initSandbox();
