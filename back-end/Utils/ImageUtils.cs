using System.Drawing;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;
using System;
using System.IO;
using System.Threading.Tasks;

namespace back_end.Controllers;

public static class ImageUtils
{
    public static async Task<Stream> ResizeImageAsync(Stream imageStream, int maxWidth, int maxHeight)
    {
        // Load image from stream
        using (var image = await SixLabors.ImageSharp.Image.LoadAsync(imageStream))
        {
            // Resize image if needed
            var originalSize = image.Size; // Get the original size
            if (originalSize.Width > maxWidth || originalSize.Height > maxHeight)
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new SixLabors.ImageSharp.Size(maxWidth, maxHeight),
                    Mode = ResizeMode.Max
                }));
            }

            // Save the resized image to a new stream
            var resizedStream = new MemoryStream();
            await image.SaveAsJpegAsync(resizedStream); // Save as JPEG or use another format
            resizedStream.Position = 0; // Reset stream position for reading
            return resizedStream;
        }
    }
}