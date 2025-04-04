declare module "eyeson-node-svg-layer" {
    export = EyesonSvgLayer;
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
         * @returns {SvgLayerGradient}
         * @throws {Error} - no color stop
         */
        createLinearGradient(deg: number, ...colorStops: string[]): SvgLayerGradient;
        /**
         * Create a radial gradient
         * @param  {...string} colorStops - a sequence of color stops like '20% grey' or '20% #ccc 0.8'
         * @returns {SvgLayerGradient}
         * @throws {Error} - no color stop
         */
        createRadialGradient(...colorStops: string[]): SvgLayerGradient;
        /**
         * Create a blur filter
         * @param {number} stdDeviation - blur radius in pixels
         * @param {string|null} [input] - see: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/in
         * @returns {SvgLayerFilter}
         */
        createBlurFilter(stdDeviation: number, input?: string | null): SvgLayerFilter;
        /**
         * Create drop shadow filter
         * @param {number} dx - x offset
         * @param {number} dy - y offset
         * @param {number} stdDeviation - blur radius
         * @param {string} [color] - 'black' or with opacity 'black 50%', default 'black'
         * @returns {SvgLayerFilter}
         */
        createDropShadowFilter(dx: number, dy: number, stdDeviation: number, color?: string): SvgLayerFilter;
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
        addText(text: string, fontSize: number, bold: boolean, color: string | SvgLayerGradient, x: number, y: number, textAnchor?: TextAnchor, maxWidth?: number | null): SvgLayerObject;
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
        addMultilineText(text: string, fontSize: number, bold: boolean, color: string | SvgLayerGradient, x: number, y: number, width: number, maxHeight: number | null, lineHeight: number, textAnchor?: TextAnchor): SvgLayerObject;
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
        addRect(x: number, y: number, width: number, height: number, radius: number, color: string | SvgLayerGradient): SvgLayerObject;
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
        addRectOutline(x: number, y: number, width: number, height: number, lineWidth: number, radius: number, color: string | SvgLayerGradient): SvgLayerObject;
        /**
         * Add a filled circle
         * @param {number} x
         * @param {number} y
         * @param {number} radius
         * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
         * @returns {SvgLayerObject}
         */
        addCircle(x: number, y: number, radius: number, color: string | SvgLayerGradient): SvgLayerObject;
        /**
         * Add a stroked circle
         * @param {number} x
         * @param {number} y
         * @param {number} radius
         * @param {number} lineWidth - default 1
         * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
         * @returns {SvgLayerObject}
         */
        addCircleOutline(x: number, y: number, radius: number, lineWidth: number, color: string | SvgLayerGradient): SvgLayerObject;
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
        addLine(x1: number, y1: number, x2: number, y2: number, lineWidth: number, color: string | SvgLayerGradient): SvgLayerObject;
        /**
         * Add a filled polygon
         * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
         * @param  {...number} points - a sequence of x, y point coordinates. minimum 3 points
         * @returns {SvgLayerObject}
         * @throws {Error} - Even number of poins and at least 3 choordinates
         */
        addPolygon(color: string | SvgLayerGradient, ...points: number[]): SvgLayerObject;
        /**
         * Add a stroked polygon
         * @param {string|SvgLayerGradient} color - 'black' or with opacity 'black 50%'
         * @param  {number} lineWidth - default 1
         * @param  {...number} points - a sequence of x, y point coordinates. minimum 3 points
         * @returns {SvgLayerObject}
         * @throws {Error} - Even number of poins and at least 3 choordinates
         */
        addPolygonOutline(color: string | SvgLayerGradient, lineWidth?: number, ...points: number[]): SvgLayerObject;
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
        addTextBox(text: string, fontSize: number, bold: boolean, fontColor: string | SvgLayerGradient, x: number, y: number, origin: BoxOrigin, padding: number | Array<number>, maxWidth: number | null, radius: number, color: string | SvgLayerGradient): SvgLayerObject;
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
        addTextBoxOutline(text: string, fontSize: number, bold: boolean, fontColor: string | SvgLayerGradient, x: number, y: number, origin: BoxOrigin, padding: number | Array<number>, maxWidth: number | null, radius: number, lineWidth: number, color: string | SvgLayerGradient): SvgLayerObject;
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
        addMultilineTextBox(text: string, fontSize: number, bold: boolean, fontColor: string | SvgLayerGradient, x: number, y: number, width: number, maxHeight: number | null, padding: number | Array<number>, lineHeight: number, radius: number, color: string | SvgLayerGradient, textAnchor?: TextAnchor): SvgLayerObject;
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
        addMultilineTextBoxOutline(text: string, fontSize: number, bold: boolean, fontColor: string | SvgLayerGradient, x: number, y: number, width: number, maxHeight: number | null, padding: number | Array<number>, lineHeight: number, radius: number, lineWidth: number, color: string | SvgLayerGradient, textAnchor?: TextAnchor): SvgLayerObject;
        /**
         * Read image file and convert it to base64 Data URI
         * @param {string} path - Path to image file
         * @param {string} [mimeType] - Declare mimeType, if image file extension does not match the image MIME
         * @returns
         */
        imageToBase64(path: string, mimeType?: string): Promise<string>;
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
        addImage(dataUrl: string, x: number, y: number, width?: number | null, height?: number | null, opacity?: number | null): SvgLayerObject;
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
    class SvgLayerGradient {
        constructor(type: any);
        id: string;
        type: any;
    }
    /**
     * Class Filter
     */
    class SvgLayerFilter {
        constructor(type: any);
        id: string;
        type: any;
    }
    /**
     * @typedef {'start'|'middle'|'end'} TextAnchor
     * @typedef {'top left'|'top center'|'top right'|'center left'|'center'|'center right'|'bottom left'|'bottom center'|'bottom right'} BoxOrigin
     */
    /**
     * Class SvgLayerObject
     */
    class SvgLayerObject {
        constructor(type: any);
        type: any;
        /**
         *
         * @param {SvgLayerFilter} filter
         * @param {'text'|'box'|null} [type] - if type is null, filter is set to all items
         * @returns {SvgLayerObject}
         */
        setFilter(filter: SvgLayerFilter, type?: "text" | "box" | null): SvgLayerObject;
        filter: SvgLayerFilter;
    }
    type TextAnchor = "start" | "middle" | "end";
    type BoxOrigin = "top left" | "top center" | "top right" | "center left" | "center" | "center right" | "bottom left" | "bottom center" | "bottom right";
}
