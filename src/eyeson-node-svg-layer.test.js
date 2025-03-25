const fsPromise = require('node:fs/promises');
jest.mock('node:fs/promises');

const EyesonSvgLayer = require('./eyeson-node-svg-layer');

describe('SVG', () => {
  it('initiates', () => {
    const layer = new EyesonSvgLayer({ widescreen: true });
    expect(layer.width).toEqual(1280);
    expect(layer.height).toEqual(720);
  });

  it('adds text', () => {
    const layer = new EyesonSvgLayer();
    const entry = layer.addText('test', 16, false, '#000', 0, 0);
    expect(entry.type).toBe('text');
  });

  it('creates an SVG', () => {
    const layer = new EyesonSvgLayer();
    layer.addText('test', 16, false, '#000', 0, 0);
    const svg = layer.createSVG();
    expect(typeof svg).toBe('string');
  });

  it('writes local image', async () => {
    const layer = new EyesonSvgLayer();
    layer.addText('test', 16, false, '#000', 0, 0);
    await layer.writeFile('./test.svg')
    expect(fsPromise.writeFile).toHaveBeenCalledTimes(1);
  });

})
