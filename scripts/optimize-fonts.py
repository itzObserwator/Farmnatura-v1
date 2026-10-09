from fontTools import subset
from pathlib import Path
for name in ['italiana','lato','lato-bold']:
    options = subset.Options(); options.flavor = 'woff2'
    font = subset.load_font('public/fonts/'+name+'.ttf', options)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=list(range(0x250))+list(range(0x2000,0x2070))+list(range(0x2190,0x2200))+[0x20b9,0x20ac])
    subsetter.subset(font)
    subset.save_font(font, 'public/fonts/'+name+'.woff2', options)
    print(name, Path('public/fonts/'+name+'.woff2').stat().st_size)

# Voyage is used only for figures; ship the glyphs those figures need.
options = subset.Options()
options.flavor = 'woff2'
font = subset.load_font('public/fonts/voyage-regular.otf', options)
subsetter = subset.Subsetter(options=options)
subsetter.populate(text='0123456789+.,/%−– ')
subsetter.subset(font)
subset.save_font(font, 'public/fonts/voyage-numbers.woff2', options)
print('voyage-numbers', Path('public/fonts/voyage-numbers.woff2').stat().st_size)
