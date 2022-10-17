function zoomImgSize(imgWidth, imgHeight, maxWidth, maxHeight) {
  let newWidth = imgWidth;
  let newHeight = imgHeight;
  if (imgWidth / imgHeight >= maxWidth / maxHeight) {
    if (imgWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = (imgHeight * maxWidth) / imgWidth;
    }
  } else if (imgHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (imgWidth * maxHeight) / imgHeight;
  }
  if (newWidth > maxWidth || newHeight > maxHeight) {
    return zoomImgSize(newWidth, newHeight, maxWidth, maxHeight);
  }
  return [newWidth, newHeight];
}

export default function convert(file, maxWidth, maxHeight, quality = 1) {
  return new Promise((resolve, reject) => {
    if (!file.name) {
      resolve({ success: 1 });
      return;
    }
    const imageType = file.name.split('.').reverse()[0].toLowerCase();
    const allow = ['jpg', 'gif', 'bmp', 'png', 'jpeg', 'svg'];
    try {
      if (!imageType || !allow.includes(imageType) || !file.size || !file.type) {
        resolve({ success: 1 });
        return;
      }
      if (file.size < 10 * 1000 * 1000 && imageType === 'gif') {
        resolve({ success: 2 });
        return;
      }

      const fileName = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          if (img.src.length < maxWidth * maxHeight) {
            resolve({ success: 2 });
            return;
          }

          const imgWidth = img.width;
          const imgHeight = img.height;

          if (imgWidth <= 0 || imgHeight <= 0) {
            resolve({ success: 2 });
            return;
          }

          const canvasSize = zoomImgSize(imgWidth, imgHeight, maxWidth, maxHeight);

          const canvas = document.createElement('canvas');
          [canvas.width, canvas.height] = canvasSize;
          // console.log(canvas.width,"-",canvas.height)

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.canvas.toBlob(
            (blob) => {
              const file = new File([blob], fileName, {
                type: `image/${imageType}`,
                lastModified: Date.now()
              });

              const reader = new window.FileReader();
              reader.readAsArrayBuffer(file);
              reader.onloadend = async () => {
                try {
                  const fileContent = Buffer.from(reader.result);
                  resolve({ success: 0, fileContent });
                } catch (error) {
                  reject(error);
                }
              };
            },
            file.type,
            quality
          );
        };
      };
      reader.onerror = (error) => reject(error);
    } catch (error) {
      console.log('Error while image resize: ', error);
      reject(error);
    }
  });
}
