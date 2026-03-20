import re

photos = [
    "P01_Placa Bronce.webp",
    "P02_Placa Metal 01.webp",
    "P03_Placa Metal 02.webp",
    "P04_Placa Metal 03.webp",
    "P05_Placa Melanina Clasica.webp",
    "P06_Placa Melanina Cristal.webp",
    "P07_Placa Melanina Media Ñuna.webp"
]

parsed = []
for p in photos:
    m = re.match(r'^P\d{2}_\s*(.*?)\.webp$', p)
    if m:
        title = m.group(1).strip()
        title = title.replace("Melanina", "Melamina").replace("Ñuna", "Luna")
        parsed.append((p, title))

cards_html = []
for filename, title in parsed:
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

placas_section = f'''
    <!-- SECTION 2.5: PLACAS -->
    <section class="section-padding" style="background-color: #fff;">
        <div class="container">
            <div class="section-header fade-in">
                <h2>🏅 PLACAS DE RECONOCIMIENTO</h2>
                <p>Nuestros diseños en metal y melamina</p>
            </div>
            <div class="grid-cards">
{cards_block}
            </div>
        </div>
    </section>

'''

with open('/home/david/Escritorio/fotoaleman/graduaciones.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

pattern = r'(<!-- SECTION 3: QR CODE -->)'
new_content = re.sub(pattern, placas_section + r'\1', html_content)

with open('/home/david/Escritorio/fotoaleman/graduaciones.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Placas injected successfully!")
