function linkIn(div){
    div.classList.add("active");
}

function linkOut(div){
    div.classList.remove("active");
}

// fade-in/out for rows
document.addEventListener('DOMContentLoaded', () => {
    const parent = document.querySelector('.container.ps-5.pe-5');
    if (!parent) return;

    const items = parent.querySelectorAll('.row');
    items.forEach(item => {
        item.classList.add('fade-item');
        // start hidden and away from screen
        item.style.visibility = 'hidden';

        // when fade-out finishes, hide from layout/interaction
        item.addEventListener('transitionend', (e) => {
            if (e.propertyName === 'opacity' && !item.classList.contains('visible')) {
                item.style.visibility = 'hidden';
            }
        });

        // Identify text column (contains h3 or p) and image column
        const cols = Array.from(item.querySelectorAll('.col'));
        const textCol = cols.find(c => c.querySelector('h3') || c.querySelector('p')) || cols[0];
        const imgCol = cols.find(c => c.querySelector('img')) || cols.find(c => c !== textCol) || cols[0];

        const textIsLeft = cols.indexOf(textCol) === 0;

        // Apply slide classes so the text (h3 + p) and the image slide in together.
        if (textIsLeft) {
            textCol.classList.add('slide-item-right');
            imgCol.classList.add('slide-item-left');
        } else {
            textCol.classList.add('slide-item-left');  
            imgCol.classList.add('slide-item-right');
        }

        // start hidden for sliding columns
        [textCol, imgCol].forEach(el => {
            if (!el) return;
            el.style.visibility = 'hidden';
            el.addEventListener('transitionend', (ev) => {
                if (ev.propertyName === 'opacity' && !el.classList.contains('visible')) {
                    el.style.visibility = 'hidden';
                }
            });
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                // check if div visible
                el.style.visibility = 'visible';
                // add class on next frame for smooth transition
                requestAnimationFrame(() => {
                    el.classList.add('visible');

                    // reveal sliding children
                    el.querySelectorAll('.slide-item-right, .slide-item-left').forEach(s => {
                        s.style.visibility = 'visible';
                        // small stagger can be added here if desired
                        requestAnimationFrame(() => s.classList.add('visible'));
                    });
                });
            } else {
                // remove class to trigger fade-out; visibility set after transitionend
                el.classList.remove('visible');

                // hide sliding children
                el.querySelectorAll('.slide-item-right, .slide-item-left').forEach(s => {
                    s.classList.remove('visible');
                });
            }
        });
    }, {
        threshold: 0.15
    });

    items.forEach(item => observer.observe(item));
});