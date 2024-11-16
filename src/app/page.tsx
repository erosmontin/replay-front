'use client';

import React, { useEffect, useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, WechatShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon, WechatIcon } from 'react-share';

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
<div className="flex justify-between items-center px-8 mb-8">
        <img src="/logo.png" alt="Logo" className="h-12" />
        <h1 className="text-4xl font-bold text-center">Personalized HIghlights Eros Montin</h1>
      </div>
      <div className="flex justify-center mb-8">
        <select
          value={selectedBucket || ''}
          onChange={(e) => setSelectedBucket(e.target.value)}
          className="p-2 border rounded rounded bg-gray-800 text-white"
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
            <div className="flex justify-center mt-4">
           <a
                href={video.url}
                download={video.key}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Inspect
              </a>
            
            {/* <div className="flex justify-center mt-4 space-x-2"> */}
              <FacebookShareButton url={video.url} quote={video.key}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={video.url} title={video.key}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton url={video.url} title={video.key}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <WhatsappShareButton url={video.url} title={video.key}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              {/* <WechatShareButton url={video.url} title={video.key}>
                <WechatIcon size={32} round />
              </WechatShareButton> */}
            </div>
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
