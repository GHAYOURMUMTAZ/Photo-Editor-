// Photo Editor - Simple Implementation
let canvas, ctx, image, rotation = 0, flipH = 1, flipV = 1;
let filters = {
    brightness: 100, saturation: 100, inversion: 0, 
    grayscale: 0, blur: 0, sepia: 0
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('imageCanvas');
    ctx = canvas.getContext('2d');
    
    // File upload
    document.getElementById('imageInput').onchange = uploadImage;
    
    // Buttons
    document.getElementById('saveBtn').onclick = saveImage;
    document.getElementById('resetBtn').onclick = resetFilters;
    document.getElementById('rotateLeft').onclick = () => rotate(-90);
    document.getElementById('rotateRight').onclick = () => rotate(90);
    document.getElementById('flipHorizontal').onclick = flipHori;
    document.getElementById('flipVertical').onclick = flipVert;
    
    // Sliders
    ['brightness', 'saturation', 'inversion', 'grayscale', 'blur', 'sepia'].forEach(name => {
        document.getElementById(name).oninput = (e) => {
            filters[name] = parseFloat(e.target.value);
            document.getElementById(name + 'Value').textContent = 
                name === 'blur' ? e.target.value + 'px' : e.target.value + '%';
            applyFilters();
        };
    });
});

// Upload and load image
function uploadImage(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            image = img;
            resizeCanvas();
            resetFilters();
            applyFilters();
            canvas.style.display = 'block';
            document.getElementById('noImageMessage').style.display = 'none';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Resize canvas to fit image
function resizeCanvas() {
    const maxW = 600, maxH = 500;
    let { width: w, height: h } = image;
    
    if (w > maxW || h > maxH) {
        const ratio = Math.min(maxW / w, maxH / h);
        w *= ratio; h *= ratio;
    }
    
    canvas.width = w;
    canvas.height = h;
}

// Apply all filters and transformations
function applyFilters() {
    if (!image) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Apply rotation and flip
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.scale(flipH, flipV);
    ctx.translate(-canvas.width/2, -canvas.height/2);
    
    // Apply filters
    ctx.filter = `brightness(${filters.brightness}%) saturate(${filters.saturation}%) ` +
                 `invert(${filters.inversion}%) grayscale(${filters.grayscale}%) ` +
                 `blur(${filters.blur}px) sepia(${filters.sepia}%)`;
    
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// Rotate image
function rotate(degrees) {
    rotation += degrees;
    rotation %= 360;
    applyFilters();
}

// Flip functions
function flipHori() {
    flipH *= -1;
    applyFilters();
}

function flipVert() {
    flipV *= -1;
    applyFilters();
}

// Reset all filters
function resetFilters() {
    filters = { brightness: 100, saturation: 100, inversion: 0, 
                grayscale: 0, blur: 0, sepia: 0 };
    rotation = 0;
    flipH = 1; flipV = 1;
    
    Object.keys(filters).forEach(name => {
        document.getElementById(name).value = filters[name];
        document.getElementById(name + 'Value').textContent = 
            name === 'blur' ? filters[name] + 'px' : filters[name] + '%';
    });
    
    applyFilters();
}

// Save image
function saveImage() {
    if (!image) {
        alert('No image to save. Please upload an image first.');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'edited-image-' + Date.now() + '.png';
    link.href = canvas.toDataURL();
    link.click();
    alert('Image saved successfully!');
}
