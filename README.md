# P.E.
**A Progressive Enhancement templating language**

pe (a working title for now) is a Declarative templating and data binding pattern for HTML, which runs in Node.js and in the browser. 

The goal of pe is to offer a simple way to generate usable and meaningful HTML from data that retains its data binding references so it can serve as a template for future updates as well.

**The output of the template is still a template!**

pe uses a templating syntax built on standard HTML data attributes that are meant to stay in the HTML after it is rendered, rather than being removed, allowing for simple declarative progressive enhancement in the browser. These attributes reference relationships between HTML elements and JavaScript variables, arrays, objects, and properties for one-way data binding that can populate and update the element's content and attributes.

In other words, when a variable changes, any markup linked to that variable will update. 

**_Small note: [pe.js](demo/pe.js) doesn't exist yet. This is the spec from which it will be produced! All examples are pseudo-code describing how it will potentially work. Sorry! :)_**

## Basic Conventions

Here's a basic example of pe syntax in play, using `data-pe-text`.

Server HTML Template:
```html
<h1 data-pe-text="data.page.title"></h1>
```

Data Source:
```js
const data = { page: { title: "This is the article title" } }
```

HTML Output (after parsing by pe.js):
```html
<h1 data-pe-text="data.page.title">This is the article title</h1>
```

Above, a source template containing an `h1` element starts with a `data-pe-text` attribute to communicate a relationship to a JavaScript variable, or property in this case: `data.page.title`. The `text` suffix in the attribute name says that the referenced property should provide the text content for the element. pe.js, a tiny pe JavaScript library that can run on the server in Node and in the browser, populates the text of the element while leaving the attribute in place, retaining its relationship to the property for later updates.

## Attribute Value Binding Conventions

In addition to binding an element's text content to JavaScript variables, pe can bind the values of an element's attributes as well. You do this via the `data-pe-attr-` attribute prefix, which can be combined with any attribute you'd like to control on the element. For example, here's a link with an `href` attribute bound to a property:

Server HTML Template:
```html
<a data-pe-attr-href="callToActionURL">Buy my book!</a>
```
Data Source:
```js
const callToActionURL = "https://mybookwebsite.com"
```
HTML Output:
```html
<a data-pe-attr-href="callToActionURL" href="https://mybookwebsite.com">Buy my book!</a>
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
<h1 data-pe="data.page"></h1>
```

That object binding alone will not do anything yet, but once an element is bound to an object or array, additional pe attributes on that element or on that element's child elements can reference that array or object with shorthand of `$`. 

The following example is functionally equivalent to the first H1 example above, using shorthand syntax:

Data Source:
```js
const data = { page: { title: "This is the article title" } }
```

Server HTML Template:
```html
<h1 data-pe="data.page" data-pe-text="$.title"></h1>
```

HTML Output:
```html
<h1 data-pe="data.page" data-pe-text="$.title">This is the article title</h1>
```

Here's an example using the array shorthand to reference the second item in an array:

Data Source:
```js
const greetings = ["hi", "hello"]
```

```html
<h1 data-pe="greetings" data-pe-text="$[1]"></h1>
```

HTML Output:
```html
<h1 data-pe="greetings" data-pe-text="$[1]">hello</h1>
```

This shorthand syntax is convenient when specifying many attributes from the same object. You can also use the shorthand for child elements of any depth, and the same context will be used until a child element binds to an object or array itself.

Data Source:
```js
const user = {name: "Scott", id: "12345"}
```

Server
```html
<h1 data-pe="data.user">Hey there, <span data-pe-text="$.name"></span></h1>
```

HTML Output:
```html
<h1 data-pe="data.user">Hey there, <span data-pe-text="$.name">Scott</span></h1>
```


## Loops

For looping through arrays to say, generate an HTML list, pe offers a special attribute: `data-pe-each`. 

