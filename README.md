# H(Ai)CK.py ReadME

## Problem Statement
Vaishnavi, a bright and fun-loving student, excels in Law and Business studies but faces a crisis when her exams are rescheduled, leaving her only three days to prepare notes for seven subjects. She requires a tool that can:

- Process large volumes of textbook content.
- Generate precise answers to her queries.
- Be efficient and cost-effective, overcoming limitations of free GPT tools.

This project is designed to solve Vaishnavi's problem by building a question-answering machine powered by LLMs.

---

## Solution Overview
This solution integrates:

1. **HuggingFace Models:** For selecting lightweight and efficient LLMs, in this case, Llama 2.
2. **Fine-Tuned LLM:** Optimized for high precision using the Retrieval-Augmented Generation (RAG) method.
3. **FastAPI:** For building a backend API.
4. **Socket.IO:** For real-time communication between the frontend and backend.
5. **Next.js:** For creating an intuitive and responsive user interface.

---

## Features
- **Interactive Question-Answering:** Users can ask questions and get precise answers in real-time.
- **Persistent Storage:** Indexing and embedding using HuggingFace for efficient retrieval.
- **Streamlined Workflow:** Optimized for students with a time crunch.
- **Future Usability:** Designed for scalability and adaptability to other subjects and scenarios.

---

## Tech Stack

### LLM Side
- **Libraries:**
  - Llama Index
  - HuggingFace
- **Key Components:**
  - Embedding: HuggingFace's BAAI/bge-base-en-v1.5
  - LLM: Llama 2 with RAG method
- **Persistent Storage:** Embedded documents stored locally for efficient query handling.

### Backend
- **Framework:** FastAPI
- **Real-Time Communication:** Socket.IO

### Frontend
- **Framework:** Next.js
- **Features:** Responsive chat interface, real-time updates, user-friendly message display.

---

## Code Overview

### LLM Implementation (`llm.py`)
- Loads documents, processes embeddings, and initializes the LLM with fine-tuned settings.
- Handles user queries with streaming responses.

### Server (`server.js`)
- Sets up the backend using FastAPI.
- Establishes a Socket.IO server for real-time communication.

### Frontend (`page.js`)
- Implements the chat interface with message handling, scroll synchronization, and Socket.IO integration.

---/confirmed till here

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/nirmal15mathew/llm_hackathon
   cd llm_hackathon
   ```
2. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```
3. Install dependencies for the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
5. Start the frontend server:
   ```bash
   npm run dev
   ```

---

## Usage
1. Upload textbooks to the `data/` directory.
2. Start the backend and frontend servers.
3. Access the frontend at `http://localhost:3000`.
4. Use the chat interface to ask questions and receive answers in real-time.

---

## Challenges and Considerations
- **Google Colab Limitations:** GPU and RAM constraints.
- **Model Access:** Some HuggingFace models require approval for access.
- **Fine-Tuning Time:** Balancing precision with computational efficiency.

---

## Future Enhancements
- Expand support for additional subjects and languages.
- Integrate cloud-based storage for scalable document handling.
- Add advanced analytics for tracking study progress.

---

## Acknowledgments
This project was developed as part of a hackathon challenge to assist students under time constraints. Special thanks to the open-source community and frameworks that made this project possible.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
