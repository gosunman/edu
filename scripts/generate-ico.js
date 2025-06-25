const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function generateIco() {
  const publicDir = path.join(__dirname, '../public');
  
  try {
    const pngFiles = [
      path.join(publicDir, 'favicon-16x16.png'),
      path.join(publicDir, 'favicon-32x32.png')
    ];
    
    const ico = await pngToIco(pngFiles);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
    
    console.log('✅ ICO file generated successfully!');
  } catch (error) {
    console.error('❌ Error generating ICO:', error);
  }
}

generateIco(); 