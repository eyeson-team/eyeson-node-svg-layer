const fsPromise = require('node:fs/promises');

/**
 * @typedef {'start'|'middle'|'end'} TextAnchor
 * @typedef {'top left'|'top center'|'top right'|'center left'|'center'|'center right'|'bottom left'|'bottom center'|'bottom right'} BoxOrigin
 */

/**
 * Class SvgLayerObject
 */
class SvgLayerObject {
  constructor(type) {
    this.type = type;
  }
  /**
   * 
   * @param {SvgLayerFilter} filter
   * @param {'text'|'box'|null} [type] - if type is null, filter is set to all items
   * @returns {SvgLayerObject}
   */
  setFilter(filter, type = null) {
    if (!(filter instanceof SvgLayerFilter)) {
      throw new Error('Invalid filter');
    }
    if (type) {
      this[`filter${ucfirst(type)}`] = filter;
    } else {
      this.filter = filter;
    }
    return this;
  }
}

/**
 * Class gradient
 */
class SvgLayerGradient {
  constructor(type) {
    this.id = randomId(6);
    this.type = type;
  }
}

/**
 * Class Filter
 */
class SvgLayerFilter {
  constructor(type) {
    this.id = randomId(6);
    this.type = type;
  }
}

/**
 * Class EyesonSvgLayer
 */
class EyesonSvgLayer {

  /**
   * @typedef {object} SvgLayerOptions
   * @prop {boolean} [widescreen] - widescreen, default: true
   */

  /**
   * @param {SvgLayerOptions} [options]
   */
  constructor(options = {}) {
    options.widescreen = options.widescreen ?? true;
    this.options = options;
    this._defs = [];
    this._objects = [];
    this.width = 1280;
    this.height = options.widescreen ? 720 : 960;
  }

  /**
   * Measure text width
   * @param {string} text
   * @param {number} fontSize - font size in pixels
   * @param {boolean} bold
   * @returns {number} text width in pixels
   */
  measureText(text, fontSize, bold) {
    return measureText(text, fontSize, bold);
  }

  /**
   * Create a linear gradient
   * @param {number} deg - rotation angle
   * @param  {...string} colorStops - a sequence of color stops like '20% grey' or '20% #ccc 0.8'
   * @returns {SvgLayerGradient}
   * @throws {Error} - no color stop
   */
  createLinearGradient(deg, ...colorStops) {
    if (colorStops.length < 1) {
      throw new Error('Gradient must have at least 1 color stop');
    }
    const gradient = Object.assign(new SvgLayerGradient('linear-gradient'), { deg, colorStops });
    this._defs.push(gradient);
    return gradient;
  }

  /**
   * Create a radial gradient
   * @param  {...string} colorStops - a sequence of color stops like '20% grey' or '20% #ccc 0.8'
   * @returns {SvgLayerGradient}
   * @throws {Error} - no color stop
   */
  createRadialGradient(...colorStops) {
    if (colorStops.length < 1) {
      throw new Error('Gradient must have at least 1 color stop');
    }
    const gradient = Object.assign(new SvgLayerGradient('radial-gradient'), { colorStops });
    this._defs.push(gradient);
    return gradient;
  }

  /**
   * Create a blur filter
   * @param {number} stdDeviation - blur radius in pixels
   * @param {string|null} [input] - see: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/in
   * @returns {SvgLayerFilter}
   */
  createBlurFilter(stdDeviation, input = null) {
    const filter = Object.assign(new SvgLayerFilter('blur-filter'), { stdDeviation, input });
    this._defs.push(filter);
    return filter;
  }

  /**
   * Create drop shadow filter
   * @param {number} dx - x offset
   * @param {number} dy - y offset
   * @param {number} stdDeviation - blur radius
   * @param {string} [color] - 'black' or with opacity 'black 50%', default 'black'
   * @returns {SvgLayerFilter}
   */
  createDropShadowFilter(dx, dy, stdDeviation, color = 'black') {
    let opacity = 1;
    if (typeof color === 'string' && / /.test(color)) {
      const split = color.split(' ');
      color = split[0];
      if (/\d+%$/.test(split[1])) {
        opacity = parseFloat(split[1]) / 100;
      } else {
        opacity = parseFloat(split[1]);
      }
    }
    const filter = Object.assign(new SvgLayerFilter('drop-shadow-filter'), { dx, dy, stdDeviation, color, opacity });
    this._defs.push(filter);
    return filter;
  }

