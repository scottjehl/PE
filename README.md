# 🔗
A Progressive Enhancement templating language

🔗 ("link") is a Declarative templating and data binding pattern for HTML, which runs in Node.js and in the browser. 

The goal of 🔗 is to offer a simple way to generate usable and meaningful HTML from data that retains its data binding relationships so it can serve as a template for future updates as well.

**The template output is still a template!**

🔗 uses a templating syntax built on standard HTML data attributes that are meant to stay in the HTML after it is rendered, rather than being removed, allowing for simple declarative progressive enhancement in the browser. These attributes reference relationships between HTML elements and JavaScript variables, arrays, objects, and properties for one-way data binding that can populate and update the element's content and attributes. 

In other words, when a variable changes, any markup linked to that variable will update. 

## Basic Conventions

Here's a basic example of 🔗 syntax in play, using `data-🔗-text`.

Server HTML Template:
```html
<h1 data-🔗-text="data.page.title"></h1>
```

Data Source:
```js
const data = { page: { title: "This is the article title" } }
```

HTML Output (after parsing by 🔗.js):
```html
<h1 data-🔗-text="data.page.title">This is the article title</h1>
```

Above, a source template containing an `h1` element starts with a `data-🔗-text` attribute to communicate a relationship to a JavaScript variable, or property in this case: `data.page.title`. The `text` suffix in the attribute name says that the referenced property should provide the text content for the element. 🔗.js, a tiny 🔗 JavaScript library that can run on the server in Node and in the browser, populates the text of the element while leaving the attribute in place, retaining its relationship to the property for later updates.

While this example shows a common relationship to a property in a potentially large data structure, `data-🔗-text` can reference any variable available in the environment you'd like. As a wild example, on the client-side, 🔗 can even track a built-in variable like `window.innerWidth`:

Server HTML Template:
```html
<p data-🔗-text="window.innerWidth"></h1>
```

...which would update the text of that element to match the browser window's width, in real time as you resize the window!


## Attribute Value Linking Conventions

In addition to binding an element's text content to JavaScript variables, 🔗 can bind the values of an element's attributes as well. You do this via the `data-🔗-attr-` attribute prefix, which can be combined with any attribute you'd like to control on the element. For example, here's a link with an `href` attribute bound to a property:

Server HTML Template:
```html
<a data-🔗-attr-href="callToActionURL">Buy my book!</a>
```

Data Source:
```js
const callToActionURL = "https://mybookwebsite.com"
```

HTML Output:
```html
<a data-🔗-attr-href="callToActionURL" href="https://mybookwebsite.com">Buy my book!</a>
```

Again, should that `callToActionURL` update at any time, the link's href will update to match it.


## Arrays and Object Binding
In addition to simple string variables, you can bind elements to objects and arrays too. Like this.

Data Source:
```js
const data = { page: { title: "This is the article title" } }
```

Server HTML Template:
```html
<h1 data-🔗="data.page"></h1>
```

That object binding alone will not do anything yet, but once an element is bound to an object or array, additional 🔗 attributes on that element or on that element's child elements can reference that array or object with shorthand of either `[]` or `{}`. 

The following example is functionally equivalent to the first H1 example above, using shorthand syntax:

Data Source:
```js
const data = { page: { title: "This is the article title" } }
```

Server HTML Template:
```html
<h1 data-🔗="data.page" data-🔗-text="{}.title"></h1>
```

HTML Output:
```html
<h1 data-🔗="data.page" data-🔗-text="{}.title">This is the article title</h1>
```

Here's an example using the array shorthand to reference the second item in an array:

Data Source:
```js
const greetings = ["hi", "hello"]
```

```html
<h1 data-🔗="hooray" data-🔗-text="[][1]"></h1>
```

HTML Output:
```html
<h1 data-🔗="hooray" data-🔗-text="[][1]">hello</h1>
```

This shorthand syntax is convenient when specifying many attributes from the same object. You can also use the shorthand for child elements.

Data Source:
```js
const user = {name: "Scott", id: "12345"}
```

Server
```html
<h1 data-🔗="data.user">Hey there, <span data-🔗-text="{}.name"></span></h1>
```

HTML Output:
```html
<h1 data-🔗="data.user">Hey there, <span data-🔗-text="{}.name">Scott</span></h1>
```


## Loops

For looping through arrays to say, generate an HTML list, 🔗 offers a special attribute: `data-🔗-each`. 

This attribute is unique because 🔗 will treat that element's first child element that has an `data-🔗-each-item` attribute as a template for rendering every item in the array, replacing its content and relevant bound attributes to reflect each array's data. When 🔗 is parsing an `each` element (such as when the HTML is initially generated, or when the array changes state), if it encounters additional child element siblings that also have that attribute, it will remove them from the HTML so that the items match the items in the array.

Here's an example:

Data Source:
```js
const data = {
  page: {
    navigation: [
      {title: "Home", url: "/"},
      {title: "Contact", url: "/contact"}
    ]
  }
}
```

Server
```html
<ul data-🔗-each="data.page.navigation">
  <li data-🔗-each-item>
    <a data-🔗-attr-href="{}.url" data-🔗-text="[].title"></a>
  </li>
</ul>
```

HTML Output:
```html
<ul data-🔗-each="data.page.navigation">
  <li data-🔗-each-item>
    <a data-🔗-attr-href="{}.url" href="/" data-🔗-text="[].title">Home</a>
  </li>
  <li data-🔗-each-item>
    <a data-🔗-attr-href="{}.url" href="/contact" data-🔗-text="[].title">Contact</a>
  </li>
</ul>
```

## One-time Bindings

For content that will not need to update or change after it is generated once, 🔗 offers the `data-🔗-once` attribute. When this attribute is present, 🔗 will follow attribute instructions and then remove them, so the element will receive no further updates. This is helpful for minimizing the performance toll of observing large data structures throughout a page.

Here's an example.

Data Source:
```js
const user = {name: "Scott", id: "12345"}
```

Server
```html
<h1 data-🔗="data.user" data-🔗-once>Hey there, <span data-🔗-text="{}.name"></span></h1>
```

HTML Output:
```html
<h1>Hey there, <span>Scott</span></h1>
```

Note: For simplicity sake, `data-🔗-once` applies not only to the element with the attribute, but also to all of that element's children, even if those children are bound to different properties than the parent.


## Serving 🔗 HTML with any server language

Because the templating output of 🔗 is also a template, 🔗 gives you the flexibility to use any server templating language you prefer and still run 🔗.js in the browser, or even no templating language at all. 🔗's declarative attributes are there to communicate data binding relationships that matter to the markup, but the only thing you need to be concerned with is delivering HTML that has the attributes in place.

As an example, say you want to use regular old PHP to output your HTML on the server. That's fine. Just keep the attributes in place wherever you want relationships to be retained on the clientside:

```php
echo '<h1 data-bind-text="data.title">' . $data->title . '</h1>';
```

...or a JavaScript literal:
```js
let html = `<h1 data-bind-text="data.title">${data.title}</h1>`
```

The client-side doesn't care how the initial HTML was generated. It only cares about keeping the HTML in sync wherever you care to do so.


## Caveats and Considerations

- First, 🔗.js doesn't exist yet. It's [in development](🔗.js)!
- Second, text binding works best when setting the entire inner content of an element. This means that in situations where you might be used to say, dropping a string variable like `hello, {{user.name}}!` into the text in an element, you'll likely want to use a wrapper element to isolate it instead, like this: `hello, <span data-🔗-text="user.name"></span>`
- Lastly, if you want to run 🔗 without 🔗.js on the server, or 


## More soon!








