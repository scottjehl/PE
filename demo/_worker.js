export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '' ) {
      

      	const store = { 
      			title: "My List",
      			listitems: [
      				{text: "here's a list item"}, 
      				{text: "here's another one"},
      			]
      	};
      
        const html = `yay`;
      
        return new Response(html, {
          headers: {
            "content-type": "text/html;charset=UTF-8",
          },
        });

      
    }
    // Otherwise, serve the static assets.
    // Without this, the Worker will error and no assets will be served.
    return env.ASSETS.fetch(request);
  },
}
  

