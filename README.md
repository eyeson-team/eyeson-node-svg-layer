# eyeson-node-svg-layer JavaScript SVG Layer creation plugin

A Node.js plugin to define and create overlay or background SVG layer to use with
[eyeson-node](https://github.com/eyeson-team/eyeson-node).

## Installation

Add eyeson-node-svg-layer to your node project using `npm` or `yarn`.

```sh
$ npm install --save eyeson-node eyeson-node-svg-layer
# or
$ yarn add eyeson-node eyeson-node-svg-layer
```

> [!NOTE]
> Minimum required version of eyeson-node is 1.3.3!

## Usage

Get an API-KEY from
[developers.eyeson.team](https://developers.eyeson.team).

```js
import Eyeson from 'eyeson-node';
import EyesonSvgLayer from 'eyeson-node-svg-layer';

const eyeson = new Eyeson({ apiKey: '< api-key >' }); // configure to use your api key
const layer = new EyesonSvgLayer();
// layer.addText etc.
const user = await eyeson.join('< username >');
await user.sendLayer(layer);
```

### Layer creation

You can create and apply foreground or background layers by simply programming
them!

```js
import Eyeson from 'eyeson-node';
import EyesonSvgLayer from 'eyeson-node-svg-layer';

const eyeson = new Eyeson({ apiKey: '< api-key >' }) // configure to use your api key

const overlay = new EyesonSvgLayer()
const fontSize = 16;
const bold = false;
const fontColor = '#fff';

overlay.addTextBox('Martin', fontSize, bold, fontColor, overlay.width / 2, overlay.height / 2, 'bottom right', 10, null, 4, '#000 50%');
overlay.addTextBox('Elisa', fontSize, bold, fontColor, overlay.width, overlay.height / 2, 'bottom right', 10, null, 4, '#000 50%');
overlay.addTextBox('Customer', fontSize, bold, fontColor, overlay.width / 2, overlay.height, 'bottom right', 10, null, 4, '#000 50%');

const gradient = overlay.createLinearGradient(90, '0% #777', '100% #555');
const shadow = overlay.createDropShadowFilter(7, 2, 2, '#555 50%');
overlay.addMultilineTextBox('Agenda:\n \n- Test Eyeson\n- Try Layer\n- One more thing…', fontSize, bold, fontColor, 700, 400, 240, null, 20, lineHeight, 4, gradient, 'middle').setFilter(shadow, 'box');

const user = await eyeson.join(username);
await user.sendLayer(overlay);
```

Save the resulting image as preview:

```js
import EyesonSvgLayer from 'eyeson-node-svg-layer';

const layer = new EyesonSvgLayer();
layer.addText('...');
// ...
await layer.writeFile('./preview.svg');
```

Here's a list of all EyesonSvgLayer methods:

```ts
const layer = new EyesonSvgLayer({ widescreen: true }): EyesonSvgLayer
layer.width, layer.height
const metrics = layer.measureText('text', fontSize, bold): width in pixels
layer.createLinearGradient(degree, ...colorStops): SvgLayerGradient
layer.createRadialGradient(...colorStops): SvgLayerGradient
// Set shadow that is applied to all following elements
layer.createDropShadowFilter(dx, dy, stdDeviation, color): SvgLayerFilter
// Set blur filter that is applied to all following elements
layer.createBlurFilter(radius, input): SvgLayerFilter
// Apply filter to an Item. Items with text and box can have type 'box' or 'text', or no type for all elements.
SvgLayerObject.setFilter(filter: SvgLayerFilter, type): SvgLayerObject
// Add text
layer.addText(text, fontSize, blur, color, x, y, maxWidth = null): SvgLayerObject
// Add multiline text that breaks at the given width and prevent overflow on given height
layer.addMultilineText(text, fontSize, blur, color, x, y, width, maxHeight = null, lineHeight, textAnchor = 'start'): SvgLayerObject
// Add an image. "dataUrl" must be like "data:image/...,...". Set width and height to resize the image
layer.addImage(dataUrl, x, y, width = null, height = null, opacity = null): SvgLayerObject
// Read image file and convert it to base64 Data URI
await layer.imageToBase64(path, mimeType = null);
// Add filled rectangle with border radius
layer.addRect(x, y, width, height, radius = 0, color): SvgLayerObject
// Add stroked rectangle with border radius
layer.addRectOutline(x, y, width, height, lineWidth = 1, radius = 0, color): SvgLayerObject
// Add filled circle
layer.addCircle(x, y, radius, color): SvgLayerObject
// Add stroked circle
layer.addCircleOutline(x, y, radius, lineWidth = 1, color): SvgLayerObject
// Add line
layer.addLine(x1, y1, x2, y2, lineWidth = 1, color): SvgLayerObject
// Add a filled polygon. points are alternating x, y coordinates
layer.addPolygon(color, ...points): SvgLayerObject
// Add a stroked polygon. points are alternating x, y coordinates
layer.addPolygonOutline(color, lineWidth = 1, ...points): SvgLayerObject
// Add text with a filled background box
layer.addTextBox(text, fontSize, bold, fontColor, x, y, origin = 'top left', padding = 0, maxWidth = null, radius = 0, color): SvgLayerObject
// Add text with a stroked box
layer.addTextBoxOutline(text, fontSize, bold, fontColor, x, y, origin = 'top left', padding = 0, maxWidth = null, radius = 0, lineWidth = 1, color): SvgLayerObject
// Add a filled box with multiline text that breaks at the given width and prevent overflow on given height
layer.addMultilineTextBox(text, fontSize, bold, fontColor, x, y, width, maxHeight = null, padding = 0, lineHeight, radius = 0, color, textAnchor = 'start'): SvgLayerObject
// Add a stroked box with multiline text
layer.addMultilineTextBoxOutline(text, fontSize, bold, fontColor, x, y, width, maxHeight = null, padding = 0, lineHeight, radius = 0, lineWidth = 1, color, textAnchor = 'start'): SvgLayerObject
// Clear layer objects to re-use a clean canvas
layer.clear()
// Draw canvas and create the image buffer
layer.createSVG(): String
// Draw canvas and write to local file
await layer.writeFile(path: String): Promise<void>
```

For all methods, `color`, or `fontColor` can be CSS color value, e.g. '#000' or
'black' or a previous generated gradient. Colors can be combined with opacity
like `black 50%` or `#abc 0.2`.

`textAnchor` can be 'start', 'middle', or 'end'.

`origin` can be 'top left', 'top center', 'top right', 'center left', 'center',
'center right', 'bottom left', 'bottom center', or 'bottom right'.

`padding` can be one number for all sides or an array of numbers. It supports
1, 2, 3, or 4 value notation.

All number values are in pixels.

The `SvgLayerObject` is just an object containing `type` and all its settings. It's great for further delta updates.

The SVG is generated with font-family="DejaVu Sans,sans-serif". If DejaVu Sans is installed, the result will be exactly as in the meeting. Otherwise sans-serif is used as fallback which leads to a very similar result.

```js
const user = eyeson.join(...);
const overlay = new EyesonSvgLayer({ widescreen: true });
const timeEntry = overlay.addTextBox(new Date().toLocaleTimeString(), fontSize, bold, fontColor, x, y, origin, padding, maxWidth, radius, backgroundColor);
await user.sendLayer(overlay);
setTimeout(async () => {
    timeEntry.text = new Date().toLocaleTimeString();
    await user.sendLayer(overlay);
}, 60 * 1000); // update time every minute
```

## Development

```sh
$ npm install
$ npm run test -- --watch
$ npm run build
```

## Releases

- 1.0.0 Initial release
