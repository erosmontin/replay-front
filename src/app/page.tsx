'use client';

import React, { useEffect, useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const generateRandomData = () => {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
};
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
<div className="min-h-screen bg-gray-900 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Personalized Highlight User xx</h1>

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
          <div key={video.key} className="w-full max-w-xl bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2 text-center">{video.key}</h2>
            <VideoPlayer src={video.url} />
            <p className="text-sm text-gray-400 mt-4 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
            </p>
            <div className="flex-1 ml-4">
              <h3 className="text-md font-semibold mb-2 text-center">Player 1n the scene</h3>
              <Line
                data={{
                  labels: Array.from({ length: 10 }, (_, i) => `minutes ${i + 1}`),
                  datasets: [
                    {
                      label: 'Random Data',
                      data: generateRandomData(),
                      borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    },
                  ],
                }}
              />
              <h3 className="text-md font-semibold mb-2 text-center mt-4">Avg Rank</h3>
              <Bar
                data={{
                  labels: Array.from({ length: 10 }, (_, i) => `Label ${i + 1}`),
                  datasets: [
                    {
                      label: 'Random Data',
                      data: generateRandomData(),
                      backgroundColor: 'rgba(153, 102, 255, 0.2)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default Home;
