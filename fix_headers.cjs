const fs = require('fs');
const path = require('path');

const targetHeader = `    <!-- HEADER -->
    <header>
        <div class="nav-container">
            <div class="logo">
                <a href="index.html">
                    <img src="Credencial Pepe Aleman.png" alt="Foto Alemán">
                </a>
            </div>
            <nav class="nav-links">
                <a href="index.html#catálogo">Catálogo</a>
                <a href="graduaciones.html">Graduaciones</a>
                <a href="bodas.html">Bodas</a>
                <a href="estolas.html">Estolas</a>
                <a href="estudio.html">Estudio</a>
                <a href="index.html#trayectoria">Trayectoria</a>
                <a href="index.html#historias">Historias</a>
            </nav>
            <div class="header-actions">
                <a href="contacto.html" class="subscribe-btn">Contacto</a>
                <div class="mobile-menu-btn">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
        </div>
    </header>
`;

// Note: I updated the anchors to point back to index.html if we're on other pages

const dir = '/home/david/Escritorio/fotoaleman';
const files = fs.readdirSync(dir).filter(file => file.endsWith('.html'));

for (const file of files) {
  if (file === 'index.html') {
    // For index.html, we don't strictly need index.html# prefix, but we can update it just to be safe, or leave it. 
    continue;
  }
  
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  // Match the header tag and its contents. Non-greedy
  const updatedContent = content.replace(/<!-- HEADER -->[\s\S]*?<\/header>/g, targetHeader.trim());
  fs.writeFileSync(path.join(dir, file), updatedContent);
  console.log(`Updated ${file}`);
}