  /**
   * Add text
   * @param {string} text 
   * @param {number} fontSize in pixels
   * @param {boolean} bold 
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @param {number} x 
   * @param {number} y 
   * @param {TextAnchor} [textAnchor] default is start
   * @param {number|null} [maxWidth] 
   * @returns {SvgLayerObject}
   */
  addText(text, fontSize, bold, color, x, y, textAnchor = 'start', maxWidth = null) {
    const entry = Object.assign(new SvgLayerObject('text'), { text, fontSize, bold, color, x, y, textAnchor, maxWidth });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add multiline text. It breaks at "width" or '\n'
   * @param {string} text 
   * @param {number} fontSize - in pixels
   * @param {boolean} bold 
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number|null} maxHeight - null means auto height
   * @param {number} lineHeight 
   * @param {TextAnchor} textAnchor 
   * @returns {SvgLayerObject}
   */
  addMultilineText(text, fontSize, bold, color, x, y, width, maxHeight, lineHeight, textAnchor = 'start') {
    const entry = Object.assign(new SvgLayerObject('multiline'), { text, fontSize, bold, color, x, y, width, maxHeight, lineHeight, textAnchor });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add filled rectangle
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   * @param {number} radius - border radius, default 0
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @returns {SvgLayerObject}
   */
  addRect(x, y, width, height, radius = 0, color) {
    const entry = Object.assign(new SvgLayerObject('rect'), { x, y, width, height, radius, color });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add a stroked rectangle
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   * @param {number} lineWidth - default 1
   * @param {number} radius - border radius, default 0
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @returns {SvgLayerObject}
   */
  addRectOutline(x, y, width, height, lineWidth = 1, radius = 0, color) {
    const entry = Object.assign(new SvgLayerObject('rect-outline'), { x, y, width, height, lineWidth, radius, color });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add a filled circle
   * @param {number} x 
   * @param {number} y 
   * @param {number} radius
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @returns {SvgLayerObject}
   */
  addCircle(x, y, radius, color) {
    const entry = Object.assign(new SvgLayerObject('circle'), { x, y, radius, color });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add a stroked circle
   * @param {number} x 
   * @param {number} y 
   * @param {number} radius
   * @param {number} lineWidth - default 1
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @returns {SvgLayerObject}
   */
  addCircleOutline(x, y, radius, lineWidth = 1, color) {
    const entry = Object.assign(new SvgLayerObject('circle-outline'), { x, y, radius, lineWidth, color });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add a line
   * @param {number} x1 
   * @param {number} y1 
   * @param {number} x2 
   * @param {number} y2 
   * @param {number} lineWidth - default 1
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @returns {SvgLayerObject}
   */
  addLine(x1, y1, x2, y2, lineWidth = 1, color) {
    const entry = Object.assign(new SvgLayerObject('line'), { x1, y1, x2, y2, lineWidth, color });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add a filled polygon
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @param  {...number} points - a sequence of x, y point coordinates. minimum 3 points
   * @returns {SvgLayerObject}
   * @throws {Error} - Even number of poins and at least 3 choordinates
   */
  addPolygon(color, ...points) {
    if (points.length % 2 !== 0) {
      throw new Error('Number of points must be even');
    }
    if (points.length < 6) {
      throw new Error('Polygon must at least have 3 choordinates');
    }
    const entry = Object.assign(new SvgLayerObject('polygon'), { color, points });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add a stroked polygon
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @param  {number} lineWidth - default 1
   * @param  {...number} points - a sequence of x, y point coordinates. minimum 3 points
   * @returns {SvgLayerObject}
   * @throws {Error} - Even number of poins and at least 3 choordinates
   */
  addPolygonOutline(color, lineWidth = 1, ...points) {
    if (points.length % 2 !== 0) {
      throw new Error('Number of points must be even');
    }
    if (points.length < 6) {
      throw new Error('Polygon must at least have 3 choordinates');
    }
    const entry = Object.assign(new SvgLayerObject('polygon-outline'), { color, lineWidth, points });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add text on a filled box
   * @param {string} text
   * @param {number} fontSize
   * @param {boolean} bold
   * @param {string|SvgLayerGradient} fontColor - 'black' or with opacity 'black 50%'
   * @param {number} x
   * @param {number} y
   * @param {BoxOrigin} origin - Origin of x, y, default "top left"
   * @param {number|Array<number>} padding - One number for all sides or array of numbers, supports 1, 2, 3, or 4 value notation. default 0
   * @param {number|null} maxWidth - default null
   * @param {number} radius - border radius, default 0
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @returns {SvgLayerObject}
   */
  addTextBox(text, fontSize, bold, fontColor, x, y, origin = 'top left', padding = 0, maxWidth = null, radius = 0, color) {
    const entry = Object.assign(new SvgLayerObject('text-box'), { text, fontSize, bold, fontColor, x, y, origin, padding, maxWidth, radius, color });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add text on a stroked box
   * @param {string} text
   * @param {number} fontSize
   * @param {boolean} bold
   * @param {string|SvgLayerGradient} fontColor - 'black' or with opacity 'black 50%'
   * @param {number} x
   * @param {number} y
   * @param {BoxOrigin} origin - Origin of x, y, default "top left"
   * @param {number|Array<number>} padding - One number for all sides or array of numbers, supports 1, 2, 3, or 4 value notation. default 0
   * @param {number|null} maxWidth - default null
   * @param {number} radius - border radius, default 0
   * @param {number} lineWidth - default 1
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @returns {SvgLayerObject}
   */
  addTextBoxOutline(text, fontSize, bold, fontColor, x, y, origin = 'top left', padding = 0, maxWidth = null, radius = 0, lineWidth = 1, color) {
    const entry = Object.assign(new SvgLayerObject('text-box-outline'), { text, fontSize, bold, fontColor, x, y, origin, padding, maxWidth, radius, lineWidth, color });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add a filled rectangle with non-exeeding multiline text
   * @param {string} text
   * @param {number} fontSize
   * @param {boolean} bold
   * @param {string|SvgLayerGradient} fontColor - 'black' or with opacity 'black 50%'
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number|null} maxHeight - null means auto height
   * @param {number|Array<number>} padding - One number for all sides or array of numbers, supports 1, 2, 3, or 4 value notation. default 0
   * @param {number} lineHeight
   * @param {number} radius - default 0
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @param {TextAnchor} [textAnchor] - default "start"
   * @returns {SvgLayerObject}
   */
  addMultilineTextBox(text, fontSize, bold, fontColor, x, y, width, maxHeight, padding = 0, lineHeight, radius = 0, color, textAnchor = 'start') {
    const entry = Object.assign(new SvgLayerObject('multiline-box'), { text, fontSize, bold, fontColor, x, y, width, maxHeight, padding, lineHeight, radius, color, textAnchor });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Add a stroked rectangle with non-exeeding multiline text
   * @param {string} text
   * @param {number} fontSize
   * @param {boolean} bold
   * @param {string|SvgLayerGradient} fontColor - 'black' or with opacity 'black 50%'
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number|null} maxHeight - null means auto height
   * @param {number|Array<number>} padding - One number for all sides or array of numbers, supports 1, 2, 3, or 4 value notation. default 0
   * @param {number} lineHeight
   * @param {number} radius - default 0
   * @param {number} lineWidth - default 1
   * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
   * @param {TextAnchor} [textAnchor] - default "start"
   * @returns {SvgLayerObject}
   */
  addMultilineTextBoxOutline(text, fontSize, bold, fontColor, x, y, width, maxHeight, padding = 0, lineHeight, radius = 0, lineWidth = 1, color, textAnchor = 'start') {
    const entry = Object.assign(new SvgLayerObject('multiline-box-outline'), { text, fontSize, bold, fontColor, x, y, width, maxHeight, padding, lineHeight, radius, lineWidth, color, textAnchor });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Read image file and convert it to base64 Data URI
   * @param {string} path - Path to image file
   * @param {string} [mimeType] - Declare mimeType, if image file extension does not match the image MIME
   * @returns 
   */
  async imageToBase64(path, mimeType = null) {
    // https://www.codu.co/articles/converting-an-image-to-a-data-uri-string-in-node-js-dznt83ha
    const ext = path.split('.').pop();
    const data = await fsPromise.readFile(path, { encoding: 'base64' });
    const mime = mimeType ?? `image/${ext}`;
    const uri = `data:${mime};base64,${data}`;
    return uri;
  }

  /**
   * Add image as data URL
   * @param {string} dataUrl - data:image/..., see: https://en.wikipedia.org/wiki/Data_URI_scheme
   * @param {number} x
   * @param {number} y
   * @param {number|null} [width] - width of image if null
   * @param {number|null} [height] - height of image if null
   * @param {number|null} [opacity] - opacity
   * @returns {SvgLayerObject}
   * @throws {Error} Invalid data url
   */
  addImage(dataUrl, x, y, width = null, height = null, opacity = null) {
    if (!/^data:image\/[^,]+,.+/.test(dataUrl)) {
      throw new Error('Invalid data url');
    }
    const entry = Object.assign(new SvgLayerObject('image'), { dataUrl, x, y, width, height, opacity });
    this._objects.push(entry);
    return entry;
  }

  /**
   * Clear layer objects to re-use a clean svg
   */
  clear() {
    this._defs.length = 0;
    this._objects.length = 0;
  }

  /**
   * Create the SVG from all items
   * @returns {string} SVG
   */
  createSVG() {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" font-family="DejaVu Sans,sans-serif">`;
    let defs = '';
    this._defs.forEach((entry) => {
      const { type } = entry;
      if (type === 'linear-gradient') {
        defs += `<linearGradient id="${entry.id}"${addIfTrue(entry.deg > 0, 'gradientTransform', `rotate(${entry.deg})`)}>${createColorStops(entry.colorStops)}</linearGradient>`;
      } else if (type === 'radial-gradient') {
        defs += `<radialGradient id="${entry.id}">${createColorStops(entry.colorStops)}</radialGradient>`;
      } else if (type === 'drop-shadow-filter') {
        defs += `<filter id="${entry.id}"><feDropShadow dx="${entry.dx}" dy="${entry.dy}" stdDeviation="${entry.stdDeviation}"${addIfTrue(entry.opacity !== 1, 'flood-opacity', entry.opacity)}${addIfTrue(entry.color !== 'black', 'flood-color', entry.color)} /></filter>`;
      } else if (type === 'blur-filter') {
        defs += `<filter id="${entry.id}"><feGaussianBlur stdDeviation="${entry.stdDeviation}"${addIfTrue(entry.input !== null, 'in', entry.input)} /></filter>`;
      }
    });
    if (defs) {
      svg += `<defs>${defs}</defs>`;
    }
    this._objects.forEach((entry) => {
      const { type } = entry;
      if (type === 'text') {
        svg += `<text x="${entry.x}" y="${entry.y}" font-size="${entry.fontSize}"${addIfTrue(entry.bold, 'font-weight', 'bold')} ${colorOrGradient('fill', entry.color)}${addIfTrue(entry.maxWidth !== null, 'textLength', entry.maxWidth)} dominant-baseline="hanging"${addIfTrue(entry.textAnchor !== 'start', 'text-anchor', entry.textAnchor)}${addFilterIfExist(entry.filter)}>${entry.text}</text>`;
      } else if (type === 'rect') {
        svg += `<rect x="${entry.x}" y="${entry.y}" width="${entry.width}" height="${entry.height}"${addIfTrue(entry.radius !== 0, 'rx', entry.radius)} ${colorOrGradient('fill', entry.color)}${addFilterIfExist(entry.filter)} />`;
      } else if (type === 'rect-outline') {
        svg += `<rect x="${entry.x}" y="${entry.y}" width="${entry.width}" height="${entry.height}"${addIfTrue(entry.radius !== 0, 'rx', entry.radius)} ${colorOrGradient('stroke', entry.color)} stroke-width="${entry.lineWidth}" fill="none"${addFilterIfExist(entry.filter)} />`;
      } else if (type === 'circle') {
        svg += `<circle cx="${entry.x}" cy="${entry.y}" r="${entry.radius}" ${colorOrGradient('fill', entry.color)}${addFilterIfExist(entry.filter)} />`;
      } else if (type === 'circle-outline') {
        svg += `<circle cx="${entry.x}" cy="${entry.y}" r="${entry.radius}" ${colorOrGradient('stroke', entry.color)} stroke-width="${entry.lineWidth}" fill="none"${addFilterIfExist(entry.filter)} />`;
      } else if (type === 'image') {
        svg += `<image x="${entry.x}" y="${entry.y}"${addIfTrue(entry.width !== null, 'width', entry.width)}${addIfTrue(entry.height !== null, 'height', entry.height)}${addIfTrue(entry.opacity !== null, 'opacity', entry.opacity)} href="${entry.dataUrl}"${addFilterIfExist(entry.filter)} />`;
      } else if (type === 'polygon') {
        svg += `<polygon points="${createPathFromPoints(entry.points)}" ${colorOrGradient('fill', entry.color)}${addFilterIfExist(entry.filter)} />`;
      } else if (type === 'polygon-outline') {
        svg += `<polygon points="${createPathFromPoints(entry.points)}" ${colorOrGradient('stroke', entry.color)} stroke-width="${entry.lineWidth}" fill="none"${addFilterIfExist(entry.filter)} />`;
      } else if (type === 'line') {
        svg += `<line x1="${entry.x1}" y1="${entry.y1}" x2="${entry.x2}" y2="${entry.y2}" ${colorOrGradient('stroke', entry.color)} stroke-width="${entry.lineWidth}"${addFilterIfExist(entry.filter)} />`;
      } else if (type === 'multiline') {
        const lines = getLines(entry.text, entry.width, entry.fontSize, entry.bold);
        if (entry.maxHeight !== null) {
          const maxLines = Math.floor(entry.maxHeight / entry.lineHeight);
          if (lines.length > maxLines) {
            lines.length = maxLines;
          }
        }
        const xText = parseTextAlign(entry.textAnchor, entry.x, entry.width);
        svg += createMultilineText(lines, xText, entry.y, entry.fontSize, entry.bold, entry.color, entry.textAnchor, entry.lineHeight, entry.filter);
      } else if (type === 'multiline-box') {
        const [paddingTop, paddingRight, paddingBottom, paddingLeft] = parsePadding(entry.padding);
        const xText = parseTextAlign(entry.textAnchor, entry.x, entry.width - paddingLeft - paddingRight);
        const maxTextWidth = entry.width - paddingLeft - paddingRight;
        const textX = xText + paddingLeft;
        const textY = entry.y + paddingTop + 1;
        const lines = getLines(entry.text, maxTextWidth, entry.fontSize, entry.bold);
        if (entry.maxHeight !== null) {
          const maxTextHeight = entry.maxHeight - paddingTop - paddingBottom;
          const maxLines = Math.floor(maxTextHeight / entry.lineHeight);
          if (lines.length > maxLines) {
            lines.length = maxLines;
          }
        }
        const boxFilter = entry.filterBox || entry.filter;
        const textFilter = entry.filterText || entry.filter;
        const totalHeight = entry.maxHeight !== null ? entry.maxHeight : lines.length * entry.lineHeight + paddingTop + paddingBottom - (entry.lineHeight - entry.fontSize);
        svg += `<rect x="${entry.x}" y="${entry.y}" width="${entry.width}" height="${totalHeight}"${addIfTrue(entry.radius !== 0, 'rx', entry.radius)} ${colorOrGradient('fill', entry.color)}${addFilterIfExist(boxFilter)} />`;
        svg += createMultilineText(lines, textX, textY, entry.fontSize, entry.bold, entry.fontColor, entry.textAnchor, entry.lineHeight, textFilter);
      } else if (type === 'multiline-box-outline') {
        const [paddingTop, paddingRight, paddingBottom, paddingLeft] = parsePadding(entry.padding);
        const xText = parseTextAlign(entry.textAnchor, entry.x, entry.width - paddingLeft - paddingRight);
        const maxTextWidth = entry.width - paddingLeft - paddingRight;
        const textX = xText + paddingLeft;
        const textY = entry.y + paddingTop + 1;
        const lines = getLines(entry.text, maxTextWidth, entry.fontSize, entry.bold);
        if (entry.maxHeight !== null) {
          const maxTextHeight = entry.maxHeight - paddingTop - paddingBottom;
          const maxLines = Math.floor(maxTextHeight / entry.lineHeight);
          if (lines.length > maxLines) {
            lines.length = maxLines;
          }
        }
        const boxFilter = entry.filterBox || entry.filter;
        const textFilter = entry.filterText || entry.filter;
        const totalHeight = entry.maxHeight !== null ? entry.maxHeight : lines.length * entry.lineHeight + paddingTop + paddingBottom - (entry.lineHeight - entry.fontSize);
        svg += `<rect x="${entry.x}" y="${entry.y}" width="${entry.width}" height="${totalHeight}"${addIfTrue(entry.radius !== 0, 'rx', entry.radius)} ${colorOrGradient('stroke', entry.color)} stroke-width="${entry.lineWidth}" fill="none"${addFilterIfExist(boxFilter)} />`;
        svg += createMultilineText(lines, textX, textY, entry.fontSize, entry.bold, entry.fontColor, entry.textAnchor, entry.lineHeight, textFilter);
      } else if (type === 'text-box') {
        const [paddingTop, paddingRight, paddingBottom, paddingLeft] = parsePadding(entry.padding);
        const textSize = measureText(entry.text, entry.fontSize, entry.bold);
        const width = entry.maxWidth ? Math.min(textSize + paddingLeft + paddingRight, entry.maxWidth) : textSize + paddingLeft + paddingRight;
        const height = entry.fontSize + paddingTop + paddingBottom;
        const [xBox, yBox, xText, yText] = parseOrigin(entry.origin.trim(), entry.x, entry.y, paddingLeft, paddingTop, width, height);
        const boxFilter = entry.filterBox || entry.filter;
        const textFilter = entry.filterText || entry.filter;
        svg += `<rect x="${xBox}" y="${yBox}" width="${width}" height="${height}"${addIfTrue(entry.radius !== 0, 'rx', entry.radius)} ${colorOrGradient('fill', entry.color)}${addFilterIfExist(boxFilter)} />`;
        svg += `<text x="${xText}" y="${yText + 1}" font-size="${entry.fontSize}"${addIfTrue(entry.bold, 'font-weight', 'bold')} ${colorOrGradient('fill', entry.fontColor)} textLength="${width - paddingLeft - paddingRight}" dominant-baseline="hanging"${addFilterIfExist(textFilter)}>${entry.text}</text>`;
      }
    });
    svg += '</svg>';
    return svg;
  }

  /**
   * Write SVG to image file for testing
   * @param {string} path - write file destination path
   * @returns {Promise}
   */
  async writeFile(path) {
    const svg = this.createSVG();
    await fsPromise.writeFile(path, svg);
  }

  // async setLayer(accessKey, zIndex = 1, origin = 'https://api.eyeson.team') {
  //   const svg = this.createSVG();
  //   const blob = new Blob([svg], { type: 'image/svg+xml' });
  //   const formData = new FormData();
  //   formData.set('file', blob, 'blob');
  //   formData.set('z-index', zIndex);
  //   const response = await fetch(`${origin}/rooms/${accessKey}/layers`, { method: 'POST', body: formData });
  //   if (!response.ok) {
  //     throw new Error(`Invalid request ${response.status}`);
  //   }
  //   return true;
  // }
}

const addIfTrue = (condition, param, value) => {
  if (condition) {
    return ` ${param}="${value}"`;
  }
  return '';
};

const addFilterIfExist = (filter) => {
  if (filter && filter instanceof SvgLayerFilter) {
    return ` filter="url(#${filter.id})"`;
  }
  return '';
};

const createPathFromPoints = (points) => {
  let path = `${points[0]},${points[1]}`;
  for (let i = 2; i < points.length; i += 2) {
    path += ` ${points[i]},${points[i + 1]}`;
  }
  return path;
};

const createColorStops = (stops) => {
  let result = '';
  for (let i = 0; i < stops.length; i++) {
    const entry = stops[i].split(' ');
    result += `<stop offset="${entry[0]}" stop-color="${entry[1]}"${addIfTrue(entry.length > 2, 'stop-opacity', entry[2])} />`;
  }
  return result;
};

const colorOrGradient = (operation, entry) => {
  if (entry instanceof SvgLayerGradient) {
    return `${operation}="url(#${entry.id})"`;
  }
  if (typeof entry === 'string' && / /.test(entry)) {
    const [color, opacity] = entry.split(' ');
    return `${operation}="${color}" ${operation}-opacity="${opacity}"`;
  }
  return `${operation}="${entry}"`;
};

const createMultilineText = (lines, x, y, fontSize, bold, color, textAnchor, lineHeight, filter) => {
  let svg = `<text x="${x}" y="${y}" font-size="${fontSize}"${addIfTrue(bold, 'font-weight', 'bold')} ${colorOrGradient('fill', color)} dominant-baseline="hanging"${addIfTrue(textAnchor !== 'start', 'text-anchor', textAnchor)}${addFilterIfExist(filter)}>`;
  let empty = 1;
  lines.forEach((line, index) => {
    if (!line) {
      empty++;
      return;
    }
    svg += `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight * empty}">${line}</tspan>`;
    if (empty > 1) {
      empty = 1;
    }
  });
  svg += '</text>';
  return svg;
};

const parsePadding = (padding) => {
  let top = 0;
  let right = 0;
  let bottom = 0;
  let left = 0;
  if (typeof padding === 'string') {
    padding = padding.trim().split(/\s+/).map(Number);
  }
  if (Array.isArray(padding)) {
    if (padding.length === 1) {
      top = right = bottom = left = padding[0];
    } else if (padding.length === 2) {
      top = bottom = padding[0];
      right = left = padding[1];
    } else if (padding.length === 3) {
      top = padding[0];
      right = left = padding[1];
      bottom = padding[2];
    } else if (padding.length >= 4) {
      top = padding[0];
      right = padding[1];
      bottom = padding[2];
      left = padding[3];
    }
  }
  if (typeof padding === 'number') {
    top = right = bottom = left = padding;
  }
  return [top, right, bottom, left];
};

const parseOrigin = (origin, x, y, paddingLeft, paddingTop, width, height) => {
  let xBox = x;
  let yBox = y;
  let xText = x + paddingLeft;
  let yText = y + paddingTop;
  if (typeof origin === 'string') {
    if (origin.includes('right')) {
      xBox = x - width;
      xText = xBox + paddingLeft;
    }
    if (origin.endsWith('center')) {
      xBox = x - width / 2;
      xText = xBox + paddingLeft;
    }
    if (origin.includes('bottom')) {
      yBox = y - height;
      yText = yBox + paddingTop;
    }
    if (origin.startsWith('center')) {
      yBox = y - height / 2;
      yText = yBox + paddingTop;
    }
  }
  return [xBox, yBox, xText, yText];
};

const parseTextAlign = (textAlign, x, width) => {
  let left = x;
  if (textAlign === 'right' || textAlign === 'end') {
    left = x + width;
  }
  if (textAlign === 'center' || textAlign === 'middle') {
    left = x + width / 2;
  }
  return left;
};

// https://youmightnotneed.com/lodash#deburr
const deburr = (str) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '');

const _widthsMap = {
  0: [50, 50],
  1: [50, 50],
  2: [50, 50],
  3: [50, 50],
  4: [50, 50],
  5: [50, 50],
  6: [50, 50],
  7: [50, 50],
  8: [50, 50],
  9: [50, 50],
  ' ': [25, 25],
  '!': [33.3046875, 33.3046875],
  '"': [40.8203125, 55.5234375],
  '#': [50, 50],
  $: [50, 50],
  '%': [83.3046875, 100],
  '&': [77.7890625, 83.3046875],
  "'": [18.0234375, 27.7890625],
  '(': [33.3046875, 33.3046875],
  ')': [33.3046875, 33.3046875],
  '*': [50, 50],
  '+': [56.3984375, 56.984375],
  ',': [25, 25],
  '-': [33.3046875, 33.3046875],
  '.': [25, 25],
  '/': [27.7890625, 27.7890625],
  ':': [27.7890625, 33.3046875],
  ';': [27.7890625, 33.3046875],
  '<': [56.3984375, 56.984375],
  '=': [56.3984375, 56.984375],
  '>': [56.3984375, 56.984375],
  '?': [44.390625, 50],
  '@': [92.09375, 93.0234375],
  A: [72.21875, 72.21875],
  B: [66.703125, 66.703125],
  C: [66.703125, 72.21875],
  D: [72.21875, 72.21875],
  E: [61.0859375, 66.703125],
  F: [55.6171875, 61.0859375],
  G: [72.21875, 77.7890625],
  H: [72.21875, 77.7890625],
  I: [33.3046875, 38.921875],
  J: [38.921875, 50],
  K: [72.21875, 77.7890625],
  L: [61.0859375, 66.703125],
  M: [88.921875, 94.390625],
  N: [72.21875, 72.21875],
  O: [72.21875, 77.7890625],
  P: [55.6171875, 61.0859375],
  Q: [72.21875, 77.7890625],
  R: [66.703125, 72.21875],
  S: [55.6171875, 55.6171875],
  T: [61.0859375, 66.703125],
  U: [72.21875, 72.21875],
  V: [72.21875, 72.21875],
  W: [94.390625, 100],
  X: [72.21875, 72.21875],
  Y: [72.21875, 72.21875],
  Z: [61.0859375, 66.703125],
  '[': [33.3046875, 33.3046875],
  '\\': [27.7890625, 27.7890625],
  ']': [33.3046875, 33.3046875],
  '^': [46.9296875, 58.109375],
  _: [50, 50],
  '`': [33.3046875, 33.3046875],
  a: [44.390625, 50],
  b: [50, 55.6171875],
  c: [44.390625, 44.390625],
  d: [50, 55.6171875],
  e: [44.390625, 44.390625],
  f: [33.3046875, 33.3046875],
  g: [50, 50],
  h: [50, 55.6171875],
  i: [27.7890625, 27.7890625],
  j: [27.7890625, 33.3046875],
  k: [50, 55.6171875],
  l: [27.7890625, 27.7890625],
  m: [77.7890625, 83.3046875],
  n: [50, 55.6171875],
  o: [50, 50],
  p: [50, 55.6171875],
  q: [50, 55.6171875],
  r: [33.3046875, 44.390625],
  s: [38.921875, 38.921875],
  t: [27.7890625, 33.3046875],
  u: [50, 55.6171875],
  v: [50, 50],
  w: [72.21875, 72.21875],
  x: [50, 50],
  y: [50, 50],
  z: [44.390625, 44.390625],
  '{': [48, 39.40625],
  '|': [20.0234375, 22.0234375],
  '}': [48, 39.40625],
  '~': [54.1015625, 52.0078125],
};

// https://medium.com/@adambisek/text-pixel-width-measuring-on-javascript-backend-node-js-2b82bea97fab#.8ypyiffyw
// https://github.com/adambisek/string-pixel-width
const measureText = (string, fontSize, bold = false) => {
  let totalWidth = 0;
  const index = bold ? 1 : 0;
  deburr(string)
    .split('')
    .forEach((char) => {
      // eslint-disable-next-line no-control-regex
      if (/[\x00-\x1F]/.test(char)) {
        // non-printable character
        return true;
      }
      const width = (_widthsMap[char] || _widthsMap.x)[index];
      totalWidth += width;
      return true;
    });
  return totalWidth * (fontSize / (bold ? 75 : 80));
};

const _safety = 10;
const getLines = (text, width, fontSize, bold = false) => {
  const lines = text.split(/\r?\n/);
  let textLines = [];
  for (let line = 0; line < lines.length; line++) {
    const words = lines[line].trim().split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const lineWidth = measureText(testLine, fontSize, bold);
      if (lineWidth > width - _safety && currentLine !== '') {
        textLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine || (line > 0 && line < lines.length)) {
      textLines.push(currentLine);
    }
  }
  return textLines;
};

const alphabet = '_-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const randomId = (size) => {
  let result = '';
  const random = crypto.getRandomValues(new Uint8Array(size));
  for (let index = 0; index < size; index++) {
    result += alphabet[63 & random[index]];
  }
  return result;
};

const ucfirst = (word) => word.charAt(0).toUpperCase() + word.slice(1);

module.exports = EyesonSvgLayer;
