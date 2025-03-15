import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InfoSection from "@/components/InfoSection";
import ChatSection from "@/components/ChatSection";
import { ImageUpload } from "@/components/ImageUpload";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-10 flex flex-col md:flex-row gap-6 flex-grow">
        <InfoSection />
        <div className="container py-8">
          <ImageUpload onAnalysis={(message) => {
            // Handle the analysis result here
            console.log("Image analysis:", message);
          }} />
          <ChatSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;