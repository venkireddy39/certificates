export const compressImage = (file, callback, options = {}) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            // Default max dimensions (for logos/signatures)
            const MAX_WIDTH = options.maxWidth || 400;
            const MAX_HEIGHT = options.maxHeight || 400;
            const quality = options.quality || 0.6;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to JPEG
            // Quality is a balance of size vs readability
            const dataUrl = canvas.toDataURL("image/jpeg", quality);
            callback(dataUrl);
        };
    };
    reader.readAsDataURL(file);
};
