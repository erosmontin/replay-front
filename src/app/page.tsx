'use client';

import React, { useEffect, useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface Video {
  key: string;
  url: string;
}

const generateChartData = (type: string) => {
  const baseData = Array.from({ length: 77 }, (_, i) => i);
  const typeSpecificData =
    type === 'shot'
      ? [0, 15, 80, 85, 90, 88, 75, 20, 29, 11, 25, 9, 17, 17, 6, 5, 6, 20, 18, 28, 21, 7, 27, 28, 21, 20, 3, 2, 7, 13, 2, 26, 14, 20, 6, 9, 3, 22, 30, 35, 40, 40, 45, 75, 85, 90, 95, 95, 93, 97, 99, 95, 90, 85, 75, 9, 17, 17, 6, 5, 6, 20, 18, 28, 21, 7, 27, 28, 21, 20, 3, 55, 95, 95, 85, 85, 83]
      : [20, 6, 23, 9, 6, 23, 19, 20, 29, 11, 25, 9, 17, 17, 6, 5, 6, 20, 18, 28, 21, 7, 27, 28, 21, 20, 3, 2, 7, 13, 2, 26, 14, 20, 6, 9, 3, 22, 75, 85, 95, 95, 95, 80, 20, 6, 23, 9, 6, 23, 19, 20, 29, 11, 25, 9, 17, 17, 6, 5, 6, 20, 18, 28, 21, 7, 27, 28, 21, 20, 3, 2, 7, 13, 2, 26, 14];

  return {
    labels: baseData,
    datasets: [
      {
        label: type === 'shot' ? 'Shot Chart' : 'Cross-Over Chart',
        data: typeSpecificData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };
};

const Home: React.FC = () => {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeChart, setActiveChart] = useState<{ [key: string]: string }>({});

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

  const toggleChart = (key: string, type: string) => {
    setActiveChart((prev) => ({
      ...prev,
      [key]: prev[key] === type ? '' : type,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10">
      <div className="flex justify-between items-center px-8 mb-8">
        <img src="/logo.png" alt="Logo" className="h-12" />
        <h1 className="text-4xl font-bold text-center text-white">Personalized Highlights</h1>
      </div>
      <div className="flex justify-center mb-8">
        <select
          value={selectedBucket || ''}
          onChange={(e) => setSelectedBucket(e.target.value)}
          className="p-2 border rounded bg-gray-800 text-white"
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
            <h2 className="text-lg font-semibold mb-2 text-white text-center">{video.key}</h2>
            <VideoPlayer src={video.url} />
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => toggleChart(video.key, 'shot')}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {activeChart[video.key] === 'shot' ? 'Hide Shot Chart' : 'Show Shot Chart'}
              </button>
              <button
                onClick={() => toggleChart(video.key, 'cross-over')}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {activeChart[video.key] === 'cross-over' ? 'Hide Cross-Over Chart' : 'Show Cross-Over Chart'}
              </button>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              <a
                href={video.url}
                download={video.key}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Inspect
              </a>
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
            </div>
            {activeChart[video.key] && (
              <div className="mt-4">
                <Line
                  data={generateChartData(activeChart[video.key])}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: `${activeChart[video.key]} Chart` },
                    },
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
