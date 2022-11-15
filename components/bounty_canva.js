const { request } = require("undici");
const Canvas = require('@napi-rs/canvas');

const BountyImage = (criminal) => {
    const canvas = Canvas.createCanvas(300, 450)
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('s_villain.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Using undici to make HTTP requests for better performance
    const { body } = await request(criminal.displayAvatarURL({ extension: 'png' }));
    const avatar = await Canvas.loadImage(await body.arrayBuffer());

    // If you don't care about the performance of HTTP requests, you can instead load the avatar using
    // const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'jpg' }));

    // Draw a shape onto the main canvas
    context.drawImage(avatar, 30, 30, 120, 120);

    // Select the font size and type from one of the natively available fonts
    context.font = '14px sans-serif';

    // Select the style that will be used to fill the text in
    context.fillStyle = '#000000';

    // Actually fill the text with a solid color
    context.fillText(criminal.username, 160, 60);
    context.fillText('S+++', 160, 110);
    context.fillText('100', 130, 237) // Debate Wins
    context.fillText('200', 138, 257) // Debate Losses
    context.fillText('200', 168, 275) // Criminal Offenses
    context.fillText('$200,000', 110, 295) // Bounty

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

    return attachment

    // interaction.reply({ files: [attachment] });
}

module.exports = {
    bountyImage: BountyImage
}
