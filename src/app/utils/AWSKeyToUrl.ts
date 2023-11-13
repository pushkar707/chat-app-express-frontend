export default (key:string) => {
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
    const bucketregion = process.env.NEXT_PUBLIC_AWS_REGION
    return `https://${bucketName}.s3.${bucketregion}.amazonaws.com/${key}`
}