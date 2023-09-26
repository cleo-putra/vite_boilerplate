// main.ts
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


/*import './components/ckeditor/editor';

document.addEventListener('DOMContentLoaded', async function (event) {
  let d = document.querySelector('#app');
  if (d) {
    d.innerHTML = `
    <sp-editor></sp-editor>
    `
  }
})

/*ClassicEditor
    // Note that you do not have to specify the plugin and toolbar configuration — using defaults from the build.
    .create( document.querySelector( '#app' ) as HTMLElement )
    .then( editor => {
        console.log( 'Editor was initialized', editor );
    } )
    .catch( error => {
        console.error( error.stack );
    } );*/
