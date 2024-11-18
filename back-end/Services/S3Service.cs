using Amazon.S3;
using Amazon.S3.Model;

namespace back_end.Services;

public class S3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3Service(IAmazonS3 s3Client, string bucketName)
    {
        _s3Client = s3Client;
        _bucketName = bucketName;
    }

    /// <summary>
    /// Service handle upload file to AWS S3
    /// </summary>
    /// <param name="fileKey"></param>
    /// <param name="file"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    /// <exception cref="Exception"></exception>
    public async Task<string> UploadFileAsync(string fileKey, Stream file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("Invalid file");
        }

        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);
            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileKey,
                InputStream = memoryStream,
                AutoCloseStream = true
            };
            var response = await _s3Client.PutObjectAsync(putRequest);
            if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
            {
                return fileKey; // Trả về key hoặc URL của file đã upload.
            }
            else
            {
                throw new Exception("Error uploading file to S3");
            }
        }
    }

    /// <summary>
    /// Service Delete image to AWS S3
    /// </summary>
    /// <param name="fileKey"></param>
    /// <exception cref="ArgumentException"></exception>
    /// <exception cref="AmazonS3Exception"></exception>
    public async Task DeleteFileAsync(string fileKey)
    {
        if (string.IsNullOrEmpty(fileKey))
        {
            throw new ArgumentException("Invalid file key");
        }

        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = fileKey
        };
        try
        {
            var response = await _s3Client.DeleteObjectAsync(deleteRequest);

            // Check response for success or specific errors
            if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
            {
                // Log successful deletion
                Console.WriteLine($"File '{fileKey}' deleted successfully.");
            }
            else
            {
                // Log or handle specific errors
                Console.WriteLine($"Failed to delete file '{fileKey}'. StatusCode: {response.HttpStatusCode}");
                // throw new Exception($"Failed to delete file '{fileKey}'. StatusCode: {response.HttpStatusCode}");
            }
        }
        catch (AmazonS3Exception e)
        {
            // Log the exception or handle it as needed
            Console.WriteLine($"Error deleting file '{fileKey}' from S3: {e.Message}");
            // throw; // Optionally rethrow the exception
        }
    }
}