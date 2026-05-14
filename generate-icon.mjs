import Jimp from 'jimp';

async function generateIcon() {
  try {
    const canvas = await new Jimp(512, 512, '#FFFFFF'); // White background
    
    // Read the user logo
    const logo = await Jimp.read('public/logo-tik.jpeg');
    
    // Resize the logo to fit nicely. Assuming we want it to take up about 300x300.
    logo.scaleToFit(300, 300);
    
    // Calculate position to center the logo horizontally, and slightly above center vertically
    const x = (512 - logo.bitmap.width) / 2;
    const y = (512 - logo.bitmap.height) / 2 - 20;
    
    canvas.composite(logo, x, y);
    
    // Add text
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    
    // Text: "BANK SOAL ONLINE"
    const text = "BANK SOAL ONLINE";
    
    canvas.print(
      font,
      0, // x
      430, // y
      {
        text: text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      512, // maxWidth
      50 // maxHeight
    );
    
    // Save the image
    await canvas.writeAsync('public/app-icon.png');
    console.log('Icon generated successfully!');
  } catch (err) {
    console.error('Error generating icon:', err);
  }
}

generateIcon();
