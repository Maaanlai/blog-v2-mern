import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: "ap-northeast-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// async function generateSignedUrl(fileName) {
//     const command = new GetObjectCommand({
//         Bucket: "testing-ap-tokyo",
//         Key: fileName,
//     });

//     return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// }

// export { s3, generateSignedUrl };

export { s3 };