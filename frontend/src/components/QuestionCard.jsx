import { useEffect, useState } from "react";
import API from "./../api";
import Confetti from "react-confetti";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";

const QuestionCard = () => {
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shownHints, setShownHints] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [streak, setStreak] = useState(
    parseInt(localStorage.getItem("streak")) || 0
  );
  const [hasAnsweredToday, setHasAnsweredToday] = useState(
    localStorage.getItem("hasAnsweredToday") === "true"
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [streakPulse, setStreakPulse] = useState(false);


useEffect(() => {
  API.get("/question/today")
  .then((res) => {
    // console.log("API Response:", res.data);
    setQuestion(res.data);
  })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const lastPlayed = localStorage.getItem("lastPlayedDate");
    const today = new Date().toLocaleDateString();

    if (lastPlayed !== today) {
      localStorage.setItem("lastPlayedDate", today);
      localStorage.setItem("hasAnsweredToday", "false");
      setHasAnsweredToday(false);
    }
  }, []);

  const handleShowHint = (index) => {
    if (!shownHints.includes(index)) {
      setShownHints((prev) => [...prev, index]);
    }
  };

  const checkAnswer = () => {
    if (userAnswer.trim().toLowerCase() === question.answer.toLowerCase()) {
      setIsCorrect(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);

      if (!hasAnsweredToday) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        setStreakPulse(true);
        setTimeout(() => setStreakPulse(false), 600); // reset animation
        localStorage.setItem("streak", newStreak);
        localStorage.setItem("hasAnsweredToday", "true");
        setHasAnsweredToday(true);
      }
    } else {
      setIsCorrect(false);
    }
  };

  if (!question) return <p style={{ color: "#000" }}>Loading the question...</p>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#111211ff", 
        p: 2,
      
      }}
    >
      {showConfetti && <Confetti />}
      <Card
        sx={{
          maxWidth: 600,
          borderRadius: "20px",
          bgcolor: "#1e1e2f",
          color: "#e0e0e0",
          boxShadow: "0 0 20px rgba(180, 0, 255, 0.8), 0 0 40px rgba(180, 0, 255, 0.6)",
          p: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              color: "#ff00ff",
              fontWeight: "bold",
              textAlign: "center",
              textShadow: "0px 0px 8px #ff00ff",
            }}
          >
            Sidzzle
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
            {question.question}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ mb: 1, color: "#0ff", fontWeight: "bold" }}
          >
            Hints:
          </Typography>
          {question.hints.map((hint, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              {shownHints.includes(idx) ? (
                <Typography sx={{ color: "#0ff" }}>{hint}</Typography>
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#0ff",
                    color: "#0ff",
                    "&:hover": {
                      backgroundColor: "rgba(0,255,255,0.1)",
                      boxShadow: "0px 0px 10px #0ff",
                    },
                  }}
                  onClick={() => handleShowHint(idx)}
                >
                  Show Hint {idx + 1}
                </Button>
              )}
            </Box>
          ))}

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Your Answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            sx={{
              input: { color: "#fff" },
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff00ff" },
                "&:hover fieldset": { borderColor: "#ff00ff" },
                "&.Mui-focused fieldset": { borderColor: "#ff00ff" },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              bgcolor: "#ff00ff",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#d600d6",
                boxShadow: "0px 0px 15px #ff00ff",
              },
            }}
            onClick={checkAnswer}
          >
            Submit
          </Button>

          {isCorrect === true && (
            <Typography sx={{ color: "lime", fontWeight: "bold" }}>
              ✅ Correct!
            </Typography>
          )}
          {isCorrect === false && (
            <Typography sx={{ color: "red", fontWeight: "bold" }}>
              ❌ Wrong! Try Again.
            </Typography>
          )}

          {showAnswer ? (
            <>
              <Typography sx={{ mt: 2, color: "#0ff" }}>
                Answer: {question.answer}
              </Typography>
              <Typography>
                Related:{" "}
                <a
                  href={question.relatedArticle.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#ffcc00" }}
                >
                  {question.relatedArticle.title}
                </a>
              </Typography>
            </>
          ) : (
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mt: 2,
                borderColor: "#ffcc00",
                color: "#ffcc00",
                "&:hover": {
                  backgroundColor: "rgba(255,204,0,0.1)",
                  boxShadow: "0px 0px 10px #ffcc00",
                },
              }}
              onClick={() => setShowAnswer(true)}
            >
              Show Answer
            </Button>
          )}

          {/* Streak with pulse animation */}
          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              fontSize: "20px",
              color: "#ffcc00",
              
              fontWeight: "bold",
              textShadow: "0px 0px 10px #ffcc00",
              transform: streakPulse ? "scale(1.2)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            Current Streak: {streak} 🔥
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuestionCard;
