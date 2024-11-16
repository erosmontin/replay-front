import { S3 } from 'aws-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Fetching buckets');
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
    
    const response = await s3.listBuckets().promise();
    const buckets = response.Buckets?.map((bucket) => bucket.Name);
    res.status(200).json(buckets || []);
  } catch (error) {
    console.error('Error fetching buckets:', error);
    res.status(500).json({ error: 'Failed to list buckets' });
  }
}
