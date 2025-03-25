declare module "eyeson-node-svg-layer" {
    export = EyesonSvgLayer;
    /**
     * Class EyesonSvgLayer
     */
    class EyesonSvgLayer {
        /**
         * @typedef {object} LayerOptions
         * @prop {boolean} [widescreen] - widescreen, default: true
         */
        /**
         * @param {LayerOptions} [options]
         */
        constructor(options?: {
            /**
             * - widescreen, default: true
             */
            widescreen?: boolean;
        });
        options: {
            /**
             * - widescreen, default: true
             */
            widescreen?: boolean;
        };
        _defs: any[];
        _objects: any[];
        width: number;
        height: number;
        /**
         * Measure text width
         * @param {string} text
         * @param {number} fontSize - font size in pixels
         * @param {boolean} bold
         * @returns {number} text width in pixels
         */
        measureText(text: string, fontSize: number, bold: boolean): number;
        /**
         * Create a linear gradient
         * @param {number} deg - rotation angle
         * @param  {...string} colorStops - a sequence of color stops like '20% grey' or '20% #ccc 0.8'
         * @returns {Gradient}
         * @throws {Error} - no color stop
         */
        createLinearGradient(deg: number, ...colorStops: string[]): Gradient;
        /**
         * Create a radial gradient
         * @param  {...string} colorStops - a sequence of color stops like '20% grey' or '20% #ccc 0.8'
         * @returns {Gradient}
         * @throws {Error} - no color stop
         */
        createRadialGradient(...colorStops: string[]): Gradient;
        /**
         * Create a blur filter
         * @param {number} stdDeviation - blur radius in pixels
         * @param {string|null} [input] - see: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/in
         * @returns {Filter}
         */
        createBlurFilter(stdDeviation: number, input?: string | null): Filter;
        /**
         * Create drop shadow filter
         * @param {number} dx - x offset
         * @param {number} dy - y offset
         * @param {number} stdDeviation - blur radius
         * @param {string} [color] - default 'black'
         * @param {number} [opacity] - default 1
         * @returns {Filter}
         */
        createDropShadowFilter(dx: number, dy: number, stdDeviation: number, color?: string, opacity?: number): Filter;
        /**
         * Add text
         * @param {string} text
         * @param {number} fontSize in pixels
         * @param {boolean} bold
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @param {number} x
         * @param {number} y
         * @param {TextAnchor} [textAnchor] default is start
         * @param {number|null} [maxWidth]
         * @returns {Item}
         */
        addText(text: string, fontSize: number, bold: boolean, color: string | Gradient, x: number, y: number, textAnchor?: TextAnchor, maxWidth?: number | null): Item;
        /**
         * Add multiline text. It breaks at "width" or '\n'
         * @param {string} text
         * @param {number} fontSize - in pixels
         * @param {boolean} bold
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number|null} maxHeight - null means auto height
         * @param {number} lineHeight
         * @param {TextAnchor} textAnchor
         * @returns {Item}
         */
        addMultilineText(text: string, fontSize: number, bold: boolean, color: string | Gradient, x: number, y: number, width: number, maxHeight: number | null, lineHeight: number, textAnchor?: TextAnchor): Item;
        /**
         * Add filled rectangle
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         * @param {number} radius - border radius, default 0
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @returns {Item}
         */
        addRect(x: number, y: number, width: number, height: number, radius: number, color: string | Gradient): Item;
        /**
         * Add a stroked rectangle
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         * @param {number} lineWidth - default 1
         * @param {number} radius - border radius, default 0
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @returns {Item}
         */
        addRectOutline(x: number, y: number, width: number, height: number, lineWidth: number, radius: number, color: string | Gradient): Item;
        /**
         * Add a filled circle
         * @param {number} x
         * @param {number} y
         * @param {number} radius
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @returns {Item}
         */
        addCircle(x: number, y: number, radius: number, color: string | Gradient): Item;
        /**
         * Add a stroked circle
         * @param {number} x
         * @param {number} y
         * @param {number} radius
         * @param {number} lineWidth - default 1
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @returns {Item}
         */
        addCircleOutline(x: number, y: number, radius: number, lineWidth: number, color: string | Gradient): Item;
        /**
         * Add a line
         * @param {number} x1
         * @param {number} y1
         * @param {number} x2
         * @param {number} y2
         * @param {number} lineWidth - default 1
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @returns {Item}
         */
        addLine(x1: number, y1: number, x2: number, y2: number, lineWidth: number, color: string | Gradient): Item;
        /**
         * Add a filled polygon
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @param  {...number} points - a sequence of x, y point coordinates. minimum 3 points
         * @returns {Item}
         * @throws {Error} - Even number of poins and at least 3 choordinates
         */
        addPolygon(color: string | Gradient, ...points: number[]): Item;
        /**
         * Add a stroked polygon
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @param  {number} lineWidth - default 1
         * @param  {...number} points - a sequence of x, y point coordinates. minimum 3 points
         * @returns {Item}
         * @throws {Error} - Even number of poins and at least 3 choordinates
         */
        addPolygonOutline(color: string | Gradient, lineWidth?: number, ...points: number[]): Item;
        /**
         * Add text on a filled box
         * @param {string} text
         * @param {number} fontSize
         * @param {boolean} bold
         * @param {string|Gradient} fontColor - 'black' or with opacity 'black 50%'
         * @param {number} x
         * @param {number} y
         * @param {BoxOrigin} origin - Origin of x, y, default "top left"
         * @param {number|Array<number>} padding - One number for all sides or array of numbers, supports 1, 2, 3, or 4 value notation. default 0
         * @param {number|null} maxWidth - default null
         * @param {number} radius - border radius, default 0
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @returns {Item}
         */
        addTextBox(text: string, fontSize: number, bold: boolean, fontColor: string | Gradient, x: number, y: number, origin: BoxOrigin, padding: number | Array<number>, maxWidth: number | null, radius: number, color: string | Gradient): Item;
        /**
         * Add text on a stroked box
         * @param {string} text
         * @param {number} fontSize
         * @param {boolean} bold
         * @param {string|Gradient} fontColor - 'black' or with opacity 'black 50%'
         * @param {number} x
         * @param {number} y
         * @param {BoxOrigin} origin - Origin of x, y, default "top left"
         * @param {number|Array<number>} padding - One number for all sides or array of numbers, supports 1, 2, 3, or 4 value notation. default 0
         * @param {number|null} maxWidth - default null
         * @param {number} radius - border radius, default 0
         * @param {number} lineWidth - default 1
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @returns {Item}
         */
        addTextBoxOutline(text: string, fontSize: number, bold: boolean, fontColor: string | Gradient, x: number, y: number, origin: BoxOrigin, padding: number | Array<number>, maxWidth: number | null, radius: number, lineWidth: number, color: string | Gradient): Item;
        /**
         * Add a filled rectangle with non-exeeding multiline text
         * @param {string} text
         * @param {number} fontSize
         * @param {boolean} bold
         * @param {string|Gradient} fontColor - 'black' or with opacity 'black 50%'
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number|null} maxHeight - null means auto height
         * @param {number|Array<number>} padding - One number for all sides or array of numbers, supports 1, 2, 3, or 4 value notation. default 0
         * @param {number} lineHeight
         * @param {number} radius - default 0
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @param {TextAnchor} [textAnchor] - default "start"
         * @returns {Item}
         */
        addMultilineTextBox(text: string, fontSize: number, bold: boolean, fontColor: string | Gradient, x: number, y: number, width: number, maxHeight: number | null, padding: number | Array<number>, lineHeight: number, radius: number, color: string | Gradient, textAnchor?: TextAnchor): Item;
        /**
         * Add a stroked rectangle with non-exeeding multiline text
         * @param {string} text
         * @param {number} fontSize
         * @param {boolean} bold
         * @param {string|Gradient} fontColor - 'black' or with opacity 'black 50%'
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number|null} maxHeight - null means auto height
         * @param {number|Array<number>} padding - One number for all sides or array of numbers, supports 1, 2, 3, or 4 value notation. default 0
         * @param {number} lineHeight
         * @param {number} radius - default 0
         * @param {number} lineWidth - default 1
         * @param {string|Gradient} color - 'black' or with opacity 'black 50%'
         * @param {TextAnchor} [textAnchor] - default "start"
         * @returns {Item}
         */
        addMultilineTextBoxOutline(text: string, fontSize: number, bold: boolean, fontColor: string | Gradient, x: number, y: number, width: number, maxHeight: number | null, padding: number | Array<number>, lineHeight: number, radius: number, lineWidth: number, color: string | Gradient, textAnchor?: TextAnchor): Item;
        /**
         * Add image as data URL
         * @param {string} dataUrl - data:image/..., see: https://en.wikipedia.org/wiki/Data_URI_scheme
         * @param {number} x
         * @param {number} y
         * @param {number|null} [width] - width of image if null
         * @param {number|null} [height] - height of image if null
         * @param {number|null} [opacity] - opacity
         * @returns {Item}
         * @throws {Error} Invalid data url
         */
        addImage(dataUrl: string, x: number, y: number, width?: number | null, height?: number | null, opacity?: number | null): Item;
        /**
         * Clear layer objects to re-use a clean svg
         */
        clear(): void;
        /**
         * Create the SVG from all items
         * @returns {string} SVG
         */
        createSVG(): string;
        /**
         * Write SVG to image file for testing
         * @param {string} path - write file destination path
         * @returns {Promise}
         */
        writeFile(path: string): Promise<any>;
    }
    namespace EyesonSvgLayer {
        export { TextAnchor, BoxOrigin };
    }
    /**
     * Class gradient
     */
    class Gradient {
        constructor(type: any);
        id: string;
        type: any;
    }
    /**
     * Class Filter
     */
    class Filter {
        constructor(type: any);
        id: string;
        type: any;
    }
    /**
     * @typedef {'start'|'middle'|'end'} TextAnchor
     * @typedef {'top left'|'top center'|'top right'|'center left'|'center'|'center right'|'bottom left'|'bottom center'|'bottom right'} BoxOrigin
     */
    /**
     * Class Item
     */
    class Item {
        constructor(type: any);
        type: any;
        /**
         *
         * @param {Filter} filter
         * @param {'text'|'box'|null} [type] - if type is null, filter is set to all items
         * @returns {Item}
         */
        setFilter(filter: Filter, type?: "text" | "box" | null): Item;
        filter: Filter;
    }
    type TextAnchor = "start" | "middle" | "end";
    type BoxOrigin = "top left" | "top center" | "top right" | "center left" | "center" | "center right" | "bottom left" | "bottom center" | "bottom right";
}
