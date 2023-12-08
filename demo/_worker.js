export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/' ) {
      

      	const store = { 
      			title: "My List",
      			listitems: [
      				{text: "here is a list item"}, 
      				{text: "here is another one"},
      			]
      	};
      
        const html = `<!DOCTYPE html>
        <html>
        <body>
        <h1 data-pe-text="store.title">${store.title}</h1>
        <ul>
          ${store.listitems.map((item,i) => `
            <li data-pe-each="store.listitems" data-pe-text="store.listitems[${i}].text">${item.text}</li>
          `).join('')}
        </ul>
        
        <script type="module">
          import pe from 'pe.js';
          const store = JSON.parse('${JSON.stringify(store)}');
          // pass the store to a new PE instance
          const PE = new pe(store, "store");
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
  

