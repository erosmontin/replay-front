'use client';

import React, { useEffect, useState } from 'react';
import VideoPlayer from './components/VideoPlayer';

interface Video {
  key: string;
  url: string;
}

const Home: React.FC = () => {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const response = await fetch('/api/list-buckets');
        const data: string[] = await response.json();
        setBuckets(data);
      } catch (error) {
        console.error('Error fetching buckets:', error);
      }
    };

    fetchBuckets();
  }, []);

  useEffect(() => {
    if (!selectedBucket) return;

    const fetchVideos = async () => {
      try {
        const response = await fetch(`/api/list-videos?bucket=${selectedBucket}`);
        const data: Video[] = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, [selectedBucket]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">S3 Video Gallery</h1>

      <div className="flex justify-center mb-8">
        <select
          value={selectedBucket || ''}
          onChange={(e) => setSelectedBucket(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="" disabled>
            Select a bucket
          </option>
          {buckets.map((bucket) => (
            <option key={bucket} value={bucket}>
              {bucket}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {videos.map((video) => (
          <div key={video.key} className="w-full max-w-xl">
            <VideoPlayer src={video.url} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
