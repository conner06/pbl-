import React, { useState, useEffect } from "react";
import axios from "axios";

function Weather() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL, // .env에서 URL 불러오기
          {
            params: {
              serviceKey: import.meta.env.VITE_API_KEY,
              numOfRows: 5,
              pageNo: 1,
              dataType: "JSON",
              base_date: "20260519", // 오늘 날짜로 바꿔서 입력해요! (YYYYMMDD 형식)
              base_time: "0500", 
              nx: 60,
              ny: 127,
            },
          },
        );

        console.log(response.data.response.body.items.item);
        const data = response.data.response.body.items.item;
        setItems(data);
      } catch (error) {
        console.error("에러 발생:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-center mb-6">단기예보 데이터</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          {items.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5 w-40 flex flex-col items-center gap-2"
            >
              <p className="text-sm font-semibold text-gray-500">
                {item.category}
              </p>
              <p className="text-xl font-bold text-blue-500">
                {item.fcstValue}
              </p>
              <p className="text-xs text-gray-400">
                {item.fcstDate} {item.fcstTime}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          {items.slice(3).map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5 w-40 flex flex-col items-center gap-2"
            >
              <p className="text-sm font-semibold text-gray-500">
                {item.category}
              </p>
              <p className="text-xl font-bold text-blue-500">
                {item.fcstValue}
              </p>
              <p className="text-xs text-gray-400">
                {item.fcstDate} {item.fcstTime}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Weather;
