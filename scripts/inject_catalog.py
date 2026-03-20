import re

photos = [
    "05_Diptico Individual Domino.png",
    "03_Individual Bicolor.png",
    "02_Individual Domino.png",
    "01_Individual Encapsulado.png",
    "04_Individual Burbuja.png",
    "06_Diptico Individual Encapsulado.png",
    "07_Diptico Individual Coffee.png",
    "08_Diptico Individual Black.png",
    "09_Diptico Individual Cristal.png",
    "10_DIptico Individual Marmol.png",
    "11_Diptico Individual Jade.png",
    "13_Triptico Individual Taxco.png",
    "12_Diptico Individual Moctezuma.png",
    "14_Triptico Individual Piramidal.png",
    "17_Triptico Individual Domino.png",
    "16_Triptico Individual Moctezuma.png",
    "15_Triptico Individual Alinza Marmol.png",
    "18_Triptico Grupal Cuadrado.png",
    "19_Triptico Grupal Grecas.png",
    "19_Diptico Grupal Estrella.png",
    "20_Diptico Grupal PIramidal.png",
    "22_Diptico Grupal Domino Chocolate.png",
    "21_Diptico Grupal Taxco.png",
    "23_ Diptico Grupal Domino.png",
    "24_Diptico Grupal Jade.png",
    "25_Diptico Grupal Chocolate.png",
    "26_ Diptico Grupal Bicolor Arena.png",
    "27_ Diptico Grupal Atenea.png",
    "28_Triptico Grupal Shine Black.png",
    "29_Triptico Grupal Alianza Marmol.png",
    "31_ Triptico Grupal SIlver Night.png",
    "30_Triptico Grupal Alianza.png",
    "32_Triptico Grupal Ateneea.png",
    "33_Triptico Grupal Atenea.png",
    "34_Triptico Grupal Panorama.png",
    "36_Triptico Grupal Taxco.png",
    "35_Triptico Grupal BIcolor Blanco.png",
    "37_ Triptico Grupal Grecas.png",
    "38_ Triptico Grupal Olas.png",
    "39_Triptico Grupal Diamante.png",
    "41_Triptico Grupal Black.png",
    "40_Triptico Grupal Bicolor Imperial.png",
    "42_Triptico Grupal Ebano.png",
    "43_Triptico Grupal Rolex.png",
    "44_Triptico Grupal Cristal.png"
]

parsed_photos = []
for p in photos:
    # Match number at the beginning optionally followed by underscore and spaces
    m = re.match(r'^(\d+)_?\s*(.*?)\.png$', p)
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
