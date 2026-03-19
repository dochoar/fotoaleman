import fs from 'fs';
import path from 'path';

const dir = '/home/david/Escritorio/fotoaleman';

// Helper to slugify alt text to filename
function slugify(text) {
    if (!text || text.trim() === '') return 'imagen';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '_')           // Replace spaces with _
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '_')         // Replace multiple - with _
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text
        .substring(0, 50);              // Keep it somewhat short
}

const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// To keep track of new names and avoid overwriting 
const usedNames = new Set();
// Track renames: { oldPath: newPath } relative to dir
const renameMap = {};

function getUniqueName(baseName, ext) {
    let newName = `${baseName}${ext}`;
    let counter = 1;
    while (usedNames.has(newName) || fs.existsSync(path.join(dir, newName))) {
        newName = `${baseName}_${counter}${ext}`;
        counter++;
    }
    usedNames.add(newName);
    return newName;
}

// 1. Process HTML files to map ugly names to semantic names using alt text
htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Regex formats to find images
    // Format 1: src="..." alt="..."
    const regex1 = /<img\s+[^>]*?src=["']((?:fotos-celebridades|fotos-politica)\/([^"']+))["'][^>]*?alt=["']([^"']+)["']/gi;
    // Format 2: alt="..." src="..."
    const regex2 = /<img\s+[^>]*?alt=["']([^"']+)["'][^>]*?src=["']((?:fotos-celebridades|fotos-politica)\/([^"']+))["']/gi;

    const processMatch = (match, srcFull, filename, altText) => {
        // We only care about UUIDs, media__ timestamps, or generic unreadable names
        // e.g. 35c256dc-c8f5-4221-b031-a269785344fa_0.jpg or media__1772046368548.jpg
        const isUgly = /^[0-9a-f]{8}-/i.test(filename) || /^media__\d+/.test(filename) || /^celebridad123|^polit3|^eldivo|^latigresa/i.test(filename) || /[a-z0-9]{32}/i.test(filename) || /_.{2}$/.test(filename) || /^politico_celebridad/.test(filename) || /^a[a-f0-9]+_0\.jpg$/.test(filename);
        
        if (isUgly || filename.includes('media__') || filename.includes('-')) {
            const folder = srcFull.split('/')[0];
            const ext = path.extname(filename.split('?')[0]); // handle ?v=20260310
            let queryParam = filename.includes('?') ? '?' + filename.split('?')[1] : '';
            
            // Generate semantic base name from alt
            const baseSemantic = slugify(altText);
            
            // Only map if we haven't renamed this exact old file yet
            if (!renameMap[srcFull.split('?')[0]]) {
                const newRelativePath = `${folder}/${getUniqueName(baseSemantic, ext)}`;
                renameMap[srcFull.split('?')[0]] = newRelativePath;
            }
        }
    };

    // Replace passes to just map first
    let match;
    while ((match = regex1.exec(content)) !== null) {
        processMatch(match, match[1], match[2], match[3]);
    }
    while ((match = regex2.exec(content)) !== null) {
        // inverted capture groups
        processMatch(match, match[2], match[3], match[1]);
    }
});

// 2. Perform file renaming on filesystem
for (const [oldPath, newPath] of Object.entries(renameMap)) {
    const oldFull = path.join(dir, oldPath);
    const newFull = path.join(dir, newPath);
    if (fs.existsSync(oldFull)) {
        fs.renameSync(oldFull, newFull);
        console.log(`Renamed: ${oldPath} -> ${newPath}`);
    } else {
        console.error(`File not found, skipping rename: ${oldFull}`);
    }
}

// 3. Update the HTML files with the new paths
htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let changed = false;

    for (const [oldPath, newPath] of Object.entries(renameMap)) {
        // We do a global replace carefully
        // Old paths might have ?v=20260310 in HTML, but renameMap keys are clean.
        // We'll replace the clean path
        const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        if (regex.test(content)) {
            content = content.replace(regex, newPath);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Updated references in ${file}`);
    }
});

console.log('Renaming process complete.');
