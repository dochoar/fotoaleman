import re

photos = [
    "05_Diptico Individual Domino.webp",
    "03_Individual Bicolor.webp",
    "02_Individual Domino.webp",
    "01_Individual Encapsulado.webp",
    "04_Individual Burbuja.webp",
    "06_Diptico Individual Encapsulado.webp",
    "07_Diptico Individual Coffee.webp",
    "08_Diptico Individual Black.webp",
    "09_Diptico Individual Cristal.webp",
    "10_DIptico Individual Marmol.webp",
    "11_Diptico Individual Jade.webp",
    "13_Triptico Individual Taxco.webp",
    "12_Diptico Individual Moctezuma.webp",
    "14_Triptico Individual Piramidal.webp",
    "17_Triptico Individual Domino.webp",
    "16_Triptico Individual Moctezuma.webp",
    "15_Triptico Individual Alinza Marmol.webp",
    "18_Triptico Grupal Cuadrado.webp",
    "19_Triptico Grupal Grecas.webp",
    "19_Diptico Grupal Estrella.webp",
    "20_Diptico Grupal PIramidal.webp",
    "22_Diptico Grupal Domino Chocolate.webp",
    "21_Diptico Grupal Taxco.webp",
    "23_ Diptico Grupal Domino.webp",
    "24_Diptico Grupal Jade.webp",
    "25_Diptico Grupal Chocolate.webp",
    "26_ Diptico Grupal Bicolor Arena.webp",
    "27_ Diptico Grupal Atenea.webp",
    "28_Triptico Grupal Shine Black.webp",
    "29_Triptico Grupal Alianza Marmol.webp",
    "31_ Triptico Grupal SIlver Night.webp",
    "30_Triptico Grupal Alianza.webp",
    "32_Triptico Grupal Ateneea.webp",
    "33_Triptico Grupal Atenea.webp",
    "34_Triptico Grupal Panorama.webp",
    "36_Triptico Grupal Taxco.webp",
    "35_Triptico Grupal BIcolor Blanco.webp",
    "37_ Triptico Grupal Grecas.webp",
    "38_ Triptico Grupal Olas.webp",
    "39_Triptico Grupal Diamante.webp",
    "41_Triptico Grupal Black.webp",
    "40_Triptico Grupal Bicolor Imperial.webp",
    "42_Triptico Grupal Ebano.webp",
    "43_Triptico Grupal Rolex.webp",
    "44_Triptico Grupal Cristal.webp"
]

parsed_photos = []
for p in photos:
    # Match number at the beginning optionally followed by underscore and spaces
    m = re.match(r'^(\d+)_?\s*(.*?)\.webp$', p)
    if m:
        num = int(m.group(1))
        title = m.group(2).strip()
        
        # Some slight cleanups on misspellings found in the filenames based on standard names
        title = title.replace("Alinza", "Alianza").replace("DIptico", "Díptico").replace("Diptico", "Díptico").replace("Triptico", "Tríptico").replace("PIramidal", "Piramidal").replace("Ateneea", "Atenea").replace("SIlver", "Silver").replace("BIcolor", "Bicolor")
        parsed_photos.append((num, p, title))

parsed_photos.sort(key=lambda x: (x[0], x[2]))

cards_html = []
for num, filename, title in parsed_photos:
    card = f'''                <div class="card with-img placa-item">
                    <div class="card-img-container wide-img">
                        <img src="fotos-graduaciones/{filename}" alt="{title}" class="card-img">
                    </div>
                    <div class="card-content">
                        <h3>{title}</h3>
                        <div class="card-action" style="margin-top: 15px;">
                            <a href="https://wa.me/5217771923760?text=Hola,%20me%20gustar%C3%ADa%20cotizar%20un%20paquete%20de%20graduaci%C3%B3n." target="_blank" class="btn-whatsapp-elegant">
                                <i class="fab fa-whatsapp"></i> Cotizar
                            </a>
                        </div>
                    </div>
                </div>'''
    cards_html.append(card)

cards_block = '\n\n'.join(cards_html)

# Read graduaciones.html
with open('/home/david/Escritorio/fotoaleman/graduaciones.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# We need to replace everything inside the FIRST <div class="grid-cards"> (which is the Cuadros y Reconocimientos) 
# The Cuadros y Reconocimientos block is followed by section 2 AGRADECIMIENTOS
pattern = re.compile(r'(<div class="section-header fade-in">\s*<h2>🏆 CUADROS Y RECONOCIMIENTOS</h2>\s*<p>Nuestros diseños marcos y placas de graduación</p>\s*</div>\s*<div class="grid-cards">).*?(</div>\s*</div>\s*</section>\s*<!-- SECTION 2: AGRADECIMIENTOS -->)', re.DOTALL)

match = pattern.search(html_content)
if not match:
    print("Could not find the target section to replace.")
    exit(1)

new_content = html_content[:match.start(1)] + match.group(1) + '\n' + cards_block + '\n            ' + match.group(2) + html_content[match.end(2):]

with open('/home/david/Escritorio/fotoaleman/graduaciones.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully injected cards")