This attribute is unique because pe will treat the first element that has an `data-pe-each` attribute as a template for rendering every item in the array as siblings of that first element, replacing its content and relevant bound attributes to reflect each array item's data. When pe is parsing an `each` element (such as when HTML is initially generated, or when the array changes state later on), if it encounters additional element siblings that also have that attribute, it will remove them from the HTML so that the items match the items in the array.

Unlike ordinary shorthand, in a `data-pe-each` loop the `$` references an item of the array, rather than the parent array.

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
<ul>
  <li data-pe-each="data.page.navigation">
    <a data-pe-attr-href="$.url" data-pe-text="$.title"></a>
  </li>
</ul>
```

HTML Output:
```html
<ul>
  <li data-pe-each="data.page.navigation">
    <a data-pe-attr-href="$.url" href="/" data-pe-text="$.title">Home</a>
  </li>
  <li data-pe-each="data.page.navigation">
    <a data-pe-attr-href="$.url" href="/contact" data-pe-text="$.title">Contact</a>
  </li>
</ul>
```

## One-time Bindings

For content that will not need to update or change after it is generated once, pe offers the `data-pe-once` attribute. When this attribute is present, pe will remove the attribute instructions for the output HTML, so the element will receive no further updates. This is helpful for minimizing the performance toll of observing large data structures throughout a page.

Here's an example.

Data Source:
```js
const user = {name: "Scott", id: "12345"}
```

Server
```html
<h1 data-pe="data.user" data-pe-once>Hey there, <span data-pe-text="$.name"></span></h1>
```

HTML Output:
```html
<h1>Hey there, <span>Scott</span></h1>
```

Note: For simplicity sake, `data-pe-once` applies not only to the element with the attribute, but also to all of that element's children, even if those children are bound to different properties than the parent.


### Running pe in the Browser

In order to establish a data binding relationship on the client-side for dynamic updates, the HTML needs to contain the referenced data source and pe.js library, which can be added to the HTML as a whole, or ideally, within a scope of say, a web component.

It currently looks like this: 

```js
// get the PE lib
import pe from './pe.js';

// get the json that was used to populate the markup in the first place
const store = JSON.parse('{"title":"Here is a title","listitems":[{"text":"this is the first item"},{"text":"this is the second item"}]}');

// pass it to a new PE instance
const PE = new pe(store, "store");

// make updates and see the HTML update
store.listitems[1].text = "Hey";
```

[This very basic demo](https://pe-1xm.pages.dev) shows that in action.


### Running pe on the Server

pe.js could be run in a JavaScript function on a server-side running Node.js, perhaps like this, but this part remains TBD:

```js
import pe from './pe.js';
import data from './data.js';
import template from './template.html';

export default {
  async fetch(request) {
    const html = pe(template, data);
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
```

## Serving pe HTML with any server language

Because the templating output of pe is also a template, pe gives you the flexibility to use any server templating language you prefer and still run pe.js in the browser. You might even choose to use no templating language at all, manually marking up certain elements that will be dynamic and data bound on the client-side. 

As an example, say you want to use regular old PHP to output your HTML on the server. That's fine. Just keep the attributes in place wherever you want relationships to be retained on the clientside:

```php
<?php echo '<h1 data-bind-text="data.title">' . $data->title . '</h1>'; ?>
```

...or a JavaScript literal:
```js
let html = `<h1 data-bind-text="data.title">${data.title}</h1>`
```

The client-side doesn't care how the initial HTML was generated. It only cares about keeping the HTML in sync with data wherever you tell it to do so.


## Caveats and Considerations

- First, pe.js doesn't really exist yet! Sorry. I'm playing with ideas in [in development](demo/pe.js)
- Second, `text` binding works best when setting the entire inner content of an element. This means that in situations where you might be used to using a variable mid-string, like `hello, {{user.name}}!`, you'll likely want to use a wrapper element to isolate that variable's output instead, like this: `hello, <span data-pe-text="user.name"></span>!`


## More soon! -Scott :)








