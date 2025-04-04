const Eyeson = require('@eyeson/node');
const EyesonSvgLayer = require('@eyeson/node-svg-layer');

const eyeson = new Eyeson({ apiKey: 'API_KEY' });

const run = async () => {
    const layerOptions = { widescreen: true };

    const background = new EyesonSvgLayer(layerOptions);
    background.addRect(0, 0, background.width, background.height, 0, '#8c0e0d');
    background.addRectOutline(0, 0, background.width, background.height, 1, 0, '#fff');
    background.addLine(0, background.height / 2, background.width, background.height / 2, 1, '#fff');
    background.addLine(background.width / 2, 0, background.width / 2, background.height, 1, '#fff');

    const overlay = new EyesonSvgLayer(layerOptions);
    const fontSize = 16;
    const lineHeight = 22;
    const bold = true;
    const fontColor = '#fff';

    overlay.addTextBox('Martin', fontSize, bold, fontColor, overlay.width / 2, overlay.height / 2, 'bottom right', 10, null, 4, '#000 50%');
    overlay.addTextBox('Elisa', fontSize, bold, fontColor, overlay.width, overlay.height / 2, 'bottom right', 10, null, 4, '#000 50%');
    overlay.addTextBox('Customer', fontSize, bold, fontColor, overlay.width / 2, overlay.height, 'bottom right', 10, null, 4, '#000 50%');

    const gradient = overlay.createLinearGradient(90, '0% #777', '100% #555');
    const shadow = overlay.createDropShadowFilter(7, 2, 2, '#555 50%');
    overlay.addMultilineTextBox('Agenda:\n \n- Test Eyeson\n- Try Layer\n- One more thing…', fontSize, bold, fontColor, 700, 400, 240, null, 20, lineHeight, 4, gradient, 'middle').setFilter(shadow, 'box');

    // background.writeFile('./bg.svg');
    // overlay.writeFile('./fg.svg');

    const user = await eyeson.join('eyeson-node-demo', 'node-demo', {
        options: { widescreen: true },
    });
    await Promise.all([
        user.setLayout({
            layout: 'custom',
            name: 'four',
            users: ['martin', 'elisa', 'customer', 'agenda'],
            show_names: false,
            voice_activation: false,
        }),
        user.sendLayer(background, -1),
        user.sendLayer(overlay, 1),
    ]);
}

run();
