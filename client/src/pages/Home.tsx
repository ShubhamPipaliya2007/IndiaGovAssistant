import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InfoSection from "@/components/InfoSection";
import ChatSection from "@/components/ChatSection";
import { Chat } from "@/components/Chat";
import { ImageUpload } from "@/components/ImageUpload"; // Added import for ImageUpload component


const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-10 flex flex-col md:flex-row gap-6 flex-grow">
        <InfoSection />
        <div className="container py-8"> {/* Added container for ImageUpload */}
          <ImageUpload onAnalysis={(message) => {
            // Handle the analysis result here.  This is a placeholder; a real implementation would send the image to an API and handle the response.
            console.log("Image analysis:", message);
          }} />
          <Chat />
        </div>
        <ChatSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

// Placeholder ImageUpload component - needs backend integration
const ImageUpload = ({ onAnalysis }: { onAnalysis: (message: string) => void }) => {
  const [image, setImage] = React.useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (image) {
      // Placeholder - replace with actual API call
      const analysisResult = "Image analysis placeholder: " + image.name;
      onAnalysis(analysisResult);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button type="submit">Analyze Image</button>
    </form>
  );
};