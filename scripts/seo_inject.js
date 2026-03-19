import fs from 'fs';
import path from 'path';

const dir = '/home/david/Escritorio/fotoaleman';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const baseUrl = 'https://www.fotoaleman.com';

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Skip if already injected (basic check)
    if (content.includes('property="og:url"')) {
        console.log(`Skipping ${file}, already has SEO tags.`);
        return;
    }

    // Extract title
    let titleMatch = content.match(/<title>(.*?)<\/title>/);
    let title = titleMatch ? titleMatch[1].trim() : 'Foto Alemán';

    // Extract description
    let descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    let description = descMatch ? descMatch[1].trim() : 'Foto Alemán - Fotografía profesional en Cuernavaca.';

    // Prepare JSON-LD
    let schemaType = file === 'index.html' ? 'LocalBusiness' : 'WebPage';
    let schemaJson = {};
    if (schemaType === 'LocalBusiness') {
        schemaJson = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Foto Alemán",
            "image": `${baseUrl}/assets/icon.png`,
            "@id": baseUrl,
            "url": baseUrl,
            "telephone": "+5217771923760",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cuernavaca",
                "addressCountry": "MX"
            },
            "description": description
        };
    } else {
        schemaJson = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": title,
            "description": description,
            "url": `${baseUrl}/${file}`
        };
    }

    const seoBlock = `
    <!-- Technical SEO Tags -->
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${baseUrl}/${file === 'index.html' ? '' : file}">
    <meta property="og:type" content="${file === 'index.html' ? 'website' : 'article'}">
    <meta property="og:url" content="${baseUrl}/${file === 'index.html' ? '' : file}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${baseUrl}/assets/icon.png">
    <meta property="og:site_name" content="Foto Alemán">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${baseUrl}/${file === 'index.html' ? '' : file}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${baseUrl}/assets/icon.png">
    
    <!-- Schema.org Markup -->
    <script type="application/ld+json">
${JSON.stringify(schemaJson, null, 4)}
    </script>
</head>`;

    content = content.replace(/<\/head>/i, seoBlock);
    
    fs.writeFileSync(path.join(dir, file), content, 'utf8');
    console.log(`Injected SEO tags into ${file}`);
});
