// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';

export default class Editor {
  constructor() {
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#editor'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in IndexedDB.
    // Fall back to localStorage if nothing is stored in IndexedDB, and if neither is available, set the value to an empty string.
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      this.editor.setValue(data || localData || '');
    });

    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });
    // Save the content of the editor when the editor loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      const content = this.editor.getValue();
      putDb(content); // Call the putDb function from database.js to store the content in IndexedDB
    });
  }
}