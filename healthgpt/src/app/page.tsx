"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // optional, you can replace with a simple <button>
import { useUser } from "@clerk/nextjs";
import "./HomePage.css"; // ensure this CSS file is in the same folder
import { Bot, Stethoscope } from "lucide-react";

export default function HomePage() {
  const { user, isLoaded } = useUser();

  return (
    <main className="main-container ">
      <div className="card-container ">
        {/* Left Panel */}
        <div className="card-left">
          <div className="brand flex justify-center items-center my-4">
            <Stethoscope className="text-purple-500 text-2xl" />
            <span className="title flex justify-center items-center text-[30px] my-4">
              HealthGPT{" "}
            </span>
          </div>
          <div className="flex justify-center items-center my-4">
            <Bot size={50} />
          </div>

          <p className="description">
            Your AI health companion. Simple explanations for your reports and
            symptoms.
          </p>
        </div>

        {/* Right Panel */}
        <div className="card-right">
          <div className="right-header ">
            <p className="subheading text-[40x]">Get Started</p>
            <h3 className="heading text-[40x]">What do you want to do?</h3>
          </div>
          <div className="button-group">
            <Link href="/report" className="button-link">
              <button className="primary-btn">Upload</button>
            </Link>
            <Link href="/chat" className="button-link">
              <button className="secondary-btn">Chat</button>
            </Link>
          </div>
          {/* <div className="footer-note">Trusted. Simple. Secure.</div> */}
        </div>
      </div>
    </main>
  );
}
