import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
});



const uploadFileToS3 = (file: File) => {
    console.log(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY);
    // Create an instance of the S3 class
    const s3 = new AWS.S3();

    // Define the S3 bucket name and the key (file name) in the bucket
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
    console.log(bucketName);
    
    const key = file.name + Date.now();

    // Set up the parameters for the S3 upload
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: file.type,
    };

    // Upload the file to S3
    return new Promise((resolve, reject) => {
        // @ts-ignore
        s3.upload(params, (err: any, data: any) => {
            if (err) {
                console.error('Error uploading file to S3:', err);
                reject(err)
            } else {
                console.log('File uploaded successfully:', data.Location);
                // You can save the S3 URL or perform additional actions here
                resolve(key)
            }
        });
    })
};

export default uploadFileToS3;
