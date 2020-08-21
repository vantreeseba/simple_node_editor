/**
 * A title bar component.
 * It creates a title bar and can add items that are clickable.
 */
class TitleBar {
  /**
   * Creates the title bar html element and appends to body.
   */
  constructor() {
    this.el = document.createElement('div');
    this.el.classList.add('titlebar');
    document.body.appendChild(this.el);
  }

  /**
   * Add an item to the titlebar.
   *
   * @param {string} text - The text displayed on the item.
   * @param {function} onclick - The callback triggered when item is clicked.
   * @return {void}
   */
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
