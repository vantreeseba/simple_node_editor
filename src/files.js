class Files {
  static download(fileName = 'file.txt', data, { type = 'text/plain' } = {}) {
    var el = document.createElement('a');
    const file = new Blob([data], { type });
    el.href = URL.createObjectURL(file);
    el.download = fileName;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }

  static upload(onData) {
    var file, fr;

    if (typeof window.FileReader !== 'function') {
      alert('The file API isn\'t supported on this browser yet.');
      return;
    }

    var el = document.createElement('input');
    el.setAttribute('type', 'file');
    document.body.appendChild(el);
    el.click();

    var interval = setInterval(() => {
      if (!el) {
        alert('Um, couldn\'t find the fileinput element.');
        clearInterval(interval);
        return;
      } else if (!el.files) {
        alert('This browser doesn\'t seem to support the `files` property of file inputs.');
        clearInterval(interval);
        return;
      } else if (!el.files[0]) {
        return;
      } else {
        file = el.files[0];
        fr = new FileReader();
        fr.onload = fe => {
          onData(fe.target.result);
          clearInterval(interval);
        };
        fr.readAsText(file);
      }
    }, 250);

  }
}
