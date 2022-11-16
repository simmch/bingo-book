const { request } = require("undici");
const { AttachmentBuilder } = require("discord.js")
const Canvas = require('@napi-rs/canvas');

const BountyImage =  async (criminal, villain) => {
    let rank = villain.RANK
    let bounty = villain.BOUNTY.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let offenses = villain.CRIMINAL_OFFENSES.length.toString()
    let debate_wins = "0"
    let debate_losses = "0"
    let template = ""

    if(rank.startsWith("D")){
        template = "../d_villain.png"
    } 
    if(rank.startsWith("C")){
        template = "../c_villain.png"
    }
    if(rank.startsWith("B")){
        template = "../b_villain.png"
    }
    if(rank.startsWith("A")){
        template = "../a_villain.png"
    }
    if(rank.startsWith("S")){
        template = "../s_villain.png"
    }

    
    const canvas = Canvas.createCanvas(300, 450)
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage(template);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Using undici to make HTTP requests for better performance
    const { body } = await request(criminal.displayAvatarURL({ extension: 'png' }));
    const avatar = await Canvas.loadImage(await body.arrayBuffer());

    // If you don't care about the performance of HTTP requests, you can instead load the avatar using
    // const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'jpg' }));

    // Draw a shape onto the main canvas
    context.drawImage(avatar, 30, 30, 120, 120);

    // Select the font size and type from one of the natively available fonts
    context.font = '14px Impact';

    // Select the style that will be used to fill the text in
    context.fillStyle = '#000000';

    // Actually fill the text with a solid color
    context.fillText(criminal.username, 160, 60);
    context.fillText(rank, 160, 110);
    context.fillText(debate_wins, 130, 237) // Debate Wins
    context.fillText(debate_losses, 138, 257) // Debate Losses
    context.fillText(offenses, 168, 275) // Criminal Offenses
    context.fillText(`$${bounty}`, 110, 295) // Bounty

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

    return attachment

    // interaction.reply({ files: [attachment] });
}

module.exports = {
    bountyImage: BountyImage
}
