#### What it is

A browser for a web made of Markdown files. It is a pure reading environment: the writer's words, with nothing between them and the reader.

#### What a page is

A page is a Markdown file, fetched by URL.

Any HTML in the file is stripped before rendering.

No CSS. A page can't style itself. The browser decides how it looks.

No JavaScript. A page is just a document to be read, not an app. 

Both HTTP and HTTPS are supported

#### User in control

The content has no power over CSS and JavaScript, but the user has full access to change the appearance, and even automate and add new features. 

#### How a page is identified

The browser sends Accept: text/markdown with every request, so a server can return Markdown to this browser and HTML to others from the same URL.

If the server says the content type is text/markdown, it's a page.

If the server says text/plain or a generic binary type, and the path ends in .md or .markdown, it's a page.

If the server returns anything else, HTML included, the browser shows a 406 page in the window, with a broken-link icon and a tool-tip message saying it can't display this type of content. The same message, with possibly more info, goes to the JavaScript console, in red

#### Scripts

Pages never run scripts.

#### Images

Images are alowed and are included in the page.

Formats: PNG, JPEG, GIF, WebP. No SVG.

The format is determined by the image file's actual content, not its extension.

#### The shell

Markdown inside the shell, around the edges there is an address bar, history and bookmarks menus, and icons in the browser chrome. Icons come from Font Awesome.

Tabs. Each tab holds one page. Clicking a link opens it in the same tab, but if you hold down a command key, to be specified, it opens in a new tab.

#### Replaceable parts

The Markdown interpreter

The shell talks to it through a small defined interface, so a different one can be dropped in.

We use standard open source packages for converting Markdown to HTML, and there will be an API that allows other software to handle the conversion.

Our runtime engine

We build on Electron with a pinned Chromium, used only for display.

We don't update it on Google's schedule, and it can be swapped out later.

#### Source of truth

The source of truth is the web. When a question comes up about how the browser should behave, the answer is what the web does.

