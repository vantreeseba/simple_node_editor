class ContextMenu {
  constructor({ element, title } = {}) {

    this.el = document.createElement('div');
    this.el.classList.add('contextmenu');
    this.el.classList.add('hidden');
    this.el.setAttribute('title', title || 'MENU');
    document.body.appendChild(this.el);

    this.el.addEventListener('blur', e => {
      this.el.classList.add('hidden');
    });

    this.clickable = element || window;

    window.addEventListener('click', e => {
      this.el.classList.add('hidden');
    });

    this.clickable.addEventListener('contextmenu', e => {
      this.el.classList.remove('hidden');
      this.el.style.left = e.clientX - this.el.offsetWidth/2;
      this.el.style.top = e.clientY - this.el.offsetHeight/2;
      e.preventDefault();
      e.stopPropagation();
    });
  }

  addItem(text, onclick) {
    var item = document.createElement('div');
    item.classList.add('item');
    item.innerText = text;
    this.el.appendChild(item);

    item.addEventListener('click', e=> {
      console.log('clicked', text);
      if(onclick) {
        onclick(e);
      }
    });
  }
}
