// despite the confusing filename, this is just a worker that serves the index HTML page for this demo.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/' ) {
      

      	const store = { 
      			title: "Hey, this is a PE.js demo page.",
      			listitems: [
      				{text: "You can try it in the console."}, 
      				{text: "For example, change the value of store.title or store.listitems[1].text"},
      			]
      	};
      
        const html = `<!DOCTYPE html>
        <html>
        <title>PE.js playground</title>
        <body>
        <h1 data-pe-text="store.title">${store.title}</h1>
        <ul>
          ${store.listitems.map((item,i) => `
            <li data-pe-each="store.listitems" data-pe-text="store.listitems[${i}].text">${item.text}</li>
          `).join('')}
        </ul>
        
        <script type="module">
          // get the PE lib
          import pe from './pe.js';
          // get the json that was used to populate the markup in the first place
          const store = JSON.parse('${JSON.stringify(store)}');
          // pass it to a new PE instance
          const PE = new pe(store, "store");
          // expose it for fun
          window.store = PE.data;
        </script>
        </body>
        </html>
        `;
      
        return new Response(html, {
          headers: {
            "content-type": "text/html;charset=UTF-8",
          },
        });
    }
    // Otherwise, serve the static assets.
    // Without this, the Worker will error and no assets will be served.
    return env.ASSETS.fetch(request);
  }
}
  

