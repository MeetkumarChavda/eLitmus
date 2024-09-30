import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";

import React from 'react'

const Hero = () => {
    return (
        <div className="flex flex-col items-center mt-6 lg:mt-20">
         <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide"> 
          Your Path to Success Starts Here
          <span className="bg-gradient-to-r from-green-300 to-green-600 text-transparent bg-clip-text">
            {" "} eLitmus
          </span>
          </h1>
          <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
            Prepare for your exams with ease. Our portal provides comprehensive study materials, practice tests, and real-time progress tracking. Achieve your academic goals today!
          </p>
          <div className="flex justify-center my-10">
          <a
            href="#"
            className="bg-gradient-to-r from-green-300 to-green-600 py-3 px-4 mx-3 rounded-md"
          >
              explore
          </a>

            {/* <a href="#" className="py-3 px-4 mx-3 rounded-md border">
              Register
            </a> */}
          </div>
          <div className="flex mt-10 justify-center">
            <video
              autoPlay
              loop
              muted
              className="rounded-lg w-1/2 border border-green-500 shadow-sm shadow-green-300 mx-2 my-4"
            >
              <source src={video1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <video
              autoPlay
              loop
              muted
              className="rounded-lg w-1/2 border border-green-500 shadow-sm shadow-green-300 mx-2 my-4"
            >
              <source src={video2} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      );
}

export default Hero