import React, { useEffect, useState } from "react";
import axios from "axios";

function Connect() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ question: "" });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [answers, setAnswers] = useState({});
  const [answerForm, setAnswerForm] = useState({});

  // Fetch all questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/connect");
        setQuestions(res.data);

        // Fetch answers for each question
        const newAnswers = {};
        for (const q of res.data) {
          const ansRes = await axios.get(
            `http://localhost:5000/api/answers/${q._id}`
          );
          newAnswers[q._id] = ansRes.data;
        }
        setAnswers(newAnswers);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        alert("Failed to load questions");
      }
    };
    fetchQuestions();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAnswerChange = (questionId, text) => {
    setAnswerForm({ ...answerForm, [questionId]: text });
  };

  // Submit question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/connect", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuestions([res.data, ...questions]);
      setForm({ question: "" });
      alert("Question posted!");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  // Submit answer
  const handleAnswerSubmit = async (questionId) => {
    if (!answerForm[questionId]) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/answers/${questionId}`,
        { text: answerForm[questionId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnswers({
        ...answers,
        [questionId]: [res.data, ...(answers[questionId] || [])],
      });

      setAnswerForm({ ...answerForm, [questionId]: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to post answer");
    }
  };

  // ✅ FIXED: Filter logic must return a value
  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-200 via-white to-blue-200 overflow-hidden flex justify-center py-10 px-4">
      {/* Floating gradient shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute -top-20 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>

      {/* Content card */}
      <div className="relative z-10 w-full max-w-3xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-8">
          Connect with Seniors 💬
        </h1>

        {/* Post a question */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <textarea
            name="question"
            placeholder="Ask your question here..."
            value={form.question}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition resize-none"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-[1.01] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Posting..." : "➕ Post Question"}
          </button>
        </form>

        {/* 🔍 Search Bar */}
        <input
          type="text"
          placeholder="Search Questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* List of questions */}
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Recent Questions
        </h2>
        {filteredQuestions.length === 0 ? (
          <p className="text-gray-600 text-center">
            No questions match your search.
          </p>
        ) : (
          <ul className="space-y-6">
            {filteredQuestions.map((q) => (
              <li
                key={q._id}
                className="p-5 border border-gray-200 rounded-xl shadow-sm bg-gray-50 hover:shadow-md transition"
              >
                <p className="text-lg text-gray-900 font-medium">
                  {q.question}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Posted by{" "}
                  <span className="font-semibold">
                    {q.userName || "Anonymous"}
                  </span>
                </p>

                {/* Existing answers */}
                <div className="mt-4 space-y-2 max-h-32 overflow-y-auto pr-2">
                  {answers[q._id]?.length > 0 ? (
                    answers[q._id].map((a) => (
                      <div
                        key={a._id}
                        className="p-2 rounded-md bg-green-50 border border-green-100"
                      >
                        <p className="text-sm text-green-800">
                          <strong>{a.userName}:</strong> {a.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      No answers yet.
                    </p>
                  )}
                </div>

                {/* Answer input */}
                <div className="mt-4 flex gap-3">
                  <input
                    type="text"
                    placeholder="Write your answer..."
                    value={answerForm[q._id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(q._id, e.target.value)
                    }
                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                  />
                  <button
                    onClick={() => handleAnswerSubmit(q._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl font-semibold shadow-md transition transform hover:scale-105"
                  >
                    Reply
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Connect;
