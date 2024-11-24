import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import spinner from "./assets/spinner.svg";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

function App() {
  const handleInput = (e) => setTopic(e.target.value);

  const preprocessMarkdown = (markdown) => {
    return markdown
      .replace(/Title:/g, "### Title:")
      .replace(/Introduction:/g, "### Introduction:")
      .replace(/Market Overview and Potential:/g, "### Market Overview and Potential:")
      .replace(/Key Opportunities and Challenges:/g, "### Key Opportunities and Challenges:");
  };

  const [topic, setTopic] = useState("");
  const [agentResponse, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const AgentResponse = () => {
    setLoading(true);

    setTimeout(() => {
      axios
        .post("http://localhost:5000/api/analyze", { userTopic: topic })
        .then((response) => {
          console.log(response.data);
          if(response.data['status']==="error"){
            setLoading(false)
            {
              return(<h2>{response.data['message']}</h2>)
            }
          }
          const processedMarkdown = preprocessMarkdown(response.data["analysis"]);
          setResponse(processedMarkdown);
          setLoading(false);
        });
    }, 1000);
  };

  return (
    <div className="bg-zinc-600 flex flex-col items-center overflow-auto" style={{ height: "100vh" }}>
      <h2 className="text-gray-800 text-2xl mt-20">Welcome to Business Blog Generator</h2>
      <div className="relative w-full max-w-3xl mt-5">
        <input
          type="text"
          placeholder="Enter your topic of interest"
          className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleInput}
          value={topic}
        />
        <button
          onClick={AgentResponse}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Submit
        </button>
      </div>
      {loading ? (
        <img src={spinner} alt="loading" className="mt-10 justify-center items-center bg-slate-600" />
      ) : (
        <div
          className="w-full max-w-3xl mt-10 mb-20 p-4 text-white rounded-lg text-justify text-lg markdown-container"
          style={{ maxHeight: "80vh" }}
        >
          <ReactMarkdown
            children={agentResponse}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          />
        </div>
      )}
    </div>
  );
}

export default App;
