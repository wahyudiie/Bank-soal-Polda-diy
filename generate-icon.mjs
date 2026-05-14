import Jimp from 'jimp';

async function generateIcon() {
  try {
    // 1. Revert to White background (looks better on iOS squircle)
    const canvas = await new Jimp(512, 512, '#FFFFFF'); 
    
    // 2. Read the transparent logo
    const logo = await Jimp.read('public/logo tik.png');
    
    // 3. Make the logo larger for better visibility
    logo.scaleToFit(400, 400);
    
    // 4. Center logo, but move it up slightly to make room for text
    const x = (512 - logo.bitmap.width) / 2;
    const y = (512 - logo.bitmap.height) / 2 - 40; // Higher up
    
    canvas.composite(logo, x, y);
    
    // 5. Add text closer to the logo
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const text = "BANK SOAL ONLINE";
    
    // Position text directly below the logo
    // y = logo bottom + some margin
    const textY = y + logo.bitmap.height + 10; 
    
    canvas.print(
      font,
      0, 
      textY,
      {
        text: text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP
      },
      512
    );
    
    // Save the image
    await canvas.writeAsync('public/app-icon.png');
    console.log('Icon optimized successfully with white background and better spacing!');
  } catch (err) {
    console.error('Error generating icon:', err);
  }
}

generateIcon();
