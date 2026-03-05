export const compressImage = (file, callback) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            // Max dimensions for templates to keep string size down
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 400;

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

            // Compress heavily to JPEG (often 10x smaller than raw PNG base64)
            // Quality 0.6 is a good balance of size vs readability for logos/signatures
            const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
            callback(dataUrl);
        };
    };
    reader.readAsDataURL(file);
};
