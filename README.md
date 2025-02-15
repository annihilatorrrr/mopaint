# Mopaint

A revolutionary editing system.

#### Prototype

You can play with the work-in-progress app at [mopaint.app](https://mopaint.app)

Features:
- Autosaves locally within the app, including history (Note: if you "clear cookies" in your browser it will likely delete documents autosaved within the app)
- Save/load documents, including history
- Non-destructive (non-linear) history: get back to *any point* in history with the history sidebar, even if you undo and do something else. Instead of discarding redos, it creates a new branch in the *history tree*.
- Some symmetry tools. They're procedurally combined together with the basic drawing tools.

Limitations:
- **The vision for the project is not yet realized.**
- There looks like there's a bunch of tools but there's not actually that much interesting variation. Symmetry tools are combined statically, instead of letting you combine it with whatever you want as a user.
- Many features you'd want in a basic image editor are missing
	- No brush sizes (tho you can try with the "Free-Form Circles" tool(s))
	- No oval tool (only circles)
	- No text tool
	- No zoom (tho you can use your browser's zoom)
	- Can't resize document; it's fixed at 640x480 pixels

#### Other Sketches

- [src/experiments/overlay-on-page.js](src/experiments/overlay-on-page.js): A sketch of an API for embedding a Mopaint document in a webpage, for a use case where you could decorate a web page by drawing shapes that are dynamically constrained to the layout of elements on the page.
- [src/experiments/meta-history.ts](src/experiments/meta-history.ts): An implementation of a meta-history system, where operations can edit other operations within the history. The meta-history is resolved into a linear history. This file contains the code under test as well as tests for it.
- [src/experiments/squash-history.js](src/experiments/squash-history.js): An implementation of history squashing, where a sequence of operations can be replaced with a single operation that has the same effect. Similar to git's `rebase -i` but 1. very basic, 2. in a system where some values may need to be dynamically computed before the squash can occur, since operations can be arbitrary instructions, rather than fixed change sets.
- [src/experiments/net-demo](src/experiments/net-demo): A realtime whiteboard. Networking is one of the most important things to prototype early. It has wide-reaching implications, with asynchrony and efficiency and security and such, and it can also be the basis for features like displaying different views of the same document in separate windows, which shouldn't require a network connection but could use the same communications protocol with a different transport (i.e. `postMessage`, or Electron's IPC) (Such a feature *could* use a network connection, for complete code reuse, in a prototype, but that's not as ideal for privacy and efficiency.)
- [tla/Mopaint.tla](tla/Mopaint.tla): a TLA+ spec. This sort of thing would be more useful when optimizing the system by ensuring that a denormalized version (with caching, incremental updates, etc.) is equivalent to a basic version (that computes everything from scratch). I don't know that I managed to make it "prove" anything meaningful.
- [Mopaint-Format.md](Mopaint-Format.md): A draft of a file format for Mopaint documents, designed for append-only writes (even when upgrading the format version) and embedding binary data.

#### Principles

- Holistic design
	- Do more with less. Less concepts, more functionality.
- Don't Discard Data by Default
	- Only discard information at the user's request, whether by explicit action at the time or preference.
- [Fearless Exploration][]
	- Let users explore fearlessly, both the interface, and paths of work. Reduce worry.

#### Ideas

- Everything is *always saved*, including undo history.
- You can get back to *any state*, with non-destructive (non-linear) undo history. I actually implemented this first in [JS Paint][], my browser-based clone of MS Paint (but in JS Paint the undo history isn't saved in the session, and it's really inefficient. I hope to eventually base JS Paint on Mopaint.)
- Change anything after-the-fact. You don't have to worry about following the exact right steps (like selecting the right layer before drawing), because you can *change the steps*. Edit history as easily as creating it in the first place.
- Support multiple views on a document, in panes as well as in separate windows. (If given the limitations of a web browser, separate windows are separate contexts, but it could work similarly to peer-to-peer multi-user support, just not going thru the network.)
- Preview how changes affect different parts of a document, in panes that show those parts of the document. This would be especially useful for animations or large scenes with copies of objects.
- Instead of having "Smart Objects" and "Smart Filters" (as well as dumb equivalents) as in Photoshop, literally everything is "smart", because the *editing model* is "smart". Every brush stroke is smarter than a Smart Object, when you want it to be (if you want to personify it like that.)
- Instead of having "Clipping Masks", in addition to being able to select a region and delete (for a one-off), you can just do the latter and then "edit earlier" and it'll live-update.
- (There can still be tools/UI that help you set up masks etc., but the document structure will be much more general. Part of the point is that you could do something like that yourself, even something new (it doesn't need to be built-in), and, there isn't a feature that *doesn't* have an equivalent "Smart" feature where you can edit source material and see results live update.)
- Texturing 3D models by drawing directly on them would be fun (like [Chameleon][], [Chameleon.js][], [SculptGL][], [Paint 3D][]).
- If we can do texturing on 3D models, it should be possible to extend that to drawing on tessellated canvases, to create different types of repeating patterns, like [EscherSketch][].
- Everything can be accessible by command (like the ideal of Sublime Text, that it doesn't achieve, instead having some things only accessible in menus), but not just by typing, but by speech input too if you want, with natural language understanding, and that understanding can apply to typed commands as well. It can be conversational, disambiguating and clarifying commands, filling in parameters. Make no mistake of thinking the system should end as a list of commands to select; functions need parameters.
	- Parameters can be answered graphically, with a slider or by selecting or drawing things, or textually (speech/typing).
	- "Draw some trees next to the house... All around it... About fifty... No, that's too many... Make them fir trees."
	- Integrate speech recognition disambiguation (similar sounding words and phrases the computer mixes up) with command disambiguation. Similarly for typo correction and abbreviation expansion ("fuzzy matching").
	- It can show you different options for comparison (using the aforementioned views feature), for you to pick between. Since everything is non-destructive, this can even include previewing arbitrary operations
	- For artistic and exploratory purposes, "surprise me" should be a valid option. In fact I imagine a simple AI that randomly adds to the document, or even modifies the history non-destructively (i.e. creates alternative histories). These modified documents/histories can be thought of as having a similar genome, and could be not just picked between but bread together.

(This is just a handful of ideas; *so many* ideas come out when you flip around the editing model, and think critically about what UI can be...)

#### What is in a name?

What might we stand to gain?

<!-- cspell:disable -->
- **m**obily **o**perable
- **m**ultiuser **o**nline
- **mo**dern
- **mo**dular
- a whole new **m**odus **o**perandi
- **mo**rphing images
- making **mo**ckups
- maybe **mo**saics
- **mo**tion (animation (including **mo**rphing) and physics (including **mo**tors), especially *together*)
- e**mo**tion, maybe some [custom, dynamic e**mo**ji](https://github.com/multiism/emoji)
- maybe 3D **mo**deling (**m**ake **o**bjects **p**retty **a**rtistically **in** **t**his thing)
- but the document **mo**del is the important part
- and **mo**re! it's a **m**assively **o**penended project

Mopaint. More than paint.

Mo' painters, mo' fun! Mopaint.

**m**aking **o**ssum **p**ossum **a**rtistic **i**nterfaces & **n**ovel **t**ools, that's my M.O.

<!-- cspell:enable -->

The file extension could be `.mop`, and it could stand for Mopaint Project,
and/or relate to tools, like a mop (which is sort of like a big brush) -
_Mop - ain't_ that great? :P

#### Development

This project is built with [React](https://reactjs.org/), for now anyway.

I picked it because reactivity is a big part of the vision for the project. That said, I am building a reactivity system with this project, so...
I won't be using React for the reactivity of the core system, and I do have a pipe dream of a fully themeable UI, with brush strokes attached to UI elements, themeable with the app itself.

ESLint is used for linting and formatting code, and cspell is used for spell checking.

Run code quality checks: `npm run lint` (runs eslint and cspell spell checker)

Format code and auto-fix other lint: `npx eslint --fix src/`

Run the development server: `npm start`


[JS Paint]: https://github.com/1j01/jspaint/
[Apparatus]: http://aprt.us/
[Doodal]: https://dood.al/
[Chameleon]: http://www-ui.is.s.u-tokyo.ac.jp/~takeo/chameleon/chameleon.htm
[Chameleon.js]: https://github.com/tomtung/chameleon.js
[Paint 3D]: https://www.microsoft.com/en-us/store/p/paint-3d/9nblggh5fv99
[SculptGL]: https://stephaneginier.com/sculptgl/
[EscherSketch]: https://eschersket.ch/
[Multiism]: https://multiism.ml/
[The Future of Programming]: https://vimeo.com/71278954
[Fearless Exploration]: https://isaiahodhner.io/fearless-exploration
