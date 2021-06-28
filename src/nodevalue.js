class NodeValue {
  constructor(data = {}) {
    this.value = data;
    this.domElement = document.createElement('div');
    this.domElement.classList.add('node-value');


    // TODO: Make this a smarter form builder.
    Object.entries(data).forEach(([key, value]) => {
      console.log('yoyoyo', key, value);
      let editor = document.createElement('div');
      editor.classList.add('node-value-editor');

      let label = document.createElement('label');
      label.innerText = key;
      label.classList.add('node-value-label');

      let input = document.createElement('input');
      input.value = value;
      input.classList.add('node-value-input');

      input.addEventListener('change', (e) => {
        data[key] = e.target.value;
      });

      editor.appendChild(label);
      editor.appendChild(input);

      this.domElement.appendChild(editor);
    });
  }
}
