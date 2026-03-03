import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Prompt windows
import ProjectRiskReport from "./projectRiskReport";
import ValidationReport from "./validationReport";
import ResourceRiskPrompt from "./resourceRisk";
import MilestonePrompt from "./milestone";
import TaskEvaluation from "./taskEvaluation";

// UI
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  TextField,
  IconButton,
  Tooltip
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { ThreeDots } from "react-loader-spinner";

//Markdown
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from "remark-breaks";

export default function Chatbot() {
  const { projectId } = useParams();
  const [socket, setSocket] = useState(null);
  // Start with no messages; we’ll add the greeting after history is loaded if it’s empty
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [promptKey, setPromptKey] = useState("");
  const messagesEndRef = useRef(null);


  const normalizeHistory = (history) => {
    if (!Array.isArray(history)) return [];

    // Case 1: Role/Content pairs (e.g., chat format)
    const hasRoleFormat = history.every(
      (item) =>
        typeof item === "object" &&
        item &&
        typeof item.role === "string" &&
        typeof item.content === "string"
    );
    if (hasRoleFormat) {
      return history.map((item) => ({
        from: item.role === "user" ? "user" : "response",
        text: item.content,
      }));
    }

    // Case 2: Q/A objects
    const hasQAFormat = history.every(
      (item) =>
        typeof item === "object" &&
        item &&
        "question" in item &&
        "answer" in item
    );
    if (hasQAFormat) {
      const flattened = [];
      history.forEach((pair) => {
        if (pair.question) {
          flattened.push({ from: "user", text: String(pair.question) });
        }
        if (pair.answer) {
          flattened.push({ from: "response", text: String(pair.answer) });
        }
      });
      return flattened;
    }

    // Fallback: ignore unknown shapes
    return [];
  };

  const ensureGreetingIfEmpty = () => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [{ from: "response", text: "How can I assist you with this Project?" }];
      }
      return prev;
    });
  };

  // --- WebSocket lifecycle ---
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/projects/${projectId}/chat`);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      // Ask server to send history as soon as we connect
      ws.send(JSON.stringify({ command: "get_history" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // If your backend sends an "event" discriminator, we handle it first.
      if (data.event) {
        switch (data.event) {
          case "history_loaded": {
            const normalized = normalizeHistory(data.history);
            setMessages(normalized);
            setHistoryLoaded(true);

            // If no history → show greeting
            if (!normalized || normalized.length === 0) {
              ensureGreetingIfEmpty();
            }
            setLoadingResponse(false);
            return;
          }
          case "history_cleared": {
            // History cleared → show greeting
            setMessages([{ from: "response", text: "How can I assist you with this Project?" }]);
            setHistoryLoaded(true);
            setLoadingResponse(false);
            return;
          }
          case "message": {
            // Server message payload with answer
            if (data.answer) {
              setMessages((prev) => [...prev, { from: "response", text: data.answer }]);
              setLoadingResponse(false);
            }
            return;
          }
          default:
            // Unknown event type; fall through to generic handling if any fields match
            break;
        }
      }

      // Backward compatibility: if server doesn't set "event"
      if (data.answer) {
        setMessages((prev) => [...prev, { from: "response", text: data.answer }]);
        setLoadingResponse(false);
      } else if (data.error) {
        setMessages((prev) => [...prev, { from: "error", text: data.error }]);
        setLoadingResponse(false);
      } else if (Array.isArray(data.history)) {
        // If server sends history without event wrapper
        const normalized = normalizeHistory(data.history);
        setMessages(normalized);
        setHistoryLoaded(true);
        if (!normalized || normalized.length === 0) {
          ensureGreetingIfEmpty();
        }
        setLoadingResponse(false);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const safeSend = (payload) => {
    console.log(payload)
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    } else {
      console.warn("WebSocket is not open; cannot send", payload);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const message = { question: inputValue };
    safeSend(message);
    setMessages((prev) => [...prev, { from: "user", text: inputValue }]);
    setInputValue("");
    setLoadingResponse(true);
  };

  const handlePromptKeyChange = (promptKey) => {
    setPromptKey(promptKey);
  }


  const handlePromptSubmit = async (text, prompt_key) => {
    if (!text || text.trim() === "") return;
    const message = { prompt_key: prompt_key, question: text };
    safeSend(message);
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInputValue("");
    setLoadingResponse(true);
    setPromptKey("")
  };

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: 'white',
        height: 'calc(100dvh - 179px)',
        maxWidth: 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        mt: 1
      }}
    >

      <Box
        sx={{
          position: 'relative',
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
        }}
      >
        {messages.map((message, index) => {
          const isUser = message.from === "user";
          // Convert literal "\n" into real newlines
          const textWithNewlines = (message.text ?? "").replace(/\\n/g, "\n");

          return (
            <Box
              key={message.id ?? index}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                }}
              >
                {isUser ? (
                  <Typography
                    component="div"
                    sx={{
                      p: 2,
                      mr: isUser ? 2 : 0,
                      ml: isUser ? 0 : 2,
                      mb: isUser ? 2 : 4,
                      borderRadius: 3,
                      bgcolor: isUser ? "primary.main" : "grey.100",
                      color: isUser ? "primary.contrastText" : "text.primary",
                      maxWidth: 600,
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap", // preserves real newlines
                    }}
                    variant="body2"
                  >
                    {textWithNewlines}
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      mr: isUser ? 2 : 0,
                      ml: isUser ? 0 : 2,
                      mb: isUser ? 2 : 4,
                      borderRadius: 3,
                      bgcolor: isUser ? "primary.main" : "grey.100",
                      color: isUser ? "primary.contrastText" : "text.primary",
                      maxWidth: 600,
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        p: ({ node, ...props }) => (
                          <Typography variant="body2" component="p" {...props} />
                        ),
                        code: ({ inline, children, ...props }) => (
                          <code
                            style={{
                              background: inline ? "rgba(0,0,0,0.06)" : "transparent",
                              padding: inline ? "0.2em 0.4em" : 0,
                              borderRadius: 4,
                            }}
                            {...props}
                          >
                            {children}
                          </code>
                        ),
                        pre: ({ node, ...props }) => (
                          <Box
                            component="pre"
                            sx={{
                              overflowX: "auto",
                              p: 1.5,
                              bgcolor: "grey.200",
                              borderRadius: 2,
                            }}
                            {...props}
                          />
                        ),
                        a: ({ node, ...props }) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" />
                        ),
                        li: ({ node, ...props }) => (
                          <li style={{ marginLeft: 16 }} {...props} />
                        ),
                      }}
                    >
                      {textWithNewlines}
                    </ReactMarkdown>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}

        {loadingResponse && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Box
              sx={{
                p: 3,
                ml: 3,
                mb: 4,
                borderRadius: 3,
                bgcolor: 'grey.100',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ThreeDots color="#2e2e38" height={48} width={48} />
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Quick Actions */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, mt: 1, flexWrap: 'wrap' }}>
        <ProjectRiskReport onSubmit={handlePromptSubmit} />
        <ValidationReport onSubmit={handlePromptSubmit} />
        <TaskEvaluation onSubmit={handlePromptSubmit} />
        <ResourceRiskPrompt onSubmit={handlePromptSubmit} />
        <MilestonePrompt onSubmit={handlePromptSubmit} />
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          multiline
          size="small"
          placeholder="Type here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          sx={{
            maxHeight: 100,
            overflowY: 'auto',
            bgcolor: 'background.paper',
            '& .MuiInputBase-root': { alignItems: 'flex-start' },
          }}
        />
        <Button
          variant="contained"
          size="small"
          sx={{ ml: 1, py: 1, backgroundColor: "#2e2e38", fontWeight: 'bold' }}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Box>
  );

}