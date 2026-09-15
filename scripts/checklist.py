from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from pathlib import Path
out=Path('public/documents/move-in-checklist.pdf')
out.parent.mkdir(parents=True,exist_ok=True)
c=canvas.Canvas(str(out),pagesize=A4)
c.setTitle('The Princess - Einzugscheckliste / Move-in checklist')
w,h=A4
ink=HexColor('#283c32');muted=HexColor('#687068');paper=HexColor('#f7f3eb');clay=HexColor('#e8d6c9')
c.setFillColor(paper);c.rect(0,0,w,h,fill=1,stroke=0)
c.setFillColor(ink);c.rect(0,h-175,w,175,fill=1,stroke=0)
c.setFillColor(paper);c.setFont('Times-Roman',34);c.drawString(42,h-66,'The Princess')
c.setFont('Helvetica',10);c.drawString(43,h-89,'KROOGBLOECKE 2  /  HAMBURG')
c.setFont('Helvetica',17);c.drawString(43,h-128,'Einzugscheckliste / Move-in checklist')
c.setFont('Helvetica',9);c.drawString(43,h-149,'Praktische Vorbereitung - kein Vertragsdokument / Practical guide - not a contract')
sections=[('01  Vor dem Einzug / Before moving in',[
('Zeitraum, Miethoehe und Vertragsbedingungen bestaetigen.','Confirm dates, rent and the final contract terms.'),
('Unterlagen nur nach Absprache ueber einen geeigneten Weg teilen.','Share requested documents only through an agreed, appropriate channel.'),
('Kaution und Schluesseluebergabe gemeinsam abstimmen.','Agree the deposit arrangements and a time for key handover.')]),
('02  Bei der Uebergabe / At handover',[
('Zustand, Zaehlerstaende und Schluessel gemeinsam dokumentieren.','Record condition, meter readings and keys together.'),
('Inventarliste durchgehen und offene Punkte festhalten.','Review the inventory and record any outstanding items.'),
('Internet, Geraete, Hausregeln und Waeschemoeglichkeiten klaeren.','Check internet, appliances, house guidance and laundry arrangements.')]),
('03  Nach dem Ankommen / After arriving',[
('Anmeldung und Wohnungsgeberbestaetigung rechtzeitig abstimmen.','Check residence registration and landlord confirmation arrangements.'),
('Rundfunkbeitrag und eigenen Versicherungsschutz pruefen.','Check broadcasting contribution arrangements and your insurance cover.'),
('Kontakt fuer Fragen und den spaeteren Auszug notieren.','Keep the agreed contact details for questions and eventual move-out.')])]
y=h-205
for title,items in sections:
 c.setFillColor(ink);c.setFont('Helvetica-Bold',11);c.drawString(43,y,title);y-=26
 for de,en in items:
  c.setStrokeColor(muted);c.rect(44,y-1,9,9,fill=0,stroke=1)
  c.setFillColor(ink);c.setFont('Helvetica',9)
  for line in simpleSplit(de,'Helvetica',9,w-115):c.drawString(63,y,line);y-=12
  c.setFillColor(muted);c.setFont('Helvetica',8.5)
  for line in simpleSplit(en,'Helvetica',8.5,w-115):c.drawString(63,y,line);y-=12
  y-=10
 y-=12
c.setStrokeColor(clay);c.line(43,62,w-43,62)
c.setFillColor(muted);c.setFont('Helvetica',8);c.drawString(43,45,'Stand / Version: September 2026  |  Einzelheiten werden persoenlich bestaetigt.')
c.drawRightString(w-43,45,'1 / 1')
c.save()
print(out)
