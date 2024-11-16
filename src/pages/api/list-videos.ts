import { S3 } from 'aws-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bucket } = req.query;

  if (!bucket) {
    return res.status(400).json({ error: 'Bucket name is required' });
  }

  try {
    const response = await s3
      .listObjectsV2({
        Bucket: bucket as string,
      })
      .promise();

    const videos = response.Contents?.filter((file) =>
      file.Key?.endsWith('.mp4')
    );

    const videoUrls = await Promise.all(
      videos?.map(async (file) => {
        const url = await s3.getSignedUrlPromise('getObject', {
          Bucket: bucket as string,
          Key: file.Key as string,
          Expires: 60 * 60, // URL expires in 1 hour
        });
        return {
          key: file.Key,
          url,
        };
      }) || []
    );

    res.status(200).json(videoUrls);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to list videos' });
  }
}
// import { S3 } from 'aws-sdk';
// import type { NextApiRequest, NextApiResponse } from 'next';

// const s3 = new S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { bucket } = req.query;

//   if (!bucket) {
//     return res.status(400).json({ error: 'Bucket name is required' });
//   }

//   try {
//     const response = await s3
//       .listObjectsV2({
//         Bucket: bucket as string,
//       })
//       .promise();

//     const videos = response.Contents?.filter((file) =>
//       file.Key?.endsWith('.mp4')
//     ).map((file) => ({
//       key: file.Key,
//       url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
//     }));

//     res.status(200).json(videos || []);
//   } catch (error) {
//     console.error('Error fetching videos:', error);
//     res.status(500).json({ error: 'Failed to list videos' });
//   }
// }
